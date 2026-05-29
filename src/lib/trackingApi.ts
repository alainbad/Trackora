/**
 * trackingApi.ts
 * Unified shipment lookup:
 *   - Demo IDs → instant mock data (always works)
 *   - Real IDs → Supabase Edge Function → AfterShip → Trackora Shipment
 */
import { supabase } from './supabase'
import { getShipment } from '../data/mockShipments'
import type { Shipment } from '../data/mockShipments'

const EDGE_FN = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/track-shipment`
  : null

// ── Carrier name normalisation ────────────────────────────────────────────────
// AfterShip returns names like "Dhl", "Ups", "Fedex", "Dpd uk" — fix capitalisation.
const CARRIER_NAME_MAP: Record<string, string> = {
  // ── Ocean / sea carriers (Shipsgo may return full legal names) ────────────
  'msc':                                      'MSC',
  'msc mediterranean':                        'MSC',
  'mediterranean shipping':                   'MSC',
  'mediterranean shipping company':           'MSC',
  'msc mediterranean shipping':               'MSC',
  'msc mediterranean shipping co.':           'MSC',
  'msc mediterranean shipping company':       'MSC',
  'msc mediterranean shipping company sa':    'MSC',
  'maersk':                                   'Maersk',
  'a.p. moller - maersk':                     'Maersk',
  'a.p. moller maersk':                       'Maersk',
  'hamburg sud':                              'Hamburg Süd',
  'hamburg süd':                              'Hamburg Süd',
  'hapag-lloyd':                              'Hapag-Lloyd',
  'hapag lloyd':                              'Hapag-Lloyd',
  'hapag lloyd ag':                           'Hapag-Lloyd',
  'cma cgm':                                  'CMA CGM',
  'cma-cgm':                                  'CMA CGM',
  'cma cgm s.a.':                             'CMA CGM',
  'apl':                                      'CMA CGM',
  'cosco':                                    'COSCO',
  'cosco shipping':                           'COSCO',
  'cosco shipping lines':                     'COSCO',
  'china ocean shipping':                     'COSCO',
  'evergreen':                                'Evergreen',
  'evergreen line':                           'Evergreen',
  'evergreen marine':                         'Evergreen',
  'evergreen marine corp':                    'Evergreen',
  'one':                                      'ONE Line',
  'one line':                                 'ONE Line',
  'ocean network express':                    'ONE Line',
  'yang ming':                                'Yang Ming',
  'yang ming marine':                         'Yang Ming',
  'yang ming marine transport':               'Yang Ming',
  'zim':                                      'ZIM',
  'zim integrated':                           'ZIM',
  'zim integrated shipping':                  'ZIM',
  'pil':                                      'PIL',
  'pacific international lines':              'PIL',
  'hmm':                                      'HMM',
  'hyundai merchant marine':                  'HMM',
  'wan hai':                                  'Wan Hai',
  'wan hai lines':                            'Wan Hai',
  'simatech':                                 'Simatech',
  'others':                                   'Ocean Carrier',
  // DHL family
  'dhl':                 'DHL',
  'dhl express':         'DHL Express',
  'dhl ecommerce':       'DHL eCommerce',
  'dhl paket':           'DHL Paket',
  'dhl de':              'DHL',
  // UPS
  'ups':                 'UPS',
  'ups mail innovations':'UPS Mail Innovations',
  // FedEx
  'fedex':               'FedEx',
  'fedex uk':            'FedEx UK',
  // TNT / FedEx Express
  'tnt':                 'TNT',
  // USPS
  'usps':                'USPS',
  // DPD family (AfterShip returns "Dpd uk", "Dpd de", etc.)
  'dpd':                 'DPD',
  'dpd uk':              'DPD UK',
  'dpd de':              'DPD',
  'dpd fr':              'DPD',
  'dpd nl':              'DPD',
  'dpd be':              'DPD',
  'dpd pl':              'DPD',
  'dpd cz':              'DPD',
  'dpd sk':              'DPD',
  'dpd hu':              'DPD',
  'dpd ro':              'DPD',
  'dpd ru':              'СДЭК/DPD',
  // GLS
  'gls':                 'GLS',
  'gls de':              'GLS',
  'gls nl':              'GLS',
  // Hermes / Evri
  'hermes':              'Hermes',
  'hermes uk':           'Evri',
  'evri':                'Evri',
  // Other
  'brt':                 'BRT',
  'brt it':              'BRT',
  'aramex':              'Aramex',
  'sf express':          'SF Express',
  'cainiao':             'Cainiao',
  'yanwen':              'Yanwen',
  'yun express':         'Yun Express',
  '4px':                 '4PX',
  'postnl':              'PostNL',
  'post nl':             'PostNL',
  'colissimo':           'Colissimo',
  'laposte':             'La Poste',
  'la poste':            'La Poste',
  'chronopost':          'Chronopost',
  'correos':             'Correos',
  'dhl global mail':     'DHL Global Mail',
  'royal mail':          'Royal Mail',
  'parcelforce':         'Parcelforce',
}

function normaliseCarrierName(name: string): string {
  if (!name) return name
  return CARRIER_NAME_MAP[name.toLowerCase()] ?? name
}

// ── Carrier → direct tracking URL (for "check on carrier site" links) ─────────
const CARRIER_TRACK_URLS: Record<string, (tn: string) => string> = {
  // ── Ocean / sea carriers ──────────────────────────────────────────────────
  'MSC':            ()  => 'https://www.msc.com/track-a-shipment',
  'Maersk':         tn  => `https://www.maersk.com/tracking/${encodeURIComponent(tn)}`,
  'Hamburg Süd':    tn  => `https://www.maersk.com/tracking/${encodeURIComponent(tn)}`,
  'Hapag-Lloyd':    tn  => `https://www.hapag-lloyd.com/en/online-business/tracking/tracking-by-container-number.html?container=${encodeURIComponent(tn)}`,
  'CMA CGM':        tn  => `https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference=${encodeURIComponent(tn)}`,
  'COSCO':          tn  => `https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&number=${encodeURIComponent(tn)}`,
  'Evergreen':      tn  => `https://www.evergreen-line.com/service/cargo_tracking_detail.aspx?cn=${encodeURIComponent(tn)}`,
  'ONE Line':       tn  => `https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=_QRY_BL_&search_type=C&cntNo=${encodeURIComponent(tn)}`,
  'Yang Ming':      tn  => `https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?cntrno=${encodeURIComponent(tn)}`,
  'ZIM':            tn  => `https://www.zim.com/tools/track-a-shipment?resultFor=${encodeURIComponent(tn)}`,
  'PIL':            ()  => 'https://www.pilship.com/en-tracking-pil-pacific-international-lines/76.html',
  'HMM':            tn  => `https://www.hmm21.com/cms/business/ebiz/trackTrace/trackContainer/index.do?blContNo=${encodeURIComponent(tn)}`,
  'Wan Hai':        ()  => 'https://www.wanhai.com/views/cargoTrack/CargoTrack.xhtml',
  // ── Express / parcel carriers ─────────────────────────────────────────────
  'DHL':            tn => `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${tn}`,
  'DHL Express':    tn => `https://www.dhl.com/global-en/home/tracking/tracking-express.html?submit=1&tracking-id=${tn}`,
  'DHL eCommerce':  tn => `https://www.dhl.com/global-en/home/tracking/tracking-ecommerce.html?submit=1&tracking-id=${tn}`,
  'DHL Paket':      tn => `https://www.dhl.de/de/privatkunden/pakete-empfangen/verfolgen.html?piececode=${tn}`,
  'UPS':            tn => `https://www.ups.com/track?loc=en_US&tracknum=${tn}`,
  'FedEx':          tn => `https://www.fedex.com/fedextrack/?trknbr=${tn}`,
  'FedEx UK':       tn => `https://www.fedex.com/fedextrack/?trknbr=${tn}`,
  'TNT':            tn => `https://www.tnt.com/express/en_gc/site/tracking.html?searchType=CON&cons=${tn}`,
  'Aramex':         tn => `https://www.aramex.com/us/en/track/results?ShipmentNumber=${tn}`,
  'DPD':            tn => `https://tracking.dpd.de/status/en/parcel/${tn}`,
  'DPD UK':         tn => `https://www.dpd.co.uk/apps/tracking/?reference=${tn}`,
  'GLS':            tn => `https://gls-group.com/track/${tn}`,
  'PostNL':         tn => `https://postnl.post/details/#/track-trace?tc=${tn}`,
  'Royal Mail':     tn => `https://www.royalmail.com/portal/rm/track?trackNumber=${tn}`,
  'Evri':           tn => `https://www.evri.com/track-a-parcel#/reference?trackref=${tn}`,
  'Hermes':         tn => `https://www.myhermes.co.uk/track#/parcel/${tn}/details`,
  'Colissimo':      tn => `https://www.laposte.fr/outils/suivre-vos-envois?code=${tn}`,
  'La Poste':       tn => `https://www.laposte.fr/outils/suivre-vos-envois?code=${tn}`,
  'Correos':        tn => `https://www.correos.es/es/en/tools/shipment-tracking/detail?tracking-number=${tn}`,
  'Parcelforce':    tn => `https://www.parcelforce.com/track-trace?trackNumber=${tn}`,
  'SF Express':     tn => `https://www.sf-international.com/us/en/dynamic_function/waybill/#search/bill-number=${tn}`,
}

