import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useProducts from '../data/useProducts'
import { productSlug, productPath } from '../data/slug'
import { noteFor } from '../data/productNotes'
import Seo from '../seo/Seo'
import { productSchema, breadcrumbSchema } from '../seo/structuredData'
import NotFound from './NotFound'

/* Support commitments shown beside the deployment prose. These restate figures
 * already given in the copy below — keep the two in step if either changes. */
const SUPPORT = [
  { label: 'Branches', value: '10' },
  { label: 'On-site response', value: '24–48 hr' },
  { label: 'Parts dispatch', value: 'Same day' },
  { label: 'Operator training', value: 'Included' },
]

/* Hero entry choreography. Everything arrives on a heavy spring rather than
 * appearing statically, staggered down the reading order. Transform/opacity
 * only, so it stays on the compositor. */
const REVEAL = (delay) => ({
  animation: `hero-rise 0.95s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
})

/* Below-the-fold reveal. The hero can animate on load, but anything further
 * down has to wait until it is actually on screen — an IntersectionObserver
 * fires once and disconnects, so there is no scroll listener reflowing the
 * page. Falls open immediately where the API is missing. */
function Reveal({ delay = 0, className = '', children }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || shown) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [shown])

  return (
    <div
      ref={ref}
      className={className}
      style={shown ? REVEAL(delay) : { opacity: 0 }}
    >
      {children}
    </div>
  )
}

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
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-10 pb-20 md:pt-14 md:pb-28 lg:pb-32">
        {/* Warm bloom behind the headline, plus a faint survey grid — the grid
         * is a static background-image so it costs nothing to scroll past. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-40 hidden h-[620px] w-[620px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.16), transparent 72%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.045) 1px, transparent 1px)',
            backgroundSize: '96px 96px',
            maskImage:
              'radial-gradient(120% 80% at 50% 0%, #000 25%, transparent 78%)',
            WebkitMaskImage:
              'radial-gradient(120% 80% at 50% 0%, #000 25%, transparent 78%)',
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
          {/* Always resolves to the catalogue rather than history.back(), so it
            * behaves the same for a visitor arriving cold from search. */}
          <div className="mb-10 md:mb-14" style={REVEAL(0)}>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] text-gray-700 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:text-black"
            >
              <span
                aria-hidden
                className="text-sm text-[#f37022] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
              >
                ←
              </span>
              All machines
            </Link>
          </div>

          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
            {/* ── Typographic column ───────────────────────────── */}
            <div>
              <div
                className="inline-flex items-center gap-2.5 border border-black/15 bg-white/70 px-3 py-1.5"
                style={REVEAL(0.06)}
              >
                <span aria-hidden className="relative flex h-1.5 w-1.5">
                  <span
                    className="absolute inset-0 rounded-full bg-[#f37022]"
                    style={{ animation: 'status-pulse 2.6s ease-out infinite' }}
                  />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-[#f37022]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-gray-700">
                  {product.series}
                </span>
              </div>

              {/* One scale for every machine. Long names wrap; `balance` keeps
                * the break even so two lines read as a deliberate stack. */}
              <h1
                className="mt-6 text-[clamp(2.75rem,6vw,5.5rem)] font-black uppercase leading-[0.86] tracking-[-0.035em] text-balance text-black"
                style={REVEAL(0.12)}
              >
                {product.name}
              </h1>

              <div
                className="mt-7 flex max-w-xl gap-5 md:mt-8"
                style={REVEAL(0.18)}
              >
                <span aria-hidden className="mt-1.5 h-14 w-[3px] shrink-0 bg-[#f37022]" />
                <p className="text-base leading-relaxed text-gray-700 md:text-[17px]">
                  {product.intro}
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-3 md:mt-10" style={REVEAL(0.24)}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-4 bg-black py-3 pl-7 pr-3 text-[11px] font-bold uppercase tracking-[0.26em] text-white transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#f37022] active:scale-[0.985]"
                >
                  Request a quote
                  {/* Nested icon cell, flush with the button's inner padding */}
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center bg-white/12 text-sm transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:scale-105"
                  >
                    →
                  </span>
                </Link>
                <a
                  href="tel:+9779802591430"
                  className="group inline-flex items-center gap-4 border border-black/25 py-3 pl-7 pr-3 text-[11px] font-bold uppercase tracking-[0.26em] text-black transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#f37022] hover:text-[#f37022] active:scale-[0.985]"
                >
                  Call sales
                  <span
                    aria-hidden
                    className="flex h-9 w-9 items-center justify-center bg-black/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M6.5 3.5h3l1.5 3.75-2 1.25a10.5 10.5 0 0 0 5.5 5.5l1.25-2 3.75 1.5v3a1.5 1.5 0 0 1-1.65 1.5A15.5 15.5 0 0 1 5 5.15 1.5 1.5 0 0 1 6.5 3.5Z" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>

            {/* ── Framed machine plate ─────────────────────────── */}
            {product.image && (
              <div className="relative" style={REVEAL(0.3)}>
                {/* Outer tray: the image never sits flat on the background */}
                <div className="relative bg-white/55 p-2 ring-1 ring-black/[0.08] md:p-2.5">
                  <div className="group relative aspect-[4/3] overflow-hidden bg-black lg:aspect-[16/11]">
                    <img
                      src={product.image}
                      alt={`Tata Hitachi ${product.name} ${product.series?.split('·')[0]?.trim() || 'excavator'} available in Nepal`}
                      loading="eager"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                    />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                          Model code
                        </p>
                        <p className="mt-1.5 font-mono text-lg font-bold tabular-nums tracking-tight text-white">
                          {product.code}
                        </p>
                      </div>
                      <p className="hidden text-right font-mono text-[10px] leading-relaxed tabular-nums tracking-tight text-white/55 sm:block">
                        Authorised Tata Hitachi
                        <br />
                        distributor · Nepal
                      </p>
                    </div>
                  </div>
                </div>
                {/* Registration ticks — reads as machined hardware, not a card */}
                <span
                  aria-hidden
                  className="absolute -left-px -top-px h-5 w-5 border-l-2 border-t-2 border-[#f37022]"
                />
                <span
                  aria-hidden
                  className="absolute -bottom-px -right-px h-5 w-5 border-b-2 border-r-2 border-[#f37022]"
                />
              </div>
            )}
          </div>

          {/* ── Key figures, lifted out of the spec table ───────── */}
          {product.specs?.length > 0 && (
            <dl
              className="mt-16 grid grid-cols-2 border-t border-black/15 md:mt-20 lg:grid-cols-4"
              style={REVEAL(0.36)}
            >
              {product.specs.slice(0, 4).map((s) => (
                <div
                  key={s.label}
                  className="border-b border-black/10 px-1 py-6 lg:border-b-0 lg:border-r lg:border-black/10 lg:px-0 lg:pr-8 [&:last-child]:lg:border-r-0 lg:[&:not(:first-child)]:pl-8"
                >
                  <dt className="text-[9px] font-bold uppercase tracking-[0.28em] text-gray-500">
                    {s.label}
                  </dt>
                  <dd className="mt-2 font-mono text-2xl font-bold tabular-nums tracking-[-0.02em] text-black md:text-[28px]">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
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
      <section className="border-t border-black/10 bg-[#f7f5f0] py-24 md:py-32">
        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.82fr_1.3fr] lg:gap-24">
            {/* Rail distributes over the full row height — heading flush with
              * the first block, support plate flush with the last. */}
            <Reveal className="flex h-full flex-col">
              <div className="inline-flex items-center gap-2.5 self-start border border-black/15 bg-white/70 px-3 py-1.5">
                <span aria-hidden className="h-1.5 w-1.5 bg-[#f37022]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.26em] text-gray-700">
                  Deployment
                </span>
              </div>

              <h2 className="mt-6 text-4xl font-black uppercase leading-[0.92] tracking-[-0.025em] text-black md:text-5xl">
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
                      className="border border-black/15 bg-white/60 px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[#f37022]/60 hover:text-black"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              )}

              {/* Support commitments, pulled out of the prose so they register
                * at a glance. Every figure is stated in the copy alongside. */}
              <div className="mt-10 bg-white/55 p-2 ring-1 ring-black/[0.08] lg:mt-auto">
                <dl className="divide-y divide-black/[0.07] bg-white/70">
                  {SUPPORT.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-baseline justify-between gap-5 px-6 py-5"
                    >
                      <dt className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">
                        {s.label}
                      </dt>
                      <dd className="font-mono text-lg font-bold tabular-nums tracking-tight text-black md:text-xl">
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>

            {/* Indexed prose. Three different subjects, so they get three
              * numbered registers rather than reading as one grey slab. */}
            <div>
              {[
                { label: 'The machine', body: noteFor(product) },
                {
                  label: 'Handover & parts',
                  body: `Every ${product.name} we deliver is commissioned by our own technicians and handed over with structured operator training covering controls, daily inspection routines and safe operating procedure. Genuine parts for this machine are stocked at our central warehouse with regional stocking in the major work zones — most orders ship the same day.`,
                },
                {
                  label: 'Service network',
                  body: 'Service is run from ten branches: Kathmandu, Biratnagar, Pokhara, Jeetpur, Bardibaas, Nepalgunj, Dhangadi, Surkhet, Dang and Butwal. A factory-trained technician can be on your site typically within 24 to 48 hours anywhere in Nepal.',
                },
              ].map((block, i) => (
                <Reveal
                  key={block.label}
                  delay={0.08 * i}
                  className="grid grid-cols-1 gap-5 border-t border-black/10 py-10 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[7.5rem_1fr] md:gap-10"
                >
                  <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-3">
                    <span className="font-mono text-xs font-bold tabular-nums tracking-tight text-[#f37022]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span aria-hidden className="h-3 w-px bg-black/15 md:hidden" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.24em] text-gray-500">
                      {block.label}
                    </h3>
                  </div>
                  <p className="text-base leading-[1.75] text-gray-700 md:text-[17px]">
                    {block.body}
                  </p>
                </Reveal>
              ))}
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
