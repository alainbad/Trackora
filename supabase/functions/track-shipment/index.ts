// Supabase Edge Function — multi-source shipment tracking proxy
// Route 0: Direct carrier APIs — FedEx · DHL · UPS · USPS · Aramex
// Route 1: Shipsgo (ocean containers)
// Route 2: 17track (containers + MAWBs)
// Route 3: AfterShip (everything else / MAWB known prefixes)
// Route 4: 17track fallback (express with 0 AfterShip events)
// Note: Maersk & Hapag-Lloyd direct APIs are party-restricted (only own shipments).
//       Container numbers for all ocean carriers are handled via Shipsgo + 17track.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── Existing APIs ──────────────────────────────────────────────────────────────
const AFTERSHIP_KEY        = Deno.env.get('AFTERSHIP_API_KEY')!
const TRACK17_KEY          = Deno.env.get('TRACK17_API_KEY') || ''
const SHIPSGO_KEY          = Deno.env.get('SHIPSGO_API_KEY') || ''
const SUPABASE_URL         = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// ── Direct carrier API credentials ────────────────────────────────────────────
const FEDEX_CLIENT_ID     = Deno.env.get('FEDEX_CLIENT_ID')      || ''
const FEDEX_CLIENT_SECRET = Deno.env.get('FEDEX_CLIENT_SECRET')  || ''
const DHL_API_KEY         = Deno.env.get('DHL_API_KEY')          || ''  // developer.dhl.com
const UPS_CLIENT_ID       = Deno.env.get('UPS_CLIENT_ID')        || ''
const UPS_CLIENT_SECRET   = Deno.env.get('UPS_CLIENT_SECRET')    || ''
const USPS_CLIENT_ID      = Deno.env.get('USPS_CLIENT_ID')       || ''  // api.usps.com
const USPS_CLIENT_SECRET  = Deno.env.get('USPS_CLIENT_SECRET')   || ''
const ARAMEX_USERNAME     = Deno.env.get('ARAMEX_USERNAME')      || ''
const ARAMEX_PASSWORD     = Deno.env.get('ARAMEX_PASSWORD')      || ''
const ARAMEX_ACCOUNT_NUM  = Deno.env.get('ARAMEX_ACCOUNT_NUMBER')|| ''
const ARAMEX_ACCOUNT_PIN  = Deno.env.get('ARAMEX_ACCOUNT_PIN')   || ''
const ARAMEX_ENTITY       = Deno.env.get('ARAMEX_ENTITY')        || ''
const ARAMEX_COUNTRY      = Deno.env.get('ARAMEX_COUNTRY_CODE')  || ''

const BASE_AS = 'https://api.aftership.com/tracking/2024-04'
const BASE_17 = 'https://api.17track.net/track/v2.2'
const BASE_SG = 'https://api.shipsgo.com/v2'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ── OAuth token cache (module-level — reused across requests in same isolate) ─
let fedexToken: { v: string; exp: number } | null = null
let upsToken:   { v: string; exp: number } | null = null
let uspsToken:  { v: string; exp: number } | null = null

// ── AfterShip tag → Trackora status ──────────────────────────────────────────
const AFTERSHIP_TAG_MAP: Record<string, string> = {
  Pending:             'picked_up',
  InfoReceived:        'picked_up',
  InTransit:           'in_transit',
  OutForDelivery:      'out_for_delivery',
  AttemptFail:         'delayed',
  Delivered:           'delivered',
  Exception:           'delayed',
  AvailableForPickup:  'out_for_delivery',
  Expired:             'delayed',
}

// ── 17track status tag → Trackora status ─────────────────────────────────────
const TRACK17_TAG_MAP: Record<string, string> = {
  NotFound:        'picked_up',
  Pending:         'picked_up',
  InfoReceived:    'picked_up',
  Pickup:          'picked_up',
  InTransit:       'in_transit',
  OutForDelivery:  'out_for_delivery',
  DeliveryFailure: 'delayed',
  Delivered:       'delivered',
  Expired:         'delayed',
  Exception:       'delayed',
  Returning:       'in_transit',
  Returned:        'delivered',
  CustomsHold:     'customs',
  LoadedOnVessel:  'in_transit',
  Discharged:      'in_transit',
  GateOut:         'out_for_delivery',
}

// ── 17track carrier type codes ────────────────────────────────────────────────
const CARRIER_TYPE_MAP: Record<number, string> = {
  1: 'express',
  2: 'express',
  3: 'sea',
  4: 'air',
  5: 'land',
}

// ── ISO3 → ISO2 normalisation ─────────────────────────────────────────────────
const ISO3_TO_2: Record<string, string> = {
  USA:'US', GBR:'GB', DEU:'DE', CHN:'CN', JPN:'JP', AUS:'AU', FRA:'FR',
  ARE:'AE', SGP:'SG', IND:'IN', BRA:'BR', CAN:'CA', NLD:'NL', BEL:'BE',
  ITA:'IT', ESP:'ES', KOR:'KR', HKG:'HK', TWN:'TW', MYS:'MY', THA:'TH',
  SAU:'SA', ZAF:'ZA', MEX:'MX', NGA:'NG', EGY:'EG', TUR:'TR', POL:'PL',
  SWE:'SE', NOR:'NO', RUS:'RU', PAK:'PK', QAT:'QA', KWT:'KW', OMN:'OM',
  ISR:'IL', NZL:'NZ', CHL:'CL', COL:'CO', ARG:'AR', PHL:'PH', VNM:'VN',
  IDN:'ID', BGD:'BD', BHR:'BH', JOR:'JO',
}

function toISO2(code?: string): string {
  if (!code) return ''
  return ISO3_TO_2[code] ?? code
}

// ── ISO2 → country name ───────────────────────────────────────────────────────
const COUNTRY_NAME: Record<string, string> = {
  US:'United States', GB:'United Kingdom', DE:'Germany',      CN:'China',
  JP:'Japan',         AU:'Australia',      FR:'France',       AE:'UAE',
  SG:'Singapore',     IN:'India',          BR:'Brazil',       CA:'Canada',
  NL:'Netherlands',   BE:'Belgium',        IT:'Italy',        ES:'Spain',
  KR:'South Korea',   HK:'Hong Kong',      TW:'Taiwan',       MY:'Malaysia',
  TH:'Thailand',      SA:'Saudi Arabia',   ZA:'South Africa', MX:'Mexico',
  NG:'Nigeria',       EG:'Egypt',          TR:'Turkey',       PL:'Poland',
  SE:'Sweden',        NO:'Norway',         RU:'Russia',       PK:'Pakistan',
  QA:'Qatar',         KW:'Kuwait',         OM:'Oman',         IL:'Israel',
  NZ:'New Zealand',   CL:'Chile',          CO:'Colombia',     AR:'Argentina',
}

// ── Country ISO2 → [lat, lng] centroid ───────────────────────────────────────
const GEO: Record<string, [number, number]> = {
  US: [37.09,-95.71],  GB: [51.51,-0.13],   DE: [51.17,10.45],
  CN: [35.86,104.20],  JP: [36.20,138.25],  AU: [-25.27,133.78],
  FR: [46.23,2.21],    AE: [23.42,53.85],   SG: [1.35,103.82],
  IN: [20.59,78.96],   BR: [-14.24,-51.93], CA: [56.13,-106.35],
  NL: [52.13,5.29],    BE: [50.50,4.47],    IT: [41.87,12.57],
  ES: [40.46,-3.75],   KR: [35.91,127.77],  HK: [22.32,114.17],
  TW: [23.70,120.96],  MY: [4.21,101.98],   TH: [15.87,100.99],
  SA: [23.89,45.08],   ZA: [-30.56,22.94],  MX: [23.63,-102.55],
  NG: [9.08,8.68],     EG: [26.82,30.80],   TR: [38.96,35.24],
  PL: [51.92,19.15],   SE: [60.13,18.64],   NO: [60.47,8.47],
  RU: [61.52,105.32],  PK: [30.38,69.34],   BD: [23.68,90.35],
  VN: [14.06,108.27],  PH: [12.88,121.77],  ID: [-0.79,113.92],
  QA: [25.35,51.18],   KW: [29.31,47.48],   BH: [26.07,50.56],
  OM: [21.51,55.92],   JO: [31.24,36.51],   NZ: [-40.90,174.89],
  CL: [-35.68,-71.54], CO: [4.57,-74.30],   IL: [31.05,34.85],
}

function coord(iso2?: string): [number, number] {
  return iso2 ? (GEO[iso2] ?? [0, 0]) : [0, 0]
}

