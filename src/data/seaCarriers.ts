/**
 * seaCarriers.ts
 * Deep-link tracking URLs for ocean carriers, indexed by reference type.
 * {n} = encoded tracking number.
 */

export type SeaRefType = 'container' | 'bl' | 'booking'

export interface SeaCarrier {
  name:        string
  slug:        string
  accentColor: string
  logoUrl?:    string
  // Per-reference-type tracking URLs. null = manual entry (no deep-link)
  urls: Partial<Record<SeaRefType, string | null>>
}

export const SEA_CARRIERS: SeaCarrier[] = [
  {
    name: 'Turkon', slug: 'turkon', accentColor: '#E30613',
    urls: {
      container: 'https://www.turkon.com/en/cargo-tracking/?no={n}',
      bl:        'https://www.turkon.com/en/cargo-tracking/?no={n}',
      booking:   'https://www.turkon.com/en/cargo-tracking/?no={n}',
    },
  },
  {
    name: 'Maersk', slug: 'maersk', accentColor: '#42ADEF', logoUrl: '/logos/maersk.svg',
    urls: {
      container: 'https://www.maersk.com/tracking/{n}',
      bl:        'https://www.maersk.com/tracking/{n}',
      booking:   'https://www.maersk.com/tracking/{n}',
    },
  },
  {
    name: 'MSC', slug: 'msc', accentColor: '#003087', logoUrl: '/logos/msc.svg',
    urls: {
      container: 'https://www.msc.com/en/track-a-shipment',
      bl:        'https://www.msc.com/en/track-a-shipment',
      booking:   'https://www.msc.com/en/track-a-shipment',
    },
  },
  {
    name: 'CMA CGM', slug: 'cma-cgm', accentColor: '#C41230', logoUrl: '/logos/cmacgm.png',
    urls: {
      container: 'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference={n}',
      bl:        'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=BillOfLading&Reference={n}',
      booking:   'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=BookingNumber&Reference={n}',
    },
  },
  {
    name: 'Hapag-Lloyd', slug: 'hapag-lloyd', accentColor: '#f59e0b',
    urls: {
      container: 'https://www.hapag-lloyd.com/en/online-business/track/track-by-container-solution.html?container={n}',
      bl:        'https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-number.html?booking={n}',
      booking:   'https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-number.html?booking={n}',
    },
  },
  {
    name: 'COSCO', slug: 'cosco', accentColor: '#C8102E',
    urls: {
      container: 'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&number={n}',
      bl:        'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=BL&number={n}',
      booking:   'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=BOOKINGNO&number={n}',
    },
  },
  {
    name: 'Evergreen', slug: 'evergreen-line', accentColor: '#00693E',
    urls: {
      container: 'https://www.evergreen-line.com/service/cargo_tracking_detail.aspx?cn={n}',
      bl:        'https://www.evergreen-line.com/service/cargo_tracking_detail.aspx?cn={n}',
      booking:   'https://www.evergreen-line.com/service/cargo_tracking_detail.aspx?cn={n}',
    },
  },
  {
    name: 'ONE', slug: 'one', accentColor: '#E4003B',
    urls: {
      container: 'https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=_QRY_BL_&search_type=C&cntNo={n}',
      bl:        'https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=_QRY_BL_&search_type=BL&blNo={n}',
      booking:   'https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=_QRY_BL_&search_type=BL&blNo={n}',
    },
  },
  {
    name: 'Yang Ming', slug: 'yang-ming', accentColor: '#003DA5',
    urls: {
      container: 'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?cntrno={n}',
      bl:        'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?cntrno={n}',
      booking:   'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?cntrno={n}',
    },
  },
  {
    name: 'ZIM', slug: 'zim', accentColor: '#005BAC',
    urls: {
      container: 'https://www.zim.com/tools/track-a-shipment?resultFor={n}',
      bl:        'https://www.zim.com/tools/track-a-shipment?resultFor={n}',
      booking:   'https://www.zim.com/tools/track-a-shipment?resultFor={n}',
    },
  },
  {
    name: 'HMM', slug: 'hmm', accentColor: '#E4003B',
    urls: {
      container: 'https://www.hmm21.com/cms/business/ebiz/trackTrace/trackContainer/index.do?blContNo={n}',
      bl:        'https://www.hmm21.com/cms/business/ebiz/trackTrace/trackContainer/index.do?blContNo={n}',
      booking:   null,
    },
  },
  {
    name: 'PIL', slug: 'pil', accentColor: '#003087',
    urls: {
      container: 'https://www.pilship.com/en-tracking-pil-pacific-international-lines/76.html',
      bl:        'https://www.pilship.com/en-tracking-pil-pacific-international-lines/76.html',
      booking:   null,
    },
  },
  {
    name: 'Wan Hai', slug: 'wan-hai', accentColor: '#0066CC',
    urls: {
      container: 'https://www.wanhai.com/views/cargoTrack/CargoTrack.xhtml',
      bl:        'https://www.wanhai.com/views/cargoTrack/CargoTrack.xhtml',
      booking:   null,
    },
  },
  {
    name: 'Hamburg Süd', slug: 'hamburg-sud', accentColor: '#42ADEF', logoUrl: '/logos/maersk.svg',
    urls: {
      container: 'https://www.maersk.com/tracking/{n}',
      bl:        'https://www.maersk.com/tracking/{n}',
      booking:   'https://www.maersk.com/tracking/{n}',
    },
  },
]

export const REF_TYPE_LABELS: Record<SeaRefType, { label: string; short: string; hint: string; emoji: string }> = {
  container: { label: 'Container Number', short: 'Container', hint: 'ISO format: 4 letters + 7 digits (e.g. MSCU1234567)', emoji: '📦' },
  bl:        { label: 'Bill of Lading',   short: 'B/L',       hint: 'B/L number from your shipping documents',             emoji: '📄' },
  booking:   { label: 'Booking Reference',short: 'Booking',   hint: 'Booking confirmation number from the carrier',         emoji: '📋' },
}

export function buildSeaUrl(carrier: SeaCarrier, refType: SeaRefType, number: string): string | null {
  const template = carrier.urls[refType]
  if (!template) return null
  return template.replace('{n}', encodeURIComponent(number.trim().toUpperCase()))
}