export function getCarrierTrackUrl(carrier: string, trackingNumber: string): string | null {
  const fn = CARRIER_TRACK_URLS[carrier]
  return fn ? fn(trackingNumber) : null
}

// ── Status label ──────────────────────────────────────────────────────────────
function statusLabel(status: string): string {
  const map: Record<string, string> = {
    in_transit:       'In Transit',
    delivered:        'Delivered',
    delayed:          'Delayed',
    picked_up:        'Picked Up',
    out_for_delivery: 'Out for Delivery',
    customs:          'Customs Hold',
  }
  return map[status] ?? 'In Transit'
}

// ── Adapt Edge Function response → UI Shipment type ───────────────────────────
function adaptApiShipment(d: Record<string, unknown>): Shipment {
  type ApiLoc = { city: string; country: string; lat: number; lng: number }
  type ApiCp  = { status: string; location: string; timestamp: string; completed: boolean }

  const origin  = d.origin          as ApiLoc
  const dest    = d.destination     as ApiLoc
  const cur     = d.currentLocation as { lat: number; lng: number }

  // Edge Function returns timeline newest-first; reverse for display (oldest top)
  const apiTimeline = (d.timeline as ApiCp[]) ?? []
  const reversed    = [...apiTimeline].reverse()

  const timeline: Shipment['timeline'] = reversed.map((cp, i) => {
    const dt      = cp.timestamp ? new Date(cp.timestamp) : null
    const dateStr = dt ? dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
    const timeStr = dt ? dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : ''
    const isMostRecent = i === reversed.length - 1
    return {
      date:        dateStr,
      time:        timeStr,
      status:      cp.status   || 'Update',
      location:    cp.location || '',
      description: cp.status   || 'Update',
      type:        (isMostRecent ? 'current' : 'completed') as 'completed' | 'current' | 'upcoming',
    }
  })

  // Add expected delivery as upcoming step when not yet delivered
  const status = (d.status as string) ?? 'in_transit'
  if (status !== 'delivered' && d.estimatedDelivery && d.estimatedDelivery !== 'TBD') {
    timeline.push({
      date:        d.estimatedDelivery as string,
      time:        '',
      status:      'Expected Delivery',
      location:    `${dest.city}, ${dest.country}`,
      description: 'Estimated arrival based on carrier data',
      type:        'upcoming',
    })
  }

  // Current location — parse from the newest checkpoint's location string
  const latestLoc   = apiTimeline[0]?.location ?? ''       // [0] = newest in API list
  const [rawCity, ...countryParts] = latestLoc.split(',')
  const curCity     = rawCity?.trim()     || dest.city || ''
  const curCountry  = countryParts.join(',').trim() || dest.country || ''

  const freightType = (d.freightType as 'air' | 'sea' | 'land' | 'express') ?? 'express'

  return {
    id:              (d.id as string) || (d.trackingNumber as string),
    trackingNumber:  d.trackingNumber as string,
    carrier:         normaliseCarrierName(d.carrier as string),
    freightType,
    status:          status as Shipment['status'],
    statusLabel:     statusLabel(status),
    origin:          { city: origin.city || '', country: origin.country || '', code: '', lat: origin.lat, lng: origin.lng },
    destination:     { city: dest.city  || '', country: dest.country  || '', code: '', lat: dest.lat,  lng: dest.lng  },
    currentLocation: { city: curCity, country: curCountry, lat: cur.lat, lng: cur.lng },
    estimatedDelivery: (d.estimatedDelivery as string) ?? 'TBD',
    aiEta:             (d.estimatedDelivery as string) ?? 'TBD',
    etaConfidence:     (d.etaConfidence    as number)  ?? 75,
    weight:            `${(d.weightKg      as number)  ?? '—'} kg`,
    dimensions:        '—',
    pieces:            1,
    service:           normaliseCarrierName(d.carrier as string),
    carbonKg:          (d.carbonKg as number) ?? 0,
    timeline,
    waypoints: [
      { lat: origin.lat, lng: origin.lng, label: origin.city },
      { lat: cur.lat,    lng: cur.lng,    label: curCity },
      { lat: dest.lat,   lng: dest.lng,   label: dest.city },
    ],
    delayRisk:      (d.delayRisk      as 'low' | 'medium' | 'high') ?? 'low',
    delayReason:    (d.delayReason    as string | undefined)         ?? undefined,
    dangerousGoods: (d.dangerousGoods as boolean | undefined)        ?? false,
  }
}

