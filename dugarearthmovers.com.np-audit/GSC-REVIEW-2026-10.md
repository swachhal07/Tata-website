# SEO Review — dugarearthmovers.com.np
**Data window:** 13 Aug – 27 Oct 2026 (all available Search Console data) · **Reviewed:** 30 Oct 2026

---

## 1. The short version

CTR is not the problem. **Google has only indexed 2 of your 24 pages.** You can't get clicks from pages Google won't show.

| Metric | Value | Verdict |
|---|---|---|
| Clicks | 40 | Low, because impressions are low |
| Impressions | 515 (~7/day) | **The real problem** |
| Average CTR | 7.8% | Healthy for an average position of 4.2 |
| Average position | 4.2 | Good, but almost entirely for brand searches |
| Indexed pages | **2 of 24** | **Critical** |
| External backlinks | **0** | **Critical, and the root cause** |

Impressions are growing (Aug 87 → Sep 183 → Oct 245). Clicks fell from 23 in September to 13 in October because the September spike came from branded searches.

---

## 2. What Search Console shows

### 2.1 Pages: only 2 can appear in search
| Page | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| `/` (homepage) | 38 | 508 | 7.5% | 4.2 |
| `/products/ex-215` | 2 | 9 | 22.2% | 8.2 |

**Page indexing:** 2 indexed, 22 marked **"Discovered – currently not indexed"**, and every one shows **Last crawled: N/A**. Google knows these URLs exist from the sitemap but has never fetched them. The list includes `/products`, 9 of the 10 product pages, `/about`, `/contact`, `/compare`, `/leadership`, `/blog`, and all 5 blog posts. You started a validation on 2 Oct, and it hasn't changed anything.

### 2.2 Why Google won't crawl them
- **Links report: 0 external links, 0 linking sites.** As far as Google knows, no other website on the internet points to you. A new `.com.np` domain with zero links has almost no crawl demand, so Google keeps re-checking the homepage and doesn't spend effort on the rest.
- **Crawl stats** confirm it: only 143 requests in 90 days, **95% "Refresh" and 5% "Discovery"**. Host status is clean, the average response is 228 ms, and 99% of responses are 200 OK. **The server is fine. This is an authority problem, not a technical one.**
- Of 41.5 MB downloaded, only 29% was HTML. The rest was JS, images, CSS and video. That's not the cause, but it's wasted crawl on a site Google barely visits.

### 2.3 Queries: 19 named queries total
| Query | Clicks | Impr. | Pos. |
|---|---|---|---|
| tata hitachi nepal | 2 | 7 | 1.6 |
| tata hitachi excavator price in nepal | 1 | 6 | 1.3 |
| dugar earthmovers pvt ltd | 1 | 2 | 1.0 |
| **tata hitachi** | **0** | **15** | **7.5** |
| hitachi nepal | 0 | 3 | 8.7 |
| excavator price in nepal | 0 | 2 | 6.5 |
| tata hitachi showroom / showroom contact number | 0 | 2 | 7–11 |
| earthmovers near me | 0 | 1 | 10 |
| "can i get a contact number", "yes", "the first one", "more comparison", "want to buy", "price" | 0 | 6 | 1–5 |

Takeaways:
1. **Almost every query is branded.** You get no non-brand traffic ("excavator price in Nepal", "backhoe loader Nepal", "ZAXIS 220 price") because the pages that would rank for those terms aren't indexed.
2. **"tata hitachi" (your biggest query) sits at position 7.5 with 0% CTR.** Above you: tatahitachi.co.in, an **unclaimed Google Maps listing** (see §4), the Facebook page "Tata Hitachi – Nepal" (21.9K followers), and Wikipedia.
3. Queries like *"yes"*, *"the first one"* and *"can i get a contact number"* are follow-up turns from **Google AI Mode / conversational search**. Google is already citing you in AI answers. Visible phone numbers and clear price ranges help you win those turns.
4. About 470 of the 515 impressions come from anonymised queries (too rare for Google to show). That's normal at this volume.

### 2.4 Country / device
- Nepal 422 impressions (82%), India 37, then a long tail of USA, Qatar and UAE. The Gulf and Malaysia traffic is likely Nepali workers abroad researching for family businesses.
- Mobile 72%, desktop 27%. **Design and test for mobile first.**

