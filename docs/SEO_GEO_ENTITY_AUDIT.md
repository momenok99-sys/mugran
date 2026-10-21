# Mugran Creative: SEO, GEO, and digital entity audit

**Audit date:** 21 October 2026. **Branch:** `seo-technical-geo-audit`. **Status:** local changes only; no deployment or external account changes. The 18-prompt AI visibility baseline below was supplied by the owner.

## Executive findings

| Priority | Finding | Evidence | Action |
| --- | --- | --- | --- |
| P0 | `/work`, `/en/work`, and `/ar/work` have a hero but no portfolio body and are noindex. | `app/work/page.jsx` passes `page="thinking"`; `MugranStudio` renders the Thinking body only when `page === 'work'`. Production `/en/work` is HTTP 200 with `noindex, follow`. | Keep noindex. Review and approve real projects or the existing clearly labeled independent study before enabling content. |
| P1 | Official profiles were absent from Organization schema. | Owner supplied four official profile URLs; prior `Organization` lacked `sameAs`. | Added all four via a centralized identity config, with one stable `@id`. |
| P1 | WhatsApp was an official visible link but absent from structured contact data. | Owner supplied Business contact; footer already linked to it. | Added a `ContactPoint` with the WhatsApp URL, number, and `en`/`ar` languages. WhatsApp is not in `sameAs`. |
| P1 | English footer and studio navigation led to noindex aliases. | Source links resolved to `/about`, `/services`, etc. | Pointed them to existing `/en/...` canonical routes. Visible labels and layout are unchanged. |
| P1 | Site has no publicly visible client portfolio evidence. | Current work route contains no project body. Service images and concept language do not establish commissioned work. | Collect approved project facts, images, scope, dates, and permissions; distinguish concepts from client projects. |
| P2 | Mobile app, product visuals, and perfume intent coverage is uneven. | Services index mentions mobile apps and product campaigns; detail pages do not give equivalent depth, and perfume is not a visible claim. | Use the separate content proposal. Do not change metadata to imply unapproved specialties. |
| P2 | Field Core Web Vitals and actual index coverage cannot be confirmed from the repository. | No Search Console/CrUX access. Large media, client animation libraries, and dynamic SSR remain. | Measure before choosing performance changes. |

## Production and technical audit

Production was reachable during this audit. `www` homepage, representative English/Arabic service pages, `robots.txt`, and `sitemap.xml` returned HTTP 200. The non-www homepage returned one HTTP 308 to `www`. Current robots rules allow `/` and disallow `/api/`; the sitemap contains 16 English/Arabic canonical URLs and excludes work. The earlier audit's robots/sitemap 404 observation was pre-deployment and is no longer current.

All 16 canonical production pages were checked for HTTP success, expected canonical, English and Arabic alternates, correct HTML language, indexable robots metadata, and a server-rendered `h1`; no failures were found. Representative pages also had one title, correct `dir`, and one JSON-LD block. `/en/work` returned `noindex, follow`. No `X-Robots-Tag` or content security header appeared in the checked response. No repository Vercel configuration, security rule, or bot-blocking middleware was found. This does not verify unpublished Vercel/CDN policy or actual Google/Bing/OpenAI/Perplexity bot IP access.

Test requests bearing `Googlebot`, `bingbot`, `OAI-SearchBot`, and `PerplexityBot` user-agent strings all received HTTP 200 on `/en/services/web`. The site's general robots allow rule applies to them. Official crawler references: [Google](https://developers.google.com/search/docs/crawling-indexing/googlebot), [Bing](https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0), [OpenAI](https://developers.openai.com/api/docs/bots), [Perplexity](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). Search crawlers and separate model-training crawlers should not be conflated; no training-crawler preference was changed.

The repository uses Next.js 14.2.35 App Router. Initial HTML contains headings and service descriptions without waiting for GSAP. Navigation and service-index links use anchors; the homepage's interactive service selector uses buttons, but service destinations are also available through navigation. Meaningful service images have descriptive alt text; icons and decorative artwork generally use empty alt text. A full manual alt-text and heading review across every visual state remains outstanding. The local site retains six English aliases with canonical/noindex controls, and no redirect chain was introduced. Live indexing, orphan status in search engines, and selected canonicals require Search Console/Bing data.

