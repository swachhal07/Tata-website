import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { categories, products as seedProducts } from '../data/products'

function BrochureGate({ product, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', company: '', location: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const update = (k) => (e) => {
    const v = k === 'phone' ? e.target.value.replace(/[^0-9+\s-]/g, '') : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.location.trim()) return
    setSubmitting(true)
    setError('')

    // Fire-and-forget lead capture — never block the brochure on mail delivery.
    fetch('/api/send-mail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'brochure',
        product: product.name,
        code: product.code,
        ...form,
      }),
    }).catch(() => {})

    if (product.pdf) {
      window.open(product.pdf, '_blank', 'noopener,noreferrer')
    }
    setSubmitting(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg border-t-4 border-[#f37022] bg-white p-8 md:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-2xl leading-none text-gray-500 transition-colors hover:text-black"
        >
          ×
        </button>

        <p className="font-mono text-xs tabular-nums tracking-tight text-[#f37022]">
          / Brochure · {product.code}
        </p>
        <h3 className="mt-2 text-2xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-3xl">
          A quick intro before you download.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          We share the full PDF in seconds — and our sales team gets in touch
          if you'd like a yard visit or pricing.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">
              Full name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={update('name')}
              className="mt-2 block w-full border-0 border-b border-gray-300 bg-transparent pb-2 text-base text-black focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">
              Phone *
            </label>
            <input
              type="tel"
              required
              inputMode="tel"
              pattern="[0-9+\s-]{7,15}"
              title="Digits only — at least 7 numbers"
              value={form.phone}
              onChange={update('phone')}
              className="mt-2 block w-full border-0 border-b border-gray-300 bg-transparent pb-2 text-base text-black focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">
              Company / organisation
            </label>
            <input
              type="text"
              value={form.company}
              onChange={update('company')}
              className="mt-2 block w-full border-0 border-b border-gray-300 bg-transparent pb-2 text-base text-black focus:border-black focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.28em] text-gray-500">
              Project location / district *
            </label>
            <input
              type="text"
              required
              value={form.location}
              onChange={update('location')}
              className="mt-2 block w-full border-0 border-b border-gray-300 bg-transparent pb-2 text-base text-black focus:border-black focus:outline-none"
            />
          </div>

          {error && (
            <p className="border-l-2 border-[#f37022] bg-[#fdecdf] px-3 py-2 text-xs text-[#a4360c]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="group mt-4 inline-flex w-full items-center justify-center gap-3 bg-black px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#f37022] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Sending…' : 'View brochure'}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </button>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
            By submitting you agree to be contacted by MV Dugar Group.
          </p>
        </form>
      </div>
    </div>
  )
}

function ProductSpread({ product, index, flipped, onRequestBrochure }) {
  return (
    <article id={product.code.toLowerCase()} className="border-b border-gray-200 last:border-b-0">
      <div className="mx-auto grid max-w-[1500px] grid-cols-1 gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-28">
        {/* Image side */}
        <div className={`relative ${flipped ? 'lg:order-2' : 'lg:order-1'}`}>
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 lg:aspect-auto lg:h-full lg:min-h-[640px]">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute left-0 top-0 h-1 w-32 bg-[#f37022]" />

            {/* Huge index number */}
            <div
              className="absolute left-6 top-6 font-mono text-xs tabular-nums tracking-tight"
              style={{
                textShadow:
                  '0 2px 12px rgba(0,0,0,0.65), 0 0 2px rgba(0,0,0,0.4)',
              }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
                / Entry
              </p>
              <p className="mt-1 text-7xl font-black leading-none text-white md:text-8xl">
                {String(index + 1).padStart(2, '0')}
              </p>
            </div>

            {/* Bottom-right dataplate */}
            <div className="absolute bottom-6 right-6 max-w-[260px] border border-white/20 bg-black/80 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                Model code
              </p>
              <p className="mt-2 font-mono text-base font-bold tabular-nums tracking-tight text-white">
                {product.code}
              </p>
            </div>
          </div>
        </div>

        {/* Content side */}
        <div className={`flex flex-col justify-center ${flipped ? 'lg:order-1' : 'lg:order-2'}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
            {product.series}
          </p>
          <h3 className="mt-4 text-5xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-6xl lg:text-7xl">
            {product.name}
          </h3>

          <p className="mt-6 max-w-md text-base leading-relaxed text-gray-700 md:text-lg">
            {product.intro}
          </p>

          {/* Spec table */}
          <div className="mt-10 border-t border-l border-gray-200">
            <div className="grid grid-cols-2">
              {product.specs.map((s, i) => (
                <div
                  key={s.label}
                  className="border-b border-r border-gray-200 p-4 md:p-5"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-gray-500">
                    {s.label}
                  </p>
                  <p className="mt-1.5 font-mono text-base font-bold tabular-nums tracking-tight text-black md:text-lg">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Applications */}
          <div className="mt-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
              Built for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.applications.map((a) => (
                <span
                  key={a}
                  className="border border-gray-300 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 bg-black px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#f37022]"
            >
              Request a quote
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <button
              type="button"
              onClick={() => onRequestBrochure(product)}
              className="group inline-flex items-center gap-3 border border-gray-800 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-black transition-colors hover:border-[#f37022] hover:text-[#f37022]"
            >
              View brochure
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function CategoryBanner({ id, label, products }) {
  return (
    <section id={id} className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
        <div className="flex items-baseline justify-between gap-6 border-b border-gray-300 pb-6">
          <div>
            <p className="font-mono text-xs tabular-nums tracking-tight text-[#f37022]">
              / Section · {products.length} {products.length === 1 ? 'machine' : 'machines'}
            </p>
            <h2 className="mt-3 text-5xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-6xl lg:text-7xl">
              {label}.
            </h2>
          </div>
          <p className="hidden font-mono text-xs tabular-nums tracking-tight text-gray-500 sm:block">
            Filed under / {id.toUpperCase()}
          </p>
        </div>
      </div>
    </section>
  )
}

export default function Products() {
  const { hash } = useLocation()
  const validIds = categories.map((c) => c.id)
  const initial = validIds.includes(hash.replace('#', '')) ? hash.replace('#', '') : 'all'
  const [active, setActive] = useState(initial)
  const [brochureFor, setBrochureFor] = useState(null)
  const [dynamicProducts, setDynamicProducts] = useState([])
  const [hiddenCodes, setHiddenCodes] = useState([])

  useEffect(() => {
    let cancelled = false
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (cancelled || !d) return
        if (Array.isArray(d.products)) setDynamicProducts(d.products)
        if (Array.isArray(d.hidden)) setHiddenCodes(d.hidden)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const products = useMemo(() => {
    const overrideCodes = new Set(dynamicProducts.map((p) => p.code))
    const hidden = new Set(hiddenCodes)
    const visibleSeeds = seedProducts.filter(
      (p) => !overrideCodes.has(p.code) && !hidden.has(p.code),
    )
    return [...dynamicProducts, ...visibleSeeds]
  }, [dynamicProducts, hiddenCodes])

  useEffect(() => {
    const stripped = hash.replace('#', '')
    if (validIds.includes(stripped)) setActive(stripped)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])

  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-20 pb-20 md:pt-28 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 hidden h-[520px] w-[520px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.14), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
          <div style={{ animation: 'fade-up 0.7s ease-out both' }}>
            <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.32em] text-[#f37022] md:text-base">
              <span className="h-px w-12 bg-[#f37022]" />
              The catalogue
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-[-0.02em] text-black md:text-7xl lg:text-[112px]">
              Every machine.
              <br />
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                In our yard.
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* ─── Category nav ─────────────────────────────────────── */}
      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
          <div className="flex items-center justify-center gap-3 overflow-x-auto py-8 sm:gap-4 md:gap-5">
            <button
              type="button"
              onClick={() => setActive('all')}
              className={`group inline-flex shrink-0 items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] transition-colors ${
                active === 'all'
                  ? 'border-[#f37022] bg-[#f37022] text-white'
                  : 'border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white'
              }`}
            >
              All
              <span
                className={`font-mono text-[10px] tabular-nums tracking-tight ${
                  active === 'all' ? 'text-white/70' : 'text-[#f37022] group-hover:text-white/70'
                }`}
              >
                /{String(products.filter((p) => p.cat !== 'mining').length).padStart(2, '0')}
              </span>
            </button>
            {categories.map((c) => {
              const isActive = active === c.id
              const count =
                c.id === 'mining'
                  ? products.filter((p) => p.tags?.includes('mining')).length
                  : products.filter((p) => p.cat === c.id).length
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(c.id)}
                  className={`group inline-flex shrink-0 items-center gap-2 border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] transition-colors ${
                    isActive
                      ? 'border-[#f37022] bg-[#f37022] text-white'
                      : 'border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white'
                  }`}
                >
                  {c.label}
                  <span
                    className={`font-mono text-[10px] tabular-nums tracking-tight ${
                      isActive ? 'text-white/70' : 'text-[#f37022] group-hover:text-white/70'
                    }`}
                  >
                    /{String(count).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Catalogue spreads ────────────────────────────────── */}
      {(() => {
        const visible = categories.filter((cat) => {
          if (cat.id === 'mining') return active === 'mining'
          return active === 'all' || active === cat.id
        })
        let visualIdx = 0
        return visible.map((cat) => {
          const items = products.filter((p) =>
            cat.id === 'mining' ? p.tags?.includes('mining') : p.cat === cat.id
          )
          return (
            <div key={cat.id}>
              <CategoryBanner id={cat.id} label={cat.label} products={items} />
              <div className="bg-white">
                {items.map((p) => {
                  const displayIndex = visualIdx
                  const flipped = visualIdx % 2 === 1
                  visualIdx += 1
                  return (
                    <ProductSpread
                      key={p.code}
                      product={p}
                      index={displayIndex}
                      flipped={flipped}
                      onRequestBrochure={setBrochureFor}
                    />
                  )
                })}
              </div>
            </div>
          )
        })
      })()}

      {brochureFor && (
        <BrochureGate
          product={brochureFor}
          onClose={() => setBrochureFor(null)}
        />
      )}
    </main>
  )
}
