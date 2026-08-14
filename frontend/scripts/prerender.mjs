/* Emits a static HTML file per route into dist/, after `vite build`.
 *
 * WHY: the site is a client-rendered SPA — `createRoot(...).render()`, no
 * hydration. Every URL therefore serves the same near-empty shell with the
 * homepage's <head>. Googlebot renders JavaScript and copes; the AI crawlers
 * do not. GPTBot, ClaudeBot, CCBot, PerplexityBot and Google-Extended all
 * fetch raw HTML and read what is in the response body. So does every social
 * link-preview scraper. Without this step there is nothing for them to read
 * or cite, and no amount of robots.txt or schema work changes that.
 *
 * WHAT IT DOES: for each known route it clones dist/index.html, swaps in that
 * route's <title>, meta, canonical, Open Graph and JSON-LD, and injects a
 * plain-HTML rendering of the page's own content into #root.
 *
 * WHY THAT IS SAFE: React's createRoot clears the container before its first
 * render, so the injected markup never coexists with the app — a visitor with
 * JavaScript sees exactly what they saw before. It is a pre-hydration snapshot,
 * not a second version of the site.
 *
 * CONTENT PARITY IS THE RULE. Everything written here is generated from the
 * same sources the React pages render from — the products API, the posts and
 * locations APIs, routeMeta, productNotes. Never put a claim in the snapshot
 * that a visitor cannot see on the page; that is cloaking, and it is the one
 * way this technique goes wrong. Where the full page cannot be reproduced
 * (interactive comparison tables, maps), the snapshot carries a faithful
 * summary drawn from that page's own description plus verified facts, and
 * links onward — a subset of the page, never a substitute for it.
 *
 * This is not server-side rendering. Full SSR would mean making MapLibre, the
 * scroll listeners and the data hooks SSR-safe — a large refactor with real
 * breakage risk. This gets the citable content into the raw HTML response for
 * a fraction of that.
 *
 * Run standalone (after a build) with: npm run prerender
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  routeMeta,
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  PARENT_ORG,
  PARENT_ORG_URL,
  CONTACT,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
} from '../src/seo/siteMeta.js'
import {
  organizationSchema,
  websiteSchema,
  productSchema,
  breadcrumbSchema,
  blogPostingSchema,
  itemListSchema,
  branchSchema,
} from '../src/seo/structuredData.js'
import { productSlug, productPath } from '../src/data/slug.js'
import { noteFor } from '../src/data/productNotes.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(here, '..', 'dist')
const srcDir = path.resolve(here, '..', 'src')
const API = process.env.SITEMAP_API_ORIGIN || 'https://tata-website.onrender.com'
/* The backend sleeps on Render's free tier; a cold start can take ~30s. */
const FETCH_TIMEOUT_MS = 45_000

/* ── Data ──────────────────────────────────────────────────────────── */

