import { describe, expect, it } from 'vitest'
import { markets } from '../data/markets'
import { getMarketStatus } from './marketStatus'

// Markets (chronological):
// QV (opening night): 2026-11-26
// QV (Wed night): 2026-12-02
// Good Food:      2026-12-03 – 2026-12-06
// QV (Wed night): 2026-12-09
// Dockland:       2026-12-14
// Heide:          2026-12-15
// QV (Wed night): 2026-12-16

const QV = 'Queen Victoria Christmas Market'
const GOOD_FOOD = 'Good Food and Wine Christmas Market'
const DOCKLAND = 'Dockland Farmers Market'

// Timestamps are in AEDT (UTC+11) so the Melbourne calendar date matches
const date = (s: string) => new Date(`${s}T10:00:00+11:00`)

const nextNames = (result: ReturnType<typeof getMarketStatus>) =>
  result.markets.filter(m => m.isNext).map(m => m.name)

describe('markets data', () => {
  it('lists each Queen Victoria night as its own single-day entry', () => {
    const qv = markets.filter(m => m.name === QV)
    expect(qv.map(m => m.start)).toEqual([
      '2026-11-26',
      '2026-12-02',
      '2026-12-09',
      '2026-12-16',
    ])
    qv.forEach(m => expect(m.end).toBe(m.start))
  })

  it('QV nights after opening night fall on Wednesdays', () => {
    markets
      .filter(m => m.name === QV && m.start > '2026-11-26')
      .forEach(m => expect(new Date(`${m.start}T12:00:00Z`).getUTCDay()).toBe(3))
  })

  it('is in chronological order (getMarketStatus relies on this)', () => {
    const starts = markets.map(m => m.start)
    expect(starts).toEqual([...starts].sort())
  })
})

describe('getMarketStatus', () => {
  it('before all markets: opening QV night (26 Nov) is NEXT (earliest upcoming)', () => {
    const result = getMarketStatus(markets, date('2026-11-01'))
    expect(result.empty).toBe(false)
    expect(result.markets).toHaveLength(7)
    expect(nextNames(result)).toEqual([QV])
    expect(result.markets.find(m => m.isNext)?.start).toBe('2026-11-26')
  })

  it('on opening night (26 Nov): that QV is NEXT (active today)', () => {
    const result = getMarketStatus(markets, date('2026-11-26'))
    expect(result.markets).toHaveLength(7)
    expect(result.markets.find(m => m.isNext)?.start).toBe('2026-11-26')
  })

  it('between opening night and the first Wednesday (27 Nov): 2 Dec QV is NEXT', () => {
    const result = getMarketStatus(markets, date('2026-11-27'))
    expect(result.markets).toHaveLength(6)
    expect(result.markets.find(m => m.isNext)?.start).toBe('2026-12-02')
  })

  it('on the first QV Wednesday (2 Dec): that QV is NEXT (active today)', () => {
    const result = getMarketStatus(markets, date('2026-12-02'))
    expect(result.markets).toHaveLength(6)
    expect(nextNames(result)).toEqual([QV])
    expect(result.markets.find(m => m.isNext)?.start).toBe('2026-12-02')
  })

  it('during Good Food (4 Dec): first QV has ended, Good Food is the only NEXT', () => {
    const result = getMarketStatus(markets, date('2026-12-04'))
    expect(result.markets).toHaveLength(5)
    expect(nextNames(result)).toEqual([GOOD_FOOD])
  })

  it('between Good Food and the second QV (8 Dec): second QV is NEXT', () => {
    const result = getMarketStatus(markets, date('2026-12-08'))
    expect(result.markets).toHaveLength(4)
    expect(nextNames(result)).toEqual([QV])
    expect(result.markets.find(m => m.isNext)?.start).toBe('2026-12-09')
  })

  it('on the second QV Wednesday (9 Dec): that QV is NEXT', () => {
    const result = getMarketStatus(markets, date('2026-12-09'))
    expect(result.markets).toHaveLength(4)
    expect(result.markets.find(m => m.isNext)?.start).toBe('2026-12-09')
  })

  it('between the second QV and Dockland (10 Dec): Dockland is NEXT', () => {
    const result = getMarketStatus(markets, date('2026-12-10'))
    expect(result.markets).toHaveLength(3) // QV 2 Dec, Good Food and QV 9 Dec have ended
    expect(nextNames(result)).toEqual([DOCKLAND])
  })

  it('on the last QV Wednesday (16 Dec): only that QV remains and is NEXT', () => {
    const result = getMarketStatus(markets, date('2026-12-16'))
    expect(result.markets).toHaveLength(1)
    expect(nextNames(result)).toEqual([QV])
  })

  it('after all markets: empty', () => {
    const result = getMarketStatus(markets, date('2026-12-20'))
    expect(result.empty).toBe(true)
    expect(result.markets).toHaveLength(0)
  })
})
