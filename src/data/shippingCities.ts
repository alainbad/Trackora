// Major shipping cities / airports per country ISO
// Format: { iata: string, name: string, city: string }

export interface CityOption { code: string; label: string }

const CITIES: Record<string, CityOption[]> = {
  AE: [{ code:'DXB', label:'Dubai (DXB)' }, { code:'AUH', label:'Abu Dhabi (AUH)' }, { code:'SHJ', label:'Sharjah (SHJ)' }, { code:'RKT', label:'Ras Al Khaimah (RKT)' }],
  SA: [{ code:'RUH', label:'Riyadh (RUH)' }, { code:'JED', label:'Jeddah (JED)' }, { code:'DMM', label:'Dammam (DMM)' }, { code:'MED', label:'Medina (MED)' }],
  QA: [{ code:'DOH', label:'Doha (DOH)' }],
  KW: [{ code:'KWI', label:'Kuwait City (KWI)' }],
  BH: [{ code:'BAH', label:'Manama / Bahrain (BAH)' }],
  OM: [{ code:'MCT', label:'Muscat (MCT)' }, { code:'SLL', label:'Salalah (SLL)' }],
  JO: [{ code:'AMM', label:'Amman (AMM)' }],
  LB: [{ code:'BEY', label:'Beirut (BEY)' }],
  IL: [{ code:'TLV', label:'Tel Aviv (TLV)' }],
  EG: [{ code:'CAI', label:'Cairo (CAI)' }, { code:'HRG', label:'Hurghada (HRG)' }, { code:'SSH', label:'Sharm el-Sheikh (SSH)' }],
  IQ: [{ code:'BGW', label:'Baghdad (BGW)' }, { code:'BSR', label:'Basra (BSR)' }, { code:'EBL', label:'Erbil (EBL)' }],
  TR: [{ code:'IST', label:'Istanbul (IST)' }, { code:'ESB', label:'Ankara (ESB)' }, { code:'ADB', label:'Izmir (ADB)' }],

  DE: [{ code:'FRA', label:'Frankfurt (FRA)' }, { code:'MUC', label:'Munich (MUC)' }, { code:'DUS', label:'Düsseldorf (DUS)' }, { code:'BER', label:'Berlin (BER)' }, { code:'HAM', label:'Hamburg (HAM)' }],
  FR: [{ code:'CDG', label:'Paris Charles de Gaulle (CDG)' }, { code:'ORY', label:'Paris Orly (ORY)' }, { code:'LYS', label:'Lyon (LYS)' }, { code:'MRS', label:'Marseille (MRS)' }],
  GB: [{ code:'LHR', label:'London Heathrow (LHR)' }, { code:'LGW', label:'London Gatwick (LGW)' }, { code:'MAN', label:'Manchester (MAN)' }, { code:'BHX', label:'Birmingham (BHX)' }, { code:'EDI', label:'Edinburgh (EDI)' }],
  IT: [{ code:'FCO', label:'Rome Fiumicino (FCO)' }, { code:'MXP', label:'Milan Malpensa (MXP)' }, { code:'LIN', label:'Milan Linate (LIN)' }, { code:'VCE', label:'Venice (VCE)' }],
  ES: [{ code:'MAD', label:'Madrid (MAD)' }, { code:'BCN', label:'Barcelona (BCN)' }, { code:'AGP', label:'Málaga (AGP)' }, { code:'VLC', label:'Valencia (VLC)' }],
  NL: [{ code:'AMS', label:'Amsterdam Schiphol (AMS)' }],
  BE: [{ code:'BRU', label:'Brussels (BRU)' }],
  CH: [{ code:'ZRH', label:'Zurich (ZRH)' }, { code:'GVA', label:'Geneva (GVA)' }],
  AT: [{ code:'VIE', label:'Vienna (VIE)' }],
  SE: [{ code:'ARN', label:'Stockholm Arlanda (ARN)' }, { code:'GOT', label:'Gothenburg (GOT)' }],
  NO: [{ code:'OSL', label:'Oslo (OSL)' }],
  DK: [{ code:'CPH', label:'Copenhagen (CPH)' }],
  FI: [{ code:'HEL', label:'Helsinki (HEL)' }],
  PL: [{ code:'WAW', label:'Warsaw (WAW)' }, { code:'KRK', label:'Kraków (KRK)' }],
  CZ: [{ code:'PRG', label:'Prague (PRG)' }],
  PT: [{ code:'LIS', label:'Lisbon (LIS)' }, { code:'OPO', label:'Porto (OPO)' }],
  GR: [{ code:'ATH', label:'Athens (ATH)' }, { code:'SKG', label:'Thessaloniki (SKG)' }],
  HU: [{ code:'BUD', label:'Budapest (BUD)' }],
  RO: [{ code:'OTP', label:'Bucharest (OTP)' }],
  RU: [{ code:'SVO', label:'Moscow Sheremetyevo (SVO)' }, { code:'DME', label:'Moscow Domodedovo (DME)' }, { code:'LED', label:'St. Petersburg (LED)' }],
  UA: [{ code:'KBP', label:'Kyiv Boryspil (KBP)' }],
  IE: [{ code:'DUB', label:'Dublin (DUB)' }],

  US: [{ code:'JFK', label:'New York JFK (JFK)' }, { code:'LAX', label:'Los Angeles (LAX)' }, { code:'ORD', label:'Chicago O\'Hare (ORD)' }, { code:'MIA', label:'Miami (MIA)' }, { code:'IAH', label:'Houston (IAH)' }, { code:'DFW', label:'Dallas/Fort Worth (DFW)' }, { code:'ATL', label:'Atlanta (ATL)' }, { code:'SFO', label:'San Francisco (SFO)' }, { code:'SEA', label:'Seattle (SEA)' }, { code:'BOS', label:'Boston (BOS)' }],
  CA: [{ code:'YYZ', label:'Toronto Pearson (YYZ)' }, { code:'YVR', label:'Vancouver (YVR)' }, { code:'YUL', label:'Montreal (YUL)' }, { code:'YYC', label:'Calgary (YYC)' }],
  MX: [{ code:'MEX', label:'Mexico City (MEX)' }, { code:'GDL', label:'Guadalajara (GDL)' }, { code:'MTY', label:'Monterrey (MTY)' }],

  CN: [{ code:'PEK', label:'Beijing (PEK)' }, { code:'PVG', label:'Shanghai Pudong (PVG)' }, { code:'CAN', label:'Guangzhou (CAN)' }, { code:'SZX', label:'Shenzhen (SZX)' }, { code:'CTU', label:'Chengdu (CTU)' }, { code:'HGH', label:'Hangzhou (HGH)' }],
  JP: [{ code:'NRT', label:'Tokyo Narita (NRT)' }, { code:'HND', label:'Tokyo Haneda (HND)' }, { code:'KIX', label:'Osaka (KIX)' }, { code:'NGO', label:'Nagoya (NGO)' }],
  KR: [{ code:'ICN', label:'Seoul Incheon (ICN)' }, { code:'PUS', label:'Busan (PUS)' }],
  IN: [{ code:'BOM', label:'Mumbai (BOM)' }, { code:'DEL', label:'Delhi (DEL)' }, { code:'BLR', label:'Bangalore (BLR)' }, { code:'MAA', label:'Chennai (MAA)' }, { code:'CCU', label:'Kolkata (CCU)' }, { code:'HYD', label:'Hyderabad (HYD)' }],
  SG: [{ code:'SIN', label:'Singapore Changi (SIN)' }],
  HK: [{ code:'HKG', label:'Hong Kong (HKG)' }],
  TW: [{ code:'TPE', label:'Taipei Taoyuan (TPE)' }],
  TH: [{ code:'BKK', label:'Bangkok Suvarnabhumi (BKK)' }, { code:'DMK', label:'Bangkok Don Mueang (DMK)' }, { code:'HKT', label:'Phuket (HKT)' }],
  MY: [{ code:'KUL', label:'Kuala Lumpur (KUL)' }, { code:'PEN', label:'Penang (PEN)' }],
  ID: [{ code:'CGK', label:'Jakarta (CGK)' }, { code:'DPS', label:'Bali / Denpasar (DPS)' }, { code:'SUB', label:'Surabaya (SUB)' }],
  PH: [{ code:'MNL', label:'Manila (MNL)' }, { code:'CEB', label:'Cebu (CEB)' }],
  VN: [{ code:'SGN', label:'Ho Chi Minh City (SGN)' }, { code:'HAN', label:'Hanoi (HAN)' }],
  PK: [{ code:'KHI', label:'Karachi (KHI)' }, { code:'LHE', label:'Lahore (LHE)' }, { code:'ISB', label:'Islamabad (ISB)' }],
  BD: [{ code:'DAC', label:'Dhaka (DAC)' }],
  LK: [{ code:'CMB', label:'Colombo (CMB)' }],

  ZA: [{ code:'JNB', label:'Johannesburg (JNB)' }, { code:'CPT', label:'Cape Town (CPT)' }, { code:'DUR', label:'Durban (DUR)' }],
  NG: [{ code:'LOS', label:'Lagos (LOS)' }, { code:'ABV', label:'Abuja (ABV)' }],
  KE: [{ code:'NBO', label:'Nairobi (NBO)' }],
  ET: [{ code:'ADD', label:'Addis Ababa (ADD)' }],
  GH: [{ code:'ACC', label:'Accra (ACC)' }],
  TZ: [{ code:'DAR', label:'Dar es Salaam (DAR)' }, { code:'JRO', label:'Kilimanjaro (JRO)' }],
  MA: [{ code:'CMN', label:'Casablanca (CMN)' }, { code:'RAK', label:'Marrakech (RAK)' }],
  DZ: [{ code:'ALG', label:'Algiers (ALG)' }],
  TN: [{ code:'TUN', label:'Tunis (TUN)' }],
  SN: [{ code:'DKR', label:'Dakar (DKR)' }],
  CI: [{ code:'ABJ', label:'Abidjan (ABJ)' }],
  CM: [{ code:'DLA', label:'Douala (DLA)' }],

  BR: [{ code:'GRU', label:'São Paulo Guarulhos (GRU)' }, { code:'GIG', label:'Rio de Janeiro (GIG)' }, { code:'BSB', label:'Brasília (BSB)' }, { code:'FOR', label:'Fortaleza (FOR)' }],
  AR: [{ code:'EZE', label:'Buenos Aires Ezeiza (EZE)' }],
  CL: [{ code:'SCL', label:'Santiago (SCL)' }],
  CO: [{ code:'BOG', label:'Bogotá (BOG)' }, { code:'MDE', label:'Medellín (MDE)' }],
  PE: [{ code:'LIM', label:'Lima (LIM)' }],
  EC: [{ code:'UIO', label:'Quito (UIO)' }, { code:'GYE', label:'Guayaquil (GYE)' }],

  AU: [{ code:'SYD', label:'Sydney (SYD)' }, { code:'MEL', label:'Melbourne (MEL)' }, { code:'BNE', label:'Brisbane (BNE)' }, { code:'PER', label:'Perth (PER)' }],
  NZ: [{ code:'AKL', label:'Auckland (AKL)' }, { code:'CHC', label:'Christchurch (CHC)' }],
}

export function getCities(iso: string): CityOption[] {
  return CITIES[iso] ?? []
}
