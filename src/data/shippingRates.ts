// Simplified zone matrix: originRegion + destRegion → zone (1–9)
// Regions: ME=Middle East, EU=Europe, NA=North America, AS=Asia, AF=Africa, SA=South America, OC=Oceania

const REGION_ZONES: Record<string, Record<string, number>> = {
  ME: { ME: 1, EU: 3, NA: 5, AS: 2, AF: 4, SA: 6, OC: 5 },
  EU: { EU: 1, ME: 3, NA: 4, AS: 4, AF: 4, SA: 5, OC: 6 },
  NA: { NA: 1, EU: 4, ME: 5, AS: 5, AF: 6, SA: 3, OC: 6 },
  AS: { AS: 1, ME: 2, EU: 4, NA: 5, AF: 5, SA: 6, OC: 3 },
  AF: { AF: 2, ME: 4, EU: 4, NA: 6, AS: 5, SA: 6, OC: 7 },
  SA: { SA: 2, NA: 3, EU: 5, ME: 6, AS: 6, AF: 6, OC: 7 },
  OC: { OC: 2, AS: 3, ME: 5, EU: 6, NA: 6, AF: 7, SA: 7 },
}

const COUNTRY_REGION: Record<string, string> = {
  // Middle East
  AE: 'ME', SA: 'ME', QA: 'ME', KW: 'ME', BH: 'ME', OM: 'ME', JO: 'ME', LB: 'ME',
  IL: 'ME', EG: 'ME', IQ: 'ME', IR: 'ME', YE: 'ME', SY: 'ME', TR: 'ME',
  // Europe
  DE: 'EU', FR: 'EU', GB: 'EU', IT: 'EU', ES: 'EU', NL: 'EU', BE: 'EU', CH: 'EU',
  AT: 'EU', SE: 'EU', NO: 'EU', DK: 'EU', FI: 'EU', PL: 'EU', CZ: 'EU', PT: 'EU',
  GR: 'EU', HU: 'EU', RO: 'EU', UA: 'EU', RU: 'EU', IE: 'EU', LU: 'EU', HR: 'EU',
  SK: 'EU', BG: 'EU', LT: 'EU', LV: 'EU', EE: 'EU', SI: 'EU', RS: 'EU',
  // North America
  US: 'NA', CA: 'NA', MX: 'NA',
  // Asia
  CN: 'AS', JP: 'AS', KR: 'AS', IN: 'AS', SG: 'AS', HK: 'AS', TW: 'AS', TH: 'AS',
  MY: 'AS', ID: 'AS', PH: 'AS', VN: 'AS', PK: 'AS', BD: 'AS', LK: 'AS', NP: 'AS',
  MM: 'AS', KH: 'AS', MN: 'AS',
  // Africa
  ZA: 'AF', NG: 'AF', KE: 'AF', ET: 'AF', GH: 'AF', TZ: 'AF', MA: 'AF', DZ: 'AF',
  TN: 'AF', UG: 'AF', SN: 'AF', CI: 'AF', CM: 'AF', AO: 'AF', MZ: 'AF', ZM: 'AF',
  // South America
  BR: 'SA', AR: 'SA', CL: 'SA', CO: 'SA', PE: 'SA', VE: 'SA', EC: 'SA', BO: 'SA',
  PY: 'SA', UY: 'SA',
  // Oceania
  AU: 'OC', NZ: 'OC', FJ: 'OC', PG: 'OC',
}

export function getZone(originIso: string, destIso: string): number {
  if (originIso === destIso) return 1
  const or = COUNTRY_REGION[originIso] ?? 'EU'
  const dr = COUNTRY_REGION[destIso] ?? 'EU'
  return REGION_ZONES[or]?.[dr] ?? 5
}

// Rate tables: base price (USD) per zone at each weight break
// Each entry: { maxKg, zones: { 1..7: price } }
// Source: simplified from published 2024 international express rate cards

interface WeightBand { maxKg: number; zones: Record<number, number> }

