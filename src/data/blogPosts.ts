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
]
