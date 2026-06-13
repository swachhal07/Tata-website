import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import excavator from '../assets/650h zaxis.webp'
import compact from '../assets/zaxis 140.jpg'
import backhoe from '../assets/sinrahai pro img.jpg'
import zaxis220 from '../assets/Tata_Hitachi_Zaxis_220_LCM_Side_View_f037a1e7f1.webp'
import mining from '../assets/zaxis 370.png'
import ex70 from '../assets/EX 70 Super.webp'
import ex130 from '../assets/EX 130.jpg'
import ex210 from '../assets/EX 210 LC prime.webp'
import ex300 from '../assets/ex 300 LC prime.jpg'
import ex215 from '../assets/lq 215.jpg'

import pdf650h from '../assets/zaxis-650h-brochure.pdf'
import pdf140 from '../assets/zaxis140-ultra-feb-24.pdf'
import pdf220lc from '../assets/ZAXIS-220LC-Ultra_Brochure.pdf'
import pdf370lch from '../assets/zaxis-370lch-ultra_brochure.pdf'
import pdfShinrai from '../assets/shinrai-power-brochure.pdf'
import pdfEx70 from '../assets/ex70-super-new.pdf'
import pdfEx130 from '../assets/EX130 Prime-tunnel-excavator.pdf'
import pdfEx210 from '../assets/EX210LC Prime E 4 page.pdf'
import pdfEx300 from '../assets/ex-350lc-prime-brochure-.pdf'
import pdfEx215 from '../assets/EX-215LCQ-Prime.pdf'

const categories = [
  { id: 'excavators', label: 'Excavators', count: 8 },
  { id: 'backhoes', label: 'Backhoe loaders', count: 1 },
  { id: 'mining', label: 'Mining', count: 1 },
]

