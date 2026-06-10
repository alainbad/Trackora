export interface PortConfig {
  slug: string
  name: string
  shortName: string
  country: string
  countryIso: string
  unlocode: string
  lat: number
  lng: number
  annualTeu: string
  mainCarriers: string[]
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

export const PORT_DATA: Record<string, PortConfig> = {
  'jebel-ali-dubai': {
    slug: 'jebel-ali-dubai',
    name: 'Jebel Ali Port, Dubai',
    shortName: 'Jebel Ali',
    country: 'United Arab Emirates',
    countryIso: 'AE',
    unlocode: 'AEJEA',
    lat: 25.0047,
    lng: 55.0633,
    annualTeu: '14.8 million TEU (2023)',
    mainCarriers: ['Maersk', 'MSC', 'CMA CGM', 'Hapag-Lloyd', 'Emirates Shipping', 'COSCO'],
    badge: 'JEBEL ALI PORT TRACKING',
    h1: 'Jebel Ali Port Cargo Tracking',
    subtitle: 'Track containers and shipments through Jebel Ali — the largest port in the Middle East and 9th busiest globally.',
    seoTitle: 'Jebel Ali Port Tracking — Track Cargo & Containers | Trackora',
    seoDescription: 'Track any container or shipment through Jebel Ali Port (Dubai). Enter your container number, B/L or booking reference for real-time status.',
    facts: [
      { label: 'Location', value: 'Dubai, UAE' },
      { label: 'UN/LOCODE', value: 'AE JEA' },
      { label: 'Annual Throughput', value: '14.8 million TEU' },
      { label: 'Rank', value: '#9 globally, #1 Middle East' },
      { label: 'Container Terminals', value: '3 terminals, 67 berths' },
      { label: 'Operator', value: 'DP World' },
    ],
    howSteps: [
      {
        title: 'Get your reference number',
        body: "Obtain your container number (e.g. MSCU1234567), bill of lading (B/L), or booking reference from your freight forwarder or shipping line confirmation.",
      },
      {
        title: 'Enter it in the tracker above',
        body: "Paste your reference into the tracking box. Trackora automatically detects whether it's a container ID, B/L, or AWB and routes it to the correct carrier.",
      },
      {
        title: 'View real-time status',
        body: 'See gate-in/out events, vessel load confirmation, departure and arrival times, and port of discharge ETA in real time.',
      },
    ],
    faqs: [
      {
        q: 'How do I track a container at Jebel Ali?',
        a: "Enter your container number (4 letters + 7 digits, e.g. MSCU1234567) or your bill of lading number into the tracking box above. Trackora queries the shipping line's system and displays the latest status from Jebel Ali.",
      },
      {
        q: 'What shipping lines operate at Jebel Ali?',
        a: 'Jebel Ali is served by all major global shipping lines including Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, Yang Ming, and ZIM, as well as regional lines like Emirates Shipping.',
      },
      {
        q: 'How long does customs clearance take at Jebel Ali?',
        a: 'Standard customs clearance at Jebel Ali typically takes 1–3 business days for general cargo. Shipments flagged for physical inspection may take 3–5 days. Dubai Customs offers an express clearance lane for pre-approved importers.',
      },
      {
        q: "What are the free days for containers at Jebel Ali?",
        a: "Most shipping lines offer 5–7 free days at Jebel Ali before detention charges begin. DP World (the terminal operator) also grants a separate free storage period (typically 5 days). After free days, detention fees typically start at $20–40/day for 20' containers.",
      },
      {
        q: "What is Jebel Ali's UNLOCODE?",
        a: 'The UN/LOCODE for Jebel Ali is AE JEA. This code is used in trade documents, EDI messages, and customs declarations to identify the port.',
      },
    ],
    relatedLinks: [
      { label: 'Container Tracking', href: '/track/container' },
      { label: 'Bill of Lading Tracking', href: '/track/bill-of-lading' },
      { label: 'Sea Freight Tracking', href: '/track/sea-freight' },
      { label: 'Detention Calculator', href: '/detention-calculator' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'rotterdam': {
    slug: 'rotterdam',
    name: 'Port of Rotterdam',
    shortName: 'Rotterdam',
    country: 'Netherlands',
    countryIso: 'NL',
    unlocode: 'NLRTM',
    lat: 51.9225,
    lng: 4.4792,
    annualTeu: '14.6 million TEU (2023)',
    mainCarriers: ['Maersk', 'MSC', 'CMA CGM', 'Hapag-Lloyd', 'ONE', 'COSCO', 'Evergreen'],
    badge: 'PORT OF ROTTERDAM TRACKING',
    h1: 'Port of Rotterdam Cargo Tracking',
    subtitle: "Track containers and shipments through the Port of Rotterdam — Europe's largest port and gateway to the continent.",
    seoTitle: 'Port of Rotterdam Tracking — Track Cargo & Containers | Trackora',
    seoDescription: "Track containers and cargo through the Port of Rotterdam. Enter your container number or B/L for real-time status at Europe's largest port.",
    facts: [
      { label: 'Location', value: 'Rotterdam, Netherlands' },
      { label: 'UN/LOCODE', value: 'NL RTM' },
      { label: 'Annual Throughput', value: '14.6 million TEU' },
      { label: 'Rank', value: '#10 globally, #1 Europe' },
      { label: 'Port Area', value: '105 km², 40+ terminals' },
      { label: 'Operator', value: 'Port of Rotterdam Authority' },
    ],
    howSteps: [
      {
        title: 'Find your container or B/L number',
        body: 'Your forwarder or shipping line will provide a container number (e.g. MAEU1234567) or bill of lading number in their booking confirmation.',
      },
      {
        title: 'Enter it above and track',
        body: 'Paste the number into the tracking box. Trackora recognizes the carrier prefix automatically and queries the live shipping line API.',
      },
      {
        title: 'Monitor port events',
        body: 'See gate-in, vessel load, departure from Rotterdam, and ETA at your destination port — all in one view.',
      },
    ],
    faqs: [
      {
        q: 'How do I track a container at Rotterdam?',
        a: 'Enter your container number or bill of lading into the tracker above. Rotterdam is served by all major shipping lines, and Trackora covers them all.',
      },
      {
        q: 'What terminals operate at Rotterdam?',
        a: "Rotterdam's main container terminals include ECT (Euromax and Delta), RWG (Rotterdam World Gateway), and APM Terminals Maasvlakte II. Most major shipping lines have dedicated terminal calls.",
      },
      {
        q: 'How long does customs clearance take at Rotterdam?',
        a: 'Rotterdam processes customs via the Dutch Customs Authority. Standard clearance for EU imports takes 1–2 days. Pre-lodged declarations (via AGS) can clear within hours. Non-EU imports may require additional documentation.',
      },
      {
        q: 'What are free days at Rotterdam?',
        a: 'Free storage at Rotterdam terminals is typically 5–7 days depending on the shipping line and terminal. After that, demurrage and detention fees apply — use our Detention Calculator to estimate costs.',
      },
      {
        q: "What is Rotterdam's UNLOCODE?",
        a: 'The UN/LOCODE for Rotterdam is NL RTM. This is used on all shipping documents, B/Ls, and customs entries.',
      },
    ],
    relatedLinks: [
      { label: 'Container Tracking', href: '/track/container' },
      { label: 'Bill of Lading Tracking', href: '/track/bill-of-lading' },
      { label: 'Port of Singapore', href: '/ports/singapore' },
      { label: 'Detention Calculator', href: '/detention-calculator' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'singapore': {
    slug: 'singapore',
    name: 'Port of Singapore',
    shortName: 'Singapore',
    country: 'Singapore',
    countryIso: 'SG',
    unlocode: 'SGSIN',
    lat: 1.2897,
    lng: 103.8501,
    annualTeu: '39.0 million TEU (2023)',
    mainCarriers: ['Maersk', 'MSC', 'CMA CGM', 'COSCO', 'ONE', 'Evergreen', 'Yang Ming', 'PIL'],
    badge: 'PORT OF SINGAPORE TRACKING',
    h1: 'Port of Singapore Cargo Tracking',
    subtitle: "Track containers and cargo through the Port of Singapore — the world's second busiest port by container throughput.",
    seoTitle: 'Port of Singapore Tracking — Track Cargo & Containers | Trackora',
    seoDescription: 'Track containers through the Port of Singapore (PSA). Enter your container number or bill of lading for real-time cargo status.',
    facts: [
      { label: 'Location', value: 'Singapore' },
      { label: 'UN/LOCODE', value: 'SG SIN' },
      { label: 'Annual Throughput', value: '39.0 million TEU' },
      { label: 'Rank', value: '#2 globally' },
      { label: 'Terminals', value: 'Tanjong Pagar, Keppel, Brani, Pasir Panjang' },
      { label: 'Operator', value: 'PSA International' },
    ],
    howSteps: [
      {
        title: 'Locate your container or B/L number',
        body: 'Your shipping line or freight forwarder will provide either a container number (ISO format: 4 letters + 7 digits) or a bill of lading number.',
      },
      {
        title: 'Track it above',
        body: "Enter the number in the tracking box. Trackora auto-identifies the carrier and fetches live status from the shipping line's system.",
      },
      {
        title: 'Get port event updates',
        body: 'View gate-in, yard position, vessel load, and departure events as your cargo moves through Singapore.',
      },
    ],
    faqs: [
      {
        q: 'How do I track a container at Singapore?',
        a: 'Enter your container number or B/L number in the tracker above. Singapore is served by all major global lines and Trackora covers them all, including MSC, Maersk, CMA CGM, COSCO, and ONE.',
      },
      {
        q: 'What is PSA Singapore?',
        a: "PSA International operates the Port of Singapore and is the world's largest port operator. Their facilities handle transhipment cargo from across Southeast Asia, South Asia, and the Far East.",
      },
      {
        q: 'How long do containers stay at Singapore before transshipment?',
        a: 'Singapore is primarily a transshipment hub. Dwell time for transshipment cargo is typically 3–5 days. Free days before detention charges are usually 5–7 days depending on the shipping line.',
      },
      {
        q: 'What is the UNLOCODE for Singapore?',
        a: 'The UN/LOCODE for the Port of Singapore is SG SIN.',
      },
      {
        q: 'Which terminal handles which shipping line at Singapore?',
        a: "Most lines operate from PSA's Pasir Panjang Terminal (Terminals 1–4). CMA CGM and its alliance partners typically use Tanjong Pagar and Keppel Terminals. The new Tuas Mega Port (opening progressively 2022–2040) will consolidate all terminals.",
      },
    ],
    relatedLinks: [
      { label: 'Container Tracking', href: '/track/container' },
      { label: 'Sea Freight Tracking', href: '/track/sea-freight' },
      { label: 'Port of Rotterdam', href: '/ports/rotterdam' },
      { label: 'Detention Calculator', href: '/detention-calculator' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'shanghai': {
    slug: 'shanghai',
    name: 'Port of Shanghai',
    shortName: 'Shanghai',
    country: 'China',
    countryIso: 'CN',
    unlocode: 'CNSHA',
    lat: 31.2304,
    lng: 121.4737,
    annualTeu: '49.2 million TEU (2023)',
    mainCarriers: ['COSCO', 'MSC', 'Maersk', 'CMA CGM', 'Evergreen', 'ONE', 'Yang Ming', 'ZIM'],
    badge: 'PORT OF SHANGHAI TRACKING',
    h1: 'Port of Shanghai Cargo Tracking',
    subtitle: "Track containers and cargo through the Port of Shanghai — the world's busiest port for 14 consecutive years.",
    seoTitle: 'Port of Shanghai Tracking — Track Cargo & Containers | Trackora',
    seoDescription: "Track containers through the Port of Shanghai. Enter your container number or bill of lading for real-time status at the world's #1 port.",
    facts: [
      { label: 'Location', value: 'Shanghai, China' },
      { label: 'UN/LOCODE', value: 'CN SHA' },
      { label: 'Annual Throughput', value: '49.2 million TEU' },
      { label: 'Rank', value: '#1 globally (14 consecutive years)' },
      { label: 'Key Terminals', value: 'Yangshan Deep Water Port, Waigaoqiao' },
      { label: 'Operator', value: 'Shanghai International Port Group (SIPG)' },
    ],
    howSteps: [
      {
        title: 'Get your container or B/L number',
        body: 'Your Chinese supplier or freight forwarder will provide a container number (e.g. CSNU1234567) or bill of lading number when your cargo is loaded.',
      },
      {
        title: 'Enter it in the tracker',
        body: 'Paste the number above. Trackora automatically identifies COSCO, Evergreen, ONE, Yang Ming, and other carriers by their container prefix.',
      },
      {
        title: 'View real-time export status',
        body: 'See gate-in, customs release, vessel load at Yangshan, and departure confirmations.',
      },
    ],
    faqs: [
      {
        q: 'How do I track a container leaving Shanghai?',
        a: 'Enter your container number or bill of lading in the tracker above. COSCO, Evergreen, and ONE are common carriers from Shanghai — Trackora covers all of them.',
      },
      {
        q: 'What is Yangshan Deep Water Port?',
        a: "Yangshan is the offshore deep-water section of Shanghai Port, connected to the mainland by the 32km Donghai Bridge. It handles the largest container vessels and accounts for over 70% of Shanghai's container throughput.",
      },
      {
        q: 'How long does Chinese customs clearance take for exports?',
        a: 'Export customs clearance in China typically takes 1–3 days when all documentation (commercial invoice, packing list, customs declaration) is correct. Expedited clearance is available through bonded warehouse operators.',
      },
      {
        q: 'What are free days at Shanghai?',
        a: 'Free days at Shanghai terminals are typically 7–14 days for exports before any storage fees apply. For imports at destination, check the destination port\'s policy.',
      },
      {
        q: "What is Shanghai's UNLOCODE?",
        a: 'The UN/LOCODE for the Port of Shanghai is CN SHA.',
      },
    ],
    relatedLinks: [
      { label: 'Container Tracking', href: '/track/container' },
      { label: 'Sea Freight Tracking', href: '/track/sea-freight' },
      { label: 'Port of Singapore', href: '/ports/singapore' },
      { label: 'Bill of Lading Tracking', href: '/track/bill-of-lading' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },

  'antwerp-bruges': {
    slug: 'antwerp-bruges',
    name: 'Port of Antwerp-Bruges',
    shortName: 'Antwerp',
    country: 'Belgium',
    countryIso: 'BE',
    unlocode: 'BEANR',
    lat: 51.2994,
    lng: 4.3520,
    annualTeu: '12.0 million TEU (2023)',
    mainCarriers: ['MSC', 'Maersk', 'CMA CGM', 'Hapag-Lloyd', 'COSCO', 'ONE'],
    badge: 'PORT OF ANTWERP TRACKING',
    h1: 'Port of Antwerp-Bruges Cargo Tracking',
    subtitle: "Track containers through the Port of Antwerp-Bruges — Europe's second largest port and key gateway for chemicals, vehicles, and breakbulk cargo.",
    seoTitle: 'Port of Antwerp Tracking — Track Cargo & Containers | Trackora',
    seoDescription: 'Track containers and cargo through the Port of Antwerp-Bruges. Enter your container number or B/L for real-time status.',
    facts: [
      { label: 'Location', value: 'Antwerp, Belgium' },
      { label: 'UN/LOCODE', value: 'BE ANR' },
      { label: 'Annual Throughput', value: '12.0 million TEU' },
      { label: 'Rank', value: '#2 Europe, #14 globally' },
      { label: 'Key Terminals', value: 'PSA Antwerp, DP World Antwerp, MSC Terminal' },
      { label: 'Specialty', value: 'Chemicals, vehicles (ro-ro), breakbulk' },
    ],
    howSteps: [
      {
        title: 'Find your reference number',
        body: 'Obtain your container number or bill of lading from your freight forwarder. MSC and Maersk are the dominant carriers at Antwerp.',
      },
      {
        title: 'Track above',
        body: 'Enter the number in the tracker. Trackora identifies the carrier automatically and fetches live status.',
      },
      {
        title: 'Monitor your cargo',
        body: 'View gate-in events, terminal yard position, vessel load, and estimated departure from Antwerp.',
      },
    ],
    faqs: [
      {
        q: 'How do I track a container at Antwerp?',
        a: 'Enter your container number (e.g. MSCU1234567) or bill of lading into the tracker above. MSC, Maersk, CMA CGM, and Hapag-Lloyd all have significant presence at Antwerp.',
      },
      {
        q: 'What is the difference between Antwerp and Bruges ports?',
        a: 'Following the 2022 merger of Antwerp and Zeebrugge, the entity is now called Port of Antwerp-Bruges. Container operations remain primarily in Antwerp; Zeebrugge specializes in ro-ro (vehicles), LNG, and cruise ships.',
      },
      {
        q: 'How does Belgian customs work for imports?',
        a: 'Belgium uses the EU customs union. Imports from outside the EU are processed through the Belgian Customs and Excise Administration. Single Administrative Documents (SAD) are lodged electronically via PLDA (Paperless Douane/Accijnzen) and clearance typically takes 1–2 days.',
      },
      {
        q: 'What are free days at Antwerp?',
        a: 'Free days at Antwerp terminals are typically 5–7 days depending on the shipping line and terminal operator. Use our Detention Calculator to estimate charges beyond the free period.',
      },
      {
        q: "What is Antwerp's UNLOCODE?",
        a: 'The UN/LOCODE for the Port of Antwerp is BE ANR.',
      },
    ],
    relatedLinks: [
      { label: 'Port of Rotterdam', href: '/ports/rotterdam' },
      { label: 'Container Tracking', href: '/track/container' },
      { label: 'Bill of Lading Tracking', href: '/track/bill-of-lading' },
      { label: 'Detention Calculator', href: '/detention-calculator' },
      { label: 'Track Any Shipment', href: '/track' },
    ],
  },
}
