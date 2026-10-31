/* Single source of truth for site-wide SEO constants and per-route metadata.
 *
 * Titles are kept under ~60 characters and descriptions under ~155 so they
 * are not truncated in the SERP. Every public route must have an entry here;
 * `routeMeta` is also what `scripts/generate-sitemap.mjs` reads to build
 * sitemap.xml, so adding a route in one place covers both.
 */

export const SITE_URL = 'https://www.dugarearthmovers.com.np'
export const SITE_NAME = 'Dugar Earthmovers'
export const LEGAL_NAME = 'Dugar Earthmovers Pvt. Ltd.'
export const PARENT_ORG = 'MV Dugar Group'
export const PARENT_ORG_URL = 'https://www.mvdugar.com/'

/* Official profiles of the same business, for Organization `sameAs`. These
 * tie the site to the Facebook and LinkedIn pages Google already ranks for
 * brand searches. Add YouTube / Instagram / Google Business Profile URLs here
 * once they exist. */
export const SAME_AS = [
  PARENT_ORG_URL,
  'https://www.facebook.com/TataHitachiNepal/',
  'https://www.linkedin.com/company/tata-hitachi-dugar-nepal',
]

/* Shown in Open Graph / Twitter cards when a page sets no image of its own.
 * Generated at 1200x630 by scripts/optimize-assets.mjs. */
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`

export const CONTACT = {
  salesPhone: '+9779802591430',
  servicePhone: '+9779801571065',
  email: 'sales.tatahitachinp@gmail.com',
  city: 'Kathmandu',
  country: 'NP',
}

/** Rupees in the Indian/Nepali grouping buyers read prices in: 95,00,000. */
export function formatNpr(amount) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)
}

/** Absolute URL for a site-relative path. Trailing slash only on the root. */
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  const clean = `/${String(path).replace(/^\/+/, '')}`.replace(/\/+$/, '')
  return clean === '' ? `${SITE_URL}/` : `${SITE_URL}${clean}`
}

/** Meta keywords for a machine page, kept under the 255-character limit. */
export function productKeywords(product) {
  const type = product.cat === 'backhoes' ? 'backhoe loader' : 'excavator'
  return [
    `Tata Hitachi ${product.name}`,
    `${product.name} price in Nepal`,
    `${product.name} specifications`,
    `Tata Hitachi ${type} Nepal`,
    `${type} price in Nepal`,
    'Dugar Earthmovers',
  ].join(', ')
}

export const routeMeta = {
  '/': {
    title: 'Tata Hitachi Nepal — Excavators & Backhoe Loaders | Dugar',
    description:
      'Authorised Tata Hitachi distributor in Nepal. Excavators, backhoe loaders, mining equipment, genuine parts and service across 10 branches nationwide.',
    keywords:
      'Tata Hitachi Nepal, Tata Hitachi dealer in Nepal, excavator in Nepal, excavator price in Nepal, backhoe loader Nepal, construction equipment Nepal, Dugar Earthmovers',
    priority: '1.0',
    changefreq: 'weekly',
  },
  '/products': {
    title: 'Tata Hitachi Excavators & Backhoes in Nepal — Full Range',
    description:
      'ZAXIS excavators, EX Prime series and Shinrai backhoe loaders. Specifications, brochures and pricing enquiries from Nepal’s authorised Tata Hitachi dealer.',
    keywords:
      'Tata Hitachi excavators Nepal, ZAXIS excavator, EX Prime excavator, Shinrai backhoe loader, mining excavator Nepal, excavator price in Nepal, backhoe loader price in Nepal',
    priority: '0.9',
    changefreq: 'weekly',
  },
  '/about': {
    title: 'About Dugar Earthmovers — Tata Hitachi Nepal',
    description:
      'Five generations of the Dugar family, authorised Tata Hitachi distributor for Nepal. Sales, service and genuine parts from 10 branches nationwide.',
    keywords:
      'Dugar Earthmovers, MV Dugar Group, Tata Hitachi distributor Nepal, Tata Hitachi Nepal, construction equipment dealer Nepal',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/leadership': {
    title: 'Leadership — The People Behind Dugar Earthmovers',
    description:
      'Meet the family and the management team running Tata Hitachi sales, service and parts across Nepal.',
    keywords:
      'Dugar Earthmovers leadership, MV Dugar Group, Dugar family, Tata Hitachi Nepal management',
    priority: '0.6',
    changefreq: 'monthly',
  },
  '/compare': {
    title: 'Tata Hitachi vs Other Excavators — Nepal Comparison',
    description:
      'Side-by-side specifications and service comparison. Why contractors across Nepal choose Tata Hitachi excavators over the alternatives.',
    keywords:
      'Tata Hitachi vs JCB, Tata Hitachi vs Hyundai, excavator comparison Nepal, backhoe loader comparison Nepal, best excavator in Nepal',
    priority: '0.8',
    changefreq: 'monthly',
  },
  '/contact': {
    title: 'Contact — Tata Hitachi Service & Sales Across Nepal',
    description:
      'Ten branches from Biratnagar to Dhangadi. Direct numbers for Tata Hitachi sales, service and genuine parts in your district.',
    keywords:
      'Tata Hitachi service centre Nepal, Tata Hitachi spare parts Nepal, Tata Hitachi Kathmandu, Tata Hitachi Biratnagar, Tata Hitachi Pokhara, Tata Hitachi Butwal, Dugar Earthmovers contact',
    priority: '0.9',
    changefreq: 'monthly',
  },
  '/blog': {
    title: 'Notes from the Ground Up — Tata Hitachi Nepal Blog',
    description:
      'Machine guides, maintenance advice and site notes from Nepal’s authorised Tata Hitachi sales and service team.',
    keywords:
      'excavator maintenance, backhoe loader tips, excavator buying guide Nepal, Tata Hitachi Nepal blog, construction equipment Nepal',
    priority: '0.7',
    changefreq: 'weekly',
  },
  '/privacy': {
    title: 'Privacy Policy — Dugar Earthmovers',
    description:
      'What details this site collects, why we hold them, who else sees them, and how long we keep them.',
    keywords:
      'Dugar Earthmovers privacy policy',
    priority: '0.3',
    changefreq: 'yearly',
  },
  '/terms': {
    title: 'Terms of Use — Dugar Earthmovers',
    description:
      'The terms that apply to using this site, including how machine specifications, warranty and enquiries are treated.',
    keywords:
      'Dugar Earthmovers terms of use',
    priority: '0.3',
    changefreq: 'yearly',
  },
}
