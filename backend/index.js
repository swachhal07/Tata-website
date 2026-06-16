import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// dotenv loads .env by default; also load .env.local if present
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: false })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname
const DATA_DIR = path.join(ROOT, 'data')
const UPLOADS_DIR = path.join(ROOT, 'uploads')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

await fs.mkdir(DATA_DIR, { recursive: true })
await fs.mkdir(UPLOADS_DIR, { recursive: true })
try {
  await fs.access(PRODUCTS_FILE)
} catch {
  await fs.writeFile(PRODUCTS_FILE, '{"overrides":[],"hidden":[]}', 'utf8')
}

const PORT = Number(process.env.PORT || 3001)
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'sales.tatahitachinp@gmail.com').toLowerCase()
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme'
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex')
const COOKIE_NAME = 'th_admin'

function signSession() {
  const payload = JSON.stringify({ admin: true, iat: Date.now() })
  const b64 = Buffer.from(payload).toString('base64url')
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(b64).digest('base64url')
  return `${b64}.${sig}`
}

function verifySession(token) {
  if (!token || typeof token !== 'string') return false
  const [b64, sig] = token.split('.')
  if (!b64 || !sig) return false
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(b64).digest('base64url')
  if (sig.length !== expected.length) return false
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false
  try {
    const { admin, iat } = JSON.parse(Buffer.from(b64, 'base64url').toString())
    if (!admin) return false
    if (Date.now() - iat > 1000 * 60 * 60 * 24 * 7) return false
    return true
  } catch {
    return false
  }
}

function requireAuth(req, res, next) {
  if (verifySession(req.cookies?.[COOKIE_NAME])) return next()
  res.status(401).json({ error: 'Unauthorized' })
}

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOADS_DIR,
    filename: (_req, file, cb) => {
      const id = crypto.randomBytes(8).toString('hex')
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '')
      cb(null, `${Date.now()}-${id}${ext}`)
    },
  }),
  limits: { fileSize: 12 * 1024 * 1024 },
})

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '30d' }))

/* ─────────── Auth ─────────── */

app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {}
  const emailOk =
    typeof email === 'string' && email.trim().toLowerCase() === ADMIN_EMAIL
  const passOk = typeof password === 'string' && password === ADMIN_PASSWORD
  if (!emailOk || !passOk) {
    return res.status(401).json({ error: 'Wrong email or password' })
  }
  res.cookie(COOKIE_NAME, signSession(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  })
  res.json({ ok: true })
})

app.post('/api/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME)
  res.json({ ok: true })
})

app.get('/api/me', (req, res) => {
  res.json({ admin: verifySession(req.cookies?.[COOKIE_NAME]) })
})

/* ─────────── Products ───────────
 * Storage shape: { overrides: [...products], hidden: [...codes] }
 *  - overrides:  full product objects added or edited via /admin
 *  - hidden:     seed product codes the admin has removed from the catalogue
 *
 * Backward compat: if products.json contains a bare array (the old format),
 * we treat it as overrides and an empty hidden list.
 */

async function readStore() {
  const raw = await fs.readFile(PRODUCTS_FILE, 'utf8')
  let parsed
  try {
    parsed = JSON.parse(raw || '{"overrides":[],"hidden":[]}')
  } catch {
    parsed = { overrides: [], hidden: [] }
  }
  if (Array.isArray(parsed)) return { overrides: parsed, hidden: [] }
  return {
    overrides: Array.isArray(parsed.overrides) ? parsed.overrides : [],
    hidden: Array.isArray(parsed.hidden) ? parsed.hidden : [],
  }
}

async function writeStore(store) {
  await fs.writeFile(PRODUCTS_FILE, JSON.stringify(store, null, 2), 'utf8')
}

