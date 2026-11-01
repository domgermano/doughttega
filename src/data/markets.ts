export interface Market {
  name: string
  dates: string
  start: string // ISO date YYYY-MM-DD
  end: string   // ISO date YYYY-MM-DD
}

export const markets: Market[] = [
  {
    name: 'Queen Victoria Christmas Market',
    dates: 'Wednesday Nights, 26 Nov – 16 Dec',
    start: '2026-11-26',
    end: '2026-12-16',
  },
  {
    name: 'Good Food and Wine Christmas Market',
    dates: '3 – 6 Dec',
    start: '2026-12-03',
    end: '2026-12-06',
  },
  {
    name: 'Dockland Farmers Market',
    dates: '14 Dec',
    start: '2026-12-14',
    end: '2026-12-14',
  },
  {
    name: 'Heide Farmers Market',
    dates: '15 Dec',
    start: '2026-12-15',
    end: '2026-12-15',
  },
]
