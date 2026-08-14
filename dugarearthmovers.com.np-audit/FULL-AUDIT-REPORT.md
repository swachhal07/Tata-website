# Full SEO Audit — dugarearthmovers.com.np

- **Audited:** 14 August 2026
- **Target:** https://www.dugarearthmovers.com.np/
- **Business type detected:** Local Service / B2B dealer — multi-location heavy equipment distributor (authorised Tata Hitachi distributor in Nepal, MV Dugar Group). Hybrid: brick-and-mortar branches + service-area coverage.
- **Stack:** Vite + React 19 SPA, `react-router-dom` v7, client-side rendering only. Hosted on Vercel behind Cloudflare. Backend API on Render.
- **Pages audited:** 10 public routes (`/`, `/products`, `/about`, `/leadership`, `/compare`, `/contact`, `/blog`, `/blog/:slug`, `/privacy`, `/terms`) + 5 admin routes.

---

## Executive Summary

### SEO Health Score: **22 / 100**

| Category | Weight | Score | Weighted |
|---|---|---|---|
| Technical SEO | 22% | 30 | 6.6 |
| Content Quality | 23% | 48 | 11.0 |
| On-Page SEO | 20% | 12 | 2.4 |
| Schema / Structured Data | 10% | 0 | 0.0 |
| Performance (CWV) | 10% | 8 | 0.8 |
| AI Search Readiness | 10% | 8 | 0.8 |
| Images | 5% | 15 | 0.8 |
| **Total** | **100%** | | **22.4** |

The site is well-designed and the copy is genuinely good — human-written, specific, and differentiated. Almost none of that is currently visible to search engines. The root cause is architectural: it is a pure client-side SPA that ships a 46-byte-of-content HTML shell to every crawler, with one hardcoded `<title>` for all ten pages and zero meta tags, zero canonicals, and zero structured data.

### Top 5 Critical Issues

1. **Every page serves an identical, empty HTML shell.** The raw response for every URL is the same 830-byte document with `<div id="root"></div>` and no content. Google can render JS, but does so on a delayed second pass and with no guarantees; Bing, and essentially every AI crawler, largely cannot.
2. **All 10 pages share one title: `Tata Hitachi Nepal`.** No meta descriptions, no canonical tags, no Open Graph or Twitter Card tags anywhere on the site. There is no head-management library in the dependency tree.
3. **Soft 404s on every unknown URL.** `/this-page-does-not-exist-12345` returns HTTP **200** with the shell and renders a completely blank page (1 word of text). Any crawler misstep or stale link creates an indexable empty page.
4. **Homepage transfers ~47 MB of images.** A single hero slide (`ZX220LC Ultra 6.jpg`) is **29.3 MB** at 5760×3840, displayed at 935×816. A second is 13 MB at 6000×4000. Plus a 22 MB autoplaying hero video. All seven hero slides load eagerly on first paint.
5. **`robots.txt` blocks the AI crawlers and Google's AI grounding agent.** Cloudflare's managed block list disallows `GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`, `Bytespider`, and `meta-externalagent`, plus `Content-Signal: ai-train=no`. The business is invisible to ChatGPT, Claude, Perplexity and excluded from Google AI Overviews grounding.

### Top 5 Quick Wins

1. Add per-route `<title>` + `<meta name="description">` + `<link rel="canonical">` (react-helmet-async or a small `useDocumentHead` hook) — ~2 hours, unlocks the single biggest ranking lever.
2. Ship a static `/public/sitemap.xml` with the 10 public URLs and reference it from `robots.txt`. Currently `/sitemap.xml` returns the SPA shell as `text/html`.
3. Compress the hero images. Re-exporting the 29 MB and 13 MB JPEGs to ~200 KB WebP at 1920px wide removes ~42 MB from the homepage with no visible quality loss.
4. Add `LocalBusiness` + `Organization` JSON-LD with the 10 branch locations already in `frontend/src/data/locations.js` — the data is structured and ready.
5. Add an `<h1>` to the homepage hero and `alt` text to the 6 unlabelled homepage images.

---

## Technical SEO — 30/100

### What works
- HTTPS enforced; `strict-transport-security: max-age=63072000` present.
- Apex → www canonicalised correctly with a `308` (`https://dugarearthmovers.com.np/` → `https://www.dugarearthmovers.com.np/`); `http://` also 308s.
- `<html lang="en">` set.
- Fast server response: TTFB 67 ms, Vercel edge cache HIT.
- Clean, readable URL structure (`/products`, `/about`, `/blog/:slug`) — no query-string or ID noise.
- Admin routes (`/admin`, `/admin/*`, `/login`) are auth-gated and render nothing to a crawler, so no accidental exposure.

