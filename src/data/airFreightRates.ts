import { getZone } from './shippingRates'

export type AirCarrier = 'Emirates' | 'Lufthansa' | 'Qatar' | 'Turkish' | 'Etihad' | 'Cargolux' | 'OmanAir' | 'MEA' | 'DHLGlobal' | 'FedExCargo'
export type CommodityType = 'general' | 'perishable' | 'dangerous'

export interface AirCarrierService {
  carrier: AirCarrier
  serviceCode: string
  serviceName: string
  transit: Record<number, string>
  // per-kg rates at weight breaks per zone
  rates: AirWeightBand[]
  minCharge: number  // USD minimum per shipment
}

interface AirWeightBand {
  minKg: number   // lower bound (exclusive, 0 = no lower bound)
  maxKg: number   // upper bound (inclusive), Infinity for last band
  zones: Record<number, number>  // zone → rate per kg (USD)
}

// ── Transit tables ────────────────────────────────────────────────────────────
const T_EMI_PRIORITY:  Record<number,string> = { 1:'1 day', 2:'1–2 days', 3:'2–3 days', 4:'2–3 days', 5:'3–4 days', 6:'3–5 days', 7:'4–6 days' }
const T_EMI_STANDARD:  Record<number,string> = { 1:'2–3 days', 2:'2–4 days', 3:'3–5 days', 4:'3–5 days', 5:'4–6 days', 6:'5–7 days', 7:'6–9 days' }
const T_LH_PRIORITY:   Record<number,string> = { 1:'1–2 days', 2:'2–3 days', 3:'2–4 days', 4:'3–4 days', 5:'3–5 days', 6:'4–6 days', 7:'5–7 days' }
const T_LH_STANDARD:   Record<number,string> = { 1:'2–3 days', 2:'3–4 days', 3:'3–5 days', 4:'4–6 days', 5:'5–7 days', 6:'5–8 days', 7:'6–10 days' }
const T_QR_PRIORITY:   Record<number,string> = { 1:'1 day', 2:'1–2 days', 3:'2–3 days', 4:'2–4 days', 5:'3–4 days', 6:'3–5 days', 7:'4–6 days' }
const T_QR_STANDARD:   Record<number,string> = { 1:'2–3 days', 2:'2–4 days', 3:'3–5 days', 4:'4–6 days', 5:'4–6 days', 6:'5–7 days', 7:'6–9 days' }
const T_TK_PRIORITY:   Record<number,string> = { 1:'1–2 days', 2:'2–3 days', 3:'2–4 days', 4:'3–5 days', 5:'3–5 days', 6:'4–6 days', 7:'5–8 days' }
const T_TK_STANDARD:   Record<number,string> = { 1:'2–3 days', 2:'3–5 days', 3:'3–5 days', 4:'4–6 days', 5:'5–7 days', 6:'5–8 days', 7:'7–10 days' }
const T_EY_PRIORITY:   Record<number,string> = { 1:'1 day', 2:'1–2 days', 3:'2–3 days', 4:'2–4 days', 5:'3–5 days', 6:'4–6 days', 7:'5–7 days' }
const T_EY_STANDARD:   Record<number,string> = { 1:'2–3 days', 2:'2–4 days', 3:'3–5 days', 4:'3–6 days', 5:'4–7 days', 6:'5–8 days', 7:'6–10 days' }

// ── Rate tables (per kg, USD, before fuel surcharge) ──────────────────────────
// Weight breaks: <45 kg | 45–100 | 100–300 | 300–500 | 500–1000 | >1000
// Heavier = cheaper per kg (standard air freight tiering)

