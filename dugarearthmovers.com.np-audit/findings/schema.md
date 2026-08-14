# Schema / Structured Data — dugarearthmovers.com.np

**Score:** 0/100  |  **Audit weight:** 10%  |  **Audited:** 14 August 2026

## What works

_Nothing in this category is currently implemented._

## Findings

### [Critical] Missing LocalBusiness schema for 10 branches

frontend/src/data/locations.js already holds city, lat/lng, contact name, phone and Google Maps URL for each branch. This is the highest-ROI schema on the site and is a data transform rather than new research.

**Fix:** Emit 10 LocalBusiness blocks with name, address, geo, telephone, openingHours and parentOrganization. Requires collecting street addresses and opening hours, which are not currently in the codebase.

### [Critical] Zero structured data on the entire site

document.querySelectorAll('script[type="application/ld+json"]').length === 0 on every one of the 10 routes.

**Fix:** Start with Organization/AutoDealer sitewide and LocalBusiness for the 10 branches.

### [High] Missing Product schema for 10 machines

No Product markup exists. Currently blocked by the absence of individual product URLs.

**Fix:** After creating /products/:slug, add Product schema with name, brand: Tata Hitachi, image, description and spec additionalProperty entries.

### [Medium] Missing BreadcrumbList and BlogPosting schema

No breadcrumb markup anywhere; /blog/:slug in particular would benefit. Blog posts carry no BlogPosting headline, datePublished, author or image.

**Fix:** Add both once the blog has published content.

### [Medium] Missing FAQPage schema

Faqs.jsx already renders a Q&A section ('LET'S CLEAR IT UP.') on the homepage with no markup on it.

**Fix:** Add FAQPage JSON-LD mirroring the rendered questions and answers.

### [Low] Missing Review markup on existing reviews

Reviews.jsx renders real operator reviews with no schema. Note Google restricts self-serving review snippets on LocalBusiness.

**Fix:** Apply Review/AggregateRating to Product entities where the reviews are genuinely machine-specific.

---

See [FULL-AUDIT-REPORT.md](../FULL-AUDIT-REPORT.md) for the complete audit and [ACTION-PLAN.md](../ACTION-PLAN.md) for sequenced remediation.
