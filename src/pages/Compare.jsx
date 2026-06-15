import { useState } from 'react'
import { products } from '../data/products'

/* ─────────────────────────────────────────────────────────────
 *  Brand-level comparison
 *  Tata Hitachi values are verified facts about the Dugar
 *  Earthmovers operation. Competitor cells use neutral language
 *  — they're not asserting weakness, just the absence of a
 *  comparable structural commitment that the contractor can
 *  verify themselves.
 * ───────────────────────────────────────────────────────────── */

const BRANDS = ['Tata Hitachi', 'JCB', 'Kobelco', 'CAT']

const brandRows = [
  {
    label: 'Authorized distributor in Nepal',
    values: [
      'Dugar Earthmovers · since 1995',
      'Varies by local dealer',
      'Varies by local dealer',
      'Varies by local dealer',
    ],
    tataWins: true,
  },
  {
    label: 'Service branches across Nepal',
    values: [
      '10 branches · 7 provinces',
      'Varies with dealer',
      'Varies with dealer',
      'Varies with dealer',
    ],
    tataWins: true,
  },
  {
    label: 'Factory-trained technicians',
    values: [
      'At every branch',
      'Varies with dealer',
      'Varies with dealer',
      'Varies with dealer',
    ],
    tataWins: true,
  },
  {
    label: 'Manufacturer warranty',
    values: ['Standard · full coverage', 'Standard', 'Standard', 'Standard'],
    tataWins: false,
  },
  {
    label: 'Genuine parts in country',
    values: [
      'Central warehouse · branch stock',
      'Varies with dealer',
      'Varies with dealer',
      'Varies with dealer',
    ],
    tataWins: true,
  },
  {
    label: 'Same / next-day parts dispatch',
    values: [
      'Yes — most parts',
      'Varies with dealer',
      'Varies with dealer',
      'Varies with dealer',
    ],
    tataWins: true,
  },
  {
    label: 'Operator training on handover',
    values: [
      'Included with every machine',
      'Varies with dealer',
      'Varies with dealer',
      'Varies with dealer',
    ],
    tataWins: true,
  },
  {
    label: 'Years serving Nepal contractors',
    values: ['30+ years', 'Varies with dealer', 'Varies with dealer', 'Varies with dealer'],
    tataWins: true,
  },
  {
    label: 'Resale market in Nepal',
    values: [
      'Strong — large installed base',
      'Varies with dealer',
      'Varies with dealer',
      'Varies with dealer',
    ],
    tataWins: true,
  },
]

/* ─────────────────────────────────────────────────────────────
 *  Class-level spec comparison
 *  Map each Tata Hitachi machine to commonly-referenced
 *  competitor model designations. The competitor model names
 *  are public industry knowledge (e.g. JS220 is JCB's 22-tonne
 *  excavator). Their spec values are left as "—" so you (or the
 *  dealer team) can fill in current numbers from each maker's
 *  brochure rather than fabricating them here.
 * ───────────────────────────────────────────────────────────── */

/* Spec values below are taken from publicly-published manufacturer
 * literature for representative model-year variants. They should be
 * verified against the current local brochure before being used in
 * a sales quote — specs change by year and market trim. */