const EMI_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:4.9, 2:5.9, 3:7.5, 4:8.8, 5:10.7, 6:12.7, 7:14.9} },
  { minKg:45,  maxKg:100,  zones:{1:4.2, 2:4.9, 3:6.4, 4:7.4, 5:9.0,  6:10.8, 7:12.6} },
  { minKg:100, maxKg:300,  zones:{1:3.5, 2:4.2, 3:5.3, 4:6.2, 5:7.5,  6:9.1,  7:10.7} },
  { minKg:300, maxKg:500,  zones:{1:2.9, 2:3.5, 3:4.4, 4:5.2, 5:6.2,  6:7.5,  7:8.8} },
  { minKg:500, maxKg:1000, zones:{1:2.5, 2:3.0, 3:3.8, 4:4.4, 5:5.3,  6:6.5,  7:7.5} },
  { minKg:1000,maxKg:Infinity,zones:{1:2.1,2:2.5,3:3.1,4:3.6,5:4.4,6:5.3,7:6.2} },
]

const EMI_STANDARD_RATES: AirWeightBand[] = EMI_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.82*100)/100]))
}))

const LH_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:5.6, 2:6.7, 3:8.4, 4:10.1, 5:12.0, 6:14.3, 7:16.8} },
  { minKg:45,  maxKg:100,  zones:{1:4.8, 2:5.6, 3:7.1, 4:8.5,  5:10.1, 6:12.0, 7:14.1} },
  { minKg:100, maxKg:300,  zones:{1:3.9, 2:4.8, 3:6.0, 4:7.1,  5:8.5,  6:10.2, 7:11.9} },
  { minKg:300, maxKg:500,  zones:{1:3.2, 2:3.9, 3:5.0, 4:5.9,  5:7.1,  6:8.5,  7:9.9} },
  { minKg:500, maxKg:1000, zones:{1:2.8, 2:3.4, 3:4.2, 4:5.0,  5:6.0,  6:7.3,  7:8.4} },
  { minKg:1000,maxKg:Infinity,zones:{1:2.4,2:2.8,3:3.5,4:4.2,5:5.0,6:6.0,7:7.0} },
]

const LH_STANDARD_RATES: AirWeightBand[] = LH_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.80*100)/100]))
}))

const QR_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:4.7, 2:5.6, 3:7.2, 4:8.5, 5:10.3, 6:12.2, 7:14.3} },
  { minKg:45,  maxKg:100,  zones:{1:3.9, 2:4.7, 3:6.1, 4:7.2, 5:8.6,  6:10.3, 7:12.1} },
  { minKg:100, maxKg:300,  zones:{1:3.3, 2:4.0, 3:5.1, 4:6.0, 5:7.3,  6:8.7,  7:10.1} },
  { minKg:300, maxKg:500,  zones:{1:2.7, 2:3.4, 3:4.3, 4:4.9, 5:6.0,  6:7.2,  7:8.5} },
  { minKg:500, maxKg:1000, zones:{1:2.3, 2:2.9, 3:3.6, 4:4.2, 5:5.1,  6:6.1,  7:7.2} },
  { minKg:1000,maxKg:Infinity,zones:{1:2.0,2:2.3,3:3.0,4:3.5,5:4.3,6:5.1,7:6.0} },
]

const QR_STANDARD_RATES: AirWeightBand[] = QR_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.83*100)/100]))
}))

const TK_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:4.4, 2:5.3, 3:6.6, 4:7.9, 5:9.5, 6:11.4, 7:13.4} },
  { minKg:45,  maxKg:100,  zones:{1:3.6, 2:4.4, 3:5.6, 4:6.6, 5:8.0, 6:9.6,  7:11.3} },
  { minKg:100, maxKg:300,  zones:{1:3.0, 2:3.8, 3:4.8, 4:5.5, 5:6.8, 6:8.1,  7:9.5} },
  { minKg:300, maxKg:500,  zones:{1:2.5, 2:3.1, 3:4.0, 4:4.6, 5:5.5, 6:6.6,  7:7.9} },
  { minKg:500, maxKg:1000, zones:{1:2.1, 2:2.6, 3:3.4, 4:3.9, 5:4.8, 6:5.6,  7:6.6} },
  { minKg:1000,maxKg:Infinity,zones:{1:1.8,2:2.3,3:2.8,4:3.3,5:3.9,6:4.8,7:5.5} },
]

