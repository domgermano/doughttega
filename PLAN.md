# Doughttega website: build plan

Static single-page site for Doughttega, "The Biscuit Deli" (artisanal ready-to-bake biscuit dough, small batch, made in Melbourne).
Design source of truth: Figma (accessible to Claude Code via the Figma MCP). Keep exported mockups in `docs/design/` as a backup reference.

## Stack and constraints

- Vite + React + TypeScript + **styled-components**, deployed to GitHub Pages
- Single page, no routing, no backend, no database
- Order of work: **structure + layout → visual styling → analytics + polish → launch → embellishments (3D netting)**
- Keep dependencies minimal until the embellishments phase
- Content (markets, steps, serves) lives in typed data files, not hardcoded in JSX
- Not in scope for now: ordering/buying info (revisit early next year), allergen info (on product labels), social links (add to footer later)

## Designs

Designs have been created in Figma. Use the Figma mcp to inspect designs and elements

- Desktop: https://www.figma.com/design/if5Oz6jbiwyhC7QRC4LoNg/%F0%9F%8D%AA-Doughttega?node-id=404-1760&t=wrdGaXuTZsXXhgK7-4
- Mobile: https://www.figma.com/design/if5Oz6jbiwyhC7QRC4LoNg/%F0%9F%8D%AA-Doughttega?node-id=398-1015&t=wrdGaXuTZsXXhgK7-4

## Sections

Seven sections, in page order. These are the units of work in Phases 2 and 3.

1. **Header**: logo SVG (top right on desktop, centred on mobile), title "Doughttega: The Biscuit Deli", tagline
2. **Market grid**: Queen Victoria Christmas Market (Wed nights, 26 Nov – 16 Dec), Good Food and Wine Christmas Market (03–06 Dec), Dockland Farmers Market (14 Dec), Heide Farmers Market (15 Dec). NEXT tags are derived from dates (see Phase 2). Mobile shows the first card plus a "See more" toggle that reveals the rest, stacked.
3. **Doughttega hero**: giant edge-to-edge "DOUGHTTEGA" wordmark (SVG) with the red "NOT HOT YET" rotating sticker
4. **Netting figure/graphic**: gold band with repeating background pills, netted biscuit log (static SVG), caption "Fig. 1.1: Ready-to-bake biscuit log"
5. **Instructions**: "How to eat" (4 numbered steps) and "Bakes & serves" (bullet list, storage note, "Gingerbread house template" download button)
6. **Pattern graphic**: checkerboard strip
7. **Footer**: small logo on gold bar

## How we work (important for Claude Code)

This applies to **Phases 2 and 3**, as two separate passes over the same seven sections:

- **Phase 2 (build):** build each section one at a time, **unstyled**. Goal is correct functionality, semantic structure and _structural CSS only_: layout (flex + grid), spacing needed for layout, and responsiveness across breakpoints. No colours, fonts, textures or decoration yet.
- **Phase 3 (style):** go back through each section one at a time and apply visual styling (tokens, typography, colour, texture, decoration).
- **After every section, in both phases, stop and wait for the developer to QA it in the browser before starting the next.** Never build or style the whole page in one pass.
- The developer is a designer with solid CSS skills and will refine structure and styling by hand. Keep markup and styles simple, readable and easy to edit: small components, clear names, tokens instead of magic values, minimal cleverness.
- Use the Figma MCP to inspect the design when exact values are needed (layout, spacing, type styles, colours). Prefer pulling tokens from Figma styles over eyeballing screenshots.
- No new dependencies without asking.

---

## Phase 0: Decisions and assets (before coding)

- [x] Fix copy typos in the mockup (heading says "BISCIUT DELI", should be "Biscuit"; confirm "Heide" spelling)
- [x] **Verify market dates and weekdays.** In 2026, 26 Nov is a Thursday and 14/15 Dec are Mon/Tue, which doesn't match "Wednesday Nights" / the weekdays in the mockup. Confirm the year and dates.
- [x] Export from Figma: logo SVG, edge-to-edge wordmark SVG, biscuit log netting SVG, favicon, paper texture
- [x] Prepare paper texture: light, near-greyscale, ~2000px wide, WebP ~70% quality, ideally under 300KB (or a seamless ~1000px tile)
- [x] Check Figma styles are tidy and named (colours + typography scale) so tokens can be pulled cleanly
- [ ] Gingerbread house template PDF ready for `/public`
- [x] Decide GitHub repo name and whether there's a custom domain (affects Vite `base`)
- [x] Pick an analytics tool (Umami)

