# Doughttega: Scroll-Rotating 3D Net Context

## Project background
Doughttega is an artisanal biscuit dough business based in Melbourne. The brand concept is a "Biscuit Deli" (or bottega): cookie dough sold in netted logs, like salami, with a premium deli feel. The logo and overall brand aesthetic are already locked in (flat colours, checkerboard pattern, bold condensed type, green / mustard / pale sage palette).

I'm designing the website now. This document covers one interaction I want to add **later**, once the app structure is built.

## The idea
A 3D model of the netting from one of our dough logs that rotates as the visitor scrolls.

- I have a vector illustration of the net (hand-drawn look: slightly wonky grid lines, a knot at each end, roughly 1:3.5 width to height, about 35-40 rings and 20-ish strands around the circumference).
- **Only the net is needed.** No dough, no internal log geometry.
- **Illustrated, vector look.** Flat-coloured, constant-width lines. No realistic lighting, materials or shadows.
- **Scroll and animation performance is a top priority.** It must be buttery smooth, otherwise I won't ship it.

## Approach decided on (no sprite sheet)
I considered a pre-rendered sprite sheet but rejected it: a smooth 360° spin needs about 90-120 frames, which is heavy to download and decode, can't react to anything, and isn't continuous. Video scrubbing is also unreliable. Real-time WebGL is lighter and smoother for an object this simple.

### Generate the net procedurally in code (not in Blender)
- Build rings (around the log) and strands (along its length) from a capsule-shaped profile.
- Add small seeded noise to each vertex to get the hand-drawn wonk. It is baked once, so the net is imperfect but stable as it rotates.
- The two end knots are the fiddly part. Build them from a few tiny curves or a small mesh. This is the one place a Blender model may be worth considering.
- I'm new to WebGL and fairly new to 3D modelling, so keep the code readable and well commented.

### Rendering
- Use fat lines (`Line2` / `LineSegments2` from three's examples, or drei's `<Line>`) for constant-width, anti-aliased, flat-colour strokes.
- Merge the whole net into a single `LineSegments2` (one draw call).
- Open question: show the back strands through the front (like a real net), or hide them for a clean "front only" look like the vector. The front-only option can be done with an invisible inner shape that writes depth but not colour. Worth prototyping both.

### Scroll-driven rotation
- Lenis for smooth scrolling.
- GSAP ScrollTrigger or Framer Motion `useScroll` for scroll progress.
- Don't set rotation directly from scroll. Ease toward the target each frame (`rot += (target - rot) * 0.1`). This is the key to the smooth feel.

### Performance rules
- `frameloop="demand"` on the R3F `<Canvas>`, and `dpr` capped at `[1, 2]`.
- No real-time shadows or post-processing.
- Canvas is `position: fixed` or `sticky` so it never triggers layout. Animate DOM elements with `transform` and `opacity` only.
- Stop rendering when offscreen (IntersectionObserver).
- Lazy-load the canvas with `React.lazy` so three.js doesn't hurt first paint. Show the static logo or a flat net illustration until it's ready.
- Respect `prefers-reduced-motion` and fall back to a still image.

## Stack
- Vite + React + TypeScript
- `three`, `@react-three/fiber`, `@react-three/drei`
- Lenis, plus GSAP ScrollTrigger or Framer Motion
- No backend or database for now
- Deploying to GitHub Pages (set `base: '/repo-name/'` in `vite.config.ts` unless using a custom domain; if `react-router` is added later, use `HashRouter` or a `404.html` redirect)

## Suggested build order
1. Prototype the net in a bare Vite + R3F page, with a slider driving rotation, and get the shape and wonk right against my vector.
2. Hook rotation up to scroll with easing.
3. Fit it into the real site layout last.

## Open questions (undecided)
- Is the log a **hero element** that spins as the visitor scrolls through one section, or does it **follow the visitor down the whole page**?
- Back strands visible, or front only?

## Status
Planning only. No code has been written. I'll come back to this after the main app structure is built. Don't scaffold anything yet unless I ask.

## Assets
- Vector illustration of the net (my file, to be provided separately)
- Logo and Instagram posts for brand reference (colours: dark green, pale sage, mustard/olive gold, plus red accents in some pieces)