const TK_STANDARD_RATES: AirWeightBand[] = TK_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.81*100)/100]))
}))

const EY_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:4.8, 2:5.7, 3:7.3, 4:8.6, 5:10.4, 6:12.4, 7:14.6} },
  { minKg:45,  maxKg:100,  zones:{1:4.0, 2:4.8, 3:6.2, 4:7.3, 5:8.7,  6:10.4, 7:12.2} },
  { minKg:100, maxKg:300,  zones:{1:3.4, 2:4.2, 3:5.2, 4:6.1, 5:7.4,  6:8.8,  7:10.3} },
  { minKg:300, maxKg:500,  zones:{1:2.7, 2:3.4, 3:4.3, 4:5.1, 5:6.1,  6:7.3,  7:8.6} },
  { minKg:500, maxKg:1000, zones:{1:2.3, 2:2.9, 3:3.6, 4:4.3, 5:5.2,  6:6.2,  7:7.3} },
  { minKg:1000,maxKg:Infinity,zones:{1:2.0,2:2.5,3:3.0,4:3.6,5:4.3,6:5.2,7:6.1} },
]

const EY_STANDARD_RATES: AirWeightBand[] = EY_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.82*100)/100]))
}))

// Cargolux — Luxembourg all-cargo carrier, strong on EU/transatlantic/Asia heavy freight
const T_CV_PRIORITY: Record<number,string> = { 1:'1–2 days', 2:'2–3 days', 3:'2–4 days', 4:'3–5 days', 5:'3–5 days', 6:'4–6 days', 7:'5–8 days' }
const T_CV_STANDARD: Record<number,string> = { 1:'2–3 days', 2:'3–4 days', 3:'3–5 days', 4:'4–6 days', 5:'5–7 days', 6:'5–8 days', 7:'7–10 days' }

const CV_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:4.9, 2:5.8, 3:7.4, 4:8.8, 5:10.5, 6:12.5, 7:14.8} },
  { minKg:45,  maxKg:100,  zones:{1:4.1, 2:4.9, 3:6.3, 4:7.4, 5:8.9,  6:10.6, 7:12.5} },
  { minKg:100, maxKg:300,  zones:{1:3.4, 2:4.1, 3:5.3, 4:6.1, 5:7.4,  6:8.9,  7:10.5} },
  { minKg:300, maxKg:500,  zones:{1:2.8, 2:3.4, 3:4.4, 4:5.1, 5:6.3,  6:7.5,  7:8.8} },
  { minKg:500, maxKg:1000, zones:{1:2.4, 2:2.9, 3:3.6, 4:4.3, 5:5.3,  6:6.4,  7:7.4} },
  { minKg:1000,maxKg:Infinity,zones:{1:2.0,2:2.4,3:3.0,4:3.6,5:4.4,6:5.3,7:6.1} },
]

const CV_STANDARD_RATES: AirWeightBand[] = CV_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.81*100)/100]))
}))

// Oman Air Cargo — hub MCT; strong on Gulf/Indian Subcontinent/East Africa
const T_OA_PRIORITY: Record<number,string> = { 1:'1 day', 2:'1–2 days', 3:'2–3 days', 4:'2–4 days', 5:'3–5 days', 6:'4–6 days', 7:'5–8 days' }
const T_OA_STANDARD: Record<number,string> = { 1:'2–3 days', 2:'2–4 days', 3:'3–5 days', 4:'4–6 days', 5:'5–7 days', 6:'6–8 days', 7:'7–11 days' }

