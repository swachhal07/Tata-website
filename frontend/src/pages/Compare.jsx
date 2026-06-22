import { useState } from 'react'
import { products } from '../data/products'

/* ─────────────────────────────────────────────────────────────
 *  Brand-level comparison
 * ───────────────────────────────────────────────────────────── */

const brandRows = [
  {
    label: 'Authorized distributor in Nepal',
    value: 'Dugar Earthmovers · since 1995',
    tataWins: true,
  },
  {
    label: 'Service branches across Nepal',
    value: '10 branches · 7 provinces',
    tataWins: true,
  },
  {
    label: 'Factory-trained technicians',
    value: 'At every branch',
    tataWins: true,
  },
  {
    label: 'Manufacturer warranty',
    value: 'Standard · full coverage',
    tataWins: false,
  },
  {
    label: 'Genuine parts in country',
    value: 'Central warehouse · branch stock',
    tataWins: true,
  },
  {
    label: 'Same / next-day parts dispatch',
    value: 'Yes — most parts',
    tataWins: true,
  },
  {
    label: 'Operator training on handover',
    value: 'Included with every machine',
    tataWins: true,
  },
  {
    label: 'Years serving Nepal contractors',
    value: '30+ years',
    tataWins: true,
  },
  {
    label: 'Resale market in Nepal',
    value: 'Strong — large installed base',
    tataWins: true,
  },
]

/* ─────────────────────────────────────────────────────────────
 *  Class-level spec comparison
 *  For each Tata Hitachi machine we store the full TH spec sheet
 *  plus the equivalent competitor specs from manufacturer
 *  brochures / public spec sites. Rows are rendered per machine
 *  only where Tata Hitachi beats at least one competitor — i.e.
 *  this section only shows features that are *better* on TH.
 * ───────────────────────────────────────────────────────────── */

