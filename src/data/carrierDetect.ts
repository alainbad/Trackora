/**
 * carrierDetect.ts
 * Client-side carrier detection from tracking number format.
 * Returns a carrier + pre-filled tracking URL — no API call required.
 *
 * Confidence levels:
 *  'high'   — format is unambiguous (UPS 1Z, FedEx 12/15/20 digits, MAWB, container, Royal Mail, etc.)
 *  'medium' — format overlaps multiple carriers (9 digits, 8 digits, etc.)
 */

export interface DetectedCarrier {
  name:        string
  slug:        string
  trackUrl?:   string      // pre-filled URL — {n} replaced with tracking number (optional)
  confidence:  'high' | 'medium'
  category:    'express' | 'sea' | 'air' | 'post' | 'land'
  accentColor: string
  logoUrl?:    string
  hint?:       string      // extra label, e.g. "Air Waybill"
}

type CarrierBase = Omit<DetectedCarrier, 'confidence'>

// ── MAWB prefix → carrier ────────────────────────────────────────────────────
const MAWB_CARRIERS: Record<string, CarrierBase> = {
  '001': { name:'American Airlines Cargo', slug:'american-airlines-cargo', category:'air', accentColor:'#0078D2', trackUrl:'https://www.aacargo.com/tracking.html' },
  '006': { name:'Delta Cargo',          slug:'delta-cargo',             category:'air', accentColor:'#E01933', trackUrl:'https://www.deltacargo.com/Cargo/home/trackShipment' },
  '014': { name:'Air Canada Cargo',     slug:'air-canada-cargo',        category:'air', accentColor:'#D2001B', trackUrl:'https://www.aircanadacargo.com/en/cargo-tracking' },
  '020': { name:'Lufthansa Cargo',      slug:'lufthansa-cargo',         category:'air', accentColor:'#FFAD00', trackUrl:'https://lufthansa-cargo.com/eservices/tools/tracking?trackingNumber={n}' },
  '057': { name:'Air France Cargo',     slug:'air-france-cargo',        category:'air', accentColor:'#0032A0', trackUrl:'https://www.afklcargo.com/mycargo/shipment/detail' },
  '065': { name:'Saudia Cargo',         slug:'saudia-cargo',            category:'air', accentColor:'#00623A', trackUrl:'https://saudicargo.com/en/tracking' },
  '071': { name:'Ethiopian Cargo',      slug:'ethiopian-airlines',      category:'air', accentColor:'#009A44', trackUrl:'https://www.ethiopianairlines.com/en/information/cargo' },
  '074': { name:'KLM Cargo',            slug:'klm-cargo',               category:'air', accentColor:'#00A1DE', trackUrl:'https://www.afklcargo.com/mycargo/shipment/detail' },
  '082': { name:'Korean Air Cargo',     slug:'korean-air-cargo',        category:'air', accentColor:'#00256C', trackUrl:'https://www.koreanair.com/en/cargo/services/e-service/tracking' },
  '086': { name:'Air New Zealand Cargo',slug:'air-new-zealand-cargo',   category:'air', accentColor:'#00374F', trackUrl:'https://www.airnewzealand.co.nz/en/cargotracking' },
  '117': { name:'SAS Cargo',            slug:'sas-cargo',               category:'air', accentColor:'#002147', trackUrl:'https://www.sascargo.com/en/tools/track-your-shipment' },
  '125': { name:'IAG Cargo',            slug:'iag-cargo',               category:'air', accentColor:'#5321A8', trackUrl:'https://www.iagcargo.com/en/track-and-trace?trackingNumber={n}' },
  '131': { name:'Japan Airlines Cargo', slug:'japan-airlines-cargo',    category:'air', accentColor:'#E60013', trackUrl:'https://cargo.jal.co.jp/ems/en/' },
  '157': { name:'Qatar Cargo',          slug:'qatar-cargo',             category:'air', accentColor:'#5C0632', logoUrl:'/logos/qatar.svg', trackUrl:'https://www.qrcargo.com/s/track-shipment?trackingNumber={n}' },
  '160': { name:'Cathay Cargo',         slug:'cathay-pacific-cargo',    category:'air', accentColor:'#006564', trackUrl:'https://www.cathaycargo.com/track-your-shipment/?trackingNumber={n}' },
  '172': { name:'Cargolux',             slug:'cargolux',                category:'air', accentColor:'#003087', trackUrl:'https://www.cargolux.com/tracking?awb={n}' },
  '176': { name:'Emirates SkyCargo',    slug:'emirates-skycargo',       category:'air', accentColor:'#C41230', trackUrl:'https://www.skycargo.com/track-shipment/{n}' },
  '205': { name:'Japan Airlines Cargo', slug:'japan-airlines-cargo',    category:'air', accentColor:'#E60013', trackUrl:'https://cargo.jal.co.jp/ems/en/' },
  '218': { name:'Air China Cargo',      slug:'air-china-cargo',         category:'air', accentColor:'#CC0000', trackUrl:'https://cargo.airchina.com.cn/ACCargo/shippingQuery' },
  '235': { name:'Turkish Cargo',        slug:'turkish-cargo',           category:'air', accentColor:'#E30A17', trackUrl:'https://www.turkishcargo.com/en/online-services/track-trace?trackingNumber={n}' },
  '279': { name:'Cathay Cargo',         slug:'cathay-pacific-cargo',    category:'air', accentColor:'#006564', trackUrl:'https://www.cathaycargo.com/track-your-shipment/?trackingNumber={n}' },
  '297': { name:'China Southern Cargo', slug:'china-southern-cargo',    category:'air', accentColor:'#0F4FA8', trackUrl:'https://www.csair.com/en/cargo/service/tracking/' },
  '356': { name:'Cargolux',             slug:'cargolux',                category:'air', accentColor:'#003087', trackUrl:'https://www.cargolux.com/tracking?awb={n}' },
  '369': { name:'Qatar Cargo',          slug:'qatar-cargo',             category:'air', accentColor:'#5C0632', logoUrl:'/logos/qatar.svg', trackUrl:'https://www.qrcargo.com/s/track-shipment?trackingNumber={n}' },
  '406': { name:'FedEx',                slug:'fedex',                   category:'express', accentColor:'#FF6200', logoUrl:'/logos/fedex.svg', trackUrl:'https://www.fedex.com/fedextrack/?trknbr={n}' },
  '518': { name:'UPS',                  slug:'ups',                     category:'express', accentColor:'#8B5E3C', trackUrl:'https://www.ups.com/track?tracknum={n}' },
  '549': { name:'DHL',                  slug:'dhl',                     category:'express', accentColor:'#FFCC00', logoUrl:'/logos/dhl.svg', trackUrl:'https://www.dhl.com/global-en/home/tracking.html?tracking-id={n}' },
  '607': { name:'Etihad Cargo',         slug:'etihad-cargo',            category:'air', accentColor:'#A07C50', trackUrl:'https://www.etihadcargo.com/en/track-a-shipment?awbNumber={n}' },
  '618': { name:'Singapore Airlines Cargo', slug:'singapore-airlines-cargo', category:'air', accentColor:'#FFD700', trackUrl:'https://www.siacargo.com/' },
  '724': { name:'Swiss WorldCargo',     slug:'swiss-worldcargo',        category:'air', accentColor:'#D40000', trackUrl:'https://www.swissworldcargo.com/tracking' },
  '988': { name:'Asiana Cargo',         slug:'asiana-cargo',            category:'air', accentColor:'#0033A0', trackUrl:'https://flyasiana.com/C/en/cargo/tracking' },
}

