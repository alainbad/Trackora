export type DetentionCarrier = 'Maersk' | 'MSC' | 'CMACGM' | 'HapagLloyd' | 'COSCO' | 'Evergreen' | 'ONE' | 'YangMing' | 'ZIM'
export type DetentionRegion = 'Europe' | 'NorthAmerica' | 'MiddleEast' | 'AsiaPacific' | 'Africa' | 'SouthAmerica'
export type ContainerType = '20GP' | '40GP' | '40HC' | '20RF' | '40RF'

export const CARRIER_LABELS: Record<DetentionCarrier, string> = {
  Maersk: 'Maersk',
  MSC: 'MSC',
  CMACGM: 'CMA CGM',
  HapagLloyd: 'Hapag-Lloyd',
  COSCO: 'COSCO',
  Evergreen: 'Evergreen',
  ONE: 'Ocean Network Express (ONE)',
  YangMing: 'Yang Ming',
  ZIM: 'ZIM',
}

export const CONTAINER_LABELS: Record<ContainerType, string> = {
  '20GP': "20' Standard (GP)",
  '40GP': "40' Standard (GP)",
  '40HC': "40' High Cube (HC)",
  '20RF': "20' Reefer",
  '40RF': "40' Reefer",
}

export const REGION_LABELS: Record<DetentionRegion, string> = {
  Europe: 'Europe',
  NorthAmerica: 'North America',
  MiddleEast: 'Middle East & Gulf',
  AsiaPacific: 'Asia Pacific',
  Africa: 'Africa',
  SouthAmerica: 'South America',
}

export interface TierRate { upToDay: number; dailyRateUSD: number }
export interface DetentionRate { freeDays: number; tiers: TierRate[] }