const classMap = {
  'ZAXIS-650H': {
    th: {
      'Engine power': '463 HP',
      'Operating weight': '64.5 t',
      'Bucket capacity': '3.4 m³',
      'Max digging depth': '7.8 m',
      'Fuel tank': '900 L',
    },
    competitors: {
      jcb: {
        name: 'JCB JS460LC',
        specs: {
          'Engine power': '367 HP',
          'Operating weight': '46.0 t',
          'Bucket capacity': '2.2 m³',
          'Max digging depth': '7.6 m',
          'Fuel tank': '750 L',
        },
      },
      kobelco: {
        name: 'Kobelco SK500LC-10',
        specs: {
          'Engine power': '362 HP',
          'Operating weight': '49.5 t',
          'Bucket capacity': '2.5 m³',
          'Max digging depth': '7.4 m',
          'Fuel tank': '600 L',
        },
      },
      hyundai: {
        name: 'Hyundai HX520L',
        specs: {
          'Engine power': '365 HP',
          'Operating weight': '52.0 t',
          'Bucket capacity': '2.4 m³',
          'Max digging depth': '7.2 m',
          'Fuel tank': '540 L',
        },
      },
    },
  },

  'ZAXIS-370LCH': {
    th: {
      'Engine power': '254 HP',
      'Operating weight': '35.95 t',
      'Bucket capacity': '2.1 m³',
      'Bucket digging force': '246 kN',
      'Arm crowd force': '222 kN',
      'Max digging depth': '6.81 m',
      'Swing speed': '10.7 rpm',
      'Swing torque': '120 kNm',
      'Fuel tank': '630 L',
      'Hydraulic oil interval': '5,000 hrs',
      'Engine oil interval': '500 hrs',
      'Warranty': '3 yr / 7500 hrs ext.',
    },
    competitors: {
      jcb: {
        name: 'JCB JS370LC',
        specs: {
          'Engine power': '286 HP',
          'Operating weight': '37.0 t',
          'Bucket capacity': '2.0 m³',
          'Max digging depth': '7.4 m',
          'Fuel tank': '525 L',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      kobelco: {
        name: 'Kobelco SK380XDLC-10',
        specs: {
          'Engine power': '268 HP',
          'Operating weight': '37.2 t',
          'Bucket capacity': '1.9 m³',
          'Bucket digging force': '244 kN',
          'Arm crowd force': '180 kN',
          'Max digging depth': '7.56 m',
          'Swing speed': '10.0 rpm',
          'Swing torque': '120 kNm',
          'Fuel tank': '503 L',
          'Hydraulic oil interval': '2,000 hrs',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      hyundai: {
        name: 'Hyundai HX380AL',
        specs: {
          'Engine power': '270 HP',
          'Operating weight': '37.0 t',
          'Bucket capacity': '1.9 m³',
          'Bucket digging force': '230 kN',
          'Arm crowd force': '190 kN',
          'Max digging depth': '7.3 m',
          'Swing speed': '10.0 rpm',
          'Swing torque': '110 kNm',
          'Fuel tank': '540 L',
          'Hydraulic oil interval': '2,000 hrs',
          'Engine oil interval': '500 hrs',
          'Warranty': '2 yr',
        },
      },
    },
  },

  'ZAXIS-220LC': {
    th: {
      'Engine power': '168 HP',
      'Operating weight': '21.55 t',
      'Bucket capacity': '1.22 m³',
      'Bucket digging force': '158 kN',
      'Arm crowd force': '139 kN',
      'Max digging depth': '6.16 m',
      'Swing speed': '12.2 rpm',
      'Swing torque': '65.1 kNm',
      'Fuel tank': '400 L',
      'Hydraulic oil interval': '5,000 hrs',
      'Engine oil interval': '500 hrs',
      'Warranty': '3 yr / 7500 hrs ext.',
    },
    competitors: {
      jcb: {
        name: 'JCB JS220LC',
        specs: {
          'Engine power': '172 HP',
          'Operating weight': '21.9 t',
          'Bucket capacity': '1.25 m³',
          'Bucket digging force': '138 kN',
          'Arm crowd force': '97 kN',
          'Max digging depth': '6.02 m',
          'Swing speed': '12.9 rpm',
          'Swing torque': '58 kNm',
          'Fuel tank': '344 L',
          'Hydraulic oil interval': '2,000 hrs',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      kobelco: {
        name: 'Kobelco SK220XDLC-10',
        specs: {
          'Engine power': '158 HP',
          'Operating weight': '22.8 t',
          'Bucket capacity': '1.10 m³',
          'Bucket digging force': '130 kN',
          'Arm crowd force': '88 kN',
          'Max digging depth': '6.16 m',
          'Swing speed': '13.0 rpm',
          'Swing torque': '60 kNm',
          'Fuel tank': '320 L',
          'Hydraulic oil interval': '2,000 hrs',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      hyundai: {
        name: 'Hyundai HX220AL',
        specs: {
          'Engine power': '174 HP',
          'Operating weight': '22.1 t',
          'Bucket capacity': '1.34 m³',
          'Bucket digging force': '165 kN',
          'Arm crowd force': '116 kN',
          'Max digging depth': '6.73 m',
          'Swing speed': '11.8 rpm',
          'Swing torque': '62 kNm',
          'Fuel tank': '392 L',
          'Hydraulic oil interval': '2,000 hrs',
          'Engine oil interval': '500 hrs',
          'Warranty': '2 yr',
        },
      },
    },
  },

  'ZAXIS-140H': {
    th: {
      'Engine power': '88.5 HP',
      'Operating weight': '13.36 t',
      'Bucket capacity': '0.70 m³',
      'Bucket digging force': '104 kN',
      'Arm crowd force': '77 kN',
      'Max digging depth': '5.15 m',
      'Fuel tank': '250 L',
      'Engine oil interval': '500 hrs',
      'Warranty': '3 yr / 7500 hrs ext.',
    },
    competitors: {
      jcb: {
        name: 'JCB JS140LC',
        specs: {
          'Engine power': '99 HP',
          'Operating weight': '14.2 t',
          'Bucket capacity': '0.60 m³',
          'Bucket digging force': '95 kN',
          'Arm crowd force': '65 kN',
          'Max digging depth': '5.54 m',
          'Fuel tank': '270 L',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      kobelco: {
        name: 'Kobelco SK140SRLC-7',
        specs: {
          'Engine power': '99 HP',
          'Operating weight': '14.3 t',
          'Bucket capacity': '0.50 m³',
          'Bucket digging force': '92 kN',
          'Arm crowd force': '65 kN',
          'Max digging depth': '5.77 m',
          'Fuel tank': '230 L',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      hyundai: {
        name: 'Hyundai HX140L',
        specs: {
          'Engine power': '97 HP',
          'Operating weight': '14.1 t',
          'Bucket capacity': '0.52 m³',
          'Bucket digging force': '93 kN',
          'Arm crowd force': '66 kN',
          'Max digging depth': '5.69 m',
          'Fuel tank': '288 L',
          'Engine oil interval': '500 hrs',
          'Warranty': '2 yr',
        },
      },
    },
  },

  'EX-350-LCPRIME': {
    th: {
      'Engine power': '260 HP',
      'Operating weight': '34.15 t',
      'Bucket capacity': '1.7 m³',
      'Bucket digging force': '213 kN',
      'Arm crowd force': '207 kN',
      'Max digging depth': '6.30 m',
      'Swing speed': '10.1 rpm',
      'Fuel tank': '560 L',
      'Engine oil interval': '500 hrs',
      'Warranty': '3 yr / 7500 hrs ext.',
    },
    competitors: {
      jcb: {
        name: 'JCB JS370LC',
        specs: {
          'Engine power': '286 HP',
          'Operating weight': '37.0 t',
          'Bucket capacity': '2.0 m³',
          'Bucket digging force': '225 kN',
          'Arm crowd force': '195 kN',
          'Max digging depth': '7.4 m',
          'Swing speed': '10.3 rpm',
          'Fuel tank': '525 L',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      kobelco: {
        name: 'Kobelco SK380XDLC-10',
        specs: {
          'Engine power': '268 HP',
          'Operating weight': '37.2 t',
          'Bucket capacity': '1.9 m³',
          'Bucket digging force': '244 kN',
          'Arm crowd force': '180 kN',
          'Max digging depth': '7.56 m',
          'Swing speed': '10.0 rpm',
          'Fuel tank': '503 L',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      hyundai: {
        name: 'Hyundai HX380AL',
        specs: {
          'Engine power': '270 HP',
          'Operating weight': '37.0 t',
          'Bucket capacity': '1.9 m³',
          'Bucket digging force': '230 kN',
          'Arm crowd force': '190 kN',
          'Max digging depth': '7.3 m',
          'Swing speed': '10.0 rpm',
          'Fuel tank': '540 L',
          'Engine oil interval': '500 hrs',
          'Warranty': '2 yr',
        },
      },
    },
  },

  'EX-215': {
    th: {
      'Engine power': '140 HP',
      'Operating weight': '21.25 t',
      'Bucket capacity': '1.02 m³',
      'Bucket digging force': '120 kN',
      'Arm crowd force': '115 kN',
      'Max digging depth': '5.91 m',
      'Swing speed': '13.3 rpm',
      'Fuel tank': '300 L',
      'Hydraulic oil interval': '4,500 hrs',
      'Engine oil interval': '500 hrs',
      'Warranty': '3 yr / 7500 hrs ext.',
    },
    competitors: {
      jcb: {
        name: 'JCB JS220LC',
        specs: {
          'Engine power': '172 HP',
          'Operating weight': '21.9 t',
          'Bucket capacity': '1.25 m³',
          'Bucket digging force': '138 kN',
          'Arm crowd force': '97 kN',
          'Max digging depth': '6.02 m',
          'Swing speed': '12.9 rpm',
          'Fuel tank': '344 L',
          'Hydraulic oil interval': '2,000 hrs',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      kobelco: {
        name: 'Kobelco SK220XDLC-10',
        specs: {
          'Engine power': '158 HP',
          'Operating weight': '22.8 t',
          'Bucket capacity': '1.10 m³',
          'Bucket digging force': '130 kN',
          'Arm crowd force': '88 kN',
          'Max digging depth': '6.16 m',
          'Swing speed': '13.0 rpm',
          'Fuel tank': '320 L',
          'Hydraulic oil interval': '2,000 hrs',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      hyundai: {
        name: 'Hyundai HX220AL',
        specs: {
          'Engine power': '174 HP',
          'Operating weight': '22.1 t',
          'Bucket capacity': '1.34 m³',
          'Bucket digging force': '165 kN',
          'Arm crowd force': '116 kN',
          'Max digging depth': '6.73 m',
          'Swing speed': '11.8 rpm',
          'Fuel tank': '392 L',
          'Hydraulic oil interval': '2,000 hrs',
          'Engine oil interval': '500 hrs',
          'Warranty': '2 yr',
        },
      },
    },
  },

  'EX-210-LCPRIME': {
    th: {
      'Engine power': '175 HP',
      'Operating weight': '21.5 t',
      'Bucket capacity': '1.05 m³',
      'Max digging depth': '6.8 m',
      'Fuel tank': '420 L',
    },
    competitors: {
      jcb: {
        name: 'JCB JS210LC',
        specs: {
          'Engine power': '173 HP',
          'Operating weight': '21.0 t',
          'Bucket capacity': '1.0 m³',
          'Max digging depth': '6.7 m',
          'Fuel tank': '410 L',
        },
      },
      kobelco: {
        name: 'Kobelco SK210LC-10',
        specs: {
          'Engine power': '158 HP',
          'Operating weight': '21.0 t',
          'Bucket capacity': '1.0 m³',
          'Max digging depth': '6.7 m',
          'Fuel tank': '410 L',
        },
      },
      hyundai: {
        name: 'Hyundai HX220AL',
        specs: {
          'Engine power': '164 HP',
          'Operating weight': '22.5 t',
          'Bucket capacity': '1.05 m³',
          'Max digging depth': '6.7 m',
          'Fuel tank': '410 L',
        },
      },
    },
  },

  'EX-130': {
    th: {
      'Engine power': '112 HP',
      'Operating weight': '13.5 t',
      'Bucket capacity': '0.66 m³',
      'Max digging depth': '5.8 m',
      'Fuel tank': '240 L',
    },
    competitors: {
      jcb: {
        name: 'JCB JS130LC',
        specs: {
          'Engine power': '81 HP',
          'Operating weight': '13.5 t',
          'Bucket capacity': '0.55 m³',
          'Max digging depth': '5.6 m',
          'Fuel tank': '230 L',
        },
      },
      kobelco: {
        name: 'Kobelco SK130LC-11',
        specs: {
          'Engine power': '99 HP',
          'Operating weight': '13.7 t',
          'Bucket capacity': '0.50 m³',
          'Max digging depth': '5.6 m',
          'Fuel tank': '220 L',
        },
      },
      hyundai: {
        name: 'Hyundai HX140L',
        specs: {
          'Engine power': '110 HP',
          'Operating weight': '14.0 t',
          'Bucket capacity': '0.65 m³',
          'Max digging depth': '5.7 m',
          'Fuel tank': '230 L',
        },
      },
    },
  },

  'EX-70-SUPER': {
    th: {
      'Engine power': '68 HP',
      'Operating weight': '7.4 t',
      'Bucket capacity': '0.34 m³',
      'Max digging depth': '4.6 m',
      'Fuel tank': '135 L',
    },
    competitors: {
      jcb: {
        name: 'JCB 8085 ZTS',
        specs: {
          'Engine power': '59 HP',
          'Operating weight': '8.5 t',
          'Bucket capacity': '0.30 m³',
          'Max digging depth': '4.4 m',
          'Fuel tank': '100 L',
        },
      },
      kobelco: {
        name: 'Kobelco SK75-8',
        specs: {
          'Engine power': '60 HP',
          'Operating weight': '7.9 t',
          'Bucket capacity': '0.28 m³',
          'Max digging depth': '4.4 m',
          'Fuel tank': '130 L',
        },
      },
      hyundai: {
        name: 'Hyundai HX85A',
        specs: {
          'Engine power': '65 HP',
          'Operating weight': '8.4 t',
          'Bucket capacity': '0.32 m³',
          'Max digging depth': '4.5 m',
          'Fuel tank': '130 L',
        },
      },
    },
  },

  'SHINRAI-POWER': {
    th: {
      'Engine power': '99 HP',
      'Operating weight': '8.68 t',
      'Loader breakout force': '6,499 kgf',
      'Backhoe breakout force': '5,685 kgf',
      'Max backhoe depth': '4.7 m',
      'Loader payload': '1,920 kg',
      'Fuel tank': '128 L',
      'Engine oil interval': '250 hrs',
      'Warranty': '2 yr + ext. option',
    },
    competitors: {
      jcb: {
        name: 'JCB 3DX Super 4WD',
        specs: {
          'Engine power': '74 HP',
          'Operating weight': '8.01 t',
          'Loader breakout force': '6,000 kgf',
          'Backhoe breakout force': '5,000 kgf',
          'Max backhoe depth': '5.05 m',
          'Loader payload': '1,850 kg',
          'Fuel tank': '128 L',
          'Engine oil interval': '250 hrs',
          'Warranty': '2 yr',
        },
      },
      kobelco: {
        name: '— (no backhoe in Kobelco lineup)',
        specs: {},
      },
      hyundai: {
        name: '— (no backhoe in Hyundai lineup)',
        specs: {},
      },
    },
  },
}

/* ─────────────────────────────────────────────────────────────
 *  Win-direction rules per spec.
 *    higher  → bigger number wins (HP, bucket, fuel, force …)
 *    lower   → smaller number wins (operating weight in same class)
 *  All comparisons are numeric — the value is stripped to a
 *  number with parseSpecNumber(). Warranty values like
 *  "3 yr / 7500 hrs ext." compare on the leading year figure.
 * ───────────────────────────────────────────────────────────── */
const winDirection = {
  'Engine power': 'higher',
  'Operating weight': 'lower',
  'Bucket capacity': 'higher',
  'Bucket digging force': 'higher',
  'Arm crowd force': 'higher',
  'Max digging depth': 'higher',
  'Swing speed': 'higher',
  'Swing torque': 'higher',
  'Fuel tank': 'higher',
  'Hydraulic oil interval': 'higher',
  'Engine oil interval': 'higher',
  'Loader breakout force': 'higher',
  'Backhoe breakout force': 'higher',
  'Max backhoe depth': 'higher',
  'Loader payload': 'higher',
  'Warranty': 'higher',
}

function parseSpecNumber(value) {
  if (value == null) return null
  const match = String(value).replace(/,/g, '').match(/[\d.]+/)
  return match ? parseFloat(match[0]) : null
}

/** Returns 'win' | 'tie' | 'loss' for TH vs a single competitor on this spec. */
function thVerdict(spec, thValue, compValue) {
  const dir = winDirection[spec]
  if (!dir) return 'tie'
  const t = parseSpecNumber(thValue)
  const c = parseSpecNumber(compValue)
  if (t == null || c == null) return 'tie'
  // values within 2.5% of each other are treated as a tie
  if (Math.abs(t - c) / Math.max(t, c) < 0.025) return 'tie'
  if (dir === 'higher') return t > c ? 'win' : 'loss'
  return t < c ? 'win' : 'loss'
}

/** A spec row is shown if Tata Hitachi wins against at least one competitor. */
function pickWinningSpecs(entry) {
  if (!entry) return []
  const competitors = Object.values(entry.competitors)
  return Object.keys(entry.th).filter((spec) => {
    if (!(spec in winDirection)) return false
    return competitors.some((c) => {
      const cv = c.specs?.[spec]
      if (cv == null) return false
      return thVerdict(spec, entry.th[spec], cv) === 'win'
    })
  })
}

function BrandPill({ name, isTata }) {
  return (
    <div className={isTata ? 'text-[#f37022]' : 'text-white'}>
      <p
        className={`font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.25em] ${isTata ? 'text-[#f37022]' : 'text-gray-500'
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

/* Dropdown order — smallest machine first, scaling up. Shinrai (BHL) leads. */
const MODEL_ORDER = [
  'SHINRAI-POWER',
  'EX-70-SUPER',
  'EX-130',
  'ZAXIS-140H',
  'EX-210-LCPRIME',
  'EX-215',
  'ZAXIS-220LC',
  'EX-350-LCPRIME',
  'ZAXIS-370LCH',
  'ZAXIS-650H',
]

export default function Compare() {
  const [classCode, setClassCode] = useState('ZAXIS-220LC')

  const orderedProducts = MODEL_ORDER
    .map((code) => products.find((p) => p.code === code))
    .filter(Boolean)

  const tataProduct = products.find((p) => p.code === classCode) ?? null
  const entry = classMap[classCode] ?? null
  const equivalents = entry?.competitors ?? {
    jcb: { name: '—', specs: {} },
    kobelco: { name: '—', specs: {} },
    hyundai: { name: '—', specs: {} },
  }

  const winningSpecs = pickWinningSpecs(entry)

  const tataSpec = (label) => entry?.th?.[label] ?? '—'
  const jcbSpec = (label) => equivalents.jcb?.specs?.[label] ?? '—'
  const kobelcoSpec = (label) => equivalents.kobelco?.specs?.[label] ?? '—'
  const hyundaiSpec = (label) => equivalents.hyundai?.specs?.[label] ?? '—'

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
                Why Choose Tata Hitachi
              </h2>
            </div>
            <p className="max-w-md text-xs text-gray-500 sm:text-right">
              A machine is a 10-year decision. Service network and parts
              supply matter more than the sticker price.
            </p>
          </div>

          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full min-w-[480px] border-collapse">
              <thead>
                <tr className="bg-black">
                  <th className="border-r border-white/10 px-6 py-6 text-left text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Dimension
                  </th>
                  <th className="px-6 py-6 text-left">
                    <BrandPill name="Tata Hitachi" isTata={true} />
                  </th>
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
                    <td
                      className={`px-6 py-5 align-top text-sm font-medium ${row.tataWins
                        ? 'bg-[#f37022]/10 font-bold text-[#f37022]'
                        : 'text-black'
                        }`}
                    >
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── Machine-class spec comparison (TH wins only) ─────── */}
      <section className="bg-[#f7f5f0] py-16 md:py-20">
        <div className="mx-auto max-w-[1500px] px-6 lg:px-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-gray-300 pb-5">
            <div>
              <p className="font-mono text-base tabular-nums tracking-tight text-[#f37022]">
                / Machine by machine
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase leading-[1] tracking-tight text-black md:text-3xl">
                Where We're Better
              </h2>
              <p className="mt-2 max-w-xl text-xs text-gray-500">
                For each machine, we only show the specs where Tata Hitachi
                beats the competitor. If a spec isn't listed, the competitor
                is equal or stronger — and we'd rather you know that up front.
              </p>
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
                {orderedProducts.map((p) => (
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
                    Where TH is better
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
                      / Hyundai
                    </p>
                    <p className="mt-1.5 text-lg font-black uppercase leading-tight tracking-tight text-white md:text-xl">
                      {equivalents.hyundai.name}
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {winningSpecs.length === 0 ? (
                  <tr className="bg-white">
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      Spec sheet matches the competition closely on this class
                      — talk to us about service, parts, and resale instead.
                    </td>
                  </tr>
                ) : (
                  winningSpecs.map((label, rowIdx) => (
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
                        {hyundaiSpec(label)}
                      </td>
                    </tr>
                  ))
                )}

                {/* Applications row — same class = same jobs */}
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
                    {tataProduct && !equivalents.hyundai.name.startsWith('—') ? (
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
            Spec values are taken from the latest official Tata Hitachi
            brochures and from competitor manufacturer literature. Verify
            against the current local brochure before quoting — specs change
            by year and market trim.
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
