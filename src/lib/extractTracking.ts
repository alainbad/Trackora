// Client-side extraction of tracking numbers from digital (text-based) PDFs.
// Reads the PDF text with pdf.js and pattern-matches container numbers (ISO 6346),
// Master Air Waybills, and generic shipment references — no server, no extra API.

import * as pdfjsLib from 'pdfjs-dist'
// Vite resolves the worker to a hashed URL at build time
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl

export type CandidateType = 'container' | 'mawb' | 'reference'

export interface Candidate {
  value: string          // normalised tracking number
  type: CandidateType
  label: string          // human-friendly type label
}

// ── ISO 6346 container check-digit validation ─────────────────────────────────
const ISO6346_VALUES: Record<string, number> = {
  A:10,B:12,C:13,D:14,E:15,F:16,G:17,H:18,I:19,J:20,K:21,L:23,M:24,
  N:25,O:26,P:27,Q:28,R:29,S:30,T:31,U:32,V:34,W:35,X:36,Y:37,Z:38,
}

function isValidContainer(num: string): boolean {
  const s = num.toUpperCase()
  if (!/^[A-Z]{4}\d{7}$/.test(s)) return false
  let sum = 0
  for (let i = 0; i < 10; i++) {
    const ch = s[i]
    const v = /[A-Z]/.test(ch) ? ISO6346_VALUES[ch] : Number(ch)
    sum += v * Math.pow(2, i)
  }
  let check = sum % 11
  if (check === 10) check = 0
  return check === Number(s[10])
}

// ── Extract raw text from every page of a PDF ─────────────────────────────────
async function pdfToText(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise
  let text = ''
  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()
    // Join fragments with a space so adjacent items don't merge into bogus tokens
    text += content.items.map((it) => ('str' in it ? it.str : '')).join(' ') + '\n'
  }
  return text
}

