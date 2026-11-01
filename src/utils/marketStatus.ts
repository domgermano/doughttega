import type { Market } from '../data/markets'

export interface MarketWithStatus extends Market {
  isNext: boolean
}

export interface MarketStatusResult {
  markets: MarketWithStatus[]
  empty: boolean
}

export function getMarketStatus(markets: Market[], now: Date): MarketStatusResult {
  const today = now.toLocaleDateString('en-CA', { timeZone: 'Australia/Melbourne' })

  const upcoming = markets.filter(m => m.end >= today)

  if (upcoming.length === 0) {
    return { markets: [], empty: true }
  }

  const activeToday = upcoming.filter(m => m.start <= today && m.end >= today)

  if (activeToday.length > 0) {
    return {
      markets: upcoming.map(m => ({ ...m, isNext: m.start <= today && m.end >= today })),
      empty: false,
    }
  }

  // No market active today — earliest upcoming gets NEXT
  const earliestStart = upcoming[0].start
  return {
    markets: upcoming.map(m => ({ ...m, isNext: m.start === earliestStart })),
    empty: false,
  }
}