async function getJson(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

/**
 * Load the bundled seed catalogue under plain Node.
 *
 * products.js opens with `import img from '../assets/x.webp'` lines that only
 * Vite can resolve. Rewriting each to `const img = '../assets/x.webp'` makes
 * the module loadable as a data URL import; the placeholder strings are never
 * used as image sources (see `ogImageFor`), only the product data matters.
 */
async function seedCatalogue() {
  try {
    const source = await fs.readFile(path.join(srcDir, 'data', 'products.js'), 'utf8')
    const shimmed = source.replace(
      /^import\s+(\w+)\s+from\s+(['"][^'"]+['"])\s*$/gm,
      'const $1 = $2',
    )
    const mod = await import(
      `data:text/javascript;base64,${Buffer.from(shimmed).toString('base64')}`
    )
    return Array.isArray(mod.products) ? mod.products : []
  } catch (err) {
    console.warn(`  ! seed catalogue unreadable (${err.message})`)
    return []
  }
}

/** Mirror the merge the app performs: admin records win, seeds fill in. */
async function allProducts() {
  const seeds = await seedCatalogue()
  const data = await getJson(`${API}/api/products`)
  if (!data) {
    console.warn(`  ! products API unreachable — prerendering ${seeds.length} seed machines`)
    return seeds
  }
  const hidden = new Set(Array.isArray(data.hidden) ? data.hidden : [])
  const dynamic = Array.isArray(data.products) ? data.products : []
  const overridden = new Set(dynamic.map((p) => p.code))
  return [...dynamic, ...seeds.filter((p) => !overridden.has(p.code))].filter(
    (p) => p.code && !hidden.has(p.code),
  )
}

async function allPosts() {
  const data = await getJson(`${API}/api/posts`)
  const list = Array.isArray(data?.posts) ? data.posts : []
  if (!data) console.warn('  ! posts API unreachable — blog posts not prerendered')
  return list.filter((p) => p.slug)
}

async function allLocations() {
  const data = await getJson(`${API}/api/locations`)
  const list = Array.isArray(data?.locations) ? data.locations : []
  if (!data) console.warn('  ! locations API unreachable — branch list omitted')
  return list.filter((l) => l.city)
}

/* Seed product images are Vite-resolved asset paths that do not exist as URLs
 * at build time, so anything not already absolute or under /uploads falls back
 * to the default card. Better a correct default than a 404 in an OG tag. */
function ogImageFor(image) {
  if (typeof image !== 'string') return DEFAULT_OG_IMAGE
  if (/^https?:\/\//i.test(image)) return image
  if (image.startsWith('/uploads/')) return absoluteUrl(image)
  return DEFAULT_OG_IMAGE
}

/* ── HTML helpers ──────────────────────────────────────────────────── */

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Strip HTML tags from admin-authored post bodies before reusing as text. */
const stripTags = (v) =>
  String(v ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const p = (text) => (text ? `<p>${esc(text)}</p>` : '')
const li = (items) => items.filter(Boolean).map((i) => `<li>${i}</li>`).join('')
const link = (href, label) => `<a href="${esc(href)}">${esc(label)}</a>`

/* The one sentence every AI crawler should be able to lift verbatim. Mirrors
 * the claim made on the About page and in llms.txt. */
const CITABLE = `${SITE_NAME} (${LEGAL_NAME}) is the authorised Tata Hitachi Construction Machinery distributor for Nepal, part of ${PARENT_ORG}. It sells, commissions and services excavators, backhoe loaders and mining equipment, and supplies genuine Tata Hitachi parts, from ten branches nationwide.`

const CONTACT_BLOCK = `<h2>Contact</h2><ul>${li([
  `Sales: <a href="tel:${esc(CONTACT.salesPhone)}">${esc(CONTACT.salesPhone)}</a>`,
  `Service: <a href="tel:${esc(CONTACT.servicePhone)}">${esc(CONTACT.servicePhone)}</a>`,
  `Email: <a href="mailto:${esc(CONTACT.email)}">${esc(CONTACT.email)}</a>`,
  `Head office: ${esc(CONTACT.city)}, Nepal`,
])}</ul>`

function machineList(products) {
  return `<ul>${li(
    products.map(
      (m) =>
        `${link(productPath(m), `Tata Hitachi ${m.name}`)}${
          m.series ? ` — ${esc(m.series)}` : ''
        }${m.intro ? `. ${esc(m.intro)}` : ''}`,
    ),
  )}</ul>`
}

function branchList(locations) {
  if (!locations.length) return ''
  return `<h2>Branches</h2><ul>${li(
    locations.map(
      (l) =>
        `${esc(l.city)}${l.label ? ` (${esc(l.label)})` : ''}${
          l.phone ? ` — <a href="tel:${esc(l.phone)}">${esc(l.phone)}</a>` : ''
        }`,
    ),
  )}</ul>`
}

/* ── Per-route body content ────────────────────────────────────────── */

function productBody(product, products) {
  const others = products.filter((o) => o.code !== product.code).slice(0, 6)
  return [
    `<h1>Tata Hitachi ${esc(product.name)}</h1>`,
    product.series ? `<p>${esc(product.series)}</p>` : '',
    p(product.intro),
    p(noteFor(product)),
    product.specs?.length
      ? `<h2>Specifications</h2><ul>${li(
          product.specs.map((s) => `${esc(s.label)}: ${esc(s.value)}`),
        )}</ul>`
      : '',
    product.applications?.length
      ? `<h2>Applications</h2><ul>${li(product.applications.map(esc))}</ul>`
      : '',
    `<h2>Supply and support</h2>`,
    p(CITABLE),
    p(
      'Every machine is commissioned by our own technicians and handed over with structured operator training. Genuine parts are stocked centrally with regional stocking in the major work zones, and a factory-trained technician can be on site typically within 24 to 48 hours anywhere in Nepal.',
    ),
    others.length ? `<h2>Other machines</h2>${machineList(others)}` : '',
    CONTACT_BLOCK,
  ].join('')
}

function postBody(post) {
  const text = stripTags(post.body || post.content || '')
  return [
    `<h1>${esc(post.title)}</h1>`,
    post.publishedAt ? `<p>Published ${esc(String(post.publishedAt).slice(0, 10))}</p>` : '',
    p(post.excerpt),
    text ? p(text.slice(0, 1200)) : '',
    `<p>${link('/blog', 'More notes from the ground up')}</p>`,
    CONTACT_BLOCK,
  ].join('')
}

function staticBody(route, meta, { products, posts, locations }) {
  const heading = {
    '/': 'Tata Hitachi Nepal — Dugar Earthmovers',
    '/products': 'Tata Hitachi machines in Nepal',
    '/about': 'About Dugar Earthmovers',
    '/leadership': 'Leadership',
    '/compare': 'Tata Hitachi compared with other excavator brands in Nepal',
    '/contact': 'Contact Dugar Earthmovers',
    '/blog': 'Notes from the ground up',
    '/privacy': 'Privacy policy',
    '/terms': 'Terms of use',
  }[route]

  const parts = [`<h1>${esc(heading || meta.title)}</h1>`, p(meta.description)]

  /* Legal pages get the heading and their own description only — their real
   * content is long, static prose that belongs on the page, not restated. */
  if (route === '/privacy' || route === '/terms') {
    parts.push(`<p>${link('/', SITE_NAME)}</p>`)
    return parts.join('')
  }

  parts.push(p(CITABLE))

  if (route === '/' || route === '/products') {
    parts.push('<h2>Machines</h2>', machineList(products))
  }
  if (route === '/' || route === '/contact') {
    parts.push(branchList(locations))
  }
  if (route === '/blog' && posts.length) {
    parts.push(
      '<h2>Recent posts</h2>',
      `<ul>${li(
        posts
          .slice(0, 20)
          .map((post) => `${link(`/blog/${post.slug}`, post.title)}${post.excerpt ? ` — ${esc(post.excerpt)}` : ''}`),
      )}</ul>`,
    )
  }
  if (route === '/about' || route === '/leadership') {
    parts.push(
      p(
        `${PARENT_ORG} is a five-generation family business; Dugar Earthmovers is its earthmoving equipment arm.`,
      ),
      `<p>${link(PARENT_ORG_URL, PARENT_ORG)}</p>`,
    )
  }

  parts.push(
    '<h2>Pages</h2>',
    `<ul>${li(
      Object.entries(routeMeta)
        .filter(([r]) => r !== route)
        .map(([r, m]) => link(r, m.title)),
    )}</ul>`,
    CONTACT_BLOCK,
  )
  return parts.join('')
}

/* ── Document assembly ────────────────────────────────────────────── */

/* Modest inline styling. The snapshot is replaced the moment React mounts, but
 * on a slow connection it is briefly the visible page — legible plain type
 * beats unstyled default margins. Inline because the CSS bundle may not have
 * arrived either. */
const SNAPSHOT_STYLE = [
  'max-width:52rem',
  'margin:0 auto',
  'padding:3rem 1.5rem',
  'font:16px/1.6 system-ui,sans-serif',
  'color:#1a1a1a',
  'background:#f7f5f0',
].join(';')

function headTags({ title, description, canonical, image, type }) {
  const meta = [
    ['name', 'description', description],
    ['property', 'og:type', type],
    ['property', 'og:site_name', SITE_NAME],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['property', 'og:url', canonical],
    ['property', 'og:image', image],
    ['property', 'og:locale', 'en_NP'],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
    ['name', 'twitter:image', image],
  ]
  return [
    `<title>${esc(title)}</title>`,
    `<link data-seo rel="canonical" href="${esc(canonical)}" />`,
    `<meta data-seo name="robots" content="index, follow, max-image-preview:large" />`,
    ...meta.map(
      ([attr, key, value]) =>
        `<meta data-seo ${attr}="${esc(key)}" content="${esc(value)}" />`,
    ),
  ].join('\n  ')
}

/* `data-seo` on every emitted tag is what keeps this consistent with the
 * client: <Seo> clears all [data-seo] elements on mount and re-emits for the
 * current route, so the prerendered head is replaced rather than duplicated.
 * The <title> is untagged for the same reason — document.title overwrites it
 * in place. */
function buildPage(template, { title, description, canonical, image, type, blocks, body }) {
  const jsonLd = [organizationSchema(), websiteSchema(), ...blocks]
    .filter(Boolean)
    .map(
      (block) =>
        `<script data-seo type="application/ld+json">${JSON.stringify(block).replace(
          /</g,
          '\\u003c',
        )}</script>`,
    )
    .join('\n  ')

  const head = `${headTags({ title, description, canonical, image, type })}\n  ${jsonLd}`

  /* Drop the homepage defaults baked into index.html, then insert this
   * route's tags where they were. */
  const stripped = template
    .replace(/\s*<title>[\s\S]*?<\/title>/i, '')
    .replace(/\s*<(?:meta|link)\b[^>]*\bdata-seo\b[^>]*>/gi, '')
    .replace(/<\/head>/i, `  ${head}\n</head>`)

  return stripped.replace(
    /<div id="root">\s*<\/div>/i,
    `<div id="root"><div style="${SNAPSHOT_STYLE}">${body}</div></div>`,
  )
}

async function writePage(route, html) {
  const target =
    route === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, route.replace(/^\/+/, ''), 'index.html')
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, html, 'utf8')
}

/* ── Main ─────────────────────────────────────────────────────────── */

async function main() {
  const templatePath = path.join(distDir, 'index.html')
  let template
  try {
    template = await fs.readFile(templatePath, 'utf8')
  } catch {
    console.error('  ! dist/index.html missing — run `vite build` first')
    process.exit(1)
  }

  const [products, posts, locations] = await Promise.all([
    allProducts(),
    allPosts(),
    allLocations(),
  ])
  const data = { products, posts, locations }

  /* Static routes. The homepage is written last so its template read above is
   * not clobbered mid-run. */
  for (const [route, meta] of Object.entries(routeMeta)) {
    const canonical = absoluteUrl(route)
    const blocks = [
      breadcrumbSchema(
        route === '/' ? [{ name: 'Home', path: '/' }] : [
          { name: 'Home', path: '/' },
          { name: meta.title, path: route },
        ],
      ),
    ]
    if (route === '/products') {
      blocks.push(
        itemListSchema(
          products.map((m) => ({ name: `Tata Hitachi ${m.name}`, path: productPath(m) })),
        ),
      )
    }
    if (route === '/contact') {
      blocks.push(...locations.map(branchSchema))
    }
    await writePage(
      route,
      buildPage(template, {
        title: meta.title,
        description: meta.description,
        canonical,
        image: DEFAULT_OG_IMAGE,
        type: 'website',
        blocks,
        body: staticBody(route, meta, data),
      }),
    )
  }

  /* Product detail pages. Titles mirror ProductDetail.jsx exactly. */
  for (const product of products) {
    const route = productPath(product)
    const full = `Tata Hitachi ${product.name} — Specs & Price in Nepal`
    const title =
      full.length > 62 ? `Tata Hitachi ${product.name} — Nepal Specs & Price` : full
    const description = `${product.intro} Specifications, brochure and pricing from Dugar Earthmovers, Nepal's authorised Tata Hitachi distributor.`.slice(
      0,
      158,
    )
    await writePage(
      route,
      buildPage(template, {
        title,
        description,
        canonical: absoluteUrl(route),
        image: ogImageFor(product.image),
        type: 'product',
        blocks: [
          productSchema({ ...product, image: ogImageFor(product.image) }, route),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Machines', path: '/products' },
            { name: product.name, path: route },
          ]),
        ],
        body: productBody(product, products),
      }),
    )
  }

  for (const post of posts) {
    const route = `/blog/${post.slug}`
    await writePage(
      route,
      buildPage(template, {
        title: `${post.title} — Dugar Earthmovers`.slice(0, 62),
        description: (post.excerpt || stripTags(post.body || '')).slice(0, 158),
        canonical: absoluteUrl(route),
        image: ogImageFor(post.image),
        type: 'article',
        blocks: [
          blogPostingSchema(post, route),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: route },
          ]),
        ],
        body: postBody(post),
      }),
    )
  }

  const total = Object.keys(routeMeta).length + products.length + posts.length
  console.log(
    `  prerendered ${total} routes ` +
      `(${Object.keys(routeMeta).length} static, ${products.length} products, ${posts.length} posts)`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