### 2.5 Search appearance and enhancements
- **Search appearance: no data.** You have no rich results of any kind.
- **Product snippets: 1 invalid.** Error: *"Either 'price' or 'priceSpecification.price' should be specified."* `structuredData.js:176` deliberately omits price, which disqualifies every product page from product rich results. Merchant listings show the same error.
- Breadcrumbs: 1 valid. That's the only working enhancement.
- Core Web Vitals: no data (too little traffic for CrUX).
- Videos: 0 indexed.

---

## 3. What the live site gets right (keep it)
Most of the previous audit's Phase 1 has shipped and works:
- Unique `<title>`, description and canonical tags on every route, all prerendered into the HTML
- A real-HTML snapshot per route (crawlers get an H1, H2s and roughly 160–510 words without JS)
- `AutoDealer`, `WebSite`, `Product`, `BreadcrumbList` and `BlogPosting` schema
- A sitemap with 24 URLs, read successfully on 25 Oct
- `robots.txt` allows Googlebot and the sitemap line is present; Cloudflare's managed block only affects AI-training bots
- `http://` → `https://` → `www` redirects are 308 (permanent), and security headers are present

**The site is technically ready. Google just isn't visiting it yet.**

---

## 4. The things you're missing, by impact

### 🔴 P0: Get Google to crawl and index the site (this week)

**4.1 Claim the Google Business Profile, the single biggest win.**
Searching "tata hitachi" from Nepal shows a Maps panel: *"Tata Hitachi — Corporate office in Pokhara, 4.7★ (3 reviews)"* with **no website and no phone**, and Google itself prompts *"Own this business? / Add website / Add place's phone number"*. Claim it (via business.google.com, verified by postcard, phone or video), then add:
- Website → `https://www.dugarearthmovers.com.np/`
- Phone, hours, categories (*Construction equipment supplier*, *Heavy equipment dealer*), and photos of the machines and branch
- **One profile per branch**: 10 branches means 10 Maps listings, each linking to the site (ideally to its own branch page; see 4.8)
- Ask every recent buyer for a Google review. Three reviews is very thin; 20+ changes how the listing ranks.

This one step gives you a link Google trusts, a phone call button for "tata hitachi showroom contact number" searches, and Maps visibility for "earthmovers near me".

**4.2 Build the first backlinks (you have zero).** Easy, legitimate, high-trust ones:
| Source | Action |
|---|---|
| **mvdugar.com** | Add a prominent link to dugarearthmovers.com.np in the nav or divisions section and on the footer of every page. You own this one, so do it today. |
| **Facebook "Tata Hitachi – Nepal" (21.9K)** | Put the website in the page's About/website field, and put product-page links in posts ("Specs & brochure: dugarearthmovers.com.np/products/ex-210-lcprime"). |
| **LinkedIn "Tata Hitachi Dugar – Nepal"** | Its website field currently points to mvdugar.com. Change it to dugarearthmovers.com.np. |
| **Tata Hitachi India dealer locator** (tatahitachi.co.in) | Ask your Tata Hitachi regional contact to list the Nepal dealer with this URL. A link from the manufacturer is the most valuable link you can get. |
| YouTube / Instagram profiles | Put the website link in each bio and in video descriptions. |
| Nepali directories & marketplaces | YantraMart, Bazarpapa and Gharbanau already rank for "excavator price in Nepal". List your machines there with a link back. Also FNCCI/CNI member listings and local business directories. |
| PR | Machine handovers and new model launches, pitched to The Himalayan Times, Kathmandu Post, and Nepali trade/infra sites (Kobelco got Himalayan Times coverage for its SK220 launch). |

**4.3 Request indexing manually.** In Search Console → URL Inspection, inspect and click **Request indexing** for each important URL. The quota is about 10 per day, so start with these: `/products`, `/products/zaxis-220lc`, `/products/ex-210-lcprime`, `/products/shinrai-power`, `/products/ex-130`, `/contact`, `/compare`, `/about`, then the rest. This doesn't guarantee indexing, but on a site Google ignores it often triggers the first crawl.

### 🟠 P1: Make the pages worth indexing (weeks 1–3)