// ── Find tracking-number candidates in extracted text ─────────────────────────
export function findCandidates(text: string): Candidate[] {
  const found = new Map<string, Candidate>()
  // Collapse every run of horizontal whitespace (spaces, tabs, non-breaking
  // spaces, etc.) to a single ASCII space, but keep line breaks. Using \S/\n
  // escapes only — NEVER a literal space inside a character class, which can be
  // silently corrupted into a non-breaking space (U+00A0).
  const T = text.replace(/[^\S\n]+/g, ' ')

  const add = (value: string, type: CandidateType, label: string) => {
    const key = `${type}:${value}`
    if (!found.has(key)) found.set(key, { value, type, label })
  }

  // 1. Container numbers (ISO 6346): 4 letters + 7 digits, allowing space groups
  //    e.g. "MSCU 123456 7" or "MSCU1234567"
  const containerRe = /\b([A-Z]{3}[UJZ])\s*(\d{6})\s*(\d)\b/g
  for (const m of T.matchAll(containerRe)) {
    const candidate = `${m[1]}${m[2]}${m[3]}`.toUpperCase()
    if (isValidContainer(candidate)) add(candidate, 'container', 'Container (ISO 6346)')
  }

  // 2. Master Air Waybill: 3-digit airline prefix + 8 digits. Handles formats:
  //    • "020 FRA 3297 4620"   (with origin airport code)
  //    • "020-3297 4620"       (dash-separated)
  //    • "020-32974620"        (dash, no space in serial)
  //    • "40612345678"         (no separator — FedEx freight sometimes omits dash)
  //    • "406-12345678-5"      (with IATA check digit suffix — strip it)
  //    The separator-optional form (\d{11}) is only accepted when the number
  //    is surrounded by word boundaries to avoid matching arbitrary digit runs.
  const mawbRe = /\b(\d{3})[-\s]+(?:[A-Z]{3}\s+)?(\d{4})\s*(\d{4})(?:-\d)?\b/g
  for (const m of T.matchAll(mawbRe)) {
    const prefix = m[1]
    const serial = `${m[2]}${m[3]}`
    if (prefix === '000') continue   // not a real airline prefix
    add(`${prefix}-${serial}`, 'mawb', 'Air Waybill (MAWB)')
  }
  // No-separator form: 11 consecutive digits at a word boundary, where the
  // first 3 map to a known airline code. Avoids false positives from plain
  // phone numbers or order IDs by requiring \b on both sides.
  const AIRLINE_PREFIXES = new Set([
    '001','006','014','020','023','024','025','026','043','057','071','074',
    '081','083','085','086','087','098','101','102','106','107','108','112',
    '114','116','117','118','119','125','129','131','139','148','157','160',
    '172','176','180','186','188','195','197','198','200','201','205','209',
    '214','217','220','228','232','235','237','239','247','257','265','266',
    '270','279','281','297','300','304','306','310','312','318','331','334',
    '339','343','345','369','377','400','403','406','413','422','432','434',
    '438','440','449','460','471','478','480','481','490','500','503','512',
    '514','516','518','520','524','526','529','537','543','549','555','557',
    '562','566','568','580','590','598','604','607','612','618','624','628',
    '629','636','642','643','644','649','655','657','659','660','662','676',
    '677','679','683','684','695','702','705','706','712','714','720','724',
    '731','741','745','768','781','784','800','809','820','839','861','879',
    '880','884','894','895','903','932','952','988','989',
  ])
  const mawbNoSepRe = /\b(\d{3})(\d{8})\b/g
  for (const m of T.matchAll(mawbNoSepRe)) {
    if (!AIRLINE_PREFIXES.has(m[1])) continue
    add(`${m[1]}-${m[2]}`, 'mawb', 'Air Waybill (MAWB)')
  }

  // 3. Express courier labels — tracking number printed as grouped digits near barcode.
  //    FedEx Express, DHL Express, TNT all use 4+4+4 = 12-digit format on shipping labels
  //    e.g. "8720 7000 1520" → "872070001520". The number often appears far from any
  //    keyword in the PDF text stream (layout puts label and value in different cells).
  //    Negative lookahead (?!\s\d{4}) prevents partial matches of 16-digit credit cards.
  const courier12Re = /\b(\d{4})\s(\d{4})\s(\d{4})(?!\s\d{4})\b/g
  for (const m of T.matchAll(courier12Re)) {
    const num = `${m[1]}${m[2]}${m[3]}`
    // Skip if first 3 digits are a well-known phone country code
    // (971=UAE, 966=SA, 965=KW, 968=OM, 974=QA, 973=BH, 972=IL, 43=AT stripped)
    const p3 = num.slice(0, 3)
    const PHONE_CC3 = new Set(['971','966','965','968','974','973','972','970','961','962','963','964','967'])
    if (PHONE_CC3.has(p3)) continue
    add(num, 'reference', 'Express tracking (12-digit)')
  }

  // 4. Labelled shipment references — capture the token after a known keyword,
  //    then STRICTLY validate it looks like a real reference (not prose). AWB/BOL
  //    legal boilerplate is full of words like "shipment"/"waybill", so without
  //    strict validation this captures garbage like "MAY BE CARRIED VIA INT".
  //    Accepted shapes (post-validation patterns):
  //      • 2–4 UPPERCASE letters + optional dash + 6–18 digits
  //          e.g. FBG-26002870, JD014600006735942693 (DHL eCommerce / JD Logistics)
  //      • 1–2 UPPERCASE letters + 8–13 digits + 2 UPPERCASE letters
  //          e.g. GM60952591560US, LX123456789CN (postal/DHL eCommerce with country code)
  //      • pure numeric, 9–20 digits
  //          e.g. 1234567890 (DHL Express 10-digit), 830930245930 (FedEx 12-digit)
  const REF_ALNUM   = /^[A-Z]{2,4}-?\d{6,18}$/          // letters-then-digits (incl. JD Logistics 20-char)
  const REF_POSTAL  = /^[A-Z]{1,2}\d{8,13}[A-Z]{2}$/    // postal / DHL eCommerce e.g. GM...US, LX...CN
  const REF_NUMERIC = /^\d{9,20}$/                        // pure numeric couriers
  // Keywords: covers express couriers (FedEx/DHL/UPS) + air freight + ocean
  // "tracking" catches "Tracking Number:", "Tracking No.", "Tracking ID:"
  // "AWB" / "airway bill" / "air waybill" catch FedEx/airline air waybill labels
  // "waybill" catches "Waybill:", "Waybill Number:" (DHL Express labels)
  // "shipment" catches "Shipment No.", "Shipment ID:"
  // "parcel" catches "Parcel No.", "Parcel ID:"
  const labelRe = /\b(?:tracking|TRK|AWB|MAWB|airway\s+bill|air\s+waybill|waybill|B\/?L|bill\s+of\s+lading|booking|reference|consignment|shipment|parcel|HAWB|HBL|MBL)\s*(?:no\.?|number|id|#|:)?\s*:?\s*([A-Z0-9][A-Z0-9\- ]{4,24}[A-Z0-9])/gi
  for (const m of T.matchAll(labelRe)) {
    const raw = m[1].trim()
    // Normalise "FBG-2600 2870" → "FBG-26002870" (collapse spaces inside number groups)
    const normalised = raw.replace(/(\d)\s+(\d)/g, '$1$2').replace(/\s+/g, '')
    if (!REF_ALNUM.test(normalised) && !REF_POSTAL.test(normalised) && !REF_NUMERIC.test(normalised)) continue
    if (isValidContainer(normalised)) { add(normalised, 'container', 'Container (ISO 6346)'); continue }
    if (/^\d{3}-\d{8}$/.test(normalised)) { add(normalised, 'mawb', 'Air Waybill (MAWB)'); continue }
    add(normalised, 'reference', 'Shipment reference')
  }

  // Order: containers first, then MAWBs, then references
  const order: Record<CandidateType, number> = { container: 0, mawb: 1, reference: 2 }
  return [...found.values()].sort((a, b) => order[a.type] - order[b.type])
}

// ── Public entry point ────────────────────────────────────────────────────────
export async function extractFromPdf(file: File): Promise<Candidate[]> {
  const text = await pdfToText(file)
  return findCandidates(text)
}
