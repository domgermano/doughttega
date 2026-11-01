export const theme = {
  breakpoints: {
    sm: "375px",
    md: "768px",
    lg: "1280px",
    xl: "1920px",
  },
  space: {
    1: "2px",
    2: "4px",
    3: "8px",
    4: "12px",
    5: "16px",
    6: "24px",
    7: "32px",
    8: "48px",
    9: "64px",
    10: "96px",
    11: "128px",
  },
} as const;

export type Theme = typeof theme;