### Findings

**[Critical] Client-side rendering only — no HTML content for crawlers**
Raw `GET /` returns 830 bytes: head + `<div id="root"></div>`. Rendered DOM contains 6,663 characters of text on the homepage. Everything a search engine ranks on exists only after JS execution. `vercel.json` rewrites `/((?!api/).*)` → `/index.html`, so this applies to all 10 routes.
*Fix:* Pre-render at build time. Lowest-friction option for this stack is `vite-plugin-prerender` / `vite-react-ssg`, which emits real static HTML per route into `dist/` while keeping the existing SPA behaviour after hydration. Higher-effort option is migrating to Next.js or Remix.

**[Critical] Soft 404s — unknown URLs return 200**
`https://www.dugarearthmovers.com.np/this-page-does-not-exist-12345` → HTTP 200, blank body after render. `App.jsx` has no catch-all `<Route path="*">`.
*Fix:* Add a `<Route path="*" element={<NotFound />} />` inside the `<Layout />` route with a `<meta name="robots" content="noindex">`, and — once pre-rendering is in place — return a real 404 status for unmatched paths.

**[High] No XML sitemap**
`/sitemap.xml` returns `text/html` (the SPA shell) with status 200. Same for `/sitemap_index.xml`.
*Fix:* Generate `frontend/public/sitemap.xml`. Blog posts are dynamic (`GET /api/posts`), so either build the sitemap at deploy time from the API or serve it from the backend.

**[High] `robots.txt` is Cloudflare-managed and blocks AI crawlers**
The file is entirely Cloudflare's managed block. It correctly `Allow: /` for `User-agent: *` and sets `Content-Signal: search=yes`, so Googlebot and Bingbot are fine. But it disallows `GPTBot`, `ClaudeBot`, `CCBot`, `Google-Extended`, `Applebot-Extended`, `Bytespider`, `meta-externalagent`, and `CloudflareBrowserRenderingCrawler`. It also contains no `Sitemap:` directive.
*Fix:* This is a business decision (see AI Search Readiness). At minimum, add a `Sitemap:` line. Note the managed block will overwrite a hand-edited file unless the Cloudflare AI-crawler setting is changed in the dashboard.

**[Medium] Missing security headers**
`content-security-policy`, `x-frame-options`, `x-content-type-options`, `referrer-policy`, `permissions-policy` are all absent. Not direct ranking factors, but `x-content-type-options: nosniff` and a `referrer-policy` are low-cost trust signals and the site accepts form submissions.
*Fix:* Add a `headers` block to `vercel.json`.

**[Medium] No `llms.txt`** — `/llms.txt` returns the SPA shell. Optional and ignored by Google, but a cheap signal for AI assistants if the crawler policy is relaxed.

**[Low] Build output is 149.58 MB** — Vercel deploys fine, but this is a symptom of the unoptimised asset pipeline, and it slows every build and deploy.

---

## Content Quality — 48/100

### What works
- Copy is genuinely distinctive and human — "FIVE SPECIALTIES. One yard.", "WE DON'T DISAPPEAR AFTER DELIVERY. We stay with the machine." No AI-generic filler.
- Real experience signals: named branch contacts with phone numbers across 10 cities, named leadership, real machine specifications sourced from manufacturer brochures, 10 downloadable OEM PDFs.
- Strong E-E-A-T raw material: five-generation family business, named authorised distributor relationship, on-site operator reviews.
- Privacy (656 words) and Terms (774 words) are substantive and site-specific, not boilerplate.
- Every page has a unique, well-written `<h1>` — except the homepage.

### Findings

**[High] Homepage has no `<h1>`**
The DOM heading tree starts at `H2: FIVE SPECIALTIES. One yard.` The hero (`HeroSlideshow.jsx`) renders only a video, images, and navigation arrows — no text overlay at all. The most important page on the site has no primary heading and no above-the-fold copy naming the business, the brand, or the country.
*Fix:* Add a hero overlay with `<h1>Tata Hitachi Excavators & Backhoe Loaders in Nepal</h1>` plus a one-line subhead.

**[High] Thin content on several pages**
Rendered word counts: `/blog` 104 words (see the note below — the posts exist but load late), `/leadership` 159, `/about` 443, `/contact` 471, `/compare` 490, `/privacy` 656, `/terms` 774, `/products` 814. For a market where buyers research heavily, `/products` at 814 words across **10 machines** is very thin — roughly 80 words per machine.
*Fix:* Individual product pages at `/products/zaxis-650h` etc. are the single biggest content opportunity. The spec data in `frontend/src/data/products.js` is already structured for it, and each machine already has an OEM brochure to expand from.

