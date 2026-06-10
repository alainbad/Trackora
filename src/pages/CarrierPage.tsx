import { useParams, Link, Navigate } from 'react-router-dom'
import { useSEO } from '../hooks/useSEO'
import { useIsMobile } from '../hooks/useIsMobile'

interface CarrierInfo {
  name: string
  type: 'express' | 'sea' | 'air' | 'land'
  emoji: string
  color: string
  description: string
  trackingFormat: string
  formatExample: string
  guide: string[]
  faqs: { q: string; a: string }[]
  isMarketplace?: boolean   // e.g. Shopify — not a real carrier, needs carrier number
  marketplaceNote?: string  // banner text explaining how to find the real tracking number
}

const CARRIERS: Record<string, CarrierInfo> = {
  'fedex': {
    name: 'FedEx', type: 'express', emoji: '📦', color: '#FF6200',
    description: 'FedEx is one of the world\'s largest courier and logistics companies, operating 600+ aircraft and delivering to 220+ countries. Track your FedEx package in real time on Trackora.',
    trackingFormat: '12, 15, or 20 digits',
    formatExample: '123456789012',
    guide: [
      'Find your FedEx tracking number on your shipping confirmation email or receipt.',
      'Enter the 12, 15, or 20-digit number in the Trackora search box.',
      'Trackora automatically detects FedEx and retrieves your delivery timeline.',
      'Enable notifications to get alerted on every status change.',
    ],
    faqs: [
      { q: 'Where do I find my FedEx tracking number?', a: 'Your FedEx tracking number appears in your shipping confirmation email, on the shipping label, or in your FedEx account shipment history.' },
      { q: 'How long does FedEx tracking take to update?', a: 'FedEx tracking typically updates within 30-60 minutes of each scan event. Some international shipments may have longer gaps between updates.' },
      { q: 'What does "In transit" mean for FedEx?', a: 'In transit means your package is moving through the FedEx network toward its destination. You will see the current facility location and expected delivery date.' },
    ],
  },
  'dhl': {
    name: 'DHL Express', type: 'express', emoji: '📦', color: '#FFCC00',
    description: 'DHL Express is the world\'s leading international express courier, delivering to 220+ countries. Track your DHL shipment live on Trackora.',
    trackingFormat: '10-digit number',
    formatExample: '1234567890',
    guide: [
      'Locate your DHL waybill number on your shipment receipt or email.',
      'Enter the 10-digit number in the Trackora search bar.',
      'See your package\'s current location, transit history, and delivery ETA.',
      'Set up email alerts for instant status updates.',
    ],
    faqs: [
      { q: 'What is a DHL waybill number?', a: 'A DHL waybill number is the unique 10-digit tracking number assigned to your shipment. It appears on the shipping label and your confirmation email.' },
      { q: 'How often does DHL tracking update?', a: 'DHL tracking updates at each scan point — typically every few hours in transit and more frequently during final delivery.' },
      { q: 'Can I track DHL Parcel and DHL eCommerce on Trackora?', a: 'Yes. Trackora supports DHL Express, DHL Parcel, and DHL eCommerce tracking numbers.' },
    ],
  },
  'ups': {
    name: 'UPS', type: 'express', emoji: '📦', color: '#f5a623',
    description: 'UPS (United Parcel Service) delivers over 24 million packages daily in 220+ countries. Track your UPS package in real time — from pickup to delivery.',
    trackingFormat: '1Z + 16 alphanumeric characters',
    formatExample: '1Z999AA10123456784',
    guide: [
      'Find your UPS tracking number (starts with 1Z) on your shipping confirmation.',
      'Enter the 18-character number starting with "1Z" in the Trackora search box.',
      'View real-time location, delivery timeline, and proof of delivery.',
    ],
    faqs: [
      { q: 'What does a UPS tracking number look like?', a: 'UPS tracking numbers start with "1Z" followed by 16 alphanumeric characters, totalling 18 characters (e.g. 1Z999AA10123456784).' },
      { q: 'Can I track UPS international shipments on Trackora?', a: 'Yes. Trackora tracks UPS domestic (US) and international shipments, including UPS Worldwide Express and UPS Standard.' },
    ],
  },
  'maersk': {
    name: 'Maersk', type: 'sea', emoji: '🚢', color: '#42ADEF',
    description: 'Maersk is the world\'s largest container shipping company, operating over 700 vessels. Track your Maersk container, bill of lading, or booking reference in real time.',
    trackingFormat: 'Container: MSKU + 7 digits | B/L: 9 digits',
    formatExample: 'MSKU1234567',
    guide: [
      'Identify your reference type: container number (MSKU/MAEU prefix), bill of lading, or booking number.',
      'Use the Sea Freight mode on Trackora and select Maersk as your carrier.',
      'Enter your reference number — Maersk container tracking supports direct deep-links.',
      'For B/L and booking references, you will be redirected to Maersk\'s official tracking portal.',
    ],
    faqs: [
      { q: 'What is a Maersk container number format?', a: 'Maersk containers use ISO 6346 format: 4 letters (e.g. MSKU or MRKU) followed by 7 digits. Example: MSKU1234567.' },
      { q: 'How do I track a Maersk bill of lading?', a: 'Enter your B/L number in the Sea Freight mode on Trackora and select Maersk. You will be redirected to Maersk\'s official portal with your number pre-filled for the most accurate results.' },
      { q: 'Where do I find my Maersk container number?', a: 'Your Maersk container number appears on your booking confirmation, bill of lading, or the physical container itself.' },
    ],
  },
  'msc': {
    name: 'MSC', type: 'sea', emoji: '🚢', color: '#003087',
    description: 'MSC (Mediterranean Shipping Company) is one of the world\'s largest ocean carriers with a fleet of 600+ vessels. Track your MSC container or booking on Trackora.',
    trackingFormat: 'Container: MSCU + 7 digits | B/L: MSCU prefix',
    formatExample: 'MSCU1234567',
    guide: [
      'Find your MSC container number or B/L reference on your shipping documents.',
      'Select Sea Freight mode on Trackora and choose MSC.',
      'Enter your container number for a pre-filled direct link to MSC\'s tracking portal.',
      'For the most up-to-date vessel position and port status, click "Open Pre-filled Tracking" to go directly to MSC\'s official website.',
    ],
    faqs: [
      { q: 'Why does Trackora redirect me to MSC\'s website?', a: 'MSC does not provide a public API for third-party tracking. Redirecting you to MSC\'s official portal ensures you see 100% accurate, real-time data — the same information MSC\'s own team uses.' },
      { q: 'What is an MSC container number?', a: 'MSC containers start with MSCU followed by 7 digits (e.g. MSCU1234567). You can find it on your bill of lading or booking confirmation.' },
    ],
  },
  'cma-cgm': {
    name: 'CMA CGM', type: 'sea', emoji: '🚢', color: '#C41230',
    description: 'CMA CGM is the third-largest container shipping line in the world with 600+ vessels. Track your CMA CGM container, B/L, or booking reference on Trackora.',
    trackingFormat: 'Container: CMAU + 7 digits | B/L: CMAU prefix',
    formatExample: 'CMAU1234567',
    guide: [
      'Locate your CMA CGM container number or B/L reference on your shipping documents.',
      'Use the Sea Freight tracker on Trackora and select CMA CGM.',
      'Your container number will be pre-filled in the direct link to CMA CGM\'s tracking portal.',
    ],
    faqs: [
      { q: 'What is a CMA CGM container number?', a: 'CMA CGM containers use the owner code CMAU followed by 7 digits. APL containers (owned by CMA CGM) use APHU as the prefix.' },
      { q: 'Can I track a CMA CGM B/L on Trackora?', a: 'Yes. Enter your B/L in the Sea Freight mode on Trackora and select CMA CGM. You will be redirected to CMA CGM\'s official tracking portal with your reference pre-filled.' },
    ],
  },
  'hapag-lloyd': {
    name: 'Hapag-Lloyd', type: 'sea', emoji: '🚢', color: '#f59e0b',
    description: 'Hapag-Lloyd is the fifth-largest container shipping company, operating 260+ vessels on 130 trade routes. Track your Hapag-Lloyd container or booking on Trackora.',
    trackingFormat: 'Container: HLCU + 7 digits | B/L: HLCU prefix',
    formatExample: 'HLCU1234567',
    guide: [
      'Find your Hapag-Lloyd container number (HLCU prefix) or B/L on your shipping documents.',
      'Select Sea Freight mode on Trackora and choose Hapag-Lloyd.',
      'Your number is pre-filled in the direct link to Hapag-Lloyd\'s tracking portal.',
    ],
    faqs: [
      { q: 'What is a Hapag-Lloyd tracking number?', a: 'Hapag-Lloyd containers use the owner code HLCU followed by 7 digits (e.g. HLCU1234567). B/L numbers typically follow a HLCUXXXX format.' },
    ],
  },
  'usps': {
    name: 'USPS', type: 'express', emoji: '📬', color: '#004B87',
    description: 'USPS (United States Postal Service) delivers over 130 billion pieces of mail annually. Track your USPS package, Priority Mail, or international shipment on Trackora.',
    trackingFormat: '20-22 digit number',
    formatExample: '94001234567890123456',
    guide: [
      'Find your USPS tracking number on your shipping label, receipt, or confirmation email.',
      'Enter the 20-22 digit number in the Trackora search box.',
      'Trackora auto-detects USPS and shows your full delivery timeline.',
    ],
    faqs: [
      { q: 'What does a USPS tracking number look like?', a: 'USPS tracking numbers are 20-22 digits long, often starting with 94 (Priority Mail), 92 (Certified Mail), or 82 (First Class). International USPS tracking numbers have a letter-prefix format like LZ123456789US.' },
      { q: 'Can I track USPS international packages on Trackora?', a: 'Yes. Trackora supports USPS international packages including First Class Mail International, Priority Mail International, and Priority Mail Express International.' },
    ],
  },
  'amazon': {
    name: 'Amazon', type: 'express', emoji: '📦', color: '#FF9900',
    description: 'Track your Amazon package or Amazon Logistics (AMZL) shipment in real time. See current delivery location, driver details, and estimated arrival window.',
    trackingFormat: 'TBA + 12 digits',
    formatExample: 'TBA123456789000',
    guide: [
      'Find your Amazon tracking number in your order confirmation email or the Amazon app (Your Orders → Track Package).',
      'AMZL tracking numbers start with "TBA" followed by 12 digits.',
      'Enter the number in Trackora to see real-time delivery status.',
    ],
    faqs: [
      { q: 'What is an Amazon TBA tracking number?', a: 'TBA tracking numbers (e.g. TBA123456789000) are used by Amazon Logistics (AMZL), Amazon\'s own delivery service. They indicate the package is being delivered by Amazon\'s in-house drivers.' },
      { q: 'Why is my Amazon package showing "out for delivery" for hours?', a: 'AMZL drivers typically have 100-200 stops per route. Once "out for delivery" is shown, delivery is usually within the same day. The 4-hour delivery window in the Amazon app is based on the driver\'s current position.' },
    ],
  },
  'shopify': {
    name: 'Shopify', type: 'express', emoji: '🛍️', color: '#96BF48',
    isMarketplace: true,
    marketplaceNote: 'Shopify is an e-commerce platform, not a shipping carrier. Orders placed on Shopify stores are shipped by standard carriers like USPS, FedEx, DHL, or UPS. To track your order, find the carrier tracking number in your shipping confirmation email — then enter it below.',
    description: 'Ordered from a Shopify store and want to track your package? Shopify uses standard shipping carriers (USPS, FedEx, DHL, UPS, and others) to deliver orders. Find the carrier tracking number in your confirmation email and track it instantly on Trackora.',
    trackingFormat: 'Carrier tracking number (from your shipping confirmation email)',
    formatExample: '9400100000000000000000',
    guide: [
      'Open the shipping confirmation email from the Shopify store.',
      'Look for a "Track your shipment" button or a tracking number — it\'s usually from USPS, FedEx, DHL, or UPS.',
      'Copy that tracking number (not the Shopify order number like #1234).',
      'Paste it into the Trackora search box above — the carrier is detected automatically.',
      'Can\'t find the email? Log in to the store\'s website and check "My Orders" → your order → "Track Shipment".',
    ],
    faqs: [
      {
        q: 'Why can\'t I track a Shopify order number directly?',
        a: 'Shopify order numbers (like #1001) are internal references for the store — they\'re not shipping tracking numbers. The actual shipment is handled by a carrier like USPS, FedEx, or DHL, and each carrier assigns their own tracking number. That carrier tracking number is what you need to track the package\'s physical location.',
      },
      {
        q: 'Where do I find my Shopify carrier tracking number?',
        a: 'Check your shipping confirmation email — it usually has a "Track your shipment" button that links to the carrier\'s website, or shows the tracking number directly. You can also log into your account on the store\'s website, go to My Orders, and click on your order to see the shipment details.',
      },
      {
        q: 'Which carriers do Shopify stores use?',
        a: 'Most Shopify stores in the US use USPS, FedEx, or UPS. Stores in the UK often use Royal Mail or DPD. International stores may use DHL Express. All of these are fully supported on Trackora — just paste the tracking number and we auto-detect the carrier.',
      },
      {
        q: 'My Shopify tracking number starts with 1Z — what carrier is it?',
        a: 'A tracking number starting with "1Z" is a UPS tracking number. Enter it in Trackora and it will be detected as UPS automatically.',
      },
      {
        q: 'What if my Shopify order shows "Fulfilled" but I have no tracking number?',
        a: '"Fulfilled" means the store has processed and shipped your order. If no tracking number appears, the store may have shipped without a tracked service, or may not have added the tracking number yet. Contact the store directly if no tracking number appears within 24 hours of the fulfilled status.',
      },
      {
        q: 'Can I track a Shopify order using the Shop app?',
        a: 'Yes. Shopify\'s own Shop app (shop.app) can track orders from Shopify stores using your email address and order number. However, for real-time carrier tracking with timeline and map, Trackora uses the carrier tracking number directly for the most accurate results.',
      },
    ],
  },
  'aramex': {
    name: 'Aramex', type: 'express', emoji: '📦', color: '#E31E24',
    description: 'Aramex is the leading logistics and transportation company in the Middle East and Africa, delivering to 220+ countries. Track your Aramex shipment in real time on Trackora.',
    trackingFormat: '11-digit number',
    formatExample: '12345678901',
    guide: [
      'Find your Aramex tracking number on your shipping confirmation email or receipt.',
      'Enter the 11-digit number in the Trackora search box.',
      'Trackora auto-detects Aramex and retrieves your full delivery timeline.',
      'Enable notifications to be alerted on every status change.',
    ],
    faqs: [
      { q: 'Where do I find my Aramex tracking number?', a: 'Your Aramex tracking number appears on your shipping label, confirmation email, or in your Aramex account under shipment history.' },
      { q: 'Does Aramex deliver on weekends in the Middle East?', a: 'Aramex delivers on Saturdays in most Middle Eastern countries. Friday is the typical day off in the region, so deliveries resume on Saturday.' },
      { q: 'Can I track Aramex Shop & Ship on Trackora?', a: 'Yes. Trackora supports Aramex Express and Aramex Shop & Ship tracking numbers.' },
    ],
  },
  'tnt': {
    name: 'TNT Express', type: 'express', emoji: '📦', color: '#FF6600',
    description: 'TNT Express (now part of FedEx) is a global courier service delivering to 200+ countries. Track your TNT shipment with your 9 or 15-digit consignment number.',
    trackingFormat: '9 or 15-digit consignment number',
    formatExample: '123456789',
    guide: [
      'Find your TNT consignment number on your shipping label or confirmation email.',
      'Enter the number in the Trackora search box.',
      'Trackora retrieves your TNT shipment status and delivery timeline.',
    ],
    faqs: [
      { q: 'Is TNT the same as FedEx?', a: 'TNT was acquired by FedEx in 2016. TNT-branded services continue to operate in Europe and other regions, while gradually being integrated into the FedEx network.' },
      { q: 'What does a TNT consignment number look like?', a: 'TNT consignment numbers are 9 or 15 digits long. They appear on the TNT shipping label and in your booking confirmation email.' },
    ],
  },
  'dpd': {
    name: 'DPD', type: 'express', emoji: '📦', color: '#DC0032',
    description: 'DPD Group is one of Europe\'s leading parcel delivery networks, delivering 8.4 million parcels daily across 50+ countries. Track your DPD parcel in real time.',
    trackingFormat: '14-digit or JD-prefix number',
    formatExample: '05392579824716',
    guide: [
      'Find your DPD tracking number on your shipping confirmation email or the parcel label.',
      'Enter the 14-digit number (or JD-prefix number) in the Trackora search box.',
      'View real-time location, delivery attempts, and estimated delivery window.',
    ],
    faqs: [
      { q: 'What does a DPD tracking number look like?', a: 'DPD tracking numbers are typically 14 digits long or start with "JD" followed by digits. They appear on your parcel label and in your delivery notification email.' },
      { q: 'What is DPD Predict?', a: 'DPD Predict gives you a precise 1-hour delivery window on the day of delivery. You\'ll receive an SMS or email with your slot so you know exactly when to expect your parcel.' },
    ],
  },
  'gls': {
    name: 'GLS', type: 'express', emoji: '📦', color: '#009A44',
    description: 'GLS (General Logistics Systems) is one of the largest parcel services in Europe with a network of 1,400+ depots. Track your GLS parcel live on Trackora.',
    trackingFormat: '11-digit GLS tracking ID',
    formatExample: '12345678901',
    guide: [
      'Find your GLS tracking ID on your shipping confirmation or the GLS label.',
      'Enter the 11-digit number in the Trackora search box.',
      'See your parcel\'s current location, depot history, and estimated delivery.',
    ],
    faqs: [
      { q: 'How do I find my GLS tracking number?', a: 'Your GLS tracking number is on the parcel label (as a barcode) and in the shipping confirmation email from the sender.' },
      { q: 'Does GLS deliver to all EU countries?', a: 'GLS delivers to all EU member states plus Switzerland, Norway, and several Balkan countries. For countries outside Europe, GLS works with partner networks.' },
    ],
  },
  'hermes': {
    name: 'Evri (Hermes)', type: 'express', emoji: '📦', color: '#7D2E8B',
    description: 'Evri (formerly Hermes) is the UK\'s largest dedicated parcel carrier for e-commerce, delivering over 730 million parcels per year. Track your Evri parcel in real time.',
    trackingFormat: '16-character alphanumeric',
    formatExample: 'H1234567890123456',
    guide: [
      'Find your Evri tracking number in your shipping confirmation email.',
      'Enter the 16-character reference in the Trackora search box.',
      'View your parcel\'s full delivery journey, including courier updates.',
    ],
    faqs: [
      { q: 'What happened to Hermes UK?', a: 'Hermes UK rebranded to Evri in February 2022. The service and tracking systems are the same — only the brand name changed.' },
      { q: 'How long does Evri delivery take?', a: 'Standard Evri delivery takes 3-5 business days. Next-day and 2-day options are available when selected by the sender.' },
    ],
  },
  'postnl': {
    name: 'PostNL', type: 'express', emoji: '📮', color: '#FF6200',
    description: 'PostNL is the national postal service of the Netherlands and a major European e-commerce logistics provider. Track your PostNL parcel in real time.',
    trackingFormat: '3S + barcode or 13-character reference',
    formatExample: '3STLNL123456789',
    guide: [
      'Find your PostNL tracking code on your shipping confirmation email.',
      'Enter the code (often starts with "3S") in the Trackora search box.',
      'View real-time parcel status, depot scans, and estimated delivery.',
    ],
    faqs: [
      { q: 'What does a PostNL tracking code look like?', a: 'PostNL tracking codes start with "3S" followed by alphanumeric characters (e.g. 3STLNL123456789). International parcels may use a format like RR123456789NL.' },
      { q: 'Can I track PostNL international shipments?', a: 'Yes. PostNL delivers internationally through its global network and partner carriers. Trackora supports both domestic and international PostNL tracking.' },
    ],
  },
  'royal-mail': {
    name: 'Royal Mail', type: 'express', emoji: '📮', color: '#E4003B',
    description: 'Royal Mail is the UK\'s designated universal postal service, delivering to 30 million addresses six days a week. Track your Royal Mail parcel or letter in real time.',
    trackingFormat: '2 letters + 8 digits + 2 letters (e.g. AB123456789GB)',
    formatExample: 'AB123456789GB',
    guide: [
      'Find your Royal Mail tracking number on your shipping label or in your order confirmation.',
      'Enter the 13-character reference (format: 2 letters, 8 digits, 2 letters) in Trackora.',
      'View your item\'s delivery status and any attempted delivery information.',
    ],
    faqs: [
      { q: 'What format is a Royal Mail tracking number?', a: 'Royal Mail tracking numbers are 13 characters: 2 letters, 8 digits, then "GB" at the end (e.g. AB123456789GB). Not all Royal Mail services include tracking — 1st Class and 2nd Class letters are not tracked.' },
      { q: 'What is Royal Mail Tracked 24 vs Tracked 48?', a: 'Tracked 24 aims for next-day delivery; Tracked 48 aims for delivery within 2-3 days. Both include full parcel tracking from collection to delivery.' },
    ],
  },
  'australia-post': {
    name: 'Australia Post', type: 'express', emoji: '📮', color: '#F4B21B',
    description: 'Australia Post is Australia\'s national postal service and the country\'s largest retail network. Track your Australia Post parcel in real time on Trackora.',
    trackingFormat: 'EX/LZ prefix + 9 digits + AU, or 12-digit domestic',
    formatExample: 'EX123456789AU',
    guide: [
      'Find your Australia Post tracking number in your order confirmation or on the parcel label.',
      'Enter the reference in the Trackora search box.',
      'View full event history from lodgement to delivery.',
    ],
    faqs: [
      { q: 'What does an Australia Post tracking number look like?', a: 'Australia Post tracking numbers for international parcels start with 2 letters (e.g. EX or LZ) followed by 9 digits and end in "AU". Domestic numbers are 12-digit numeric strings.' },
      { q: 'Does Trackora support Australia Post Express Post?', a: 'Yes. Trackora supports Australia Post standard parcel tracking, Express Post, and international registered mail.' },
    ],
  },
  'canada-post': {
    name: 'Canada Post', type: 'express', emoji: '📮', color: '#CC0000',
    description: 'Canada Post is Canada\'s primary postal operator, handling 8.4 billion pieces of mail annually. Track your Canada Post parcel, Xpresspost, or Priority shipment.',
    trackingFormat: '16-digit or 13-character (letters + digits)',
    formatExample: '1234567890123456',
    guide: [
      'Find your Canada Post tracking number on your shipping label or in your confirmation email.',
      'Enter the 16-digit or 13-character reference in Trackora.',
      'View parcel status, facility scans, and estimated delivery date.',
    ],
    faqs: [
      { q: 'What tracking services does Canada Post offer?', a: 'Canada Post offers Tracked Packet, Xpresspost, Priority, and Expedited Parcel — all with full online tracking. Regular Letter Mail is not tracked.' },
      { q: 'Can I track a Canada Post parcel arriving from abroad?', a: 'Yes. International parcels sent to Canada via partner postal services are trackable on Trackora using the sender\'s tracking reference.' },
    ],
  },
  'japan-post': {
    name: 'Japan Post', type: 'express', emoji: '📮', color: '#CC0000',
    description: 'Japan Post delivers 18 billion pieces of mail annually and is one of the world\'s most reliable postal services. Track your Japan Post EMS, SAL, or international parcel.',
    trackingFormat: '2 letters + 8 digits + JP (e.g. EA123456789JP)',
    formatExample: 'EA123456789JP',
    guide: [
      'Find your Japan Post tracking number on your shipping receipt.',
      'Enter the 13-character code (format: 2 letters, 8 digits, JP) in Trackora.',
      'Track your EMS, registered, or SAL shipment from Japan to its destination.',
    ],
    faqs: [
      { q: 'What is Japan Post EMS?', a: 'EMS (Express Mail Service) is the fastest Japan Post international service, delivering to 120+ countries. EMS tracking numbers start with "E" and end in "JP".' },
      { q: 'Why is my Japan Post SAL parcel delayed?', a: 'SAL (Surface Airlifted) is a cost-effective but slower service — typically 2-4 weeks for delivery. SAL may be suspended for certain countries; EMS or Airmail is faster.' },
    ],
  },
  'lufthansa-cargo': {
    name: 'Lufthansa Cargo', type: 'air', emoji: '✈️', color: '#05164D',
    description: 'Lufthansa Cargo is one of the world\'s largest air freight carriers, operating freighters and belly capacity on 300+ destinations. Track your Lufthansa Cargo MAWB in real time.',
    trackingFormat: '020-XXXXXXXX (3-digit prefix + 8 digits)',
    formatExample: '020-12345678',
    guide: [
      'Find your MAWB (Master Air Waybill) number on your cargo documentation.',
      'Lufthansa Cargo\'s airline prefix is 020.',
      'Enter the number in format 020-XXXXXXXX in the Trackora air freight tracker.',
      'View flight status, customs events, and delivery milestones.',
    ],
    faqs: [
      { q: 'What is Lufthansa Cargo\'s airline prefix?', a: 'Lufthansa Cargo\'s IATA prefix is 020. All Lufthansa Cargo air waybills start with 020 followed by 8 digits (e.g. 020-12345678).' },
      { q: 'How do I track a Lufthansa Cargo shipment?', a: 'Enter your MAWB in the format 020-XXXXXXXX in the Trackora air freight tracker. You\'ll see the full event history from acceptance to delivery.' },
    ],
  },
  'qatar-cargo': {
    name: 'Qatar Airways Cargo', type: 'air', emoji: '✈️', color: '#5C0632',
    description: 'Qatar Airways Cargo is one of the fastest-growing air cargo carriers, operating to 60+ freighter destinations. Track your Qatar Airways Cargo MAWB on Trackora.',
    trackingFormat: '157-XXXXXXXX (3-digit prefix + 8 digits)',
    formatExample: '157-12345678',
    guide: [
      'Locate your MAWB number on your cargo booking confirmation.',
      'Qatar Airways Cargo\'s IATA prefix is 157.',
      'Enter the number in format 157-XXXXXXXX in Trackora\'s air freight tracker.',
      'View real-time shipment events including flight routing and customs clearance.',
    ],
    faqs: [
      { q: 'What is Qatar Airways Cargo\'s airline prefix?', a: 'Qatar Airways Cargo\'s IATA prefix is 157. Air waybills follow the format 157-XXXXXXXX.' },
      { q: 'Does Qatar Airways Cargo fly to all continents?', a: 'Yes. Qatar Airways Cargo serves destinations across Asia, Europe, Africa, the Americas, and Oceania, with Doha (DOH) as the hub.' },
    ],
  },
  'cargolux': {
    name: 'Cargolux', type: 'air', emoji: '✈️', color: '#003087',
    description: 'Cargolux is Europe\'s largest all-cargo airline, operating a fleet of Boeing 747 freighters to 90+ destinations worldwide. Track your Cargolux MAWB on Trackora.',
    trackingFormat: '172-XXXXXXXX (3-digit prefix + 8 digits)',
    formatExample: '172-12345678',
    guide: [
      'Find your Cargolux MAWB on your shipping documents.',
      'Cargolux\'s IATA prefix is 172.',
      'Enter the AWB in format 172-XXXXXXXX in the Trackora air freight tracker.',
      'Track your freight from origin to destination with full event visibility.',
    ],
    faqs: [
      { q: 'What is Cargolux\'s airline prefix?', a: 'Cargolux\'s IATA prefix is 172. All Cargolux air waybills begin with 172 followed by 8 digits.' },
      { q: 'Where does Cargolux fly from?', a: 'Cargolux\'s main hub is Luxembourg (LUX). It operates direct freighter routes to over 90 destinations in Asia, the Americas, Africa, and the Middle East.' },
    ],
  },
  'air-france-cargo': {
    name: 'Air France Cargo', type: 'air', emoji: '✈️', color: '#002157',
    description: 'Air France Cargo operates in partnership with KLM Cargo as Air France-KLM Cargo, one of the world\'s largest air freight groups. Track your Air France Cargo MAWB.',
    trackingFormat: '057-XXXXXXXX (3-digit prefix + 8 digits)',
    formatExample: '057-12345678',
    guide: [
      'Find your MAWB on your Air France Cargo booking confirmation.',
      'Air France Cargo\'s IATA prefix is 057.',
      'Enter the number in format 057-XXXXXXXX in Trackora\'s air freight tracker.',
      'Monitor each milestone from departure to delivery.',
    ],
    faqs: [
      { q: 'What is Air France Cargo\'s airline prefix?', a: 'Air France Cargo\'s IATA prefix is 057. KLM Cargo\'s prefix is 074 — both are tracked on Trackora.' },
      { q: 'What is Air France-KLM Cargo?', a: 'Air France and KLM jointly operate their cargo business under the Air France-KLM Cargo brand, one of the world\'s top 5 air freight carriers by capacity.' },
    ],
  },
  'turkish-cargo': {
    name: 'Turkish Cargo', type: 'air', emoji: '✈️', color: '#C8102E',
    description: 'Turkish Cargo is one of the fastest-growing air cargo carriers, flying to 340+ destinations across 127 countries. Track your Turkish Cargo MAWB on Trackora.',
    trackingFormat: '235-XXXXXXXX (3-digit prefix + 8 digits)',
    formatExample: '235-12345678',
    guide: [
      'Find your Turkish Cargo MAWB on your shipping documents.',
      'Turkish Cargo\'s IATA prefix is 235.',
      'Enter the number in format 235-XXXXXXXX in Trackora\'s air freight tracker.',
      'View routing, flight milestones, and customs events.',
    ],
    faqs: [
      { q: 'What is Turkish Cargo\'s airline prefix?', a: 'Turkish Cargo\'s IATA prefix is 235. Air waybills follow the format 235-XXXXXXXX.' },
      { q: 'Why is Turkish Cargo popular for connecting East and West?', a: 'Istanbul Airport (IST) sits at the crossroads of Europe, Asia, and Africa, making Turkish Cargo one of the best-connected cargo hubs in the world with short transit times between continents.' },
    ],
  },
  'evergreen': {
    name: 'Evergreen Line', type: 'sea', emoji: '🚢', color: '#007A3D',
    description: 'Evergreen Line is one of the world\'s top 5 container shipping companies, operating 200+ vessels. Track your Evergreen container, B/L, or booking reference on Trackora.',
    trackingFormat: 'Container: EISU/EMCU + 7 digits | B/L: numeric',
    formatExample: 'EISU1234567',
    guide: [
      'Find your Evergreen container number (EISU or EMCU prefix) or B/L on your shipping documents.',
      'Select Sea Freight mode on Trackora and choose Evergreen.',
      'Your number is pre-filled in the link to Evergreen\'s official tracking portal.',
    ],
    faqs: [
      { q: 'What is an Evergreen container number?', a: 'Evergreen containers use the owner codes EISU or EMCU followed by 7 digits (e.g. EISU1234567). You can also track using your B/L or booking reference.' },
      { q: 'How do I track the Evergreen Ever Given?', a: 'All Evergreen vessels, including the Ever Given, are trackable by container number or B/L via Trackora\'s sea freight mode, which redirects to Evergreen\'s official tracking portal.' },
    ],
  },
  'cosco': {
    name: 'COSCO Shipping', type: 'sea', emoji: '🚢', color: '#C8102E',
    description: 'COSCO Shipping Lines is China\'s largest and the world\'s fourth-largest container shipping company, operating 400+ vessels. Track your COSCO container on Trackora.',
    trackingFormat: 'Container: CSNU/COSU + 7 digits | B/L: numeric',
    formatExample: 'CSNU1234567',
    guide: [
      'Locate your COSCO container number (CSNU or COSU prefix) or B/L on your cargo documents.',
      'Select Sea Freight mode on Trackora and choose COSCO.',
      'You will be redirected to COSCO\'s official portal with your number pre-filled.',
    ],
    faqs: [
      { q: 'What is a COSCO container number format?', a: 'COSCO containers use owner codes CSNU or COSU followed by 7 digits. Example: CSNU1234567.' },
      { q: 'Does COSCO operate on all major trade lanes?', a: 'Yes. COSCO Shipping serves all major global trade lanes including Asia-Europe, Transpacific, Asia-Middle East, and intra-Asia routes.' },
    ],
  },
  'one': {
    name: 'Ocean Network Express (ONE)', type: 'sea', emoji: '🚢', color: '#FF69B4',
    description: 'ONE (Ocean Network Express) was formed by the merger of NYK, MOL, and K Line container operations. Track your ONE container or B/L in real time on Trackora.',
    trackingFormat: 'Container: ONEY + 7 digits | B/L: numeric',
    formatExample: 'ONEY1234567',
    guide: [
      'Find your ONE container number (ONEY prefix) or B/L on your shipping documents.',
      'Select Sea Freight mode on Trackora and choose ONE.',
      'Your reference is pre-filled in the link to ONE\'s official tracking portal.',
    ],
    faqs: [
      { q: 'What is ONE (Ocean Network Express)?', a: 'ONE is a Japanese container shipping company formed in 2018 from the merger of NYK Line, MOL, and K Line\'s container divisions. It is now one of the world\'s top 6 carriers.' },
      { q: 'What is a ONE container number?', a: 'ONE containers use the prefix ONEY followed by 7 digits (e.g. ONEY1234567).' },
    ],
  },
  'yang-ming': {
    name: 'Yang Ming Marine', type: 'sea', emoji: '🚢', color: '#003087',
    description: 'Yang Ming Marine Transport is one of Asia\'s leading container shipping companies, operating 100+ vessels on global trade lanes. Track your Yang Ming container on Trackora.',
    trackingFormat: 'Container: YMLU/YMJA + 7 digits | B/L: numeric',
    formatExample: 'YMLU1234567',
    guide: [
      'Locate your Yang Ming container number (YMLU or YMJA prefix) or B/L on your documents.',
      'Select Sea Freight mode on Trackora and choose Yang Ming.',
      'You will be redirected to Yang Ming\'s official tracking portal with your number pre-filled.',
    ],
    faqs: [
      { q: 'What is a Yang Ming container number?', a: 'Yang Ming containers use the owner codes YMLU or YMJA followed by 7 digits (e.g. YMLU1234567).' },
      { q: 'Which trade lanes does Yang Ming serve?', a: 'Yang Ming serves Asia-Europe, Transpacific (Asia-North America), intra-Asia, and Asia-Middle East trade lanes.' },
    ],
  },
  'zim': {
    name: 'ZIM Integrated Shipping', type: 'sea', emoji: '🚢', color: '#003087',
    description: 'ZIM is a global container shipping line operating in 90+ countries with a fleet of 150+ vessels. Track your ZIM container or bill of lading on Trackora.',
    trackingFormat: 'Container: ZIMU + 7 digits | B/L: numeric',
    formatExample: 'ZIMU1234567',
    guide: [
      'Find your ZIM container number (ZIMU prefix) or B/L on your cargo documents.',
      'Select Sea Freight mode on Trackora and choose ZIM.',
      'Your reference is pre-filled in the direct link to ZIM\'s tracking portal.',
    ],
    faqs: [
      { q: 'What is a ZIM container number?', a: 'ZIM containers use the prefix ZIMU followed by 7 digits (e.g. ZIMU1234567). You can also track using your B/L or booking reference.' },
      { q: 'Is ZIM a reliable shipping line?', a: 'Yes. ZIM is one of the world\'s top 10 container lines, publicly traded on the NYSE, and known for its niche and express service offerings on key trade lanes.' },
    ],
  },
  'db-schenker': {
    name: 'DB Schenker', type: 'land', emoji: '🚚', color: '#C8102E',
    description: 'DB Schenker is one of the world\'s leading logistics providers, offering land freight, air freight, ocean freight, and contract logistics. Track your DB Schenker shipment.',
    trackingFormat: 'Shipment reference or tracking number (8-20 chars)',
    formatExample: '1234567890',
    guide: [
      'Find your DB Schenker shipment reference or tracking number on your booking confirmation.',
      'Enter the reference in the Trackora search box.',
      'View real-time status, transit milestones, and estimated delivery.',
    ],
    faqs: [
      { q: 'What types of freight does DB Schenker handle?', a: 'DB Schenker handles full truckload (FTL), less-than-truckload (LTL), air freight, ocean freight, rail, and warehousing/contract logistics.' },
      { q: 'Does DB Schenker operate globally?', a: 'Yes. DB Schenker has 2,100+ offices in 130+ countries, making it one of the most geographically extensive logistics providers in the world.' },
    ],
  },
}

