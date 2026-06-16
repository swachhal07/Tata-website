import { useState } from 'react'
import { Link } from 'react-router-dom'
import excavator from '../assets/Tata_Hitachi_ZAXIS_650_H_4_b67b5d4208.webp'
import backhoe from '../assets/2a28a805-690b-4239-baf1-e3c1ec7be1e6_machanx-628392-application_backhoe_loaders_mbl_745_manitou_006_5UAyddusp.webp'
import mining from '../assets/zaxis 370.png'

const divisions = [
  {
    id: 'excavators',
    tab: 'Excavators',
    badge: 'Mini · Medium · Large',
    heading: 'Built for\nevery dig.',
    description:
      "Tata Hitachi's excavator range spans mini to mining-class machines — engineered for hydropower, road, and infrastructure work across Nepal.",
    machineCount: 8,
    stats: [
      { label: 'Operating Weight', value: '7 – 65 t' },
      { label: 'Engine Power', value: 'Up to 463 HP' },
      { label: 'Bucket Capacity', value: '0.28 – 3.4 m³' },
      { label: 'Models', value: '8 variants' },
    ],
    cta: 'View Excavators',
    image: excavator,
  },
  {
    id: 'backhoes',
    tab: 'Backhoe Loaders',
    badge: 'Multi-Purpose',
    heading: 'Dig. Load.\nRepeat.',
    description:
      'Versatile backhoe loaders for utility work, urban construction, road maintenance, and material handling on tight sites.',
    machineCount: 1,
    stats: [
      { label: 'Engine Power', value: '76 HP' },
      { label: 'Backhoe Reach', value: '5.4 m' },
      { label: 'Loader Capacity', value: '1.0 m³' },
      { label: 'Series', value: 'Shinrai Pro' },
    ],
    cta: 'View Backhoes',
    image: backhoe,
  },
  {
    id: 'mining',
    tab: 'Mining',
    badge: 'Quarry · Mining Class',
    heading: 'Built for\nthe pit.',
    description:
      'Mining-class excavators for high-volume extraction at coal, limestone, and aggregate operations across Nepal.',
    machineCount: 1,
    stats: [
      { label: 'Operating Weight', value: '37.5 t' },
      { label: 'Engine Power', value: '271 HP' },
      { label: 'Bucket Capacity', value: '2.1 m³' },
      { label: 'Series', value: 'ZAXIS Ultra' },
    ],
    cta: 'View Mining',
    image: mining,
  },
]

export default function OurDivisions() {
  const [activeId, setActiveId] = useState(divisions[0].id)
  const active = divisions.find((d) => d.id === activeId)

  return (
    <section className="bg-[#f7f5f0] py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
          <div>
            <p className="mb-4 text-base font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-lg">
              Our Divisions
            </p>
            <h2 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-5xl">
              Machines engineered.{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                To perform.
              </span>
            </h2>
          </div>
          <p className="text-base leading-relaxed text-gray-600 md:max-w-md md:justify-self-end md:text-right">
            Built for Nepal's terrain. Stocked in country. Serviced across all
            seven provinces.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-b border-gray-300">
          {divisions.map((d) => {
            const isActive = d.id === activeId
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveId(d.id)}
                className={`relative -mb-px pb-4 text-sm font-bold uppercase tracking-wider transition ${
                  isActive
                    ? 'text-[#f37022]'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {d.tab}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 bg-[#f37022]" />
                )}
              </button>
            )
          })}
        </div>

        {/* Active panel */}
        <div
          key={active.id}
          className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[1.15fr_1fr] md:gap-12"
          style={{ animation: 'fade-up 0.4s ease-out both' }}
        >
          {/* Left column */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-3">
              <span className="self-start rounded bg-[#f37022] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
                {active.badge}
              </span>
              <span className="font-mono text-xs tabular-nums tracking-tight text-gray-500">
                / {String(active.machineCount).padStart(2, '0')} {active.machineCount === 1 ? 'machine available' : 'machines available'}
              </span>
            </div>

            <h3 className="mt-6 whitespace-pre-line text-4xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-5xl">
              {active.heading}
            </h3>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600">
              {active.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {active.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-base font-bold text-black md:text-lg">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to={`/products#${active.id}`}
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.sessionStorage?.setItem('products-filter', active.id)
                }
              }}
              className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full border border-gray-800 px-6 py-3 text-sm font-bold uppercase tracking-wider text-gray-900 transition hover:border-[#f37022] hover:bg-[#f37022] hover:text-white"
            >
              {active.cta}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {/* Right column — image card */}
          <div className="relative overflow-hidden rounded-3xl bg-gray-900 min-h-[360px] md:min-h-0">
            <img
              src={active.image}
              alt={active.tab}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                Division
              </p>
              <p className="mt-1 text-2xl font-extrabold uppercase tracking-wide">
                {active.tab}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
