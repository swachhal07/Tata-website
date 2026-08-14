/* One-off asset optimiser.
 *
 * The repo shipped camera-original photographs — a 29 MB 5760x3840 JPEG was
 * being served into a 935x816 box — which put ~47 MB of imagery on the
 * homepage. This rewrites every raster asset in place at a sane resolution
 * and quality, keeping the same filename and extension so no import in the
 * app has to change. Originals stay recoverable from git history.
 *
 * It also derives two assets the app now references:
 *   - src/assets/hero-poster.jpg  (video poster, avoids a blank first frame)
 *   - public/og-default.jpg       (1200x630 social preview)
 *
 * Run with: npm run optimize:assets
 * Safe to re-run — already-small files are skipped.
 */
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const execFileAsync = promisify(execFile)
const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '..')

const RASTER = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const MAX_WIDTH = 1920
const QUALITY = 82
/* Below this, re-encoding costs more in quality than it saves in bytes. */
const SKIP_UNDER_BYTES = 150 * 1024

const SCAN_DIRS = [path.join(root, 'src', 'assets'), path.join(root, 'public', 'covers')]

const HERO_VIDEO = path.join(root, 'src', 'assets', 'hero-loop.mp4')
const HERO_POSTER = path.join(root, 'src', 'assets', 'hero-poster.jpg')
const OG_IMAGE = path.join(root, 'public', 'og-default.jpg')
/* Source frame for the OG card — a wide machine shot that crops well to 1.91:1. */
const OG_SOURCE = path.join(root, 'src', 'assets', 'zaxis 370.png')

const kb = (n) => `${(n / 1024).toFixed(0)} KB`
const mb = (n) => `${(n / 1024 / 1024).toFixed(1)} MB`

async function walk(dir) {
  let entries
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return []
  }
  const out = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

async function optimizeImage(file) {
  const ext = path.extname(file).toLowerCase()
  if (!RASTER.has(ext)) return null

  const before = (await fs.stat(file)).size
  if (before < SKIP_UNDER_BYTES) return null

  /* Read into memory first: sharp holds the input path open, and Windows
   * refuses the write-back to the same filename while it does. */
  const input = await fs.readFile(file)
  const image = sharp(input, { failOn: 'none' })
  const meta = await image.metadata()
  const needsResize = (meta.width || 0) > MAX_WIDTH

  let pipeline = image.rotate()
  if (needsResize) pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true })

  if (ext === '.png') {
    /* Every .png in this project is a photograph, not line art, so palette
     * quantisation is the right trade. */
    pipeline = pipeline.png({ quality: QUALITY, compressionLevel: 9, palette: true })
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: QUALITY })
  } else {
    pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
  }

  const buffer = await pipeline.toBuffer()
  if (buffer.length >= before) return null

  /* A couple of the source photos carry the Windows read-only attribute,
   * which makes the write-back fail with EPERM. Clear it first. */
  await fs.chmod(file, 0o666).catch(() => {})
  await fs.writeFile(file, buffer)
  return { file, before, after: buffer.length }
}

async function makeHeroPoster() {
  try {
    await fs.access(HERO_VIDEO)
  } catch {
    console.log('  hero.mp4 not found — skipping poster')
    return
  }
  const tmp = path.join(root, 'scripts', '.hero-frame.png')
  /* Six seconds in — the opening second of the cut is near-black and makes a
   * useless poster. */
  await execFileAsync('ffmpeg', ['-y', '-ss', '00:00:06', '-i', HERO_VIDEO, '-frames:v', '1', tmp])
  await sharp(tmp)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true, progressive: true })
    .toFile(HERO_POSTER)
  await fs.unlink(tmp)
  console.log(`  hero-poster.jpg  ${kb((await fs.stat(HERO_POSTER)).size)}`)
}

async function makeOgImage() {
  await fs.mkdir(path.dirname(OG_IMAGE), { recursive: true })
  await sharp(OG_SOURCE)
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(OG_IMAGE)
  console.log(`  og-default.jpg   ${kb((await fs.stat(OG_IMAGE)).size)}`)
}

async function main() {
  console.log('Optimising raster assets...\n')

  const files = (await Promise.all(SCAN_DIRS.map(walk))).flat()
  let totalBefore = 0
  let totalAfter = 0
  const changed = []

  for (const file of files) {
    const result = await optimizeImage(file)
    if (!result) continue
    totalBefore += result.before
    totalAfter += result.after
    changed.push(result)
  }

  changed
    .sort((a, b) => b.before - a.before)
    .forEach((r) => {
      const pct = (100 - (r.after / r.before) * 100).toFixed(0)
      console.log(`  ${path.basename(r.file).padEnd(56)} ${mb(r.before).padStart(9)} -> ${mb(r.after).padStart(9)}  (-${pct}%)`)
    })

  console.log(`\n  ${changed.length} files rewritten: ${mb(totalBefore)} -> ${mb(totalAfter)}\n`)

  console.log('Deriving generated assets...')
  await makeHeroPoster()
  await makeOgImage()
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