export const DHL_RATES: WeightBand[] = [
  { maxKg: 0.5, zones: { 1: 22, 2: 28, 3: 35, 4: 42, 5: 52, 6: 68, 7: 88 } },
  { maxKg: 1,   zones: { 1: 26, 2: 33, 3: 42, 4: 51, 5: 63, 6: 82, 7: 106 } },
  { maxKg: 2,   zones: { 1: 31, 2: 39, 3: 50, 4: 62, 5: 77, 6: 99, 7: 128 } },
  { maxKg: 5,   zones: { 1: 42, 2: 54, 3: 70, 4: 87, 5: 108, 6: 138, 7: 179 } },
  { maxKg: 10,  zones: { 1: 60, 2: 78, 3: 102, 4: 127, 5: 158, 6: 201, 7: 261 } },
  { maxKg: 20,  zones: { 1: 88, 2: 115, 3: 151, 4: 188, 5: 234, 6: 298, 7: 386 } },
  { maxKg: 30,  zones: { 1: 118, 2: 154, 3: 202, 4: 252, 5: 313, 6: 399, 7: 517 } },
  { maxKg: 70,  zones: { 1: 198, 2: 258, 3: 339, 4: 422, 5: 525, 6: 669, 7: 867 } },
]

export const FEDEX_RATES: WeightBand[] = [
  { maxKg: 0.5, zones: { 1: 25, 2: 30, 3: 38, 4: 46, 5: 57, 6: 74, 7: 96 } },
  { maxKg: 1,   zones: { 1: 29, 2: 37, 3: 47, 4: 57, 5: 71, 6: 92, 7: 119 } },
  { maxKg: 2,   zones: { 1: 35, 2: 44, 3: 57, 4: 70, 5: 87, 6: 112, 7: 145 } },
  { maxKg: 5,   zones: { 1: 48, 2: 61, 3: 79, 4: 98, 5: 122, 6: 156, 7: 202 } },
  { maxKg: 10,  zones: { 1: 69, 2: 88, 3: 115, 4: 143, 5: 178, 6: 228, 7: 295 } },
  { maxKg: 20,  zones: { 1: 101, 2: 129, 3: 169, 4: 211, 5: 263, 6: 336, 7: 435 } },
  { maxKg: 30,  zones: { 1: 135, 2: 173, 3: 227, 4: 283, 5: 353, 6: 450, 7: 583 } },
  { maxKg: 70,  zones: { 1: 226, 2: 290, 3: 381, 4: 475, 5: 592, 6: 755, 7: 978 } },
]

export const UPS_RATES: WeightBand[] = [
  { maxKg: 0.5, zones: { 1: 23, 2: 29, 3: 37, 4: 45, 5: 55, 6: 72, 7: 93 } },
  { maxKg: 1,   zones: { 1: 27, 2: 35, 3: 44, 4: 54, 5: 67, 6: 87, 7: 113 } },
  { maxKg: 2,   zones: { 1: 33, 2: 41, 3: 53, 4: 66, 5: 82, 6: 105, 7: 136 } },
  { maxKg: 5,   zones: { 1: 44, 2: 57, 3: 74, 4: 92, 5: 115, 6: 146, 7: 190 } },
  { maxKg: 10,  zones: { 1: 64, 2: 83, 3: 108, 4: 135, 5: 168, 6: 214, 7: 278 } },
  { maxKg: 20,  zones: { 1: 95, 2: 122, 3: 160, 4: 199, 5: 248, 6: 316, 7: 410 } },
  { maxKg: 30,  zones: { 1: 127, 2: 163, 3: 213, 4: 266, 5: 332, 6: 423, 7: 548 } },
  { maxKg: 70,  zones: { 1: 213, 2: 273, 3: 358, 4: 447, 5: 557, 6: 710, 7: 920 } },
]

const TRANSIT_DAYS: Record<number, string> = {
  1: '1–2 business days',
  2: '1–3 business days',
  3: '2–4 business days',
  4: '3–5 business days',
  5: '4–6 business days',
  6: '5–8 business days',
  7: '6–10 business days',
}

