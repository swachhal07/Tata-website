import { Link } from 'react-router-dom'
import storyImage from '../assets/Tata_Hitachi_ZAXIS_650_H_4_b67b5d4208.webp'
import { ProgressiveBlur } from '../components/ProgressiveBlur'

const partnershipMarks = [
  'TATA HITACHI',
  'Hitachi Construction',
  'TATA Group',
  'Manufacturer Warranty',
  'Authorised Dealer',
  'Genuine Parts',
]

const trustPillars = [
  { label: 'Authorised distributor' },
  { label: 'Factory-trained service' },
  { label: 'Manufacturer warranty' },
  { label: 'Genuine parts supply' },
]

const differentiators = [
  {
    num: '01',
    tag: 'Coverage',
    title: 'Pan-Nepal reach',
    body: 'Service centres in every major region and field technicians on site within 24 hours of a call — wherever the work is happening, the support is closer than the next district.',
  },
  {
    num: '02',
    tag: 'Parts',
    title: 'Genuine spares, fast',
    body: 'Our central warehouse stocks fast-movers for every Tata Hitachi machine in country. Most parts ship same-day; specialised orders inside a working week.',
  },
  {
    num: '03',
    tag: 'Training',
    title: 'Operators trained, not just delivered',
    body: 'Every machine handover includes structured operator training — controls, daily inspection routines, safe operating procedures. Refresher courses available on request.',
  },
  {
    num: '04',
    tag: 'Heritage',
    title: 'Family-run since 1995',
    body: 'Three generations of the Dugar family have built this business one customer at a time. The institutional knowledge of three decades is on every call we take.',
  },
]

const regions = [
  { city: 'Kathmandu', province: 'Bagmati', role: 'Headquarters · Showroom · Service' },
  { city: 'Biratnagar', province: 'Koshi', role: 'Sales · Service · Parts' },
  { city: 'Bharatpur', province: 'Bagmati', role: 'Sales · Service · Parts' },
  { city: 'Butwal', province: 'Lumbini', role: 'Sales · Service · Parts' },
  { city: 'Nepalgunj', province: 'Lumbini', role: 'Service centre · Parts' },
  { city: 'Surkhet', province: 'Karnali', role: 'Field technicians · Dispatch' },
]