// ── ISO 6346 container owner code → shipping line ────────────────────────────
const CONTAINER_CARRIERS: Record<string, Pick<DetectedCarrier, 'name' | 'slug' | 'accentColor' | 'logoUrl' | 'trackUrl'>> = {
  MAE: { name:'Maersk',      slug:'maersk',      accentColor:'#42ADEF', logoUrl:'/logos/maersk.svg', trackUrl:'https://www.maersk.com/tracking/{n}' },
  MSK: { name:'Maersk',      slug:'maersk',      accentColor:'#42ADEF', logoUrl:'/logos/maersk.svg', trackUrl:'https://www.maersk.com/tracking/{n}' },
  APM: { name:'Maersk',      slug:'maersk',      accentColor:'#42ADEF', logoUrl:'/logos/maersk.svg', trackUrl:'https://www.maersk.com/tracking/{n}' },
  SUD: { name:'Hamburg Süd', slug:'maersk',      accentColor:'#42ADEF', logoUrl:'/logos/maersk.svg', trackUrl:'https://www.maersk.com/tracking/{n}' },
  MSC: { name:'MSC',         slug:'msc',         accentColor:'#003087', logoUrl:'/logos/msc.svg',    trackUrl:'https://www.msc.com/en/track-a-shipment' },
  MSD: { name:'MSC',         slug:'msc',         accentColor:'#003087', logoUrl:'/logos/msc.svg',    trackUrl:'https://www.msc.com/en/track-a-shipment' },
  MEU: { name:'MSC',         slug:'msc',         accentColor:'#003087', logoUrl:'/logos/msc.svg',    trackUrl:'https://www.msc.com/en/track-a-shipment' },
  CMA: { name:'CMA CGM',     slug:'cma-cgm',     accentColor:'#C41230', logoUrl:'/logos/cmacgm.png', trackUrl:'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference={n}' },
  APR: { name:'CMA CGM',     slug:'cma-cgm',     accentColor:'#C41230', logoUrl:'/logos/cmacgm.png', trackUrl:'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference={n}' },
  COS: { name:'COSCO',       slug:'cosco',        accentColor:'#C8102E', trackUrl:'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&number={n}' },
  CBH: { name:'COSCO',       slug:'cosco',        accentColor:'#C8102E', trackUrl:'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&number={n}' },
  HLC: { name:'Hapag-Lloyd', slug:'hapag-lloyd',  accentColor:'#f59e0b', trackUrl:'https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html?container={n}' },
  HLX: { name:'Hapag-Lloyd', slug:'hapag-lloyd',  accentColor:'#f59e0b', trackUrl:'https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html?container={n}' },
  EIT: { name:'Evergreen',   slug:'evergreen-line', accentColor:'#00693E', trackUrl:'https://www.evergreen-line.com/service/cargo_tracking_detail.aspx?cn={n}' },
  EGL: { name:'Evergreen',   slug:'evergreen-line', accentColor:'#00693E', trackUrl:'https://www.evergreen-line.com/service/cargo_tracking_detail.aspx?cn={n}' },
  ONE: { name:'ONE',         slug:'one',           accentColor:'#E4003B', trackUrl:'https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=_QRY_BL_&search_type=C&cntNo={n}' },
  YML: { name:'Yang Ming',   slug:'yang-ming',     accentColor:'#003DA5', trackUrl:'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?cntrno={n}' },
  ZIM: { name:'ZIM',         slug:'zim',           accentColor:'#005BAC', trackUrl:'https://www.zim.com/tools/track-a-shipment?resultFor={n}' },
  PIL: { name:'PIL',         slug:'pil',           accentColor:'#003087', trackUrl:'https://www.pilship.com/en-tracking-pil-pacific-international-lines/76.html' },
  HMM: { name:'HMM',         slug:'hmm',           accentColor:'#E4003B', trackUrl:'https://www.hmm21.com/cms/business/ebiz/trackTrace/trackContainer/index.do?blContNo={n}' },
  WHL: { name:'Wan Hai',     slug:'wan-hai',       accentColor:'#0066CC', trackUrl:'https://www.wanhai.com/views/cargoTrack/CargoTrack.xhtml' },
}

