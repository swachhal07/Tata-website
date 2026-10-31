import sharp from 'sharp'

// step 1: derive a transparent-bg, white-ink version of the original wordmark
const original = 'src/assets/Untitled design (7).png'
const whiteOut = 'src/assets/tata-hitachi-white.png'

const o = await sharp(original).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const W = o.info.width, H = o.info.height, C = o.info.channels
const px = Buffer.alloc(o.data.length)
for (let i = 0; i < o.data.length; i += C) {
  const lum = 0.299 * o.data[i] + 0.587 * o.data[i + 1] + 0.114 * o.data[i + 2]
  let ink
  if (lum <= 96) ink = 255
  else if (lum >= 224) ink = 0
  else ink = Math.round(((224 - lum) / (224 - 96)) * 255)
  px[i] = 255
  px[i + 1] = 255
  px[i + 2] = 255
  px[i + 3] = Math.round(ink * (o.data[i + 3] / 255))
}

// step 2: find tight bounds of the (now white) ink
const rowHas = new Array(H).fill(false)
const colHas = new Array(W).fill(false)
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (px[(y * W + x) * C + 3] > 64) {
      rowHas[y] = true
      colHas[x] = true
    }
  }
}
const top = rowHas.indexOf(true)
const bottom = rowHas.lastIndexOf(true)
const left = colHas.indexOf(true)
const right = colHas.lastIndexOf(true)

// biggest horizontal gap inside the bounds = space between TATA and HITACHI
let gs = -1, best = { start: 0, end: 0, len: 0 }
for (let x = left; x <= right; x++) {
  if (!colHas[x]) {
    if (gs === -1) gs = x
  } else if (gs !== -1) {
    const len = x - gs
    if (len > best.len) best = { start: gs, end: x, len }
    gs = -1
  }
}

const wordH = bottom - top + 1
const w1L = left, w1R = best.start - 1
const w2L = best.end, w2R = right

// dump the recoloured buffer so we can extract from it
const tmpWhite = await sharp(px, { raw: { width: W, height: H, channels: C } }).png().toBuffer()
const word1 = await sharp(tmpWhite).extract({ left: w1L, top, width: w1R - w1L + 1, height: wordH }).toBuffer()
const word2 = await sharp(tmpWhite).extract({ left: w2L, top, width: w2R - w2L + 1, height: wordH }).toBuffer()

// step 3: stack the two words on a square canvas, centered
const CANVAS = 512
const PAD = 32
const GAP = 24
const maxW = CANVAS - PAD * 2
const maxLineH = Math.floor((CANVAS - PAD * 2 - GAP) / 2)

const r1 = await sharp(word1).resize({ height: maxLineH, width: maxW, fit: 'inside' }).toBuffer()
const r2 = await sharp(word2).resize({ height: maxLineH, width: maxW, fit: 'inside' }).toBuffer()
const m1 = await sharp(r1).metadata()
const m2 = await sharp(r2).metadata()

const stackH = m1.height + GAP + m2.height
const topOffset = Math.round((CANVAS - stackH) / 2)

await sharp({
  create: { width: CANVAS, height: CANVAS, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
})
  .composite([
    { input: r1, left: Math.round((CANVAS - m1.width) / 2), top: topOffset },
    { input: r2, left: Math.round((CANVAS - m2.width) / 2), top: topOffset + m1.height + GAP },
  ])
  .png()
  .toFile(whiteOut)

console.log(`wrote ${whiteOut} (${CANVAS}x${CANVAS}); stack ${m1.width}x${m1.height} + ${m2.width}x${m2.height}, topOffset=${topOffset}`)

// step 4: the favicon set, written to public/ under fixed names.
//
// The white wordmark on its own is invisible on light backgrounds, and that
// is exactly what Google shows it on: search results crop the favicon to a
// circle on white. So the wordmark sits on a solid brand-orange square, scaled
// to 78% of the width: the stacked wordmark is wide and short, so its corners
// still fall inside the circle crop (about 0.42 of the radius 0.5). Fixed paths (not
// Vite-hashed ones) because Google caches favicons by URL and expects
// /favicon.ico to exist.
const BRAND = { r: 0xf3, g: 0x70, b: 0x22, alpha: 1 }
const MARK_SCALE = 0.78

async function icon(size) {
  const mark = await sharp(whiteOut)
    .resize(Math.round(size * MARK_SCALE), Math.round(size * MARK_SCALE), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer()
  const m = await sharp(mark).metadata()
  return sharp({ create: { width: size, height: size, channels: 4, background: BRAND } })
    .composite([{ input: mark, left: Math.round((size - m.width) / 2), top: Math.round((size - m.height) / 2) }])
    .png()
    .toBuffer()
}

/* .ico with PNG-compressed entries: 6-byte header, a 16-byte directory entry
 * per image, then the PNG bytes. Every current browser and Google read it. */
function ico(pngs) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = 6 + 16 * pngs.length
  const dir = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16)
    e.writeUInt8(size >= 256 ? 0 : size, 0)
    e.writeUInt8(size >= 256 ? 0 : size, 1)
    e.writeUInt16LE(1, 4) // colour planes
    e.writeUInt16LE(32, 6) // bits per pixel
    e.writeUInt32LE(data.length, 8)
    e.writeUInt32LE(offset, 12)
    offset += data.length
    return e
  })
  return Buffer.concat([header, ...dir, ...pngs.map((p) => p.data)])
}

const { writeFile } = await import('node:fs/promises')
const icoSizes = [16, 32, 48]
await writeFile('public/favicon.ico', ico(await Promise.all(icoSizes.map(async (size) => ({ size, data: await icon(size) })))))
for (const [file, size] of [
  ['public/favicon-96x96.png', 96],
  ['public/apple-touch-icon.png', 180],
  ['public/icon-192.png', 192],
  ['public/icon-512.png', 512],
]) {
  await writeFile(file, await icon(size))
}
console.log('wrote public/favicon.ico (16/32/48), favicon-96x96.png, apple-touch-icon.png, icon-192.png, icon-512.png')
