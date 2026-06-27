export type FreightType = 'air' | 'sea' | 'land' | 'express'
export type ShipmentStatus = 'in_transit' | 'delivered' | 'customs' | 'delayed' | 'picked_up' | 'out_for_delivery'

export interface TimelineEvent {
  time: string
  date: string
  status: string
  location: string
  description: string
  type: 'completed' | 'current' | 'upcoming'
}

export interface Shipment {
  id: string
  trackingNumber: string
  carrier: string
  carrierLogo?: string
  freightType: FreightType
  status: ShipmentStatus
  statusLabel: string
  origin: { city: string; country: string; code: string; lat: number; lng: number }
  destination: { city: string; country: string; code: string; lat: number; lng: number }
  currentLocation: { city: string; country: string; lat: number; lng: number }
  estimatedDelivery: string
  aiEta: string
  etaConfidence: number
  weight: string
  dimensions: string
  pieces: number
  service: string
  carbonKg: number
  timeline: TimelineEvent[]
  waypoints: Array<{ lat: number; lng: number; label: string }>
  delayRisk: 'low' | 'medium' | 'high'
  delayReason?: string
  dangerousGoods?: boolean
}

const SHIPMENTS: Record<string, Shipment> = {
  '1Z999AA10123456784': {
    id: '1Z999AA10123456784',
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS',
    freightType: 'express',
    status: 'in_transit',
    statusLabel: 'In Transit',
    origin: { city: 'New York', country: 'USA', code: 'JFK', lat: 40.6413, lng: -73.7781 },
    destination: { city: 'London', country: 'UK', code: 'LHR', lat: 51.4700, lng: -0.4543 },
    currentLocation: { city: 'Reykjavik Hub', country: 'Iceland', lat: 64.1355, lng: -21.8954 },
    estimatedDelivery: 'May 25, 2026',
    aiEta: 'May 25, 2026 • 14:30 BST',
    etaConfidence: 92,
    weight: '2.4 kg',
    dimensions: '30 × 20 × 15 cm',
    pieces: 1,
    service: 'UPS Worldwide Express',
    carbonKg: 12.4,
    delayRisk: 'low',
    timeline: [
      { date: 'May 22', time: '09:15', status: 'Picked Up', location: 'New York, USA', description: 'Package collected from sender', type: 'completed' },
      { date: 'May 22', time: '18:40', status: 'Departed Origin', location: 'JFK International Airport', description: 'Departed on flight UA0182', type: 'completed' },
      { date: 'May 23', time: '04:22', status: 'In Transit', location: 'Reykjavik Hub, Iceland', description: 'Transiting through intermediate hub', type: 'current' },
      { date: 'May 24', time: '07:00', status: 'Arriving Destination', location: 'London Heathrow, UK', description: 'Expected to arrive', type: 'upcoming' },
      { date: 'May 25', time: '14:30', status: 'Out for Delivery', location: 'London, UK', description: 'Expected delivery window', type: 'upcoming' },
    ],
    waypoints: [
      { lat: 40.6413, lng: -73.7781, label: 'New York' },
      { lat: 64.1355, lng: -21.8954, label: 'Reykjavik' },
      { lat: 51.4700, lng: -0.4543, label: 'London' },
    ],
  },
  'MAD3456789': {
    id: 'MAD3456789',
    trackingNumber: 'MAD3456789',
    carrier: 'Maersk',
    freightType: 'sea',
    status: 'in_transit',
    statusLabel: 'At Sea',
    origin: { city: 'Shanghai', country: 'China', code: 'CNSHA', lat: 31.2304, lng: 121.4737 },
    destination: { city: 'Rotterdam', country: 'Netherlands', code: 'NLRTM', lat: 51.9225, lng: 4.4792 },
    currentLocation: { city: 'Indian Ocean', country: 'At Sea', lat: 10.0, lng: 72.0 },
    estimatedDelivery: 'Jun 12, 2026',
    aiEta: 'Jun 11, 2026 • ETA shifted 1 day earlier',
    etaConfidence: 84,
    weight: '24,500 kg',
    dimensions: '40ft Container × 1',
    pieces: 1,
    service: 'Maersk Line FCL',
    carbonKg: 1840,
    delayRisk: 'medium',
    delayReason: 'Suez Canal slight congestion — monitoring',
    timeline: [
      { date: 'May 5', time: '08:00', status: 'Gate In', location: 'Yangshan Port, Shanghai', description: 'Container received at port', type: 'completed' },
      { date: 'May 8', time: '14:30', status: 'Vessel Departed', location: 'Shanghai, China', description: 'Departed on MV Maersk Eindhoven', type: 'completed' },
      { date: 'May 16', time: '10:00', status: 'Port Call', location: 'Singapore, SGP', description: 'Brief port call completed', type: 'completed' },
      { date: 'May 24', time: '—', status: 'At Sea', location: 'Indian Ocean', description: 'Vessel cruising at 19 knots', type: 'current' },
      { date: 'Jun 3', time: '06:00', status: 'Suez Canal Transit', location: 'Suez Canal, Egypt', description: 'Expected canal transit', type: 'upcoming' },
      { date: 'Jun 12', time: '08:00', status: 'Port Arrival', location: 'Rotterdam, Netherlands', description: 'Expected terminal arrival', type: 'upcoming' },
    ],
    waypoints: [
      { lat: 31.2304, lng: 121.4737, label: 'Shanghai' },
      { lat: 1.3521, lng: 103.8198, label: 'Singapore' },
      { lat: 10.0, lng: 72.0, label: 'Indian Ocean' },
      { lat: 30.0, lng: 32.5, label: 'Suez' },
      { lat: 51.9225, lng: 4.4792, label: 'Rotterdam' },
    ],
  },
  'MAWB001-12345678': {
    id: 'MAWB001-12345678',
    trackingNumber: 'MAWB001-12345678',
    carrier: 'Lufthansa Cargo',
    freightType: 'air',
    status: 'customs',
    statusLabel: 'Customs Clearance',
    origin: { city: 'Frankfurt', country: 'Germany', code: 'FRA', lat: 50.0333, lng: 8.5706 },
    destination: { city: 'Dubai', country: 'UAE', code: 'DXB', lat: 25.2532, lng: 55.3657 },
    currentLocation: { city: 'Dubai Airport', country: 'UAE', lat: 25.2532, lng: 55.3657 },
    estimatedDelivery: 'May 24, 2026',
    aiEta: 'May 24, 2026 • 18:00 GST (customs delay)',
    etaConfidence: 71,
    weight: '485 kg',
    dimensions: 'Multiple pieces',
    pieces: 8,
    service: 'Lufthansa td.Flash',
    carbonKg: 485,
    delayRisk: 'high',
    delayReason: 'Additional documentation requested by UAE customs',
    timeline: [
      { date: 'May 22', time: '11:00', status: 'Accepted', location: 'Frankfurt Airport, Germany', description: 'Shipment accepted by Lufthansa Cargo', type: 'completed' },
      { date: 'May 22', time: '23:15', status: 'Departed', location: 'Frankfurt Airport (FRA)', description: 'Departed on LH8401', type: 'completed' },
      { date: 'May 23', time: '07:30', status: 'Arrived', location: 'Dubai Airport (DXB)', description: 'Arrived at destination airport', type: 'completed' },
      { date: 'May 23', time: '09:00', status: 'Customs Hold', location: 'Dubai Customs, UAE', description: 'Additional documents requested', type: 'current' },
      { date: 'May 24', time: '18:00', status: 'Delivered', location: 'Dubai, UAE', description: 'Expected after clearance', type: 'upcoming' },
    ],
    waypoints: [
      { lat: 50.0333, lng: 8.5706, label: 'Frankfurt' },
      { lat: 25.2532, lng: 55.3657, label: 'Dubai' },
    ],
  },
  'MSKU7620114': {
    id: 'MSKU7620114',
    trackingNumber: 'MSKU7620114',
    carrier: 'MSC',
    freightType: 'sea',
    status: 'in_transit',
    statusLabel: 'In Transit',
    origin: { city: 'Jebel Ali', country: 'UAE', code: 'AEJEA', lat: 24.9857, lng: 55.0272 },
    destination: { city: 'Felixstowe', country: 'UK', code: 'GBFXT', lat: 51.9576, lng: 1.3513 },
    currentLocation: { city: 'Mediterranean Sea', country: 'At Sea', lat: 36.5, lng: 15.0 },
    estimatedDelivery: 'Jul 14, 2026',
    aiEta: 'Jul 14, 2026 • On schedule',
    etaConfidence: 88,
    weight: '21,800 kg',
    dimensions: '40ft HC Container × 1',
    pieces: 1,
    service: 'MSC Standard FCL',
    carbonKg: 1620,
    delayRisk: 'low',
    timeline: [
      { date: 'Jun 20', time: '07:00', status: 'Gate In', location: 'Jebel Ali Port, UAE', description: 'Container received at terminal', type: 'completed' },
      { date: 'Jun 23', time: '16:00', status: 'Vessel Departed', location: 'Jebel Ali, UAE', description: 'Departed on MSC Beatrice', type: 'completed' },
      { date: 'Jun 28', time: '11:00', status: 'Port Call', location: 'Port Said, Egypt', description: 'Port call and Suez transit completed', type: 'completed' },
      { date: 'Jul 2', time: '—', status: 'At Sea', location: 'Mediterranean Sea', description: 'Vessel cruising at 18 knots', type: 'current' },
      { date: 'Jul 8', time: '08:00', status: 'Port Call', location: 'Algeciras, Spain', description: 'Expected transshipment hub', type: 'upcoming' },
      { date: 'Jul 14', time: '06:00', status: 'Port Arrival', location: 'Felixstowe, UK', description: 'Expected terminal arrival', type: 'upcoming' },
    ],
    waypoints: [
      { lat: 24.9857, lng: 55.0272, label: 'Jebel Ali' },
      { lat: 30.0, lng: 32.5, label: 'Suez' },
      { lat: 36.5, lng: 15.0, label: 'Mediterranean' },
      { lat: 36.1408, lng: -5.4536, label: 'Algeciras' },
      { lat: 51.9576, lng: 1.3513, label: 'Felixstowe' },
    ],
  },
  '17622536813': {
    id: '17622536813',
    trackingNumber: '176-22536813',
    carrier: 'Emirates SkyCargo',
    freightType: 'air',
    status: 'in_transit',
    statusLabel: 'In Transit',
    origin: { city: 'Dubai', country: 'UAE', code: 'DXB', lat: 25.2532, lng: 55.3657 },
    destination: { city: 'Chicago', country: 'USA', code: 'ORD', lat: 41.9742, lng: -87.9073 },
    currentLocation: { city: 'London Heathrow Hub', country: 'UK', lat: 51.4700, lng: -0.4543 },
    estimatedDelivery: 'Jun 28, 2026',
    aiEta: 'Jun 28, 2026 • 09:15 CDT',
    etaConfidence: 94,
    weight: '312 kg',
    dimensions: 'Multiple pieces',
    pieces: 5,
    service: 'Emirates SkyCargo Priority',
    carbonKg: 312,
    delayRisk: 'low',
    timeline: [
      { date: 'Jun 26', time: '14:00', status: 'Accepted', location: 'Dubai Airport (DXB)', description: 'Shipment accepted by Emirates SkyCargo', type: 'completed' },
      { date: 'Jun 26', time: '22:30', status: 'Departed', location: 'Dubai Airport (DXB)', description: 'Departed on EK201', type: 'completed' },
      { date: 'Jun 27', time: '04:15', status: 'Transit Hub', location: 'London Heathrow (LHR)', description: 'Transiting through Heathrow hub', type: 'current' },
      { date: 'Jun 27', time: '09:00', status: 'Departed', location: 'London Heathrow (LHR)', description: 'Expected departure to Chicago', type: 'upcoming' },
      { date: 'Jun 28', time: '09:15', status: 'Arrived', location: "Chicago O'Hare (ORD)", description: 'Expected arrival + customs clearance', type: 'upcoming' },
    ],
    waypoints: [
      { lat: 25.2532, lng: 55.3657, label: 'Dubai' },
      { lat: 51.4700, lng: -0.4543, label: 'London' },
      { lat: 41.9742, lng: -87.9073, label: 'Chicago' },
    ],
  },
  'CNTR8872341': {
    id: 'CNTR8872341',
    trackingNumber: 'CNTR8872341',
    carrier: 'DHL Freight',
    freightType: 'land',
    status: 'out_for_delivery',
    statusLabel: 'Out for Delivery',
    origin: { city: 'Warsaw', country: 'Poland', code: 'WAW', lat: 52.2297, lng: 21.0122 },
    destination: { city: 'Berlin', country: 'Germany', code: 'BER', lat: 52.5200, lng: 13.4050 },
    currentLocation: { city: 'Frankfurt (Oder)', country: 'Germany', lat: 52.3416, lng: 14.5490 },
    estimatedDelivery: 'May 24, 2026',
    aiEta: 'Today • 15:45 CET',
    etaConfidence: 97,
    weight: '3,200 kg',
    dimensions: 'Europallets × 4',
    pieces: 4,
    service: 'DHL Freight Eurapid',
    carbonKg: 48,
    delayRisk: 'low',
    timeline: [
      { date: 'May 23', time: '06:00', status: 'Picked Up', location: 'Warsaw, Poland', description: 'Collected from warehouse', type: 'completed' },
      { date: 'May 23', time: '08:30', status: 'Departed', location: 'Warsaw Cross-Dock', description: 'Left Warsaw facility', type: 'completed' },
      { date: 'May 23', time: '14:00', status: 'Border Crossing', location: 'Frankfurt (Oder), DE-PL Border', description: 'Cleared EU internal border', type: 'completed' },
      { date: 'May 24', time: '07:00', status: 'Out for Delivery', location: 'Berlin DHL Hub', description: 'Loaded on delivery vehicle', type: 'current' },
      { date: 'May 24', time: '15:45', status: 'Delivered', location: 'Berlin, Germany', description: 'Expected delivery', type: 'upcoming' },
    ],
    waypoints: [
      { lat: 52.2297, lng: 21.0122, label: 'Warsaw' },
      { lat: 52.3416, lng: 14.5490, label: 'Border' },
      { lat: 52.5200, lng: 13.4050, label: 'Berlin' },
    ],
  },
}

export function getShipment(id: string): Shipment | null {
  const normalized = id.trim().toUpperCase()
  // Try exact match first
  if (SHIPMENTS[id]) return SHIPMENTS[id]
  // Try normalized (strip dashes for AWB-style numbers like 176-22536813)
  const stripped = normalized.replace(/-/g, '')
  if (SHIPMENTS[stripped]) return SHIPMENTS[stripped]
  // Try matching trackingNumber field
  const found = Object.values(SHIPMENTS).find(
    s => s.trackingNumber.toUpperCase() === normalized || s.trackingNumber.replace(/-/g, '').toUpperCase() === stripped
  )
  return found || null
}

export function getAllShipments(): Shipment[] {
  return Object.values(SHIPMENTS)
}
