# On-Page SEO — dugarearthmovers.com.np

**Score:** 12/100  |  **Audit weight:** 20%  |  **Audited:** 14 August 2026

## What works

- Nine of ten pages have unique, descriptive, well-written h1 elements.
- Heading hierarchy within pages is logical (h1 to h2 to h3).
- Internal linking between the main sections is complete via the navbar and footer.
- URL slugs are clean and keyword-relevant.

## Findings

### [Critical] No canonical tags

Zero <link rel="canonical"> on any page. The apex 308 covers the main duplication risk, but anchor URLs and future UTM traffic have no canonical anchor.

**Fix:** Add a self-referencing canonical to every route.

### [Critical] No Open Graph or Twitter Card tags

Every share on WhatsApp, Facebook, LinkedIn or Viber renders as a bare link with no image and no description. In Nepal's B2B market where WhatsApp sharing drives referral traffic, this is a direct commercial loss.

**Fix:** Add og:title, og:description, og:image, og:url, og:type and twitter:card=summary_large_image. Produce one 1200x630 default OG image.

### [Critical] One title tag for the entire site

All 10 public routes return <title>Tata Hitachi Nepal</title>, hardcoded in frontend/index.html. 19 characters, well under the ~60-character budget, with no service, product or location terms.

**Fix:** Set unique per-route titles. Draft copy is in FULL-AUDIT-REPORT.md under On-Page SEO.

### [Critical] No meta descriptions anywhere

The only meta tags in the document are charset and viewport. With no homepage h1 and no intro copy, Google has very little to scrape for a snippet.

**Fix:** Add a unique 150-155 character meta description per route.

### [High] No head-management library installed

frontend/package.json contains no react-helmet-async, @unhead/react or equivalent. There is currently no mechanism to set per-page meta.

**Fix:** Install react-helmet-async, or write a small useDocumentHead hook - the site is small enough not to need the dependency.

---

See [FULL-AUDIT-REPORT.md](../FULL-AUDIT-REPORT.md) for the complete audit and [ACTION-PLAN.md](../ACTION-PLAN.md) for sequenced remediation.
