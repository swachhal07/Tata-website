/* Tells Bing (and the other IndexNow engines: Yandex, Seznam, Naver) about
 * every URL in the sitemap, after `vite build` and the prerender step.
 *
 * WHY: Bing had almost nothing from this site indexed, and Bing's index is
 * what ChatGPT search and Copilot answer from. IndexNow gets new and changed
 * pages crawled in days instead of waiting for Bing to rediscover them.
 *
 * The key is public by design: IndexNow proves ownership by fetching
 * /<key>.txt from the site and checking it holds the same key. That file
 * lives in public/ so every deploy serves it.
 *
 * Runs only for Vercel production builds (or with --force), so previews and
 * local builds never ping. It never fails the build: a submission problem is
 * logged and the deploy carries on.
 *
 * Note the ping fires during the build, a minute or two before the new
 * deployment goes live. That is fine — the URLs already exist, and the
 * engines crawl them later, by which time the new version is serving.
 *
 * Run by hand after a deploy with: npm run indexnow -- --force
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL } from '../src/seo/siteMeta.js'

const KEY = '4ff355e82c038fe92607d980bd6d89d1'
const ENDPOINT = 'https://api.indexnow.org/indexnow'

const here = path.dirname(fileURLToPath(import.meta.url))
const sitemapPath = path.resolve(here, '..', 'dist', 'sitemap.xml')

async function main() {
  const force = process.argv.includes('--force')
  if (process.env.VERCEL_ENV !== 'production' && !force) {
    console.log('  indexnow: skipped (not a production build; pass --force to send)')
    return
  }

  let xml
  try {
    xml = await fs.readFile(sitemapPath, 'utf8')
  } catch {
    console.warn('  ! indexnow: dist/sitemap.xml missing — nothing submitted')
    return
  }
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  if (!urlList.length) {
    console.warn('  ! indexnow: sitemap has no URLs — nothing submitted')
    return
  }

  const host = new URL(SITE_URL).host
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: KEY,
        keyLocation: `${SITE_URL}/${KEY}.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(20_000),
    })
    /* 200 = accepted, 202 = accepted while the key is still being verified
     * (normal on the first submission). Anything else is worth a look. */
    if (res.status === 200 || res.status === 202) {
      console.log(`  indexnow: submitted ${urlList.length} URLs (HTTP ${res.status})`)
    } else {
      console.warn(
        `  ! indexnow: HTTP ${res.status} ${res.statusText} — ${(await res.text()).slice(0, 200)}`,
      )
    }
  } catch (err) {
    console.warn(`  ! indexnow: request failed (${err.message})`)
  }
}

main()
