# Launch / Figma implementation

Source: [Mugran frame 792:2130](https://www.figma.com/design/PuKWnPK0V7JIFOtvycdZo6?node-id=792-2130).

The desktop source is 1440 × 8913. It contains eight top-level frames, with
the landing-page and campaign frames each containing a showcase and pricing
composition. These become ten semantic animation sections in the implementation.

## Official site integration and motion (2026-11-09)

The original shared Navbar, Footer, SiteIntro and BackToTop are rendered by the
root layout on `/launch`, with no copied header or footer. The obsolete
SiteChrome suppression wrapper is removed. Navbar appends exactly one **Offer**
link to `/launch` in each desktop/mobile menu, with the existing active styling.
All existing links retain their order. The shared project button opens the same
launch enquiry dialog and keeps the currently selected package.

The font wrapper reserves 101px for the desktop header and 81px for the mobile
header, outside the Figma frame. The table below remains relative to the launch
content; internal section coordinates and dimensions are unchanged. Anchors
clear the fixed header. Hero motion waits for the existing global intro.

Campaign motion lives in `CampaignGallery` / `useCampaignMotion`: a scrubbed
160px product descent (120px on mobile), ordered campaign introduction, then a
26-second wrapped GSAP loop. Desktop movement follows the original editorial
heights. Mobile keeps the existing three-plus-two arrangement and empty lower
third column. Five hidden-from-assistive-technology image copies bridge the
edges. Layout, loop translation, introduction and hover each own separate
wrappers. No image assets, resting crops, prices, or page copy are changed.

The loop eases to a pause on hover/focus and resumes without resetting its phase;
it stops offscreen or in a hidden tab. Space toggles a keyboard-controlled pause.
Reduced motion restores the original static gallery and hides all copies.
Fine-pointer devices get image scaling, a 5px campaign lift, and bounded laptop
depth (1.4 degrees for the showcase, 1 degree for the bundle). Button arrows move
4px diagonally. Timelines, event handlers, ResizeObserver and visibility hooks
are cleaned up on media changes and navigation.

`scripts/verify-launch-motion.mjs` tests two real 26-second cycles by default,
sampling image spacing and wrap continuity. Set `LAUNCH_LOOP_CYCLES=0` for a quick
integration check after the long-cycle test has already passed. It also checks
scroll-linked descent, hover and recovery, hidden/offscreen pausing, mobile
motion, reduced-motion reset, shared navigation and route cleanup.

### Final integration verification

- Production build completed successfully, including Next's lint/type validation.
  The existing worker `revalidateTag` / `localhost:undefined` diagnostic still
  prints during static generation; the build exits successfully.
- Production browser checks passed at 375, 390, 768, 1024 and 1440px: no horizontal
  overflow, local imagery, original desktop geometry, navigation, enquiries,
  keyboard FAQ, focus handling, reduced motion and no-JavaScript content.
- Two full 26-second gallery cycles passed 390 continuity samples. The final
  production motion run additionally passed hover recovery, tab/offscreen pause,
  laptop depth, mobile looping and route-unmount cleanup with no console/runtime
  errors. The production run reused the completed long-cycle verification.
- SEO regression passed 16 canonical routes, 20 internal targets, three aliases,
  robots and sitemap. `git diff --check` passed. No separate lint/typecheck scripts
  are configured. No dependencies were added and no deployment was performed.
- Route cleanup was checked through Contact. The unrelated About WebGL scene
  cannot initialize in the GPU-disabled headless test browser.

The reported side-tab accent border is absent. The existing, narrowly scoped
Impeccable gradient-text exception remains because those gradients are in Figma;
no additional detector exceptions were introduced for this refinement.

| Visual section | Top at 1440px | Height |
| --- | ---: | ---: |
| Hero | 0 | 1024 |
| Brand statement | 1024 | 456 |
| Landing-page showcase | 1480 | 1021 |
| Landing-page pricing | 2501 | 884 |
| Product campaign | 3385 | 1021 |
| Campaign pricing | 4406 | 884 |
| Selected creative work | 5290 | 1042 |
| Complete Launch Kit | 6332 | 899 |
| FAQ (closed) | 7231 | 812 |
| Final CTA | 8043 | 870 |

Desktop uses container-relative design units, actual text, and local image layers.
Complex product/mockup compositions retain the source's coordinates, clipping,
angles and layering. No full-page screenshots are used as implementation assets.
No mobile frame exists on the source page: below 768px the same content and
assets reflow without a carousel, hidden deliverables, or extra page sections.

## Assets and typography

`public/images/launch` contains the original 17 image exports and eight SVG
exports returned by Figma, plus two decorative pricing plates. The plates export
the original background image fills and proprietary Figma GLASS effects only;
all text and controls are omitted and remain HTML in the page. Temporary export
containers were removed immediately; original Figma nodes were not changed.

Source asset mapping:

- Hero: `ghostly-hand-behind-blue-glass1.png` (787:1096).
- Statement: `six-frame-blue-glow-animation1.png`, `4.png`, `7.png`, `6.png`.
- Landing mockup: `free-mac-book-pro-proled-xdr-display-mockup.png` (789:1458).
- Pricing: `landing-pricing-plate.png` / `campaign-pricing-plate.png`, derived
  from 791:2031 / 791:2069; original fills also retained as rectangle3/rectangle4.
- Campaign: `7.png` plus rectangle5, rectangle1, rectangle2, rectangle6,
  rectangle7 in their original left-to-right arrangement.
- Work: rectangle1, rectangle4, rectangle9, rectangle10 (805:2189).
- Bundle: same five campaign images with `pixel-book-go.png` (810:2271).
- Final CTA: `8.png` (805:2190).
- SVGs: elements (arrow), elements1–4 (social profiles), elements5–6 (checks),
  elements7 (FAQ plus). Exported intrinsic SVG dimensions are retained.

`next/font/local` scopes/preloads existing Aeonik TRIAL Regular, Bold and Regular
Italic, plus locally downloaded Cairo Regular and SemiBold, to this route.
Font measurement waits for `document.fonts.ready`. Other pages keep their fonts.

## Motion and interactions

`useLaunchMotion` provides a distinct sequence for each of the ten sections:
hero typography and masked image; independent statement copy/image entrances;
heading/copy/laptop showcase; sequenced pricing; campaign source and five-image
gallery; second pricing; individual work reveals; coordinated bundle layers;
FAQ rows; final heading/copy/button. No pinning, altered final coordinates, or
continuous decorative motion. Media-query contexts clean up on resize/unmount;
reduced motion leaves everything visible. Image-load refreshes are coalesced.

Every service CTA opens the same accessible native dialog with its package
selected. Validation checks name, business, and email/WhatsApp contact. The
existing verified business WhatsApp link receives an encoded enquiry. The UI
explains that the visitor must press Send in WhatsApp. Popup-blocking feedback
includes a prepared link and mailto fallback. No network submission or payment
is fabricated. Dialog keyboard focus, Escape and focus return are supported.

FAQ uses native details/summary with GSAP height enhancement and ARIA controls.
Only interaction content absent from Figma (FAQ answers and enquiry dialog) uses
the established offer terms. The default closed page follows the supplied text.

## Source inconsistency retained

Figma prices are AED 899 / AED 599 / AED 1299 with “Save 199 AED.” Its first FAQ
question still says “Is the landing page really AED 750?” That visible question
is preserved. The answer clarifies the displayed AED 899 price. The owner should
resolve this inconsistency in Figma before changing the visible question.

The design checker’s gradient-text finding is narrowly suppressed for
`components/LaunchPage.css` because the user explicitly requires the source
gradients. No other design rule is suppressed.

## Verification

Start Next and a headless Chrome instance with remote debugging enabled, then:

```powershell
$env:LAUNCH_TEST_ORIGIN='http://127.0.0.1:3123'
node scripts/verify-launch.mjs
$env:SEO_TEST_ORIGIN=$env:LAUNCH_TEST_ORIGIN
node scripts/verify-seo.mjs
npm run build
git diff --check
```

`LAUNCH_CHROME_ORIGIN` defaults to `http://127.0.0.1:9338`. Screenshots default to
the OS temporary directory `mugran-launch-qa`; override with `LAUNCH_QA_DIR`.
The browser check covers 375/390/768/1024/1440px, source geometry, every visible
asset, enquiry validation and handoff interception, focus trapping/return,
keyboard FAQ, reduced motion, complete desktop/mobile scroll sequences,
unchanged animation layout height, and server-rendered no-JS content.

There are no separate lint or TypeScript scripts in this JavaScript repository.
Next's production build runs its configured lint/type validity stage. The
existing worker-thread build configuration can emit a revalidateTag IPC URL
diagnostic during static generation even when the build exits successfully.

Final production validation (2026-11-08): build exited 0; all five browser widths
passed; all 47 image instances loaded; 1440px geometry matched the table above;
dialog/FAQ keyboard controls, handoff validation, reduced motion, completed
desktop/mobile animation states, no-JS content and pathname-aware site chrome
passed without browser runtime exceptions. Existing SEO checks passed for 16
canonical routes, 19 internal targets, three aliases, robots and sitemap.
