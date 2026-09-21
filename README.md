# Mugran — Frosted Glass Portal

A cinematic "Coming Soon" page: a frosted glass monolith that clears locally
wherever a volumetric cursor-light passes over it, revealing floating 3D
icons inside.

## Setup

```bash
npx create-next-app@latest mugran-portal --js --app --no-tailwind --no-src-dir --import-alias "@/*"
# then copy app/ and components/ from this project over the generated ones
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing framer-motion
npm run dev
```

(Or just drop `app/`, `components/`, and `package.json` from this delivery
into a fresh Next.js 14 app-router project and `npm install`.)

## How the reveal effect works

`components/scene/PointerTracker.jsx` raycasts the 2D pointer onto an
invisible plane in front of the monolith every frame and writes the 3D hit
point into a plain `useRef` — never React state, so mouse movement never
triggers a re-render.

`components/scene/GlassMonolith.jsx` hooks `MeshPhysicalMaterial.onBeforeCompile`
to inject a varying `vWorldPos` and a handful of uniforms into the stock
Three.js physical shader, then overrides the line that sets `roughnessFactor`
with a `smoothstep`-based falloff from the pointer position. The result: full
frost (`roughness ≈ 0.92`) everywhere, dropping smoothly to near-glass-clear
(`roughness ≈ 0.06`) inside a ~1.35-unit radius of the cursor — a real,
per-fragment GPU effect, not a decal or render-target trick, so it costs
almost nothing extra per frame.

A second patch adds a small emissive kick (`totalEmissiveRadiance +=`) in the
same radius so the tech-blue light visibly bleeds into the glass itself.

`components/scene/CursorLight.jsx` is the replacement for the native cursor:
a `pointLight` plus an additive-blended halo sphere that both track the same
ref, with intensity/opacity smoothly lerped so the light feels like it has
weight rather than snapping to the mouse.

## Tuning

All the reveal parameters live at the top of `GlassMonolith.jsx`:

- `FROST_ROUGHNESS` / `CLEAR_ROUGHNESS` — the two ends of the roughness range
- `REVEAL_RADIUS` — size of the clear window, in world units

And in `MugranExperience.jsx`, the `Bloom` intensity/threshold controls how
hot the highlights and edge-glow of the icons read.