export default function CarrierPage() {
  const { slug } = useParams<{ slug: string }>()
  const isMobile = useIsMobile()

  const carrier = slug ? CARRIERS[slug] : null
  if (!carrier) return <Navigate to="/track" replace />

  useSEO({
    title: `${carrier.name} Tracking | Track ${carrier.name} Shipments in Real Time — Trackora`,
    description: `Track any ${carrier.name} ${carrier.type === 'sea' ? 'container, bill of lading, or booking reference' : 'tracking number'} in real time. Free, instant results — no sign-up required.`,
    canonical: `https://www.track-ora.com/carriers/${slug}`,
  })

  const typeLabel = carrier.type === 'sea' ? 'Sea Freight' : carrier.type === 'air' ? 'Air Freight' : carrier.type === 'land' ? 'Land Freight' : 'Express Courier'
  const typeColor = carrier.type === 'sea' ? '#10b981' : carrier.type === 'air' ? '#6366f1' : carrier.type === 'land' ? '#f59e0b' : '#06b6d4'

  return (
    <div style={{ minHeight: '100vh', paddingTop: '72px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: isMobile ? '40px 20px' : '60px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '4px 12px', borderRadius: '100px', marginBottom: '16px',
            background: `${typeColor}18`, border: `1px solid ${typeColor}30`,
            fontSize: '11px', color: typeColor, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
          }}>
            {typeLabel}
          </div>
          <h1 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-1.5px', marginBottom: '16px', lineHeight: 1.1 }}>
            {carrier.emoji} {carrier.name} Shipment Tracking
          </h1>
          <p style={{ fontSize: isMobile ? '15px' : '17px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.7, maxWidth: '640px' }}>
            {carrier.description}
          </p>
        </div>

        {/* Marketplace notice (Shopify etc.) */}
        {carrier.isMarketplace && (
          <div style={{
            padding: isMobile ? '16px' : '20px 24px',
            borderRadius: '14px',
            background: `${typeColor}10`,
            border: `1px solid ${typeColor}30`,
            marginBottom: '32px',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>💡</span>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(248,250,252,0.65)', lineHeight: 1.7 }}>
              {carrier.marketplaceNote}
            </p>
          </div>
        )}

        {/* CTA box */}
        <div style={{
          padding: isMobile ? '20px' : '28px',
          borderRadius: '18px',
          background: 'rgba(99,102,241,0.07)',
          border: '1px solid rgba(99,102,241,0.25)',
          marginBottom: '56px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '6px' }}>
            {carrier.isMarketplace ? 'Paste your carrier tracking number here' : `Track a ${carrier.name} shipment now`}
          </h2>
          <p style={{ fontSize: '13px', color: 'rgba(248,250,252,0.5)', marginBottom: '16px' }}>
            {carrier.isMarketplace
              ? <>From your shipping confirmation email · e.g. <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>{carrier.formatExample}</span></>
              : <>Format: <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>{carrier.trackingFormat}</span>{' · '}Example: <span style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>{carrier.formatExample}</span></>
            }
          </p>
          <Link
            to={carrier.isMarketplace ? '/track' : `/track/${encodeURIComponent(carrier.formatExample)}`}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '11px 22px', borderRadius: '12px', textDecoration: 'none',
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white', fontSize: '14px', fontWeight: 700,
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}
          >
            {carrier.isMarketplace ? 'Track your shipment →' : 'Track on Trackora →'}
          </Link>
        </div>

        {/* How-to guide */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            How to track a {carrier.name} shipment
          </h2>
          <ol style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {carrier.guide.map((step, i) => (
              <li key={i} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                padding: '18px 20px',
                borderRadius: '14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <span style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: `${typeColor}18`, border: `1px solid ${typeColor}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', fontWeight: 800, color: typeColor,
                }}>
                  {i + 1}
                </span>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.7)', lineHeight: 1.7, margin: 0 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQs */}
        <div style={{ marginBottom: '56px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', marginBottom: '24px', letterSpacing: '-0.5px' }}>
            Frequently asked questions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {carrier.faqs.map((faq, i) => (
              <div key={i} style={{
                padding: '20px 0',
                borderBottom: i < carrier.faqs.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>{faq.q}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(248,250,252,0.6)', lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other carriers */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>Track other carriers</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(CARRIERS).filter(([k]) => k !== slug).map(([k, c]) => (
              <Link
                key={k}
                to={`/carriers/${k}`}
                style={{
                  padding: '7px 14px', borderRadius: '100px', textDecoration: 'none',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '13px', color: 'rgba(248,250,252,0.6)', fontWeight: 600,
                }}
              >
                {c.emoji} {c.name}
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* JSON-LD FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: carrier.faqs.map(faq => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
          })),
        }) }}
      />
    </div>
  )
}
