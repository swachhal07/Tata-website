import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import crypto from 'node:crypto'
import dns from 'node:dns'
import { readFile } from 'node:fs/promises'
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
const locationsCol = db.collection('locations')
const peopleCol = db.collection('people')
const postsCol = db.collection('posts')
await productsCol.createIndex({ code: 1 }, { unique: true })
await locationsCol.createIndex({ id: 1 }, { unique: true })
await peopleCol.createIndex({ id: 1 }, { unique: true })
await postsCol.createIndex({ slug: 1 }, { unique: true })
console.log(`[mongo] connected to ${MONGODB_DB}`)

// First boot: load the branch network that used to be hardcoded in the
// frontend so the admin console has something to edit. Runs only when the
// collection is empty - it never overwrites live edits.
{
  const count = await locationsCol.countDocuments()
  if (count === 0) {
    const seed = JSON.parse(
      await readFile(new URL('./data/locations.json', import.meta.url), 'utf8'),
    )
    if (seed.length) {
      await locationsCol.insertMany(seed.map((l) => ({ ...l })))
      console.log(`[mongo] seeded ${seed.length} locations`)
    }
  }
}

// Same for the leadership roster. Seeded photos are null: the frontend
// falls back to the bundled portrait for these ids until an admin
// uploads a replacement.
{
  const count = await peopleCol.countDocuments()
  if (count === 0) {
    const seed = JSON.parse(
      await readFile(new URL('./data/people.json', import.meta.url), 'utf8'),
    )
    if (seed.length) {
      await peopleCol.insertMany(seed.map((p) => ({ ...p })))
      console.log(`[mongo] seeded ${seed.length} people`)
    }
  }
}

// Starter blog posts so the public blog isn't empty on launch. These are
// meant to be edited or replaced from the admin console.
{
  const count = await postsCol.countDocuments()
  if (count === 0) {
    const seed = JSON.parse(
      await readFile(new URL('./data/posts.json', import.meta.url), 'utf8'),
    )
    if (seed.length) {
      await postsCol.insertMany(seed.map((p) => ({ ...p })))
      console.log(`[mongo] seeded ${seed.length} blog posts`)
    }
  }
}

const CLOUDINARY_FOLDER = 'tata_hitachi'

// Time an async operation and log how long it took. `label` groups the
// timings under one request so slow saves are easy to spot in the logs.
async function timed(label, fn) {
  const start = process.hrtime.bigint()
  try {
    return await fn()
  } finally {
    const ms = Number(process.hrtime.bigint() - start) / 1e6
    console.log(`[timing] ${label}: ${ms.toFixed(0)}ms`)
  }
}

// Cloudinary derives the delivery Content-Type of a `raw` asset from the
// public_id's extension. Without one it serves application/octet-stream with
// `Content-Disposition: attachment`, so a brochure downloads as a nameless
// blob instead of opening in the browser's PDF viewer. `use_filename` does
// not add the extension for raw uploads, so build the public_id ourselves.
function rawPublicId(originalName, extension) {
  const base = String(originalName || 'brochure')
    .replace(/\.[^.]+$/, '')
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  const suffix = crypto.randomBytes(4).toString('hex')
  return `${base || 'brochure'}-${suffix}${extension}`
}