const OA_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:3.8, 2:4.6, 3:5.9, 4:7.0, 5:8.5, 6:10.1, 7:12.0} },
  { minKg:45,  maxKg:100,  zones:{1:3.2, 2:3.9, 3:4.9, 4:5.9, 5:7.1, 6:8.6,  7:10.1} },
  { minKg:100, maxKg:300,  zones:{1:2.6, 2:3.3, 3:4.1, 4:4.9, 5:6.0, 6:7.2,  7:8.5} },
  { minKg:300, maxKg:500,  zones:{1:2.2, 2:2.8, 3:3.5, 4:4.1, 5:4.9, 6:6.0,  7:7.0} },
  { minKg:500, maxKg:1000, zones:{1:1.8, 2:2.3, 3:2.9, 4:3.5, 5:4.3, 6:5.1,  7:5.9} },
  { minKg:1000,maxKg:Infinity,zones:{1:1.5,2:2.0,3:2.4,4:2.9,5:3.6,6:4.3,7:4.9} },
]

const OA_STANDARD_RATES: AirWeightBand[] = OA_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.82*100)/100]))
}))

// DHL Global Forwarding — international air freight forwarding, all zones
const T_DG_PRIORITY: Record<number,string> = { 1:'1–2 days', 2:'2–3 days', 3:'2–4 days', 4:'3–5 days', 5:'3–5 days', 6:'4–6 days', 7:'5–8 days' }
const T_DG_STANDARD: Record<number,string> = { 1:'2–3 days', 2:'3–5 days', 3:'4–6 days', 4:'5–7 days', 5:'5–8 days', 6:'7–10 days', 7:'8–12 days' }

const DG_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:6.2, 2:7.4, 3:9.3, 4:11.1, 5:13.4, 6:15.9, 7:18.8} },
  { minKg:45,  maxKg:100,  zones:{1:5.3, 2:6.2, 3:8.0, 4:9.5,  5:11.3, 6:13.5, 7:15.9} },
  { minKg:100, maxKg:300,  zones:{1:4.4, 2:5.3, 3:6.6, 4:8.0,  5:9.5,  6:11.3, 7:13.4} },
  { minKg:300, maxKg:500,  zones:{1:3.6, 2:4.4, 3:5.6, 4:6.6,  5:8.0,  6:9.5,  7:11.1} },
  { minKg:500, maxKg:1000, zones:{1:3.0, 2:3.8, 3:4.7, 4:5.6,  5:6.6,  6:8.0,  7:9.3} },
  { minKg:1000,maxKg:Infinity,zones:{1:2.6,2:3.2,3:3.9,4:4.7,5:5.6,6:6.6,7:7.8} },
]

const DG_STANDARD_RATES: AirWeightBand[] = DG_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.80*100)/100]))
}))

// FedEx Cargo (International Air Freight) — heavier freight complement to express
const T_FX_PRIORITY: Record<number,string> = { 1:'1–2 days', 2:'2–3 days', 3:'2–4 days', 4:'3–4 days', 5:'3–5 days', 6:'4–6 days', 7:'5–7 days' }
const T_FX_STANDARD: Record<number,string> = { 1:'2–3 days', 2:'3–4 days', 3:'3–5 days', 4:'4–6 days', 5:'5–7 days', 6:'6–9 days', 7:'7–10 days' }

const FX_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:6.5, 2:7.8, 3:9.8, 4:11.6, 5:14.0, 6:16.6, 7:19.5} },
  { minKg:45,  maxKg:100,  zones:{1:5.4, 2:6.5, 3:8.4, 4:9.9,  5:11.8, 6:14.1, 7:16.6} },
  { minKg:100, maxKg:300,  zones:{1:4.5, 2:5.6, 3:7.0, 4:8.4,  5:9.9,  6:11.9, 7:14.0} },
  { minKg:300, maxKg:500,  zones:{1:3.7, 2:4.7, 3:5.9, 4:7.0,  5:8.4,  6:9.9,  7:11.6} },
  { minKg:500, maxKg:1000, zones:{1:3.3, 2:3.9, 3:5.0, 4:5.9,  5:7.0,  6:8.4,  7:9.8} },
  { minKg:1000,maxKg:Infinity,zones:{1:2.6,2:3.3,3:4.2,4:5.0,5:5.9,6:7.0,7:8.2} },
]

