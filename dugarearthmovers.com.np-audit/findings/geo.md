# AI Search Readiness — dugarearthmovers.com.np

**Score:** 8/100  |  **Audit weight:** 10%  |  **Audited:** 14 August 2026

## What works

- Content-Signal: search=yes permits classic search indexing.
- Underlying content is factual, specific and would be highly citable if it were reachable and restructured.

## Findings

### [Critical] Content invisible to AI crawlers even if unblocked

Every AI crawler listed fetches raw HTML and does not execute JavaScript. Even with robots.txt opened up, they would receive the 830-byte empty shell.

**Fix:** Pre-rendering is a hard prerequisite for any GEO work here.

### [Critical] AI crawlers blocked at robots.txt

Cloudflare's managed block disallows GPTBot (ChatGPT), ClaudeBot (Claude), CCBot (Common Crawl, which feeds many models and Perplexity's index), Google-Extended (Gemini and Google AI Overviews grounding), Applebot-Extended, Bytespider and meta-externalagent. Combined with Content-Signal: ai-train=no, use=reference. When a contractor asks an AI assistant who sells Tata Hitachi excavators in Nepal, this site cannot be cited.

**Fix:** Business decision. Reconsider Google-Extended first - it governs AI Overviews grounding that appears directly above the organic results a buyer already sees, and unblocking it does not affect classic Search ranking. Content-Signal: ai-train=no already reserves training rights separately. Change via the Cloudflare AI Crawler Control dashboard, not by editing the file.

### [High] No structured data for entity resolution

The strongest machine-readable signal for AI systems to resolve the business as an entity is entirely absent.

**Fix:** Ship Organization and LocalBusiness JSON-LD (see Schema category).

### [Medium] Low passage-level citability

Copy is stylish but rhetorical - 'FIVE SPECIALTIES. One yard.' AI systems cite self-contained factual passages, not headlines.

**Fix:** Add citable statements such as 'Dugar Earthmovers is the authorised Tata Hitachi distributor for Nepal, operating 10 service and parts branches from Biratnagar to Dhangadi.'

### [Low] No llms.txt and weak brand-mention footprint

/llms.txt returns the SPA shell. The site's only external outbound authority link is to mvdugar.com.

**Fix:** Add llms.txt once crawler policy is settled; pursue industry directory and trade-body mentions.

---

See [FULL-AUDIT-REPORT.md](../FULL-AUDIT-REPORT.md) for the complete audit and [ACTION-PLAN.md](../ACTION-PLAN.md) for sequenced remediation.