// ── 4-char SCAC sea B/L prefixes ─────────────────────────────────────────────
const SCAC4_SEA: Record<string, Pick<DetectedCarrier, 'name' | 'slug' | 'accentColor' | 'logoUrl' | 'trackUrl'>> = {
  MAEU: { name:'Maersk',      slug:'maersk',      accentColor:'#42ADEF', logoUrl:'/logos/maersk.svg', trackUrl:'https://www.maersk.com/tracking/{n}' },
  MSKI: { name:'Maersk',      slug:'maersk',      accentColor:'#42ADEF', logoUrl:'/logos/maersk.svg', trackUrl:'https://www.maersk.com/tracking/{n}' },
  MSCU: { name:'MSC',         slug:'msc',         accentColor:'#003087', logoUrl:'/logos/msc.svg',    trackUrl:'https://www.msc.com/en/track-a-shipment' },
  MSCD: { name:'MSC',         slug:'msc',         accentColor:'#003087', logoUrl:'/logos/msc.svg',    trackUrl:'https://www.msc.com/en/track-a-shipment' },
  MEDU: { name:'MSC',         slug:'msc',         accentColor:'#003087', logoUrl:'/logos/msc.svg',    trackUrl:'https://www.msc.com/en/track-a-shipment' },
  GESU: { name:'MSC',         slug:'msc',         accentColor:'#003087', logoUrl:'/logos/msc.svg',    trackUrl:'https://www.msc.com/en/track-a-shipment' },
  HLCU: { name:'Hapag-Lloyd', slug:'hapag-lloyd',  accentColor:'#f59e0b', trackUrl:'https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-number.html?booking={n}' },
  HLXU: { name:'Hapag-Lloyd', slug:'hapag-lloyd',  accentColor:'#f59e0b', trackUrl:'https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-number.html?booking={n}' },
  COSU: { name:'COSCO',       slug:'cosco',         accentColor:'#C8102E', trackUrl:'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=BOOKINGNO&number={n}' },
  CBHU: { name:'COSCO',       slug:'cosco',         accentColor:'#C8102E', trackUrl:'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=BOOKINGNO&number={n}' },
  CMAU: { name:'CMA CGM',     slug:'cma-cgm',     accentColor:'#C41230', logoUrl:'/logos/cmacgm.png', trackUrl:'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=BookingNumber&Reference={n}' },
  APHU: { name:'CMA CGM',     slug:'cma-cgm',     accentColor:'#C41230', logoUrl:'/logos/cmacgm.png', trackUrl:'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=BookingNumber&Reference={n}' },
  EITU: { name:'Evergreen',   slug:'evergreen-line', accentColor:'#00693E', trackUrl:'https://www.evergreen-line.com/service/cargo_tracking_detail.aspx?cn={n}' },
  EGHU: { name:'Evergreen',   slug:'evergreen-line', accentColor:'#00693E', trackUrl:'https://www.evergreen-line.com/service/cargo_tracking_detail.aspx?cn={n}' },
  ONEY: { name:'ONE',         slug:'one',           accentColor:'#E4003B', trackUrl:'https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=_QRY_BL_&search_type=BL&blNo={n}' },
  ONEU: { name:'ONE',         slug:'one',           accentColor:'#E4003B', trackUrl:'https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=_QRY_BL_&search_type=BL&blNo={n}' },
  YMLU: { name:'Yang Ming',   slug:'yang-ming',     accentColor:'#003DA5', trackUrl:'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?cntrno={n}' },
  ZIMU: { name:'ZIM',         slug:'zim',           accentColor:'#005BAC', trackUrl:'https://www.zim.com/tools/track-a-shipment?resultFor={n}' },
}