const FX_STANDARD_RATES: AirWeightBand[] = FX_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.80*100)/100]))
}))

// MEA Cargo — Middle East Airlines, Lebanon-based, hub BEY; strong on Middle East/Europe/Africa
const T_ME_PRIORITY: Record<number,string> = { 1:'1 day', 2:'1–2 days', 3:'2–3 days', 4:'2–4 days', 5:'3–5 days', 6:'4–6 days', 7:'5–8 days' }
const T_ME_STANDARD: Record<number,string> = { 1:'2–3 days', 2:'2–4 days', 3:'3–5 days', 4:'4–6 days', 5:'5–7 days', 6:'6–8 days', 7:'7–11 days' }

const ME_PRIORITY_RATES: AirWeightBand[] = [
  { minKg:0,   maxKg:45,   zones:{1:3.9, 2:4.7, 3:6.0, 4:7.1, 5:8.6, 6:10.4, 7:12.2} },
  { minKg:45,  maxKg:100,  zones:{1:3.3, 2:4.0, 3:5.1, 4:6.0, 5:7.2, 6:8.7,  7:10.2} },
  { minKg:100, maxKg:300,  zones:{1:2.8, 2:3.3, 3:4.3, 4:5.1, 5:6.1, 6:7.4,  7:8.6} },
  { minKg:300, maxKg:500,  zones:{1:2.3, 2:2.8, 3:3.6, 4:4.3, 5:5.1, 6:6.1,  7:7.1} },
  { minKg:500, maxKg:1000, zones:{1:2.0, 2:2.3, 3:3.0, 4:3.6, 5:4.3, 6:5.2,  7:6.0} },
  { minKg:1000,maxKg:Infinity,zones:{1:1.6,2:2.0,3:2.5,4:3.0,5:3.6,6:4.3,7:5.1} },
]

const ME_STANDARD_RATES: AirWeightBand[] = ME_PRIORITY_RATES.map(b => ({
  ...b, zones: Object.fromEntries(Object.entries(b.zones).map(([z,r])=>[z, Math.round(r*0.82*100)/100]))
}))

