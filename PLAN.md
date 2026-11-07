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
2. **Market grid**: Queen Victoria Christmas Market (one card per night: 26 Nov, then Wednesdays 2, 9, 16 Dec), Good Food and Wine Christmas Market (03–06 Dec), Dockland Farmers Market (14 Dec), Heide Farmers Market (15 Dec). NEXT tags are derived from dates (see Phase 2). Mobile shows the first card plus a "See more" toggle that reveals the rest, stacked.
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
- [x] Custom domain (optional): `public/CNAME`, DNS records, enforce HTTPS

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
- [x] Semantic landmarks, one `h1`, sensible heading order
- [x] Whole page works and reflows correctly at ~375, 768, 1280, 1920 with no visual styling

## Phase 3: Style (styled-components): visual styling, one section at a time

Foundations first:

- [x] Pull colours and typography scale from Figma styles via the Figma MCP
- [x] Tokens as CSS custom properties in `createGlobalStyle` (`src/styles/GlobalStyle.ts`): colours (deep green, mint, gold, dark olive, red-orange, paper), type scale (Space Grotesk for headings, Space Mono for body, sizes and line heights from Figma), spacing, borders
- [x] No raw hex values or magic numbers in components; use tokens
- [x] Use transient props (`$isNext`) so styling props don't reach the DOM
- [x] Base typography on the global style
- [x] Paper texture — applied once on `body` via `@supports (background-blend-mode: multiply)`; sections sit transparently on top. Per-section helper deferred.

Then style each section, **stop for QA** after each:

- [x] 1. Header → QA
- [x] 2. Market grid (cards, NEXT badge) → QA
- [x] 3. Doughttega hero (wordmark colour via token / `currentColor`, rotated circular "NOT HOT YET" sticker) → QA
- [x] 4. Netting figure/graphic (gold band, dark olive pills, white netting lines, caption) → QA
- [x] 5. Instructions (dark green panels, mint sub-headers, button) → QA
- [x] 6. Pattern graphic (green/mint colours) → QA
- [x] 7. Footer → QA
- [x] Compare against Figma side by side and fix drift
- [x] Final responsive pass at ~375, 768, 1280, 1920

## Phase 4: Analytics and launch polish → **LAUNCH**

- [ ] Add analytics script to `index.html` (cookie-free tool chosen in Phase 0)
- [ ] Track custom events: template download click, "See more" toggle
- [x] `<title>`, meta description, `lang="en-AU"`, theme-color
- [x] Open Graph / Twitter card image
- [x] Favicon + apple-touch-icon from logo
- [x] Alt text for meaningful images; decorative ones `alt=""` / `aria-hidden`
- [x] Colour contrast check (gold on mint and mint on green are the risky pairs)
- [x] Keyboard navigation and focus styles
- [x] Optimise images and SVGs; check bundle size
- [x] Lighthouse pass (aim 90+)
- [x] Test Safari/iOS, Chrome, Firefox
- [ ] Check the live URL, template download, and all market info once more
- [x] Tidy README (run, build, deploy, how to edit `markets.ts`)
- [ ] **Ship the polished static version**

## Phase 5: 3D scroll-driven net

### Decisions

- **Placement:** replaces the static `biscuit_log.svg` inside the existing NettingFigure section — scrolls normally with the page, rotates as it passes through the viewport
- **Rotation:** scroll-driven (not auto-rotate). Raw `scroll` event updates a target rotation ref; `useFrame` eases toward it each frame (`rot += (target - rot) * 0.1`). `frameloop="demand"` + `invalidate()` on scroll so we only render when something changes.
- **Look:** front-only (depth mask — invisible `Underlay` mesh writes to the depth buffer, hides back strands). Net is real mesh geometry (Blender wireframe modifier applied on export) with a flat white `meshBasicMaterial`. No lighting, shadows or other materials.
- **Geometry:** modelled in Blender and exported as `src/assets/net_3d.glb` (~200 KB, positions only). Two objects: `Net` (the netting, with end knots) and `Underlay` (a slightly smaller closed mesh used only as the depth mask). Long axis is X; loaded with drei `useGLTF` and scaled up in code (`MODEL_SCALE`). The earlier procedural capsule approach (rings + strands + seeded noise via drei `<Line>`) was tried and dropped because the result wasn't good enough.
- **Stack additions:** `three`, `@react-three/fiber`, `@react-three/drei` — nothing else
- **Fallback:** static `biscuit_log.svg` for no-WebGL, loading state, and `prefers-reduced-motion`

### Build order (prototype before integrating)

- [x] **Step 1 — Prototype:** load the Blender model in a standalone `src/components/NetPrototype.tsx` with sliders for spin plus camera (fov, zoom) and log tilt (yaw, pitch). Shape, proportions and end knots reviewed and approved. Camera settled on **fov 20** (zoom 1, no yaw/pitch).
- [x] **Step 2 — Scroll:** replaced the slider with scroll-driven momentum (scroll deltas add angular velocity, friction decays it; native passive scroll listener, refs only, `frameloop="demand"`, no new deps). Tuned values: gain 0.05, friction 1, max velocity 2 rad/s. Camera distance 8 at fov 20. Fixed-spin mode kept in the prototype as a fallback if performance disappoints on mobile.
- [x] **Step 3 — Integrate:** `NetCanvas.tsx` lazy-loaded into `NettingFigure.tsx`. Static `biscuit_log.svg` stays in the layout as the fallback (no WebGL, `prefers-reduced-motion`, loading, load error via error boundary) and fades out once the 3D net is on screen. Camera fits the log to the canvas width at any aspect. Prototype page and component removed; fixed-spin mode kept in `NetCanvas` as an unexposed `mode` prop.
- [x] **Step 4 — Performance:** `frameloop="demand"` and dpr `[1, 2]` in place; IntersectionObserver pauses scroll input and rendering while the net is offscreen; three.js loads only after page load + idle (`src/utils/whenIdle.ts`) so it stays off the critical path; model loaded with three's `GLTFLoader` (drei no longer needed in the chunk). Lighthouse (local prod build): desktop 97, mobile 77 (81 before the 3D net; TBT ~70 ms, CLS ~0). Lazy chunk is ~968 KB (257 KB gzipped); rewriting without react-three-fiber was considered and parked. Checked on a real phone: smooth.

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
