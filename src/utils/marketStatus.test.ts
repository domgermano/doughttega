import { describe, expect, it } from 'vitest'
import { markets } from '../data/markets'
import { getMarketStatus } from './marketStatus'

// Markets:
// QV:        2026-11-26 – 2026-12-16 (Wed nights)
// Good Food: 2026-12-03 – 2026-12-06
// Dockland:  2026-12-14
// Heide:     2026-12-15

// Timestamps are in AEDT (UTC+11) so the Melbourne calendar date matches
const date = (s: string) => new Date(`${s}T10:00:00+11:00`)

describe('getMarketStatus', () => {
  it('before all markets: QV is NEXT (earliest upcoming)', () => {
    const result = getMarketStatus(markets, date('2026-11-01'))
    expect(result.empty).toBe(false)
    expect(result.markets).toHaveLength(4)
    const nextNames = result.markets.filter(m => m.isNext).map(m => m.name)
    expect(nextNames).toEqual(['Queen Victoria Christmas Market'])
  })

  it('during QV only (1 Dec): QV is NEXT (active today)', () => {
    const result = getMarketStatus(markets, date('2026-12-01'))
    const nextNames = result.markets.filter(m => m.isNext).map(m => m.name)
    expect(nextNames).toEqual(['Queen Victoria Christmas Market'])
  })

  it('during overlap (4 Dec): QV and Good Food both NEXT', () => {
    const result = getMarketStatus(markets, date('2026-12-04'))
    expect(result.markets).toHaveLength(4)
    const nextNames = result.markets.filter(m => m.isNext).map(m => m.name)
    expect(nextNames).toEqual([
      'Queen Victoria Christmas Market',
      'Good Food and Wine Christmas Market',
    ])
  })

  it('between Good Food and Dockland (10 Dec): QV is NEXT', () => {
    const result = getMarketStatus(markets, date('2026-12-10'))
    expect(result.markets).toHaveLength(3) // Good Food has ended
    const nextNames = result.markets.filter(m => m.isNext).map(m => m.name)
    expect(nextNames).toEqual(['Queen Victoria Christmas Market'])
  })

  it('after all markets: empty', () => {
    const result = getMarketStatus(markets, date('2026-12-20'))
    expect(result.empty).toBe(true)
    expect(result.markets).toHaveLength(0)
  })
})
