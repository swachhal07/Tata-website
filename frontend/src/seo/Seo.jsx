import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  routeMeta,
} from './siteMeta'
import { organizationSchema, websiteSchema } from './structuredData'

/* Every element this component writes carries `data-seo`, so a route change
 * can clear the previous page's tags without touching anything Vite or the
 * Cloudflare beacon put in <head>. */
const OWNED = 'data-seo'

function clearOwned() {
  document.head.querySelectorAll(`[${OWNED}]`).forEach((el) => el.remove())
}

function addTag(tag, attrs) {
  const el = document.createElement(tag)
  el.setAttribute(OWNED, '')
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  document.head.appendChild(el)
}

function addMeta(keyAttr, key, content) {
  if (!content) return
  addTag('meta', { [keyAttr]: key, content })
}

/**
 * Sets the document head for the current route.
 *
 * Pages either pass nothing (and inherit the entry in `routeMeta` keyed by
 * pathname) or override individual fields — product and blog detail pages
 * build their own title, description and JSON-LD.
 *
 * `jsonLd` accepts a single object or an array; each becomes its own
 * <script type="application/ld+json"> block.
 */
export default function Seo({
  title,
  description,
  image,
  path,
  type = 'website',
  noindex = false,
  jsonLd,
}) {
  const { pathname } = useLocation()
  const canonicalPath = path || pathname
  const fallback = routeMeta[canonicalPath] || routeMeta['/']

  const finalTitle = title || fallback.title
  const finalDescription = description || fallback.description
  const finalImage = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE
  const canonical = absoluteUrl(canonicalPath)
  const serialisedJsonLd = JSON.stringify(jsonLd ?? null)

  useEffect(() => {
    clearOwned()
    document.title = finalTitle

    addMeta('name', 'description', finalDescription)
    addTag('link', { rel: 'canonical', href: canonical })
    addMeta(
      'name',
      'robots',
      noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large',
    )

    addMeta('property', 'og:type', type)
    addMeta('property', 'og:site_name', SITE_NAME)
    addMeta('property', 'og:title', finalTitle)
    addMeta('property', 'og:description', finalDescription)
    addMeta('property', 'og:url', canonical)
    addMeta('property', 'og:image', finalImage)
    addMeta('property', 'og:locale', 'en_NP')

    addMeta('name', 'twitter:card', 'summary_large_image')
    addMeta('name', 'twitter:title', finalTitle)
    addMeta('name', 'twitter:description', finalDescription)
    addMeta('name', 'twitter:image', finalImage)

    // Organization and WebSite are emitted on every page so the entity is
    // resolvable from whichever URL a crawler lands on first. Page-specific
    // blocks reference them by @id rather than repeating them.
    const pageBlocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []
    const blocks = [organizationSchema(), websiteSchema(), ...pageBlocks]
    for (const block of blocks.filter(Boolean)) {
      const script = document.createElement('script')
      script.setAttribute(OWNED, '')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(block)
      document.head.appendChild(script)
    }
    // `serialisedJsonLd` stands in for `jsonLd` so a structurally identical
    // object rebuilt on re-render does not retrigger the effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    finalTitle,
    finalDescription,
    finalImage,
    canonical,
    type,
    noindex,
    serialisedJsonLd,
  ])

  return null
}