## Phase 1: Project setup and deploy pipeline

- [x] `npm create vite@latest doughttega -- --template react-ts`
- [x] Clean out template boilerplate; strict TS on
- [x] `npm i styled-components` (v6 ships its own types)
- [x] Fonts: `npm i @fontsource/space-mono @fontsource/space-grotesk` (self-hosted Google Fonts; import only the weights used in Figma)
- [x] ESLint + Prettier (optional but quick)
- [x] Vitest for the market logic (`npm i -D vitest`)
- [x] Set Vite `base` (`/<repo-name>/` for project pages, `/` for custom domain or user site)
- [x] Create GitHub repo and push
- [x] Add `.github/workflows/deploy.yml` (build → `actions/upload-pages-artifact` → `actions/deploy-pages`)
- [x] Settings → Pages → Source: GitHub Actions
- [x] **Deploy the empty skeleton now** and confirm the live URL works
- [ ] Custom domain (optional): `public/CNAME`, DNS records, enforce HTTPS

## Phase 2: Build: functionality, structure and layout (unstyled), one section at a time

Setup:

- [x] Folder layout: `src/components`, `src/data`, `src/assets`, `src/styles`, `src/utils`
- [x] Typed data files:
  - [x] `markets.ts`: `{ name, dates (display string), start (ISO), end (ISO) }`
  - [x] `steps.ts`: how-to-eat steps
  - [x] `serves.ts`: bakes & serves items + storage note
- [x] Minimal global structure: CSS reset and a typed breakpoints theme (`src/styles/theme.ts`, `ThemeProvider`, `styled.d.ts`) so layout can be responsive from the start
- [x] **Market status logic**, one pure function `getMarketStatus(markets, now)` in `src/utils`:
  - [x] Use the Melbourne calendar date (`Australia/Melbourne`), not UTC
  - [x] Past: a market whose `end` is before today is removed from the list
  - [x] Next: every market active today gets the NEXT tag; if none are active, the earliest upcoming one does. Overlapping markets therefore show two NEXT tags.
  - [x] Range rule only (a market holds NEXT across its whole start–end range). Revisit if it feels wrong in testing.
  - [x] No markets left → "see you next season" line and no toggle
  - [x] Vitest cases: before all, during one, during overlap (3–6 Dec), between markets, after all

Sections (build each one unstyled, with layout and responsiveness working, then **stop for QA**):

- [x] 1. Header (logo placement, title, tagline; logo moves top-right → centred on mobile) → QA
- [x] 2. Market grid → QA
  - 3-up grid on desktop, stacked on mobile; NEXT tag (`isNext`) rendered as plain text/element
  - "See more" toggle: mobile only; reveals the remaining cards stacked vertically; `<button aria-expanded>`; hidden when only one market remains. Desktop: all cards always visible.
- [x] 3. Doughttega hero (wordmark SVG scaling edge to edge, sticker positioned top-right of the wordmark) → QA
- [x] 4. Netting figure/graphic → QA
  - Gold band container, background pills, centred log SVG, caption
  - **Pills:** 5 pill `div`s (`aria-hidden`), absolutely positioned flex row; `nth-child` rules step visibility 2 → 3 → 4 → 5 across sm/md/lg
- [x] 5. Instructions (How to eat + Bakes & serves) → QA
  - Two panels side by side on desktop, stacked on mobile
  - Download link to the PDF in `public/`, using `import.meta.env.BASE_URL`
- [x] 6. Pattern graphic (checkerboard strip; structure and tiling at any width, via CSS gradients or SVG) → QA
- [x] 7. Footer (logo on bar) → QA
- [ ] Semantic landmarks, one `h1`, sensible heading order
- [ ] Whole page works and reflows correctly at ~375, 768, 1280, 1920 with no visual styling

