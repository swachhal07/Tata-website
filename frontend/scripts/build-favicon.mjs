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
