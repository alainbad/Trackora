// Curated carrier list for the optional "specify carrier" dropdown on the Track page.
// When auto-detection fails, the user picks a carrier and we pass the hint to the
// tracking API. `slug` is the AfterShip courier slug (used for express / air / land);
// ocean containers are auto-detected by Shipsgo so sea lines are grouped for guidance.

export type CarrierMode = 'express' | 'air' | 'sea' | 'land'

export interface Carrier {
  name: string
  slug: string        // AfterShip courier slug (also passed to the Edge Function)
  mode: CarrierMode
}

export const CARRIERS: Carrier[] = [
  // ── Express / Parcel ──────────────────────────────────────────────
  { name: 'UPS',                 slug: 'ups',                       mode: 'express' },
  { name: 'FedEx',               slug: 'fedex',                     mode: 'express' },
  { name: 'DHL Express',         slug: 'dhl',                       mode: 'express' },
  { name: 'DHL eCommerce',       slug: 'dhl-global-mail',           mode: 'express' },
  { name: 'TNT',                 slug: 'tnt',                       mode: 'express' },
  { name: 'DPD',                 slug: 'dpd',                       mode: 'express' },
  { name: 'GLS',                 slug: 'gls',                       mode: 'express' },
  { name: 'Aramex',              slug: 'aramex',                    mode: 'express' },
  { name: 'USPS',                slug: 'usps',                      mode: 'express' },
  { name: 'Royal Mail',          slug: 'royal-mail',                mode: 'express' },
  { name: 'Deutsche Post / DHL', slug: 'deutsche-post',             mode: 'express' },
  { name: 'China Post',          slug: 'china-post',                mode: 'express' },
  { name: 'PostNL',              slug: 'postnl-international',       mode: 'express' },
  { name: 'SF Express',          slug: 'sf-express',                mode: 'express' },

  // ── Air Cargo (Master Air Waybill) ────────────────────────────────
  { name: 'Lufthansa Cargo',     slug: 'lufthansa-cargo',           mode: 'air' },
  { name: 'Emirates SkyCargo',   slug: 'emirates-skycargo',         mode: 'air' },
  { name: 'Qatar Airways Cargo', slug: 'qatar-cargo',               mode: 'air' },
  { name: 'Singapore Air Cargo', slug: 'singapore-airlines-cargo',  mode: 'air' },
  { name: 'Cathay Cargo',        slug: 'cathay-pacific-cargo',      mode: 'air' },
  { name: 'Air France-KLM Cargo',slug: 'air-france-cargo',          mode: 'air' },
  { name: 'Turkish Cargo',       slug: 'turkish-cargo',             mode: 'air' },
  { name: 'IAG Cargo',           slug: 'iag-cargo',                 mode: 'air' },
  { name: 'Korean Air Cargo',    slug: 'korean-air-cargo',          mode: 'air' },
  { name: 'Cargolux',            slug: 'cargolux',                  mode: 'air' },

  // ── Sea Freight (containers auto-detected by Shipsgo) ──────────────
  { name: 'Maersk',              slug: 'maersk',                    mode: 'sea' },
  { name: 'MSC',                 slug: 'msc',                       mode: 'sea' },
  { name: 'CMA CGM',             slug: 'cma-cgm',                   mode: 'sea' },
  { name: 'COSCO',               slug: 'cosco',                     mode: 'sea' },
  { name: 'Hapag-Lloyd',         slug: 'hapag-lloyd',               mode: 'sea' },
  { name: 'ONE',                 slug: 'ocean-network-express',     mode: 'sea' },
  { name: 'Evergreen',           slug: 'evergreen-line',            mode: 'sea' },
  { name: 'Yang Ming',           slug: 'yang-ming',                 mode: 'sea' },
  { name: 'ZIM',                 slug: 'zim',                       mode: 'sea' },
  { name: 'HMM',                 slug: 'hmm',                       mode: 'sea' },
  { name: 'ECU Worldwide',       slug: 'ecu-worldwide',             mode: 'sea' },

  // ── Land / Road Freight ───────────────────────────────────────────
  { name: 'DB Schenker',         slug: 'db-schenker',               mode: 'land' },
  { name: 'DSV',                 slug: 'dsv',                       mode: 'land' },
  { name: 'Kuehne + Nagel',      slug: 'kuehne-nagel',              mode: 'land' },
  { name: 'DHL Freight',         slug: 'dhl-freight',               mode: 'land' },
  { name: 'XPO Logistics',       slug: 'xpo',                       mode: 'land' },
  { name: 'GEODIS',              slug: 'geodis',                    mode: 'land' },
  { name: 'CEVA Logistics',      slug: 'ceva',                      mode: 'land' },
]

export const MODE_LABEL: Record<CarrierMode, string> = {
  express: 'Express / Parcel',
  air:     'Air Cargo',
  sea:     'Sea Freight',
  land:    'Land / Road',
}

export const MODE_ORDER: CarrierMode[] = ['express', 'air', 'sea', 'land']