**[High] No individual product URLs**
All 10 machines live on one `/products` page with `#excavators`-style anchors. Every commercial-intent search ("ZAXIS 220LC price Nepal", "Shinrai backhoe loader Nepal") has no page to land on.

**[Medium] Blog looks empty to a crawler**
`/blog` measured at 104 words during the audit. The API in fact serves **five published posts** — `frontend/src/data/blog.js` has no bundled fallback, so the page renders its skeleton and only fills in once `GET /api/posts` returns. The backend sleeps on Render's free tier, so a cold request can take ~30 seconds; anything that samples the page before then sees an empty blog. That is what a crawler gets.
*Fix:* the content exists and is fine — the problem is delivery. Pre-rendering or an SSR'd blog index solves it; failing that, keep the backend warm.

**[Medium] No author attribution or dates on content**
`BlogPost.jsx` renders posts but no `Person` byline or credential. For E-E-A-T in a technical B2B vertical, "reviewed by [service head], 15 years on Tata Hitachi machines" is worth more than the article itself.

**[Medium] No service-area or location landing pages**
Ten branches with named contacts exist in `locations.js` but only appear as a list and map on `/contact`. "Excavator service Pokhara", "Tata Hitachi parts Biratnagar" have nowhere to rank.

---

## On-Page SEO — 12/100

### Findings

**[Critical] One title tag for the entire site**
All 10 public routes return `<title>Tata Hitachi Nepal</title>`, hardcoded in `frontend/index.html`. It is 19 characters — well under the ~60-character budget — and carries no service, product, or location terms.

**[Critical] No meta descriptions anywhere**
The only `<meta>` tags in the document are `charset` and `viewport`. Google will scrape a snippet from rendered content, but with no `<h1>` and no intro copy on the homepage there is very little to scrape.

**[Critical] No canonical tags**
Zero `<link rel="canonical">` on any page. The apex 308 handles the main duplication risk, but `/products#excavators` style anchors and any future UTM traffic have no canonical anchor.

**[Critical] No Open Graph or Twitter Card tags**
Every share of any URL — WhatsApp, Facebook, LinkedIn, Viber — renders as a bare link with no image, no title beyond "Tata Hitachi Nepal", no description. In Nepal's B2B market where WhatsApp sharing drives referral traffic, this is a direct commercial loss.

**[High] No head-management library installed**
`frontend/package.json` has no `react-helmet-async`, `@unhead/react`, or equivalent. There is currently no mechanism to set per-page meta.

### Suggested titles and descriptions

| Route | Title (≤60ch) | Description (≤155ch) |
|---|---|---|
| `/` | Tata Hitachi Nepal — Excavators & Backhoe Loaders \| Dugar | Authorised Tata Hitachi distributor in Nepal. Excavators, backhoe loaders, mining equipment, genuine parts and service across 10 branches. |
| `/products` | Tata Hitachi Excavators & Backhoes in Nepal — Full Range | ZAXIS excavators, EX Prime series and Shinrai backhoe loaders. Specs, brochures and pricing enquiries from Nepal's authorised dealer. |
| `/about` | About Dugar Earthmovers — Tata Hitachi Nepal Since 5 Gens | Five generations of the Dugar family, authorised Tata Hitachi distributor for Nepal. Sales, service and genuine parts nationwide. |
| `/compare` | Tata Hitachi vs Other Excavators — Nepal Comparison | Side-by-side specifications and service comparison. Why contractors in Nepal choose Tata Hitachi over the alternatives. |
| `/contact` | Contact — Tata Hitachi Service & Sales Across Nepal | 10 branches from Biratnagar to Dhangadi. Direct numbers for sales, service and parts in your district. |
| `/leadership` | Leadership — The People Behind Dugar Earthmovers | Meet the family and management running Tata Hitachi sales and service in Nepal. |
| `/blog` | Notes from the Ground Up — Tata Hitachi Nepal Blog | Machine guides, maintenance advice and site notes from Nepal's authorised Tata Hitachi team. |

---

## Schema / Structured Data — 0/100

**[Critical] Zero structured data on the entire site.** `document.querySelectorAll('script[type="application/ld+json"]').length === 0` on every route.

Missing, in priority order:

1. **`Organization` / `AutoDealer`** (sitewide) — legal name, logo, `sameAs` to the MV Dugar Group site, contact points. Establishes entity identity for Knowledge Panel eligibility.
2. **`LocalBusiness`** × 10 branches — every field needed is already in `frontend/src/data/locations.js`: city, `lat`/`lng`, contact name, phone, Google Maps URL. This is the highest-ROI schema on the site and is a data-transform, not new research.
3. **`Product`** × 10 machines — `name`, `brand: Tata Hitachi`, spec `additionalProperty` entries, `image`. Currently blocked by the lack of individual product URLs.
4. **`FAQPage`** — the homepage already renders an FAQ section (`Faqs.jsx`, "LET'S CLEAR IT UP.") with no markup on it.
5. **`BreadcrumbList`** — `/blog/:slug` in particular.
6. **`Review` / `AggregateRating`** — `Reviews.jsx` renders real operator reviews with no markup. Note Google restricts self-serving review snippets for `LocalBusiness`; apply to `Product` where genuine.
7. **`BlogPosting`** — `headline`, `datePublished`, `author`, `image` on `/blog/:slug`.

---

## Performance (Core Web Vitals) — 8/100

Lab measurement, desktop, warm Vercel edge cache, from Kathmandu:

| Metric | Measured | Threshold | Verdict |
|---|---|---|---|
| TTFB | 67 ms | <800 ms | Good |
| FCP | 192 ms | <1.8 s | Good |
| LCP (lab) | 216 ms | <2.5 s | Misleading — see below |
| CLS | 0.000 | <0.1 | Good |
| **Total transfer** | **46.9 MB** | <2 MB | **Catastrophic** |
| Requests | 18 | — | Fine |

The 216 ms LCP is a lab artifact: the LCP element resolved against an early-painting overlay while 47 MB of imagery was still streaming. On a Nepali 4G connection at ~10 Mbps, 47 MB is roughly **38 seconds** of download. No CrUX field data was available to confirm (site likely below the reporting threshold).

**[Critical] 46.9 MB of images on the homepage.** Every byte is `img` — scripts and CSS are effectively free by comparison.

Worst offenders as served:

| Asset | Size | Natural | Displayed | Waste |
|---|---|---|---|---|
| `ZX220LC Ultra 6.jpg` | **29.3 MB** | 5760×3840 | 935×816 | ~99% |
| `ZAXIS 140H Ultra.JPG` | **13.0 MB** | 6000×4000 | 935×816 | ~99% |
| `IMG_5291.JPG` | 2.3 MB | 4032×2268 | 435×327 | ~99% |
| `IMG_5286.JPG` | 1.5 MB | 4032×2268 | 435×327 | ~99% |
| `hero.mp4` | 22.1 MB | — | fullbleed | `preload="auto"`, autoplay |

**[Critical] All 7 hero slides load eagerly.** `HeroSlideshow.jsx` renders every slide as a mounted `<div>` with `opacity-0`, so the browser fetches all six images plus the video immediately, even though only slide 0 is visible and there is no auto-advance.

**[High] No `loading="lazy"` anywhere.** Every image on every page reports `loading: "auto"`.

**[High] No responsive images.** No `srcset`, no `sizes`, no `<picture>`. Mobile users download the same 29 MB file as desktop.

**[High] No `width`/`height` on `<img>`.** CLS is currently 0 only because the layout is fully CSS-constrained; this is fragile.

**[Medium] 22 MB hero video with `preload="auto"` and autoplay.** Add a `poster` and switch to `preload="metadata"`; consider a compressed 1080p H.264 re-encode (a 15-second loop at reasonable quality should be 2–3 MB).

**Recommended fix:** run every asset in `frontend/src/assets/` through a build-time image pipeline (`vite-imagetools` or `@vite-pwa/assets-generator`), emitting WebP/AVIF at 1920/1280/640 widths. Realistic target: **47 MB → under 1.5 MB.**

---

## Images — 15/100

- **Homepage: 6 of 15 images have empty `alt`.** All six are hero slides (`alt=""` hardcoded in `HeroSlideshow.jsx` line ~112). Decorative-empty-alt is defensible for a pure background, but these are the product photos that define the page.
- **About page: 4 of 35 images have empty `alt`.**
- Products, Leadership, Compare, Contact, Blog: alt coverage is complete. Existing alts are descriptive ("Tata Hitachi Construction Machinery", "Service & Maintenance").
- **Formats:** mixed and unoptimised — `.JPG`, `.jpeg`, `.png`, one `.webp`. The 1.1 MB `zaxis 370.png` is a photo stored as PNG.
- **Filenames:** several are non-descriptive and hurt image search — `IMG_5291.JPG`, `IMG_5286.JPG`, `WhatsApp Image 2026-06-23 at 9.56.05 AM.jpeg`. Spaces in filenames also force URL-encoding on every request.
- **No image sitemap.**