function uploadBuffer(buffer, { resourceType = 'auto', originalName, extension }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CLOUDINARY_FOLDER,
        resource_type: resourceType,
        // Keep the original filename readable, and — for raw assets — carry the
        // extension so Cloudinary serves the right Content-Type.
        ...(extension ? { public_id: rawPublicId(originalName, extension) } : {}),
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

// Manual drag-and-drop ordering, stored as { _id: 'order', cats: { <cat>: [codes] } }.
async function readOrder() {
  const doc = await metaCol.findOne({ _id: 'order' })
  return doc?.cats && typeof doc.cats === 'object' ? doc.cats : {}
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
    const [products, hidden, order] = await Promise.all([
      productsCol
        .find({}, { projection: { _id: 0 } })
        .sort({ addedAt: -1 })
        .toArray(),
      readHiddenCodes(),
      readOrder(),
    ])
    res.json({ products, hidden, order })
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
      const conflict = await timed('POST mongo.findOne(conflict)', () =>
        productsCol.findOne({ code }, { projection: { _id: 1 } }),
      )
      if (conflict) {
        return res.status(409).json({ error: `A product with code ${code} already exists` })
      }

      const [imageResult, pdfResult] = await timed(
        `POST cloudinary.upload (image=${imageFile ? (imageFile.size / 1024).toFixed(0) + 'KB' : 'none'}, pdf=${pdfFile ? (pdfFile.size / 1024).toFixed(0) + 'KB' : 'none'})`,
        () =>
          Promise.all([
            imageFile ? uploadBuffer(imageFile.buffer, { resourceType: 'image' }) : null,
            pdfFile ? uploadBuffer(pdfFile.buffer, { resourceType: 'raw', originalName: pdfFile.originalname, extension: '.pdf' }) : null,
          ]),
      )

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

      await timed('POST mongo.insertOne', () => productsCol.insertOne({ ...product }))
      await timed('POST mongo.setHidden', () => setHidden(null, [code]))
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

      const existing = await timed('PUT mongo.findOne(existing)', () =>
        productsCol.findOne({ code: targetCode }, { projection: { _id: 0 } }),
      )

      // If renaming code, ensure new code isn't taken
      if (newCode !== targetCode) {
        const conflict = await timed('PUT mongo.findOne(conflict)', () =>
          productsCol.findOne({ code: newCode }, { projection: { _id: 1 } }),
        )
        if (conflict) {
          return res.status(409).json({ error: `Code ${newCode} is already in use` })
        }
      }

      const [imageResult, pdfResult] = await timed(
        `PUT cloudinary.upload (image=${imageFile ? (imageFile.size / 1024).toFixed(0) + 'KB' : 'none'}, pdf=${pdfFile ? (pdfFile.size / 1024).toFixed(0) + 'KB' : 'none'})`,
        () =>
          Promise.all([
            imageFile ? uploadBuffer(imageFile.buffer, { resourceType: 'image' }) : null,
            pdfFile ? uploadBuffer(pdfFile.buffer, { resourceType: 'raw', originalName: pdfFile.originalname, extension: '.pdf' }) : null,
          ]),
      )

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
        await timed('PUT mongo.replaceOne', () =>
          productsCol.replaceOne({ code: targetCode }, { ...product }),
        )
      } else {
        await timed('PUT mongo.insertOne', () => productsCol.insertOne({ ...product }))
      }

      // Editing un-hides the code; if renamed, also un-hide new code
      await timed('PUT mongo.setHidden', () => setHidden(null, [targetCode, newCode]))

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

// Save the drag-and-drop order for one category: { cat, codes: [...] }
app.put('/api/admin/order', requireAuth, async (req, res) => {
  try {
    const { cat, codes } = req.body || {}
    if (typeof cat !== 'string' || !cat.trim() || !Array.isArray(codes)) {
      return res.status(400).json({ error: 'cat and codes[] are required' })
    }
    const clean = codes
      .filter((c) => typeof c === 'string' && c.trim())
      .map((c) => c.trim())
    await metaCol.updateOne(
      { _id: 'order' },
      { $set: { [`cats.${cat.trim()}`]: clean } },
      { upsert: true },
    )
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/order PUT] failed', err)
    res.status(500).json({ error: 'Could not save order' })
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

/* ─────────── Locations (branch network) ───────────
 * One doc per branch entry. `kind` splits the two lists on the Contact
 * page: 'sales' (sales representatives) and 'service' (service & spare
 * centres). Entries with coordinates and showOnMap render as map pins.
 */

const LABEL_OFFSETS = ['up', 'down', 'left', 'right']

// Pull coordinates out of a Google Maps URL. Covers the shapes people
// actually paste: the /@lat,lng,17z form from the address bar, the
// !3dlat!4dlng form inside place URLs, and the ?q= / ?ll= / ?destination=
// query params from "share" and "directions" links.
function coordsFromUrl(url) {
  const patterns = [
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|ll|query|destination|center|daddr)=(-?\d+(?:\.\d+)?)(?:,|%2C)(-?\d+(?:\.\d+)?)/i,
    /\/(-?\d+\.\d+),(-?\d+\.\d+)/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) {
      const lat = Number(m[1])
      const lng = Number(m[2])
      if (Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
        return { lat, lng }
      }
    }
  }
  return null
}

// Short links (maps.app.goo.gl / goo.gl/maps) carry no coordinates - ask
// Google where they point and parse the expanded URL instead.
async function expandShortLink(url) {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(6000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    return res.url && res.url !== url ? res.url : null
  } catch (err) {
    console.warn('[locations] could not expand short link', err.message)
    return null
  }
}

async function parseLocation(body) {
  const b = body || {}
  const city = String(b.city ?? '').trim()
  if (!city) throw new Error('City is required')

  const kind = b.kind === 'sales' ? 'sales' : 'service'

  const mapUrl = String(b.mapUrl ?? '').trim()
  if (mapUrl && !/^https?:\/\//i.test(mapUrl)) {
    throw new Error('The map link must start with http:// or https://')
  }

  let lat = null
  let lng = null
  if (mapUrl) {
    let coords = coordsFromUrl(mapUrl)
    if (!coords && /(goo\.gl|maps\.app\.goo\.gl)/i.test(mapUrl)) {
      const expanded = await expandShortLink(mapUrl)
      if (expanded) coords = coordsFromUrl(expanded)
    }
    if (coords) {
      lat = coords.lat
      lng = coords.lng
    }
  }

  return {
    mapUrl,
    kind,
    city,
    label: String(b.label ?? '').trim() || (kind === 'sales' ? 'Sales' : 'Service'),
    contact: String(b.contact ?? '').trim(),
    phone: String(b.phone ?? '').trim(),
    lat,
    lng,
    labelOffset: LABEL_OFFSETS.includes(b.labelOffset) ? b.labelOffset : 'down',
    // A pin needs coordinates, so an entry without them is never on the map.
    showOnMap: (b.showOnMap === true || b.showOnMap === 'true') && lat !== null && lng !== null,
  }
}

app.get('/api/locations', async (_req, res) => {
  try {
    const locations = await locationsCol
      .find({}, { projection: { _id: 0 } })
      .sort({ order: 1, city: 1 })
      .toArray()
    res.json({ locations })
  } catch (err) {
    console.error('[locations] read failed', err)
    res.status(500).json({ error: 'Could not load locations' })
  }
})

app.post('/api/admin/locations', requireAuth, async (req, res) => {
  try {
    let parsed
    try {
      parsed = await parseLocation(req.body)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
    const last = await locationsCol.find({}, { projection: { order: 1 } }).sort({ order: -1 }).limit(1).toArray()
    const location = {
      id: crypto.randomUUID(),
      ...parsed,
      order: Number.isFinite(last[0]?.order) ? last[0].order + 1 : 0,
      addedAt: new Date().toISOString(),
    }
    await locationsCol.insertOne({ ...location })
    res.json({ location })
  } catch (err) {
    console.error('[admin/locations POST] failed', err)
    res.status(500).json({ error: 'Could not save location' })
  }
})

app.put('/api/admin/locations/:id', requireAuth, async (req, res) => {
  try {
    let parsed
    try {
      parsed = await parseLocation(req.body)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
    const id = req.params.id
    const existing = await locationsCol.findOne({ id }, { projection: { _id: 0 } })
    if (!existing) return res.status(404).json({ error: 'Location not found' })

    const location = {
      ...existing,
      ...parsed,
      id,
      updatedAt: new Date().toISOString(),
    }
    await locationsCol.replaceOne({ id }, { ...location })
    res.json({ location })
  } catch (err) {
    console.error('[admin/locations PUT] failed', err)
    res.status(500).json({ error: 'Could not update location' })
  }
})

app.delete('/api/admin/locations/:id', requireAuth, async (req, res) => {
  try {
    const result = await locationsCol.deleteOne({ id: req.params.id })
    if (!result.deletedCount) return res.status(404).json({ error: 'Location not found' })
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/locations DELETE] failed', err)
    res.status(500).json({ error: 'Could not delete location' })
  }
})

// Re-order the whole list: { ids: [...] } in the desired display order.
app.put('/api/admin/locations-order', requireAuth, async (req, res) => {
  try {
    const { ids } = req.body || {}
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids[] is required' })
    const ops = ids
      .filter((id) => typeof id === 'string' && id.trim())
      .map((id, i) => ({ updateOne: { filter: { id }, update: { $set: { order: i } } } }))
    if (ops.length) await locationsCol.bulkWrite(ops)
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/locations-order PUT] failed', err)
    res.status(500).json({ error: 'Could not save order' })
  }
})

/* ─────────── People (board + management) ───────────
 * Drives the Leadership page. `kind` is 'board' or 'management'.
 * `photo` is a Cloudinary URL once an admin uploads one; until then it
 * is null and the frontend uses the portrait bundled for that id.
 */

function parsePerson(body) {
  const b = body || {}
  const name = String(b.name ?? '').trim()
  if (!name) throw new Error('Name is required')
  return {
    kind: b.kind === 'management' ? 'management' : 'board',
    name,
    role: String(b.role ?? '').trim(),
  }
}

app.get('/api/people', async (_req, res) => {
  try {
    const people = await peopleCol
      .find({}, { projection: { _id: 0 } })
      .sort({ order: 1, name: 1 })
      .toArray()
    res.json({ people })
  } catch (err) {
    console.error('[people] read failed', err)
    res.status(500).json({ error: 'Could not load the team' })
  }
})

app.post(
  '/api/admin/people',
  requireAuth,
  upload.single('photo'),
  async (req, res) => {
    try {
      let parsed
      try {
        parsed = parsePerson(req.body)
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }
      const uploaded = req.file
        ? await timed('POST people cloudinary.upload', () =>
            uploadBuffer(req.file.buffer, { resourceType: 'image' }),
          )
        : null
      const last = await peopleCol
        .find({}, { projection: { order: 1 } })
        .sort({ order: -1 })
        .limit(1)
        .toArray()
      const person = {
        id: crypto.randomUUID(),
        ...parsed,
        photo: uploaded?.secure_url || null,
        order: Number.isFinite(last[0]?.order) ? last[0].order + 1 : 0,
        addedAt: new Date().toISOString(),
      }
      await peopleCol.insertOne({ ...person })
      res.json({ person })
    } catch (err) {
      console.error('[admin/people POST] failed', err)
      res.status(500).json({ error: 'Could not save' })
    }
  },
)

app.put(
  '/api/admin/people/:id',
  requireAuth,
  upload.single('photo'),
  async (req, res) => {
    try {
      let parsed
      try {
        parsed = parsePerson(req.body)
      } catch (err) {
        return res.status(400).json({ error: err.message })
      }
      const id = req.params.id
      const existing = await peopleCol.findOne({ id }, { projection: { _id: 0 } })
      if (!existing) return res.status(404).json({ error: 'Person not found' })

      const uploaded = req.file
        ? await timed('PUT people cloudinary.upload', () =>
            uploadBuffer(req.file.buffer, { resourceType: 'image' }),
          )
        : null

      const person = {
        ...existing,
        ...parsed,
        id,
        // A new upload replaces the old one; otherwise keep what's there.
        photo: uploaded?.secure_url || existing.photo || null,
        updatedAt: new Date().toISOString(),
      }
      await peopleCol.replaceOne({ id }, { ...person })
      res.json({ person })
    } catch (err) {
      console.error('[admin/people PUT] failed', err)
      res.status(500).json({ error: 'Could not update' })
    }
  },
)

app.delete('/api/admin/people/:id', requireAuth, async (req, res) => {
  try {
    const result = await peopleCol.deleteOne({ id: req.params.id })
    if (!result.deletedCount) return res.status(404).json({ error: 'Person not found' })
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/people DELETE] failed', err)
    res.status(500).json({ error: 'Could not delete' })
  }
})

