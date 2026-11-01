export const theme = {
  breakpoints: {
    sm: '375px',
    md: '768px',
    lg: '1280px',
    xl: '1920px',
  },
} as const

export type Theme = typeof theme
