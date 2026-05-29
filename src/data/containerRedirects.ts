// ISO 6346 container owner code (first 3 chars) → shipping line redirect info
// Used when container tracking cannot be fetched via Shipsgo / 17track —
// instead of "not found" we redirect to the carrier's official portal.

export interface ContainerRedirect {
  containerNumber: string    // normalised uppercase, no spaces
  ownerCode: string          // first 3 chars
  shippingLine: string       // display name
  logoSlug: string           // AfterShip CDN slug for logo SVG
  trackUrl: string           // pre-filled deep-link (or homepage fallback)
  supportsDeepLink: boolean
}

interface ShippingLineInfo {
  name: string
  logoSlug: string
  // {container} → full container number (e.g. MSCU1234567)
  trackUrl: string
  supportsDeepLink: boolean
}

const OWNER_MAP: Record<string, ShippingLineInfo> = {
  // ── MSC ──────────────────────────────────────────────────────────────────────
  'MSC': { name: 'MSC', logoSlug: 'msc',
    trackUrl: 'https://www.msc.com/track-a-shipment',
    supportsDeepLink: false },
  'MSD': { name: 'MSC', logoSlug: 'msc',
    trackUrl: 'https://www.msc.com/track-a-shipment',
    supportsDeepLink: false },
  'MSG': { name: 'MSC', logoSlug: 'msc',
    trackUrl: 'https://www.msc.com/track-a-shipment',
    supportsDeepLink: false },

  // ── Maersk ───────────────────────────────────────────────────────────────────
  'MAE': { name: 'Maersk', logoSlug: 'maersk',
    trackUrl: 'https://www.maersk.com/tracking/{container}',
    supportsDeepLink: true },
  'MSK': { name: 'Maersk', logoSlug: 'maersk',
    trackUrl: 'https://www.maersk.com/tracking/{container}',
    supportsDeepLink: true },
  'MRK': { name: 'Maersk', logoSlug: 'maersk',
    trackUrl: 'https://www.maersk.com/tracking/{container}',
    supportsDeepLink: true },
  'APM': { name: 'Maersk', logoSlug: 'maersk',
    trackUrl: 'https://www.maersk.com/tracking/{container}',
    supportsDeepLink: true },
  // Hamburg Süd (acquired by Maersk)
  'SUD': { name: 'Hamburg Süd', logoSlug: 'maersk',
    trackUrl: 'https://www.maersk.com/tracking/{container}',
    supportsDeepLink: true },

  // ── CMA CGM ──────────────────────────────────────────────────────────────────
  'CMA': { name: 'CMA CGM', logoSlug: 'cma-cgm',
    trackUrl: 'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference={container}',
    supportsDeepLink: true },
  'APR': { name: 'APL (CMA CGM)', logoSlug: 'cma-cgm',
    trackUrl: 'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference={container}',
    supportsDeepLink: true },
  'ANL': { name: 'ANL (CMA CGM)', logoSlug: 'cma-cgm',
    trackUrl: 'https://www.cma-cgm.com/ebusiness/tracking/search?SearchBy=Container&Reference={container}',
    supportsDeepLink: true },

  // ── COSCO ────────────────────────────────────────────────────────────────────
  'CSN': { name: 'COSCO Shipping', logoSlug: 'cosco',
    trackUrl: 'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&number={container}',
    supportsDeepLink: true },
  'COS': { name: 'COSCO Shipping', logoSlug: 'cosco',
    trackUrl: 'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&number={container}',
    supportsDeepLink: true },
  'CCL': { name: 'COSCO Shipping', logoSlug: 'cosco',
    trackUrl: 'https://elines.coscoshipping.com/ebusiness/cargoTracking?trackingType=CONTAINER&number={container}',
    supportsDeepLink: true },

  // ── OOCL ─────────────────────────────────────────────────────────────────────
  'OOL': { name: 'OOCL', logoSlug: 'oocl',
    trackUrl: 'https://www.oocl.com/eng/ourservices/eservices/cargotracking/Pages/cargotracking.aspx?ref={container}',
    supportsDeepLink: true },
  'CXD': { name: 'OOCL', logoSlug: 'oocl',
    trackUrl: 'https://www.oocl.com/eng/ourservices/eservices/cargotracking/Pages/cargotracking.aspx?ref={container}',
    supportsDeepLink: true },

  // ── Hapag-Lloyd ──────────────────────────────────────────────────────────────
  'HLX': { name: 'Hapag-Lloyd', logoSlug: 'hapag-lloyd',
    trackUrl: 'https://www.hapag-lloyd.com/en/online-business/tracing/tracing-by-container.html?container={container}',
    supportsDeepLink: true },
  'HLC': { name: 'Hapag-Lloyd', logoSlug: 'hapag-lloyd',
    trackUrl: 'https://www.hapag-lloyd.com/en/online-business/tracing/tracing-by-container.html?container={container}',
    supportsDeepLink: true },
  // UASC (merged into Hapag-Lloyd)
  'UAC': { name: 'Hapag-Lloyd', logoSlug: 'hapag-lloyd',
    trackUrl: 'https://www.hapag-lloyd.com/en/online-business/tracing/tracing-by-container.html?container={container}',
    supportsDeepLink: true },

  // ── Evergreen ────────────────────────────────────────────────────────────────
  'EGL': { name: 'Evergreen Line', logoSlug: 'evergreen-line',
    trackUrl: 'https://www.evergreen-line.com/static/jsp/Track_container.jsp?container={container}',
    supportsDeepLink: true },
  'EGH': { name: 'Evergreen Line', logoSlug: 'evergreen-line',
    trackUrl: 'https://www.evergreen-line.com/static/jsp/Track_container.jsp?container={container}',
    supportsDeepLink: true },
  'EIM': { name: 'Evergreen Line', logoSlug: 'evergreen-line',
    trackUrl: 'https://www.evergreen-line.com/static/jsp/Track_container.jsp?container={container}',
    supportsDeepLink: true },
  'EIS': { name: 'Evergreen Line', logoSlug: 'evergreen-line',
    trackUrl: 'https://www.evergreen-line.com/static/jsp/Track_container.jsp?container={container}',
    supportsDeepLink: true },

  // ── Yang Ming ────────────────────────────────────────────────────────────────
  'YML': { name: 'Yang Ming', logoSlug: 'yang-ming',
    trackUrl: 'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?search_type=CNTR&CNTR_NO={container}',
    supportsDeepLink: true },
  'YMM': { name: 'Yang Ming', logoSlug: 'yang-ming',
    trackUrl: 'https://www.yangming.com/e-service/Track_Trace/track_trace_cargo_tracking.aspx?search_type=CNTR&CNTR_NO={container}',
    supportsDeepLink: true },

  // ── ONE (Ocean Network Express) — merger of NYK, MOL, K-Line ─────────────────
  'ONE': { name: 'Ocean Network Express', logoSlug: 'ocean-network-express',
    trackUrl: 'https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking?trakNoList={container}',
    supportsDeepLink: true },
  'NYK': { name: 'Ocean Network Express', logoSlug: 'ocean-network-express',
    trackUrl: 'https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking?trakNoList={container}',
    supportsDeepLink: true },
  'MOO': { name: 'Ocean Network Express', logoSlug: 'ocean-network-express',
    trackUrl: 'https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking?trakNoList={container}',
    supportsDeepLink: true },
  'HAL': { name: 'Ocean Network Express', logoSlug: 'ocean-network-express',
    trackUrl: 'https://ecomm.one-line.com/one-ecom/manage-shipment/cargo-tracking?trakNoList={container}',
    supportsDeepLink: true },

  // ── ZIM ──────────────────────────────────────────────────────────────────────
  'ZIM': { name: 'ZIM', logoSlug: 'zim',
    trackUrl: 'https://www.zim.com/tools/track-a-shipment',
    supportsDeepLink: false },
  'ZCS': { name: 'ZIM', logoSlug: 'zim',
    trackUrl: 'https://www.zim.com/tools/track-a-shipment',
    supportsDeepLink: false },

  // ── HMM ──────────────────────────────────────────────────────────────────────
  'HMM': { name: 'HMM', logoSlug: 'hmm',
    trackUrl: 'https://www.hmm21.com/e-service/general/trackNTrace/TrackNTrace.do',
    supportsDeepLink: false },
  'HDM': { name: 'HMM', logoSlug: 'hmm',
    trackUrl: 'https://www.hmm21.com/e-service/general/trackNTrace/TrackNTrace.do',
    supportsDeepLink: false },

  // ── Wan Hai ──────────────────────────────────────────────────────────────────
  'WHS': { name: 'Wan Hai Lines', logoSlug: 'wan-hai',
    trackUrl: 'https://www.wanhai.com/views/Main.xhtml',
    supportsDeepLink: false },

  // ── PIL ──────────────────────────────────────────────────────────────────────
  'PIL': { name: 'PIL', logoSlug: 'pil',
    trackUrl: 'https://www.pilship.com/en-container-tracking-pacific-international-lines/122.html',
    supportsDeepLink: false },
  'PCI': { name: 'PIL', logoSlug: 'pil',
    trackUrl: 'https://www.pilship.com/en-container-tracking-pacific-international-lines/122.html',
    supportsDeepLink: false },

  // ── Arkas ────────────────────────────────────────────────────────────────────
  'ARK': { name: 'Arkas Line', logoSlug: 'arkas',
    trackUrl: 'https://www.arkasline.com.tr/en/container-tracking/',
    supportsDeepLink: false },

  // ── Turkon ───────────────────────────────────────────────────────────────────
  'TRK': { name: 'Turkon Line', logoSlug: 'turkon',
    trackUrl: 'https://www.turkon.com/en/',
    supportsDeepLink: false },

  // ── Grimaldi ─────────────────────────────────────────────────────────────────
  'GRI': { name: 'Grimaldi Lines', logoSlug: 'grimaldi',
    trackUrl: 'https://www.grimaldi-lines.com/',
    supportsDeepLink: false },

  // ── Seaboard / Sea Lead ───────────────────────────────────────────────────────
  'SEA': { name: 'Sea Lead Shipping', logoSlug: 'sea-lead',
    trackUrl: 'https://www.sea-lead.com/tracking',
    supportsDeepLink: false },

  // ── Wallenius Wilhelmsen (RoRo) ───────────────────────────────────────────────
  'WLK': { name: 'Wallenius Wilhelmsen', logoSlug: 'wallenius-wilhelmsen',
    trackUrl: 'https://www.wallenius-wilhelmsen.com/shipping/tracking/',
    supportsDeepLink: false },
}