function fill(url: string, n: string) { return url.replace('{n}', encodeURIComponent(n)) }

export function detectCarrier(raw: string): { carrier: DetectedCarrier; filledUrl: string } | null {
  const tn    = raw.trim()
  const upper = tn.toUpperCase()

  // ── 1. MAWB: NNN-NNNNNNNN ────────────────────────────────────────────────
  const mawbMatch = tn.match(/^(\d{3})-(\d{8})$/)
  if (mawbMatch) {
    const prefix = mawbMatch[1]
    const c = MAWB_CARRIERS[prefix]
    if (c) {
      const full: DetectedCarrier = { ...c, confidence: 'high', hint: 'Air Waybill' }
      return { carrier: full, filledUrl: fill(c.trackUrl ?? '', tn) }
    }
    // Unknown MAWB prefix — generic air redirect
    return {
      carrier: { name: 'Air Cargo', slug: 'air', category: 'air', accentColor: '#6366f1', confidence: 'high', hint: 'Air Waybill' },
      filledUrl: `https://www.track-ora.com/track/${encodeURIComponent(tn)}`,
    }
  }

  // ── 2. ISO 6346 container: [A-Z]{3}[UJZ]\d{7} ───────────────────────────
  if (/^[A-Z]{3}[UJZ]\d{7}$/i.test(upper)) {
    const ownerCode = upper.slice(0, 3)
    const c = CONTAINER_CARRIERS[ownerCode]
    if (c) {
      const full: DetectedCarrier = { ...c, confidence: 'high', category: 'sea', hint: 'Container' }
      return { carrier: full, filledUrl: fill(c.trackUrl ?? '', upper) }
    }
    return null
  }

  // ── 3. Sea B/L reference: 4-char SCAC prefix + alphanumeric ─────────────
  if (/^[A-Z]{4}/i.test(upper) && upper.length >= 9) {
    const prefix4 = upper.slice(0, 4)
    const c = SCAC4_SEA[prefix4]
    if (c) {
      const full: DetectedCarrier = { ...c, confidence: 'high', category: 'sea', hint: 'B/L or Booking Reference' }
      return { carrier: full, filledUrl: fill(c.trackUrl ?? '', upper) }
    }
  }

  // ── 4. UPS: 1Z + 16 alphanumeric ─────────────────────────────────────────
  if (/^1Z[0-9A-Z]{16}$/i.test(tn)) {
    return {
      carrier: { name: 'UPS', slug: 'ups', category: 'express', accentColor: '#8B5E3C', confidence: 'high' },
      filledUrl: `https://www.ups.com/track?tracknum=${encodeURIComponent(tn)}`,
    }
  }

  // ── 5. FedEx: 15 / 20 digits (high confidence)
  //        12 digits = medium — Evergreen B/L, Hapag-Lloyd bookings also use this length
  if (/^(\d{15}|\d{20})$/.test(tn)) {
    return {
      carrier: { name: 'FedEx', slug: 'fedex', category: 'express', accentColor: '#FF6200', logoUrl: '/logos/fedex.svg', confidence: 'high' },
      filledUrl: `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(tn)}`,
    }
  }
  if (/^\d{12}$/.test(tn)) {
    return {
      carrier: { name: 'FedEx', slug: 'fedex', category: 'express', accentColor: '#FF6200', logoUrl: '/logos/fedex.svg', confidence: 'medium' },
      filledUrl: `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(tn)}`,
    }
  }

  // ── 6. USPS: 20–22 digits ─────────────────────────────────────────────────
  if (/^\d{20,22}$/.test(tn)) {
    return {
      carrier: { name: 'USPS', slug: 'usps', category: 'post', accentColor: '#E31837', confidence: 'high' },
      filledUrl: `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${encodeURIComponent(tn)}`,
    }
  }

  // ── 7. DHL Express: 10 digits ─────────────────────────────────────────────
  if (/^\d{10}$/.test(tn)) {
    return {
      carrier: { name: 'DHL', slug: 'dhl', category: 'express', accentColor: '#FFCC00', logoUrl: '/logos/dhl.svg', confidence: 'high' },
      filledUrl: `https://www.dhl.com/global-en/home/tracking.html?tracking-id=${encodeURIComponent(tn)}`,
    }
  }

  // ── 8. Royal Mail: 2 letters + 9 digits + 2-letter country ───────────────
  if (/^[A-Z]{2}\d{9}[A-Z]{2}$/i.test(tn)) {
    return {
      carrier: { name: 'Royal Mail', slug: 'royal-mail', category: 'post', accentColor: '#D0021B', confidence: 'high' },
      filledUrl: `https://www.royalmail.com/portal/rm/track?trackNumber=${encodeURIComponent(tn.toUpperCase())}`,
    }
  }

  // ── 9a. Ajex Logistics (Saudi Arabia): AJA + digits ─────────────────────
  if (/^AJA\d+$/i.test(tn)) {
    return {
      carrier: { name: 'Ajex Logistics', slug: 'ajex', category: 'express', accentColor: '#E31837', confidence: 'high' },
      filledUrl: `https://aj-ex.com/shipment-tracking?waybill=${encodeURIComponent(tn)}`,
    }
  }

  // ── 9. Amazon: TBA + 12 digits ───────────────────────────────────────────
  if (/^TBA\d{12}$/i.test(tn)) {
    return {
      carrier: { name: 'Amazon', slug: 'amazon', category: 'express', accentColor: '#FF9900', confidence: 'high' },
      filledUrl: `https://www.amazon.com/progress-tracker/package?trackingId=${encodeURIComponent(tn)}`,
    }
  }

  // ── 10. SF Express: SF + 13 digits ──────────────────────────────────────
  if (/^SF\d{13}$/i.test(tn)) {
    return {
      carrier: { name: 'SF Express', slug: 'sf-express', category: 'express', accentColor: '#E3000F', confidence: 'high' },
      filledUrl: `https://www.sf-express.com/us/en/dynamic_function/waybill/#search/bill-number=${encodeURIComponent(tn)}`,
    }
  }

  // ── 11. PostNL: 3S + 3 letters + 9 digits ───────────────────────────────
  if (/^3S[A-Z]{3}\d{9}$/i.test(tn)) {
    return {
      carrier: { name: 'PostNL', slug: 'postnl', category: 'post', accentColor: '#FF6600', confidence: 'high' },
      filledUrl: `https://postnl.post/details/#/track-trace?tc=${encodeURIComponent(tn)}`,
    }
  }

  // ── 12. Hermes/Evri: 16 digits ───────────────────────────────────────────
  if (/^\d{16}$/.test(tn)) {
    return {
      carrier: { name: 'Hermes / Evri', slug: 'hermes', category: 'express', accentColor: '#009FE3', confidence: 'medium', trackUrl: 'https://www.evri.com/track-a-parcel#/reference?trackref={n}' } as DetectedCarrier,
      filledUrl: `https://www.evri.com/track-a-parcel#/reference?trackref=${encodeURIComponent(tn)}`,
    }
  }

  // ── 13. DPD: 14 digits ────────────────────────────────────────────────────
  if (/^\d{14}$/.test(tn)) {
    return {
      carrier: { name: 'DPD', slug: 'dpd', category: 'express', accentColor: '#dc0032', logoUrl: '/logos/dpd.svg', confidence: 'medium', trackUrl: 'https://tracking.dpd.de/status/en/parcel/{n}' } as DetectedCarrier,
      filledUrl: `https://tracking.dpd.de/status/en/parcel/${encodeURIComponent(tn)}`,
    }
  }

  // ── 14. TNT: 9 digits ────────────────────────────────────────────────────
  if (/^\d{9}$/.test(tn)) {
    return {
      carrier: { name: 'TNT / FedEx', slug: 'tnt', category: 'express', accentColor: '#FF6600', confidence: 'medium', trackUrl: 'https://www.tnt.com/express/en_gc/site/tracking.html?searchType=CON&cons={n}' } as DetectedCarrier,
      filledUrl: `https://www.tnt.com/express/en_gc/site/tracking.html?searchType=CON&cons=${encodeURIComponent(tn)}`,
    }
  }

  return null
}
