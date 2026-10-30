/* URL slug helpers.
 *
 * Product detail pages are addressed by a slug derived from the model code
 * (`ZAXIS-220LC` -> `zaxis-220lc`) rather than an opaque id, so the URL reads
 * as the machine a buyer searched for. The code is admin-editable, so the
 * lookup in ProductDetail always falls back to matching on name as well.
 *
 * Kept dependency-free and asset-import-free so `scripts/generate-sitemap.mjs`
 * can import it under plain Node.
 */

export function slugify(value) {
  return String(value || '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function productSlug(product) {
  return slugify(product?.code || product?.name)
}

export function productPath(product) {
  return `/products/${productSlug(product)}`
}

const squash = (v) => String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '')

/**
 * Machines a blog post names in its text, matched on model code or name with
 * spacing and punctuation ignored ("ZAXIS 220 LC" finds `ZAXIS-220LC`). The
 * blog page and its prerendered snapshot both link these, so every post
 * passes authority on to the product pages it discusses.
 */
export function productsMentioned(text, products) {
  const hay = squash(text)
  if (!hay) return []
  return products.filter((p) =>
    [p.code, p.name].some((key) => {
      const needle = squash(key)
      return needle.length >= 4 && hay.includes(needle)
    }),
  )
}