export function getContainerRedirect(trackingNumber: string): ContainerRedirect | null {
  const clean = trackingNumber.replace(/\s/g, '').toUpperCase()
  // ISO 6346: 3-letter owner + equipment category (U/J/Z) + 7 digits
  if (!/^[A-Z]{3}[UJZ]\d{7}$/.test(clean)) return null

  const ownerCode = clean.slice(0, 3)
  const info = OWNER_MAP[ownerCode]
  if (!info) return null

  const trackUrl = info.trackUrl.replace('{container}', encodeURIComponent(clean))

  return {
    containerNumber: clean,
    ownerCode,
    shippingLine: info.name,
    logoSlug: info.logoSlug,
    trackUrl,
    supportsDeepLink: info.supportsDeepLink,
  }
}

/**
 * Fallback: when the owner code isn't in OWNER_MAP (e.g. leasing-company prefixes
 * like TII/Triton, CAI, TGHU…) but the tracking API already identified the carrier,
 * build a redirect using the carrier name instead.
 */
export function getContainerRedirectByCarrier(
  trackingNumber: string,
  carrierName: string,
): ContainerRedirect | null {
  const clean = trackingNumber.replace(/\s/g, '').toUpperCase()
  if (!/^[A-Z]{3}[UJZ]\d{7}$/.test(clean)) return null

  const needle = carrierName.toLowerCase().trim()
  const entry = Object.entries(OWNER_MAP).find(([, info]) =>
    needle.includes(info.name.toLowerCase()) ||
    info.name.toLowerCase().includes(needle),
  )
  if (!entry) return null

  const [ownerCode, info] = entry
  const trackUrl = info.trackUrl.replace('{container}', encodeURIComponent(clean))
  return {
    containerNumber: clean,
    ownerCode,
    shippingLine: info.name,
    logoSlug: info.logoSlug,
    trackUrl,
    supportsDeepLink: info.supportsDeepLink,
  }
}