// DETENTION_RATES[carrier][region][containerType]
export const DETENTION_RATES: Record<DetentionCarrier, Record<DetentionRegion, Record<ContainerType, DetentionRate>>> = {
  Maersk: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 22 }, { upToDay: 17, dailyRateUSD: 45 }, { upToDay: Infinity, dailyRateUSD: 90 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 30 }, { upToDay: 17, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 30 }, { upToDay: 17, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 54 }, { upToDay: Infinity, dailyRateUSD: 108 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 36 }, { upToDay: 17, dailyRateUSD: 72 }, { upToDay: Infinity, dailyRateUSD: 144 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 36 }, { upToDay: 17, dailyRateUSD: 72 }, { upToDay: Infinity, dailyRateUSD: 144 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 72 }, { upToDay: Infinity, dailyRateUSD: 144 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 72 }, { upToDay: Infinity, dailyRateUSD: 144 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 19 }, { upToDay: 19, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 22 }, { upToDay: 17, dailyRateUSD: 45 }, { upToDay: Infinity, dailyRateUSD: 90 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 30 }, { upToDay: 17, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 30 }, { upToDay: 17, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 28 }, { upToDay: 28, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 113 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 38 }, { upToDay: 28, dailyRateUSD: 75 }, { upToDay: Infinity, dailyRateUSD: 150 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 38 }, { upToDay: 28, dailyRateUSD: 75 }, { upToDay: Infinity, dailyRateUSD: 150 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 75 }, { upToDay: Infinity, dailyRateUSD: 150 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 75 }, { upToDay: Infinity, dailyRateUSD: 150 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 45 }, { upToDay: Infinity, dailyRateUSD: 90 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 30 }, { upToDay: 19, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 30 }, { upToDay: 19, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
    },
  },

  MSC: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 20 }, { upToDay: 17, dailyRateUSD: 42 }, { upToDay: Infinity, dailyRateUSD: 85 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 28 }, { upToDay: 17, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 28 }, { upToDay: 17, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 24 }, { upToDay: 17, dailyRateUSD: 50 }, { upToDay: Infinity, dailyRateUSD: 100 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 33 }, { upToDay: 17, dailyRateUSD: 67 }, { upToDay: Infinity, dailyRateUSD: 134 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 33 }, { upToDay: 17, dailyRateUSD: 67 }, { upToDay: Infinity, dailyRateUSD: 134 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 67 }, { upToDay: Infinity, dailyRateUSD: 134 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 67 }, { upToDay: Infinity, dailyRateUSD: 134 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 17 }, { upToDay: 19, dailyRateUSD: 36 }, { upToDay: Infinity, dailyRateUSD: 72 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 24 }, { upToDay: 19, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 95 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 24 }, { upToDay: 19, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 95 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 95 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 95 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 20 }, { upToDay: 17, dailyRateUSD: 42 }, { upToDay: Infinity, dailyRateUSD: 85 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 28 }, { upToDay: 17, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 28 }, { upToDay: 17, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 25 }, { upToDay: 28, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 105 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 35 }, { upToDay: 28, dailyRateUSD: 70 }, { upToDay: Infinity, dailyRateUSD: 140 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 35 }, { upToDay: 28, dailyRateUSD: 70 }, { upToDay: Infinity, dailyRateUSD: 140 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 70 }, { upToDay: Infinity, dailyRateUSD: 140 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 70 }, { upToDay: Infinity, dailyRateUSD: 140 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 20 }, { upToDay: 19, dailyRateUSD: 42 }, { upToDay: Infinity, dailyRateUSD: 85 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 28 }, { upToDay: 19, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 28 }, { upToDay: 19, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 56 }, { upToDay: Infinity, dailyRateUSD: 112 }] },
    },
  },

  CMACGM: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 22 }, { upToDay: 17, dailyRateUSD: 46 }, { upToDay: Infinity, dailyRateUSD: 92 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 55 }, { upToDay: Infinity, dailyRateUSD: 110 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 37 }, { upToDay: 17, dailyRateUSD: 74 }, { upToDay: Infinity, dailyRateUSD: 149 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 37 }, { upToDay: 17, dailyRateUSD: 74 }, { upToDay: Infinity, dailyRateUSD: 149 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 74 }, { upToDay: Infinity, dailyRateUSD: 149 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 74 }, { upToDay: Infinity, dailyRateUSD: 149 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 19 }, { upToDay: 19, dailyRateUSD: 39 }, { upToDay: Infinity, dailyRateUSD: 78 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 53 }, { upToDay: Infinity, dailyRateUSD: 105 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 53 }, { upToDay: Infinity, dailyRateUSD: 105 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 53 }, { upToDay: Infinity, dailyRateUSD: 105 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 53 }, { upToDay: Infinity, dailyRateUSD: 105 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 22 }, { upToDay: 17, dailyRateUSD: 46 }, { upToDay: Infinity, dailyRateUSD: 92 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 28 }, { upToDay: 28, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 115 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 39 }, { upToDay: 28, dailyRateUSD: 78 }, { upToDay: Infinity, dailyRateUSD: 155 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 39 }, { upToDay: 28, dailyRateUSD: 78 }, { upToDay: Infinity, dailyRateUSD: 155 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 78 }, { upToDay: Infinity, dailyRateUSD: 155 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 78 }, { upToDay: Infinity, dailyRateUSD: 155 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 46 }, { upToDay: Infinity, dailyRateUSD: 92 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 31 }, { upToDay: 19, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 31 }, { upToDay: 19, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
    },
  },

  HapagLloyd: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 24 }, { upToDay: 17, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 96 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 32 }, { upToDay: 17, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 32 }, { upToDay: 17, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 29 }, { upToDay: 17, dailyRateUSD: 58 }, { upToDay: Infinity, dailyRateUSD: 115 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 38 }, { upToDay: 17, dailyRateUSD: 78 }, { upToDay: Infinity, dailyRateUSD: 156 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 38 }, { upToDay: 17, dailyRateUSD: 78 }, { upToDay: Infinity, dailyRateUSD: 156 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 78 }, { upToDay: Infinity, dailyRateUSD: 156 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 78 }, { upToDay: Infinity, dailyRateUSD: 156 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 20 }, { upToDay: 19, dailyRateUSD: 41 }, { upToDay: Infinity, dailyRateUSD: 82 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 27 }, { upToDay: 19, dailyRateUSD: 55 }, { upToDay: Infinity, dailyRateUSD: 110 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 27 }, { upToDay: 19, dailyRateUSD: 55 }, { upToDay: Infinity, dailyRateUSD: 110 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 55 }, { upToDay: Infinity, dailyRateUSD: 110 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 55 }, { upToDay: Infinity, dailyRateUSD: 110 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 24 }, { upToDay: 17, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 96 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 32 }, { upToDay: 17, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 32 }, { upToDay: 17, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 30 }, { upToDay: 28, dailyRateUSD: 60 }, { upToDay: Infinity, dailyRateUSD: 120 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 40 }, { upToDay: 28, dailyRateUSD: 81 }, { upToDay: Infinity, dailyRateUSD: 163 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 40 }, { upToDay: 28, dailyRateUSD: 81 }, { upToDay: Infinity, dailyRateUSD: 163 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 81 }, { upToDay: Infinity, dailyRateUSD: 163 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 81 }, { upToDay: Infinity, dailyRateUSD: 163 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 24 }, { upToDay: 19, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 96 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 32 }, { upToDay: 19, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 32 }, { upToDay: 19, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 130 }] },
    },
  },

  COSCO: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 19 }, { upToDay: 17, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 22 }, { upToDay: 17, dailyRateUSD: 46 }, { upToDay: Infinity, dailyRateUSD: 92 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 16 }, { upToDay: 19, dailyRateUSD: 32 }, { upToDay: Infinity, dailyRateUSD: 65 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 19 }, { upToDay: 17, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 24 }, { upToDay: 28, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 96 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 33 }, { upToDay: 28, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 33 }, { upToDay: 28, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 19 }, { upToDay: 19, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
  },

  Evergreen: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 19 }, { upToDay: 17, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 23 }, { upToDay: 17, dailyRateUSD: 46 }, { upToDay: Infinity, dailyRateUSD: 92 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 16 }, { upToDay: 19, dailyRateUSD: 32 }, { upToDay: Infinity, dailyRateUSD: 65 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 19 }, { upToDay: 17, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 24 }, { upToDay: 28, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 96 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 33 }, { upToDay: 28, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 33 }, { upToDay: 28, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 19 }, { upToDay: 19, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
  },

  ONE: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 19 }, { upToDay: 17, dailyRateUSD: 39 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 23 }, { upToDay: 17, dailyRateUSD: 47 }, { upToDay: Infinity, dailyRateUSD: 93 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 62 }, { upToDay: Infinity, dailyRateUSD: 124 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 16 }, { upToDay: 19, dailyRateUSD: 33 }, { upToDay: Infinity, dailyRateUSD: 65 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 44 }, { upToDay: Infinity, dailyRateUSD: 88 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 44 }, { upToDay: Infinity, dailyRateUSD: 88 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 44 }, { upToDay: Infinity, dailyRateUSD: 88 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 44 }, { upToDay: Infinity, dailyRateUSD: 88 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 19 }, { upToDay: 17, dailyRateUSD: 39 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 24 }, { upToDay: 28, dailyRateUSD: 49 }, { upToDay: Infinity, dailyRateUSD: 97 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 33 }, { upToDay: 28, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 129 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 33 }, { upToDay: 28, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 129 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 129 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 65 }, { upToDay: Infinity, dailyRateUSD: 129 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 19 }, { upToDay: 19, dailyRateUSD: 39 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 52 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
    },
  },

  YangMing: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 19 }, { upToDay: 17, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 23 }, { upToDay: 17, dailyRateUSD: 46 }, { upToDay: Infinity, dailyRateUSD: 92 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 31 }, { upToDay: 17, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 61 }, { upToDay: Infinity, dailyRateUSD: 122 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 16 }, { upToDay: 19, dailyRateUSD: 32 }, { upToDay: Infinity, dailyRateUSD: 65 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 22 }, { upToDay: 19, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 87 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 19 }, { upToDay: 17, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 26 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 24 }, { upToDay: 28, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 96 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 33 }, { upToDay: 28, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 33 }, { upToDay: 28, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 64 }, { upToDay: Infinity, dailyRateUSD: 128 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 19 }, { upToDay: 19, dailyRateUSD: 38 }, { upToDay: Infinity, dailyRateUSD: 77 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 26 }, { upToDay: 19, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 102 }] },
    },
  },

  ZIM: {
    Europe: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 21 }, { upToDay: 17, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 86 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 28 }, { upToDay: 17, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 28 }, { upToDay: 17, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
    },
    NorthAmerica: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 25 }, { upToDay: 17, dailyRateUSD: 51 }, { upToDay: Infinity, dailyRateUSD: 103 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 34 }, { upToDay: 17, dailyRateUSD: 69 }, { upToDay: Infinity, dailyRateUSD: 137 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 34 }, { upToDay: 17, dailyRateUSD: 69 }, { upToDay: Infinity, dailyRateUSD: 137 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 69 }, { upToDay: Infinity, dailyRateUSD: 137 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 69 }, { upToDay: Infinity, dailyRateUSD: 137 }] },
    },
    MiddleEast: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 18 }, { upToDay: 19, dailyRateUSD: 36 }, { upToDay: Infinity, dailyRateUSD: 73 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 24 }, { upToDay: 19, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 97 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 24 }, { upToDay: 19, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 97 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 97 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 48 }, { upToDay: Infinity, dailyRateUSD: 97 }] },
    },
    AsiaPacific: {
      '20GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 21 }, { upToDay: 17, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 86 }] },
      '40GP': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 28 }, { upToDay: 17, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '40HC': { freeDays: 5, tiers: [{ upToDay: 10, dailyRateUSD: 28 }, { upToDay: 17, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 8, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
    },
    Africa: {
      '20GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 26 }, { upToDay: 28, dailyRateUSD: 53 }, { upToDay: Infinity, dailyRateUSD: 108 }] },
      '40GP': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 35 }, { upToDay: 28, dailyRateUSD: 71 }, { upToDay: Infinity, dailyRateUSD: 143 }] },
      '40HC': { freeDays: 14, tiers: [{ upToDay: 21, dailyRateUSD: 35 }, { upToDay: 28, dailyRateUSD: 71 }, { upToDay: Infinity, dailyRateUSD: 143 }] },
      '20RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 71 }, { upToDay: Infinity, dailyRateUSD: 143 }] },
      '40RF': { freeDays: 7, tiers: [{ upToDay: 14, dailyRateUSD: 71 }, { upToDay: Infinity, dailyRateUSD: 143 }] },
    },
    SouthAmerica: {
      '20GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 21 }, { upToDay: 19, dailyRateUSD: 43 }, { upToDay: Infinity, dailyRateUSD: 86 }] },
      '40GP': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 28 }, { upToDay: 19, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '40HC': { freeDays: 7, tiers: [{ upToDay: 12, dailyRateUSD: 28 }, { upToDay: 19, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '20RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
      '40RF': { freeDays: 3, tiers: [{ upToDay: 10, dailyRateUSD: 57 }, { upToDay: Infinity, dailyRateUSD: 114 }] },
    },
  },
}
