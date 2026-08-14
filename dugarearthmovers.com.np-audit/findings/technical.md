# Technical SEO — dugarearthmovers.com.np

**Score:** 30/100  |  **Audit weight:** 22%  |  **Audited:** 14 August 2026

## What works

- HTTPS enforced with strict-transport-security: max-age=63072000.
- Apex to www canonicalised with a 308 redirect; http:// also 308s.
- Fast server response - TTFB 67 ms, Vercel edge cache HIT.
- Clean, readable URL structure with no query-string or ID noise.
- html lang="en" set correctly.
- Admin routes are auth-gated and render nothing to crawlers.

## Findings

### [Critical] Soft 404s - unknown URLs return HTTP 200

https://www.dugarearthmovers.com.np/this-page-does-not-exist-12345 returns 200 and renders a blank page (1 word of text). App.jsx has no catch-all route.

**Fix:** Add <Route path="*" element={<NotFound />} /> inside the Layout route with robots noindex, and return a real 404 status once pre-rendering is in place.

### [Critical] Client-side rendering only - no HTML content for crawlers

Raw GET / returns 830 bytes: head plus <div id="root"></div>. The rendered DOM contains 6,663 characters of homepage text. vercel.json rewrites /((?!api/).*) to /index.html so this applies to all 10 routes. Bing and every AI crawler receive an empty document.

**Fix:** Add build-time pre-rendering via vite-react-ssg or vite-plugin-prerender, listing the 10 public routes. The app still hydrates as an SPA afterwards. Verify with curl that body copy is present without JS.

### [High] robots.txt is Cloudflare-managed, blocks AI crawlers and has no Sitemap directive

Allow: / for User-agent: * with Content-Signal: search=yes is correct for Googlebot and Bingbot. But GPTBot, ClaudeBot, CCBot, Google-Extended, Applebot-Extended, Bytespider, meta-externalagent and CloudflareBrowserRenderingCrawler are all disallowed. No Sitemap: line.

**Fix:** Add a Sitemap: directive. Reconsider the Google-Extended block via the Cloudflare AI Crawler Control dashboard - hand-editing the file will be overwritten by the managed rule.

### [High] No XML sitemap

/sitemap.xml and /sitemap_index.xml both return the SPA shell as text/html with status 200.

**Fix:** Generate frontend/public/sitemap.xml with the 10 public routes; build blog URLs at deploy time from GET /api/posts.

### [Medium] No llms.txt

/llms.txt returns the SPA shell. Optional and ignored by Google Search, but a low-cost signal for AI assistants.

**Fix:** Add frontend/public/llms.txt once the AI crawler policy is settled.

### [Medium] Missing security headers

content-security-policy, x-frame-options, x-content-type-options, referrer-policy and permissions-policy are all absent. The site accepts form submissions.

**Fix:** Add a headers block to vercel.json with nosniff, referrer-policy: strict-origin-when-cross-origin, and x-frame-options: SAMEORIGIN.

### [Low] Build output is 149.58 MB

Symptom of the unoptimised asset pipeline; slows every build and deploy.

**Fix:** Adopt vite-imagetools so assets are compressed and resized at build time.

---

See [FULL-AUDIT-REPORT.md](../FULL-AUDIT-REPORT.md) for the complete audit and [ACTION-PLAN.md](../ACTION-PLAN.md) for sequenced remediation.
