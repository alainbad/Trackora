// Tracking-number format reference per carrier.
// `format`  — human-readable hint shown to the user
// `example` — a sample number (also used as a one-click fill in Track.tsx)
// `pattern` — strict regex only for carriers whose format is well-defined & unambiguous.
//              Omitted for carriers with variable / region-dependent formats so the UI
//              shows a helpful hint without ever showing a false amber warning.
export interface CarrierFormat {
  format: string
  example: string
  pattern?: RegExp
}

// Keyed by the exact carrier name used in CarriersSection.
const FORMATS: Record<string, CarrierFormat> = {

  // ── Express — tight, unambiguous formats → strict validation ──────────────
  'UPS':            { format: '"1Z" + 16 letters & numbers (18 total)',  example: '1Z999AA10123456784',     pattern: /^1Z[0-9A-Z]{16}$/i },
  'FedEx':          { format: '12, 15 or 20 digits',                     example: '123456789012',           pattern: /^(\d{12}|\d{15}|\d{20})$/ },
  'DHL':            { format: '10 digits (Air Waybill)',                 example: '1234567890',             pattern: /^\d{10}$/ },
  'TNT':            { format: '9 digits (consignment)',                  example: '123456789',              pattern: /^\d{9}$/ },
  'DPD':            { format: '14 digits',                               example: '01234567890123',         pattern: /^\d{14}$/ },
  'GLS':            { format: '11–14 digits',                            example: '12345678901',            pattern: /^\d{11,14}$/ },
  'Hermes':         { format: '16 digits',                               example: '1234567890123456',       pattern: /^\d{16}$/ },
  'Amazon':         { format: '"TBA" + 12 digits',                       example: 'TBA123456789012',        pattern: /^TBA\d{12}$/i },
  'SF Express':     { format: '"SF" + 13 digits',                        example: 'SF1234567890123',        pattern: /^SF\d{13}$/i },

  // Aramex format varies significantly by region and service — hint only
  'Aramex':         { format: '10–11 digits (varies by region & service)', example: '12345678901' },

  // ── Sea freight — container ISO 6346 is tight; B/L format varies widely ──
  // Showing hint + example only to avoid false amber on valid B/L numbers
  'Maersk':         { format: 'Container: 4 letters + 7 digits  |  B/L: typically 9 digits', example: 'MAEU1234567' },
  'MSC':            { format: 'Container: 4 letters + 7 digits  |  B/L: varies',             example: 'MEDU1234567' },
  'CMA CGM':        { format: 'Container: 4 letters + 7 digits  |  B/L: varies',             example: 'CMAU1234567' },
  'COSCO':          { format: 'Container: 4 letters + 7 digits  |  B/L: "COSU" + 10 digits', example: 'COSU1234567890' },
  'Hapag-Lloyd':    { format: 'Container: 4 letters + 7 digits  |  B/L: varies',             example: 'HLCU1234567' },
  'Evergreen':      { format: 'Container: 4 letters + 7 digits  |  B/L: varies',             example: 'EGLV1234567' },
  'Yang Ming':      { format: 'Container: 4 letters + 7 digits  |  B/L: varies',             example: 'YMLU1234567' },

  // ONE uses a well-known prefix — keep strict
  'ONE':            { format: '"ONEY" + 9–12 digits (B/L)',              example: 'ONEY123456789',          pattern: /^ONEY\d{9,12}$/i },

  // ── Air Cargo — Air Waybill = 3-digit airline prefix + 8 digits ─────────
  'Lufthansa Cargo':{ format: 'Air Waybill — 020 + 8 digits',           example: '020-12345675',           pattern: /^\d{3}-?\d{8}$/ },
  'Emirates':       { format: 'Air Waybill — 176 + 8 digits',           example: '176-12345675',           pattern: /^\d{3}-?\d{8}$/ },
  'Singapore Air':  { format: 'Air Waybill — 618 + 8 digits',           example: '618-12345675',           pattern: /^\d{3}-?\d{8}$/ },
  'Qatar Cargo':    { format: 'Air Waybill — 157 + 8 digits',           example: '157-12345675',           pattern: /^\d{3}-?\d{8}$/ },
  'Cathay Cargo':   { format: 'Air Waybill — 160 + 8 digits',           example: '160-12345675',           pattern: /^\d{3}-?\d{8}$/ },
  'Air France KLM': { format: 'Air Waybill — 057 or 074 + 8 digits',    example: '057-12345675',           pattern: /^\d{3}-?\d{8}$/ },
  'Turkish Cargo':  { format: 'Air Waybill — 235 + 8 digits',           example: '235-12345675',           pattern: /^\d{3}-?\d{8}$/ },
  'IAG Cargo':      { format: 'Air Waybill — 125 + 8 digits',           example: '125-12345675',           pattern: /^\d{3}-?\d{8}$/ },

  // ── Land freight — formats vary by country, service type, and year ────────
  'DB Schenker':    { format: 'Shipment / STT number — 9 to 12 digits (varies by country)', example: '123456789012' },
  'DSV':            { format: 'Shipment reference — format varies by region and service',   example: '12345678901' },
  'Kuehne+Nagel':   { format: 'K+N reference — format varies by service type',             example: '1234567890' },
  'XPO':            { format: 'PRO number — 9 digits',                  example: '123456789',              pattern: /^\d{9}$/ },
  'Geodis':         { format: 'Shipment number — varies by country and service',           example: '1234567890' },
  'Ceva Logistics': { format: 'Shipment number — varies by country and service',           example: '1234567890' },

  // ── Rail — consignment numbers vary by country / operator ─────────────────
  'DB Cargo':       { format: 'Wagon / consignment number — numeric, varies by country', example: '123456789' },
  'Rail Cargo':     { format: 'Consignment number — numeric, varies by origin',         example: '123456789' },
  'SNCF Fret':      { format: 'Consignment number — numeric, varies by service',        example: '123456789' },
  'PKP Cargo':      { format: 'Wagon number — 11–12 digits',            example: '12345678901',            pattern: /^\d{11,12}$/ },
  'BNSF Railway':   { format: 'Equipment ID — 4 letters + 6 digits',    example: 'BNSF123456',             pattern: /^[A-Z]{4}\d{6}$/i },
  'Union Pacific':  { format: 'Equipment ID — 4 letters + 6 digits',    example: 'UPRR123456',             pattern: /^[A-Z]{4}\d{6}$/i },
  'Trenitalia':     { format: 'Consignment number — numeric, varies by service',        example: '123456789' },
  'CR Express':     { format: 'Container — 4 letters + 7 digits',       example: 'CRTU1234567',            pattern: /^[A-Z]{4}\d{7}$/i },

  // ── Post / EMS — UPU standard formats are tight & well-defined ───────────
  'USPS':           { format: '20–22 digits',                            example: '9400100000000000000000', pattern: /^\d{20,22}$/ },
  'Royal Mail':     { format: '2 letters + 9 digits + "GB"',             example: 'AB123456789GB',          pattern: /^[A-Z]{2}\d{9}GB$/i },
  // Deutsche Post uses several different number series — hint only
  'Deutsche Post':  { format: '12–20 digits (varies by product)',        example: '123456789012' },
  'La Poste':       { format: '2 letters + 9 digits + "FR"',             example: 'CP123456789FR',          pattern: /^[A-Z]{2}\d{9}FR$/i },
  'Japan Post':     { format: '2 letters + 9 digits + "JP"',             example: 'EZ123456789JP',          pattern: /^[A-Z]{2}\d{9}JP$/i },
  'Australia Post': { format: '2 letters + 9 digits + "AU"',             example: 'AB123456789AU',          pattern: /^[A-Z]{2}\d{9}AU$/i },
  'China Post':     { format: '2 letters + 9 digits + "CN"',             example: 'RA123456789CN',          pattern: /^[A-Z]{2}\d{9}CN$/i },
  'PostNL':         { format: '"3S" + 3 letters + 9 digits',             example: '3SABC123456789',         pattern: /^3S[A-Z]{3}\d{9}$/i },
}

const DEFAULT_FORMAT: CarrierFormat = {
  format: 'Format varies — use the number on your shipping confirmation',
  example: '',
}

export function getCarrierFormat(name: string): CarrierFormat {
  return FORMATS[name] ?? DEFAULT_FORMAT
}
