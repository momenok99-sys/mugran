# Mugran Creative technical SEO and GEO audit

Audit date: 21 October 2026. Branch: `seo-technical-geo-audit`. No deployment was performed.

## Repository and production baseline

| Area | Finding |
| --- | --- |
| Framework | Installed Next.js 14.2.35, React 18, App Router. No SEO package. |
| Routes | English and Arabic are available at `/en/...` and `/ar/...`. Six unprefixed English aliases also exist. There are 24 page files. |
| Rendering | Public text and headings are present in server HTML. Client components provide interactions and animation. The audit build changed page delivery from static to dynamic SSR to emit route-specific HTML language and metadata. |
| Metadata before | One Arabic title and description in the root layout applied to every route. No route canonical, Open Graph, Twitter card, or language alternate. Root HTML was always `lang="ar" dir="rtl"` before hydration. |
| Crawl endpoints before | Repository had no robots or sitemap route. Production returned HTTP 404 for both `/robots.txt` and `/sitemap.xml` during this audit. |
| Structured data before | None found. |
| Host | Production `https://mugranagency.com/` returns one HTTP 308 to `https://www.mugranagency.com/`. The preferred host is already configured at deployment level. |
| Redirects | No redirect rules in `next.config.js`. Production host redirect is external to this repository. Default Next.js trailing-slash normalization remains in place. |
| Public content | Most page headings and copy are in initial HTML. `/work`, `/en/work`, and `/ar/work` are an exception: they pass `page="thinking"`, while the component renders the body only for `page="work"`. They currently show the shared shell without work content. |
| SEO dependencies | None. Existing dependencies include GSAP, Three.js, Framer Motion, OGL, React Icons. |
| Performance risks | Large video files (about 29 MB, 25 MB, and 19 MB), large service images (up to about 9.7 MB), Google Fonts CSS import, multiple animation/3D packages, and now per-request server rendering. Field LCP, INP, CLS, and server timing were not available. |

## Prioritized findings and treatment

| Priority | Issue | Treatment |
| --- | --- | --- |
| P0 | Every page inherited the same Arabic metadata and HTML language. | Route-aware Next.js metadata, canonical, alternates, social cards, and HTML language/direction implemented. |
| P0 | Production robots and sitemap endpoints returned 404. | Added Next.js metadata routes; sitemap lists only 16 indexable English/Arabic URLs. No invented modification dates. |
| P0 | Duplicate unprefixed aliases and `/en` homepage can compete with canonical pages. | Added canonicals and `noindex, follow` on aliases while preserving their URLs and behavior. `/` remains the English homepage canonical. |
| P0 | Three work URLs have no page body. | Excluded from sitemap and marked noindex. Repair requires approval because it would reveal visible content. |
| P1 | No structured data. | Added one stable Organization entity plus WebSite and WebPage nodes using verified name, URL, email, and Dubai/UAE operating area. No reviews, offices, or social profile claims. |
| P1 | Search crawler policy was implicit because robots endpoint was absent. | Added a general public allow rule and sitemap reference. This permits Googlebot, Bingbot, OAI-SearchBot, and PerplexityBot without changing any separate training-crawler policy. |
| P1 | Metadata strings and URLs needed translation mapping. | Added unique titles and descriptions for existing equivalent pages only. |
| P2 | Large media and client bundles may affect Core Web Vitals. | No asset, animation, font, or visual change made. Measure field data first. |
| P2 | No dedicated UI/UX, mobile app, or landing-page service route. | Recommend only after real scope, examples, and page copy are approved. |

## Implementation details

- `app/layout.jsx`: server route metadata, initial HTML `lang`/`dir`, JSON-LD.
- `middleware.js`: passes the request pathname to the server layout. Static assets and API paths are excluded.
- `lib/seo.js`: centralized route map, titles, descriptions, canonicals, alternates, social metadata, robots metadata, schema.
- `app/robots.js`: crawl policy and sitemap location.
- `app/sitemap.js`: 16 real indexable translated URLs with reciprocal language links.
- `scripts/verify-seo.mjs`: HTTP validation of rendered SEO output.

