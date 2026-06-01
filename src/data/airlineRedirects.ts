// IATA 3-digit prefix → airline redirect info
// Used when MAWB tracking cannot be fetched via API —
// instead of "not found" we redirect to the carrier's official portal.

export interface AirlineRedirect {
  trackingNumber: string   // normalised "XXX-XXXXXXXX"
  prefix: string
  serial: string
  airline: string          // display name
  logoSlug: string         // AfterShip CDN slug for the logo SVG
  trackUrl: string         // pre-filled deep-link (may be homepage if no URL param support)
  supportsDeepLink: boolean
}

interface AirlineInfo {
  name: string
  logoSlug: string
  // Placeholders replaced at runtime:
  //   {awb}   → "XXX-XXXXXXXX" (URL-encoded)
  //   {prefix} → "XXX"
  //   {serial} → "XXXXXXXX"
  //   {nosep}  → "XXXXXXXXXXXXXXXXX" (prefix+serial, no dash — used by some portals)
  trackUrl: string
  supportsDeepLink: boolean
}

const AIRLINE_MAP: Record<string, AirlineInfo> = {
  '001': { name: 'American Airlines Cargo',   logoSlug: 'american-airlines-cargo',   trackUrl: 'https://www.aacargo.com/manage/track-packages-forms.html',                                          supportsDeepLink: false },
  '006': { name: 'Delta Cargo',               logoSlug: 'delta',                     trackUrl: 'https://www.deltacargo.com/Cargo/home/shipment_tracking?awb={awb}',                                supportsDeepLink: true  },
  '014': { name: 'Air Canada Cargo',          logoSlug: 'air-canada',                trackUrl: 'https://www.aircanada.com/cargo/en/tracking/',                                                      supportsDeepLink: false },
  '020': { name: 'Lufthansa Cargo',           logoSlug: 'lufthansa-cargo',           trackUrl: 'https://lufthansa-cargo.com/eservices/tools/tracking?trackingId={awb}',                            supportsDeepLink: true  },
  '057': { name: 'Air France Cargo',          logoSlug: 'air-france-cargo',          trackUrl: 'https://www.afklcargo.com/mycargo/shipment/detail?awb={awb}',                                      supportsDeepLink: true  },
  '065': { name: 'Saudia Cargo',              logoSlug: 'saudia-cargo',              trackUrl: 'https://saudiacargo.com/E-SERVICES/SHIPMENT-TRACKING.aspx',                                        supportsDeepLink: false },
  '071': { name: 'Ethiopian Airlines Cargo',  logoSlug: 'ethiopian-airlines',        trackUrl: 'https://cargo.ethiopianairlines.com/my-cargo/track-your-shipment',                                 supportsDeepLink: false },
  '072': { name: 'Gulf Air Cargo',            logoSlug: 'gulf-air',                  trackUrl: 'https://ebooking.champ.aero/webtracking/gf/tracking.asp',                                          supportsDeepLink: false },
  '074': { name: 'KLM Cargo',                 logoSlug: 'klm-cargo',                 trackUrl: 'https://www.afklcargo.com/mycargo/shipment/detail?awb={awb}',                                      supportsDeepLink: true  },
  '082': { name: 'Korean Air Cargo',          logoSlug: 'korean-air-cargo',          trackUrl: 'https://cargo.koreanair.com/en/tracking.html',                                                      supportsDeepLink: false },
  '086': { name: 'Air New Zealand Cargo',     logoSlug: 'air-new-zealand',           trackUrl: 'https://www.airnewzealand.co.nz/freight-and-cargo',                                                supportsDeepLink: false },
  '117': { name: 'SAS Cargo',                 logoSlug: 'sas-cargo',                 trackUrl: 'https://sascargo.com/',                                                                             supportsDeepLink: false },
  '125': { name: 'British Airways World Cargo',logoSlug:'british-airways-world-cargo',trackUrl: 'https://www.iagcargo.com/en/track-and-trace?trackingNumbers={awb}',                               supportsDeepLink: true  },
  '131': { name: 'Japan Airlines Cargo',      logoSlug: 'japan-airlines-cargo',      trackUrl: 'https://jal.co.jp/en/jalcargo/inter/awb/',                                                         supportsDeepLink: false },
  '157': { name: 'Qatar Airways Cargo',       logoSlug: 'qatar-cargo',               trackUrl: 'https://www.qrcargo.com/s/track-your-shipment',                                                    supportsDeepLink: false },
  '160': { name: 'Cathay Cargo',              logoSlug: 'cathay-pacific-cargo',      trackUrl: 'https://www.cathaycargo.com/en-us/track-and-trace.html',                                           supportsDeepLink: false },
  '172': { name: 'Cargolux',                  logoSlug: 'cargolux',                  trackUrl: 'https://www.cargolux.com/track-and-Trace',                                                         supportsDeepLink: false },
  '176': { name: 'Emirates SkyCargo',         logoSlug: 'emirates-skycargo',         trackUrl: 'https://www.skycargo.com/shipping-services/track-shipments?type=AWB&id={awb}',                    supportsDeepLink: true  },
  '180': { name: 'Korean Air Cargo',          logoSlug: 'korean-air-cargo',          trackUrl: 'https://cargo.koreanair.com/en/tracking.html',                                                      supportsDeepLink: false },
  '205': { name: 'Japan Airlines Cargo',      logoSlug: 'japan-airlines-cargo',      trackUrl: 'https://jal.co.jp/en/jalcargo/inter/awb/',                                                         supportsDeepLink: false },
  '218': { name: 'Air China Cargo',           logoSlug: 'air-china',                 trackUrl: 'https://www.airchinacargo.com/',                                                                    supportsDeepLink: false },
  '235': { name: 'Turkish Cargo',             logoSlug: 'turkish-cargo',             trackUrl: 'https://www.turkishcargo.com/en/cargo-tracking?awbPrefix={prefix}&awbNumber={serial}',            supportsDeepLink: true  },
  '279': { name: 'Cathay Cargo',              logoSlug: 'cathay-pacific-cargo',      trackUrl: 'https://www.cathaycargo.com/en-us/track-and-trace.html',                                           supportsDeepLink: false },
  '297': { name: 'China Southern Cargo',      logoSlug: 'china-southern',            trackUrl: 'https://www.csair.com/en/cargo/',                                                                   supportsDeepLink: false },
  '356': { name: 'Cargolux Italia',           logoSlug: 'cargolux',                  trackUrl: 'https://www.cargolux.com/track-and-Trace',                                                         supportsDeepLink: false },
  '369': { name: 'Qatar Airways Cargo',       logoSlug: 'qatar-cargo',               trackUrl: 'https://www.qrcargo.com/s/track-your-shipment',                                                    supportsDeepLink: false },
  '607': { name: 'Etihad Cargo',              logoSlug: 'etihad-cargo',              trackUrl: 'https://www.etihadcargo.com/en/e-services/shipment-tracking',                                      supportsDeepLink: false },
  '618': { name: 'Singapore Airlines Cargo',  logoSlug: 'singapore-airlines-cargo',  trackUrl: 'https://www.siacargo.com/e-services/quicksearch_public/',                                          supportsDeepLink: false },
  '724': { name: 'Swiss WorldCargo',          logoSlug: 'swiss-worldcargo',          trackUrl: 'https://www.swissworldcargo.com/en/track_n_trace',                                                 supportsDeepLink: false },
  '988': { name: 'Asiana Cargo',              logoSlug: 'asiana-cargo',              trackUrl: 'https://www.asianacargo.com/tracking/viewTraceAirWaybill.do?lang=en&awbNumber={nosep}',            supportsDeepLink: true  },
  '910': { name: 'Oman Air Cargo',            logoSlug: 'oman-air',                  trackUrl: 'https://www.omanair.com/en/cargo/track-shipment',                                                      supportsDeepLink: false },
}

// These prefixes are handled well by AfterShip already — no redirect needed
const API_HANDLED = new Set(['406', '518', '549'])

export function getAirlineRedirect(trackingNumber: string): AirlineRedirect | null {
  const match = trackingNumber.trim().match(/^(\d{3})-(\d{8})$/)
  if (!match) return null

  const prefix = match[1]
  const serial = match[2]

  // Let AfterShip handle FedEx / UPS / DHL Express MAWBs
  if (API_HANDLED.has(prefix)) return null

  const info = AIRLINE_MAP[prefix]
  if (!info) return null

  const awb = `${prefix}-${serial}`
  const trackUrl = info.trackUrl
    .replace('{awb}',    encodeURIComponent(awb))
    .replace('{prefix}', prefix)
    .replace('{serial}', serial)
    .replace('{nosep}',  prefix + serial)   // no-dash format, e.g. Asiana

  return {
    trackingNumber: awb,
    prefix,
    serial,
    airline: info.name,
    logoSlug: info.logoSlug,
    trackUrl,
    supportsDeepLink: info.supportsDeepLink,
  }
}