// Aramex — strong in ME/Asia/Africa, competitive vs DHL in those lanes
export const ARAMEX_RATES: WeightBand[] = [
  { maxKg: 0.5, zones: { 1: 14, 2: 18, 3: 28, 4: 36, 5: 48, 6: 64, 7: 84 } },
  { maxKg: 1,   zones: { 1: 17, 2: 22, 3: 34, 4: 44, 5: 58, 6: 76, 7: 99 } },
  { maxKg: 2,   zones: { 1: 21, 2: 27, 3: 41, 4: 54, 5: 70, 6: 92, 7: 119 } },
  { maxKg: 5,   zones: { 1: 30, 2: 38, 3: 58, 4: 76, 5: 99, 6: 129, 7: 168 } },
  { maxKg: 10,  zones: { 1: 44, 2: 56, 3: 85, 4: 111, 5: 144, 6: 188, 7: 244 } },
  { maxKg: 20,  zones: { 1: 65, 2: 83, 3: 126, 4: 164, 5: 213, 6: 278, 7: 361 } },
  { maxKg: 30,  zones: { 1: 87, 2: 111, 3: 168, 4: 220, 5: 285, 6: 372, 7: 483 } },
  { maxKg: 70,  zones: { 1: 146, 2: 186, 3: 282, 4: 368, 5: 478, 6: 623, 7: 809 } },
]

export interface RateResult {
  carrier: 'DHL' | 'FedEx' | 'UPS' | 'Aramex'
  low: number
  high: number
  transitDays: string
  chargeableKg: number
  volKg: number
  actualKg: number
}

function lookupRate(table: WeightBand[], kg: number, zone: number): number {
  const capped = Math.min(zone, 7)
  for (const band of table) {
    if (kg <= band.maxKg) return band.zones[capped] ?? 0
  }
  // over 70 kg: extrapolate linearly from last band
  const last = table[table.length - 1]
  const base = last.zones[capped] ?? 0
  const perKg = base / last.maxKg
  return Math.round(perKg * kg)
}

export function calcRates(
  originIso: string,
  destIso: string,
  actualKg: number,
  dimL: number,
  dimW: number,
  dimH: number,
  carriers: ('DHL' | 'FedEx' | 'UPS' | 'Aramex')[],
): RateResult[] {
  // Volumetric divisor: 5000 for express (cm³ → kg)
  const volKg = (dimL > 0 && dimW > 0 && dimH > 0) ? (dimL * dimW * dimH) / 5000 : 0
  // Round chargeable weight up to nearest 0.5 kg (standard carrier practice)
  const rawChargeable = Math.max(actualKg, volKg)
  const chargeableKg  = Math.ceil(rawChargeable * 2) / 2
  const zone = getZone(originIso, destIso)

  const tables: Record<string, WeightBand[]> = {
    DHL: DHL_RATES,
    FedEx: FEDEX_RATES,
    UPS: UPS_RATES,
    Aramex: ARAMEX_RATES,
  }

  return carriers.map(carrier => {
    const base = lookupRate(tables[carrier], chargeableKg, zone)
    const withFuel = base * 1.2  // ~20% fuel surcharge
    const low  = Math.round(withFuel * 0.9)
    const high = Math.round(withFuel * 1.1)
    return { carrier, low, high, transitDays: TRANSIT_DAYS[Math.min(zone, 7)], chargeableKg, volKg, actualKg }
  })
}