// ── Public API ────────────────────────────────────────────────────────────────
/**
 * Look up a shipment by tracking number.
 * - Demo IDs (1Z999AA…, MAD…, MAWB…, CNTR…) return instant mock data.
 * - All other numbers are sent to the AfterShip proxy Edge Function.
 * - Returns null if not found or if the Edge Function is not yet deployed.
 */
export async function fetchShipment(trackingNumber: string, carrierSlug?: string): Promise<Shipment | null> {
  // 1. Demo IDs always work instantly
  const demo = getShipment(trackingNumber)
  if (demo) return demo

  // 2. Real lookup via Edge Function (requires Supabase + AfterShip configured)
  if (!EDGE_FN || !supabase) return null

  try {
    // Get session JWT if logged in — used by the Edge Function to save results to Supabase
    const { data: { session } } = await supabase.auth.getSession()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    // Supabase gateway always requires an Authorization header even with --no-verify-jwt.
    // Prefer the user's JWT (enables saving results to DB); fall back to the anon key.
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    } else {
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
      if (anonKey) headers['Authorization'] = `Bearer ${anonKey}`
    }

    const res = await fetch(EDGE_FN, {
      method:  'POST',
      headers,
      body:    JSON.stringify(carrierSlug ? { trackingNumber, carrierSlug } : { trackingNumber }),
    })

    if (!res.ok) {
      // Log non-404 errors so they're visible in the browser console
      if (res.status !== 404) {
        const text = await res.text().catch(() => '')
        console.error(`[trackingApi] Edge Function error ${res.status}:`, text)
      }
      return null
    }

    const json = await res.json() as { data?: Record<string, unknown>; error?: string }
    if (!json.data) return null

    return adaptApiShipment(json.data)
  } catch (err) {
    console.error('[trackingApi] fetch failed:', err)
    return null
  }
}
