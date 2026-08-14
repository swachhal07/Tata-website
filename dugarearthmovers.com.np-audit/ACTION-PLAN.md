# Action Plan — dugarearthmovers.com.np

Ordered by impact-per-hour. Health score today: **22/100**. Phases 1–2 alone should land it near 65.

---

## Phase 1 — Critical Fixes (Week 1)

### 1.1 Per-page meta tags — `~2h` — **highest ROI on the site**
Install `react-helmet-async` (or write a 20-line `useDocumentHead` hook — no dependency needed for this scale).

Add to every page component: unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, `og:title` / `og:description` / `og:image` / `og:url` / `og:type`, `twitter:card=summary_large_image`.

Copy is drafted in `FULL-AUDIT-REPORT.md` → *On-Page SEO → Suggested titles and descriptions*.

Also produce one 1200×630 OG image (Tata Hitachi machine + logo + "Authorised Distributor, Nepal") and set it as the sitewide default.

### 1.2 Pre-render the SPA to static HTML — `~4–6h` — **unblocks everything else**
Add `vite-react-ssg` or `vite-plugin-prerender` to `frontend/vite.config.js`, listing the 10 public routes. Build emits real HTML per route into `dist/`; the app still hydrates and behaves as an SPA afterwards.

Verify with `curl https://www.dugarearthmovers.com.np/products | grep "EVERY MACHINE"` — content must be present without JS.

Without this, meta tags help but the body copy still depends on Google's deferred rendering pass, and Bing plus every AI crawler see nothing.

### 1.3 Fix the 47 MB homepage — `~3h`
- Re-export `ZX220LC Ultra 6.jpg` (29.3 MB) and `ZAXIS 140H Ultra.JPG` (13.0 MB) to WebP, max 1920px wide, quality 80. Expect ~200 KB each.
- Same for `IMG_5291`, `IMG_5286`, and `zaxis 370.png` (photo stored as PNG).
- In `HeroSlideshow.jsx`, render only the active slide plus the next one; add `loading="lazy"` to slides 2–6.
- Add a `poster` to the hero `<video>` and change `preload="auto"` → `preload="metadata"`. Re-encode `hero.mp4` (22 MB) to 1080p H.264 — target 2–3 MB.

Target: **47 MB → under 1.5 MB.**

Longer-term, add `vite-imagetools` so this happens automatically at build for all assets.

### 1.4 Add a real 404 route — `~30min`
`<Route path="*" element={<NotFound />} />` inside the `<Layout />` route in `App.jsx`, with `<meta name="robots" content="noindex">` and links back to `/products` and `/contact`. Currently unknown URLs return 200 and render blank.

### 1.5 Publish a sitemap — `~1h`
Write `frontend/public/sitemap.xml` covering the 10 public routes. Generate blog URLs at deploy time from `GET /api/posts`. Add `Sitemap: https://www.dugarearthmovers.com.np/sitemap.xml` to `robots.txt` — note the Cloudflare managed block regenerates the file, so add it via the Cloudflare dashboard or serve `robots.txt` from `public/` and disable the managed rule.

### 1.6 Homepage `<h1>` and hero alt text — `~1h`
Add a hero text overlay: `<h1>Tata Hitachi Excavators & Backhoe Loaders in Nepal</h1>` plus a one-line subhead naming the distributor relationship and branch coverage. Replace the six `alt=""` on hero slides with real machine descriptions.

### 1.7 Decide the AI crawler policy — `~15min decision`
In Cloudflare → AI Crawler Control, reconsider the `Google-Extended` block at minimum (it governs Google AI Overviews grounding, not model training). `Content-Signal: ai-train=no` already reserves training rights independently. See *AI Search Readiness* in the full report — this is a business call, not a technical one.

---

## Phase 2 — High-Impact Improvements (Weeks 2–3)

### 2.1 Individual product pages — `~1–2 days` — **biggest content lever**
Create `/products/:slug` for all 10 machines from the existing `frontend/src/data/products.js`. Each page: `<h1>` model name, 400–600 words (application, Nepali site conditions, service intervals), full spec table, brochure download, related machines, enquiry CTA.

This is what makes "ZAXIS 220LC Nepal price" and "Shinrai backhoe loader Nepal" rankable.

### 2.2 `LocalBusiness` + `Organization` JSON-LD — `~3h`
Transform `frontend/src/data/locations.js` into 10 `LocalBusiness` blocks (`name`, `address`, `geo`, `telephone`, `openingHours`, `parentOrganization`). Add a sitewide `Organization` / `AutoDealer` block with logo and `sameAs: ["https://www.mvdugar.com/"]`.

Prerequisite: collect street addresses and opening hours for each branch — not currently anywhere in the codebase.

