// One-off repair: brochures uploaded before the `.pdf` public_id fix are
// stored as extensionless Cloudinary `raw` assets, so they are delivered as
// `application/octet-stream` with `Content-Disposition: attachment` and the
// browser saves a nameless blob instead of opening the PDF viewer.
//
// Cloudinary fixes an asset's delivery type at upload time, so renaming is not
// enough — this re-uploads the same bytes under a `.pdf` public_id, points the
// product record at the new URL, and deletes the old asset.
//
// Safe to re-run: brochures already served as application/pdf are skipped.
// Pass --dry to preview without changing anything.
//
//   node scripts/fix-brochure-extensions.mjs [--dry]

import dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: '.env.local', override: false })

import dns from 'node:dns'
import crypto from 'node:crypto'
import { Readable } from 'node:stream'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

// Same workaround index.js uses: Windows' system resolver often can't do the
// Atlas SRV lookup during local dev.
dns.setServers(['8.8.8.8', '1.1.1.1'])

const DRY = process.argv.includes('--dry')
const CLOUDINARY_FOLDER = 'tata_hitachi'

cloudinary.config(true)
cloudinary.config({ secure: true })

const mongo = new MongoClient(process.env.MONGODB_URI)
await mongo.connect()
const productsCol = mongo.db(process.env.MONGODB_DB || 'tata_hitachi').collection('products')

// https://res.cloudinary.com/<cloud>/raw/upload/v<version>/<public_id>
function publicIdFromRawUrl(url) {
  const m = /\/raw\/upload\/(?:v\d+\/)?(.+)$/.exec(url || '')
  return m ? m[1] : null
}

function uploadRawPdf(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: CLOUDINARY_FOLDER, resource_type: 'raw', public_id: publicId },
      (err, result) => (err ? reject(err) : resolve(result)),
    )
    Readable.from(buffer).pipe(stream)
  })
}

const products = await productsCol
  .find({ pdf: { $type: 'string', $ne: '' } }, { projection: { _id: 0, code: 1, pdf: 1 } })
  .toArray()

let fixed = 0
for (const p of products) {
  if (!p.pdf.includes('/raw/upload/')) {
    console.log(`skip  ${p.code} — not a Cloudinary raw URL`)
    continue
  }

  const head = await fetch(p.pdf, { method: 'HEAD' })
  if (head.headers.get('content-type') === 'application/pdf') {
    console.log(`ok    ${p.code} — already served as application/pdf`)
    continue
  }

  const oldPublicId = publicIdFromRawUrl(p.pdf)
  const newPublicId = `${p.code.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brochure-${crypto
    .randomBytes(4)
    .toString('hex')}.pdf`
  console.log(`${DRY ? 'would re-upload' : 're-upload'} ${p.code}: ${oldPublicId} -> ${newPublicId}`)
  if (DRY) continue

  const buffer = Buffer.from(await (await fetch(p.pdf)).arrayBuffer())
  const uploaded = await uploadRawPdf(buffer, newPublicId)
  await productsCol.updateOne({ code: p.code }, { $set: { pdf: uploaded.secure_url } })
  if (oldPublicId) {
    await cloudinary.uploader.destroy(oldPublicId, { resource_type: 'raw' })
  }
  console.log(`      ${uploaded.secure_url}`)
  fixed++
}

console.log(`\n${DRY ? 'dry run' : 'done'} — ${fixed} brochure(s) updated`)
await mongo.close()
