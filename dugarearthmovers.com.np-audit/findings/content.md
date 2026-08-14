# Content Quality — dugarearthmovers.com.np

**Score:** 48/100  |  **Audit weight:** 23%  |  **Audited:** 14 August 2026

## What works

- Copy is distinctive and human-written with no AI-generic filler.
- Strong raw E-E-A-T material: five-generation family business, named authorised distributor relationship, named branch contacts across 10 cities.
- Real machine specifications sourced from 10 downloadable OEM brochures.
- On-site operator reviews from real customers.
- Privacy (656 words) and Terms (774 words) are substantive and site-specific, not boilerplate.
- Every page except the homepage has a unique, well-written h1.

## Findings

### [High] No individual product URLs

All 10 machines live on one /products page with #excavators-style anchors. Commercial-intent searches such as 'ZAXIS 220LC price Nepal' have no page to land on.

**Fix:** Create /products/:slug for all 10 machines from the structured data already in frontend/src/data/products.js, 400-600 words each.

### [High] Thin content across several pages

Rendered word counts: /blog 104, /leadership 159, /about 443, /contact 471, /compare 490, /privacy 656, /terms 774, /products 814. /products covers 10 machines in 814 words - roughly 80 words per machine.

**Fix:** Expand each page; individual product pages are the highest-value fix (see below).

### [High] Homepage has no h1

The heading tree starts at H2 'FIVE SPECIALTIES. One yard.' HeroSlideshow.jsx renders only a video, images and nav arrows - no text overlay at all. The most important page has no primary heading and no above-the-fold copy naming the business, brand or country.

**Fix:** Add a hero overlay with <h1>Tata Hitachi Excavators & Backhoe Loaders in Nepal</h1> plus a one-line subhead.

### [Medium] No service-area or location landing pages

Ten branches with named contacts exist in locations.js but appear only as a list and map on /contact. Queries like 'excavator service Pokhara' have nowhere to rank.

**Fix:** Create /locations/:city pages for the 10 service branches with genuinely local content.

### [Medium] No author attribution or dates on content

BlogPost.jsx renders posts with no Person byline or credential. In a technical B2B vertical, a named reviewer with stated experience carries more E-E-A-T weight than the article itself.

**Fix:** Add author bios with credentials and datePublished, backed by BlogPosting schema.

### [Medium] Blog is effectively empty

/blog renders 104 words. frontend/src/data/blog.js has no bundled fallback posts - content comes entirely from GET /api/posts. The admin editor, reading-time and excerpt infrastructure is built and unused.

**Fix:** Publish 8-12 posts targeting real buyer questions about machine selection, monsoon service intervals and genuine vs aftermarket parts.

---

See [FULL-AUDIT-REPORT.md](../FULL-AUDIT-REPORT.md) for the complete audit and [ACTION-PLAN.md](../ACTION-PLAN.md) for sequenced remediation.