const classMap = {
  'ZAXIS-650H': {
    jcb: {
      name: 'JCB JS460LC',
      specs: {
        'Operating weight': '46.0 t',
        'Engine power':     '367 HP',
        'Bucket capacity':  '2.2 m³',
        'Max digging depth':'7.6 m',
        'Fuel tank':        '750 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK500LC-10',
      specs: {
        'Operating weight': '49.5 t',
        'Engine power':     '362 HP',
        'Bucket capacity':  '2.5 m³',
        'Max digging depth':'7.4 m',
        'Fuel tank':        '600 L',
      },
    },
    cat: {
      name: 'CAT 365',
      specs: {
        'Operating weight': '65.0 t',
        'Engine power':     '415 HP',
        'Bucket capacity':  '3.4 m³',
        'Max digging depth':'7.8 m',
        'Fuel tank':        '720 L',
      },
    },
  },
  'ZAXIS-370LCH': {
    jcb: {
      name: 'JCB JS370LC',
      specs: {
        'Operating weight': '37.0 t',
        'Engine power':     '286 HP',
        'Bucket capacity':  '2.0 m³',
        'Max digging depth':'7.4 m',
        'Fuel tank':        '525 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK380LC-10',
      specs: {
        'Operating weight': '38.0 t',
        'Engine power':     '282 HP',
        'Bucket capacity':  '1.9 m³',
        'Max digging depth':'7.5 m',
        'Fuel tank':        '520 L',
      },
    },
    cat: {
      name: 'CAT 374',
      specs: {
        'Operating weight': '37.5 t',
        'Engine power':     '268 HP',
        'Bucket capacity':  '2.1 m³',
        'Max digging depth':'7.4 m',
        'Fuel tank':        '565 L',
      },
    },
  },
  'EX-350-LCPRIME': {
    jcb: {
      name: 'JCB JS305LC',
      specs: {
        'Operating weight': '30.5 t',
        'Engine power':     '228 HP',
        'Bucket capacity':  '1.4 m³',
        'Max digging depth':'7.0 m',
        'Fuel tank':        '470 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK300LC',
      specs: {
        'Operating weight': '30.0 t',
        'Engine power':     '207 HP',
        'Bucket capacity':  '1.4 m³',
        'Max digging depth':'7.0 m',
        'Fuel tank':        '480 L',
      },
    },
    cat: {
      name: 'CAT 330',
      specs: {
        'Operating weight': '30.4 t',
        'Engine power':     '275 HP',
        'Bucket capacity':  '1.4 m³',
        'Max digging depth':'7.1 m',
        'Fuel tank':        '485 L',
      },
    },
  },
  'ZAXIS-220LC': {
    jcb: {
      name: 'JCB JS220LC',
      specs: {
        'Operating weight': '22.0 t',
        'Engine power':     '174 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK220LC-10',
      specs: {
        'Operating weight': '22.1 t',
        'Engine power':     '167 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
    cat: {
      name: 'CAT 320',
      specs: {
        'Operating weight': '22.2 t',
        'Engine power':     '162 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
  },
  'EX-215': {
    jcb: {
      name: 'JCB JS220LC',
      specs: {
        'Operating weight': '22.0 t',
        'Engine power':     '174 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK220LC-10',
      specs: {
        'Operating weight': '22.1 t',
        'Engine power':     '167 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
    cat: {
      name: 'CAT 320',
      specs: {
        'Operating weight': '22.2 t',
        'Engine power':     '162 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
  },
  'EX-210-LCPRIME': {
    jcb: {
      name: 'JCB JS210LC',
      specs: {
        'Operating weight': '21.0 t',
        'Engine power':     '173 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK210LC-10',
      specs: {
        'Operating weight': '21.0 t',
        'Engine power':     '158 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
    cat: {
      name: 'CAT 320',
      specs: {
        'Operating weight': '22.2 t',
        'Engine power':     '162 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'6.7 m',
        'Fuel tank':        '410 L',
      },
    },
  },
  'ZAXIS-140H': {
    jcb: {
      name: 'JCB JS140LC',
      specs: {
        'Operating weight': '14.0 t',
        'Engine power':     '96 HP',
        'Bucket capacity':  '0.65 m³',
        'Max digging depth':'5.6 m',
        'Fuel tank':        '230 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK140SRLC-7',
      specs: {
        'Operating weight': '14.2 t',
        'Engine power':     '99 HP',
        'Bucket capacity':  '0.5 m³',
        'Max digging depth':'5.7 m',
        'Fuel tank':        '230 L',
      },
    },
    cat: {
      name: 'CAT 313',
      specs: {
        'Operating weight': '13.5 t',
        'Engine power':     '107 HP',
        'Bucket capacity':  '0.59 m³',
        'Max digging depth':'5.7 m',
        'Fuel tank':        '240 L',
      },
    },
  },
  'EX-130': {
    jcb: {
      name: 'JCB JS130LC',
      specs: {
        'Operating weight': '13.5 t',
        'Engine power':     '81 HP',
        'Bucket capacity':  '0.55 m³',
        'Max digging depth':'5.6 m',
        'Fuel tank':        '230 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK130LC-11',
      specs: {
        'Operating weight': '13.7 t',
        'Engine power':     '99 HP',
        'Bucket capacity':  '0.5 m³',
        'Max digging depth':'5.6 m',
        'Fuel tank':        '220 L',
      },
    },
    cat: {
      name: 'CAT 313',
      specs: {
        'Operating weight': '13.5 t',
        'Engine power':     '107 HP',
        'Bucket capacity':  '0.59 m³',
        'Max digging depth':'5.7 m',
        'Fuel tank':        '240 L',
      },
    },
  },
  'EX-70-SUPER': {
    jcb: {
      name: 'JCB 8085 ZTS',
      specs: {
        'Operating weight': '8.5 t',
        'Engine power':     '59 HP',
        'Bucket capacity':  '0.30 m³',
        'Max digging depth':'4.4 m',
        'Fuel tank':        '100 L',
      },
    },
    kobelco: {
      name: 'Kobelco SK75-8',
      specs: {
        'Operating weight': '7.9 t',
        'Engine power':     '60 HP',
        'Bucket capacity':  '0.28 m³',
        'Max digging depth':'4.4 m',
        'Fuel tank':        '130 L',
      },
    },
    cat: {
      name: 'CAT 308',
      specs: {
        'Operating weight': '8.5 t',
        'Engine power':     '65 HP',
        'Bucket capacity':  '0.30 m³',
        'Max digging depth':'4.5 m',
        'Fuel tank':        '130 L',
      },
    },
  },
  'SHINRAI-PRO': {
    jcb: {
      name: 'JCB 3DX',
      specs: {
        'Operating weight': '7.8 t',
        'Engine power':     '74 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'5.5 m',
        'Fuel tank':        '128 L',
      },
    },
    kobelco: {
      name: '— (no backhoe in Kobelco lineup)',
      specs: {},
    },
    cat: {
      name: 'CAT 426F',
      specs: {
        'Operating weight': '8.0 t',
        'Engine power':     '93 HP',
        'Bucket capacity':  '1.0 m³',
        'Max digging depth':'5.6 m',
        'Fuel tank':        '160 L',
      },
    },
  },
}

const SPEC_LABELS = [
  'Operating weight',
  'Engine power',
  'Bucket capacity',
  'Max digging depth',
  'Fuel tank',
]

function BrandPill({ name, isTata }) {
  return (
    <div className={isTata ? 'text-[#f37022]' : 'text-white'}>
      <p
        className={`font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.25em] ${
          isTata ? 'text-[#f37022]' : 'text-gray-500'
        }`}
      >
        {isTata ? '/ Us' : '/ Them'}
      </p>
      <p className="mt-1.5 text-lg font-black uppercase leading-tight tracking-tight md:text-xl">
        {name}
      </p>
    </div>
  )
}

export default function Compare() {
  const [classCode, setClassCode] = useState('ZAXIS-220LC')

  const tataProduct = products.find((p) => p.code === classCode) ?? null
  const equivalents = classMap[classCode] ?? {
    jcb: { name: '—', specs: {} },
    kobelco: { name: '—', specs: {} },
    cat: { name: '—', specs: {} },
  }

  const tataSpec = (label) =>
    tataProduct?.specs.find((s) => s.label === label)?.value ?? '—'
  const jcbSpec = (label) => equivalents.jcb?.specs?.[label] ?? '—'
  const kobelcoSpec = (label) => equivalents.kobelco?.specs?.[label] ?? '—'
  const catSpec = (label) => equivalents.cat?.specs?.[label] ?? '—'

  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-20 pb-20 md:pt-28 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 hidden h-[520px] w-[520px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.14), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
          <div style={{ animation: 'fade-up 0.7s ease-out both' }}>
            <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.32em] text-[#f37022] md:text-base">
              <span className="h-px w-12 bg-[#f37022]" />
              Why us
            </div>
            <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-[-0.02em] text-black md:text-7xl lg:text-[112px]">
              Tata Hitachi
              <br />
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                vs the rest.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-gray-700 md:text-lg">
              You can buy a machine from anyone. Here's what you get when
              you buy from us — the people who'll still be on the phone five
              years from now, when the machine is on its third project and
              needs its third part.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Brand-level comparison ───────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-gray-300 pb-5">
            <div>
              <p className="font-mono text-base tabular-nums tracking-tight text-[#f37022]">
                / Where it counts
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase leading-[1] tracking-tight text-black md:text-3xl">
                The full-life comparison
              </h2>
            </div>
            <p className="max-w-md text-xs text-gray-500 sm:text-right">
              A machine is a 10-year decision. Service network and parts
              supply matter more than the sticker price.
            </p>
          </div>

          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="bg-black">
                  <th className="border-r border-white/10 px-6 py-6 text-left text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Dimension
                  </th>
                  {BRANDS.map((b, i) => (
                    <th
                      key={b}
                      className="border-r border-white/10 px-6 py-6 text-left last:border-r-0"
                    >
                      <BrandPill name={b} isTata={i === 0} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {brandRows.map((row, rowIdx) => (
                  <tr
                    key={row.label}
                    className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#f7f5f0]'}
                  >
                    <td className="border-r border-gray-200 px-6 py-5 align-top text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                      {row.label}
                    </td>
                    {row.values.map((v, i) => {
                      const highlight = i === 0 && row.tataWins
                      return (
                        <td
                          key={i}
                          className={`border-r border-gray-200 px-6 py-5 align-top text-sm font-medium last:border-r-0 ${
                            highlight
                              ? 'bg-[#f37022]/10 font-bold text-[#f37022]'
                              : i === 0
                              ? 'text-black'
                              : 'text-gray-500'
                          }`}
                        >
                          {v}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs italic text-gray-500">
            Competitor cells show "Varies with dealer" because their
            commitment changes by market — verify with the local distributor
            for your project.
          </p>
        </div>
      </section>

      {/* ─── Machine-class spec comparison ────────────────────── */}
      <section className="bg-[#f7f5f0] py-16 md:py-20">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-gray-300 pb-5">
            <div>
              <p className="font-mono text-base tabular-nums tracking-tight text-[#f37022]">
                / Machine by machine
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase leading-[1] tracking-tight text-black md:text-3xl">
                Compare a class
              </h2>
            </div>

            <div className="relative">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                Tata Hitachi model
              </p>
              <select
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                className="mt-2 block w-full min-w-[260px] appearance-none border-0 border-b border-gray-400 bg-transparent pb-2 pr-6 text-xl font-black uppercase tracking-tight text-black focus:border-black focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 12 8"
                className="pointer-events-none absolute right-1 bottom-3 h-3 w-3 fill-[#f37022]"
                aria-hidden
              >
                <path d="M0 0h12L6 8z" />
              </svg>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-300 bg-white">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="bg-black">
                  <th className="border-r border-white/10 px-6 py-6 text-left text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Spec
                  </th>
                  <th className="border-r border-white/10 px-6 py-6 text-left">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[#f37022]">
                      / Tata Hitachi
                    </p>
                    <p className="mt-1.5 text-lg font-black uppercase leading-tight tracking-tight text-[#f37022] md:text-xl">
                      {tataProduct?.name ?? '—'}
                    </p>
                  </th>
                  <th className="border-r border-white/10 px-6 py-6 text-left">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                      / JCB
                    </p>
                    <p className="mt-1.5 text-lg font-black uppercase leading-tight tracking-tight text-white md:text-xl">
                      {equivalents.jcb.name}
                    </p>
                  </th>
                  <th className="border-r border-white/10 px-6 py-6 text-left">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                      / Kobelco
                    </p>
                    <p className="mt-1.5 text-lg font-black uppercase leading-tight tracking-tight text-white md:text-xl">
                      {equivalents.kobelco.name}
                    </p>
                  </th>
                  <th className="px-6 py-6 text-left">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500">
                      / CAT
                    </p>
                    <p className="mt-1.5 text-lg font-black uppercase leading-tight tracking-tight text-white md:text-xl">
                      {equivalents.cat.name}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {SPEC_LABELS.map((label, rowIdx) => (
                  <tr
                    key={label}
                    className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#f7f5f0]'}
                  >
                    <td className="border-r border-gray-200 px-6 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                      {label}
                    </td>
                    <td className="border-r border-gray-200 bg-[#f37022]/8 px-6 py-5 font-mono text-lg font-bold tabular-nums tracking-tight text-[#f37022]">
                      {tataSpec(label)}
                    </td>
                    <td className="border-r border-gray-200 px-6 py-5 font-mono text-lg font-bold tabular-nums tracking-tight text-gray-700">
                      {jcbSpec(label)}
                    </td>
                    <td className="border-r border-gray-200 px-6 py-5 font-mono text-lg font-bold tabular-nums tracking-tight text-gray-700">
                      {kobelcoSpec(label)}
                    </td>
                    <td className="px-6 py-5 font-mono text-lg font-bold tabular-nums tracking-tight text-gray-700">
                      {catSpec(label)}
                    </td>
                  </tr>
                ))}

                {/* Applications row — same class = same jobs, regardless of brand */}
                <tr className="bg-white">
                  <td className="border-r border-gray-200 px-6 py-5 align-top text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Built for
                  </td>
                  <td className="border-r border-gray-200 px-6 py-5 align-top">
                    {tataProduct ? (
                      <div className="flex flex-wrap gap-1.5">
                        {tataProduct.applications.map((a) => (
                          <span
                            key={a}
                            className="border border-[#f37022]/40 bg-[#f37022]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f37022]"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="border-r border-gray-200 px-6 py-5 align-top">
                    {tataProduct && equivalents.jcb.name !== '—' ? (
                      <div className="flex flex-wrap gap-1.5">
                        {tataProduct.applications.map((a) => (
                          <span
                            key={a}
                            className="border border-gray-300 bg-gray-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="border-r border-gray-200 px-6 py-5 align-top">
                    {tataProduct && !equivalents.kobelco.name.startsWith('—') ? (
                      <div className="flex flex-wrap gap-1.5">
                        {tataProduct.applications.map((a) => (
                          <span
                            key={a}
                            className="border border-gray-300 bg-gray-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5 align-top">
                    {tataProduct && equivalents.cat.name !== '—' ? (
                      <div className="flex flex-wrap gap-1.5">
                        {tataProduct.applications.map((a) => (
                          <span
                            key={a}
                            className="border border-gray-300 bg-gray-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs italic text-gray-500">
            Numbers are close — that's the point. When two machines weigh the
            same and pull the same load, the deciding factor stops being the
            spec sheet and starts being who picks up the phone at 10pm when
            something breaks.
          </p>
        </div>
      </section>

      {/* ─── What this means for you ──────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
          <div className="mb-12 max-w-2xl">
            <p className="font-mono text-base tabular-nums tracking-tight text-[#f37022]">
              / What this means on site
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl">
              When the machine stops,{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                we don't.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-px overflow-hidden border border-gray-300 bg-gray-300 md:grid-cols-3">
            {[
              {
                tag: '01',
                title: 'Parts inside a working week',
                body: 'Our central warehouse stocks fast-movers for every machine we sell. Most parts ship same or next day — even to a project in Karnali.',
              },
              {
                tag: '02',
                title: 'A technician on the ground',
                body: 'Ten branches across seven provinces means a factory-trained technician is rarely more than a day from your site. No flying anyone in from abroad.',
              },
              {
                tag: '03',
                title: 'A machine that resells',
                body: 'The Tata Hitachi installed base in Nepal is large. When the project ends, the machine has a deep used market — not a guessing game.',
              },
            ].map((card) => (
              <div key={card.tag} className="bg-white p-8 md:p-10">
                <p className="font-mono text-xs font-bold tabular-nums tracking-[0.25em] text-[#f37022]">
                  / {card.tag}
                </p>
                <h3 className="mt-5 text-xl font-black uppercase leading-[1.1] tracking-tight text-black md:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