const products = [
  {
    cat: 'excavators',
    code: 'ZAXIS-650H',
    name: 'ZAXIS 650 H',
    series: 'Large excavator · Workhorse class',
    intro:
      'Our flagship excavator. Built for the heaviest cut-and-fill, mining-class work, and the hardest hydropower contracts.',
    specs: [
      { label: 'Operating weight', value: '64.5 t' },
      { label: 'Engine power', value: '463 HP' },
      { label: 'Bucket capacity', value: '3.4 m³' },
      { label: 'Max digging depth', value: '7.8 m' },
      { label: 'Fuel tank', value: '900 L' },
      { label: 'Track class', value: 'Heavy duty' },
    ],
    applications: ['Mining', 'Hydropower', 'Major earthworks', 'Quarry'],
    image: excavator,
    pdf: pdf650h,
  },
  {
    cat: 'excavators',
    code: 'ZAXIS-140H',
    name: 'ZAXIS 140 H',
    series: 'Medium excavator · Versatile class',
    intro:
      'The go-to mid-class machine. Tight enough for road work, capable enough for site development across Nepal.',
    specs: [
      { label: 'Operating weight', value: '13.8 t' },
      { label: 'Engine power', value: '110 HP' },
      { label: 'Bucket capacity', value: '0.55 m³' },
      { label: 'Max digging depth', value: '5.7 m' },
      { label: 'Fuel tank', value: '240 L' },
      { label: 'Track class', value: 'Standard' },
    ],
    applications: ['Road construction', 'Site development', 'Utilities'],
    image: compact,
    pdf: pdf140,
  },
  {
    cat: 'excavators',
    code: 'EX-130',
    name: 'EX 130',
    series: 'Medium excavator · Standard class',
    intro:
      'A workhorse 13-tonne machine. Reliable, fuel-efficient, and built for the everyday earthworks that make up most contracts in Nepal.',
    specs: [
      { label: 'Operating weight', value: '13.5 t' },
      { label: 'Engine power', value: '95 HP' },
      { label: 'Bucket capacity', value: '0.5 m³' },
      { label: 'Max digging depth', value: '5.6 m' },
      { label: 'Fuel tank', value: '230 L' },
      { label: 'Track class', value: 'Standard' },
    ],
    applications: ['Road construction', 'Site development', 'Drainage', 'Utilities'],
    image: ex130,
    pdf: pdfEx130,
  },
  {
    cat: 'excavators',
    code: 'EX-70-SUPER',
    name: 'EX 70 Super',
    series: 'Compact excavator · Super series',
    intro:
      'The compact specialist. Narrow enough for trenching and urban work, capable enough to outwork any machine in its weight class.',
    specs: [
      { label: 'Operating weight', value: '7.4 t' },
      { label: 'Engine power', value: '56 HP' },
      { label: 'Bucket capacity', value: '0.28 m³' },
      { label: 'Max digging depth', value: '4.3 m' },
      { label: 'Fuel tank', value: '100 L' },
      { label: 'Track class', value: 'Compact' },
    ],
    applications: ['Trenching', 'Utilities', 'Landscaping', 'Urban'],
    image: ex70,
    pdf: pdfEx70,
  },
  {
    cat: 'backhoes',
    code: 'SHINRAI-PRO',
    name: 'Shinrai Pro',
    series: 'Backhoe loader · Multi-purpose',
    intro:
      'Built narrow for Nepali urban sites. The workhorse for municipal contracts, drainage, and utility infrastructure.',
    specs: [
      { label: 'Operating weight', value: '7.8 t' },
      { label: 'Engine power', value: '76 HP' },
      { label: 'Backhoe reach', value: '5.4 m' },
      { label: 'Loader capacity', value: '1.0 m³' },
      { label: 'Fuel tank', value: '128 L' },
      { label: 'Transmission', value: '4F / 4R' },
    ],
    applications: ['Municipal', 'Urban', 'Utilities', 'Drainage'],
    image: backhoe,
    pdf: pdfShinrai,
  },
  {
    cat: 'excavators',
    code: 'ZAXIS-220LC',
    name: 'ZAXIS 220 LC',
    series: 'Medium excavator · Long crawler',
    intro:
      'The site workhorse. Extended undercarriage for stability on uneven ground — the most-deployed machine on infrastructure contracts across Nepal.',
    specs: [
      { label: 'Operating weight', value: '22.4 t' },
      { label: 'Engine power', value: '163 HP' },
      { label: 'Bucket capacity', value: '1.0 m³' },
      { label: 'Max digging depth', value: '6.7 m' },
      { label: 'Fuel tank', value: '400 L' },
      { label: 'Track class', value: 'Long crawler' },
    ],
    applications: ['Infrastructure', 'Road construction', 'Hydropower', 'Earthworks'],
    image: zaxis220,
    pdf: pdf220lc,
  },
  {
    cat: 'excavators',
    code: 'EX-300-LCPRIME',
    name: 'EX 300 LC Prime',
    series: 'Large excavator · LC Prime series',
    intro:
      'Heavy-class excavator built for major earthworks and demanding infrastructure projects. The LC Prime undercarriage delivers stability on rough ground without sacrificing reach.',
    specs: [
      { label: 'Operating weight', value: '30.0 t' },
      { label: 'Engine power', value: '210 HP' },
      { label: 'Bucket capacity', value: '1.4 m³' },
      { label: 'Max digging depth', value: '7.0 m' },
      { label: 'Fuel tank', value: '470 L' },
      { label: 'Track class', value: 'LC Prime' },
    ],
    applications: ['Major earthworks', 'Hydropower', 'Heavy lift', 'Quarry'],
    image: ex300,
    pdf: pdfEx300,
  },
  {
    cat: 'excavators',
    code: 'EX-210-LCPRIME',
    name: 'EX 210 LC Prime',
    series: 'Medium-large excavator · LC Prime series',
    intro:
      'The Prime series 20-tonne machine. Reinforced boom and stick, improved hydraulic response, and the LC Prime undercarriage for the long haul.',
    specs: [
      { label: 'Operating weight', value: '21.5 t' },
      { label: 'Engine power', value: '145 HP' },
      { label: 'Bucket capacity', value: '1.0 m³' },
      { label: 'Max digging depth', value: '6.7 m' },
      { label: 'Fuel tank', value: '400 L' },
      { label: 'Track class', value: 'LC Prime' },
    ],
    applications: ['Hydropower', 'Infrastructure', 'Earthworks', 'Site development'],
    image: ex210,
    pdf: pdfEx210,
  },
  {
    cat: 'mining',
    code: 'ZAXIS-370LCH',
    name: 'ZAXIS 370 LCH Ultra',
    series: 'Mining-class excavator · Quarry Ultra series',
    intro:
      'The pit machine. Reinforced structure, dedicated duty-cycle hydraulics, undercarriage rated for continuous extraction in quarry conditions.',
    specs: [
      { label: 'Operating weight', value: '37.5 t' },
      { label: 'Engine power', value: '271 HP' },
      { label: 'Bucket capacity', value: '2.1 m³' },
      { label: 'Max digging depth', value: '7.4 m' },
      { label: 'Fuel tank', value: '605 L' },
      { label: 'Duty cycle', value: 'Continuous' },
    ],
    applications: ['Mining', 'Coal', 'Limestone', 'Aggregate extraction'],
    image: mining,
    pdf: pdf370lch,
  },
  {
    cat: 'excavators',
    code: 'EX-215',
    name: 'EX 215',
    series: 'Medium excavator · Infra-duty class',
    intro:
      'The 22-tonne workhorse for infrastructure contracts. Balanced reach, fuel economy, and undercarriage rated for the daily punishment of road and site work.',
    specs: [
      { label: 'Operating weight', value: '22.0 t' },
      { label: 'Engine power', value: '150 HP' },
      { label: 'Bucket capacity', value: '0.93 m³' },
      { label: 'Max digging depth', value: '6.7 m' },
      { label: 'Fuel tank', value: '400 L' },
      { label: 'Track class', value: 'Long crawler' },
    ],
    applications: ['Infrastructure', 'Road construction', 'Site development', 'Earthworks'],
    image: ex215,
    pdf: pdfEx215,
  },
]

function ProductSpread({ product, index, flipped }) {
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
            <a
              href={product.pdf}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-gray-800 px-7 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-black transition-colors hover:border-[#f37022] hover:text-[#f37022]"
            >
              View brochure
            </a>
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
                /{String(products.length).padStart(2, '0')}
              </span>
            </button>
            {categories.map((c) => {
              const isActive = active === c.id
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
                    /{String(c.count).padStart(2, '0')}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Catalogue spreads ────────────────────────────────── */}
      {(() => {
        const visible = categories.filter(
          (cat) => active === 'all' || active === cat.id
        )
        let visualIdx = 0
        return visible.map((cat) => {
          const items = products.filter((p) => p.cat === cat.id)
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
                    />
                  )
                })}
              </div>
            </div>
          )
        })
      })()}

    </main>
  )
}