function parseBody(req) {
  const b = req.body || {}
  let specs = []
  try {
    specs = b.specs ? JSON.parse(b.specs) : []
  } catch {
    throw new Error('Specs JSON is malformed')
  }
  const applications = (b.applications || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const tags = (b.tags || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return {
    name: b.name?.trim() || '',
    cat: b.cat?.trim() || '',
    series: b.series?.trim() || '',
    intro: b.intro?.trim() || '',
    specs: specs
      .map((s) => ({ label: String(s.label || '').trim(), value: String(s.value || '').trim() }))
      .filter((s) => s.label && s.value),
    applications,
    tags,
  }
}

app.get('/api/products', async (_req, res) => {
  try {
    const store = await readStore()
    res.json({ products: store.overrides, hidden: store.hidden })
  } catch (err) {
    console.error('[products] read failed', err)
    res.status(500).json({ error: 'Could not load products' })
  }
})

app.post(
  '/api/admin/products',
  requireAuth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const b = req.body || {}
      if (!b.code || !b.name || !b.cat) {
        return res.status(400).json({ error: 'Code, name and category are required' })
      }
      let parsed
      try {
        parsed = parseBody(req)
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }

      const imageFile = req.files?.image?.[0]
      const pdfFile = req.files?.pdf?.[0]

      const code = b.code.trim()
      const store = await readStore()
      if (store.overrides.some((p) => p.code === code)) {
        return res.status(409).json({ error: `A product with code ${code} already exists` })
      }

      const product = {
        code,
        ...parsed,
        ...(parsed.tags.length ? { tags: parsed.tags } : {}),
        image: imageFile ? `/uploads/${imageFile.filename}` : null,
        pdf: pdfFile ? `/uploads/${pdfFile.filename}` : null,
        addedAt: new Date().toISOString(),
        dynamic: true,
      }
      delete product.tags // re-added conditionally above
      if (parsed.tags.length) product.tags = parsed.tags

      store.overrides.unshift(product)
      store.hidden = store.hidden.filter((c) => c !== code)
      await writeStore(store)
      res.json({ product })
    } catch (err) {
      console.error('[admin/products POST] failed', err)
      res.status(500).json({ error: 'Could not save product' })
    }
  },
)

app.put(
  '/api/admin/products/:code',
  requireAuth,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const targetCode = req.params.code
      const b = req.body || {}
      if (!b.name || !b.cat) {
        return res.status(400).json({ error: 'Name and category are required' })
      }
      let parsed
      try {
        parsed = parseBody(req)
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }

      const imageFile = req.files?.image?.[0]
      const pdfFile = req.files?.pdf?.[0]
      const newCode = (b.code?.trim() || targetCode)

      const store = await readStore()
      const existing = store.overrides.find((p) => p.code === targetCode)

      // If renaming code, ensure new code isn't taken
      if (newCode !== targetCode && store.overrides.some((p) => p.code === newCode)) {
        return res.status(409).json({ error: `Code ${newCode} is already in use` })
      }

      const product = {
        code: newCode,
        ...parsed,
        ...(parsed.tags.length ? { tags: parsed.tags } : {}),
        image: imageFile ? `/uploads/${imageFile.filename}` : existing?.image ?? null,
        pdf: pdfFile ? `/uploads/${pdfFile.filename}` : existing?.pdf ?? null,
        addedAt: existing?.addedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dynamic: true,
      }
      delete product.tags
      if (parsed.tags.length) product.tags = parsed.tags

      if (existing) {
        store.overrides = store.overrides.map((p) =>
          p.code === targetCode ? product : p,
        )
      } else {
        store.overrides.unshift(product)
      }

      // Editing un-hides the code; if renamed, also un-hide new code
      store.hidden = store.hidden.filter(
        (c) => c !== targetCode && c !== newCode,
      )

      await writeStore(store)
      res.json({ product })
    } catch (err) {
      console.error('[admin/products PUT] failed', err)
      res.status(500).json({ error: 'Could not update product' })
    }
  },
)

app.delete('/api/admin/products/:code', requireAuth, async (req, res) => {
  try {
    const code = req.params.code
    const store = await readStore()
    const beforeCount = store.overrides.length
    store.overrides = store.overrides.filter((p) => p.code !== code)
    const removedOverride = store.overrides.length < beforeCount
    // Mark as hidden so any seed product with the same code is also removed from the catalogue
    if (!store.hidden.includes(code)) store.hidden.push(code)
    await writeStore(store)
    res.json({ ok: true, removedOverride })
  } catch (err) {
    console.error('[admin/products DELETE] failed', err)
    res.status(500).json({ error: 'Could not delete' })
  }
})

app.post('/api/admin/products/:code/restore', requireAuth, async (req, res) => {
  try {
    const code = req.params.code
    const store = await readStore()
    store.hidden = store.hidden.filter((c) => c !== code)
    await writeStore(store)
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/products restore] failed', err)
    res.status(500).json({ error: 'Could not restore' })
  }
})

/* Mail handling lives in the frontend folder (api/send-mail.js as a
 * Vercel serverless function). Local dev uses a Vite middleware so
 * the contact form works without running this server. */

app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`)
})