export default function About() {
  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-20 pb-28 md:pt-28 md:pb-36">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 hidden h-[520px] w-[520px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.14), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
            <div style={{ animation: 'fade-up 0.7s ease-out both' }}>
              <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.32em] text-[#f37022] md:text-base">
                <span className="h-px w-12 bg-[#f37022]" />
                About us
              </div>
              <h1 className="text-[44px] font-black uppercase leading-[0.92] tracking-[-0.02em] text-black sm:text-6xl md:text-7xl lg:text-[112px]">
                Built for Nepal.
                <br />
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  Built to last.
                </span>
              </h1>
            </div>

            <div
              className="lg:pb-3"
              style={{ animation: 'fade-up 0.7s ease-out 0.15s both' }}
            >
              <div className="mb-6 flex items-stretch gap-4">
                <div className="w-1 bg-[#f37022]" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Established
                  </p>
                  <p className="text-5xl font-black tabular-nums tracking-[-0.04em] text-black md:text-6xl">
                    1995
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Kathmandu, Nepal
                  </p>
                </div>
              </div>
              <p className="max-w-md text-base leading-relaxed text-gray-700 md:text-lg">
                Dugar Earthmovers P. Ltd is the authorised Tata Hitachi distributor for
                Nepal — supplying, servicing, and standing behind the machines
                that build the country's roads, hydropower, and quarries.
              </p>
              <div className="mt-6 inline-flex items-center border border-black/15 bg-white/60 px-4 py-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-black">
                  Authorised Tata Hitachi distributor
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Our story ────────────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={storyImage}
                  alt="Tata Hitachi ZAXIS 650 on a Nepal project site"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <span className="absolute left-0 top-0 h-1 w-32 bg-[#f37022]" />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden bg-black px-6 py-5 text-white sm:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                  Coordinates
                </p>
                <p className="mt-1 font-mono text-sm tabular-nums">
                  27.7300° N · 85.3020° E
                </p>
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
                <span className="h-px w-10 bg-[#f37022]" />
                Our story
              </div>
              <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl lg:text-6xl">
                Three generations.{' '}
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  One promise.
                </span>
              </h2>

              <div className="mt-10 space-y-5 text-base leading-relaxed text-gray-700 md:text-lg">
                <p>
                  Dugar Earthmovers Pvt. Ltd. has been a trusted partner in
                  Nepal's construction and infrastructure sector for decades.
                  As the authorized distributor of Tata Hitachi equipment, we
                  provide reliable machinery, genuine spare parts, and
                  dedicated after-sales support to customers across the
                  country.
                </p>
                <p>
                  From road construction and hydropower projects to mining
                  and large-scale development, our equipment helps power the
                  projects that shape Nepal's future. Backed by experienced
                  professionals and a commitment to customer success, we
                  strive to deliver quality, reliability, and long-term value
                  in every partnership.
                </p>
                <p>
                  At Dugar Earthmovers, we believe that strong infrastructure
                  begins with dependable equipment and exceptional service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trusted partner ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-black py-24 text-white md:py-32">
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-16 text-center">
            <div className="mb-5 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
              <span className="h-px w-10 bg-[#f37022]" />
              Trusted partner
              <span className="h-px w-10 bg-[#f37022]" />
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight md:text-6xl">
              Authorised by{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                Tata Hitachi.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
              Direct from the maker. Every machine carries the manufacturer's
              warranty. Every technician trained at the factory. Every part
              from the same supply chain that built the machine.
            </p>
          </div>

          {/* Scrolling partnership marks with progressive blur edges */}
          <div className="relative overflow-hidden">
            <div className="flex w-max animate-marquee gap-16 py-8 md:gap-24">
              {[...partnershipMarks, ...partnershipMarks, ...partnershipMarks].map((m, i) => (
                <div key={i} className="flex shrink-0 items-center gap-4">
                  <span className="font-mono text-xs tabular-nums tracking-tight text-[#f37022]">
                    /
                  </span>
                  <span className="whitespace-nowrap font-serif text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                    {m}
                  </span>
                </div>
              ))}
            </div>

            <ProgressiveBlur
              direction="left"
              blurLayers={6}
              blurIntensity={0.5}
              className="absolute inset-y-0 left-0 z-10 w-40 md:w-64"
            />
            <ProgressiveBlur
              direction="right"
              blurLayers={6}
              blurIntensity={0.5}
              className="absolute inset-y-0 right-0 z-10 w-40 md:w-64"
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-gradient-to-r from-black to-transparent md:w-48" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-gradient-to-l from-black to-transparent md:w-48" />
          </div>

          <div className="mt-16 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
            {trustPillars.map((p, i) => (
              <div
                key={p.label}
                className="bg-black p-6 md:p-7"
                style={{ animation: `fade-up 0.6s ease-out ${0.08 * i}s both` }}
              >
                <p className="font-mono text-[10px] font-bold tabular-nums tracking-[0.25em] text-[#f37022]">
                  / 0{i + 1}
                </p>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.2em] text-white md:text-base">
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── What sets us apart ──────────────────────────────── */}
      <section className="bg-[#f7f5f0] py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
              <span className="h-px w-10 bg-[#f37022]" />
              What sets us apart
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl lg:text-6xl">
              Four reasons fleets{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                come back.
              </span>
            </h2>
          </div>

          <div className="grid gap-px bg-gray-300 md:grid-cols-2">
            {differentiators.map((d) => (
              <div
                key={d.num}
                className="group bg-[#f7f5f0] p-8 transition-colors hover:bg-white md:p-12"
              >
                <div className="mb-8 flex items-baseline justify-between">
                  <span className="text-2xl font-black tabular-nums tracking-tight text-[#f37022]">
                    {d.num}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 transition-colors group-hover:text-[#f37022]">
                    {d.tag}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-3xl">
                  {d.title}
                </h3>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-700">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Service network ─────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-16 grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
                <span className="h-px w-10 bg-[#f37022]" />
                Service network
              </div>
              <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl lg:text-6xl">
                Across the country.
                <br />
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  Within reach.
                </span>
              </h2>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-700 lg:justify-self-end lg:text-right">
              Six locations stocked with parts, technicians, and field-ready
              support — so when a machine stops, the answer is never more than
              a day's reach away.
            </p>
          </div>

          <div className="border-t border-gray-200">
            {regions.map((r, i) => (
              <Link
                key={r.city}
                to="/contact"
                className="group block border-b border-gray-200 transition-colors hover:bg-[#f7f5f0]"
              >
                <div className="grid grid-cols-[40px_1fr_auto] items-center gap-4 py-6 transition-transform group-hover:translate-x-2 md:grid-cols-[60px_1.4fr_1fr_1.6fr_60px] md:gap-8 md:py-8">
                  <span className="text-xs font-bold tabular-nums tracking-[0.2em] text-gray-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-2xl font-black uppercase leading-none tracking-tight text-black md:text-4xl">
                    {r.city}
                  </span>
                  <span className="hidden text-xs font-bold uppercase tracking-[0.25em] text-gray-500 md:block">
                    {r.province} province
                  </span>
                  <span className="hidden text-sm text-gray-600 md:block">
                    {r.role}
                  </span>
                  <span className="text-right text-xl text-[#f37022] opacity-30 transition-all group-hover:opacity-100 md:text-2xl">
                    →
                  </span>
                </div>
                <div className="-mt-3 mb-3 pl-11 text-xs text-gray-500 md:hidden">
                  {r.province} · {r.role}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Promise / closing word ──────────────────────────── */}
      <section className="relative bg-[#f7f5f0] py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-6 lg:px-12">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
              <span className="h-px w-10 bg-[#f37022]" />
              Our promise
              <span className="h-px w-10 bg-[#f37022]" />
            </div>
            <h2 className="text-3xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-5xl lg:text-6xl">
              "We don't disappear after delivery.{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                We stay with the machine.
              </span>
              "
            </h2>
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-gray-700 md:text-lg">
              Every machine we deliver is supported by the same team for as
              long as it's working — the people who answer the call know the
              machine, the operator, and the project it's on.
            </p>
          </div>
        </div>
      </section>

    </main>
  )
}