app.put('/api/admin/people-order', requireAuth, async (req, res) => {
  try {
    const { ids } = req.body || {}
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids[] is required' })
    const ops = ids
      .filter((id) => typeof id === 'string' && id.trim())
      .map((id, i) => ({ updateOne: { filter: { id }, update: { $set: { order: i } } } }))
    if (ops.length) await peopleCol.bulkWrite(ops)
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/people-order PUT] failed', err)
    res.status(500).json({ error: 'Could not save order' })
  }
})

/* ─────────── Blog posts ───────────
 * Draft/publish workflow: only published posts are served publicly.
 * `slug` is derived from the title and is what the public URL uses.
 */

function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function parsePost(body) {
  const b = body || {}
  const title = String(b.title ?? '').trim()
  if (!title) throw new Error('Title is required')
  const bodyText = String(b.body ?? '').trim()
  if (!bodyText) throw new Error('The post needs some body text')

  const slug = slugify(b.slug || title)
  if (!slug) throw new Error('Could not build a URL from that title. Add some letters or numbers')

  const tags = String(b.tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const published = b.published === true || b.published === 'true'

  return {
    slug,
    title,
    excerpt: String(b.excerpt ?? '').trim(),
    body: bodyText,
    author: String(b.author ?? '').trim(),
    tags,
    published,
  }
}

// Public list - published only, newest first.
app.get('/api/posts', async (_req, res) => {
  try {
    const posts = await postsCol
      .find({ published: true }, { projection: { _id: 0 } })
      .sort({ publishedAt: -1, addedAt: -1 })
      .toArray()
    res.json({ posts })
  } catch (err) {
    console.error('[posts] read failed', err)
    res.status(500).json({ error: 'Could not load posts' })
  }
})

app.get('/api/posts/:slug', async (req, res) => {
  try {
    const post = await postsCol.findOne(
      { slug: req.params.slug, published: true },
      { projection: { _id: 0 } },
    )
    if (!post) return res.status(404).json({ error: 'Post not found' })
    res.json({ post })
  } catch (err) {
    console.error('[posts] read one failed', err)
    res.status(500).json({ error: 'Could not load the post' })
  }
})

// Admin list - includes drafts.
app.get('/api/admin/posts', requireAuth, async (_req, res) => {
  try {
    const posts = await postsCol
      .find({}, { projection: { _id: 0 } })
      .sort({ addedAt: -1 })
      .toArray()
    res.json({ posts })
  } catch (err) {
    console.error('[admin/posts] read failed', err)
    res.status(500).json({ error: 'Could not load posts' })
  }
})

app.post('/api/admin/posts', requireAuth, upload.single('cover'), async (req, res) => {
  try {
    let parsed
    try {
      parsed = parsePost(req.body)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
    const clash = await postsCol.findOne({ slug: parsed.slug }, { projection: { _id: 1 } })
    if (clash) {
      return res.status(409).json({ error: `A post already lives at /blog/${parsed.slug}` })
    }
    const uploaded = req.file
      ? await timed('POST posts cloudinary.upload', () =>
          uploadBuffer(req.file.buffer, { resourceType: 'image' }),
        )
      : null
    const now = new Date().toISOString()
    const post = {
      id: crypto.randomUUID(),
      ...parsed,
      cover: uploaded?.secure_url || null,
      addedAt: now,
      publishedAt: parsed.published ? now : null,
    }
    await postsCol.insertOne({ ...post })
    res.json({ post })
  } catch (err) {
    console.error('[admin/posts POST] failed', err)
    res.status(500).json({ error: 'Could not save the post' })
  }
})

app.put('/api/admin/posts/:id', requireAuth, upload.single('cover'), async (req, res) => {
  try {
    let parsed
    try {
      parsed = parsePost(req.body)
    } catch (err) {
      return res.status(400).json({ error: err.message })
    }
    const id = req.params.id
    const existing = await postsCol.findOne({ id }, { projection: { _id: 0 } })
    if (!existing) return res.status(404).json({ error: 'Post not found' })

    if (parsed.slug !== existing.slug) {
      const clash = await postsCol.findOne({ slug: parsed.slug }, { projection: { _id: 1 } })
      if (clash) {
        return res.status(409).json({ error: `A post already lives at /blog/${parsed.slug}` })
      }
    }

    const uploaded = req.file
      ? await timed('PUT posts cloudinary.upload', () =>
          uploadBuffer(req.file.buffer, { resourceType: 'image' }),
        )
      : null

    const post = {
      ...existing,
      ...parsed,
      id,
      cover: uploaded?.secure_url || existing.cover || null,
      // First time it goes live is the publish date; later edits don't reset it.
      publishedAt: parsed.published
        ? existing.publishedAt || new Date().toISOString()
        : null,
      updatedAt: new Date().toISOString(),
    }
    await postsCol.replaceOne({ id }, { ...post })
    res.json({ post })
  } catch (err) {
    console.error('[admin/posts PUT] failed', err)
    res.status(500).json({ error: 'Could not update the post' })
  }
})

app.delete('/api/admin/posts/:id', requireAuth, async (req, res) => {
  try {
    const result = await postsCol.deleteOne({ id: req.params.id })
    if (!result.deletedCount) return res.status(404).json({ error: 'Post not found' })
    res.json({ ok: true })
  } catch (err) {
    console.error('[admin/posts DELETE] failed', err)
    res.status(500).json({ error: 'Could not delete the post' })
  }
})

/* Mail handling lives in the frontend folder (api/send-mail.js as a
 * Vercel serverless function). Local dev uses a Vite middleware so
 * the contact form works without running this server. */

app.listen(PORT, () => {
  console.log(`[server] http://localhost:${PORT}`)
})