// ── Major port UN/LOCODE → [lat, lng] ─────────────────────────────────────────
const PORT_GEO: Record<string, [number, number]> = {
  CNSHA: [31.23,121.47],  CNNGB: [29.87,121.54],  CNSZX: [22.55,114.05],
  CNYTN: [22.56,114.27],  CNTAO: [36.09,120.30],  CNTSN: [38.98,117.79],
  CNCAN: [23.11,113.25],  CNXMN: [24.45,118.07],  CNDLC: [38.92,121.63],
  SGSIN: [1.26,103.82],   HKHKG: [22.30,114.18],  KRPUS: [35.10,129.04],
  JPTYO: [35.61,139.77],  JPYOK: [35.45,139.66],  JPNGO: [35.05,136.88],
  JPKOB: [34.68,135.20],  TWKHH: [22.55,120.30],  TWTPE: [25.13,121.74],
  MYTPP: [1.36,103.55],   MYPKG: [3.00,101.39],   THLCH: [13.08,100.88],
  THBKK: [13.10,100.58],  VNSGN: [10.76,106.70],  VNHPH: [20.86,106.69],
  IDJKT: [-6.10,106.88],  PHMNL: [14.58,120.96],  LKCMB: [6.95,79.84],
  INNSA: [18.95,72.95],   INMUN: [22.74,69.70],   INMAA: [13.08,80.29],
  INCCU: [22.55,88.31],   BDCGP: [22.31,91.80],   PKKHI: [24.84,66.99],
  AEJEA: [25.01,55.06],   AEDXB: [25.27,55.30],   AEAUH: [24.51,54.38],
  SAJED: [21.48,39.18],   SADMM: [26.50,50.20],   QADOH: [25.28,51.53],
  OMSLL: [17.02,54.09],   KWKWI: [29.36,47.93],   EGPSD: [31.25,32.30],
  EGSUZ: [29.97,32.55],   EGALY: [31.18,29.87],   TRMER: [36.80,34.63],
  TRIST: [40.96,28.69],   TRIZM: [38.43,27.14],   GRPIR: [37.94,23.64],
  ITGOA: [44.40,8.90],    ITSPE: [44.10,9.83],    ITGIT: [40.93,14.20],
  ESVLC: [39.44,-0.32],   ESALG: [36.13,-5.44],   ESBCN: [41.35,2.16],
  FRLEH: [49.48,0.12],    FRFOS: [43.43,4.94],    FRMRS: [43.30,5.37],
  NLRTM: [51.95,4.14],    BEANR: [51.23,4.42],    BEZEE: [51.33,3.20],
  DEHAM: [53.55,9.93],    DEBRV: [53.58,8.58],    GBFXT: [51.95,1.31],
  GBLGP: [51.51,0.43],    GBSOU: [50.90,-1.40],   GBLIV: [53.45,-3.02],
  PTLEI: [38.93,-9.25],   IEORK: [51.84,-8.30],   PLGDN: [54.40,18.67],
  SEGOT: [57.69,11.86],   NOOSL: [59.90,10.75],   DKAAR: [56.15,10.22],
  RULED: [59.91,30.23],   USNYC: [40.69,-74.04],  USLAX: [33.74,-118.27],
  USLGB: [33.75,-118.21], USSAV: [32.13,-81.14],  USHOU: [29.73,-95.27],
  USSEA: [47.60,-122.34], USOAK: [37.80,-122.33], USORF: [36.92,-76.33],
  USCHS: [32.78,-79.92],  USMIA: [25.77,-80.17],  USBAL: [39.26,-76.55],
  CAVAN: [49.29,-123.11], CAMTR: [45.55,-73.54],  CAHAL: [44.65,-63.57],
  MXZLO: [19.05,-104.31], MXVER: [19.20,-96.14],  PACTB: [9.36,-79.90],
  PABLB: [9.96,-79.57],   BRSSZ: [-23.96,-46.30], BRRIG: [-32.04,-52.10],
  BRPNG: [-25.50,-48.52], ARBUE: [-34.61,-58.37], CLVAP: [-33.04,-71.63],
  COCTG: [10.40,-75.51],  PECLL: [-12.05,-77.14], ZADUR: [-29.87,31.03],
  ZACPT: [-33.92,18.42],  NGLOS: [6.45,3.38],      AUSYD: [-33.86,151.21],
  AUMEL: [-37.84,144.92], AUBNE: [-27.38,153.17],  AUFRE: [-32.05,115.74],
  NZAKL: [-36.84,174.77],
}

function portCoord(locode?: string, countryISO2?: string): [number, number] {
  if (locode && PORT_GEO[locode]) return PORT_GEO[locode]
  if (locode && locode.length >= 2) {
    const c = coord(locode.slice(0, 2))
    if (c[0] !== 0 || c[1] !== 0) return c
  }
  return coord(countryISO2)
}

// ── Shipsgo top-level status → Trackora status ────────────────────────────────
const SHIPSGO_STATUS_MAP: Record<string, string> = {
  NEW:        'picked_up',
  INPROGRESS: 'picked_up',
  BOOKED:     'picked_up',
  LOADED:     'in_transit',
  SAILING:    'in_transit',
  ARRIVED:    'out_for_delivery',
  DISCHARGED: 'delivered',
  UNTRACKED:  'in_transit',
}

// ── Shipsgo movement event code → human label ─────────────────────────────────
const SHIPSGO_EVENT_LABEL: Record<string, string> = {
  EMSH: 'Empty container released to shipper',
  GTIN: 'Gate in at origin port',
  LOAD: 'Loaded on vessel',
  DEPA: 'Vessel departed',
  ARRV: 'Vessel arrived',
  DISC: 'Discharged from vessel',
  GTOT: 'Gate out at destination',
  EMRT: 'Empty container returned',
  TSL:  'Transshipment loaded',
  TSD:  'Transshipment discharged',
}

// ── Resolve country string → ISO2 ────────────────────────────────────────────
function resolveISO2(raw?: string): string {
  if (!raw) return ''
  const trimmed = raw.trim()
  if (/^[A-Z]{2}$/.test(trimmed)) return trimmed
  if (ISO3_TO_2[trimmed]) return ISO3_TO_2[trimmed]
  const entry = Object.entries(COUNTRY_NAME).find(
    ([, name]) => name.toLowerCase() === trimmed.toLowerCase()
  )
  return entry ? entry[0] : ''
}

// ── AfterShip: freight type by carrier slug ───────────────────────────────────
const SEA_SLUGS  = new Set([
  'maersk','msc','cma-cgm','cosco','hapag-lloyd','evergreen-line','yang-ming',
  'one','ocean-network-express','evergreen','zim','pil','wan-hai',
  'sea-lead','turkon','arkas','grimaldi',
])
const AIR_SLUGS  = new Set([
  // Major cargo airlines already covered
  'lufthansa-cargo','emirates-skycargo','singapore-airlines-cargo','qatar-cargo',
  'cathay-pacific-cargo','air-france-cargo','turkish-cargo','iag-cargo',
  'korean-air-cargo','japan-airlines-cargo','fedex-freight','ups-freight',
  'dhl-global-forwarding','cargolux',
  // Airlines from MAWB prefix map not previously covered
  'american-airlines','american-airlines-cargo',
  'delta','delta-cargo',
  'air-canada','air-canada-cargo',
  'saudia','saudia-cargo',
  'ethiopian-airlines','ethiopian-cargo',
  'gulf-air',
  'klm-cargo','klm',
  'china-eastern','china-eastern-cargo',
  'air-new-zealand','air-new-zealand-cargo',
  'air-china','air-china-cargo',
  'swiss-worldcargo','swiss-cargo',
  'china-southern','china-southern-cargo',
  'asiana-cargo','asiana-airlines',
  'etihad-cargo','etihad-airways',
  'united-airlines','united-cargo',
  'british-airways-world-cargo','british-airways',
  'ana-cargo','ana',
  'qantas','qantas-freight',
  'finnair-cargo','finnair',
  'aeromexico-cargo','aeromexico',
  'avianca-cargo','avianca',
  'oman-air','oman-air-cargo',
  'royal-jordanian','royal-jordanian-cargo',
  'flydubai-cargo',
  'air-arabia-cargo',
  'tasman-cargo',
])
const LAND_SLUGS = new Set([
  'db-schenker','db-schenker-se','dbschenker-se','dbschenker',
  'db-schenker-de','db-schenker-nl','db-schenker-no','db-schenker-dk',
  'db-schenker-fi','db-schenker-pl','db-schenker-ch','db-schenker-at',
  'dsv','dsv-road','dsv-solutions',
  'xpo','xpo-logistics',
  'geodis',
  'ceva','ceva-logistics',
  'kuehne-nagel',
  'dhl-freight','dhl-supply-chain',
  'schenker',
  'toll','toll-global-express',
  'ntex','bring','postnord-logistics',
])

function freightTypeBySlug(slug: string): string {
  if (SEA_SLUGS.has(slug))  return 'sea'
  if (AIR_SLUGS.has(slug))  return 'air'
  if (LAND_SLUGS.has(slug)) return 'land'
  return 'express'
}

// ── IATA airline numeric prefix → AfterShip carrier slug ─────────────────────
const MAWB_PREFIX_MAP: Record<string, string> = {
  '001': 'american-airlines',
  '006': 'delta',
  '014': 'air-canada',
  '020': 'lufthansa-cargo',
  '057': 'air-france-cargo',
  '065': 'saudia',
  '071': 'ethiopian-airlines',
  '072': 'gulf-air',
  '074': 'klm-cargo',
  '075': 'china-eastern',
  '082': 'korean-air-cargo',
  '086': 'air-new-zealand',
  '117': 'sas-cargo',
  '125': 'british-airways-world-cargo',
  '131': 'japan-airlines-cargo',
  '157': 'qatar-cargo',
  '160': 'cathay-pacific-cargo',
  '172': 'cargolux',
  '176': 'emirates-skycargo',
  '180': 'korean-air-cargo',
  '205': 'japan-airlines-cargo',
  '218': 'air-china',
  '235': 'turkish-cargo',
  '279': 'cathay-pacific-cargo',
  '297': 'china-southern',
  '356': 'cargolux',
  '369': 'qatar-cargo',
  '406': 'fedex',
  '518': 'ups',
  '549': 'dhl-express',
  '607': 'etihad-cargo',
  '618': 'singapore-airlines-cargo',
  '724': 'swiss-worldcargo',
  '988': 'asiana-cargo',
}

