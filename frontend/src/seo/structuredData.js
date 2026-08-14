/* JSON-LD builders. Every function here returns a plain object that <Seo>
 * serialises into a <script type="application/ld+json"> block.
 *
 * Rule of thumb: only emit a property when the underlying data actually
 * exists. A LocalBusiness with a fabricated street address is worse than one
 * without an address at all, so optional fields are dropped rather than
 * guessed.
 */
import {
  SITE_URL,
  SITE_NAME,
  LEGAL_NAME,
  PARENT_ORG,
  PARENT_ORG_URL,
  CONTACT,
  DEFAULT_OG_IMAGE,
  absoluteUrl,
  /* Extension is required: scripts/prerender.mjs imports this module under
   * plain Node, which does not do extensionless resolution the way Vite does. */
} from './siteMeta.js'

const ORG_ID = `${SITE_URL}/#organization`
const SITE_ID = `${SITE_URL}/#website`

/** Drop keys whose value is undefined, null, '' or an empty array. */
function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === undefined || v === null || v === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    }),
  )
}

/** Normalise a Nepali mobile number to E.164 for `telephone`. */
export function toE164(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (!digits) return undefined
  if (digits.startsWith('977')) return `+${digits}`
  return `+977${digits.replace(/^0+/, '')}`
}

/** Sitewide entity. Emitted once, on every page, via <Layout>. */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': ORG_ID,
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: `${SITE_URL}/`,
    logo: DEFAULT_OG_IMAGE,
    image: DEFAULT_OG_IMAGE,
    description:
      'Authorised Tata Hitachi distributor for Nepal. Excavators, backhoe loaders, mining equipment, genuine parts and factory-trained service from 10 branches nationwide.',
    parentOrganization: {
      '@type': 'Organization',
      name: PARENT_ORG,
      url: PARENT_ORG_URL,
    },
    brand: { '@type': 'Brand', name: 'Tata Hitachi' },
    areaServed: { '@type': 'Country', name: 'Nepal' },
    address: {
      '@type': 'PostalAddress',
      addressLocality: CONTACT.city,
      addressCountry: CONTACT.country,
    },
    email: CONTACT.email,
    telephone: CONTACT.salesPhone,
    sameAs: [PARENT_ORG_URL],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        telephone: CONTACT.salesPhone,
        email: CONTACT.email,
        areaServed: 'NP',
        availableLanguage: ['en', 'ne'],
      },
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: CONTACT.servicePhone,
        areaServed: 'NP',
        availableLanguage: ['en', 'ne'],
      },
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  }
}

/**
 * One LocalBusiness per branch, from the admin-managed location list.
 *
 * `streetAddress` and `openingHours` are not in the data model yet — when
 * they are added to a location record they flow through here automatically.
 */
export function branchSchema(location) {
  if (!location?.city) return null
  const label = location.label || 'Service'
  return compact({
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${SITE_URL}/contact#${location.id}`,
    name: `${SITE_NAME} — ${location.city} (${label})`,
    parentOrganization: { '@id': ORG_ID },
    url: `${SITE_URL}/contact`,
    image: DEFAULT_OG_IMAGE,
    telephone: toE164(location.phone),
    address: compact({
      '@type': 'PostalAddress',
      streetAddress: location.streetAddress,
      addressLocality: location.city,
      addressCountry: 'NP',
    }),
    geo:
      typeof location.lat === 'number' && typeof location.lng === 'number'
        ? {
            '@type': 'GeoCoordinates',
            latitude: location.lat,
            longitude: location.lng,
          }
        : undefined,
    openingHours: location.openingHours,
    hasMap: location.mapUrl,
    areaServed: { '@type': 'City', name: location.city },
    brand: { '@type': 'Brand', name: 'Tata Hitachi' },
  })
}

export function faqSchema(faqs) {
  if (!faqs?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function productSchema(product, path) {
  if (!product?.name) return null
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Tata Hitachi ${product.name}`,
    sku: product.code,
    url: absoluteUrl(path),
    image: product.image ? absoluteUrl(product.image) : DEFAULT_OG_IMAGE,
    description: product.intro,
    category: product.series,
    brand: { '@type': 'Brand', name: 'Tata Hitachi' },
    manufacturer: { '@type': 'Organization', name: 'Tata Hitachi Construction Machinery' },
    additionalProperty: (product.specs || []).map((s) => ({
      '@type': 'PropertyValue',
      name: s.label,
      value: s.value,
    })),
    offers: {
      '@type': 'Offer',
      // Prices are quoted per enquiry, so no `price` is asserted here.
      availability: 'https://schema.org/InStock',
      priceCurrency: 'NPR',
      areaServed: { '@type': 'Country', name: 'Nepal' },
      seller: { '@id': ORG_ID },
      url: absoluteUrl(path),
    },
  })
}

export function breadcrumbSchema(trail) {
  if (!trail?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function itemListSchema(items) {
  if (!items?.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  }
}

export function blogPostingSchema(post, path) {
  if (!post?.title) return null
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(path),
    image: post.image ? absoluteUrl(post.image) : DEFAULT_OG_IMAGE,
    datePublished: post.publishedAt || post.createdAt,
    dateModified: post.updatedAt || post.publishedAt || post.createdAt,
    author: { '@type': 'Organization', name: SITE_NAME, '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
    inLanguage: 'en',
  })
}
