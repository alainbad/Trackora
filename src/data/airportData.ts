export interface AirportConfig {
  slug: string
  name: string
  shortName: string
  country: string
  countryIso: string
  iata: string
  icao: string
  lat: number
  lng: number
  annualCargo: string
  mainAirlines: string[]
  badge: string
  h1: string
  subtitle: string
  seoTitle: string
  seoDescription: string
  facts: { label: string; value: string }[]
  howSteps: { title: string; body: string }[]
  faqs: { q: string; a: string }[]
  relatedLinks: { label: string; href: string }[]
}

export const AIRPORT_DATA: Record<string, AirportConfig> = {
  'dubai-dxb': {
    slug: 'dubai-dxb',
    name: 'Dubai International Airport',
    shortName: 'Dubai (DXB)',
    country: 'United Arab Emirates',
    countryIso: 'AE',
    iata: 'DXB',
    icao: 'OMDB',
    lat: 25.2532,
    lng: 55.3657,
    annualCargo: '2.7 million tonnes (2023)',
    mainAirlines: ['Emirates SkyCargo', 'dnata', 'FedEx', 'Qatar Airways Cargo', 'Etihad Cargo'],
    badge: 'DXB CARGO TRACKING',
    h1: 'Dubai Airport Cargo Tracking (DXB)',
    subtitle: 'Track air cargo and AWB shipments through Dubai International Airport — the Middle East\'s busiest air cargo hub.',
    seoTitle: 'Dubai Airport Cargo Tracking (DXB) — Track Air Freight | Trackora',
    seoDescription: 'Track air cargo and AWB shipments through Dubai International Airport (DXB). Enter your air waybill number for real-time cargo status.',
    facts: [
      { label: 'IATA Code', value: 'DXB' },
      { label: 'ICAO Code', value: 'OMDB' },
      { label: 'Location', value: 'Dubai, UAE' },
      { label: 'Annual Cargo', value: '2.7 million tonnes' },
      { label: 'Cargo Terminals', value: 'Emirates SkyCargo Terminal, dnata Cargo Centre' },
      { label: 'Rank', value: '#6 globally for cargo' },
    ],
    howSteps: [
      {
        title: 'Find your Air Waybill (AWB) number',
        body: 'Your freight forwarder or airline will provide an Air Waybill number. For Emirates SkyCargo, it starts with 176. For FedEx it starts with 020. The format is always 3-digit airline code + 8 digits (e.g. 176-12345678).',
      },
      {
        title: 'Enter it in the tracker above',
        body: 'Paste your AWB number into the tracking box. Trackora identifies the airline automatically and queries live cargo status from the carrier\'s system.',
      },
      {
        title: 'View real-time cargo status',
        body: 'See acceptance, departure from DXB, arrival at destination, customs clearance status, and final delivery milestones in real time.',
      },
    ],
    faqs: [
      {
        q: 'How do I track air cargo at Dubai Airport (DXB)?',
        a: 'Enter your Air Waybill (AWB) number into the tracker above. Emirates SkyCargo AWBs start with 176, FedEx with 020, and Qatar Airways Cargo with 157. Trackora covers all major carriers operating through DXB.',
      },
      {
        q: 'What is the AWB number format for Dubai cargo?',
        a: 'An Air Waybill number is 11 digits in total: a 3-digit airline prefix followed by an 8-digit serial number (e.g. 176-12345678 for Emirates). Some systems display it with a hyphen, others without.',
      },
      {
        q: 'How long does customs clearance take at Dubai Airport?',
        a: 'Dubai Customs typically clears standard air cargo within 1–2 business days. Express clearance via the Dubai Customs Smart Gate system can process shipments within hours. Regulated goods (food, pharmaceuticals, electronics) may require additional permits.',
      },
      {
        q: 'What are free storage days at Dubai Airport?',
        a: 'Most airlines allow 2–3 days of free storage at DXB before storage charges begin. After that, fees typically range from AED 10–30 per 100 kg per day depending on the terminal and commodity type.',
      },
      {
        q: 'Which cargo terminals operate at Dubai Airport (DXB)?',
        a: 'Dubai Airport has two main cargo facilities: the Emirates SkyCargo Terminal (world\'s largest single-operator cargo terminal) in Terminal 2 area, and the dnata Cargo Centre which handles third-party carrier cargo. FedEx and DHL operate their own dedicated facilities at DXB.',
      },
    ],
    relatedLinks: [
      { label: 'Track Emirates SkyCargo', href: '/track/emirates-skycargo' },
      { label: 'Track FedEx', href: '/track/fedex' },
      { label: 'Air Freight Rates', href: '/rates' },
      { label: 'Singapore Changi Cargo', href: '/airports/singapore-sin' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'frankfurt-fra': {
    slug: 'frankfurt-fra',
    name: 'Frankfurt Airport',
    shortName: 'Frankfurt (FRA)',
    country: 'Germany',
    countryIso: 'DE',
    iata: 'FRA',
    icao: 'EDDF',
    lat: 50.0379,
    lng: 8.5622,
    annualCargo: '2.2 million tonnes (2023)',
    mainAirlines: ['Lufthansa Cargo', 'FedEx', 'DHL Aviation', 'Cargolux', 'Korean Air Cargo'],
    badge: 'FRA CARGO TRACKING',
    h1: 'Frankfurt Airport Cargo Tracking (FRA)',
    subtitle: "Track air cargo and AWB shipments through Frankfurt Airport — Europe's busiest air cargo hub and Germany's main freight gateway.",
    seoTitle: 'Frankfurt Airport Cargo Tracking (FRA) — Track Air Freight | Trackora',
    seoDescription: 'Track air cargo through Frankfurt Airport (FRA). Enter your AWB number for real-time cargo status at Europe\'s busiest cargo airport.',
    facts: [
      { label: 'IATA Code', value: 'FRA' },
      { label: 'ICAO Code', value: 'EDDF' },
      { label: 'Location', value: 'Frankfurt, Germany' },
      { label: 'Annual Cargo', value: '2.2 million tonnes' },
      { label: 'Cargo Terminals', value: 'Lufthansa Cargo Center, FRA Cargo City South & North' },
      { label: 'Rank', value: '#8 globally, #1 Europe' },
    ],
    howSteps: [
      {
        title: 'Obtain your Air Waybill number',
        body: 'Your freight forwarder or airline will issue an AWB number when your cargo is booked. Lufthansa Cargo AWBs start with 020, FedEx with 020 (Express) or 161 (International Priority Freight), and Cargolux with 172.',
      },
      {
        title: 'Enter the AWB number above',
        body: 'Paste your AWB number into the tracking box. Trackora auto-detects the airline from the 3-digit prefix and fetches live cargo events.',
      },
      {
        title: 'Track all milestones',
        body: 'View pick-up, acceptance at FRA, loading onto aircraft, departure, arrival at destination airport, and customs clearance events.',
      },
    ],
    faqs: [
      {
        q: 'How do I track air cargo at Frankfurt Airport (FRA)?',
        a: 'Enter your AWB number in the tracker above. Lufthansa Cargo (prefix 020) is the dominant carrier at FRA, but FedEx, DHL, Cargolux, and Korean Air Cargo also have major operations there.',
      },
      {
        q: 'What cargo terminals are at Frankfurt Airport?',
        a: "Frankfurt has two main cargo areas: Cargo City South (home to Lufthansa Cargo's main hub, the world's largest airline cargo center) and Cargo City North (FedEx, DHL, and other integrators). Both connect directly to the airfield.",
      },
      {
        q: 'How does German customs clearance work for air cargo?',
        a: 'Germany uses the EU customs union. Air cargo is cleared by German Customs (Zoll) via the electronic ATLAS system. Standard clearance takes 1–2 days; pre-lodged declarations can clear within hours of aircraft arrival. Regulated goods require additional permits.',
      },
      {
        q: 'What are free storage days at Frankfurt Airport?',
        a: 'Most airlines provide 2–3 free storage days at FRA. After that, Lufthansa Cargo and other handlers typically charge €0.10–0.30 per kg per day for general cargo.',
      },
      {
        q: 'What is the ICAO code for Frankfurt Airport?',
        a: 'The ICAO code for Frankfurt Airport is EDDF. The IATA code is FRA. Both appear on cargo documents, flight plans, and customs entries.',
      },
    ],
    relatedLinks: [
      { label: 'Track Lufthansa Cargo', href: '/track/lufthansa-cargo' },
      { label: 'Track DHL', href: '/track/dhl' },
      { label: 'Air Freight Rates', href: '/rates' },
      { label: 'London Heathrow Cargo', href: '/airports/london-heathrow' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'london-heathrow': {
    slug: 'london-heathrow',
    name: 'London Heathrow Airport',
    shortName: 'Heathrow (LHR)',
    country: 'United Kingdom',
    countryIso: 'GB',
    iata: 'LHR',
    icao: 'EGLL',
    lat: 51.4700,
    lng: -0.4543,
    annualCargo: '1.8 million tonnes (2023)',
    mainAirlines: ['British Airways World Cargo', 'Virgin Atlantic Cargo', 'Qatar Airways Cargo', 'IAG Cargo', 'FedEx'],
    badge: 'LHR CARGO TRACKING',
    h1: 'London Heathrow Cargo Tracking (LHR)',
    subtitle: "Track air cargo and AWB shipments through London Heathrow Airport — the UK's largest air freight gateway.",
    seoTitle: 'London Heathrow Cargo Tracking (LHR) — Track Air Freight | Trackora',
    seoDescription: "Track air cargo through London Heathrow Airport (LHR). Enter your AWB number for real-time status at the UK's busiest cargo airport.",
    facts: [
      { label: 'IATA Code', value: 'LHR' },
      { label: 'ICAO Code', value: 'EGLL' },
      { label: 'Location', value: 'London, United Kingdom' },
      { label: 'Annual Cargo', value: '1.8 million tonnes' },
      { label: 'Cargo Terminals', value: 'Heathrow Cargo (WFS), British Airways World Cargo, IAG Cargo Terminal' },
      { label: 'Rank', value: '#1 in UK, top 20 globally' },
    ],
    howSteps: [
      {
        title: 'Get your Air Waybill number',
        body: 'Your forwarder or airline will provide an AWB when your shipment is booked. British Airways World Cargo / IAG Cargo uses prefix 125, Qatar Airways Cargo uses 157, Virgin Atlantic Cargo uses 932.',
      },
      {
        title: 'Enter it above',
        body: 'Type or paste your AWB number into the tracking box. Trackora identifies the airline from the prefix and retrieves the latest cargo events.',
      },
      {
        title: 'Monitor your cargo through Heathrow',
        body: 'Track acceptance at LHR, flight departure, arrival at destination, and UK Border Force customs release status.',
      },
    ],
    faqs: [
      {
        q: 'How do I track air cargo at Heathrow (LHR)?',
        a: 'Enter your AWB number in the tracker above. British Airways World Cargo (prefix 125), IAG Cargo, Qatar Airways Cargo (157), and Virgin Atlantic Cargo (932) are major carriers at LHR.',
      },
      {
        q: 'What cargo terminal handles my shipment at Heathrow?',
        a: "Most general cargo is handled by WFS (Worldwide Flight Services) in the Heathrow Cargo Terminal area. British Airways and IAG operate their own dedicated facility. FedEx has a ramp handling operation at Heathrow, though express parcels often route via East Midlands.",
      },
      {
        q: 'How does UK customs clearance work at Heathrow?',
        a: 'Post-Brexit, all non-UK imports at LHR are processed by UK Border Force using the CHIEF or CDS customs declaration system. Standard clearance takes 1–3 days. HMRC-approved fast-track lanes can clear pre-lodged entries within hours of arrival.',
      },
      {
        q: 'What are free storage days for cargo at Heathrow?',
        a: 'Free storage at Heathrow cargo terminals is typically 2–3 days from aircraft arrival. After that, storage fees typically range from £0.08–0.25 per kg per day depending on the handler and commodity.',
      },
      {
        q: 'What is the ICAO code for Heathrow Airport?',
        a: 'The ICAO code for London Heathrow Airport is EGLL. The IATA code is LHR.',
      },
    ],
    relatedLinks: [
      { label: 'Track British Airways Cargo', href: '/track/british-airways-cargo' },
      { label: 'Track Qatar Airways Cargo', href: '/track/qatar-airways-cargo' },
      { label: 'Air Freight Rates', href: '/rates' },
      { label: 'Frankfurt Airport Cargo', href: '/airports/frankfurt-fra' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'singapore-sin': {
    slug: 'singapore-sin',
    name: 'Singapore Changi Airport',
    shortName: 'Changi (SIN)',
    country: 'Singapore',
    countryIso: 'SG',
    iata: 'SIN',
    icao: 'WSSS',
    lat: 1.3644,
    lng: 103.9915,
    annualCargo: '2.0 million tonnes (2023)',
    mainAirlines: ['Singapore Airlines Cargo', 'Qantas Freight', 'FedEx', 'DHL Aviation', 'Cathay Pacific Cargo'],
    badge: 'SIN CARGO TRACKING',
    h1: 'Singapore Changi Cargo Tracking (SIN)',
    subtitle: "Track air cargo and AWB shipments through Singapore Changi Airport — Asia's premier air cargo hub.",
    seoTitle: 'Singapore Changi Cargo Tracking (SIN) — Track Air Freight | Trackora',
    seoDescription: 'Track air cargo through Singapore Changi Airport (SIN). Enter your AWB number for real-time cargo status.',
    facts: [
      { label: 'IATA Code', value: 'SIN' },
      { label: 'ICAO Code', value: 'WSSS' },
      { label: 'Location', value: 'Singapore' },
      { label: 'Annual Cargo', value: '2.0 million tonnes' },
      { label: 'Cargo Terminals', value: 'Changi Airfreight Centre, SIA Cargo Terminal' },
      { label: 'Rank', value: '#7 globally' },
    ],
    howSteps: [
      {
        title: 'Find your Air Waybill number',
        body: 'Your freight forwarder or airline will issue an AWB when cargo is accepted. Singapore Airlines Cargo uses prefix 618, FedEx uses 020, and DHL uses 057.',
      },
      {
        title: 'Enter the AWB above',
        body: 'Paste your AWB into the tracking box. Trackora auto-detects the airline from the 3-digit prefix and fetches live status.',
      },
      {
        title: 'View status milestones',
        body: 'See acceptance at SIN, aircraft departure, arrival at destination, and Singapore Customs clearance events in chronological order.',
      },
    ],
    faqs: [
      {
        q: 'How do I track air cargo at Singapore Changi (SIN)?',
        a: 'Enter your AWB number in the tracker above. Singapore Airlines Cargo (prefix 618), FedEx (020), and DHL (057) are major carriers operating through SIN. Trackora covers all of them.',
      },
      {
        q: 'What is the Changi Airfreight Centre?',
        a: "The Changi Airfreight Centre (CAC) is a dedicated cargo complex adjacent to Changi Airport handling general and express cargo. Singapore Airlines Cargo has its own terminal within the CAC. The complex operates 24/7 and is one of Asia's most efficient cargo facilities.",
      },
      {
        q: 'How long does customs clearance take at Singapore Changi?',
        a: 'Singapore Customs (part of ICA) processes most air cargo within 1–2 business days via the TradeNet electronic system. Singapore\'s free trade agreements with over 25 countries mean many shipments qualify for preferential clearance. Controlled goods require additional permits from the relevant agencies.',
      },
      {
        q: 'What are free storage days at Changi Airport?',
        a: 'Free storage at Changi cargo terminals is typically 2–3 days from aircraft arrival. After that, storage fees range from SGD 0.15–0.45 per kg per day depending on the handler and cargo type.',
      },
      {
        q: 'What is the ICAO code for Singapore Changi Airport?',
        a: 'The ICAO code for Singapore Changi Airport is WSSS. The IATA code is SIN.',
      },
    ],
    relatedLinks: [
      { label: 'Track Singapore Airlines Cargo', href: '/track/singapore-airlines-cargo' },
      { label: 'Track FedEx', href: '/track/fedex' },
      { label: 'Air Freight Rates', href: '/rates' },
      { label: 'Hong Kong Airport Cargo', href: '/airports/hong-kong-hkg' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'hong-kong-hkg': {
    slug: 'hong-kong-hkg',
    name: 'Hong Kong International Airport',
    shortName: 'Hong Kong (HKG)',
    country: 'Hong Kong SAR',
    countryIso: 'HK',
    iata: 'HKG',
    icao: 'VHHH',
    lat: 22.3080,
    lng: 113.9185,
    annualCargo: '4.7 million tonnes (2023)',
    mainAirlines: ['Cathay Pacific Cargo', 'Air Hong Kong', 'FedEx', 'UPS Airlines', 'China Airlines Cargo'],
    badge: 'HKG CARGO TRACKING',
    h1: 'Hong Kong Airport Cargo Tracking (HKG)',
    subtitle: "Track air cargo and AWB shipments through Hong Kong International Airport — the world's busiest cargo airport by tonnage.",
    seoTitle: 'Hong Kong Airport Cargo Tracking (HKG) — Track Air Freight | Trackora',
    seoDescription: "Track air cargo through Hong Kong International Airport (HKG). Enter your AWB number for real-time status at the world's #1 cargo airport.",
    facts: [
      { label: 'IATA Code', value: 'HKG' },
      { label: 'ICAO Code', value: 'VHHH' },
      { label: 'Location', value: 'Lantau Island, Hong Kong SAR' },
      { label: 'Annual Cargo', value: '4.7 million tonnes' },
      { label: 'Cargo Terminals', value: 'Cathay Pacific Cargo Terminal, HACTL SuperTerminal 1' },
      { label: 'Rank', value: '#1 globally for air cargo' },
    ],
    howSteps: [
      {
        title: 'Get your Air Waybill number',
        body: 'Your forwarder or airline will issue an AWB when cargo is accepted. Cathay Pacific Cargo uses prefix 160, FedEx uses 020, UPS uses 406, and Air Hong Kong uses 081.',
      },
      {
        title: 'Enter it in the tracker above',
        body: 'Paste your AWB into the tracking field. Trackora identifies the airline from the 3-digit prefix and retrieves live cargo status.',
      },
      {
        title: 'Monitor your cargo status',
        body: "View acceptance, loading, departure from HKG, arrival, and Hong Kong Customs clearance events as your shipment moves through the world's busiest cargo airport.",
      },
    ],
    faqs: [
      {
        q: 'How do I track air cargo at Hong Kong Airport (HKG)?',
        a: 'Enter your AWB number in the tracker above. Cathay Pacific Cargo (prefix 160) is the dominant carrier at HKG, followed by FedEx (020), UPS (406), and Air Hong Kong (081, DHL express). Trackora covers all of them.',
      },
      {
        q: 'What cargo terminals operate at Hong Kong Airport?',
        a: "HKG has two main cargo facilities: HACTL's SuperTerminal 1 (one of the largest air cargo terminals in the world, handling most third-party airline cargo) and the Cathay Pacific Cargo Terminal (CPCT), which handles Cathay's own cargo and is the world's largest single-airline cargo terminal.",
      },
      {
        q: 'How does Hong Kong customs clearance work for air cargo?',
        a: 'Hong Kong has no customs duties on most imports (it is a free port). Most cargo clears customs within 1 business day via the ROCARS (Real-time Online Cargo and Arrival Reporting System). Controlled items such as pharmaceuticals, food, and electronics may require import licences from relevant authorities.',
      },
      {
        q: 'What are free storage days at Hong Kong Airport?',
        a: 'Free storage at HKG cargo terminals is typically 2–3 days from flight arrival. HACTL and CPCT then apply storage fees, typically HKD 0.30–0.80 per kg per day depending on cargo type and temperature requirements.',
      },
      {
        q: 'Why is Hong Kong the world\'s busiest cargo airport?',
        a: "Hong Kong's position as a free port (no import duties), its geographic location at the center of Asia-Pacific trade routes, the Cathay Pacific hub, and world-class infrastructure make HKG the world's #1 cargo airport by tonnage — a title it has held for most of the past two decades.",
      },
    ],
    relatedLinks: [
      { label: 'Track Cathay Pacific Cargo', href: '/track/cathay-pacific-cargo' },
      { label: 'Track FedEx', href: '/track/fedex' },
      { label: 'Air Freight Rates', href: '/rates' },
      { label: 'Singapore Changi Cargo', href: '/airports/singapore-sin' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },
}
