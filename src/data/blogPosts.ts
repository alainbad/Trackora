export interface BlogPost {
  slug: string
  title: string
  date: string
  readTime: string
  excerpt: string
  seo: { title: string; description: string }
  sections: { heading?: string; body: string }[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'what-is-a-container-number',
    title: 'What Is an ISO 6346 Container Number? (Complete Guide)',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Every shipping container in the world has a unique ISO 6346 identifier. Learn how to read it, what each part means, and how to use it to track your cargo.',
    seo: {
      title: 'What Is a Container Number? ISO 6346 Guide — Trackora',
      description: 'Learn what an ISO 6346 container number is, how to read the owner code, equipment category, serial number, and check digit — and how to track your container.',
    },
    sections: [
      {
        body: 'If you have ever received a bill of lading or a shipping confirmation for sea freight, you have seen a sequence like MSKU1234567 or TCKU8872341. This is your container number — a unique identifier stamped on every shipping container in the world, governed by the ISO 6346 standard.',
      },
      {
        heading: 'What Does a Container Number Look Like?',
        body: 'An ISO 6346 container number has exactly 11 characters: 4 letters followed by 7 digits. For example: MSKU 123456 7. Breaking it down — the first 3 letters are the owner code, the 4th letter is the equipment category identifier (almost always "U" for freight containers), the next 6 digits are the serial number, and the final digit is the check digit.',
      },
      {
        heading: 'The Owner Code (First 3 Letters)',
        body: 'The owner code identifies the company that owns or leases the container. These codes are registered with the Bureau International des Containers (BIC). Common owner codes include MSKU (Maersk), TCKU (Triton), CSNU (COSCO), HLCU (Hapag-Lloyd), and MSCU (MSC). The code tells you which shipping line or leasing company is responsible for the container.',
      },
      {
        heading: 'The Equipment Category (4th Letter)',
        body: '"U" stands for freight container — the standard intermodal box used for cargo. You may also see "J" for detachable freight container-related equipment, or "Z" for trailers and chassis. In practice, nearly all containers you will track as an importer or exporter use "U".',
      },
      {
        heading: 'The Serial Number and Check Digit',
        body: 'The 6-digit serial number uniquely identifies the container within the owner\'s fleet. The final check digit is calculated from the preceding 10 characters using an algorithm — it lets computer systems verify the number was entered correctly and catch typos before they cause costly misrouting.',
      },
      {
        heading: 'Container Number vs Bill of Lading vs Booking Reference',
        body: 'These three references are often confused. A container number identifies the physical steel box. A bill of lading (B/L) is a legal document number issued by the carrier for a specific shipment — one B/L can cover multiple containers. A booking reference is a reservation number issued before the cargo is loaded. You can track your shipment using any of these on Trackora.',
      },
      {
        heading: 'How to Track Your Container on Trackora',
        body: 'Paste your ISO 6346 container number directly into the Trackora search box. Trackora auto-detects the carrier from the owner code (e.g. MSKU → Maersk) and either retrieves the full event timeline via API or generates a pre-filled direct link to the carrier\'s official tracking portal — whichever gives the most accurate data.',
      },
    ],
  },
  {
    slug: 'mawb-vs-hawb',
    title: 'MAWB vs HAWB: What\'s the Difference and How to Track Both',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Confused about MAWB and HAWB numbers? This guide explains the difference between a Master Air Waybill and a House Air Waybill — and how to track both.',
    seo: {
      title: 'MAWB vs HAWB: Difference Explained — Trackora',
      description: 'What is the difference between a MAWB (Master Air Waybill) and a HAWB (House Air Waybill)? Learn which number to use for tracking air freight shipments.',
    },
    sections: [
      {
        body: 'When you ship cargo by air, you will encounter two types of tracking numbers: the MAWB (Master Air Waybill) and the HAWB (House Air Waybill). Understanding the difference is essential for tracking your shipment accurately — and knowing which number to hand to customs or your destination agent.',
      },
      {
        heading: 'What Is a MAWB (Master Air Waybill)?',
        body: 'A Master Air Waybill is issued by the airline itself — or by a ground handling agent on behalf of the airline — to the freight forwarder. It represents the contract of carriage between the airline and the freight forwarder. The MAWB format is standardised: a 3-digit airline prefix, a hyphen, and 8 digits (e.g. 176-12345678, where 176 is the Emirates SkyCargo prefix). The MAWB is the number you use to track cargo through the airline\'s official system.',
      },
      {
        heading: 'What Is a HAWB (House Air Waybill)?',
        body: 'A House Air Waybill is issued by the freight forwarder to the actual shipper (you or your supplier). It represents the contract between the forwarder and the shipper. HAWBs are used when a forwarder consolidates multiple smaller shipments into one MAWB — each individual shipment gets its own HAWB under the single MAWB. HAWB formats vary by forwarder: they may be numeric, alphanumeric, or follow the forwarder\'s own reference system.',
      },
      {
        heading: 'Key Differences at a Glance',
        body: 'The MAWB is issued by the airline; the HAWB is issued by the freight forwarder. A single MAWB can cover many HAWBs (a consolidated shipment). The MAWB is the legal document for the airline; the HAWB is the legal document between forwarder and shipper. For customs purposes, you typically need to provide the MAWB. For tracking with the airline, use the MAWB. For tracking with your forwarder, use the HAWB.',
      },
      {
        heading: 'Which Number Should You Use to Track?',
        body: 'If you want to see flight-level events (departed, arrived, customs cleared), use the MAWB. Airlines and airline tracking portals only recognise the MAWB. If you want forwarder-level updates (picked up from shipper, consolidated, delivered to consignee), use the HAWB with your freight forwarder\'s tracking portal.',
      },
      {
        heading: 'How to Track a MAWB on Trackora',
        body: 'Enter your MAWB number in the standard format NNN-NNNNNNNN (3-digit prefix, hyphen, 8 digits) in the Trackora search box. Trackora identifies the airline from the prefix and retrieves the full event timeline. For example: 176 = Emirates SkyCargo, 020 = Lufthansa Cargo, 157 = Qatar Airways Cargo, 235 = Turkish Cargo.',
      },
    ],
  },
  {
    slug: 'how-to-track-dhl-shipment',
    title: 'How to Track a DHL Shipment: Complete Guide (2026)',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Everything you need to know about DHL tracking numbers — DHL Express, DHL Parcel, and DHL eCommerce. Find your waybill number and get live status in seconds.',
    seo: {
      title: 'How to Track a DHL Shipment — DHL Tracking Guide 2026 | Trackora',
      description: 'Step-by-step guide to tracking DHL Express, DHL Parcel, and DHL eCommerce shipments. Find your DHL waybill number and check live delivery status on Trackora.',
    },
    sections: [
      {
        body: 'DHL is the world\'s most international courier company, delivering to 220+ countries and territories. Whether you shipped with DHL Express, DHL Parcel, or DHL eCommerce, tracking your shipment is straightforward once you know where to find your tracking number and what format to expect.',
      },
      {
        heading: 'DHL Express vs DHL Parcel vs DHL eCommerce — What\'s the Difference?',
        body: 'DHL operates several distinct services that each have their own tracking systems. DHL Express is the premium international and domestic express courier — fast, fully tracked, and used by businesses. DHL Parcel is the domestic parcel service in Germany and several European countries. DHL eCommerce (formerly DHL Packet) is a lower-cost international service used by online retailers shipping from Asia and Europe. Each uses different tracking number formats.',
      },
      {
        heading: 'DHL Express Tracking Number Format',
        body: 'DHL Express tracking numbers are 10 digits long (e.g. 1234567890). Some DHL Express shipments use a JD-prefix format (JD014600012345678900) — these are 20 characters and typically used for high-volume e-commerce integrations. Both formats are fully supported on Trackora.',
      },
      {
        heading: 'DHL Parcel and eCommerce Tracking Formats',
        body: 'DHL Parcel Germany uses reference numbers starting with 00340 followed by additional digits, totalling up to 20 digits. DHL eCommerce international shipments often use GM, LX, or RX prefixes followed by 8 digits and a 2-letter country code (e.g. GM123456789DE). Enter any of these formats into Trackora and it will auto-detect the DHL service type.',
      },
      {
        heading: 'Where to Find Your DHL Tracking Number',
        body: 'Your DHL tracking number appears in: (1) the shipment confirmation email from the sender, (2) on the DHL shipping label as a barcode with digits below it, (3) in your DHL account under "My Shipments", or (4) on your online order\'s tracking page if the retailer has integrated DHL tracking. If you ordered from an online shop, look for an email with subject lines like "Your order has shipped" or "Dispatch notification".',
      },
      {
        heading: 'How to Track DHL on Trackora',
        body: 'Paste your DHL tracking number into the Trackora search box. Trackora automatically identifies it as a DHL shipment and retrieves the full event timeline — from pickup and departure scans through customs clearance and out-for-delivery status. No carrier selection required. You can also enable browser notifications to get an alert the moment your DHL delivery status changes.',
      },
      {
        heading: 'Common DHL Status Messages Explained',
        body: '"Shipment picked up" — DHL collected the parcel from the sender. "In transit" — your package is moving through the DHL network. "Customs status updated" — the shipment has been presented to customs at the destination country. "Out for delivery" — a DHL courier is delivering your parcel today. "Delivered" — the parcel was handed to the recipient or left in a safe place. "Delivery attempted" — nobody was home; DHL will retry or leave a collection card.',
      },
    ],
  },
  {
    slug: 'how-to-track-fedex-shipment',
    title: 'How to Track a FedEx Shipment: Complete Guide (2026)',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Learn how to track any FedEx package — FedEx Express, FedEx Ground, and FedEx International. Find your tracking number, understand status updates, and get live delivery estimates.',
    seo: {
      title: 'How to Track a FedEx Shipment — FedEx Tracking Guide 2026 | Trackora',
      description: 'Step-by-step guide to tracking FedEx Express, FedEx Ground, and FedEx International shipments. Find your FedEx tracking number and check live status on Trackora.',
    },
    sections: [
      {
        body: 'FedEx delivers over 16 million packages per day to 220+ countries. With multiple service types — FedEx Express, FedEx Ground, FedEx Home Delivery, FedEx International Priority — knowing which service you used and where to find your tracking number makes all the difference when following your shipment.',
      },
      {
        heading: 'FedEx Tracking Number Formats',
        body: 'FedEx uses several tracking number formats depending on the service. FedEx Express and FedEx Ground use 12-digit numbers (e.g. 123456789012). FedEx Ground also uses 15-digit numbers for some shipments. FedEx International uses 20-digit numbers starting with 96 (e.g. 96123456789012345678). Some FedEx shipments use a "door tag" number starting with DT, printed on the notice left when delivery was attempted.',
      },
      {
        heading: 'FedEx Express vs FedEx Ground — Key Differences',
        body: 'FedEx Express uses aircraft for fast delivery — typically 1–3 business days within the US and 1–5 days internationally. FedEx Ground uses trucks for cost-effective domestic delivery — typically 1–7 business days. FedEx Home Delivery is the residential version of Ground, delivering 7 days a week including Sundays in most US areas. International Priority (IP) and International Economy (IE) are the main cross-border FedEx services.',
      },
      {
        heading: 'Where to Find Your FedEx Tracking Number',
        body: 'Your FedEx tracking number is on: (1) the shipping confirmation email from the sender — usually a 12 or 20-digit number labelled "tracking number" or "reference number", (2) the FedEx shipping label as a barcode, (3) your FedEx account under "Shipment History", or (4) the retailer\'s order page under "Track your order". For TNT shipments (owned by FedEx), the consignment number also works on Trackora.',
      },
      {
        heading: 'How to Track FedEx on Trackora',
        body: 'Enter your FedEx tracking number in the Trackora search box. Trackora detects the 12, 15, or 20-digit FedEx format automatically and retrieves your full delivery timeline — pickup scans, departure from origin facility, arrival at destination facility, out for delivery, and proof of delivery. If your FedEx package is being delivered by TNT (common in Europe), enter the TNT consignment number the same way.',
      },
      {
        heading: 'FedEx Delivery Status Messages Explained',
        body: '"Picked up" — FedEx collected the package from the shipper. "At FedEx facility" — your package is at a sorting hub being processed. "In transit" — the package is moving between facilities. "On FedEx vehicle for delivery" — a FedEx driver has your package and is on their route. "Delivered" — package was left at the door, with a neighbour, or signed for. "Delivery exception" — an unexpected event (customs hold, address issue, weather) is causing a delay. "Attempted delivery" — FedEx tried to deliver but couldn\'t; a door tag was left.',
      },
      {
        heading: 'What to Do If Your FedEx Package Is Delayed',
        body: 'If your package shows "In transit" for more than 3 days without an update, first check for a "Delivery exception" status. International shipments can be held by customs — the "Customs status updated" event means your package is being processed. If tracking shows no movement for 5+ business days, contact FedEx directly with your tracking number. Trackora\'s notification feature will alert you the moment the status changes so you don\'t need to keep checking manually.',
      },
    ],
  },
  {
    slug: 'how-to-track-sea-freight',
    title: 'How to Track a Sea Freight Shipment Step by Step (2026)',
    date: '2026-05-30',
    readTime: '6 min read',
    excerpt: 'Tracking ocean freight is more complex than tracking a courier parcel. This guide walks you through every reference number type and shows you the fastest way to get live vessel and port status.',
    seo: {
      title: 'How to Track Sea Freight Shipments (2026 Guide) — Trackora',
      description: 'Step-by-step guide to tracking sea freight containers. Learn the difference between container numbers, bills of lading, and booking references — and how to get live vessel status.',
    },
    sections: [
      {
        body: 'Tracking a sea freight shipment is more involved than checking a courier parcel. Ocean cargo moves through multiple handoffs — the shipper\'s warehouse, inland transport, the origin port, the vessel, the destination port, customs, and finally the consignee. Each stage generates a different type of reference number, and not every carrier provides real-time API data.',
      },
      {
        heading: 'The Three Reference Numbers You Will Encounter',
        body: 'Container number (ISO 6346): identifies the physical steel box — 4 letters + 7 digits (e.g. MSKU1234567). Bill of lading (B/L): a legal document number issued by the carrier for the shipment — it covers one or more containers loaded on a specific voyage. Booking reference: a reservation number issued by the shipping line before the cargo is loaded; once the ship departs, it is superseded by the B/L.',
      },
      {
        heading: 'Step 1 — Identify What Reference You Have',
        body: 'Check your shipping documents. Your freight forwarder will have sent you either a booking confirmation (with a booking reference), a draft B/L, or a final B/L. The container number usually appears on the B/L and on the actual container. If you only have the booking reference, you can often start tracking once the vessel departs.',
      },
      {
        heading: 'Step 2 — Know Your Shipping Line',
        body: 'You need to know which carrier is handling your shipment: Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, Yang Ming, ZIM, or another. This is always stated on your B/L. The shipping line determines which tracking portal to use — and whether live API data is available or you need to go direct to the carrier\'s website.',
      },
      {
        heading: 'Step 3 — Enter Your Reference on Trackora',
        body: 'Go to Trackora and select Sea Freight mode. Paste your container number, B/L, or booking reference. Trackora auto-detects the carrier from the container prefix (e.g. MSKU → Maersk) or lets you select the line manually. For carriers that provide API tracking, you see the full event timeline directly. For carriers that require portal access, Trackora generates a pre-filled direct link to the carrier\'s official tracking page — saving you the step of navigating to the right website and re-entering your reference.',
      },
      {
        heading: 'Step 4 — Understand the Status Events',
        body: 'Key milestones to watch for: Gate-in (container arrived at origin port), Loaded on Vessel (container physically on the ship), Departed (vessel left port — your cargo is at sea), Transshipment (cargo transferred to another vessel at an intermediate port), Arrived (vessel reached destination port), Discharged (container unloaded from vessel), Gate-out (container left port for delivery), and Delivered.',
      },
      {
        heading: 'Why Is Sea Freight Tracking Less Precise Than Courier Tracking?',
        body: 'Courier networks scan every parcel multiple times per day. Ocean containers move in large batches on vessels that may be at sea for 20-30 days with no individual container scans — only vessel-level AIS position data. Port events (loaded, discharged) are the key milestones. Between those events, vessel tracking tools like MarineTraffic show where the ship is, but individual container events only update when the container is physically handled at a port or terminal.',
      },
      {
        heading: 'Track Your Sea Freight Now',
        body: 'Paste your container number, B/L, or booking reference into Trackora. We support Maersk, MSC, CMA CGM, Hapag-Lloyd, COSCO, Evergreen, ONE, Yang Ming, ZIM, and 100+ other shipping lines — all from one search box.',
      },
    ],
  },
  {
    slug: 'how-to-track-ups-shipment',
    title: 'How to Track a UPS Shipment: Complete Guide (2026)',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Learn how to track any UPS package — UPS Ground, UPS Express, and UPS International. Find your 1Z tracking number, understand delivery statuses, and get live updates.',
    seo: {
      title: 'How to Track a UPS Shipment — UPS Tracking Guide 2026 | Trackora',
      description: 'Step-by-step guide to tracking UPS Ground, UPS Express, and UPS International shipments. Find your 1Z tracking number and check live delivery status on Trackora.',
    },
    sections: [
      { body: 'UPS (United Parcel Service) delivers over 24 million packages every day to 220+ countries. Whether you are tracking a domestic UPS Ground parcel or an international UPS Worldwide Express shipment, this guide shows you exactly how to find your tracking number and follow your package from pickup to delivery.' },
      { heading: 'What Does a UPS Tracking Number Look Like?', body: 'All UPS tracking numbers start with "1Z" followed by 16 alphanumeric characters, making 18 characters total (e.g. 1Z999AA10123456784). The characters after "1Z" encode the shipper account number, service type, package sequence, and a check digit. UPS Mail Innovations and UPS SurePost use different numeric formats starting with 92, as they use USPS for the final delivery mile.' },
      { heading: 'UPS Service Types Explained', body: 'UPS Ground delivers within 1–5 business days within the US using road transport — the most economical domestic option. UPS 2nd Day Air and UPS Next Day Air are faster domestic options guaranteed by a specific day and time. UPS Worldwide Express delivers internationally in 1–3 business days. UPS Worldwide Expedited is a cost-effective international option with 2–5 day delivery. UPS Standard is the cross-border ground service between the US, Canada, and Mexico.' },
      { heading: 'Where to Find Your UPS Tracking Number', body: 'Your UPS tracking number is on: (1) the shipping confirmation email from the sender — look for "tracking number" or "shipment ID", (2) the UPS shipping label on the package itself, (3) your UPS My Choice account under "Delivery Planner", or (4) the retailer\'s order history page. If the sender used a reference number instead, you can also track by purchase order or invoice number on the UPS website.' },
      { heading: 'How to Track UPS on Trackora', body: 'Enter your 1Z tracking number directly in the Trackora search box. Trackora auto-detects the UPS format and retrieves the full delivery timeline — from "Origin scan" through in-transit facility scans to "Delivered". You can track multiple UPS packages from your dashboard if you are signed in, and set up notifications so you are alerted on every status change without manually refreshing.' },
      { heading: 'UPS Delivery Status Messages Explained', body: '"Order processed" — the shipper created a label but has not yet handed the package to UPS. "Origin scan" — UPS scanned the package at the pickup location. "In transit" — the package is moving through UPS\'s network. "Out for delivery" — a UPS driver has your package on their route today. "Delivered" — the package was left at the door, handed to the recipient, or signed for. "Delivery will be rescheduled" — an issue prevented delivery; UPS will attempt again. "Exception" — an unexpected event (address error, customs hold, weather delay) is affecting your shipment.' },
      { heading: 'What to Do if Your UPS Package Is Delayed', body: 'If your UPS tracking shows no movement for more than 2 business days, check for an "Exception" status first. International shipments frequently pause at customs — this is normal and can take 1–5 business days. If there is genuinely no update after 5 business days, use UPS\'s "Contact UPS" feature with your tracking number to open an inquiry. Setting a Trackora notification means you will be alerted the instant your package moves again.' },
    ],
  },
  {
    slug: 'what-is-a-bill-of-lading',
    title: 'What Is a Bill of Lading? The Complete Guide for Importers and Exporters',
    date: '2026-05-30',
    readTime: '6 min read',
    excerpt: 'The bill of lading is the most important document in sea freight. This guide explains what it is, the different types, and how to use your B/L number to track your cargo.',
    seo: {
      title: 'What Is a Bill of Lading? Complete Guide — Trackora',
      description: 'Learn what a bill of lading (B/L) is, the difference between original and telex release, seaway bill vs B/L, and how to track your cargo using your B/L number.',
    },
    sections: [
      { body: 'The bill of lading (B/L or BOL) is the single most important document in international sea freight. It is issued by the shipping line to the shipper and serves three simultaneous legal functions: it is a receipt for the cargo, a contract of carriage between the shipper and the carrier, and a document of title — meaning whoever holds the original B/L has the legal right to claim the goods at destination.' },
      { heading: 'What Information Is on a Bill of Lading?', body: 'A standard bill of lading contains: shipper details (exporter), consignee details (importer), notify party (usually the customs broker or freight forwarder at destination), vessel name and voyage number, port of loading and port of discharge, container number(s) and seal number(s), cargo description, weight and volume, freight payment terms (prepaid or collect), and the B/L number itself — the unique reference you use to track the shipment.' },
      { heading: 'Original B/L vs Telex Release vs Seaway Bill', body: 'An Original B/L is a physical document — the buyer must surrender the original to the shipping line at destination to take possession of the cargo. This is the most secure but slowest method. A Telex Release (also called Express Release) means the shipper surrenders the originals at origin and instructs the line to release the cargo at destination without a physical document — faster and more common for trusted trade relationships. A Sea Waybill is a non-negotiable transport document — the consignee named on it can collect the goods simply by proving their identity, without any document. Seaway bills are common in high-volume trade lanes where cargo arrives before documents.' },
      { heading: 'Master B/L vs House B/L', body: 'A Master B/L (MBL) is issued by the shipping line to the freight forwarder. A House B/L (HBL) is issued by the forwarder to the actual shipper. When a forwarder consolidates multiple small shipments (LCL cargo) into one container, there is one MBL covering the whole container and individual HBLs for each shipper. For tracking purposes: the MBL number works on the shipping line\'s tracking portal; the HBL number works on the forwarder\'s system.' },
      { heading: 'How to Track Using Your B/L Number', body: 'Enter your B/L number in the Trackora sea freight tracker. Trackora will either retrieve the full event timeline directly via the carrier\'s API, or generate a pre-filled direct link to the shipping line\'s official tracking portal — whichever gives the most accurate data for that carrier. You can track by container number or B/L number interchangeably on Trackora.' },
      { heading: 'Common B/L Mistakes to Avoid', body: 'Errors on a B/L are costly and time-consuming to correct. The most common mistakes: wrong consignee name or address (can prevent customs clearance), incorrect cargo description (can trigger inspection), wrong weight or volume (affects freight charges and customs duty), and missing notify party details (delays final-mile delivery notification). Always verify the draft B/L from your forwarder before it is finalised — amendments after the vessel departs usually incur fees.' },
    ],
  },
  {
    slug: 'how-to-track-aramex-shipment',
    title: 'How to Track an Aramex Shipment: Complete Guide (2026)',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Aramex is the Middle East\'s leading courier. Learn how to find your Aramex tracking number, understand delivery statuses, and track Shop & Ship packages in real time.',
    seo: {
      title: 'How to Track an Aramex Shipment — Aramex Tracking Guide 2026 | Trackora',
      description: 'Track any Aramex Express or Aramex Shop & Ship package in real time. Find your Aramex tracking number and get live delivery status on Trackora.',
    },
    sections: [
      { body: 'Aramex is the largest logistics and courier company based in the Arab world, delivering to 220+ countries and territories. Founded in Amman, Jordan in 1982, Aramex is especially dominant in the Middle East, North Africa, and South Asia. Whether you are tracking an Aramex Express business shipment or an Aramex Shop & Ship package from an overseas online store, this guide covers everything you need.' },
      { heading: 'Aramex Tracking Number Format', body: 'Aramex Express tracking numbers are typically 11 digits long (e.g. 12345678901). Some Aramex shipments use longer reference numbers depending on the service level and the origin country. Aramex Shop & Ship packages (forwarded from a shopping address in the US, UK, China, etc.) use a reference that includes your personal mailbox code — look for this in your Shop & Ship account.' },
      { heading: 'Aramex Express vs Shop & Ship vs Aramex Economy', body: 'Aramex Express is the premium door-to-door courier service, delivering internationally in 1–5 business days with full tracking from pickup to delivery. Aramex Shop & Ship is a package forwarding service — you get a personal shipping address in major shopping countries (US, UK, China, UAE, etc.) and Aramex ships purchases to your home address. Aramex Economy is a cost-effective air freight service for heavier shipments with longer transit times.' },
      { heading: 'Where to Find Your Aramex Tracking Number', body: 'Your Aramex tracking number appears in: (1) the shipment confirmation email from the sender, (2) on the Aramex shipping label as a barcode, (3) in your Aramex account under "My Shipments", or (4) in your Shop & Ship account dashboard once a package arrives at your forwarding address. If you ordered from an online retailer that uses Aramex, the tracking number is usually on your order\'s dispatch email.' },
      { heading: 'How to Track Aramex on Trackora', body: 'Enter your Aramex tracking number in the Trackora search box. Trackora auto-detects the Aramex format and retrieves your full delivery timeline — from pickup and hub processing through customs clearance and out-for-delivery. For Shop & Ship packages, once Aramex generates the final-leg tracking number for your home country delivery, that number works on Trackora too.' },
      { heading: 'Aramex Delivery Status Messages Explained', body: '"Shipment picked up" — Aramex collected the package from the sender. "Processed at Aramex facility" — the shipment was scanned and sorted at an Aramex hub. "Departed" — the shipment left the origin country. "In customs" — the shipment is being processed by customs at the destination country. "Out for delivery" — an Aramex courier is delivering your package today. "Delivered" — the package was handed to the recipient. "Delivery attempted" — nobody was home; Aramex will retry or contact you to arrange re-delivery.' },
      { heading: 'Why Is Aramex Popular in the Middle East?', body: 'Aramex has the most extensive last-mile delivery network in the GCC, Levant, and North Africa regions — areas where international carriers like FedEx and DHL have limited coverage. Aramex also offers cod (cash on delivery) options common in these markets, and its Shop & Ship service makes it easy for shoppers in the region to buy from US and UK online retailers.' },
    ],
  },
  {
    slug: 'how-to-track-usps-package',
    title: 'How to Track a USPS Package: Complete Guide (2026)',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Everything you need to know about USPS tracking — Priority Mail, First Class, and international shipments. Decode your USPS tracking number and get live delivery status.',
    seo: {
      title: 'How to Track a USPS Package — USPS Tracking Guide 2026 | Trackora',
      description: 'Track any USPS package in real time — Priority Mail, First Class Mail, and international shipments. Find your USPS tracking number format and check live status on Trackora.',
    },
    sections: [
      { body: 'The United States Postal Service (USPS) handles over 130 billion pieces of mail and packages annually, making it the largest postal network in the United States. USPS delivers to every address in the US including PO Boxes and military APO/FPO addresses — something private couriers do not always cover. This guide explains how USPS tracking works and how to get live status for any USPS shipment.' },
      { heading: 'USPS Tracking Number Formats', body: 'USPS uses several tracking number formats depending on the service. Priority Mail and Priority Mail Express use 22-digit numbers starting with 94 or 95 (e.g. 9400111899223403411899). First Class Package Service uses numbers starting with 92. Certified Mail starts with 92 and is 20 digits. USPS Retail Ground and Parcel Select also use 22-digit numbers starting with 92 or 94. International USPS shipments use a 13-character format: 2 letters, 8 digits, "US" (e.g. LZ123456789US or EA123456789US). The first two letters indicate the service: EA/EB = Priority Mail Express International, LZ/LX = First Class Package International.' },
      { heading: 'Which USPS Services Include Tracking?', body: 'Not all USPS services include tracking. Services with full tracking: Priority Mail, Priority Mail Express, First Class Package Service, USPS Retail Ground, Parcel Select, Certified Mail, Registered Mail, and all international services listed above. Services without tracking: standard First Class Mail letters, Marketing Mail (bulk mail), and Media Mail (books, DVDs) typically have limited or no tracking. If tracking is important, always use Priority Mail or a tracked service level.' },
      { heading: 'Where to Find Your USPS Tracking Number', body: 'Your USPS tracking number is on: (1) the receipt from the Post Office where the item was mailed, (2) the shipping confirmation email if ordered online — look for "USPS tracking" or "shipment ID", (3) the USPS shipping label on the package itself, (4) your USPS Informed Delivery dashboard if you are enrolled. If an online seller used USPS to ship your order, the tracking number is typically in the dispatch email.' },
      { heading: 'How to Track USPS on Trackora', body: 'Paste your USPS tracking number (20 or 22 digits, or the 13-character international format) into the Trackora search box. Trackora auto-detects USPS and retrieves the full event history — from "USPS in possession of item" through "In transit to destination" to "Delivered" or "Available for pickup". International USPS packages are handed to the destination country\'s postal service and may continue to update once in the receiving country.' },
      { heading: 'USPS Tracking Status Messages Explained', body: '"Pre-shipment info sent to USPS" — the seller created a label but has not dropped it off yet. "USPS in possession of item" — the package was accepted at a Post Office or by a carrier. "In transit to next facility" — the package is moving through the USPS network. "Out for delivery" — your local postal carrier has the package today. "Delivered" — the package was delivered to the mailbox, front door, or handed to a resident. "Available for pickup" — the package is at your local Post Office awaiting collection (often due to a missed delivery or size).' },
      { heading: 'Why Is My USPS Package Not Updating?', body: 'USPS tracking gaps of 24–48 hours are common, especially for First Class packages in transit between facilities. International packages can show no updates for 1–2 weeks while in transit by sea or air. If your package has not updated for more than 7 days domestically or 4 weeks internationally, USPS considers it "missing in transit" — file a Missing Mail search request at usps.com. Trackora will notify you the moment your USPS tracking status changes.' },
    ],
  },
  {
    slug: 'what-is-an-air-waybill',
    title: 'What Is an Air Waybill (AWB)? Complete Guide for Air Freight',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'The air waybill (AWB) is the key document and tracking reference for all air freight shipments. Learn what it is, how to read the number, and how to track your cargo.',
    seo: {
      title: 'What Is an Air Waybill (AWB)? Air Freight Guide — Trackora',
      description: 'Learn what an air waybill (AWB) is, the difference between MAWB and HAWB, how to read airline prefix codes, and how to track your air freight shipment.',
    },
    sections: [
      { body: 'The air waybill (AWB) — sometimes called an airway bill or air consignment note — is the contract of carriage and primary tracking document for all air freight shipments. Just as a bill of lading governs sea freight, the AWB governs the relationship between the airline (or freight forwarder) and the shipper when cargo moves by air.' },
      { heading: 'AWB vs B/L — Key Differences', body: 'Unlike a sea freight bill of lading, an air waybill is non-negotiable — it is never a document of title. This means the consignee named on the AWB can collect the goods simply by proving their identity; no original document needs to be physically surrendered. This makes air freight faster to release at destination than ocean freight using original B/Ls. The trade-off is that AWBs offer less protection for payment security — Letters of Credit in air freight work differently than in sea freight.' },
      { heading: 'AWB Number Format — How to Read It', body: 'An AWB number has a standardised format: a 3-digit airline prefix, a hyphen, and 8 digits (e.g. 176-12345678). The 3-digit prefix is the IATA airline code assigned to the carrier. Common prefixes: 001 (American Airlines Cargo), 020 (Lufthansa Cargo), 057 (Air France Cargo), 125 (British Airways World Cargo), 157 (Qatar Airways Cargo), 172 (Cargolux), 176 (Emirates SkyCargo), 235 (Turkish Cargo). The 8-digit serial number uniquely identifies the shipment within that airline\'s system.' },
      { heading: 'Master AWB (MAWB) vs House AWB (HAWB)', body: 'A Master AWB is issued by the airline to the freight forwarder. A House AWB is issued by the forwarder to the actual shipper. When a forwarder consolidates multiple small shipments (groupage) into one ULD (Unit Load Device — a pallet or container used on aircraft), there is one MAWB covering the whole ULD and individual HAWBs for each shipper. For airline tracking, always use the MAWB number. Your forwarder tracks the HAWB.' },
      { heading: 'What Information Is on an AWB?', body: 'A standard AWB contains: shipper and consignee details, origin and destination airport codes, airline and flight number, number of pieces, gross weight and chargeable weight, commodity description, declared value for customs, freight charges (prepaid or collect), and special handling instructions (e.g. dangerous goods, perishables, temperature-controlled). The AWB number is printed prominently and also encoded as a barcode on the label.' },
      { heading: 'How to Track Your Air Freight Using the AWB on Trackora', body: 'Enter your MAWB number in the format NNN-NNNNNNNN (3-digit prefix, hyphen, 8 digits) in the Trackora search box. Trackora identifies the airline from the prefix and retrieves the flight-level event history — accepted, departed, arrived, customs released, delivered to consignee. Supported airlines include Emirates SkyCargo (176), Lufthansa Cargo (020), Qatar Airways Cargo (157), Turkish Cargo (235), Cargolux (172), Air France Cargo (057), and many more.' },
      { heading: 'Air Freight Transit Times to Expect', body: 'Air freight is typically 1–5 days door-to-door depending on the route, airline, and customs. Express services (e.g. Emirates SkyCargo Priority) deliver in 24–48 hours. Standard air freight is 3–5 days. Add 1–3 days for customs clearance at destination, especially for commercial shipments requiring import permits or inspections. Total door-to-door for most air freight lanes: 3–7 business days.' },
    ],
  },
  },
]