const AFTERSHIP_MAWB_OK = new Set([
  '020','057','074','082','125','131','157','172','176','180',
  '205','235','279','369','406','518','549','607','618',
])

// ── Detect tracking number format ─────────────────────────────────────────────
function detectFormat(tn: string): 'container' | 'mawb' | 'express' {
  const clean = tn.replace(/\s/g, '').toUpperCase()
  if (/^[A-Z]{3}[UJZ]\d{7}$/.test(clean)) return 'container'
  if (/^\d{3}-\d{8}$/.test(tn.trim())) return 'mawb'
  return 'express'
}

function mawbCarrierSlug(tn: string): string | undefined {
  const match = tn.match(/^(\d{3})-/)
  return match ? MAWB_PREFIX_MAP[match[1]] : undefined
}

// ── Map AfterShip/carrier slugs to direct-carrier identifiers ────────────────
const SLUG_TO_DIRECT: Record<string, 'fedex' | 'ups' | 'dhl' | 'usps' | 'aramex'> = {
  'fedex':              'fedex',
  'fedex-uk':           'fedex',
  'fedex-smartpost':    'fedex',
  'ups':                'ups',
  'ups-mi':             'ups',
  'ups-surepost':       'ups',
  'ups-mail-innovations':'ups',
  'dhl':                'dhl',
  'dhl-express':        'dhl',
  'dhl-global-mail':    'dhl',
  'dhl-de':             'dhl',
  'dhl-packet-nl':      'dhl',
  'dhl-ecommerce':      'dhl',
  'dhl-ecommerce-asia': 'dhl',
  'usps':               'usps',
  'aramex':             'aramex',
}

// ── Detect which direct-carrier API to try by tracking number pattern ─────────
// UPS and USPS have highly distinctive formats; FedEx/DHL detection is opportunistic.
function detectDirectCarrier(
  tn: string,
  slug?: string,
): 'fedex' | 'ups' | 'dhl' | 'usps' | 'aramex' | null {
  // Explicit carrier slug takes priority
  if (slug && SLUG_TO_DIRECT[slug]) return SLUG_TO_DIRECT[slug]

  const clean = tn.replace(/[\s-]/g, '').toUpperCase()

  // UPS: 1Z + 16 alphanumeric — unmistakable
  if (/^1Z[A-Z0-9]{16}$/.test(clean)) return 'ups'

  // USPS: 22 digits starting with 9 (Intelligent Mail + GS1-128)
  if (/^9[2-5]\d{20}$/.test(clean) || /^\d{22}$/.test(clean)) return 'usps'
  // USPS international: two letters + 9 digits + US/GB/etc
  if (/^[A-Z]{2}\d{9}[A-Z]{2}$/.test(clean)) return 'usps'

  // FedEx: 12 digits (Express), 15 digits (SmartPost/Ground), 20 digits (door tag)
  // Exclude numbers starting with 9 (those are likely USPS)
  if (
    (/^\d{12}$/.test(clean) || /^\d{15}$/.test(clean) || /^\d{20}$/.test(clean)) &&
    !clean.startsWith('9')
  ) return 'fedex'

  // DHL Express: exactly 10 digits
  if (/^\d{10}$/.test(clean)) return 'dhl'

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECT CARRIER API IMPLEMENTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

// ── FedEx ─────────────────────────────────────────────────────────────────────
async function getFedexToken(): Promise<string | null> {
  if (!FEDEX_CLIENT_ID || !FEDEX_CLIENT_SECRET) return null
  const now = Date.now()
  if (fedexToken && fedexToken.exp > now + 60_000) return fedexToken.v
  try {
    const r = await fetch('https://apis.fedex.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${FEDEX_CLIENT_ID}&client_secret=${FEDEX_CLIENT_SECRET}`,
    })
    const j = await r.json()
    if (j.access_token) {
      fedexToken = { v: j.access_token, exp: now + (j.expires_in || 3600) * 1000 }
      return j.access_token
    }
  } catch { /* ignore */ }
  return null
}

const FEDEX_STATUS: Record<string, string> = {
  PU: 'picked_up', OC: 'picked_up', IP: 'picked_up',
  AR: 'in_transit', DP: 'in_transit', IT: 'in_transit', AF: 'in_transit', HP: 'in_transit',
  OD: 'out_for_delivery', HL: 'out_for_delivery',
  DL: 'delivered',
  DE: 'delayed', DY: 'delayed', CA: 'delayed', SE: 'delayed', RS: 'delayed',
  CH: 'customs', CC: 'customs',
}

async function fetchFedEx(tn: string): Promise<Record<string, unknown> | null> {
  const token = await getFedexToken()
  if (!token) return null
  try {
    const r = await fetch('https://apis.fedex.com/track/v1/trackingnumbers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-locale': 'en_US',
      },
      body: JSON.stringify({
        includeDetailedScans: true,
        trackingInfo: [{ trackingNumberInfo: { trackingNumber: tn } }],
      }),
    })
    if (!r.ok) return null
    const j = await r.json()
    const result = j?.output?.completeTrackResults?.[0]?.trackResults?.[0]
    if (!result || result.error) return null
    return result as Record<string, unknown>
  } catch { return null }
}

function normaliseFedEx(t: Record<string, unknown>, tn: string) {
  type Addr = Record<string, unknown>
  const statusDetail  = (t.latestStatusDetail as Addr) || {}
  const statusCode    = (statusDetail.code as string) || ''
  const status        = FEDEX_STATUS[statusCode] || 'in_transit'

  const shipperInfo   = (t.shipperInformation   as Addr) || {}
  const recipientInfo = (t.recipientInformation as Addr) || {}
  const origAddr      = (shipperInfo.address    as Addr) || {}
  const destAddr      = (recipientInfo.address  as Addr) || {}

  const originISO  = toISO2((origAddr.countryCode as string) || '')
  const destISO    = toISO2((destAddr.countryCode  as string) || '')
  const originCoord = coord(originISO)
  const destCoord   = coord(destISO)

  const scanEvents = (t.scanEvents as Addr[]) || []

  // Current location from latest scan
  const latestScan = scanEvents[0] || {}
  const latestLoc  = (latestScan.scanLocation as Addr) || {}
  const curISO     = toISO2((latestLoc.countryCode as string) || '')
  const curCoord: [number, number] = curISO
    ? coord(curISO)
    : [(originCoord[0] + destCoord[0]) / 2, (originCoord[1] + destCoord[1]) / 2]

  // Timeline: FedEx returns newest-first → reverse for oldest-top display
  const timeline = [...scanEvents].reverse().map(ev => {
    const loc    = (ev.scanLocation as Addr) || {}
    const city   = (loc.city as string) || ''
    const ctry   = (loc.countryCode as string) || ''
    return {
      status:    (ev.eventDescription as string) || (ev.eventType as string) || 'Update',
      location:  [city, ctry].filter(Boolean).join(', '),
      timestamp: (ev.date as string) || '',
      completed: true,
    }
  })

  // ETA
  const dateAndTimes = (t.dateAndTimes as Addr[]) || []
  const etaEntry = dateAndTimes.find(d =>
    (d.type as string) === 'ESTIMATED_DELIVERY' || (d.type as string) === 'ACTUAL_DELIVERY'
  )
  const etaRaw   = (etaEntry?.dateTime as string) || ''
  const eta      = etaRaw ? etaRaw.split('T')[0] : 'TBD'

  // Weight
  const pkgDetails = (t.packageDetails as Addr) || {}
  const wad        = (pkgDetails.weightAndDimensions as Addr) || {}
  const weights    = (wad.weight as Addr[]) || []
  const wkg        = weights.find(w => (w.unit as string) === 'KG') || weights[0]
  const weightKg   = wkg ? parseFloat(wkg.value as string) || 0 : 0

  const isDelay    = status === 'delayed'
  return {
    id: tn, trackingNumber: tn, carrier: 'FedEx', freightType: 'express', status,
    origin:          { city: (origAddr.city as string) || COUNTRY_NAME[originISO] || originISO || '', country: originISO, lat: originCoord[0], lng: originCoord[1] },
    destination:     { city: (destAddr.city  as string) || COUNTRY_NAME[destISO]   || destISO   || '', country: destISO,   lat: destCoord[0],   lng: destCoord[1]   },
    currentLocation: { lat: curCoord[0], lng: curCoord[1] },
    estimatedDelivery: eta, etaConfidence: 87,
    delayRisk: isDelay ? 'high' : 'low',
    delayReason: isDelay ? (statusDetail.description as string) || '' : '',
    timeline, carbonKg: 45, weightKg, dangerousGoods: false,
  }
}

// ── DHL Express ───────────────────────────────────────────────────────────────
const DHL_STATUS: Record<string, string> = {
  'pre-transit': 'picked_up',
  'transit':     'in_transit',
  'delivered':   'delivered',
  'failure':     'delayed',
  'unknown':     'in_transit',
}

async function fetchDHL(tn: string): Promise<Record<string, unknown> | null> {
  if (!DHL_API_KEY) return null
  try {
    const r = await fetch(
      `https://api-eu.dhl.com/track/shipments?trackingNumber=${encodeURIComponent(tn)}`,
      { headers: { 'DHL-API-Key': DHL_API_KEY } },
    )
    if (!r.ok) return null
    const j = await r.json()
    const shipments = (j.shipments as Record<string, unknown>[]) || []
    return shipments[0] || null
  } catch { return null }
}

