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
    displayXl: { size: '213px', weight: 700, leading: 1.1, tracking: '-3px' },
    displayL:  { size: '160px', weight: 700, leading: 1.1, tracking: '-3px' },
    displayM:  { size: '120px', weight: 700, leading: 1.1, tracking: '-3px' },
    // Headings — Space Grotesk
    h1: { size: '90px', weight: 500, leading: 1.1, tracking: '-2px' },
    h2: { size: '51px', weight: 500, leading: 1.1, tracking: '-2px' },
    h3: { size: '38px', weight: 500, leading: 1.1, tracking: '-1px' },
    h4: { size: '28px', weight: 600, leading: 1.1, tracking: '-1px' },
    h5: { size: '21px', weight: 600, leading: 1.1, tracking: '0px' },
    h6: { size: '16px', weight: 600, leading: 1.1, tracking: '0px' },
    // Body — Space Mono
    bodyL:       { size: '18px', weight: 400, leading: 1.4, tracking: '0px' },
    bodyLStrong: { size: '18px', weight: 700, leading: 1.4, tracking: '0px' },
    bodyM:       { size: '16px', weight: 400, leading: 1.4, tracking: '0px' },
    bodyMStrong: { size: '16px', weight: 700, leading: 1.4, tracking: '0px' },
    bodyS:       { size: '12px', weight: 400, leading: 1.4, tracking: '0.3px' },
    bodySStrong: { size: '12px', weight: 700, leading: 1.4, tracking: '0.5px' },
    bodyXs:      { size: '9px',  weight: 400, leading: 1.4, tracking: '0.3px' },
  },
  fonts: {
    heading: "'Space Grotesk', sans-serif",
    body:    "'Space Mono', monospace",
  },
} as const

export type Theme = typeof theme
