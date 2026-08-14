import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import useProducts from '../data/useProducts'
import { productSlug, productPath } from '../data/slug'
import Seo from '../seo/Seo'
import { productSchema, breadcrumbSchema } from '../seo/structuredData'
import NotFound from './NotFound'

/* Per-machine narrative. The catalogue data carries specs and a one-line
 * intro; these sentences give each page enough substance to stand on its own
 * in search results instead of reading as a spec dump. Keyed by model code so
 * an admin-added machine simply falls back to the generic copy. */
const NOTES = {
  'ZAXIS-650H':
    'The ZAXIS 650 H is the largest machine we place in Nepal, and it goes almost exclusively to mining contracts, major hydropower cut-and-fill, and quarry operators running continuous duty cycles. At 58.3 tonnes with 400 HP on tap, it is specified where a 30-tonne class machine would simply take too long. Bring us the cycle times you need and we will tell you honestly whether this is the right machine or whether two smaller ones will move more material per rupee.',
  'ZAXIS-370LCH':
    'Built for the pit. The 370 LCH Ultra carries a reinforced structure and duty-cycle hydraulics rated for continuous extraction, which is what separates it from a general-purpose machine of similar weight. Most of the units we have delivered are working limestone and aggregate in the Terai, where the combination of abrasive material and long shifts kills undercarriages on machines not built for it.',
  'ZAXIS-220LC':
    'The most-deployed Tata Hitachi machine on infrastructure contracts across Nepal, and the one we stock the deepest parts inventory for. The long-crawler undercarriage is the reason — it holds position on the uneven, freshly-cut ground that road and hydropower work constantly produces. If you are buying your first machine in the 20-tonne class, this is the safe answer.',
  'ZAXIS-140H':
    'The versatile mid-class machine. Narrow enough to work a road alignment without closing both lanes, capable enough to handle site development and utility trenching without a second machine on hire. Popular with contractors who need one excavator to cover a broad range of jobs.',
  'EX-350-LCPRIME':
    'A heavy-class machine for major earthworks where reach matters as much as breakout force. The LC Prime undercarriage gives it stability on rough ground without shortening the working envelope, which is why it turns up on hydropower access roads and large-fill contracts.',
  'EX-215':
    'The 22-tonne infrastructure workhorse. Balanced reach, sensible fuel burn, and an undercarriage rated for the daily punishment of road and site work. This is the machine contractors buy when the job is not exotic — it just has to run, every day, for years.',
  'EX-210-LCPRIME':
    'The Prime series answer in the 20-tonne class. Reinforced boom and stick, sharper hydraulic response than the standard series, and the LC Prime undercarriage. Specified where a contractor is running long hours and wants the structure to outlast the finance term.',
  'EX-130':
    'A 13-tonne machine that earns its place through reliability rather than headline numbers. Fuel-efficient, simple to maintain, and well matched to the everyday earthworks, drainage and utility work that makes up the bulk of contracts in Nepal.',
  'EX-70-SUPER':
    'The compact specialist. Narrow enough for urban trenching and confined municipal sites, with enough breakout to outwork most machines in its weight class. Frequently the second machine on a fleet, handling the work a 20-tonne excavator cannot reach.',
  'SHINRAI-POWER':
    'Built narrow deliberately, for Nepali urban sites where a full-size backhoe cannot turn. The Shinrai Power is the workhorse for municipal contracts, drainage schemes and utility infrastructure — loader on the front, backhoe on the rear, and the manoeuvrability to use both on a live street.',
}

const GENERIC_NOTE =
  'Supplied, commissioned and serviced by Dugar Earthmovers, the authorised Tata Hitachi distributor for Nepal. Every machine handover includes structured operator training, and our factory-trained technicians can be on a project site within 24 hours from any of our ten branches.'