// ── Service catalogue ─────────────────────────────────────────────────────────
export const AIR_CARRIER_SERVICES: AirCarrierService[] = [
  { carrier:'Emirates', serviceCode:'emi-priority', serviceName:'Emirates SkyCargo Priority',  transit:T_EMI_PRIORITY, rates:EMI_PRIORITY_RATES, minCharge:75 },
  { carrier:'Emirates', serviceCode:'emi-standard', serviceName:'Emirates SkyCargo Standard',  transit:T_EMI_STANDARD, rates:EMI_STANDARD_RATES, minCharge:75 },
  { carrier:'Lufthansa',serviceCode:'lh-priority',  serviceName:'Lufthansa Cargo td.Flash',    transit:T_LH_PRIORITY,  rates:LH_PRIORITY_RATES,  minCharge:80 },
  { carrier:'Lufthansa',serviceCode:'lh-standard',  serviceName:'Lufthansa Cargo td.Pro',      transit:T_LH_STANDARD,  rates:LH_STANDARD_RATES,  minCharge:80 },
  { carrier:'Qatar',    serviceCode:'qr-priority',  serviceName:'Qatar Airways Cargo Priority', transit:T_QR_PRIORITY,  rates:QR_PRIORITY_RATES,  minCharge:70 },
  { carrier:'Qatar',    serviceCode:'qr-standard',  serviceName:'Qatar Airways Cargo Standard', transit:T_QR_STANDARD,  rates:QR_STANDARD_RATES,  minCharge:70 },
  { carrier:'Turkish',  serviceCode:'tk-priority',  serviceName:'Turkish Cargo TK Priority',   transit:T_TK_PRIORITY,  rates:TK_PRIORITY_RATES,  minCharge:65 },
  { carrier:'Turkish',  serviceCode:'tk-standard',  serviceName:'Turkish Cargo TK Standard',   transit:T_TK_STANDARD,  rates:TK_STANDARD_RATES,  minCharge:65 },
  { carrier:'Etihad',   serviceCode:'ey-priority',  serviceName:'Etihad Cargo Priority',       transit:T_EY_PRIORITY,  rates:EY_PRIORITY_RATES,  minCharge:70 },
  { carrier:'Etihad',   serviceCode:'ey-standard',  serviceName:'Etihad Cargo Standard',       transit:T_EY_STANDARD,  rates:EY_STANDARD_RATES,  minCharge:70 },
  { carrier:'Cargolux', serviceCode:'cv-priority',  serviceName:'Cargolux Priority',           transit:T_CV_PRIORITY,  rates:CV_PRIORITY_RATES,  minCharge:85 },
  { carrier:'Cargolux', serviceCode:'cv-standard',  serviceName:'Cargolux Standard',           transit:T_CV_STANDARD,  rates:CV_STANDARD_RATES,  minCharge:85 },
  { carrier:'OmanAir',  serviceCode:'oa-priority',  serviceName:'Oman Air Cargo Priority',     transit:T_OA_PRIORITY,  rates:OA_PRIORITY_RATES,  minCharge:60 },
  { carrier:'OmanAir',  serviceCode:'oa-standard',  serviceName:'Oman Air Cargo Standard',     transit:T_OA_STANDARD,  rates:OA_STANDARD_RATES,  minCharge:60 },
  { carrier:'DHLGlobal',serviceCode:'dg-priority',  serviceName:'DHL Global Air Priority',     transit:T_DG_PRIORITY,  rates:DG_PRIORITY_RATES,  minCharge:90 },
  { carrier:'DHLGlobal',serviceCode:'dg-standard',  serviceName:'DHL Global Air Standard',     transit:T_DG_STANDARD,  rates:DG_STANDARD_RATES,  minCharge:90 },
  { carrier:'FedExCargo',serviceCode:'fx-priority', serviceName:'FedEx Cargo Air Priority',    transit:T_FX_PRIORITY,  rates:FX_PRIORITY_RATES,  minCharge:85 },
  { carrier:'FedExCargo',serviceCode:'fx-standard', serviceName:'FedEx Cargo Air Economy',     transit:T_FX_STANDARD,  rates:FX_STANDARD_RATES,  minCharge:85 },
  { carrier:'MEA',      serviceCode:'me-priority',  serviceName:'MEA Cargo Priority',          transit:T_ME_PRIORITY,  rates:ME_PRIORITY_RATES,  minCharge:60 },
  { carrier:'MEA',      serviceCode:'me-standard',  serviceName:'MEA Cargo Standard',          transit:T_ME_STANDARD,  rates:ME_STANDARD_RATES,  minCharge:60 },
]

// ── Result type ───────────────────────────────────────────────────────────────
export interface AirRateResult {
  carrier: AirCarrier
  serviceCode: string
  serviceName: string
  ratePerKgLow: number
  ratePerKgHigh: number
  totalLow: number
  totalHigh: number
  transitDays: string
  chargeableKg: number
  volKg: number
  actualKg: number
  minChargeApplied: boolean
}

// ── Commodity surcharge multipliers ──────────────────────────────────────────
export const COMMODITY_MULTIPLIER: Record<CommodityType, number> = {
  general: 1.0,
  perishable: 1.15,
  dangerous: 1.25,
}

// ── Calculation ───────────────────────────────────────────────────────────────
function lookupRatePerKg(bands: AirWeightBand[], kg: number, zone: number): number {
  const capped = Math.min(zone, 7)
  for (const band of bands) {
    if (kg > band.minKg && kg <= band.maxKg) return band.zones[capped] ?? 0
  }
  // fallback to last band
  return bands[bands.length - 1].zones[Math.min(zone, 7)] ?? 0
}

