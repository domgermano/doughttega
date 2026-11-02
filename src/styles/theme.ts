export const theme = {
  breakpoints: {
    sm: '375px',
    md: '768px',
    lg: '1280px',
    xl: '1920px',
  },
  space: {
    1: '2px',
    2: '4px',
    3: '8px',
    4: '12px',
    5: '16px',
    6: '24px',
    7: '32px',
    8: '48px',
    9: '64px',
    10: '96px',
    11: '128px',
  },
  colors: {
    darkGreen:   '#1E2F18',
    mint:        '#CADED8',
    mustard:     '#A39416',
    darkMustard: '#7A6F10',
    red:         '#E74515',
    white:       '#FFFFFF',
    black:       '#000000',
  },
  type: {
    // Display — Space Grotesk Bold
    displayXl: { size: '13.3125rem', weight: 700, leading: 1.1, tracking: '-3px' },
    displayL:  { size: '10rem',      weight: 700, leading: 1.1, tracking: '-3px' },
    displayM:  { size: '7.5rem',     weight: 700, leading: 1.1, tracking: '-3px' },
    // Headings — Space Grotesk
    h1: { size: '5.625rem',  weight: 500, leading: 1.1, tracking: '-2px' },
    h2: { size: '3.1875rem', weight: 500, leading: 1.1, tracking: '-2px' },
    h3: { size: '2.375rem',  weight: 500, leading: 1.1, tracking: '-1px' },
    h4: { size: '1.75rem',   weight: 600, leading: 1.1, tracking: '-1px' },
    h5: { size: '1.3125rem', weight: 600, leading: 1.1, tracking: '0px' },
    h6: { size: '1rem',      weight: 600, leading: 1.1, tracking: '0px' },
    // Body — Space Mono
    bodyL:       { size: '1.125rem', weight: 400, leading: 1.4, tracking: '0px' },
    bodyLStrong: { size: '1.125rem', weight: 700, leading: 1.4, tracking: '0px' },
    bodyM:       { size: '1rem',     weight: 400, leading: 1.4, tracking: '0px' },
    bodyMStrong: { size: '1rem',     weight: 700, leading: 1.4, tracking: '0px' },
    bodyS:       { size: '0.75rem',  weight: 400, leading: 1.4, tracking: '0.3px' },
    bodySStrong: { size: '0.75rem',  weight: 700, leading: 1.4, tracking: '0.5px' },
    bodyXs:      { size: '0.5625rem',weight: 400, leading: 1.4, tracking: '0.3px' },
  },
  fonts: {
    heading: "'Space Grotesk', sans-serif",
    body:    "'Space Mono', monospace",
  },
} as const

export type Theme = typeof theme