**4.4 Publish prices, or at least a price range.** Every Nepali "price" search (*tata hitachi excavator price in nepal*, *excavator price in nepal*, *backhoe loader price in nepal*, *tata hitachi 220 excavator price in nepal*) is won by marketplaces that show a figure. Gharbanau gets a **"NPR 9,600,000"** rich snippet. Google even shows *"Missing: price"* under your listing. Options, from best to minimum:
- An exact ex-showroom price → valid Product rich results
- "Starting from NPR X lakh" plus `priceSpecification` with `minPrice` → still valid
- At minimum, a visible paragraph on each product page: *"EX 210 LC Prime price in Nepal: NPR XX–YY lakh depending on configuration, financing and attachments. Call 98xxxxxxx for today's quote."*

Then remove the comment at `structuredData.js:176` and emit `price` or `priceSpecification`. That fixes the Product snippets and Merchant listings errors.

**4.5 Use real product images in schema and OG tags.** Every Product schema and `og:image` currently uses the generic `og-default.jpg`. Use each machine's own photo, which is needed for image search and product rich results.

**4.6 Thicken the thin pages.** Prerendered word counts:
- `/about`: **161 words**. Add the history, the founding year, the distributorship year, number of machines sold and branches, and the service team.
- Blog posts: about **257 words**. Aim for 800–1,500. These posts are genuinely good topics (monsoon checks, undercarriage wear, EX 210 vs ZAXIS 220); they just need depth, photos, and numbers.
- Product pages: about 400 words. Add a **"Price in Nepal"** section, an **FAQ** section (*mileage/fuel per hour, EMI/financing, warranty, service interval, spare parts availability, resale value*), and *"Best for: road projects, river-bed sand mining, hydropower access roads, quarry"*.

**4.7 Fix internal linking from the blog.** Blog posts link only to `/blog`. The *EX 210 LC Prime vs ZAXIS 220 LC* post should link to both product pages, the undercarriage post to the quarry machines, and the Shinrai/Birgunj post to `/products/shinrai-power`. Link every product page to 1–2 related posts.

**4.8 Branch / location pages.** You have 10 branches, so build `/branches/pokhara`, `/branches/butwal`, `/branches/dhangadhi` and so on, with address, phone, map, hours, machines in stock, and local projects. One query you already got a click on was **"in dhangadhi"**. Location pages capture "excavator dealer in Butwal" and "tata hitachi Pokhara" searches, and each one is the landing page for its Google Business Profile.

**4.9 Soft 404.** `/any-made-up-url` returns HTTP 200 with the homepage HTML. The canonical points to `/`, which limits the damage, but unknown routes should return a real **404 status**. In `vercel.json` the catch-all rewrite sends everything to `index.html`. Prerender a `404.html` and stop rewriting unknown paths, or use Vercel's `cleanUrls` with only the known routes rewritten.

**4.10 Smaller technical items**
- The contact email is `sales.tatahitachinp@gmail.com`. A `@dugarearthmovers.com.np` or `@mvdugar.com` address is a stronger trust signal for buyers and for Google's quality raters.
- `sameAs` in the Organization schema lists only mvdugar.com. Add the Facebook, LinkedIn, YouTube and Instagram URLs and the Google Business Profile URL.
- Add per-branch `LocalBusiness` schema with `geo` and `openingHours` (once 4.8 exists).
- The `FAQPage` builder exists in `structuredData.js`, but the homepage doesn't emit it. Wire it to the homepage FAQ and to the product FAQs from 4.6.
- `Google-Extended` is blocked in Cloudflare. It does **not** affect normal Search or AI Overviews ranking (those use Googlebot), so this is fine to leave as a business decision.

### 🟡 P2: Grow non-brand traffic (month 2–3)

**4.11 Nepali-language content.** People search *"एक्साभेटर मूल्य"*, *"जेसीबी को मूल्य"* and Romanised Nepali. JCB Nepal's best-performing post was in Nepali (*"JCB Backhoe अब २५ लाख देखि…"*). A Nepali version of the products and price pages, or at least Nepali FAQ answers, opens a keyword space almost nobody competes in.

**4.12 Comparison content.** The SERPs show people comparing brands: *"Hyundai 220 excavator price in Nepal"*, *"CAT 320 price in Nepal"*, *"JCB vs …"*. Write honest comparison pages such as *"Tata Hitachi ZAXIS 220 vs Hyundai R220 — which is better for Nepal?"* and *"Best 20-tonne excavator in Nepal 2026"*. You already have a `/compare` page; turn it into model-vs-competitor articles.

