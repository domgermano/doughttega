export interface Market {
  name: string;
  dates: string;
  start: string; // ISO date YYYY-MM-DD
  end: string; // ISO date YYYY-MM-DD
}

export const markets: Market[] = [
  {
    name: "Christmas Night Market",
    dates: "Queen Victoria Night Market, 25 Nov",
    start: "2026-11-25",
    end: "2026-11-25",
  },
  {
    name: "Christmas Night Market",
    dates: "Queen Victoria Night Market, 2 Dec",
    start: "2026-12-02",
    end: "2026-12-02",
  },
  {
    name: "Good Food and Wine Christmas Market",
    dates: "Melbourne Exhibition Centre, 4 – 6 Dec",
    start: "2026-12-04",
    end: "2026-12-06",
  },
  {
    name: "Christmas Night Market",
    dates: "Queen Victoria Night Market, 9 Dec",
    start: "2026-12-09",
    end: "2026-12-09",
  },
  {
    name: "Heide Market",
    dates: "Heide Sculpture Park, 12 Dec",
    start: "2026-12-12",
    end: "2026-12-12",
  },
  {
    name: "District Makers' Market",
    dates: "District Docklands, Sunday 13 Dec",
    start: "2026-12-13",
    end: "2026-12-13",
  },
  {
    name: "Christmas Night Market",
    dates: "Queen Victoria Night Market, 16 Dec",
    start: "2026-12-16",
    end: "2026-12-16",
  },
];
