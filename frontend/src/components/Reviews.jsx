const reviews = [
  {
    quote:
      'Bought a ZAXIS 220 for our hydropower access road work in Dolakha. Machine has clocked over 4,000 hours with zero downtime — Dugar service team handled every scheduled check on site.',
    name: 'Bishal Shrestha',
    role: 'Himalayan Infra Builders',
  },
  {
    quote:
      'We run a fleet of 6 Tata Hitachi excavators across Bara and Parsa. Parts availability is the real reason we keep coming back — never had to wait more than 48 hours for genuine spares.',
    name: 'Ramesh Patel',
    role: 'Patel Construction Pvt. Ltd.',
  },
  {
    quote:
      'The Shinrai Pro backhoe has been a workhorse for our municipal projects in Biratnagar. Fuel economy and operator comfort are exactly what was promised at the demo.',
    name: 'Sunita Rai',
    role: 'Koshi Civil Works',
  },
  {
    quote:
      'Dugar team delivered our EX-200 to the quarry site in Makwanpur within the committed window. Training for operators was thorough and the after-sales follow-up is genuine.',
    name: 'Dipendra Thapa',
    role: 'Thapa Stone Industries',
  },
  {
    quote:
      'Switched to Tata Hitachi after struggling with imported brands for years. Service network reaches Surkhet within 24 hours — that alone changed how we plan our project timelines.',
    name: 'Anjali Karki',
    role: 'Karnali Builders',
  },
  {
    quote:
      'Our ZW220 wheel loader handles aggregate loading at the crusher day in, day out. Cycle times are noticeably faster than the machine it replaced.',
    name: 'Prakash Maharjan',
    role: 'Bagmati Aggregates',
  },
  {
    quote:
      'Bought two Shinrai backhoes for road maintenance contracts in Lumbini. Operators picked them up in a day — controls are intuitive and the cab keeps the dust out.',
    name: 'Manoj Gurung',
    role: 'Gurung Road Contractors',
  },
]

function Stars() {
  return (
    <div className="flex gap-1 text-[#f37022]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-4 w-4 fill-current"
          aria-hidden
        >
          <path d="M10 1.5l2.6 5.3 5.9.86-4.25 4.14 1 5.86L10 14.9l-5.25 2.76 1-5.86L1.5 7.66l5.9-.86L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <article className="group/card relative flex h-[300px] w-[280px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white p-6 pt-8 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] transition duration-500 ease-out hover:-translate-y-3 hover:shadow-[0_30px_60px_-20px_rgba(243,112,34,0.35)] sm:h-[340px] sm:w-[320px]">
      <span className="absolute inset-x-6 top-0 h-[3px] bg-[#f37022] transition-all duration-500 ease-out group-hover/card:inset-x-0 group-hover/card:h-1" />
      <div className="transition-transform duration-300 ease-out group-hover/card:scale-110 group-hover/card:origin-left">
        <Stars />
      </div>
      <p className="mt-5 font-serif text-sm italic leading-relaxed text-gray-800">
        “{review.quote}”
      </p>
      <div className="mt-6">
        <p className="text-sm font-bold uppercase tracking-wide text-black transition-colors duration-300 group-hover/card:text-[#f37022]">
          {review.name}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#f37022]">
          {review.role}
        </p>
      </div>
    </article>
  )
}

export default function Reviews() {
  // Duplicate so the rightward translateX loop is seamless.
  const loop = [...reviews, ...reviews]

  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* Topographic contour-line background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1600 600"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g stroke="#ebe6d7" strokeWidth="1" fill="none" opacity="0.5">
          <path d="M -50 80 Q 200 20, 420 90 T 880 80 T 1340 60 T 1700 90" />
          <path d="M -50 140 Q 240 80, 460 150 T 920 140 T 1380 120 T 1700 150" />
          <path d="M -50 210 Q 280 140, 500 220 T 960 210 T 1420 190 T 1700 220" />
          <path d="M -50 290 Q 320 220, 540 300 T 1000 290 T 1460 270 T 1700 300" />
          <path d="M -50 380 Q 360 300, 580 390 T 1040 380 T 1500 360 T 1700 390" />
          <path d="M -50 480 Q 400 400, 620 490 T 1080 480 T 1540 460 T 1700 490" />
        </g>
        <g stroke="#f2eddd" strokeWidth="1" fill="none" opacity="0.35">
          <path d="M -50 40 Q 180 -10, 400 50 T 860 40 T 1320 20 T 1700 50" />
          <path d="M -50 260 Q 300 190, 520 270 T 980 260 T 1440 240 T 1700 270" />
          <path d="M -50 440 Q 380 360, 600 450 T 1060 440 T 1520 420 T 1700 450" />
          <path d="M -50 560 Q 420 480, 640 570 T 1100 560 T 1560 540 T 1700 570" />
        </g>
      </svg>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-5 flex items-center justify-center gap-3 text-base font-semibold uppercase tracking-[0.3em] text-[#f37022] md:text-lg">
            <span className="h-px w-8 bg-[#f37022]" />
            What Our Customer Says
            <span className="h-px w-8 bg-[#f37022]" />
          </div>
          <h2 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-6xl">
            Real Reviews.
            <br />
            <span className="font-serif text-4xl font-bold italic normal-case tracking-normal text-[#f37022] md:text-6xl">
              Real operators.
            </span>
          </h2>
        </div>
      </div>

      {/* Marquee track — full bleed, with edge fades */}
      <div className="group relative z-[1] overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

        <div className="flex w-max gap-6 py-10 animate-[marquee-reviews_60s_linear_infinite] group-hover:[animation-play-state:paused]">
          {loop.map((r, i) => (
            <ReviewCard key={`${r.name}-${i}`} review={r} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-[1] mx-auto mt-14 max-w-7xl px-6 text-center">
        <a
          href="#"
          className="group inline-flex items-center gap-3 border-b-2 border-[#f37022] pb-2 text-base font-bold uppercase tracking-[0.2em] text-black transition hover:text-[#f37022] md:text-lg"
        >
          Read all customer stories
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
          >
            ↗
          </span>
        </a>
      </div>
    </section>
  )
}
