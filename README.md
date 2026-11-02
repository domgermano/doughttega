# Doughttega

Website for Doughttega — The Biscuit Deli. Artisanal ready-to-bake biscuit dough, small batch, made in Melbourne.

## Stack

- Vite + React + TypeScript + styled-components v6
- Deployed to GitHub Pages via GitHub Actions

## Dev

```bash
npm install
npm run dev
```

## Build & preview

```bash
npm run build       # type-check + bundle
npm run preview     # serve the built output locally
```

## Deploy

Push to `main` — GitHub Actions builds and deploys automatically. Live at:
https://domgermano.github.io/doughttega/

## Editing content

All copy and dates live in `src/data/` — no component changes needed for content updates.

### Market dates (`src/data/markets.ts`)

Each market has a `name`, a `dates` display string, and ISO `start`/`end` dates. The page automatically:
- hides markets whose `end` has passed
- tags the next upcoming market (or all active markets) with a NEXT badge
- shows a "see you next season" message when all markets are past

Update `start`/`end` each season. The `dates` string is freeform — write it however it should appear on the card.

### How-to-eat steps (`src/data/steps.ts`)

Ordered list of `{ number, text }` objects rendered in the Instructions panel.

### Bakes & serves (`src/data/serves.ts`)

`serveItems` (bullet list), `servesIntro` (subtitle), and `storageNote` (small print) rendered in the Instructions panel.

### Download template

Drop the PDF into `public/` and update the filename in `src/components/Instructions.tsx` (`DownloadLink href`).