export function calcAirRates(
  originIso: string,
  destIso: string,
  actualKg: number,
  dimL: number,
  dimW: number,
  dimH: number,
  carriers: AirCarrier[],
  commodity: CommodityType,
): AirRateResult[] {
  // IATA volumetric divisor for air = 6000
  const volKg = (dimL > 0 && dimW > 0 && dimH > 0) ? (dimL * dimW * dimH) / 6000 : 0
  const rawChargeable = Math.max(actualKg, volKg)
  // Round up to nearest 0.5 kg
  const chargeableKg = Math.ceil(rawChargeable * 2) / 2
  const zone = getZone(originIso, destIso)
  const commodityMult = COMMODITY_MULTIPLIER[commodity]

  return AIR_CARRIER_SERVICES
    .filter(s => carriers.includes(s.carrier))
    .map(s => {
      const baseRatePerKg = lookupRatePerKg(s.rates, chargeableKg, zone)
      const rateWithFuel  = baseRatePerKg * 1.30 * commodityMult  // 30% fuel surcharge
      const ratePerKgLow  = Math.round(rateWithFuel * 0.92 * 100) / 100
      const ratePerKgHigh = Math.round(rateWithFuel * 1.08 * 100) / 100

      const calcLow  = Math.round(ratePerKgLow  * chargeableKg)
      const calcHigh = Math.round(ratePerKgHigh * chargeableKg)
      const minChargeApplied = calcLow < s.minCharge

      return {
        carrier:          s.carrier,
        serviceCode:      s.serviceCode,
        serviceName:      s.serviceName,
        ratePerKgLow,
        ratePerKgHigh,
        totalLow:         Math.max(calcLow,  s.minCharge),
        totalHigh:        Math.max(calcHigh, s.minCharge),
        transitDays:      s.transit[Math.min(zone, 7)],
        chargeableKg,
        volKg,
        actualKg,
        minChargeApplied,
      }
    })
}

// ── Carrier meta ──────────────────────────────────────────────────────────────
export const AIR_CARRIER_META: Record<AirCarrier, { primary: string; bg: string; border: string; slug: string }> = {
  Emirates: { primary: '#C8A84B', bg: 'rgba(200,168,75,0.07)',  border: 'rgba(200,168,75,0.2)',  slug: 'emirates-skycargo' },
  Lufthansa:{ primary: '#0062AA', bg: 'rgba(0,98,170,0.07)',    border: 'rgba(0,98,170,0.2)',    slug: 'lufthansa-cargo'   },
  Qatar:    { primary: '#5C0632', bg: 'rgba(92,6,50,0.10)',     border: 'rgba(92,6,50,0.25)',    slug: 'qatar-cargo'       },
  Turkish:  { primary: '#E31E2D', bg: 'rgba(227,30,45,0.07)',   border: 'rgba(227,30,45,0.2)',   slug: 'turkish-cargo'     },
  Etihad:   { primary: '#B8985A', bg: 'rgba(184,152,90,0.07)',  border: 'rgba(184,152,90,0.2)',  slug: 'etihad-cargo'      },
  Cargolux: { primary: '#E8232A', bg: 'rgba(232,35,42,0.07)',   border: 'rgba(232,35,42,0.2)',   slug: 'cargolux'          },
  OmanAir:  { primary: '#C8A84B', bg: 'rgba(200,168,75,0.08)',  border: 'rgba(200,168,75,0.22)', slug: 'oman-air'          },
  MEA:      { primary: '#006341', bg: 'rgba(0,99,65,0.09)',     border: 'rgba(0,99,65,0.25)',    slug: 'mea'               },
  DHLGlobal:{ primary: '#FFCC00', bg: 'rgba(255,204,0,0.07)',   border: 'rgba(255,204,0,0.2)',   slug: 'dhl'               },
  FedExCargo:{ primary: '#FF6200', bg: 'rgba(255,98,0,0.07)',   border: 'rgba(255,98,0,0.2)',    slug: 'fedex'             },
}