function normaliseDHL(s: Record<string, unknown>, tn: string) {
  type Addr = Record<string, unknown>
  const origin   = (s.origin      as Addr) || {}
  const dest     = (s.destination as Addr) || {}
  const origAddr = (origin.address as Addr) || {}
  const destAddr = (dest.address   as Addr) || {}

  const originISO  = toISO2((origAddr.countryCode as string) || '')
  const destISO    = toISO2((destAddr.countryCode  as string) || '')
  const originCoord = coord(originISO)
  const destCoord   = coord(destISO)

  const statusObj  = (s.status as Addr) || {}
  const statusStr  = (statusObj.status as string) || 'unknown'
  const status     = DHL_STATUS[statusStr] || 'in_transit'

  const statusLoc  = (statusObj.location as Addr) || {}
  const statusAddr = (statusLoc.address  as Addr) || {}
  const curISO     = toISO2((statusAddr.countryCode as string) || '')
  const curCoord: [number, number] = curISO
    ? coord(curISO)
    : [(originCoord[0] + destCoord[0]) / 2, (originCoord[1] + destCoord[1]) / 2]

  const events = (s.events as Addr[]) || []
  const timeline = [...events].reverse().map(ev => {
    const evLoc  = (ev.location as Addr) || {}
    const evAddr = (evLoc.address as Addr) || {}
    const city   = (evAddr.addressLocality as string) || ''
    const ctry   = (evAddr.countryCode     as string) || ''
    return {
      status:    (ev.description as string) || 'Update',
      location:  [city, ctry].filter(Boolean).join(', '),
      timestamp: (ev.timestamp as string) || '',
      completed: true,
    }
  })

  const eta = (s.estimatedTimeOfDelivery as string)?.split('T')[0] || 'TBD'
  const isDelay = status === 'delayed'

  return {
    id: tn, trackingNumber: tn, carrier: 'DHL Express', freightType: 'express', status,
    origin:          { city: (origAddr.addressLocality as string) || COUNTRY_NAME[originISO] || originISO || '', country: originISO, lat: originCoord[0], lng: originCoord[1] },
    destination:     { city: (destAddr.addressLocality as string) || COUNTRY_NAME[destISO]   || destISO   || '', country: destISO,   lat: destCoord[0],   lng: destCoord[1]   },
    currentLocation: { lat: curCoord[0], lng: curCoord[1] },
    estimatedDelivery: eta, etaConfidence: 88,
    delayRisk: isDelay ? 'high' : 'low', delayReason: '',
    timeline, carbonKg: 45, weightKg: 0, dangerousGoods: false,
  }
}

// ── UPS ───────────────────────────────────────────────────────────────────────
async function getUpsToken(): Promise<string | null> {
  if (!UPS_CLIENT_ID || !UPS_CLIENT_SECRET) return null
  const now = Date.now()
  if (upsToken && upsToken.exp > now + 60_000) return upsToken.v
  try {
    const creds = btoa(`${UPS_CLIENT_ID}:${UPS_CLIENT_SECRET}`)
    const r = await fetch('https://onlinetools.ups.com/security/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${creds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })
    const j = await r.json()
    if (j.access_token) {
      upsToken = { v: j.access_token, exp: now + (j.expires_in || 14400) * 1000 }
      return j.access_token
    }
  } catch { /* ignore */ }
  return null
}

const UPS_STATUS: Record<string, string> = {
  I: 'in_transit', M: 'picked_up', P: 'picked_up',
  D: 'delivered',
  X: 'delayed', RS: 'delayed',
}

async function fetchUPS(tn: string): Promise<Record<string, unknown> | null> {
  const token = await getUpsToken()
  if (!token) return null
  try {
    const r = await fetch(
      `https://onlinetools.ups.com/api/track/v1/details/${encodeURIComponent(tn)}?locale=en_US&returnSignature=false&returnMilestones=false&returnPOD=false`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'transId': crypto.randomUUID(),
          'transactionSrc': 'Trackora',
        },
      },
    )
    if (!r.ok) return null
    const j = await r.json()
    return j?.trackResponse?.shipment?.[0] || null
  } catch { return null }
}

function normaliseUPS(shipment: Record<string, unknown>, tn: string) {
  type Addr = Record<string, unknown>
  const pkg        = ((shipment.package as Addr[]) || [])[0] || {}
  const activities = (pkg.activity as Addr[]) || []

  const latestAct  = activities[0] || {}
  const statusInfo = (latestAct.status as Addr) || {}
  const statusType = (statusInfo.type as string) || 'I'
  const status     = UPS_STATUS[statusType] || 'in_transit'

  const pkgAddresses = (pkg.packageAddress as Addr[]) || []
  const origAddrObj  = pkgAddresses.find(a => (a.type as string) === 'ORIGIN')  || {}
  const destAddrObj  = pkgAddresses.find(a => (a.type as string) === 'DESTINATION') || {}
  const origAddr     = (origAddrObj.address as Addr) || {}
  const destAddr     = (destAddrObj.address as Addr) || {}

  const originISO   = toISO2((origAddr.country as string) || '')
  const destISO     = toISO2((destAddr.country as string) || '')
  const originCoord = coord(originISO)
  const destCoord   = coord(destISO)

  const latestLoc  = (latestAct.location as Addr) || {}
  const latestAddr = (latestLoc.address  as Addr) || {}
  const curISO     = toISO2((latestAddr.country as string) || '')
  const curCoord: [number, number] = curISO
    ? coord(curISO)
    : [(originCoord[0] + destCoord[0]) / 2, (originCoord[1] + destCoord[1]) / 2]

  // UPS date: "20240315", time: "100100" → ISO string
  function upsDateTime(date: string, time: string): string {
    if (!date) return ''
    const d = `${date.slice(0,4)}-${date.slice(4,6)}-${date.slice(6,8)}`
    if (!time) return d
    return `${d}T${time.slice(0,2)}:${time.slice(2,4)}:${time.slice(4,6)}`
  }

  const timeline = [...activities].reverse().map(act => {
    const loc  = (act.location as Addr) || {}
    const addr = (loc.address  as Addr) || {}
    const st   = (act.status   as Addr) || {}
    return {
      status:    (st.description as string) || 'Update',
      location:  [(addr.city as string), (addr.country as string)].filter(Boolean).join(', '),
      timestamp: upsDateTime(act.date as string, act.time as string),
      completed: true,
    }
  })

  const deliveryDates = (pkg.deliveryDate as Addr[]) || []
  const etaEntry = deliveryDates.find(d => (d.type as string) === 'DEL') || deliveryDates[0]
  const etaRaw   = etaEntry?.date as string // "20240315"
  const eta      = etaRaw
    ? `${etaRaw.slice(0,4)}-${etaRaw.slice(4,6)}-${etaRaw.slice(6,8)}`
    : 'TBD'

  const pkgWeight  = (pkg.packageWeight as Addr) || {}
  const uom        = (pkgWeight.unitOfMeasurement as Addr) || {}
  const weightVal  = parseFloat(pkgWeight.weight as string) || 0
  const weightKg   = (uom.code as string) === 'KGS' ? weightVal : weightVal * 0.453592
  const isDelay    = status === 'delayed'

  return {
    id: tn, trackingNumber: tn, carrier: 'UPS', freightType: 'express', status,
    origin:          { city: (origAddr.city as string) || COUNTRY_NAME[originISO] || originISO || '', country: originISO, lat: originCoord[0], lng: originCoord[1] },
    destination:     { city: (destAddr.city  as string) || COUNTRY_NAME[destISO]   || destISO   || '', country: destISO,   lat: destCoord[0],   lng: destCoord[1]   },
    currentLocation: { lat: curCoord[0], lng: curCoord[1] },
    estimatedDelivery: eta, etaConfidence: 87,
    delayRisk: isDelay ? 'high' : 'low', delayReason: '',
    timeline, carbonKg: 45, weightKg, dangerousGoods: false,
  }
}

// ── USPS ──────────────────────────────────────────────────────────────────────
async function getUspsToken(): Promise<string | null> {
  if (!USPS_CLIENT_ID || !USPS_CLIENT_SECRET) return null
  const now = Date.now()
  if (uspsToken && uspsToken.exp > now + 60_000) return uspsToken.v
  try {
    const r = await fetch('https://api.usps.com/oauth2/v3/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=client_credentials&client_id=${USPS_CLIENT_ID}&client_secret=${USPS_CLIENT_SECRET}&scope=tracking`,
    })
    const j = await r.json()
    if (j.access_token) {
      uspsToken = { v: j.access_token, exp: now + (j.expires_in || 3600) * 1000 }
      return j.access_token
    }
  } catch { /* ignore */ }
  return null
}

async function fetchUSPS(tn: string): Promise<Record<string, unknown> | null> {
  const token = await getUspsToken()
  if (!token) return null
  try {
    const r = await fetch(
      `https://api.usps.com/tracking/v3/tracking/${encodeURIComponent(tn)}?expand=DETAIL`,
      { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } },
    )
    if (!r.ok) return null
    return await r.json()
  } catch { return null }
}

function uspsStatusFromEvent(evt: string): string {
  const e = evt.toLowerCase()
  if (/delivered/.test(e))                return 'delivered'
  if (/out for delivery/.test(e))          return 'out_for_delivery'
  if (/picked up|acceptance|usps in possession/.test(e)) return 'picked_up'
  if (/held|delay|alert/.test(e))         return 'delayed'
  if (/customs|international/.test(e))    return 'customs'
  return 'in_transit'
}