No CSS, images, videos, typography, copy, GSAP timelines, or component animation logic were changed for this SEO task. Existing uncommitted services-page work and configuration changes were left untouched.

## Validation

- Production: www homepage and `/en/about` return 200; non-www homepage redirects directly to www with 308; robots and sitemap return 404 before deployment.
- Production build: exits successfully. Next 14 prints a `localhost:undefined` cache IPC warning while generating static robots/sitemap routes; both generated bodies were inspected and the running production build served them correctly.
- Local HTTP verification: 16 canonical pages return 200 with unique title and description, matching canonical, reciprocal English/Arabic alternates, correct initial `html` language/direction, server-rendered heading, parseable JSON-LD, and no accidental noindex. Three aliases are noindex with canonical. Three empty work routes are noindex. An unknown route returns 404 with noindex and no homepage canonical. Robots and sitemap validated.
- Visual comparison: production and local `/en/about` desktop (1440×900) and mobile (390×844) screenshots matched in visible layout under reduced motion; hero artwork was at a different frame. Full route and animation parity and browser-console/hydration checks were not verified.
- TypeScript: no TypeScript source or `tsconfig.json`; build's type check passed. No ESLint or automated test script is configured in `package.json`. `git diff --check` passed.

## Remaining decisions and risks

1. Approve a visible content fix for `/work` if this route should publish studies or projects. The current component already has a `Thinking` view, but enabling it changes what visitors see. Then remove noindex and add the route to the sitemap.
2. Dynamic SSR for route-specific root HTML language and metadata can increase TTFB relative to the previous static build. Measure production response time and CrUX after deployment. A later route-layout refactor could restore static output but is too invasive for this nonvisual pass.
3. The unprefixed aliases can render Arabic after hydration for visitors with a saved language preference, while their initial HTML and canonical describe English. They are noindex. A future locale-routing decision should resolve this without changing behavior unexpectedly.
4. Confirm whether all currently linked social accounts are official before adding any `sameAs` references. None were added.
5. Confirm actual industries, case studies, and distinct outcomes before producing industry claims or more service pages.
6. Verify production robots, sitemap, canonicals, and hreflang after a reviewed deployment. No external webmaster or analytics account was accessed.

## Service-page opportunities

The existing brand page serves much of “Branding Agency Dubai”; web serves “Web Design Agency Dubai” plus UX/UI and landing pages; creative serves campaign direction. Improve those pages only with approved, real service detail and relevant portfolio evidence. A separate UI/UX page could target product research, flows, and interface systems if those are real deliverables. A mobile app page needs confirmed app-design work and examples. A landing-page page needs distinct conversion-process detail and examples. Avoid standalone pages that only repeat the web page with a Dubai modifier.

Each approved page should have original scope, real project evidence, internal links to its parent service and related work, and a clear contact path. No new page was created.

## External measurement checklist

- Verify the www domain property in Google Search Console and Bing Webmaster Tools; submit the sitemap; monitor indexed URLs, alternate/canonical selection, queries, and impressions.
- Confirm GA4 is installed and consent behavior is correct. Define organic contact email clicks, WhatsApp clicks, and completed lead submissions as measurable events. The current forms open an email client, so a client-side submit event alone does not prove delivery.
- Confirm Google Business Profile eligibility and actual business details before creating or editing a listing. Do not add an unverified street address.
- Track identifiable AI referral sources separately in analytics where referrer data is available; do not treat missing referrers as zero AI discovery.
- Review mobile and desktop CrUX/PageSpeed field data at the 75th percentile for LCP ≤ 2.5 s, INP ≤ 200 ms, and CLS ≤ 0.1. Check large media, font loading, JS, and server response before changing visuals or motion.

## Rollback

This branch is uncommitted. To revert only this SEO work, restore `app/layout.jsx` from `main` and remove `middleware.js`, `lib/seo.js`, `app/robots.js`, `app/sitemap.js`, `scripts/verify-seo.mjs`, and this report. Preserve the pre-existing uncommitted services, assets, and configuration files. If deployed later, roll back the SEO commit or deployment and recheck robots/sitemap and canonical headers.
