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
]