The production HTML checked contained no GA4, GTM, Vercel Analytics, PostHog, or Plausible tag. The source repository has no analytics integration. This does not rule out account-side logs. Contact forms open a prefilled email client; their submit handler cannot prove that an inquiry was sent or received.

## Digital identity and links

The new `lib/businessIdentity.js` is the source for the Organization name, canonical site URL, email, social links, and WhatsApp data used by SEO and visible shared links. Organization `@id` remains `https://www.mugranagency.com/#organization`. WebSite publisher, WebPage about, and the three detail-page Service providers reference that entity. Each tested page has exactly one Organization node. No postal address, review, award, or registration claim was added.

The five owner-supplied destinations exactly match the visible shared links. HTTP checks: Instagram 200, TikTok 200, Facebook 301 to the same profile ID, WhatsApp 302 to the expected WhatsApp send URL, and LinkedIn 999 to an automated HEAD request. LinkedIn's response is an anti-automation limitation, not evidence of a broken owner-confirmed URL. Footer, mobile navigation, and contact social links opening new tabs use `rel="noopener noreferrer"`. The contact page lists the four social profiles; WhatsApp is visible in the shared footer and mobile navigation. Adding a contact-page WhatsApp button would be a visible UI change and is deferred.

The Organization, WebSite, WebPage, and Service JSON-LD follows the [Next.js JSON-LD guidance](https://nextjs.org/docs/14/app/building-your-application/optimizing/metadata#json-ld) and [Schema.org ContactPoint properties](https://schema.org/ContactPoint). Organization `sameAs` is appropriate for confirmed profiles under [Google's Organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization). Schema is descriptive metadata, not a guarantee of a rich result or AI citation.

Manual external profile improvements: use the canonical www URL in each profile bio; use the same business name, Dubai/UAE location, and accurate English/Arabic service summary; keep logo/handles consistent; check LinkedIn in a normal browser; confirm whether the Facebook redirect is the intended public profile; and consider Google Business Profile only if eligibility and business details can be verified. Do not manufacture citations, reviews, or addresses.

## GEO baseline interpretation

Owner-supplied exploratory baseline: 18 prompts; 2 citation-backed appearances (11.1%), 3 uncited appearances, 13 non-appearances; 5 total mentions (27.8%). The strongest prompt combined a startup, branding, and a website, and produced mentions on all three tested platforms. This small sample is insufficient to assign a single cause or estimate market-wide visibility.

Current production crawlability is evidenced by 200 responses, public robots access, and server-rendered service text. Index coverage and selected canonicals are unknown without webmaster data. Existing service pages are relevant to brand, web, and campaigns; app design and product-visual intents have less supporting detail. The missing public portfolio body weakens verifiable project evidence. Third-party authority and platform retrieval/citation behavior cannot be measured from this repository. The 18 observations should be repeated with fixed prompts, locale, date, logged citations, and control competitors after content and indexing changes, then interpreted as directional data only.

## Service intent and content gaps

| Search group | Existing target | Current fit | Missing evidence / next step |
| --- | --- | --- | --- |
| Branding / brand identity in Dubai, UAE | `/en/services/brand`, `/ar/services/brand` | Strong service scope: strategy, positioning, identity, systems. Metadata is specific. | Approved branding projects, business context, deliverables, and scope. Link from real cases to brand service. No new page yet. |
| Website development / landing pages | `/en/services/web`, `/ar/services/web` | Web development, UX/UI, and landing pages appear on the detail page; the services index is broader. | Process, technology and maintenance scope, real launched sites, and conversion approach. Separate landing-page page only with distinct examples. |
| UI/UX / digital products / mobile apps | Web pages above | UI/UX appears on detail and index; mobile app design appears on the services index but not the detail page's capabilities. | Confirm mobile app scope and project proof. Consider a differentiated app/product page only after approval. |
| Creative and product campaigns | `/en/services/creative`, `/ar/services/creative` | Campaign direction appears on detail; product campaigns and cinematic visuals appear on the services index. | Approved product-campaign case studies and production scope. Do not add a perfume-specific page or metadata without real perfume work. |
| Arabic commercial intents | Arabic counterparts above | Translated brand/web/creative pages and hreflang exist. | Native Arabic service detail and approved case-study terminology for apps, products, and local buying context. Do not duplicate English text with only a place modifier. |

See `SEO_CONTENT_PROPOSALS.md` for proposed visible copy, metadata changes, internal links, and approval dependencies. No new service page was created.

## Portfolio assessment

The route mismatch leaves the body of all three `/work` variants empty. Current source contains an independent study description explicitly saying it is not client work, but it is not published by these routes. Older data files also contain client-like records that are not rendered by the active page; they must not be presented as commissioned work without verification. Approval should cover client name, contract/permission to publish, scope, imagery, deliverables, dates, outcomes, and whether each item is a client engagement or internal concept. Before-and-after material needs authentic inputs and owner permission. Do not invent performance results or testimonials.

## Measurement plan

1. Verify the www domain in Google Search Console and Bing Webmaster Tools. Submit the existing sitemap, inspect the 16 canonical URLs, monitor queries, impressions, chosen canonicals, indexed pages, and crawl errors.
2. With approval, configure an existing or new GA4 property through the business's chosen consent setup. No tracker was installed in this pass. Track `contact_email_click`, `whatsapp_click`, and `form_mailto_open`; label the last event as an attempt, not a delivered lead. Reconcile qualified inquiries and wins in a CRM or manual log.
3. In GA4 or the chosen analytics system, segment organic search and identifiable AI referrals. ChatGPT search may pass `utm_source=chatgpt.com` per [OpenAI's publisher FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq); also inspect available Perplexity/Gemini referrers. Dark or stripped referrals remain unattributable.
4. Measure mobile and desktop field Core Web Vitals at the 75th percentile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1. No field values were available here. Compare video, font, image, JS, and dynamic SSR costs before any change that could affect the design.
5. Maintain a prompt log with platform, language, date, exact query, answer, citation URL, and competitor set. Track citation-backed appearances separately from uncited mentions.

## 30-day action plan

| Window | Priority | Action and owner dependency |
| --- | --- | --- |
| Days 1–3 | P0 | Review and deploy the verified nonvisual identity/schema changes. Recheck live JSON-LD, canonical links, robots, sitemap, and language routes. |
| Days 4–7 | P0 | Connect or confirm Search Console and Bing access; inspect indexing and chosen canonical URLs. Obtain access before claiming index coverage. |
| Week 2 | P0 | Decide whether `/work` publishes the independent study or approved client projects. Approve the visible content and its classification before removing noindex. |
| Week 2 | P1 | Approve analytics/consent setup; instrument clicks and inquiry reconciliation without treating mailto opens as submitted leads. |
| Week 3 | P1 | Collect one real brand, one web/product, and one campaign project if available; verify rights and label concepts honestly. Review proposed Arabic and English service copy. |
| Week 4 | P1 | Publish only approved differentiated service improvements, add relevant internal links, and repeat the 18-prompt exploratory test with matched conditions. |

## Validation and deployment

`npm run build` succeeded; Next.js still printed its existing `localhost:undefined` worker-thread cache warning during static endpoint generation. The generated robots and sitemap bodies served correctly from the local production server. `node scripts/verify-seo.mjs` passed for 16 canonical routes, 19 internal link targets, three aliases, one 404, JSON-LD parsing and graph relationships, official links, robots, and sitemap. `git diff --check` passed. No TypeScript, ESLint, or separate automated test script exists. No CSS, image, video, icon, logo, typography, GSAP timeline, or ScrollTrigger code changed. A live Schema Markup Validator check must wait for deployment. The connected Chrome browser surface was unavailable, so browser hydration/console checks and full visual comparison were not completed in this pass.

After owner review, deploy through the normal Vercel process; no push or deployment occurred here. Check live Organization `sameAs` and ContactPoint, three Service nodes, all 16 sitemap URLs, aliases, and work noindex. If needed, revert this branch's commit or deployment through the normal release process; the previous live identity schema and links will return. `docs/SEO_AUDIT.md` records the earlier baseline and should be read as historical where its production 404 finding differs from this audit.