---

## AI Search Readiness (GEO) — 8/100

**[Critical] AI crawlers are blocked at `robots.txt`.**
Cloudflare's managed block disallows `GPTBot` (ChatGPT), `ClaudeBot` (Claude), `CCBot` (Common Crawl — feeds many models and Perplexity's index), `Google-Extended` (Gemini + **AI Overviews grounding**), `Applebot-Extended`, `Bytespider`, and `meta-externalagent`. Combined with `Content-Signal: ai-train=no, use=reference`.

The consequence: when a contractor asks ChatGPT or Google's AI Overview "who sells Tata Hitachi excavators in Nepal", this site cannot be cited. Competitors who allow crawling can.

*Decision required.* `Google-Extended` is the one to reconsider first — it governs AI Overviews grounding, which appears directly in the Google results page a buyer already sees. Unblocking it does not affect classic Search ranking either way, but it is the difference between being cited and being absent in the AI answer above the organic results. If the concern is model training rather than citation, `Content-Signal: ai-train=no` already expresses that reservation while permitting `search` and grounding. Change this in the Cloudflare dashboard (AI Crawler Control), not by editing the file — the managed block regenerates.

**[Critical] Content is invisible to AI crawlers even if unblocked.** Every AI crawler listed above fetches raw HTML and does not execute JavaScript. Even with `robots.txt` opened up, they would receive the 830-byte empty shell. Pre-rendering is a prerequisite for any GEO work here.

**[High] No structured data** — the strongest machine-readable signal for entity resolution is entirely absent.

**[Medium] Low passage-level citability.** The copy is stylish but rhetorical ("FIVE SPECIALTIES. One yard."). AI systems cite self-contained factual passages. "Dugar Earthmovers is the authorised Tata Hitachi distributor for Nepal, operating 10 service and parts branches from Biratnagar to Dhangadi" is citable; the current headline is not.

**[Medium] No `llms.txt`.**

**[Low] Weak brand-mention footprint** — the site's only external outbound authority link is to `mvdugar.com`.

---

## Local SEO

The business is a strong local-SEO candidate that is doing almost none of it.

### What exists
- 10 service/parts branches with city, coordinates, named contact, and direct phone — structured in `locations.js` and admin-managed.
- 7 additional named sales contacts across Biratnagar, Birgunj, Pokhara, Nepalgunj, Kathmandu.
- An interactive MapLibre map on `/contact`.
- Google Maps deep links per branch.

### Findings

**[High] NAP is incomplete and inconsistent.** The footer gives only "Kathmandu, Nepal" — no street address, no postal code, no opening hours anywhere on the site. `locations.js` has coordinates but no `streetAddress` field.

**[High] No `LocalBusiness` schema** (see Schema section).

**[High] No per-location pages.** Ten branches, zero URLs to rank for "[service] [city]" queries.

**[Medium] Generic Gmail address as primary contact.** `sales.tatahitachinp@gmail.com` on a business with its own domain is a weak trust signal for both users and local ranking. A `@dugarearthmovers.com.np` address costs nothing and reads as more established.

**[Medium] Google Business Profile status not verifiable from the site** — no GBP links, no review widgets pulling from Google. Worth confirming that each of the 10 branches has a claimed, categorised GBP.

---

## Search Experience (SXO)

- **Page-type mismatch on `/products`.** Commercial queries for a specific machine model expect a product detail page. A single category listing with anchors cannot satisfy that intent — this is why individual product URLs are the highest-value content investment.
- **No above-the-fold value proposition.** The hero is pure imagery. A first-time visitor arriving from search sees a video with no statement of who this is or what they sell until they scroll.
- **Contact path is good.** `tel:` links throughout, named humans per branch, an enquiry form. Conversion mechanics are stronger than acquisition mechanics.
- **Persona gap — the parts buyer.** "Genuine Parts" is one homepage tile with no destination page, despite being a high-frequency, high-intent repeat-purchase query.

---

## Verification Notes & Limits

- Indexation status could not be verified — `WebSearch` was unavailable in this session, and no Google Search Console credentials are configured. Confirm indexed page count via GSC.
- No CrUX field data; all CWV figures above are lab measurements from a single desktop session on a warm cache.
- Performance measured from Kathmandu on a fast connection; real-world Nepali mobile figures will be substantially worse.
- Screenshots were not captured to disk (`screenshots/` is empty).
- The `/blog/:slug` route was not audited with live content — the blog is API-driven and currently renders no posts.
