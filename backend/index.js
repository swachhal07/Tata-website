import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import crypto from 'node:crypto'
import dns from 'node:dns'
import { Readable } from 'node:stream'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

// Use public resolvers for SRV lookups (works around Windows c-ares
// picking up an unreachable system DNS server during local dev).
dns.setServers(['8.8.8.8', '1.1.1.1'])

// dotenv loads .env by default; also load .env.local if present
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: false })

const PORT = Number(process.env.PORT || 3001)
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || 'tata_hitachi'

if (!MONGODB_URI) {
  console.error('[fatal] MONGODB_URI is required')
  process.exit(1)
}
if (!process.env.CLOUDINARY_URL) {
  console.error('[fatal] CLOUDINARY_URL is required')
  process.exit(1)
}

// SDK auto-reads CLOUDINARY_URL; force https on generated URLs.
// First call with `true` forces env re-read (the SDK caches at import time).
cloudinary.config(true)
cloudinary.config({ secure: true })

const mongo = new MongoClient(MONGODB_URI)
await mongo.connect()
const db = mongo.db(MONGODB_DB)
const productsCol = db.collection('products')
const metaCol = db.collection('meta')
await productsCol.createIndex({ code: 1 }, { unique: true })
console.log(`[mongo] connected to ${MONGODB_DB}`)

const CLOUDINARY_FOLDER = 'tata_hitachi'

function uploadBuffer(buffer, { resourceType = 'auto', originalName }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: resourceType,
        // Keep PDFs identifiable by original filename in the Cloudinary console
        ...(originalName ? { public_id: undefined, use_filename: true, unique_filename: true } : {}),
      },
      (err, result) => (err ? reject(err) : resolve(result)),
    )
    Readable.from(buffer).pipe(stream)
  })
}
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
  storage: multer.memoryStorage(),
  // Match Cloudinary free-plan per-file limit (10 MB)
  limits: { fileSize: 10 * 1024 * 1024 },
})

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(cookieParser())

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
 * Mongo collections:
 *  - products: one doc per admin-added/edited product (unique on `code`)
 *  - meta:     single doc { _id: 'hidden', codes: [seed codes removed] }
 *
 * API shape preserved: { products, hidden } so the frontend is unchanged.
 */

async function readHiddenCodes() {
  const doc = await metaCol.findOne({ _id: 'hidden' })
  return Array.isArray(doc?.codes) ? doc.codes : []
}

async function setHidden(codeToAdd, codesToRemove = []) {
  const update = {}
  if (codesToRemove.length) update.$pull = { codes: { $in: codesToRemove } }
  if (codeToAdd) update.$addToSet = { codes: codeToAdd }
  if (!Object.keys(update).length) return
  await metaCol.updateOne({ _id: 'hidden' }, update, { upsert: true })
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
    const [products, hidden] = await Promise.all([
      productsCol
        .find({}, { projection: { _id: 0 } })
        .sort({ addedAt: -1 })
        .toArray(),
      readHiddenCodes(),
    ])
    res.json({ products, hidden })
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
      const conflict = await productsCol.findOne({ code }, { projection: { _id: 1 } })
      if (conflict) {
        return res.status(409).json({ error: `A product with code ${code} already exists` })
      }

      const [imageResult, pdfResult] = await Promise.all([
        imageFile ? uploadBuffer(imageFile.buffer, { resourceType: 'image' }) : null,
        pdfFile ? uploadBuffer(pdfFile.buffer, { resourceType: 'raw', originalName: pdfFile.originalname }) : null,
      ])

      const product = {
        code,
        ...parsed,
        ...(parsed.tags.length ? { tags: parsed.tags } : {}),
        image: imageResult?.secure_url || null,
        pdf: pdfResult?.secure_url || null,
        addedAt: new Date().toISOString(),
        dynamic: true,
      }
      delete product.tags // re-added conditionally above
      if (parsed.tags.length) product.tags = parsed.tags

      await productsCol.insertOne({ ...product })
      await setHidden(null, [code])
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

      const existing = await productsCol.findOne(
        { code: targetCode },
        { projection: { _id: 0 } },
      )

      // If renaming code, ensure new code isn't taken
      if (newCode !== targetCode) {
        const conflict = await productsCol.findOne(
          { code: newCode },
          { projection: { _id: 1 } },
        )
        if (conflict) {
          return res.status(409).json({ error: `Code ${newCode} is already in use` })
        }
      }

      const [imageResult, pdfResult] = await Promise.all([
        imageFile ? uploadBuffer(imageFile.buffer, { resourceType: 'image' }) : null,
        pdfFile ? uploadBuffer(pdfFile.buffer, { resourceType: 'raw', originalName: pdfFile.originalname }) : null,
      ])

      const product = {
        code: newCode,
        ...parsed,
        ...(parsed.tags.length ? { tags: parsed.tags } : {}),
        image: imageResult?.secure_url || existing?.image || null,
        pdf: pdfResult?.secure_url || existing?.pdf || null,
        addedAt: existing?.addedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dynamic: true,
      }
      delete product.tags
      if (parsed.tags.length) product.tags = parsed.tags

      if (existing) {
        await productsCol.replaceOne({ code: targetCode }, { ...product })
      } else {
        await productsCol.insertOne({ ...product })
      }

      // Editing un-hides the code; if renamed, also un-hide new code
      await setHidden(null, [targetCode, newCode])

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
    const result = await productsCol.deleteOne({ code })
    // Mark as hidden so any seed product with the same code is also removed from the catalogue
    await setHidden(code)
    res.json({ ok: true, removedOverride: result.deletedCount > 0 })
  } catch (err) {
    console.error('[admin/products DELETE] failed', err)
    res.status(500).json({ error: 'Could not delete' })
  }
})

app.post('/api/admin/products/:code/restore', requireAuth, async (req, res) => {
  try {
    const code = req.params.code
    await setHidden(null, [code])
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