function normaliseUSPS(data: Record<string, unknown>, tn: string) {
  type Evt = Record<string, unknown>
  const summary = (data.TrackSummary as Evt) || {}
  const details = (data.TrackDetail  as Evt[]) || []

  const allEvents = [summary, ...details].filter(e => e.Event)

  const summaryEvt = (summary.Event as string) || ''
  const status     = uspsStatusFromEvent(summaryEvt)

  const summaryCity  = (summary.EventCity    as string) || ''
  const summaryState = (summary.EventState   as string) || ''
  const summaryCtry  = (summary.EventCountry as string) || 'US'
  const destISO      = summaryCtry && summaryCtry !== 'US' ? resolveISO2(summaryCtry) : 'US'
  const destCoord    = coord(destISO)
  const usCoord      = coord('US')

  const timeline = [...allEvents].reverse().map(ev => {
    const city  = (ev.EventCity    as string) || ''
    const state = (ev.EventState   as string) || ''
    const ctry  = (ev.EventCountry as string) || 'US'
    const loc   = [city, state, ctry !== 'US' ? ctry : ''].filter(Boolean).join(', ')
    return {
      status:    (ev.Event as string) || 'Update',
      location:  loc,
      timestamp: `${ev.EventDate || ''} ${ev.EventTime || ''}`.trim(),
      completed: true,
    }
  })

  const eta = (data.ExpectedDeliveryDate as string) || 'TBD'
  const isDelay = status === 'delayed'
  const destCity = [summaryCity, summaryState].filter(Boolean).join(', ')

  return {
    id: tn, trackingNumber: tn, carrier: 'USPS', freightType: 'express', status,
    origin:          { city: 'United States', country: 'US', lat: usCoord[0], lng: usCoord[1] },
    destination:     { city: destCity || COUNTRY_NAME[destISO] || destISO, country: destISO, lat: destCoord[0], lng: destCoord[1] },
    currentLocation: { lat: destCoord[0], lng: destCoord[1] },
    estimatedDelivery: eta, etaConfidence: 82,
    delayRisk: isDelay ? 'high' : 'low', delayReason: '',
    timeline, carbonKg: 10, weightKg: 0, dangerousGoods: false,
  }
}

// ── Aramex ────────────────────────────────────────────────────────────────────
const ARAMEX_STATUS: Record<string, string> = {
  'PU': 'picked_up', 'SHP': 'picked_up',
  'SH': 'in_transit', 'IT': 'in_transit', 'TR': 'in_transit',
  'OD': 'out_for_delivery', 'OFD': 'out_for_delivery',
  'DL': 'delivered', 'OK': 'delivered',
  'UD': 'delayed', 'RTO': 'delayed', 'MIS': 'delayed',
  'CH': 'customs', 'CUS': 'customs',
}

async function fetchAramex(tn: string): Promise<Record<string, unknown> | null> {
  if (!ARAMEX_USERNAME || !ARAMEX_PASSWORD || !ARAMEX_ACCOUNT_NUM) return null
  try {
    const r = await fetch(
      'https://ws.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackShipments',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ClientInfo: {
            UserName: ARAMEX_USERNAME,
            Password: ARAMEX_PASSWORD,
            Version: 'v1.0',
            AccountNumber: ARAMEX_ACCOUNT_NUM,
            AccountPin: ARAMEX_ACCOUNT_PIN,
            AccountEntity: ARAMEX_ENTITY,
            AccountCountryCode: ARAMEX_COUNTRY,
          },
          Transaction: { Reference1: 'Trackora', Reference2: '', Reference3: '', Reference4: '', Reference5: '' },
          Shipments: [tn],
          GetLastTrackingUpdateOnly: false,
        }),
      },
    )
    if (!r.ok) return null
    const j = await r.json()
    const results = (j.TrackingResults as Record<string, unknown>[]) || []
    const result  = results[0]
    if (!result) return null
    const history = (result.TrackingHistory as unknown[]) || []
    if (history.length === 0) return null  // not found
    return result
  } catch { return null }
}

