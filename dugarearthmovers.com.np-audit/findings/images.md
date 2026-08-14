# Images — dugarearthmovers.com.np

**Score:** 15/100  |  **Audit weight:** 5%  |  **Audited:** 14 August 2026

## What works

- Products, Leadership, Compare, Contact and Blog have complete alt coverage.
- Existing alt text is descriptive rather than keyword-stuffed.

## Findings

### [Critical] Images grossly oversized for display

Roughly 99% byte waste on the largest assets - see the Performance category for the full table.

**Fix:** Resize and convert to WebP at build time.

### [High] 6 of 15 homepage images have empty alt

All six are hero slides with alt="" hardcoded in HeroSlideshow.jsx. Decorative-empty-alt is defensible for a pure background, but these are the product photos that define the page. The About page has 4 of 35 images with empty alt.

**Fix:** Replace with real machine descriptions naming the model.

### [Medium] Non-descriptive filenames with spaces

IMG_5291.JPG, IMG_5286.JPG and 'WhatsApp Image 2026-06-23 at 9.56.05 AM.jpeg' hurt image search; spaces force URL-encoding on every request.

**Fix:** Rename to lowercase hyphenated descriptive filenames, e.g. tata-hitachi-parts-store-nepal.webp.

### [Medium] Mixed and unoptimised formats

A mix of .JPG, .jpeg, .png and one .webp. The 1.1 MB zaxis 370.png is a photograph stored as PNG.

**Fix:** Standardise on WebP with JPEG fallback.

### [Low] No image sitemap

No image entries in any sitemap - and no sitemap exists at all.

**Fix:** Include image:image entries when generating sitemap.xml.

---

See [FULL-AUDIT-REPORT.md](../FULL-AUDIT-REPORT.md) for the complete audit and [ACTION-PLAN.md](../ACTION-PLAN.md) for sequenced remediation.
