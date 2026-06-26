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
  {
    slug: 'how-to-track-royal-mail-parcel',
    title: 'How to Track a Royal Mail Parcel: Complete Guide (2026)',
    date: '2026-05-30',
    readTime: '4 min read',
    excerpt: 'Learn how to track any Royal Mail parcel, letter, or international shipment in real time. Find your tracking reference and understand every delivery status.',
    seo: {
      title: 'How to Track a Royal Mail Parcel — Royal Mail Tracking Guide 2026 | Trackora',
      description: 'Track any Royal Mail Tracked 24, Tracked 48, or Special Delivery parcel in real time. Find your tracking reference format and check live status on Trackora.',
    },
    sections: [
      { body: 'Royal Mail is the UK\'s designated universal postal service, delivering to 32 million addresses six days a week. Whether you sent a Tracked 24 parcel, a Special Delivery letter, or an international registered item, this guide explains how to find your tracking reference and get live delivery status.' },
      { heading: 'Royal Mail Tracking Number Format', body: 'Royal Mail tracking references follow the format: 2 letters, 8 digits, 2 letters — 13 characters total (e.g. AB123456789GB). The last two letters indicate the country of origin: GB for items from the UK. The first two letters indicate the service: SD = Special Delivery Guaranteed, TT = Tracked, MT = Tracked Returns. Not all Royal Mail services include tracking — standard 1st and 2nd Class letters are not tracked unless you pay for an add-on.' },
      { heading: 'Which Royal Mail Services Include Tracking?', body: 'Fully tracked services: Special Delivery Guaranteed (next-day, signature required), Tracked 24 (next-day aim), Tracked 48 (2-day aim), Royal Mail Signed For (signature only, limited tracking), International Tracked, International Tracked & Signed. Not tracked: 1st Class, 2nd Class, Large Letter, and most standard letter formats. If tracking is important, always use Tracked 24 or Tracked 48 at minimum.' },
      { heading: 'Where to Find Your Royal Mail Tracking Reference', body: 'Your tracking reference is on: (1) the Post Office receipt when you posted the item, (2) the confirmation email or dispatch notification from the online seller, (3) the label on the parcel itself — look for the barcode with letters and numbers below it, (4) your Royal Mail Click & Drop account if you are a business sender. If the sender used a franking machine or standard stamps, the item may not have a tracking reference.' },
      { heading: 'How to Track Royal Mail on Trackora', body: 'Enter your 13-character Royal Mail tracking reference in the Trackora search box. Trackora auto-detects Royal Mail from the format and retrieves the full event history — from "Item accepted at Post Office" through "In transit" to "Delivered" or "Delivery attempted". For international items sent by Royal Mail that are being delivered by a partner postal service abroad, tracking may continue updating once handed to the destination country\'s carrier.' },
      { heading: 'Royal Mail Delivery Status Messages Explained', body: '"We\'ve got it" — Royal Mail has the item at a delivery office or hub. "On its way" — the item is in transit through the Royal Mail network. "Out for delivery" — your postie has the item on their round today. "Delivered" — the item was put through your letterbox or left in a safe place. "Sorry, we missed you" — delivery was attempted but nobody was home; a red card was left. "Collected" — you picked it up from the delivery office. "Item being held at delivery office" — too large for the letterbox; you need to collect or rearrange.' },
    ],
  },
  {
    slug: 'how-to-track-evergreen-container',
    title: 'How to Track an Evergreen Container: Complete Guide (2026)',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Evergreen Line is one of the world\'s top 5 container shipping companies. Learn how to track your Evergreen container, B/L, or booking reference in real time.',
    seo: {
      title: 'How to Track an Evergreen Container — Evergreen Tracking Guide 2026 | Trackora',
      description: 'Track any Evergreen Line container number, bill of lading, or booking reference in real time. Step-by-step guide with container number formats and status explanations.',
    },
    sections: [
      { body: 'Evergreen Line is one of the world\'s top 5 container shipping companies, operating over 200 vessels on major trade lanes including Asia-Europe, Transpacific, and intra-Asia. Evergreen is best known internationally for the Ever Given — the vessel that blocked the Suez Canal in 2021 for six days. This guide explains how to track any Evergreen shipment from container number, bill of lading, or booking reference.' },
      { heading: 'Evergreen Container Number Format', body: 'Evergreen containers use two main owner codes: EISU and EMCU, each followed by 7 digits (e.g. EISU1234567 or EMCU7654321). These follow the ISO 6346 standard — 4 letters identifying the owner, followed by a 6-digit serial number and a check digit. If you see a container number starting with EISU or EMCU on your shipping documents, it is an Evergreen container.' },
      { heading: 'Container Number vs Bill of Lading vs Booking Reference', body: 'The container number (EISU/EMCU + 7 digits) identifies the physical steel box. The bill of lading (B/L) is the legal shipping document issued by Evergreen for your cargo — it may cover one or more containers. The booking reference is issued when you reserve space on an Evergreen vessel, before the ship departs. You can track using any of these three reference types on Trackora.' },
      { heading: 'How to Track Evergreen on Trackora', body: 'Select Sea Freight mode on Trackora, choose Evergreen, and enter your container number, B/L, or booking reference. For container numbers, Trackora auto-detects Evergreen from the EISU or EMCU prefix. Trackora generates a pre-filled direct link to Evergreen\'s official tracking portal, which shows live vessel position, port events, and estimated arrival — the same data Evergreen\'s own team uses.' },
      { heading: 'Key Evergreen Tracking Events Explained', body: '"Gate in full" — your loaded container entered the origin terminal. "Loaded on vessel" — the container was physically loaded onto the ship. "Vessel departed" — the ship left the origin port. "Transshipment" — the container was transferred to another vessel at an intermediate port (common on Asia-Europe routes via Singapore or Port Said). "Vessel arrived" — the ship reached the destination port. "Discharged" — the container was unloaded from the vessel. "Gate out" — the container left the terminal for delivery.' },
      { heading: 'Evergreen Trade Lanes and Transit Times', body: 'Evergreen\'s main trade lanes: Asia to Europe (approximately 25–30 days via Suez Canal), Asia to US West Coast (approximately 14–18 days), Asia to US East Coast (approximately 25–30 days via Panama Canal), intra-Asia (3–10 days depending on ports). Transit times vary based on the specific route, number of transshipments, and port congestion at origin and destination.' },
    ],
  },
  {
    slug: 'what-is-a-booking-reference',
    title: 'What Is a Booking Reference in Shipping? (And How to Track With It)',
    date: '2026-05-30',
    readTime: '4 min read',
    excerpt: 'A booking reference is the first number you get when shipping cargo. Learn what it is, how it differs from a bill of lading, and whether you can track your shipment with it.',
    seo: {
      title: 'What Is a Booking Reference in Shipping? — Trackora',
      description: 'Learn what a shipping booking reference is, how it differs from a bill of lading and container number, and how to use it to track your cargo online.',
    },
    sections: [
      { body: 'When you book space on a container ship or arrange a freight shipment, the first document reference you receive is a booking reference — also called a booking number or booking confirmation number. This is issued by the shipping line or freight forwarder before your cargo is loaded, and it is the starting point for all documentation and tracking.' },
      { heading: 'What Is a Booking Reference?', body: 'A booking reference is a unique alphanumeric code assigned by the shipping line when you reserve space on a vessel. It confirms that the carrier has allocated a slot for your cargo on a specific sailing. The booking reference is used internally by the shipping line to link your cargo to a specific vessel, voyage, origin port, and destination port. It is not a legal document — it simply confirms your reservation.' },
      { heading: 'Booking Reference vs Bill of Lading vs Container Number', body: 'These three references represent different stages of the shipping process. The booking reference comes first — issued when you book, before the cargo is loaded. The bill of lading (B/L) is issued after the vessel departs — it is the legal contract of carriage and document of title. The container number identifies the physical box your cargo is loaded into — you typically receive this after container stuffing. Think of it as: booking reference = hotel reservation, B/L = check-in receipt, container number = your room number.' },
      { heading: 'Can You Track a Shipment Using a Booking Reference?', body: 'Yes, but with limitations. Before the vessel departs, a booking reference typically only shows the scheduled sailing details — vessel name, voyage number, and estimated departure date. Real-time tracking events (loaded, departed, in transit, arrived) only become available once the cargo is physically loaded and the vessel departs. After that, the B/L number usually provides more detailed event tracking than the booking reference. Most shipping lines accept both on their tracking portals.' },
      { heading: 'How to Track Using a Booking Reference on Trackora', body: 'Enter your booking reference in the Trackora sea freight tracker and select your shipping line. Trackora generates a pre-filled direct link to the carrier\'s official tracking portal with your reference already entered. For carriers that provide API data, Trackora displays the available event history directly. Note that pre-departure, the tracking data will be limited to scheduled sailing information.' },
      { heading: 'When Does a Booking Reference Become a Bill of Lading?', body: 'The booking reference transitions to a bill of lading number after the vessel departs and the carrier issues the B/L — typically 1–3 days after the ship sails. Your freight forwarder will send you the draft B/L for review, and once approved, the final B/L is issued. The B/L number is different from the booking reference, though some carriers use similar numbering. From this point, use the B/L number for all tracking and customs purposes.' },
    ],
  },
  {
    slug: 'maersk-container-tracking-guide',
    title: 'Maersk Container Tracking: Complete Guide (2026)',
    date: '2026-05-30',
    readTime: '5 min read',
    excerpt: 'Maersk is the world\'s largest container shipping company. This guide covers every way to track your Maersk container, bill of lading, and booking — with live status explained.',
    seo: {
      title: 'Maersk Container Tracking Guide 2026 — Track Any Maersk Shipment | Trackora',
      description: 'How to track a Maersk container, bill of lading, or booking reference in real time. Complete guide with container number formats, status events, and tracking tips.',
    },
    sections: [
      { body: 'Maersk (A.P. Møller-Mærsk) is the world\'s largest container shipping company, operating over 700 vessels and carrying approximately 17% of global container trade. If you are importing or exporting sea freight, there is a strong chance your cargo is moving on a Maersk ship. This guide covers every way to track a Maersk shipment and what each status event means.' },
      { heading: 'Maersk Container Number Format', body: 'Maersk uses several owner codes for its container fleet. The most common are MSKU (standard Maersk containers), MRKU (refrigerated/reefer containers), MAEU (Maersk Line containers), and TRHU (Triton containers leased by Maersk). All follow the ISO 6346 format: 4 letters followed by 7 digits (e.g. MSKU1234567). If your container number starts with any of these codes, it is a Maersk vessel.' },
      { heading: 'Three Ways to Track a Maersk Shipment', body: 'Container number: enter MSKU/MRKU/MAEU + 7 digits — the most precise way to track a specific box. Bill of lading number: the legal document number issued after the vessel departs — typically 9 digits for Maersk. Booking reference: the reservation number — useful before departure to confirm the sailing schedule. All three work on Trackora\'s sea freight tracker.' },
      { heading: 'How to Track Maersk on Trackora', body: 'Select Sea Freight on Trackora and enter your reference. Maersk is one of the few shipping lines that provides a public tracking API, so for container numbers, Trackora can often retrieve the full event timeline directly without needing to redirect you. For B/L and booking references, Trackora generates a pre-filled link to Maersk\'s official tracking portal at maersk.com — the most accurate and up-to-date data source.' },
      { heading: 'Maersk Tracking Events Explained', body: '"Booking confirmed" — Maersk has reserved space on a vessel for your cargo. "Gate in" — your container entered the origin terminal. "Vessel arrival at loading port" — the ship arrived at the port where your cargo will be loaded. "Loaded on board" — your container was physically lifted onto the vessel. "Vessel departure" — the ship left the origin port. "Transshipment" — container moved between vessels (common at hub ports like Singapore, Port Klang, Algeciras). "Vessel arrival at discharge port" — the ship arrived at the destination. "Discharged" — your container came off the vessel. "Available for pickup" — cleared customs and ready for collection.' },
      { heading: 'What Is the Maersk Spot Product?', body: 'Maersk Spot is Maersk\'s instant online booking product — you get a confirmed price and space guarantee in real time, rather than negotiating rates with a freight forwarder. It is aimed at small and medium shippers. Shipments booked via Maersk Spot use the same container numbers and B/L tracking as traditional Maersk bookings.' },
      { heading: 'Maersk Trade Lanes and Transit Times', body: 'Key Maersk routes: Asia to North Europe via Suez (approximately 28–32 days), Asia to US West Coast (14–18 days), Asia to US East Coast via Panama (28–35 days), intra-Asia (5–14 days). Maersk also operates short-sea and feeder routes in Europe, the Americas, and Africa. Exact transit times depend on the specific service string and number of port calls.' },
    ],
  },
  {
    slug: 'dhl-vs-fedex-vs-ups',
    title: 'DHL vs FedEx vs UPS: Which Is Fastest, Cheapest, and Best? (2026)',
    date: '2026-05-30',
    readTime: '6 min read',
    excerpt: 'Choosing between DHL, FedEx, and UPS? This guide compares speed, price, international coverage, and reliability to help you pick the right courier for every shipment.',
    seo: {
      title: 'DHL vs FedEx vs UPS: Which Is Best? Complete Comparison 2026 | Trackora',
      description: 'DHL vs FedEx vs UPS compared on speed, price, international coverage, and tracking. Find out which courier is best for your shipment in 2026.',
    },
    sections: [
      { body: 'DHL, FedEx, and UPS are the three largest international courier companies in the world. Together they carry billions of packages annually across 220+ countries. But they are not interchangeable — each has strengths in different regions, price ranges, and shipment types. This guide breaks down the key differences so you can pick the right carrier for every shipment.' },
      { heading: 'International Coverage: DHL Wins', body: 'DHL Express has the most extensive international network, with the deepest coverage in the Middle East, Africa, and Asia-Pacific — regions where FedEx and UPS have more limited reach. DHL delivers to more postal codes in emerging markets than any other courier. If you are shipping to or from the UAE, Saudi Arabia, Sub-Saharan Africa, or Southeast Asia, DHL is usually the most reliable choice. FedEx and UPS are stronger in North America and Europe.' },
      { heading: 'Speed: FedEx and DHL Tie for International', body: 'For international express shipments, DHL Express and FedEx International Priority are both excellent — typically delivering in 1–3 business days between major cities. FedEx has an edge for US-Europe lanes due to its Memphis and Indianapolis hubs. DHL is faster for Middle East and Africa. UPS Worldwide Express is competitive but generally considered slightly slower for international shipments. For US domestic, UPS Next Day Air and FedEx First Overnight are neck and neck.' },
      { heading: 'Price: UPS Cheapest for Domestic, DHL for International', body: 'For US domestic shipping, UPS Ground is typically the most economical option for heavier parcels. FedEx Ground is competitive. For international, DHL Express often offers better rates for lighter shipments (under 5kg) to international destinations. FedEx and UPS tend to be cheaper for heavy freight to North America and Europe. The best approach: always get quotes from all three for each specific lane and weight — rates vary significantly by route.' },
      { heading: 'Tracking Quality: All Three Are Excellent', body: 'DHL, FedEx, and UPS all provide real-time tracking with scan events at every facility. All three offer estimated delivery windows, exception notifications, and proof of delivery. FedEx\'s tracking has the most granular events including "on FedEx vehicle for delivery" with a map. DHL Predict gives a 1-hour delivery window. UPS My Choice sends proactive delivery notifications. For tracking any of the three, simply paste your number into Trackora — no need to visit each carrier\'s website separately.' },
      { heading: 'Reliability: FedEx for Time-Critical, DHL for International', body: 'FedEx is widely regarded as the most reliable for guaranteed time-definite domestic US delivery — its money-back guarantee on Express services is well-enforced. DHL Express has the best on-time performance for international lanes, particularly Asia-Europe and Middle East routes. UPS is highly reliable for US domestic and is the preferred choice for many B2B shippers due to its strong commercial pickup and delivery infrastructure.' },
      { heading: 'Which Should You Choose?', body: 'Use DHL Express when shipping internationally, especially to/from the Middle East, Africa, or Asia-Pacific. Use FedEx when you need guaranteed next-day domestic US delivery or ship heavily to/from Europe and North America. Use UPS for cost-effective US domestic ground shipping or when shipping heavy commercial freight. For any of the three, track your shipment instantly on Trackora by pasting your tracking number — no carrier selection needed.' },
    ],
  },
  {
    slug: 'incoterms-2020-complete-guide',
    title: 'Incoterms 2020: Complete Guide for Importers and Exporters',
    date: '2026-06-10',
    readTime: '12 min read',
    excerpt: 'Incoterms 2020 define who pays for freight, insurance, and customs — and who bears the risk at every point in the journey. This complete guide explains all 11 terms with real examples.',
    seo: {
      title: 'Incoterms 2020 Explained: Complete Guide for Importers & Exporters | Trackora',
      description: 'Understand all 11 Incoterms 2020 rules — EXW, FCA, FAS, FOB, CFR, CIF, CPT, CIP, DAP, DPU, DDP. Learn who pays freight, insurance, and customs with real examples.',
    },
    sections: [
      {
        body: 'Every international trade contract includes a three-letter code that determines who pays for shipping, who arranges insurance, who handles customs clearance, and — critically — at what point risk transfers from seller to buyer. These codes are called Incoterms, short for International Commercial Terms. Published by the International Chamber of Commerce (ICC), the 2020 edition contains 11 rules that apply to goods moving by any mode of transport. Getting Incoterms wrong can mean unexpected costs of tens of thousands of dollars, insurance gaps that leave cargo unprotected, or disputes that end business relationships. This guide explains every term in plain language with concrete examples.',
      },
      {
        heading: 'Why Incoterms Matter More Than You Think',
        body: 'Incoterms are not just bureaucratic labels — they have direct financial consequences. Consider a $500,000 shipment of electronics moving from Shenzhen to Dubai. Under EXW (Ex Works), the buyer in Dubai is responsible for collecting the goods from the factory gate in China, arranging export customs in China, booking the ocean freight, insuring the cargo, and handling import customs in the UAE. Under DDP (Delivered Duty Paid), the seller handles every single one of those steps and delivers the goods cleared through UAE customs to the buyer\'s warehouse. The cost difference and risk exposure between these two extremes can easily exceed $15,000–$30,000. Choosing the wrong term — or misunderstanding who is responsible — can result in cargo sitting at a port under demurrage charges, insurance claims being denied, or both parties assuming the other arranged critical services.',
      },
      {
        heading: 'The Two Categories: Rules for Any Mode vs Sea-Only Rules',
        body: 'Incoterms 2020 are divided into two categories. The first group of seven rules — EXW, FCA, CPT, CIP, DAP, DPU, and DDP — can be used for any mode of transport: air, sea, road, rail, or multimodal. The second group of four rules — FAS, FOB, CFR, and CIF — apply only to sea and inland waterway transport, and specifically to bulk cargo or breakbulk where the point of delivery is the ship\'s side or on board. A critical and widely misunderstood point: FOB and CIF are frequently used (incorrectly) in container shipping contracts. For containerized cargo, FCA and CIP are the correct equivalents because risk should transfer at the container freight station (CFS) or port of loading, not at the ship\'s rail — you cannot place a container "on board" in the traditional sense without the container already being in the carrier\'s control.',
      },
      {
        heading: 'EXW — Ex Works: Maximum Responsibility for the Buyer',
        body: 'Under Ex Works, the seller\'s only obligation is to make the goods available at their premises — typically their factory or warehouse. The buyer bears all costs and risks from that point forward: arranging a truck to collect the goods, handling export customs documentation and duties in the seller\'s country, booking ocean or air freight, insuring the cargo, and arranging import customs clearance at the destination. EXW gives the buyer maximum control over the entire supply chain but requires significant logistics expertise and relationships in the seller\'s country. It is rarely appropriate for buyers who do not have a freight forwarder or customs broker in the country of export. Example: A UK buyer purchasing furniture from a manufacturer in Vietnam on EXW terms is responsible for organizing a truck from the factory in Ho Chi Minh City to the port, filing Vietnamese export customs, booking the ocean freight, insuring the 40-foot container, and clearing UK customs upon arrival.',
      },
      {
        heading: 'FCA — Free Carrier: The Preferred Alternative to FOB for Containers',
        body: 'Free Carrier transfers risk from seller to buyer when the seller delivers the goods to a named carrier at a named place. If that place is the seller\'s premises, the seller is responsible for loading. If it is another place, the seller is not responsible for unloading. FCA is the recommended Incoterm for containerized cargo instead of FOB because it accurately reflects when risk transfers — when the container is handed to the ocean carrier at the container freight station or the port terminal, not when it is hoisted over the ship\'s rail. The 2020 revision of Incoterms added an important clarification: under FCA, the buyer can instruct the carrier to issue an on-board bill of lading to the seller after loading, which is critical for letters of credit that require B/L evidence of loading.',
      },
      {
        heading: 'FOB — Free on Board: Popular but Misapplied',
        body: 'Free on Board means the seller delivers the goods on board the vessel at the named port of shipment and bears all costs and risks up to that point, including export customs. Once the goods are on the ship, risk passes to the buyer, who is responsible for freight and insurance from that point. FOB is the most commonly used sea freight Incoterm in international trade — particularly for manufacturing contracts from China, India, and Southeast Asia. However, as noted above, it is technically incorrect for containerized cargo, where risk actually transfers when the container is delivered to the terminal rather than when it crosses the ship\'s rail. Despite this technical issue, FOB is widely accepted by banks and customs authorities in its traditional meaning, and billions of dollars of containerized cargo moves on FOB terms every year.',
      },
      {
        heading: 'CIF — Cost Insurance Freight: When the Seller Pays for Shipping',
        body: 'Under CIF, the seller pays for freight and minimum insurance to the named port of destination, but risk transfers to the buyer when the goods are loaded on board the ship at the port of origin. This creates an important asymmetry: the seller arranges and pays for freight and insurance, but the buyer bears the risk during transit. If the ship sinks halfway, the buyer suffers the loss — not the seller. The seller\'s minimum insurance obligation under CIF is only 110% of the cargo value under Institute Cargo Clauses (C), which is the most basic level of cover and excludes many common perils. Buyers should be aware of this and either negotiate for Institute Cargo Clauses (A) — all-risks cover — or arrange their own marine insurance. CIF is the Incoterm used as the basis for customs valuation in most countries: import duties are calculated on the CIF value of goods.',
      },
      {
        heading: 'DDP — Delivered Duty Paid: Maximum Responsibility for the Seller',
        body: 'Delivered Duty Paid is the opposite of EXW — the seller is responsible for everything: packing, export customs, freight, insurance, import customs duties and taxes, and delivery to the buyer\'s named destination. DDP gives the buyer the simplest possible buying experience, similar to purchasing domestically. However, it creates significant challenges for sellers. The seller must have a legal entity or fiscal representative in the destination country to file import customs, which is not always feasible. Import duties, VAT, and other taxes can be unpredictable and erode margins significantly. For e-commerce shipments under customs de minimis thresholds, DDP is commonly used by platforms like Shopify and Amazon Marketplace. For B2B trade, DAP (see below) is often preferred because it keeps import duties and taxes on the buyer, who knows their country\'s rules better.',
      },
      {
        heading: 'DAP — Delivered at Place: A Practical Middle Ground',
        body: 'Delivered at Place means the seller delivers goods ready for unloading at the named destination, bearing all risks and costs except import duties and taxes, which are the buyer\'s responsibility. DAP is one of the most commonly used Incoterms for B2B cross-border e-commerce and standard commercial shipments. It gives the seller control over the freight and insurance (ensuring quality service) while keeping import customs clearance with the buyer, who understands local requirements and has an existing customs broker relationship. Many large retailers and procurement teams prefer DAP because it means they receive a firm landed price including freight, while still controlling their own import compliance.',
      },
      {
        heading: 'CPT and CIP: The Container-Friendly Equivalents of CFR and CIF',
        body: 'Carriage Paid To (CPT) and Carriage and Insurance Paid To (CIP) are the multimodal equivalents of CFR and CIF. Under CPT, the seller pays freight to the named destination but risk transfers to the buyer when goods are handed to the first carrier (usually at the origin container freight station). CIP is identical but adds the seller\'s obligation to arrange insurance — and importantly, the 2020 revision upgraded the minimum insurance requirement under CIP from Institute Cargo Clauses (C) to Institute Cargo Clauses (A), providing all-risks cover. This makes CIP significantly more protective for the buyer than CIF. For containerized cargo moving door-to-door or port-to-door, CPT and CIP more accurately reflect the logistics reality than CFR and CIF.',
      },
      {
        heading: 'How to Choose the Right Incoterm for Your Shipment',
        body: 'The right Incoterm depends on your logistics capabilities, your relationship with the counterparty, and your risk appetite. As an importer: if you have a strong freight forwarder network and want maximum control and cost transparency, use FCA or FOB — you manage your own freight and insurance. If you want a simple door-to-door price and trust your supplier\'s logistics, use DAP or DDP. As an exporter: if you want to minimize your logistics obligations and focus on manufacturing, use EXW or FCA. If you want to add value and margin by including logistics in your pricing, use CIF or DAP. Always specify the complete Incoterm including the version: "CIF Shanghai, Incoterms 2020" — not just "CIF Shanghai." Include it in your purchase orders, commercial invoices, and letters of credit. Track the progress of your shipments with Trackora using the container number, bill of lading, or booking reference your freight forwarder provides.',
      },
      {
        heading: 'Incoterms and Insurance: What You Must Know',
        body: 'Insurance is one of the most dangerous gaps in international trade. Under EXW, FCA, FAS, FOB, CFR, CPT, and DAP, the seller has no obligation to arrange cargo insurance. The buyer is responsible for insuring their own cargo from the point risk transfers. Many buyers — especially SMEs new to importing — assume their goods are insured during ocean transit when they are not. If a container is lost, damaged, or stolen at sea and you are buying on FOB terms without your own cargo insurance, you bear the full loss. Always arrange marine cargo insurance independently, preferably Institute Cargo Clauses (A) which provides all-risks cover. Under CIF, the seller must provide minimum insurance, but as noted, this is only Clauses (C). Under CIP in Incoterms 2020, the seller must provide Clauses (A) cover — the most comprehensive form.',
      },
      {
        heading: 'Common Incoterms Mistakes and How to Avoid Them',
        body: 'The most frequent Incoterms mistakes in practice: using FOB for containerized cargo (use FCA instead); specifying EXW when the buyer has no customs authority in the seller\'s country; using DDP when the seller has no legal entity in the destination country; forgetting to specify the named place (e.g., "FOB" with no port name is legally incomplete); using an outdated version such as Incoterms 2010 when Incoterms 2020 is now current; and assuming CIF includes all-risks insurance (it only requires minimum cover). Another common error is misapplying Incoterms to domestic trade — these rules are designed for international trade and include provisions for export/import customs that do not apply to domestic transactions. For tracking your shipments under any Incoterm, Trackora works with any reference number your freight forwarder or carrier provides.',
      },
    ],
  },
  {
    slug: 'how-to-calculate-freight-costs',
    title: 'How to Calculate Freight Costs: Air vs Sea vs Express Complete Guide',
    date: '2026-06-11',
    readTime: '11 min read',
    excerpt: 'Freight costs depend on weight, dimensions, distance, mode, and dozens of surcharges. This guide explains exactly how carriers calculate rates for air, sea, and express shipments — with worked examples.',
    seo: {
      title: 'How to Calculate Freight Costs: Air vs Sea vs Express Guide | Trackora',
      description: 'Learn how freight costs are calculated for air, sea, and express shipments. Understand chargeable weight, volumetric weight, fuel surcharges, THC, and how to get accurate quotes.',
    },
    sections: [
      {
        body: 'Freight pricing is one of the most opaque areas in international trade. Carriers use different formulas, apply different surcharges, and quote in ways that make direct comparison difficult. Understanding how rates are calculated — and where the hidden costs lie — is essential for accurate landed cost calculations, competitive pricing, and budget planning. This guide walks through the exact calculation methods for express couriers, air freight, and ocean freight, with worked examples throughout.',
      },
      {
        heading: 'The Foundation: Actual Weight vs Volumetric Weight',
        body: 'Every freight calculation starts with one fundamental concept: you pay for the higher of actual weight or volumetric (chargeable) weight. This is because carriers have limited space in aircraft holds and ship containers — a shipment of feathers that fills a container but weighs very little still occupies revenue-generating space. Volumetric weight converts the physical dimensions of a package into a weight equivalent. The formula differs by mode: For express couriers and air freight: Volumetric Weight (kg) = (Length × Width × Height in cm) ÷ 5,000. For road and sea LCL freight, many carriers use: Volumetric Weight (kg) = (Length × Width × Height in cm) ÷ 3,000 or ÷ 4,000. If your cargo\'s volumetric weight is higher than its actual weight, you pay the volumetric rate. If the actual weight is higher, you pay the actual rate. The higher of the two is called the chargeable weight.',
      },
      {
        heading: 'Express Courier Pricing: DHL, FedEx, UPS',
        body: 'Express couriers publish zone-based rate cards — the price depends on the destination zone (a geographic grouping of countries based on distance from the origin) and the chargeable weight. For DHL Express from the UAE: Zone 1 covers GCC countries, Zone 2 Middle East, Zone 3 Asia-Pacific, Zone 4 Europe, Zone 5 North America. A 5kg package to Zone 4 (Europe) might cost $45–$65 depending on the service level. Volumetric weight formula: L×W×H÷5000. Example: a box measuring 40cm × 30cm × 25cm has a volume of 30,000 cm³. Volumetric weight = 30,000 ÷ 5,000 = 6 kg. If the actual weight is 4 kg, the chargeable weight is 6 kg and you pay for 6 kg. Express carriers also apply a fuel surcharge (typically 10–25% of the base rate, updated monthly) and remote area surcharges for deliveries to rural postal codes. The Trackora Rates Calculator gives you instant express estimates by entering origin, destination, weight, and dimensions.',
      },
      {
        heading: 'Air Freight Pricing: IATA Rate Breaks',
        body: 'Air freight rates from freight forwarders are quoted per kilogram but use IATA\'s rate break system — the per-kg rate decreases as weight increases. Standard rate breaks are: 45 kg, 100 kg, 300 kg, 500 kg, and 1,000 kg (called "M" for minimum charge, +45, +100, +300, +500, +1000). A shipment just below a rate break threshold should be rounded up to the next break if doing so reduces the total cost. Example: if the +100 rate is $3.20/kg and the +45 rate is $4.10/kg, a 95 kg shipment on the +45 rate costs $389.50 (95 × $4.10). On the +100 rate it costs $320 (100 × $3.20). It is cheaper to declare 100 kg than 95 kg — and airlines allow this. The air freight rate per kg typically includes only the basic airfreight charge. You must add: fuel surcharge (typically $0.30–$0.80/kg), security surcharge ($0.15–$0.30/kg), airport handling at origin and destination ($50–$150 per shipment), AWB issuance fee ($25–$50), and customs clearance at destination (quoted separately by your customs broker).',
      },
      {
        heading: 'Ocean Freight: FCL vs LCL Pricing',
        body: 'Ocean freight comes in two forms: FCL (Full Container Load) where you pay for a complete container, and LCL (Less than Container Load) where you share space with other shippers. FCL is priced per container regardless of how much cargo fills it. Standard rates are for 20ft GP, 40ft GP, and 40ft HC containers. Published ocean freight rates are quoted as the "ocean freight" component only — you must add origin charges and destination charges which can often equal or exceed the ocean freight itself. Origin charges include: Origin Terminal Handling Charge (OTHC) $150–$250, document fee $50–$100, port/seal fees $20–$50. Destination charges include: Destination Terminal Handling Charge (DTHC) $150–$350, delivery order fee $50–$75, port congestion surcharge (variable, can be $0–$500+). LCL rates are quoted per cubic meter (CBM) or per revenue ton (RT, where 1 RT = 1,000 kg or 1 CBM, whichever is greater). Typical LCL rates range from $20–$80/CBM for major trade lanes, but minimum charges of $150–$250 per shipment mean LCL is only economical above approximately 2 CBM.',
      },
      {
        heading: 'How to Calculate CBM (Cubic Meters)',
        body: 'Cubic meters is the standard unit for LCL ocean freight. To calculate: CBM = (Length in cm × Width in cm × Height in cm) ÷ 1,000,000. Example: a pallet measuring 120cm × 100cm × 150cm = 1,800,000 cm³ ÷ 1,000,000 = 1.8 CBM. If the pallet weighs 800 kg, the revenue ton is the greater of 1.8 CBM and 0.8 metric tons = 1.8 RT. You are charged for 1.8 RT at the quoted LCL rate. For multiple pieces, calculate each individually and sum the CBM. Maximum CBM figures for standard containers: 20ft GP: approximately 25–28 CBM usable. 40ft GP: approximately 55–58 CBM. 40ft HC (High Cube): approximately 65–68 CBM. FCL is generally more economical than LCL above 10–12 CBM on most trade lanes.',
      },
      {
        heading: 'Surcharges: The Hidden Costs in Freight Pricing',
        body: 'Surcharges can add 30–100% to the base freight rate and are the biggest source of budget surprises in freight. Key surcharges to understand: Bunker Adjustment Factor (BAF) or Fuel Surcharge (FSC): adjusts for fluctuating bunker fuel costs in ocean shipping. Can be $50–$300+ per container depending on the trade lane and fuel prices. Peak Season Surcharge (PSS): applied by carriers during high-demand periods, especially August–October before the holiday retail season. Can add $200–$1,000 per container. Emergency Equipment Imbalance Surcharge (EIS): applied when there is a shortage of containers in a region. War Risk Surcharge: applies to shipments through conflict zones such as the Red Sea. Added $500–$1,500 per container during the 2024 Red Sea crisis. Hazardous Cargo Surcharge: for dangerous goods classified under IMDG or IATA regulations. Reefer surcharge: for temperature-controlled containers. Always request an all-inclusive quote from your freight forwarder rather than asking for "ocean freight only."',
      },
      {
        heading: 'Calculating Total Landed Cost',
        body: 'Landed cost is the total cost to get goods from the supplier\'s factory to your warehouse, including all freight, customs duties, taxes, and handling. The formula: Landed Cost = (CIF Value × Import Duty Rate) + VAT + Freight from Port to Warehouse + Other Fees. CIF value = FOB value + freight + insurance. Example: You import $10,000 worth of electronics from China to the UAE (DXB). FOB value: $10,000. Ocean freight (FCL 20ft): $1,200. Insurance: $55 (0.5% of $10,000 + freight). CIF value: $11,255. UAE customs duty on electronics: 5%. Duty: $562.75. UAE VAT: 5% on (CIF + duty) = 5% × ($11,255 + $562.75) = $590.89. Total import taxes: $1,153.64. Trucking from Jebel Ali port to warehouse: $200. Total landed cost: $10,000 + $1,200 + $55 + $1,153.64 + $200 = $12,608.64. Use the Trackora Customs Duty Estimator to calculate duties and taxes for your specific product and import country.',
      },
      {
        heading: 'Air vs Sea: Cost-Benefit Analysis',
        body: 'The decision between air freight and sea freight comes down to the balance between time and cost. Sea freight is typically 10–30 times cheaper per kilogram than air freight for bulk cargo. However, transit times are 15–45 days compared to 2–7 days for air. The tipping point for choosing air over sea: (a) the goods have a high value-to-weight ratio (electronics, pharmaceuticals, jewelry), (b) the goods are time-sensitive (perishables, seasonal merchandise, urgent restocks), (c) the inventory carrying cost of waiting 30+ days exceeds the freight premium, (d) the goods are under a letter of credit with a tight presentation deadline. For a $50,000 shipment of mobile phones weighing 200 kg, the air freight of $1,200–$2,000 represents only 2.4–4% of cargo value — often justified to avoid 30 days of tied-up capital, stockout risk, and warehousing costs in the origin country.',
      },
      {
        heading: 'Getting Accurate Freight Quotes',
        body: 'The most important rule in freight quoting: always provide complete cargo details upfront. Forwarders require: origin and destination (city/port, not just country), exact dimensions and weight of each piece, commodity description (for dangerous goods check and duty estimation), ready date, required delivery date, Incoterms, and whether you need door pickup or port delivery. Getting three quotes from different freight forwarders on every major shipment is standard practice — rates for the same route and cargo can vary by 30–50% between forwarders based on their carrier contracts and space allocations. Check whether each quote includes all surcharges and destination charges, or just the base ocean/air freight. Use the Trackora Rates Calculator for instant express and air freight estimates to benchmark forwarder quotes.',
      },
      {
        heading: 'Freight Rate Trends and When to Book',
        body: 'Ocean freight rates are highly cyclical and can vary by 300–500% between peak and trough periods. The COVID-19 pandemic saw 40ft container rates from China to Europe peak above $15,000 in January 2022, compared to a pre-pandemic norm of $1,000–$1,500. By late 2023, rates had returned to $1,000–$1,500 before climbing again in 2024 due to Red Sea rerouting. The predictable annual pattern: rates rise from July as retailers stock up for the holiday season, peak in September–October, then fall in November–December and January–February. For seasonal buyers, booking 6–8 weeks before cargo-ready date and locking in rates with a contract or space commitment saves significant cost during peak season. Air freight rates follow a similar seasonal pattern but with less volatility.',
      },
    ],
  },
  {
    slug: 'import-customs-clearance-process',
    title: 'Import Customs Clearance: Complete Step-by-Step Guide',
    date: '2026-06-12',
    readTime: '10 min read',
    excerpt: 'Customs clearance can hold your cargo for days or weeks if done incorrectly. This guide explains every step of the import customs clearance process, the documents required, and how to avoid common delays.',
    seo: {
      title: 'Import Customs Clearance: Step-by-Step Guide for Importers | Trackora',
      description: 'Learn the complete import customs clearance process: documents required, HS codes, duty calculation, customs examination, and how to avoid delays. A practical guide for importers.',
    },
    sections: [
      {
        body: 'Customs clearance is the process of obtaining permission from a country\'s customs authority to bring imported goods into the country. Until clearance is granted, your cargo sits in a bonded area at the port or airport — and you are accumulating demurrage and storage charges for every day it waits. Understanding the clearance process, having the right documents ready, and working with a competent customs broker can be the difference between goods arriving smoothly in 24 hours and a two-week delay that costs more than the goods themselves.',
      },
      {
        heading: 'What Happens When Your Cargo Arrives',
        body: 'When a vessel or aircraft arrives at the port, the carrier submits an arrival manifest to customs — a list of all cargo on board. Your goods are in a bonded (customs-controlled) area. You have a limited time window — typically 3–7 days for sea freight, 24–48 hours for air freight — to begin the customs clearance process before storage charges start accumulating. Your customs broker (also called a customs agent or clearing agent) files an import declaration on your behalf. In most countries, this is done electronically through a national single window system: ASYCUDA World (used in 100+ developing countries), China\'s ECIQ system, UAE\'s MIRSAL 2 system, EU\'s customs single window, US Customs\' ACE system, or UK\'s CHIEF/CDS system.',
      },
      {
        heading: 'Documents Required for Import Customs Clearance',
        body: 'The specific documents required vary by country and commodity, but the standard set for most commercial imports includes: (1) Commercial Invoice — must show seller and buyer details, description of goods, HS code (if known), quantity, unit price, total value, currency, country of origin, and Incoterms. (2) Packing List — itemized list of all packages showing dimensions, gross weight, net weight, and marks/numbers. (3) Bill of Lading (ocean) or Air Waybill (air) — the transport document issued by the carrier proving the cargo is consigned to you. (4) Certificate of Origin — proves where the goods were manufactured, required for preferential duty rates under free trade agreements. Common forms: Form A (GSP), EUR.1 (EU FTAs), FORM D (ASEAN). (5) Customs Import Declaration — filed by your broker, either the standard IM4 declaration or equivalent. Additional documents that may be required: Import Permit or License (for regulated goods), Phytosanitary Certificate (for plants and agricultural products), Health Certificate (for food and food contact materials), MSDS/SDS (for chemicals), Conformity Certificate (for products subject to standards requirements), and Fumigation Certificate (often required for wood packaging).',
      },
      {
        heading: 'HS Codes: The Foundation of Customs Classification',
        body: 'The Harmonized System (HS) code is a 6-digit international product classification code developed by the World Customs Organization (WCO). Every product that crosses an international border must be classified under an HS code. Countries add additional digits to create country-specific tariff codes — 8 digits in the EU (CN code), 10 digits in the US (HTS code), 8 digits in the UAE (GCC tariff code). The HS code determines: the applicable import duty rate, whether the goods require an import permit, whether they are subject to anti-dumping duties, whether they qualify for preferential rates under an FTA, and what statistical category the import falls into. Getting the HS code wrong — even by one digit — can result in the wrong duty rate being applied (which may mean underpaying and facing a penalty, or overpaying and losing margin). Example: earphones classified as 8518.30 (HS for headphones) have a different duty rate than those classified as 8517.62 (HS for network communication devices) — a common classification dispute for wireless earbuds with Bluetooth connectivity.',
      },
      {
        heading: 'How Customs Duty is Calculated',
        body: 'Import duties are calculated as a percentage of the customs value of the goods. Most countries use CIF value (Cost + Insurance + Freight) as the customs valuation basis — Article 8 of the WTO Customs Valuation Agreement. Some countries, including the US, use FOB value. The duty rate is determined by the HS code and the country of origin. Example: Importing a 40ft container of wooden furniture (HS 9403.60) from China to the UK. CIF value: £35,000. UK duty rate for 9403.60 from China: 6.7% (as of 2026). Duty: £35,000 × 6.7% = £2,345. UK VAT on import: 20% × (£35,000 + £2,345) = £7,469. Total tax to pay before release: £9,814. Anti-dumping duties (ADD) and countervailing duties (CVD) are additional duties on top of the standard rate, applied to specific products from specific countries found to be dumped or subsidized. China-origin goods face significant ADD in the US and EU on product categories ranging from solar panels to steel to tires.',
      },
      {
        heading: 'Free Trade Agreements and Preferential Duty Rates',
        body: 'If your supplier is in a country that has a free trade agreement (FTA) with your import country, you may be eligible for a reduced or zero duty rate — but only if you have the correct proof of origin. Key FTAs to know: EU-UK Trade and Cooperation Agreement (TCA) — zero tariffs on qualifying goods with UK or EU origin. GCC-Singapore FTA — reduced tariffs on Singapore-origin goods entering UAE/Saudi/Kuwait/Bahrain/Qatar/Oman. ASEAN FTA — reduced tariffs among ASEAN member states (Singapore, Malaysia, Thailand, Indonesia, Vietnam, Philippines, Brunei, Cambodia, Laos, Myanmar). CPTPP — comprehensive agreement covering Canada, Australia, New Zealand, Japan, Singapore, Malaysia, Vietnam, Chile, Peru, Mexico, and Brunei. To claim FTA rates, you need a Certificate of Origin issued by an authorized body in the exporting country (Chamber of Commerce, customs authority) or a supplier\'s Declaration of Origin for smaller shipments. The customs authority in the importing country can request verification of origin claims — if the claim is found to be incorrect, you pay back duties plus penalties.',
      },
      {
        heading: 'The Customs Examination Process',
        body: 'Not all shipments are physically inspected by customs. Most countries use a risk-based selectivity system that assigns declarations to one of several channels: Green Channel (automatic release): the declaration is accepted without physical inspection or document review. Approximately 70–85% of declarations in efficient customs administrations go through this channel. Yellow Channel (documentary check): customs officers review the import documents without physically opening the cargo. Red Channel (physical examination): customs officers open and inspect the cargo. This may be a random selection, a response to intelligence about the shipment, or a result of discrepancies in the declaration. Blue Channel or Post-Clearance Audit: goods are released but the importer is subject to a post-clearance audit of their books and records. Physical examinations typically add 1–3 days to clearance time. If discrepancies are found — undeclared goods, mislabeled quantities, incorrect HS codes — customs can issue penalties, confiscate goods, or refer the matter for criminal investigation.',
      },
      {
        heading: 'Release and Duty Payment',
        body: 'Once customs approves the declaration (all channels cleared), you must pay any outstanding duties and taxes before the goods are released. In most countries, you can pay through the electronic customs system by bank transfer, direct debit, or credit/debit card. Many importers use a customs duty deferment account (available in the UK, EU, and elsewhere) which allows monthly payment of accumulated duties rather than per-shipment payment — useful for cash flow management on high-volume importers. After payment is confirmed, customs issues an Out of Charge notice (or equivalent) which authorizes the port or warehouse to release the goods to you or your carrier. The release document must be presented to the terminal before the cargo is loaded onto a delivery truck.',
      },
      {
        heading: 'Common Customs Delays and How to Avoid Them',
        body: 'The most common reasons for customs delays: (1) Incomplete or incorrect commercial invoice — missing HS codes, incorrect values, vague descriptions like "machine parts" instead of specific descriptions. Solution: ensure your supplier uses accurate, detailed descriptions and the correct HS code. (2) Missing import permit — regulated goods (food, drugs, chemicals, weapons, electronics requiring type approval) require permits obtained before shipment arrives. Solution: know your product\'s regulatory requirements before placing the order. (3) Certificate of Origin missing or incorrect — if claiming FTA rates, the certificate must be in the correct format and signed by authorized body. (4) Value understatement — customs databases have benchmark CIF values for common products; declared values significantly below benchmarks trigger examination. Solution: declare the genuine transaction value and be prepared to provide proof (purchase order, bank transfer records). (5) Prohibited or restricted goods — know your destination country\'s import restrictions before shipping.',
      },
      {
        heading: 'How to Work with a Customs Broker',
        body: 'A licensed customs broker (also called a customs agent or freight forwarder with customs capability) files import declarations on your behalf. Choosing the right broker is critical. Look for: a license from the relevant customs authority, experience with your specific commodity and trade lane, technology capability (electronic filing, shipment tracking), transparent fee structure (avoid brokers who charge separately for every small disbursement without disclosure), and responsiveness — delays in getting answers from your broker translate directly to demurrage charges. Brief your broker thoroughly the first time you import a new product: provide the HS code if you know it, a detailed technical description, the country of manufacture, the invoice value, and any supporting certificates. Building a long-term relationship with one or two trusted brokers is far more effective than shopping for the cheapest rate on each shipment — a good broker knows your business, anticipates issues, and advocates for you with customs authorities.',
      },
      {
        heading: 'Tracking Your Shipment Through Customs',
        body: 'You can track your cargo\'s progress through customs in real time using your bill of lading number or container number on Trackora. When a shipment arrives at port, the tracking timeline will show events such as: Vessel Arrived, Discharged from Vessel, Cargo Received at Terminal, Customs Entry Filed, Customs Cleared, Available for Pickup, Cargo Gated Out. If your cargo remains in Customs Hold or Examination status for more than 48 hours without explanation, contact your customs broker immediately. Prolonged customs holds generate demurrage charges at the port or terminal — typically $50–$150/day for a 20ft container and $100–$250/day for a 40ft container. The faster you identify and resolve the cause of a customs hold, the lower your total cost.',
      },
    ],
  },
  {
    slug: 'container-types-explained',
    title: 'Container Types Explained: 20ft, 40ft, Reefer, Open Top and More',
    date: '2026-06-13',
    readTime: '9 min read',
    excerpt: 'Choosing the wrong container type can damage your cargo or cost you thousands in inefficiency. This guide covers every standard container type, their dimensions, and when to use each one.',
    seo: {
      title: 'Shipping Container Types Explained: 20ft, 40ft, Reefer, Open Top | Trackora',
      description: 'Complete guide to shipping container types: 20ft GP, 40ft GP, 40ft High Cube, Reefer, Open Top, Flat Rack, Tank containers. Dimensions, capacities, and when to use each type.',
    },
    sections: [
      {
        body: 'The global shipping industry runs on standardized steel boxes — but those boxes come in far more varieties than most shippers realize. Choosing the wrong container type can mean cargo that does not fit, freight that arrives damaged because temperature control was not specified, or paying for a full container when you needed an open-top for over-height cargo. This guide covers every standard container type in active use, with exact dimensions, typical use cases, and cost considerations.',
      },
      {
        heading: '20ft General Purpose (20ft GP): The Workhorse of Global Trade',
        body: 'The 20ft General Purpose container, also called a 20ft Dry Van, is the standard unit of global trade — so standard that the term TEU (Twenty-foot Equivalent Unit) is the universal measure of container shipping capacity. Exterior dimensions: 20ft (6.058m) long × 8ft (2.438m) wide × 8ft 6in (2.591m) high. Interior dimensions: approximately 5.898m × 2.350m × 2.393m. Maximum payload: approximately 21,700 kg. Usable capacity: approximately 33 CBM. Best for: dense, heavy cargo that would fill the weight limit before filling the volume — such as heavy machinery, metallic goods, canned goods, chemicals, and construction materials. Not ideal for lightweight, bulky goods where you would hit the volume limit before the weight limit. A 20ft container is the most widely available container type at ports worldwide and generally the easiest to place on short notice.',
      },
      {
        heading: '40ft General Purpose (40ft GP): Twice the Volume, Not Double the Cost',
        body: 'The 40ft GP container is exactly twice the length of a 20ft container and is the most common choice for most commercial shippers. Exterior dimensions: 40ft (12.192m) long × 8ft (2.438m) wide × 8ft 6in (2.591m) high. Interior dimensions: approximately 12.030m × 2.350m × 2.393m. Maximum payload: approximately 26,500 kg. Usable capacity: approximately 67 CBM. While the volume is double a 20ft container, the ocean freight rate for a 40ft container is typically only 1.4–1.7× the rate for a 20ft container on the same route — making a 40ft container significantly more economical on a per-CBM basis for most cargo. The 40ft GP is the standard choice for most consumer goods: clothing, electronics, household goods, automotive parts, and any cargo where volume rather than weight is the limiting factor.',
      },
      {
        heading: '40ft High Cube (40ft HC): Extra Headroom for Bulky Cargo',
        body: 'The 40ft High Cube container is identical to the standard 40ft GP except for one key difference: it is 9ft 6in (2.896m) tall instead of the standard 8ft 6in. This provides an extra 30cm of internal height, increasing the usable capacity from approximately 67 CBM to approximately 76 CBM. The 40ft HC has become the de facto standard for most full container load (FCL) shipments over the past decade — many carriers now offer primarily High Cube containers on major trade lanes. Best for: furniture, mattresses, large appliances, clothing on hangers (using garment rails), automotive parts, and any lightweight but bulky cargo that benefits from the additional height. The 40ft HC is increasingly available at standard 40ft pricing on most routes, though some carriers and ports charge a small premium.',
      },
      {
        heading: 'Reefer Containers: Controlled Temperature for Perishables',
        body: 'Reefer containers (refrigerated containers) are standard container units with built-in refrigeration equipment that maintains a set temperature throughout the voyage. Available in 20ft and 40ft lengths. Temperature range: most modern reefer containers maintain temperatures from -30°C to +30°C, making them suitable for frozen meat (-18°C), fresh fruit (+2°C to +8°C), pharmaceuticals (+2°C to +8°C or +15°C to +25°C), and even some chemicals requiring temperature control. Key specifications: the refrigeration unit is powered by the ship\'s electrical supply at sea (reefer plugs on the vessel) and by a generator or shore power at the port. The shipper must specify the required set-point temperature, ventilation settings, and humidity (for fresh produce) in the shipping instructions. Reefer freight rates are typically 2.5–4× the standard dry container rate for the same route, reflecting the cost of the refrigeration unit, energy consumption, and more intensive monitoring. Reefer containers require reefer plugs at both the origin and destination ports — verify availability before booking.',
      },
      {
        heading: 'Open Top Containers: For Over-Height Cargo',
        body: 'Open Top containers have no rigid roof — instead, they use removable or rolling bows (arches) and a tarpaulin cover. This allows loading from the top using a crane, which is essential for cargo that exceeds the internal height of a standard container. Standard dimensions match the 20ft or 40ft GP, but the open roof allows cargo to exceed the standard 2.39m internal height limit — subject to vessel and port height restrictions, over-height cargo can often be 2.5–3.5m above the container floor. Common cargo: machinery with tall profiles, steel coils, marble slabs, construction equipment, and any cargo where the only practical loading method is crane from above. Open Top containers attract a premium of typically $200–$600 over standard dry rates, plus additional charges for tarpaulin, crane lifts, and over-height surcharges from the carrier.',
      },
      {
        heading: 'Flat Rack Containers: For Over-Width or Over-Length Cargo',
        body: 'Flat Rack containers are platforms with end walls but no side walls or roof. They allow cargo that is over-width, over-length, or irregular in shape to be secured to the platform and loaded onto the vessel. Collapsible Flat Racks (also called flatrack or FR) can have their end walls folded down for more compact stowage when empty. Common dimensions: 20ft FR (approximately 5.94m × 2.35m platform) and 40ft FR (approximately 12.13m × 2.12m platform). Typical over-dimension allowances: cargo can overhang the sides by up to 30cm per side and can exceed the standard height. Common cargo: yachts, boats, large vehicles, construction machinery (excavators, cranes), industrial boilers, and any cargo that cannot fit inside a standard container due to its shape. Flat Rack shipments require specialized securing (lashing and blocking by certified riggers), detailed stowage plans, and prior approval from the carrier. Rates are typically 2–4× standard container rates plus lashing charges.',
      },
      {
        heading: 'Tank Containers: For Liquids and Gases',
        body: 'Tank containers are cylindrical pressure vessels mounted within a standard ISO frame. They are designed for transporting liquids, gases, and powders in bulk. Standard capacity: 17,500–26,000 liters. Minimum fill requirement: typically 80% to prevent cargo from sloshing and creating instability. Tank containers are used for: food-grade liquids (edible oils, juice concentrates, wine, alcohol), chemicals (solvents, adhesives, resins), hazardous liquids (acids, caustics, flammable liquids), and gases (propane, chlorine, ammonia in pressurized tanks). Tank containers must comply with UN portable tank instructions (T-codes) based on the hazard classification of the cargo. The shipper is responsible for cleaning the tank before and after use, which is handled by tank-cleaning depots and is typically the shipper\'s cost. Cleaning costs of $300–$800 per tank are common and must be factored into the total freight cost.',
      },
      {
        heading: 'LCL: Sharing a Container with Other Shippers',
        body: 'Less than Container Load (LCL) is not a separate container type — it is a shipping mode where your cargo occupies a portion of a container shared with other shippers\' goods. An LCL consolidation operator (consolidator or groupage agent) collects cargo from multiple shippers, packs it into a container at a Container Freight Station (CFS), and ships the consolidated container to the destination port, where it is deconsolidated at another CFS. LCL is economical for shipments of 1–10 CBM. Above 10–12 CBM, FCL in a 20ft container usually becomes more cost-effective. The additional handling at origin and destination CFS adds time (typically 3–5 days) and risk (more handling = more opportunity for damage). LCL shipments are quoted and tracked differently from FCL: you receive an LCL House Bill of Lading rather than a master Bill of Lading directly from the ocean carrier.',
      },
      {
        heading: 'How to Choose the Right Container for Your Cargo',
        body: 'Use this decision framework: (1) Calculate your cargo\'s CBM and weight. If CBM > 12 or weight > 15,000 kg, consider FCL. (2) Check if your cargo requires special handling: temperature-sensitive → Reefer; over-height → Open Top; over-width/length or irregular shape → Flat Rack; liquid bulk → Tank. (3) For standard dry cargo on FCL: if CBM is 28–45 CBM, use a 20ft container. If CBM is 45–70 CBM, use a 40ft GP or HC. The 40ft HC is usually the better choice for most cargo due to the extra volume at minimal additional cost. (4) For LCL: appropriate for 1–12 CBM of standard cargo without special requirements. (5) Always confirm container availability at your origin port before booking — equipment imbalances can cause delays and substitutions.',
      },
      {
        heading: 'Container Tracking by Type',
        body: 'Container numbers follow the same ISO 6346 format regardless of type, but the equipment category identifier (the 4th letter in the container number) distinguishes them: "U" is standard freight containers (GP, HC, Reefer, Open Top), "J" is detachable freight container equipment, "Z" is trailer and chassis. When tracking on Trackora, paste your full container number — the system auto-identifies the carrier from the owner code prefix and retrieves the full event timeline. For Reefer containers, some carriers provide additional monitoring data including temperature logs accessible through their proprietary portals.',
      },
    ],
  },
  {
    slug: 'how-to-read-commercial-invoice-import-export',
    title: 'How to Read a Commercial Invoice for Import and Export',
    date: '2026-06-14',
    readTime: '10 min read',
    excerpt: 'The commercial invoice is the most important document in international trade. Every field affects customs duties, VAT, and the legality of your shipment. This guide explains every section in plain language.',
    seo: {
      title: 'How to Read a Commercial Invoice for Import & Export | Trackora',
      description: 'Understand every field on a commercial invoice: seller/buyer details, HS codes, customs value, Incoterms, country of origin. Learn what customs authorities check and how to avoid costly errors.',
    },
    sections: [
      {
        body: 'The commercial invoice is the single most important document in international trade. It serves simultaneously as the customs valuation document (determining how much duty you pay), the legal record of the commercial transaction, the basis for marine insurance coverage, and the document banks use in letters of credit to release payment. A mistake on the commercial invoice — wrong value, vague product description, missing HS code — can result in customs delays, incorrect duty assessments, VAT errors, insurance claim denials, and banking disputes. This guide explains every field of a commercial invoice and what customs authorities and banks look for in each one.',
      },
      {
        heading: 'Seller Information (Shipper)',
        body: 'The seller section identifies the party sending the goods. It must include: full legal company name (as registered, not a trading name), complete registered address including city, state/province, country, and postal code, tax registration number (VAT number in the EU, GST number in Australia/India/Canada, TRN in UAE, EIN in the US), and contact details (phone, email). A common error is using the factory address instead of the seller\'s registered company address when these are different. Customs authorities cross-reference seller details against their databases of known exporters. Discrepancies between the declared seller and the actual exporter of record trigger queries and delays.',
      },
      {
        heading: 'Buyer Information (Consignee)',
        body: 'The buyer section identifies the party receiving and legally importing the goods. It must include the same level of detail as the seller section: full legal company name, complete address, and import registration or tax number. The "consignee" on the commercial invoice should match the consignee on the bill of lading exactly. Discrepancies between these two documents — even minor ones like "Ltd" vs "Limited" — can cause delays while customs seeks clarification. If goods are being shipped to a third party (not the buyer), such as when a trading company buys from a factory and sells to an end buyer, the commercial invoice should reflect the actual commercial transaction — the factory-to-trader transaction, not the trader-to-end-buyer transaction.',
      },
      {
        heading: 'Invoice Number, Date, and Currency',
        body: 'Every commercial invoice must have a unique invoice number. There is no international standard for numbering, but customs authorities use the invoice number to match documents and prevent duplicate filings. The invoice date establishes when the sale occurred — which affects exchange rate calculations for duty assessment in countries where duties are assessed in local currency. The currency must be clearly stated (USD, EUR, GBP, AED, etc.). Some countries require the invoice to also show the equivalent value in the local currency. When customs assesses duties in a currency different from the invoice currency, they apply the official exchange rate published by the central bank or customs authority on or around the import date.',
      },
      {
        heading: 'Country of Origin',
        body: 'The country of origin is where the goods were manufactured or substantially transformed — not where they are being shipped from. This distinction is critical. Electronics manufactured in China and shipped from Singapore are of Chinese origin. Fabric woven in India but dyed and cut into garments in Bangladesh may be of Bangladeshi origin under "substantial transformation" rules. Country of origin determines: the applicable duty rate (standard MFN rate vs preferential FTA rate vs punitive anti-dumping rate), whether goods are subject to import restrictions or embargoes, and the labeling requirements ("Made in...") for consumer goods. The origin must be stated for every line item, not just once at the top of the invoice if different items have different origins — which is common for multi-component products or consolidated shipments.',
      },
      {
        heading: 'HS Code (Harmonized System Code)',
        body: 'While not legally mandatory on all commercial invoices in every jurisdiction, including the HS code is strongly recommended and required by customs in many countries (including the UAE, India, Saudi Arabia, and China). The HS code is the international product classification code that determines the duty rate and regulatory treatment at the destination. Best practice: include the full 6-digit HS code (the universal level) on the invoice, and if known, the destination country\'s extended tariff code (8 or 10 digits). For multi-item invoices, each line item should have its own HS code. A forwarder or customs broker can help classify goods if you are unsure — getting this wrong can mean paying the wrong duty rate or triggering import permit requirements you did not anticipate.',
      },
      {
        heading: 'Product Description',
        body: 'The product description is one of the most commonly incorrectly completed fields on commercial invoices. Customs authorities need enough detail to verify the HS code classification, assess compliance with import regulations, and screen for prohibited goods. Insufficient descriptions — "machine parts," "clothing," "household items," "samples," or "electronics" — will result in an examination or query. Best practice: be specific. Instead of "clothing," write "women\'s polyester woven blouses, size S-XL." Instead of "machine parts," write "stainless steel ball bearings, 10mm diameter, for food processing machinery, HS 8482.10." Include: the technical name, material composition, intended use, model or part number if applicable, and any relevant certifications (CE marked, FDA registered). For textiles, state fiber content and construction (woven/knitted). For food, state species (for seafood), processing method, and any added ingredients.',
      },
      {
        heading: 'Quantity, Unit Price, and Total Value',
        body: 'The quantity must match the packing list exactly. Customs occasionally inspects to verify that the number of items declared matches what is physically present — discrepancies suggest either smuggling or administrative error. The unit price must reflect the actual transaction value — the price paid or payable for the goods. Undervaluing goods to reduce customs duty is fraud and is one of the most heavily targeted customs enforcement areas globally. Customs authorities have access to transaction databases showing typical values for most commodities — an invoice showing $2/kg for copper cables when the market price is $12/kg will be flagged immediately. Related-party transactions (between parent and subsidiary companies) require special handling: the value must be shown to be at arm\'s length or adjusted to an acceptable transfer pricing basis.',
      },
      {
        heading: 'Incoterms',
        body: 'The Incoterms stated on the commercial invoice establish who is responsible for freight and insurance costs, which determines the customs value calculation. Most countries use CIF (Cost + Insurance + Freight) as the basis for customs valuation. If the invoice is on FOB terms, customs will typically add an estimated freight and insurance cost to arrive at the CIF value. The Incoterms also determine who is the exporter of record in the origin country and who is the importer of record in the destination country — with corresponding customs compliance obligations. Always state the full Incoterm with the named place and the Incoterms version: "DAP Dubai, Incoterms 2020" rather than just "DAP Dubai."',
      },
      {
        heading: 'Shipping Marks and References',
        body: 'Shipping marks (also called marks and numbers) are the identifiers printed or stenciled on the packages themselves. They appear on the commercial invoice, packing list, and bill of lading and must match across all documents. Standard shipping marks include: the consignee\'s name or code, the port of destination, the shipment reference number, and the package count (e.g., "1/12" meaning package 1 of 12). When customs physically examines cargo, they verify that the shipping marks on the packages match the documents. Discrepancies raise questions about whether the declared cargo is actually in the packages. Also include references to the purchase order number, letter of credit number (if applicable), and any relevant contract numbers.',
      },
      {
        heading: 'Payment Terms and Bank Details',
        body: 'Payment terms (Net 30, 50% deposit/50% before shipment, Letter of Credit at sight, etc.) are stated on the invoice for the seller\'s records and may be required by the buyer\'s bank for import financing. If the transaction is under a Letter of Credit (LC), the commercial invoice must match the LC\'s requirements exactly — the buyer\'s name, description of goods, quantity, value, shipping ports, and presentation deadline must all conform precisely to the LC terms. Even a minor discrepancy (like "100 units" vs "one hundred units") constitutes a documentary discrepancy under the LC, which can result in the bank refusing payment until the discrepancy is waived or corrected. Bank details on the invoice (seller\'s IBAN, SWIFT/BIC) facilitate payment and are required for bank transfers. For high-value transactions, some buyers require the seller\'s bank to certify the invoice.',
      },
      {
        heading: 'Common Commercial Invoice Errors and How to Fix Them',
        body: 'The most common commercial invoice errors encountered in customs: (1) Value understatement — using a proforma value or sample value instead of the actual commercial price. Always use the real transaction value. (2) Vague product descriptions — "spare parts," "gifts," "samples." Always use specific technical descriptions. (3) Wrong or missing country of origin — particularly for goods assembled from multi-country components. (4) Incoterms inconsistency — stating EXW on the invoice but CIF on the bill of lading creates a contradiction customs must resolve. (5) Currency not specified — state USD, EUR, etc. explicitly. (6) Missing HS code where required — the UAE, India, and Saudi Arabia all require HS codes on commercial invoices. (7) Seller/buyer address incomplete — missing postal code, wrong country code. Use the Trackora Document Generator to create professionally formatted commercial invoices that include all required fields and avoid these common errors.',
      },
    ],
  },
]