// Aramex dates: "/Date(1710000000000+0000)/" → ISO string
function parseAramexDate(raw: unknown): string {
  if (typeof raw !== 'string') return ''
  const match = raw.match(/\/Date\((\d+)/)
  if (!match) return raw
  return new Date(parseInt(match[1])).toISOString()
}

function normaliseAramex(result: Record<string, unknown>, tn: string) {
  const history      = (result.TrackingHistory as Record<string, unknown>[]) || []
  const currentSt    = (result.CurrentStatus   as Record<string, unknown>) || {}
  const origDetails  = (result.OriginDetails      as Record<string, unknown>) || {}
  const destDetails  = (result.DestinationDetails as Record<string, unknown>) || {}

  const latestEvent = history[0] || {}
  const statusCode  = (currentSt.Code as string) || (latestEvent.UpdateCode as string) || ''
  const status      = ARAMEX_STATUS[statusCode] || 'in_transit'

  const originISO   = resolveISO2((origDetails.CountryCode as string) || '')
  const destISO     = resolveISO2((destDetails.CountryCode as string) || '')
  const originCoord = coord(originISO)
  const destCoord   = coord(destISO)

  const latestLoc   = (latestEvent.UpdateLocation as string) || ''
  const curISO      = resolveISO2(latestLoc) || originISO
  const curCoord: [number, number] = curISO
    ? coord(curISO)
    : [(originCoord[0] + destCoord[0]) / 2, (originCoord[1] + destCoord[1]) / 2]

  const timeline = [...history].reverse().map(ev => ({
    status:    (ev.UpdateDescription as string) || (ev.Comments as string) || 'Update',
    location:  (ev.UpdateLocation as string) || '',
    timestamp: parseAramexDate(ev.UpdateDateTime),
    completed: true,
  }))

  const isDelay = status === 'delayed'
  return {
    id: tn, trackingNumber: tn, carrier: 'Aramex', freightType: 'express', status,
    origin:          { city: (origDetails.City as string) || COUNTRY_NAME[originISO] || originISO || '', country: originISO, lat: originCoord[0], lng: originCoord[1] },
    destination:     { city: (destDetails.City as string) || COUNTRY_NAME[destISO]   || destISO   || '', country: destISO,   lat: destCoord[0],   lng: destCoord[1]   },
    currentLocation: { lat: curCoord[0], lng: curCoord[1] },
    estimatedDelivery: 'TBD', etaConfidence: 78,
    delayRisk: isDelay ? 'high' : 'low', delayReason: '',
    timeline, carbonKg: 45, weightKg: 0, dangerousGoods: false,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// AFTERSHIP API HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

async function afGet(path: string) {
  const r = await fetch(`${BASE_AS}${path}`, {
    headers: { 'as-api-key': AFTERSHIP_KEY },
  })
  return r.json()
}

async function afPost(path: string, body: unknown) {
  const r = await fetch(`${BASE_AS}${path}`, {
    method: 'POST',
    headers: { 'as-api-key': AFTERSHIP_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return r.json()
}

async function afPollUntilReady(
  id: string,
  attempts: number,
  delayMs: number,
  sleepFirst: boolean,
): Promise<Record<string, unknown> | undefined> {
  let last: Record<string, unknown> | undefined
  for (let i = 0; i < attempts; i++) {
    if (sleepFirst || i > 0) await new Promise(res => setTimeout(res, delayMs))
    const get = await afGet(`/trackings/${id}`)
    if (get.meta?.code === 200) {
      last = get.data as Record<string, unknown>
      const cps = get.data?.checkpoints as unknown[] | undefined
      const tag = get.data?.tag as string | undefined
      if ((cps && cps.length > 0) || tag === 'Delivered') return get.data
    }
  }
  return last
}

async function fetchAfterShip(trackingNumber: string, slug?: string) {
  const create = await afPost('/trackings', {
    tracking_number: trackingNumber,
    ...(slug ? { slug } : {}),
  })
  const code = create.meta?.code

  if (code === 201) {
    const id = create.data?.id as string | undefined
    if (id) {
      const data = await afPollUntilReady(id, 5, 1500, true)
      if (data) return data
    }
    return create.data
  }

  if (code === 4003) {
    const id = create.data?.id as string | undefined
    if (id) {
      const data = await afPollUntilReady(id, 4, 1500, false)
      if (data) return data
    }
  }

  if (code === 4021 || code === 4004 || code === 4005) return null

  if (code && code !== 201 && code !== 4003) {
    const search = await afGet(`/trackings?tracking_numbers=${encodeURIComponent(trackingNumber)}&limit=1`)
    if (search.meta?.code === 200 && search.data?.trackings?.length > 0) {
      return search.data.trackings[0]
    }
  }

  return null
}

// ═══════════════════════════════════════════════════════════════════════════════
// 17TRACK API HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

async function fetch17track(trackingNumber: string): Promise<Record<string, unknown> | null> {
  if (!TRACK17_KEY) return null

  let reg: Record<string, unknown>
  try {
    const r = await fetch(`${BASE_17}/register`, {
      method: 'POST',
      headers: { '17token': TRACK17_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ number: trackingNumber }]),
    })
    reg = await r.json()
  } catch { return null }

  const regCode = reg.code as number
  if (regCode !== 0 && regCode !== -18010012) return null

  const isNew = (reg.data as Record<string, unknown>)?.accepted
  if (isNew) await new Promise(r => setTimeout(r, 750))

  let info: Record<string, unknown>
  try {
    const r = await fetch(`${BASE_17}/gettrackinfo`, {
      method: 'POST',
      headers: { '17token': TRACK17_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify([{ number: trackingNumber }]),
    })
    info = await r.json()
  } catch { return null }

  if ((info.code as number) !== 0) return null

  const accepted = (info.data as Record<string, unknown>)?.accepted as Record<string, unknown>[] | undefined
  const item     = accepted?.[0]
  if (!item) return null

  const track  = item.track as Record<string, unknown> | undefined
  if (!track) return null
  const events = (track.w1 as unknown[]) || []
  if ((track.e as string) === 'NotFound' && events.length === 0) return null

  return item
}

// ═══════════════════════════════════════════════════════════════════════════════
// NORMALISE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function normaliseAfterShip(t: Record<string, unknown>) {
  const slug        = (t.slug as string) || ''
  const carrierTitle = (t.title as string) || ''

  // Quality gate: AfterShip returns "Unrecognized" when it finds the number
  // format but can't identify the carrier — this is a false positive. Treat it
  // as not found so the frontend shows the redirect card or "not found" state.
  if (!slug || carrierTitle.toLowerCase() === 'unrecognized') return null

  const originISO   = toISO2((t.origin_country_region      as string) || '')
  const destISO     = toISO2((t.destination_country_region as string) || '')
  const originCoord = coord(originISO)
  const destCoord   = coord(destISO)
  const checkpoints = (t.checkpoints as Record<string, unknown>[]) || []
  const lastCp      = checkpoints[checkpoints.length - 1]

  const currentCoord: [number, number] = lastCp
    ? (coord(toISO2(lastCp.country_region as string)) || [
        (originCoord[0] + destCoord[0]) / 2,
        (originCoord[1] + destCoord[1]) / 2,
      ])
    : originCoord

  function extractEta(raw: unknown): string {
    if (!raw) return ''
    if (typeof raw === 'string') return raw
    if (typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      return (obj.estimated_delivery_date as string) || ''
    }
    return ''
  }
  const eta = extractEta(t.courier_estimated_delivery_date)
           || extractEta(t.aftership_estimated_delivery_date)
           || 'TBD'

  const rawWeight = t.shipment_weight
  const weightKg  = typeof rawWeight === 'number' ? rawWeight
                  : rawWeight && typeof rawWeight === 'object'
                    ? ((rawWeight as Record<string, unknown>).value as number) || 0
                    : 0

  let ft = freightTypeBySlug(slug)
  // MAWB format (NNN-NNNNNNNN) → air cargo unless the slug or carrier title
  // matches a known parcel courier that also uses this number format (e.g. BRT, DHL domestic).
  // No keyword check needed — covers airlines like "Saudia", "Turkish Cargo" etc.
  if (ft === 'express') {
    const tn = (t.tracking_number as string || '').trim()
    if (/^\d{3}-\d{8}$/.test(tn)) {
      const PARCEL_RE = /\b(fedex|ups|dhl|usps|aramex|brt|gls|dpd|hermes|evri|postnl)\b/
      const slugLower  = slug.toLowerCase()
      const titleLower = ((t.title as string) || '').toLowerCase()
      if (!PARCEL_RE.test(slugLower) && !PARCEL_RE.test(titleLower)) ft = 'air'
    }
  }

  return {
    id:             (t.id as string) || (t.tracking_number as string),
    trackingNumber: t.tracking_number as string,
    carrier:        (carrierTitle && carrierTitle !== (t.tracking_number as string))
                      ? carrierTitle
                      : slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : 'Unknown',
    freightType:    ft,
    status:         AFTERSHIP_TAG_MAP[t.tag as string] || 'in_transit',
    origin: {
      city:    (t.origin_city as string) || COUNTRY_NAME[originISO] || originISO || '',
      country: originISO,
      lat: originCoord[0], lng: originCoord[1],
    },
    destination: {
      city:    (t.destination_city as string) || COUNTRY_NAME[destISO] || destISO || '',
      country: destISO,
      lat: destCoord[0], lng: destCoord[1],
    },
    currentLocation: { lat: currentCoord[0], lng: currentCoord[1] },
    estimatedDelivery: eta,
    etaConfidence:     82,
    delayRisk:  t.tag === 'Exception' || t.tag === 'AttemptFail' ? 'high'
              : t.tag === 'Expired'   ? 'medium' : 'low',
    delayReason: t.tag === 'Exception' ? 'Carrier exception reported' : '',
    timeline: checkpoints.map((cp) => ({
      status:    (cp.message as string) || (cp.tag as string) || 'Update',
      location:  (cp.location as string) || (cp.city as string) || '',
      timestamp: (cp.checkpoint_time as string) || (cp.created_at as string) || '',
      completed: true,
    })).reverse(),
    carbonKg: ft === 'sea' ? 120 : ft === 'air' ? 980 : 45,
    weightKg,
    dangerousGoods: (() => {
      const DG_RE = /dangerous.?goods|hazardous.?material|hazmat|\bDGR\b|\bIDG\b|\bIMDG\b|lithium.?batt|restricted.?article|class\s*[1-9]\s*[\./]/i
      const desc   = (t.shipment_description as string) || ''
      const custom = JSON.stringify(t.custom_fields || {})
      const cpText = (checkpoints as Record<string, unknown>[]).map(cp => `${cp.message || ''} ${cp.tag || ''}`).join(' ')
      return DG_RE.test(desc) || DG_RE.test(custom) || DG_RE.test(cpText)
    })(),
  }
}

function normalise17track(item: Record<string, unknown>, trackingNumber: string) {
  const track = item.track as Record<string, unknown>

  const z0 = (track.z0 as Record<string, unknown>) || {}
  const z1 = (track.z1 as Record<string, unknown>) || {}
  const z2 = (track.z2 as Record<string, unknown>) || {}

  const originISO  = resolveISO2((z0.b as string) || (z0.a as string) || '')
  const destISO    = resolveISO2((z2.b as string) || (z2.a as string) || '')
  const originCity = (z0.c as string) || COUNTRY_NAME[originISO] || originISO || ''
  const destCity   = (z2.c as string) || COUNTRY_NAME[destISO]   || destISO   || ''

  const originCoord = coord(originISO)
  const destCoord   = coord(destISO)

  const carrierName = (z1.a as string) || 'Unknown'
  const carrierType = z1.c as number | undefined

  let freightType = carrierType ? (CARRIER_TYPE_MAP[carrierType] || 'express') : 'express'
  if (!carrierType) {
    const clean = trackingNumber.replace(/\s/g, '').toUpperCase()
    if (/^[A-Z]{3}[UJZ]\d{7}$/.test(clean)) freightType = 'sea'
    else if (/^\d{3}-\d{8}$/.test(trackingNumber.trim())) freightType = 'air'
  }

  const rawEvents = (track.w1 as Record<string, unknown>[]) || []

  function locationToISO2(loc: string): string {
    if (!loc) return ''
    const parts = loc.split(',').map(s => s.trim())
    for (const part of [...parts].reverse()) {
      const iso = resolveISO2(part)
      if (iso) return iso
    }
    return ''
  }

  const latestEvent   = rawEvents[0]
  const latestLocRaw  = (latestEvent?.b as string) || ''
  const curISO        = locationToISO2(latestLocRaw)
  const currentCoord: [number, number] = curISO
    ? coord(curISO)
    : [(originCoord[0] + destCoord[0]) / 2, (originCoord[1] + destCoord[1]) / 2]

  const statusTag = (track.e as string) || 'InTransit'
  const status    = TRACK17_TAG_MAP[statusTag] || 'in_transit'
  const eta       = (track.d as string) || 'TBD'

  const timeline = [...rawEvents].reverse().map((ev) => ({
    status:    (ev.c as string) || (ev.z as string) || 'Update',
    location:  (ev.b as string) || '',
    timestamp: (ev.a as string) || '',
    completed: true,
  }))

  const DG_RE  = /dangerous.?goods|hazardous.?material|hazmat|\bDGR\b|\bIDG\b|\bIMDG\b|lithium.?batt/i
  const evText = rawEvents.map(ev => `${ev.c || ''} ${ev.z || ''}`).join(' ')

  return {
    id: trackingNumber, trackingNumber, carrier: carrierName, freightType, status,
    origin:          { city: originCity, country: originISO, lat: originCoord[0], lng: originCoord[1] },
    destination:     { city: destCity,   country: destISO,   lat: destCoord[0],   lng: destCoord[1]   },
    currentLocation: { lat: currentCoord[0], lng: currentCoord[1] },
    estimatedDelivery: eta, etaConfidence: 75,
    delayRisk:   status === 'delayed' ? 'high' : status === 'customs' ? 'medium' : 'low',
    delayReason: status === 'delayed' ? 'Carrier reported exception' : '',
    timeline, carbonKg: freightType === 'sea' ? 120 : freightType === 'air' ? 980 : 45,
    weightKg: 0, dangerousGoods: DG_RE.test(evText),
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHIPSGO OCEAN API
// ═══════════════════════════════════════════════════════════════════════════════

const SG_HEADERS = () => ({
  'X-Shipsgo-User-Token': SHIPSGO_KEY,
  'Content-Type':         'application/json',
  'Accept':               'application/json',
})

async function shipsgoFindExisting(containerNumber: string): Promise<number | null> {
  try {
    const r = await fetch(`${BASE_SG}/ocean/shipments?container_number=${encodeURIComponent(containerNumber)}`, {
      headers: SG_HEADERS(),
    })
    const j = await r.json()
    const list = (j.shipments as Record<string, unknown>[]) || []
    const match = list.find(s => (s.container_number as string)?.toUpperCase() === containerNumber.toUpperCase())
    return match ? (match.id as number) : (list[0]?.id as number ?? null)
  } catch { return null }
}

async function shipsgoGet(id: number): Promise<Record<string, unknown> | null> {
  try {
    const r = await fetch(`${BASE_SG}/ocean/shipments/${id}`, { headers: SG_HEADERS() })
    const j = await r.json()
    return (j.shipment as Record<string, unknown>) ?? null
  } catch { return null }
}

async function fetchShipsgo(containerNumber: string): Promise<Record<string, unknown> | null> {
  if (!SHIPSGO_KEY) return null

  let id = await shipsgoFindExisting(containerNumber)

  if (!id) {
    try {
      const r = await fetch(`${BASE_SG}/ocean/shipments`, {
        method:  'POST',
        headers: SG_HEADERS(),
        body:    JSON.stringify({ container_number: containerNumber }),
      })
      const j = await r.json()
      id = (j.shipment as Record<string, unknown>)?.id as number ?? null
    } catch { return null }
  }
  if (!id) return null

  let shipment = await shipsgoGet(id)
  for (let attempt = 0; attempt < 3 && shipment; attempt++) {
    const status  = shipment.status as string
    const hasData = (shipment.route as unknown) || ((shipment.containers as unknown[]) ?? []).length > 0
    if (status !== 'NEW' && status !== 'INPROGRESS' && hasData) break
    if (attempt === 2) break
    await new Promise(res => setTimeout(res, 1200))
    shipment = await shipsgoGet(id)
  }

  if (!shipment) return null

  const carrier = shipment.carrier as Record<string, unknown> | undefined
  const scac    = carrier?.scac as string | undefined
  const route   = shipment.route as unknown
  const conts   = (shipment.containers as unknown[]) ?? []
  if ((scac === 'SG_XXXX' || (carrier?.name as string) === 'OTHERS') && !route && conts.length === 0) {
    return null
  }
  return shipment
}

function normaliseShipsgo(s: Record<string, unknown>, containerNumber: string) {
  const carrier  = (s.carrier as Record<string, unknown>) || {}
  const route    = (s.route   as Record<string, unknown>) || {}
  const conts    = (s.containers as Record<string, unknown>[]) || []
  const cont     = conts[0] || {}
  const movements = (cont.movements as Record<string, unknown>[]) || []

  const pol    = (route.port_of_loading   as Record<string, unknown>) || {}
  const pod    = (route.port_of_discharge as Record<string, unknown>) || {}
  const polLoc = (pol.location as Record<string, unknown>) || {}
  const podLoc = (pod.location as Record<string, unknown>) || {}

  const polCode    = polLoc.code as string | undefined
  const podCode    = podLoc.code as string | undefined
  const polCountry = ((polLoc.country as Record<string, unknown>)?.code as string) || ''
  const podCountry = ((podLoc.country as Record<string, unknown>)?.code as string) || ''

  const originCoord = portCoord(polCode, polCountry)
  let destCoord     = portCoord(podCode, podCountry)

  const sortedMoves = [...movements].sort((a, b) =>
    String(a.timestamp || '').localeCompare(String(b.timestamp || ''))
  )

  // ── Fallback: if POD is missing or identical to POL, derive destination ──────
  // Shipsgo sometimes returns no POD (or the same port) when the route isn't
  // fully registered yet.  Walk the movements backwards and take the last
  // EST (expected) event whose port differs from the loading port.
  let podCity    = (podLoc.name    as string) || COUNTRY_NAME[podCountry] || podCountry || ''
  let podCountryFinal = podCountry
  const polCity  = (polLoc.name   as string) || COUNTRY_NAME[polCountry] || polCountry || ''
  const samePod  = !podCity || (podCity === polCity && podCountryFinal === polCountry)

  if (samePod) {
    const lastEST = [...sortedMoves].reverse().find(m => {
      if ((m.status as string) !== 'EST') return false
      const loc = (m.location as Record<string, unknown>) || {}
      const cc  = ((loc.country as Record<string, unknown>)?.code as string) || ''
      const nm  = (loc.name as string) || ''
      return nm && cc !== polCountry   // only use if it's a different country
    })
    if (lastEST) {
      const loc = (lastEST.location as Record<string, unknown>) || {}
      const cc  = ((loc.country as Record<string, unknown>)?.code as string) || ''
      const nm  = (loc.name as string) || ''
      podCity         = nm
      podCountryFinal = cc
      destCoord       = portCoord((loc.code as string) || '', cc)
    } else {
      // No useful EST event found — mark destination as unknown
      podCity         = ''
      podCountryFinal = ''
    }
  }

  const timeline = sortedMoves.map((m) => {
    const loc       = (m.location as Record<string, unknown>) || {}
    const vessel    = (m.vessel   as Record<string, unknown>) || {}
    const ev        = m.event as string
    const isEst     = (m.status as string) === 'EST'
    const locName   = [loc.name, ((loc.country as Record<string, unknown>)?.name)]
      .filter(Boolean).join(', ')
    const vesselName = vessel.name ? ` · ${vessel.name}` : ''
    return {
      status:    (SHIPSGO_EVENT_LABEL[ev] || ev || 'Update') + (isEst ? ' (expected)' : ''),
      location:  locName + vesselName,
      timestamp: (m.timestamp as string) || '',
      completed: !isEst,
    }
  })

  const lastActual = [...sortedMoves].reverse().find(m => (m.status as string) === 'ACT')
  let curCoord: [number, number] = originCoord
  if (lastActual) {
    const loc = (lastActual.location as Record<string, unknown>) || {}
    const c   = portCoord(loc.code as string, ((loc.country as Record<string, unknown>)?.code as string))
    if (c[0] !== 0 || c[1] !== 0) curCoord = c
  }

  const status      = SHIPSGO_STATUS_MAP[s.status as string] || 'in_transit'
  const eta         = (pod.date_of_discharge as string) || 'TBD'
  const carrierName = (carrier.name as string) && (carrier.name as string) !== 'OTHERS'
    ? (carrier.name as string)
    : 'Ocean Carrier'

  return {
    id: containerNumber, trackingNumber: containerNumber, carrier: carrierName,
    freightType: 'sea', status,
    origin:          { city: polCity,    country: polCountry,      lat: originCoord[0], lng: originCoord[1] },
    destination:     { city: podCity,    country: podCountryFinal, lat: destCoord[0],   lng: destCoord[1]   },
    currentLocation: { lat: curCoord[0], lng: curCoord[1] },
    estimatedDelivery: eta, etaConfidence: 80, delayRisk: 'low', delayReason: '',
    timeline,
    carbonKg: typeof route.co2_emission === 'number' ? (route.co2_emission as number) * 1000 : 120,
    weightKg: 0, dangerousGoods: false,
    vesselName: (() => {
      const last = [...sortedMoves].reverse().find(m => (m.vessel as Record<string, unknown>)?.name)
      return ((last?.vessel as Record<string, unknown>)?.name as string) || ''
    })(),
    transitTime: (route.transit_time as number) ?? null,
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════════

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { trackingNumber, carrierSlug, isBookingNumber } = await req.json() as {
      trackingNumber:  string
      carrierSlug?:    string
      isBookingNumber?: boolean
    }

    if (!trackingNumber?.trim()) {
      return new Response(JSON.stringify({ error: 'trackingNumber is required' }), {
        status: 400, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const tn = trackingNumber.trim()

    // ── Booking-number path ───────────────────────────────────────────────────
    // When isBookingNumber=true, a carrier slug is required. We try Shipsgo
    // (sea) or AfterShip (air) with the carrier forced. If nothing resolves we
    // return 404 so the frontend shows the BookingRedirectCard.
    if (isBookingNumber && carrierSlug) {
      let shipment: Record<string, unknown> | null = null

      const SEA_BOOKING_SLUGS = new Set([
        'maersk','msc','cma-cgm','cosco','hapag-lloyd','evergreen-line',
        'yang-ming','one','zim','pil','wan-hai',
      ])

      if (SEA_BOOKING_SLUGS.has(carrierSlug) && SHIPSGO_KEY) {
        // Try Shipsgo: search by booking/BL reference
        try {
          const r = await fetch(`${BASE_SG}/ocean/shipments?bl_number=${encodeURIComponent(tn)}`, {
            headers: SG_HEADERS(),
          })
          const j = await r.json()
          const list = (j.shipments as Record<string, unknown>[]) || []
          if (list.length > 0) {
            const id = list[0].id as number
            const sg = await shipsgoGet(id)
            if (sg) shipment = normaliseShipsgo(sg, tn)
          }
        } catch { /* fall through */ }
      }

      if (!shipment) {
        // Try AfterShip with carrier forced (works for air + some sea)
        try {
          const raw = await fetchAfterShip(tn, carrierSlug)
          if (raw) shipment = normaliseAfterShip(raw as Record<string, unknown>)
        } catch { /* fall through */ }
      }

      if (shipment) {
        return new Response(JSON.stringify({ data: shipment }), {
          headers: { ...CORS, 'Content-Type': 'application/json' },
        })
      }
      // Nothing found — return 404 so frontend shows BookingRedirectCard
      return new Response(JSON.stringify({ error: 'Booking reference not found in tracking APIs' }), {
        status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const format = detectFormat(tn)

    // ── Sea B/L / booking reference gate ─────────────────────────────────────
    // Numbers like MAEU265525152 start with a 4-char shipping-line owner code but
    // are NOT standard ISO containers (11 chars). AfterShip misidentifies them as
    // unrelated express carriers (e.g. "Ninjavan"). Block them early and return 404
    // so the frontend ContainerRedirectCard / BookingRedirectCard can take over.
    const SEA_SCAC4 = new Set([
      'MAEU','MSKI','SEAU',              // Maersk
      'MSCU','MSCD','MEDU','GESU',       // MSC
      'HLCU','HLXU',                     // Hapag-Lloyd
      'COSU','CBHU',                     // COSCO
      'CMAU','APHU',                     // CMA CGM
      'EITU','EGHU',                     // Evergreen
      'ONEY','ONEU',                     // ONE
      'YMLU','YMJU',                     // Yang Ming
      'ZIMU',                            // ZIM
    ])
    const upperTn = tn.toUpperCase()
    const prefix4 = upperTn.slice(0, 4)
    const isSeaRef = /^[A-Z]{4}/.test(upperTn) &&
                     upperTn.length >= 9 &&
                     !/^[A-Z]{3}[UJZ]\d{7}$/.test(upperTn) &&  // not a standard ISO container
                     SEA_SCAC4.has(prefix4)

    if (isSeaRef) {
      // Try Shipsgo B/L lookup before giving up
      let shipment: Record<string, unknown> | null = null
      if (SHIPSGO_KEY) {
        try {
          const r = await fetch(`${BASE_SG}/ocean/shipments?bl_number=${encodeURIComponent(tn)}`, {
            headers: SG_HEADERS(),
          })
          const j = await r.json()
          const list = (j.shipments as Record<string, unknown>[]) || []
          if (list.length > 0) {
            const id = list[0].id as number
            const sg = await shipsgoGet(id)
            if (sg) shipment = normaliseShipsgo(sg, tn)
          }
        } catch { /* fall through */ }
      }
      if (shipment) {
        return new Response(JSON.stringify({ data: shipment }), {
          headers: { ...CORS, 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify({ error: 'Sea reference — use carrier portal' }), {
        status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    let shipment: Record<string, unknown> | null = null

    // ── Route 0: Direct carrier APIs — FedEx · DHL · UPS · USPS · Aramex ──────
    // Only for express numbers. These official APIs are faster, more authoritative,
    // and return richer data (scan events from pickup onward) than AfterShip polling.
    if (format === 'express') {
      const directCarrier = detectDirectCarrier(tn, carrierSlug)

      if (directCarrier) {
        try {
          let raw: Record<string, unknown> | null = null

          if      (directCarrier === 'fedex'  && FEDEX_CLIENT_ID)  raw = await fetchFedEx(tn)
          else if (directCarrier === 'ups'    && UPS_CLIENT_ID)    raw = await fetchUPS(tn)
          else if (directCarrier === 'dhl'    && DHL_API_KEY)      raw = await fetchDHL(tn)
          else if (directCarrier === 'usps'   && USPS_CLIENT_ID)   raw = await fetchUSPS(tn)
          else if (directCarrier === 'aramex' && ARAMEX_USERNAME)  raw = await fetchAramex(tn)

          if (raw) {
            if      (directCarrier === 'fedex')  shipment = normaliseFedEx(raw, tn)
            else if (directCarrier === 'ups')    shipment = normaliseUPS(raw, tn)
            else if (directCarrier === 'dhl')    shipment = normaliseDHL(raw, tn)
            else if (directCarrier === 'usps')   shipment = normaliseUSPS(raw, tn)
            else if (directCarrier === 'aramex') shipment = normaliseAramex(raw, tn)
          }
        } catch { /* non-fatal: fall through to AfterShip */ }
      }
    }

    // ── Route 1: Ocean container → Shipsgo ───────────────────────────────────
    if (!shipment && format === 'container' && SHIPSGO_KEY) {
      const sg = await fetchShipsgo(tn)
      if (sg) shipment = normaliseShipsgo(sg, tn)
    }

    // ── Route 2: Container or MAWB → 17track ─────────────────────────────────
    if (!shipment && (format === 'container' || format === 'mawb') && TRACK17_KEY) {
      const item = await fetch17track(tn)
      if (item) shipment = normalise17track(item, tn)
    }

    // ── Routes 3+4: AfterShip + 17track ─────────────────────────────────────
    // For express numbers where Route 0 (direct carrier) produced nothing, fire
    // AfterShip and 17track in PARALLEL — they both take ~2-5 s and were going to
    // run sequentially anyway.  We take whichever returns richer data.
    // For MAWBs and container-with-slug we keep the original AfterShip-only path.
    if (!shipment && (format !== 'container' || carrierSlug)) {
      const mawbPrefix    = format === 'mawb' ? tn.match(/^(\d{3})-/)?.[1] : undefined
      const skipAfterShip = format === 'mawb' && !carrierSlug && mawbPrefix && !AFTERSHIP_MAWB_OK.has(mawbPrefix)
      const hint          = carrierSlug ?? (format === 'mawb' ? mawbCarrierSlug(tn) : undefined)

      // Detect whether Route 0 ran with credentials — if it did, 17track fallback
      // is less useful (carrier already matched); keep it sequential in that edge case.
      const directCarrier = detectDirectCarrier(tn, carrierSlug)
      const usedDirect    = !!(directCarrier && (
        (directCarrier === 'fedex'  && !!FEDEX_CLIENT_ID) ||
        (directCarrier === 'ups'    && !!UPS_CLIENT_ID)   ||
        (directCarrier === 'dhl'    && !!DHL_API_KEY)     ||
        (directCarrier === 'usps'   && !!USPS_CLIENT_ID)  ||
        (directCarrier === 'aramex' && !!ARAMEX_USERNAME)
      ))

      const runParallel = format === 'express' && !usedDirect && !!TRACK17_KEY && !skipAfterShip

      if (runParallel) {
        // Fire AfterShip and 17track simultaneously
        const [asRaw, t17Raw] = await Promise.all([
          fetchAfterShip(tn, hint).catch(() => null),
          fetch17track(tn).catch(() => null),
        ])
        const asShipment  = asRaw  ? normaliseAfterShip(asRaw  as Record<string, unknown>) : null
        const t17Shipment = t17Raw ? normalise17track(t17Raw, tn) : null
        const asLen       = (asShipment?.timeline  as unknown[])?.length ?? 0
        const t17Len      = (t17Shipment?.timeline as unknown[])?.length ?? 0

        if (asLen > 0) {
          shipment = asShipment
        } else if (t17Len > 0) {
          // Carry over carrier name if AfterShip identified it
          if (asShipment?.carrier) (t17Shipment as Record<string, unknown>).carrier = asShipment.carrier as string
          shipment = t17Shipment
        } else if (asShipment) {
          shipment = asShipment
        } else if (t17Shipment) {
          shipment = t17Shipment
        }
      } else {
        // Original sequential path (MAWB / direct-carrier fallback)
        if (!skipAfterShip) {
          const raw = await fetchAfterShip(tn, hint)
          if (raw) shipment = normaliseAfterShip(raw as Record<string, unknown>)
        }

        // Route 4 sequential fallback: express + direct-carrier ran but gave 0 events
        if (TRACK17_KEY && format === 'express' && usedDirect) {
          const afTimeline = (shipment?.timeline as unknown[]) ?? []
          if (!shipment || afTimeline.length === 0) {
            const item = await fetch17track(tn)
            if (item) {
              const t17         = normalise17track(item, tn)
              const t17Timeline = (t17.timeline as unknown[]) ?? []
              if (!shipment || t17Timeline.length > 0) {
                if (shipment && shipment.carrier && t17Timeline.length > 0) {
                  t17.carrier = shipment.carrier as string
                }
                shipment = t17
              }
            }
          }
        }
      }
    }

    // ── Route 5: Placeholder for pattern-detected carriers with no live data ────
    // Fires when all API routes returned null but we can still identify the carrier
    // from the tracking-number pattern.  Better than "not found" — returns a sparse
    // shipment so the UI can show "Booking confirmed" + a direct carrier deep-link.
    if (!shipment) {
      const detectedCarrier = detectDirectCarrier(tn, carrierSlug)
      if (detectedCarrier) {
        const CARRIER_DISPLAY: Record<string, string> = {
          fedex: 'FedEx', ups: 'UPS', dhl: 'DHL Express', usps: 'USPS', aramex: 'Aramex',
        }
        shipment = {
          id: tn, trackingNumber: tn,
          carrier: CARRIER_DISPLAY[detectedCarrier] || detectedCarrier.toUpperCase(),
          freightType: 'express', status: 'picked_up',
          origin:          { city: '', country: '', lat: 0, lng: 0 },
          destination:     { city: '', country: '', lat: 0, lng: 0 },
          currentLocation: { lat: 0, lng: 0 },
          estimatedDelivery: 'TBD', etaConfidence: 0,
          delayRisk: 'low', delayReason: '',
          timeline: [], carbonKg: 45, weightKg: 0, dangerousGoods: false,
        }
      }
    }

    if (!shipment) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    // ── Save to Supabase if user is logged in ─────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      try {
        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
        const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))
        if (user) {
          const o = shipment.origin      as Record<string, unknown>
          const d = shipment.destination as Record<string, unknown>
          await supabase.from('shipments').upsert({
            user_id:         user.id,
            tracking_number: shipment.trackingNumber,
            carrier_name:    shipment.carrier,
            carrier_slug:    '',
            status:          shipment.status,
            freight_type:    shipment.freightType,
            origin_city:     o.city,
            origin_country:  o.country,
            dest_city:       d.city,
            dest_country:    d.country,
            est_delivery:    shipment.estimatedDelivery,
            raw_data:        shipment,
            updated_at:      new Date().toISOString(),
          }, { onConflict: 'user_id,tracking_number' })
        }
      } catch (_) { /* non-fatal */ }
    }

    return new Response(JSON.stringify({ data: shipment }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
