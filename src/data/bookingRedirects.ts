// Carrier booking-number and B/L tracking portals
// Used when a user enters a booking reference instead of a tracking number.
// {booking} in trackUrl is replaced with the user's booking reference.

export interface BookingCarrier {
  name:              string
  slug:              string            // AfterShip / Shipsgo carrier slug
  category:          'sea' | 'air'
  accentColor:       string
  logoUrl?:          string            // local /logos/ path if available
  bookingUrl:        string            // {booking} placeholder
  supportsDeepLink:  boolean           // false = manual entry on carrier portal
  hint:              string            // label shown under the input
}

export const BOOKING_CARRIERS: BookingCarrier[] = [
  // ── Sea Freight ──────────────────────────────────────────────────────────────
  {
    name: 'Maersk',       slug: 'maersk',       category: 'sea',
    accentColor: '#42ADEF', logoUrl: '/logos/maersk.svg',
    bookingUrl: 'https://www.maersk.com/tracking/{booking}',
    supportsDeepLink: true,
    hint: 'Booking reference or B/L number',
  },
  {
    name: 'MSC',          slug: 'msc',           category: 'sea',
    accentColor: '#003087', logoUrl: '/logos/msc.svg',
    bookingUrl: 'https://www.msc.com/en/track-a-shipment',
    supportsDeepLink: false,
    hint: 'Booking reference',
  },
  {
    name: 'CMA CGM',      slug: 'cma-cgm',       category: 'sea',
    accentColor: '#C41230', logoUrl: '/logos/cmacgm.png',
    bookingUrl: 'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=BookingNumber&Reference={booking}',
    supportsDeepLink: true,
    hint: 'Booking reference',
  },
  {
    name: 'Hapag-Lloyd',  slug: 'hapag-lloyd',   category: 'sea',
    accentColor: '#f59e0b',
    bookingUrl: 'https://www.hapag-lloyd.com/en/online-business/track/track-by-booking-number.html?booking={booking}',
    supportsDeepLink: true,
    hint: 'Booking reference',
  },
  {
    name: 'COSCO',        slug: 'cosco',          category: 'sea',
    accentColor: '#C8102E',
    bookingUrl: 'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=BOOKINGNO&number={booking}',
    supportsDeepLink: true,
    hint: 'Booking reference',
  },
  {
    name: 'Evergreen',    slug: 'evergreen-line', category: 'sea',
    accentColor: '#00693E',
    bookingUrl: 'https://www.evergreen-line.com/eservice/Eservice.do?service=BLQuery&blno={booking}',
    supportsDeepLink: true,
    hint: 'Booking reference or B/L',
  },
  {
    name: 'ONE',          slug: 'one',            category: 'sea',
    accentColor: '#E4003B',
    bookingUrl: 'https://ecomm.one-line.com/ecom/CUP_HOM_3301.do?f_cmd=_QRY_BL_&search_type=BL&blNo={booking}',
    supportsDeepLink: true,
    hint: 'B/L number',
  },
  {
    name: 'Yang Ming',    slug: 'yang-ming',      category: 'sea',
    accentColor: '#003DA5',
    bookingUrl: 'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?cntrno={booking}',
    supportsDeepLink: true,
    hint: 'Booking or B/L number',
  },
  {
    name: 'ZIM',          slug: 'zim',            category: 'sea',
    accentColor: '#005BAC',
    bookingUrl: 'https://www.zim.com/tools/track-a-shipment?resultFor={booking}',
    supportsDeepLink: true,
    hint: 'Booking or B/L number',
  },

  // ── Air Freight ──────────────────────────────────────────────────────────────
  {
    name: 'Qatar Cargo',     slug: 'qatar-cargo',              category: 'air',
    accentColor: '#5C0632', logoUrl: '/logos/qatar.svg',
    bookingUrl: 'https://www.qrcargo.com/s/track-shipment?trackingNumber={booking}',
    supportsDeepLink: true,
    hint: 'Booking reference or AWB',
  },
  {
    name: 'Emirates Cargo',  slug: 'emirates-skycargo',        category: 'air',
    accentColor: '#C41230',
    bookingUrl: 'https://www.skycargo.com/track-shipment/{booking}',
    supportsDeepLink: true,
    hint: 'Booking reference or AWB',
  },
  {
    name: 'Lufthansa Cargo', slug: 'lufthansa-cargo',          category: 'air',
    accentColor: '#FFAD00',
    bookingUrl: 'https://lufthansa-cargo.com/eservices/tools/tracking',
    supportsDeepLink: false,
    hint: 'Booking reference',
  },
  {
    name: 'Turkish Cargo',   slug: 'turkish-cargo',            category: 'air',
    accentColor: '#E30A17',
    bookingUrl: 'https://www.turkishcargo.com/en/online-services/track-trace?trackingNumber={booking}',
    supportsDeepLink: true,
    hint: 'Booking reference or AWB',
  },
  {
    name: 'Singapore Air',   slug: 'singapore-airlines-cargo', category: 'air',
    accentColor: '#FFD700',
    bookingUrl: 'https://www.siacargo.com/',
    supportsDeepLink: false,
    hint: 'Booking reference',
  },
  {
    name: 'Air France KLM',  slug: 'air-france-cargo',         category: 'air',
    accentColor: '#0032A0',
    bookingUrl: 'https://www.afklcargo.com/mycargo/shipment/detail',
    supportsDeepLink: false,
    hint: 'Booking reference or AWB',
  },
  {
    name: 'Cathay Cargo',    slug: 'cathay-pacific-cargo',     category: 'air',
    accentColor: '#006564',
    bookingUrl: 'https://www.cathaycargo.com/track-your-shipment/',
    supportsDeepLink: false,
    hint: 'Booking reference or AWB',
  },
  {
    name: 'IAG Cargo',       slug: 'iag-cargo',                category: 'air',
    accentColor: '#5321A8',
    bookingUrl: 'https://www.iagcargo.com/en/track-and-trace',
    supportsDeepLink: false,
    hint: 'Booking reference',
  },
  {
    name: 'Oman Air Cargo',  slug: 'oman-air',                 category: 'air',
    accentColor: '#B8232F',
    bookingUrl: 'https://www.omanair.com/en/cargo/track-shipment?awb={booking}',
    supportsDeepLink: true,
    hint: 'AWB number (e.g. 910-18547012)',
  },
]

export function getBookingCarrier(slug: string): BookingCarrier | undefined {
  return BOOKING_CARRIERS.find(c => c.slug === slug)
}

export function buildBookingUrl(carrier: BookingCarrier, bookingRef: string): string {
  return carrier.bookingUrl.replace('{booking}', encodeURIComponent(bookingRef))
}
