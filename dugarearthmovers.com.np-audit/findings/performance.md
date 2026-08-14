# Performance (CWV) — dugarearthmovers.com.np

**Score:** 8/100  |  **Audit weight:** 10%  |  **Audited:** 14 August 2026

## What works

- TTFB 67 ms - excellent, Vercel edge cache HIT.
- FCP 192 ms.
- CLS 0.000 - no layout shift observed.
- Only 18 requests; JS and CSS transfer is negligible next to imagery.

## Findings

### [Critical] All 7 hero slides load eagerly on first paint

HeroSlideshow.jsx mounts every slide as a div with opacity-0, so the browser fetches all six images plus the 22 MB video immediately - even though only slide 0 is visible and there is no auto-advance.

**Fix:** Render only the active slide and the next one; lazy-load slides 2-6.

### [Critical] 46.9 MB of images on the homepage

Measured transfer breakdown is effectively 100% img. Worst offenders: ZX220LC Ultra 6.jpg at 29.3 MB (5760x3840 natural, 935x816 displayed, ~99% waste), ZAXIS 140H Ultra.JPG at 13.0 MB (6000x4000), IMG_5291.JPG at 2.3 MB and IMG_5286.JPG at 1.5 MB (both 4032x2268 displayed at 435x327). On a 10 Mbps Nepali 4G connection this is roughly 38 seconds of download.

**Fix:** Re-export all hero and card imagery to WebP, max 1920px wide, quality 80. Target 47 MB down to under 1.5 MB. Adopt vite-imagetools for automatic build-time processing.

### [High] No responsive images and no explicit dimensions

No srcset, sizes or <picture> anywhere - mobile downloads the same 29 MB file as desktop. No width/height attributes on any img; CLS is 0 only because the layout is fully CSS-constrained, which is fragile.

**Fix:** Add srcset at 1920/1280/640 widths and explicit width/height on every img.

### [High] Lab LCP of 216 ms is misleading

The LCP element resolved against an early-painting overlay while 47 MB of imagery was still streaming. Measured on desktop from Kathmandu on a warm cache. No CrUX field data available - the site is likely below the reporting threshold.

**Fix:** Re-measure after image optimisation, and connect Search Console to get real field data.

### [Medium] 22 MB hero video with preload=auto and autoplay

hero.mp4 is 22.1 MB, set to autoPlay with preload="auto" and no poster attribute.

**Fix:** Add a poster image, switch to preload="metadata", and re-encode to 1080p H.264 targeting 2-3 MB for a 15-second loop.

---

See [FULL-AUDIT-REPORT.md](../FULL-AUDIT-REPORT.md) for the complete audit and [ACTION-PLAN.md](../ACTION-PLAN.md) for sequenced remediation.
