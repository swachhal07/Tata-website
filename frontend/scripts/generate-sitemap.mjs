/* Emits public/sitemap.xml and public/robots.txt at build time.
 *
 * Static routes come from src/seo/siteMeta.js so a new page only has to be
 * registered in one place. Product and blog URLs are pulled from the live
 * API — if it is unreachable (cold Render instance, offline build) the script
 * still writes a valid sitemap covering the static routes rather than failing
 * the build.
 *
 * Run standalone with: npm run sitemap
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { routeMeta, SITE_URL } from '../src/seo/siteMeta.js'
import { productSlug } from '../src/data/slug.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(here, '..', 'public')
const API = process.env.SITEMAP_API_ORIGIN || 'https://tata-website.onrender.com'
/* The backend sleeps on Render's free tier; a cold start can take ~30s. */
const FETCH_TIMEOUT_MS = 45_000

const today = new Date().toISOString().slice(0, 10)

async function getJson(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/* Fallback when the API is down: pull the model codes straight out of the
 * bundled seed catalogue. `products.js` imports image and PDF assets, so it
 * cannot be `import`ed under plain Node — hence the text scan. Losing the
 * admin-added machines is better than shipping a sitemap with no products. */
async function seedProductCodes() {
  try {
    const source = await fs.readFile(
      path.resolve(here, '..', 'src', 'data', 'products.js'),
      'utf8',
    )
    return [...source.matchAll(/^\s*code:\s*'([^']+)'/gm)].map((m) => m[1])
  } catch {
    return []
  }
}

async function productUrls() {
  const data = await getJson(`${API}/api/products`)
  if (!data) {
    const codes = await seedProductCodes()
    console.warn(
      `  ! products API unreachable — falling back to ${codes.length} seed products`,
    )
    return codes.map((code) => ({
      loc: `${SITE_URL}/products/${productSlug({ code })}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
    }))
  }
  /* Mirror the merge the app does: admin-managed products win, and any seed
   * machine not overridden or hidden is still on the site. */
  const hidden = new Set(Array.isArray(data.hidden) ? data.hidden : [])
  const dynamic = Array.isArray(data.products) ? data.products : []
  const overridden = new Set(dynamic.map((p) => p.code))
  const seeds = (await seedProductCodes())
    .filter((code) => !overridden.has(code))
    .map((code) => ({ code }))

  return [...dynamic, ...seeds]
    .filter((p) => p.code && !hidden.has(p.code))
    .map((p) => ({
      loc: `${SITE_URL}/products/${productSlug(p)}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.8',
    }))
}

async function blogUrls() {
  const data = await getJson(`${API}/api/posts`)
  if (!data) {
    console.warn('  ! posts API unreachable — blog URLs omitted from sitemap')
    return []
  }
  const list = Array.isArray(data.posts) ? data.posts : []
  return list
    .filter((p) => p.slug)
    .map((p) => ({
      loc: `${SITE_URL}/blog/${p.slug}`,
      lastmod: (p.updatedAt || p.publishedAt || today).slice(0, 10),
      changefreq: 'monthly',
      priority: '0.6',
    }))
}

function staticUrls() {
  return Object.entries(routeMeta).map(([route, meta]) => ({
    loc: route === '/' ? `${SITE_URL}/` : `${SITE_URL}${route}`,
    lastmod: today,
    changefreq: meta.changefreq || 'monthly',
    priority: meta.priority || '0.5',
  }))
}

function toXml(urls) {
  const entries = urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${u.loc}</loc>\n` +
        `    <lastmod>${u.lastmod}</lastmod>\n` +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

/* Served from public/ so it overrides Cloudflare's managed robots.txt.
 * The AI-crawler block that file applies is a Cloudflare dashboard setting —
 * changing it here has no effect until the managed rule is turned off. */
const ROBOTS = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login

Sitemap: ${SITE_URL}/sitemap.xml
`

async function main() {
  await fs.mkdir(publicDir, { recursive: true })

  const [products, posts] = await Promise.all([productUrls(), blogUrls()])
  const urls = [...staticUrls(), ...products, ...posts]

  await fs.writeFile(path.join(publicDir, 'sitemap.xml'), toXml(urls), 'utf8')
  await fs.writeFile(path.join(publicDir, 'robots.txt'), ROBOTS, 'utf8')

  console.log(
    `  sitemap.xml: ${urls.length} URLs ` +
      `(${staticUrls().length} static, ${products.length} products, ${posts.length} posts)`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
