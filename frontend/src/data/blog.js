/* Helpers shared by the public blog and the admin editor. Posts live in
 * the database and are served by `GET /api/posts`; there is no bundled
 * fallback, so an empty blog renders its empty state. */

export function readingTime(body) {
  const words = String(body || '').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/* Body text is stored as plain text, never HTML - nothing here is
 * injected as markup. Blank lines separate blocks; a leading "## " makes
 * a subheading and a leading "- " makes a bullet. */
export function parseBody(body) {
  return String(body || '')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith('## ')) {
        return { type: 'heading', text: block.slice(3).trim() }
      }
      if (/^[-*]\s+/m.test(block) && block.split('\n').every((l) => /^[-*]\s+/.test(l.trim()))) {
        return {
          type: 'list',
          items: block
            .split('\n')
            .map((l) => l.trim().replace(/^[-*]\s+/, ''))
            .filter(Boolean),
        }
      }
      return { type: 'paragraph', text: block }
    })
}

/** First paragraph, trimmed - used when a post has no explicit excerpt. */
export function autoExcerpt(body, max = 180) {
  const first = parseBody(body).find((b) => b.type === 'paragraph')?.text || ''
  return first.length > max ? `${first.slice(0, max).trimEnd()}…` : first
}