### 2.3 `Product` schema on the new product pages — `~2h`
`name`, `brand`, `image`, `description`, spec `additionalProperty` array, `offers` with `availability` (omit `price` if not published).

### 2.4 `FAQPage` schema — `~1h`
`Faqs.jsx` already renders the Q&A on the homepage. Mark it up.

### 2.5 Per-location pages — `~1–2 days`
`/locations/kathmandu`, `/locations/pokhara`, etc. for the 10 service branches. Each: branch contact, address, hours, machines served, embedded map, 300+ words of genuinely local content (districts covered, typical projects). Link from `/contact`.

### 2.6 Security headers — `~30min`
Add to `vercel.json`: `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin`, `x-frame-options: SAMEORIGIN`, a `permissions-policy`.

### 2.7 Lazy-load and size all remaining images — `~2h`
`loading="lazy"` on everything below the fold, explicit `width`/`height` on every `<img>`, `srcset` on the large ones. Rename `IMG_5291.JPG` and `WhatsApp Image 2026-06-23 at 9.56.05 AM.jpeg` to descriptive, hyphenated, lowercase filenames.

---

## Phase 3 — Content & Authority (Month 2)

### 3.1 Launch the blog properly
The admin editor and `/blog` are built and empty. Publish 8–12 posts targeting real buyer questions: "How to choose an excavator size for Nepali hydropower sites", "Tata Hitachi service intervals in monsoon conditions", "Genuine vs aftermarket parts — what fails first". Add `author` with credentials and `datePublished`; add `BlogPosting` schema.

### 3.2 A genuine parts page
"Genuine Parts" is currently a homepage tile with no destination. High-frequency, high-intent, repeat-purchase query cluster with zero landing page.

### 3.3 E-E-A-T signals
Named author bios with years of experience on the `/leadership` and blog pages. Certifications, distributor agreements, project case studies with named clients (`/about` already says "WORKING WITH Nepal's best" — name them).

### 3.4 Move off the Gmail address
`sales.tatahitachinp@gmail.com` → `sales@dugarearthmovers.com.np`. Trust signal, costs nothing.

### 3.5 Google Business Profile
Verify all 10 branches have claimed, correctly-categorised GBP listings with matching NAP, photos, and an active review-request habit. Local pack visibility for this business will come more from GBP than from the website.

### 3.6 Case studies
Real projects with named contractors and machine models. Best available source of both unique content and credible external mentions.

---

## Phase 4 — Monitoring & Iteration (Ongoing)

- Set up **Google Search Console** and **Bing Webmaster Tools**; submit the sitemap. Nothing here is measurable until GSC is connected.
- Add **GA4** with conversion events on `tel:` clicks and enquiry-form submissions.
- Monthly: check GSC Coverage for soft-404 regressions and Core Web Vitals field data as CrUX starts reporting.
- Re-run this audit quarterly; baseline the SEO-critical elements so deploys can be diffed for regressions.
- Track rankings for the priority cluster: `tata hitachi nepal`, `excavator dealer nepal`, `[model] price nepal`, `excavator service [city]`.

---

## Summary Table

| # | Item | Effort | Impact | Phase |
|---|---|---|---|---|
| 1.1 | Per-page meta + OG tags | 2h | Critical | 1 |
| 1.2 | Pre-render SPA to static HTML | 4–6h | Critical | 1 |
| 1.3 | Fix 47 MB homepage payload | 3h | Critical | 1 |
| 1.4 | Real 404 route | 30m | High | 1 |
| 1.5 | XML sitemap + robots `Sitemap:` | 1h | High | 1 |
| 1.6 | Homepage `<h1>` + hero alts | 1h | High | 1 |
| 1.7 | AI crawler policy decision | 15m | High | 1 |
| 2.1 | Individual product pages | 1–2d | Critical | 2 |
| 2.2 | LocalBusiness + Organization schema | 3h | High | 2 |
| 2.3 | Product schema | 2h | High | 2 |
| 2.4 | FAQPage schema | 1h | Medium | 2 |
| 2.5 | Per-location pages | 1–2d | High | 2 |
| 2.6 | Security headers | 30m | Low | 2 |
| 2.7 | Lazy-load, srcset, filenames | 2h | Medium | 2 |
| 3.1 | Launch blog with real posts | Ongoing | High | 3 |
| 3.2 | Genuine parts landing page | 4h | Medium | 3 |
| 3.3 | E-E-A-T author/credential signals | 4h | Medium | 3 |
| 3.4 | Branded email address | 30m | Low | 3 |
| 3.5 | Google Business Profile × 10 | 1d | High | 3 |
| 3.6 | Case studies | Ongoing | Medium | 3 |
| 4.x | GSC / Bing / GA4 + monitoring | 2h setup | High | 4 |