// Country list for dropdowns
export const COUNTRIES: { iso: string; name: string }[] = [
  { iso: 'AE', name: 'United Arab Emirates' },
  { iso: 'AF', name: 'Afghanistan' },
  { iso: 'AL', name: 'Albania' },
  { iso: 'DZ', name: 'Algeria' },
  { iso: 'AO', name: 'Angola' },
  { iso: 'AR', name: 'Argentina' },
  { iso: 'AU', name: 'Australia' },
  { iso: 'AT', name: 'Austria' },
  { iso: 'AZ', name: 'Azerbaijan' },
  { iso: 'BH', name: 'Bahrain' },
  { iso: 'BD', name: 'Bangladesh' },
  { iso: 'BE', name: 'Belgium' },
  { iso: 'BO', name: 'Bolivia' },
  { iso: 'BR', name: 'Brazil' },
  { iso: 'BG', name: 'Bulgaria' },
  { iso: 'CM', name: 'Cameroon' },
  { iso: 'CA', name: 'Canada' },
  { iso: 'CL', name: 'Chile' },
  { iso: 'CN', name: 'China' },
  { iso: 'CO', name: 'Colombia' },
  { iso: 'HR', name: 'Croatia' },
  { iso: 'CZ', name: 'Czech Republic' },
  { iso: 'DK', name: 'Denmark' },
  { iso: 'EC', name: 'Ecuador' },
  { iso: 'EG', name: 'Egypt' },
  { iso: 'EE', name: 'Estonia' },
  { iso: 'ET', name: 'Ethiopia' },
  { iso: 'FI', name: 'Finland' },
  { iso: 'FR', name: 'France' },
  { iso: 'DE', name: 'Germany' },
  { iso: 'GH', name: 'Ghana' },
  { iso: 'GR', name: 'Greece' },
  { iso: 'HK', name: 'Hong Kong' },
  { iso: 'HU', name: 'Hungary' },
  { iso: 'IN', name: 'India' },
  { iso: 'ID', name: 'Indonesia' },
  { iso: 'IQ', name: 'Iraq' },
  { iso: 'IE', name: 'Ireland' },
  { iso: 'IL', name: 'Israel' },
  { iso: 'IT', name: 'Italy' },
  { iso: 'CI', name: 'Ivory Coast' },
  { iso: 'JP', name: 'Japan' },
  { iso: 'JO', name: 'Jordan' },
  { iso: 'KZ', name: 'Kazakhstan' },
  { iso: 'KE', name: 'Kenya' },
  { iso: 'KW', name: 'Kuwait' },
  { iso: 'LV', name: 'Latvia' },
  { iso: 'LB', name: 'Lebanon' },
  { iso: 'LT', name: 'Lithuania' },
  { iso: 'LU', name: 'Luxembourg' },
  { iso: 'MY', name: 'Malaysia' },
  { iso: 'MA', name: 'Morocco' },
  { iso: 'MX', name: 'Mexico' },
  { iso: 'MN', name: 'Mongolia' },
  { iso: 'MZ', name: 'Mozambique' },
  { iso: 'MM', name: 'Myanmar' },
  { iso: 'NL', name: 'Netherlands' },
  { iso: 'NZ', name: 'New Zealand' },
  { iso: 'NG', name: 'Nigeria' },
  { iso: 'NO', name: 'Norway' },
  { iso: 'OM', name: 'Oman' },
  { iso: 'PK', name: 'Pakistan' },
  { iso: 'PY', name: 'Paraguay' },
  { iso: 'PE', name: 'Peru' },
  { iso: 'PH', name: 'Philippines' },
  { iso: 'PL', name: 'Poland' },
  { iso: 'PT', name: 'Portugal' },
  { iso: 'QA', name: 'Qatar' },
  { iso: 'RO', name: 'Romania' },
  { iso: 'RU', name: 'Russia' },
  { iso: 'SA', name: 'Saudi Arabia' },
  { iso: 'SN', name: 'Senegal' },
  { iso: 'RS', name: 'Serbia' },
  { iso: 'SG', name: 'Singapore' },
  { iso: 'SK', name: 'Slovakia' },
  { iso: 'SI', name: 'Slovenia' },
  { iso: 'ZA', name: 'South Africa' },
  { iso: 'KR', name: 'South Korea' },
  { iso: 'ES', name: 'Spain' },
  { iso: 'LK', name: 'Sri Lanka' },
  { iso: 'SE', name: 'Sweden' },
  { iso: 'CH', name: 'Switzerland' },
  { iso: 'SY', name: 'Syria' },
  { iso: 'TW', name: 'Taiwan' },
  { iso: 'TZ', name: 'Tanzania' },
  { iso: 'TH', name: 'Thailand' },
  { iso: 'TN', name: 'Tunisia' },
  { iso: 'TR', name: 'Turkey' },
  { iso: 'UG', name: 'Uganda' },
  { iso: 'UA', name: 'Ukraine' },
  { iso: 'GB', name: 'United Kingdom' },
  { iso: 'US', name: 'United States' },
  { iso: 'UY', name: 'Uruguay' },
  { iso: 'UZ', name: 'Uzbekistan' },
  { iso: 'VE', name: 'Venezuela' },
  { iso: 'VN', name: 'Vietnam' },
  { iso: 'YE', name: 'Yemen' },
  { iso: 'ZM', name: 'Zambia' },
]