function SpecRow({ label, value }) {
  return (
    <div className="border-b border-r border-gray-200 p-4 md:p-5">
      <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-gray-500">{label}</p>
      <p className="mt-1.5 font-mono text-base font-bold tabular-nums tracking-tight text-black md:text-lg">
        {value}
      </p>
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const { products, ready } = useProducts()

  const product = useMemo(
    () => products.find((p) => productSlug(p) === slug),
    [products, slug],
  )

  const related = useMemo(
    () =>
      products
        .filter((p) => p !== product && p.cat === product?.cat)
        .slice(0, 3),
    [products, product],
  )

  if (!product) {
    /* The catalogue may still be in flight — hold the frame rather than
     * flashing a 404 at a URL that is about to resolve. */
    if (!ready) return <div className="min-h-[60vh]" aria-busy="true" />
    return <NotFound />
  }

  const path = productPath(product)
  const title = `Tata Hitachi ${product.name} — Specs & Price in Nepal`
  const description = `${product.intro} Specifications, brochure and pricing from Dugar Earthmovers, Nepal's authorised Tata Hitachi distributor.`

  return (
    <main className="bg-white">
      <Seo
        title={title.length > 62 ? `Tata Hitachi ${product.name} — Nepal Specs & Price` : title}
        description={description.slice(0, 158)}
        path={path}
        image={product.image}
        type="product"
        jsonLd={[
          productSchema(product, path),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Machines', path: '/products' },
            { name: product.name, path },
          ]),
        ]}
      />

      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-12 pb-16 md:pt-16 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 hidden h-[520px] w-[520px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.14), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums tracking-tight text-gray-500">
              <li>
                <Link to="/" className="transition-colors hover:text-[#f37022]">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link to="/products" className="transition-colors hover:text-[#f37022]">
                  Machines
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-black" aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                {product.series}
              </p>
              <h1 className="mt-4 text-5xl font-black uppercase leading-[0.92] tracking-[-0.02em] text-black md:text-6xl lg:text-7xl">
                {product.name}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-700 md:text-lg">
                {product.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-3 bg-black px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#f37022]"
                >
                  Request a quote
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <a
                  href="tel:+9779802591430"
                  className="inline-flex items-center gap-3 border border-gray-800 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-black transition-colors hover:border-[#f37022] hover:text-[#f37022]"
                >
                  Call sales
                </a>
              </div>
            </div>

            {product.image && (
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={product.image}
                  alt={`Tata Hitachi ${product.name} ${product.series?.split('·')[0]?.trim() || 'excavator'} available in Nepal`}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-6 right-6 max-w-[260px] border border-white/20 bg-black/80 p-4 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                    Model code
                  </p>
                  <p className="mt-2 font-mono text-base font-bold tabular-nums tracking-tight text-white">
                    {product.code}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Specifications ───────────────────────────────────── */}
      {product.specs?.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-5xl">
              Specifications.
            </h2>
            <div className="mt-8 border-t border-l border-gray-200">
              <div className="grid grid-cols-2 lg:grid-cols-3">
                {product.specs.map((s) => (
                  <SpecRow key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            </div>
            <p className="mt-4 font-mono text-xs tabular-nums tracking-tight text-gray-500">
              Figures are manufacturer specifications and are a guide, not a contract.
              Confirm against the brochure for your configuration.
            </p>
          </div>
        </section>
      )}

      {/* ─── Where it works ───────────────────────────────────── */}
      <section className="bg-[#f7f5f0] py-16 md:py-20">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-5xl">
                Where it
                <br />
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  earns its keep.
                </span>
              </h2>
              {product.applications?.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {product.applications.map((a) => (
                    <span
                      key={a}
                      className="border border-gray-300 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-6 text-base leading-relaxed text-gray-700 md:text-lg">
              <p>{NOTES[product.code] || GENERIC_NOTE}</p>
              <p>
                Every {product.name} we deliver is commissioned by our own
                technicians and handed over with structured operator training
                covering controls, daily inspection routines and safe operating
                procedure. Genuine parts for this machine are stocked at our
                central warehouse with regional stocking in the major work
                zones — most orders ship the same day.
              </p>
              <p>
                Service is run from ten branches: Kathmandu, Biratnagar,
                Pokhara, Jeetpur, Bardibaas, Nepalgunj, Dhangadi, Surkhet, Dang
                and Butwal. A factory-trained technician can be on your site
                typically within 24 to 48 hours anywhere in Nepal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related machines ─────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-white py-16 md:py-20">
          <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
            <div className="flex items-baseline justify-between gap-6 border-b border-gray-300 pb-6">
              <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-5xl">
                Also in this class.
              </h2>
              <Link
                to="/products"
                className="hidden font-mono text-xs tabular-nums tracking-tight text-[#f37022] transition-colors hover:text-black sm:block"
              >
                / All machines
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.code}
                  to={productPath(p)}
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-black">
                    {p.image && (
                      <img
                        src={p.image}
                        alt={`Tata Hitachi ${p.name}`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                    {p.series}
                  </p>
                  <h3 className="mt-2 text-2xl font-black uppercase leading-[0.95] tracking-tight text-black transition-colors group-hover:text-[#f37022]">
                    {p.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