**4.13 Used / resale / rental intent.** "Used backhoe loader price in Nepal" and "excavator on rent" are big in Nepal. If Dugar handles trade-ins, certified used machines or rentals, give each its own page.

**4.14 Video.** Your Facebook videos already rank in Google's video carousel for "tata hitachi". Upload the same videos to **YouTube** with titles like *"Tata Hitachi EX 210 LC Prime — Walkaround & Price in Nepal"*, embed them on the product pages, and add `VideoObject` schema. Search Console currently shows "0 videos indexed".

---

## 5. Keyword map

Volumes for Nepal are small, so prioritise by buyer intent rather than raw volume.

| Priority | Keyword cluster | Example queries | Target page | Status |
|---|---|---|---|---|
| ★★★ | Brand + Nepal | tata hitachi nepal, tata hitachi, hitachi nepal, tatahitachi | `/` | Ranking 1–8. Claim the GBP to own the panel. |
| ★★★ | Brand + price | tata hitachi price in nepal, tata hitachi excavator price in nepal, tata hitachi 220 excavator price in nepal | `/products` + each product page | Homepage ranks, but "Missing: price". Add prices (4.4). |
| ★★★ | Model + price | zaxis 220 price nepal, ex 210 price nepal, ex 130 price, shinrai price nepal, ex 70 price | `/products/{model}` | **Not indexed.** Fix with P0. |
| ★★★ | Contact / showroom | tata hitachi showroom, tata hitachi showroom contact number, tata hitachi pokhara/butwal | `/contact`, branch pages, GBP | Position 7–11. GBP plus branch pages. |
| ★★ | Generic price | excavator price in nepal, backhoe loader price in nepal, mini excavator price in nepal, jcb price in nepal 2026 | Price guide blog + product pages | Marketplaces win. Write *"Excavator Price in Nepal 2026: Full Guide"* with a price table. |
| ★★ | Competitor comparisons | hyundai 220 vs tata hitachi, cat 320 price in nepal, komatsu excavator price in nepal | Comparison posts | Not covered. |
| ★★ | Local / near me | earthmovers near me, excavator dealer butwal, heavy equipment dhangadhi | Branch pages + GBP | Not covered. |
| ★ | Ownership / service | excavator spare parts nepal, tata hitachi service center, excavator mileage per hour, emi / loan for excavator nepal | Parts/service page, FAQ, blog | Partially covered by blog. |
| ★ | Used / rent | used excavator price in nepal, excavator on rent kathmandu | Only if the business offers it | — |

---

## 6. 30 / 60 / 90-day plan

**This week**
1. Claim and verify the Google Business Profile, add the website and phone, and create a profile for each branch.
2. Add website links on mvdugar.com, Facebook, LinkedIn, YouTube and Instagram.
3. Request indexing in Search Console for the top 10 URLs (repeat daily for the rest).
4. Email your Tata Hitachi regional contact asking for a dealer-locator listing with this URL.

**Weeks 2–4**
5. Add prices or price ranges to product pages and to the Product schema, and use real product images.
6. Add a "Price in Nepal" section and an FAQ to each product page; expand `/about` and the 5 blog posts.
7. Add blog → product internal links, add `sameAs`, and fix the soft 404.
8. List machines on YantraMart, Bazarpapa and Gharbanau with links back to the site.

**Month 2–3**
9. Build the 10 branch pages.
10. Write *"Excavator Price in Nepal 2026"* and 2–3 brand-comparison articles.
11. Add Nepali-language versions of the key pages.
12. Move Facebook videos to YouTube and embed them on the product pages.

### What to expect
- Once Google gets external signals (GBP plus 5–10 real links), the 22 pages should get crawled within **2–6 weeks**.
- Indexed product pages bring non-brand impressions. A realistic target for month 3 is **2,000–4,000 impressions a month** instead of about 250.
- Keep CTR at 5–8% by keeping titles specific ("Specs & Price in Nepal" already does this well).

### Metrics to watch in Search Console every 2 weeks
- Pages → Indexed count (goal: 20+ of 24)
- Links → External links (goal: 10+ linking sites)
- Performance → Pages tab: non-homepage URLs getting impressions
- Performance → Queries: share of non-brand queries
- Enhancements → Product snippets: valid > 0
