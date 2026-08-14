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

/** Absolute URL for a site-relative path. Trailing slash only on the root. */
export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  const clean = `/${String(path).replace(/^\/+/, '')}`.replace(/\/+$/, '')
  return clean === '' ? `${SITE_URL}/` : `${SITE_URL}${clean}`
}

export const routeMeta = {
  '/': {
    title: 'Tata Hitachi Nepal — Excavators & Backhoe Loaders | Dugar',
    description:
      'Authorised Tata Hitachi distributor in Nepal. Excavators, backhoe loaders, mining equipment, genuine parts and service across 10 branches nationwide.',
    priority: '1.0',
    changefreq: 'weekly',
  },
  '/products': {
    title: 'Tata Hitachi Excavators & Backhoes in Nepal — Full Range',
    description:
      'ZAXIS excavators, EX Prime series and Shinrai backhoe loaders. Specifications, brochures and pricing enquiries from Nepal’s authorised Tata Hitachi dealer.',
    priority: '0.9',
    changefreq: 'weekly',
  },
  '/about': {
    title: 'About Dugar Earthmovers — Tata Hitachi Nepal',
    description:
      'Five generations of the Dugar family, authorised Tata Hitachi distributor for Nepal. Sales, service and genuine parts from 10 branches nationwide.',
    priority: '0.7',
    changefreq: 'monthly',
  },
  '/leadership': {
    title: 'Leadership — The People Behind Dugar Earthmovers',
    description:
      'Meet the family and the management team running Tata Hitachi sales, service and parts across Nepal.',
    priority: '0.6',
    changefreq: 'monthly',
  },
  '/compare': {
    title: 'Tata Hitachi vs Other Excavators — Nepal Comparison',
    description:
      'Side-by-side specifications and service comparison. Why contractors across Nepal choose Tata Hitachi excavators over the alternatives.',
    priority: '0.8',
    changefreq: 'monthly',
  },
  '/contact': {
    title: 'Contact — Tata Hitachi Service & Sales Across Nepal',
    description:
      'Ten branches from Biratnagar to Dhangadi. Direct numbers for Tata Hitachi sales, service and genuine parts in your district.',
    priority: '0.9',
    changefreq: 'monthly',
  },
  '/blog': {
    title: 'Notes from the Ground Up — Tata Hitachi Nepal Blog',
    description:
      'Machine guides, maintenance advice and site notes from Nepal’s authorised Tata Hitachi sales and service team.',
    priority: '0.7',
    changefreq: 'weekly',
  },
  '/privacy': {
    title: 'Privacy Policy — Dugar Earthmovers',
    description:
      'What details this site collects, why we hold them, who else sees them, and how long we keep them.',
    priority: '0.3',
    changefreq: 'yearly',
  },
  '/terms': {
    title: 'Terms of Use — Dugar Earthmovers',
    description:
      'The terms that apply to using this site, including how machine specifications, warranty and enquiries are treated.',
    priority: '0.3',
    changefreq: 'yearly',
  },
}