## Phase 3: Style (styled-components): visual styling, one section at a time

Foundations first:

- [x] Pull colours and typography scale from Figma styles via the Figma MCP
- [x] Tokens as CSS custom properties in `createGlobalStyle` (`src/styles/GlobalStyle.ts`): colours (deep green, mint, gold, dark olive, red-orange, paper), type scale (Space Grotesk for headings, Space Mono for body, sizes and line heights from Figma), spacing, borders
- [ ] No raw hex values or magic numbers in components; use tokens
- [ ] Use transient props (`$isNext`) so styling props don't reach the DOM
- [x] Base typography on the global style
- [x] Paper texture — applied once on `body` via `@supports (background-blend-mode: multiply)`; sections sit transparently on top. Per-section helper deferred.

Then style each section, **stop for QA** after each:

- [ ] 1. Header → QA
- [ ] 2. Market grid (cards, NEXT badge) → QA
- [ ] 3. Doughttega hero (wordmark colour via token / `currentColor`, rotated circular "NOT HOT YET" sticker) → QA
- [ ] 4. Netting figure/graphic (gold band, dark olive pills, white netting lines, caption) → QA
- [ ] 5. Instructions (dark green panels, mint sub-headers, button) → QA
- [ ] 6. Pattern graphic (green/mint colours) → QA
- [ ] 7. Footer → QA
- [ ] Compare against Figma side by side and fix drift
- [ ] Final responsive pass at ~375, 768, 1280, 1920

## Phase 4: Analytics and launch polish → **LAUNCH**

- [ ] Add analytics script to `index.html` (cookie-free tool chosen in Phase 0)
- [ ] Track custom events: template download click, "See more" toggle
- [ ] `<title>`, meta description, `lang="en-AU"`, theme-color
- [ ] Open Graph / Twitter card image
- [ ] Favicon + apple-touch-icon from logo
- [ ] Alt text for meaningful images; decorative ones `alt=""` / `aria-hidden`
- [ ] Colour contrast check (gold on mint and mint on green are the risky pairs)
- [ ] Keyboard navigation and focus styles
- [ ] Optimise images and SVGs; check bundle size
- [ ] Lighthouse pass (aim 90+)
- [ ] Test Safari/iOS, Chrome, Firefox
- [ ] Check the live URL, template download, and all market info once more
- [ ] Tidy README (run, build, deploy, how to edit `markets.ts`)
- [ ] **Ship the polished static version**

## Phase 5: Embellishments (after launch)

- [ ] Decide approach: `three` + `@react-three/fiber` (+ `drei`) vs raw three.js
- [ ] Build the 3D netted log: capsule geometry + grid/wireframe netting, white lines on transparent background, knotted ends
- [ ] Slow auto-rotation; optional drag-to-rotate
- [ ] **Lazy-load** the 3D chunk (`React.lazy` / dynamic import)
- [ ] Keep the static SVG as the fallback (no WebGL, loading state, reduced motion)
- [ ] Respect `prefers-reduced-motion` (no auto-rotate)
- [ ] Pause rendering offscreen (IntersectionObserver); cap pixel ratio at 2
- [ ] Test on a mid-range phone; re-run Lighthouse to confirm no regression
- [ ] Other ideas (optional, reduced-motion aware): sticker spin, wordmark hover, scroll reveals

## Later (parked)

- [ ] Buying / contact info (revisit early next year based on sales and traffic)
- [ ] Social links in footer
- [ ] Past-season messaging for next year's markets

## Notes for Claude Code

- Phases 2 and 3 are separate passes: build unstyled first (functionality, structure, flex/grid layout, responsiveness), then style. One section at a time in both, stop for QA after each section; one phase at a time, stop for review at the end of each
- Keep components small, presentational and easy for a designer to edit by hand; all copy and dates come from `src/data/*`
- In Phase 3, all colours, fonts, spacing come from tokens (sourced from Figma styles); no raw hex values in component styles
- Use relative asset paths / `import.meta.env.BASE_URL` so GitHub Pages' base path works
- Mobile-first styles
- Market logic stays in one pure, tested function; components just render its output
- three.js arrives in Phase 5 only
