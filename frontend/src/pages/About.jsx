import { useEffect, useState } from 'react'
import storySlide1 from '../assets/WhatsApp Image 2026-06-14 at 1.13.27 PM.jpeg'
import storySlide2 from '../assets/WhatsApp Image 2026-06-14 at 1.19.34 PM.jpeg'
import storySlide3 from '../assets/WhatsApp Image 2026-06-14 at 1.19.35 PM.jpeg'
import storySlide4 from '../assets/WhatsApp Image 2026-06-14 at 1.19.355PM.jpeg'
import logo1 from '../assets/1.png'
import logo2 from '../assets/2.png'
import logoCgCement from '../assets/demo-cg-cement-logo-colored.png'
import logo4 from '../assets/4.png'
import logo5 from '../assets/5.png'
import logo6 from '../assets/6.png'
import mvDugarLogo from '../assets/MVDUGAR-01.png'
import salesTeamPhoto from '../assets/WhatsApp Image 2026-06-17 at 3.32.19 PM.jpeg'
import serviceTeamPhoto1 from '../assets/WhatsApp Image 2026-06-17 at 3.21.21 PM.jpeg'
import serviceTeamPhoto2 from '../assets/WhatsApp Image 2026-06-19 at 4.32.52 PM.jpeg'
import boardMotiLal from '../assets/af0b8ecf-4ddc-41f9-9dd1-ba5c0df1b212.webp'
import boardVivek from '../assets/ae68fbad-4028-45aa-81d5-44d526f4f5af.webp'
import boardShubham from '../assets/af5ea000-e8c5-4f03-ac64-9fd3a8bb8009.webp'
import boardNaman from '../assets/eb7eb529-8d15-4359-8ac0-df51b7393d00.webp'

const storySlides = [storySlide1, storySlide2, storySlide3, storySlide4]

const partnerLogos = [
  { src: logo1, alt: 'Swachchhanda Nirman Sewa', invert: true },
  { src: logoCgCement, alt: 'CG Cement', invert: false },
  { src: logo4, alt: 'Partner 4', invert: false },
  { src: logo2, alt: 'Riddhi Siddhi Cement', invert: true },
  { src: logo5, alt: 'Partner 5', invert: false },
  { src: logo6, alt: 'Partner 6', invert: false },
]

const trustPillars = [
  { label: 'Authorised distributor' },
  { label: 'Factory-trained service' },
  { label: 'Manufacturer warranty' },
  { label: 'Genuine parts supply' },
]

const boardDirectors = [
  {
    numeral: 'I',
    name: 'Moti Lal Dugar',
    role: 'Chairman',
    tagline: '',
    photo: boardMotiLal,
  },
  {
    numeral: 'II',
    name: 'Vivek Dugar',
    role: 'Vice Chairman',
    tagline: '',
    photo: boardVivek,
  },
  {
    numeral: 'III',
    name: 'Shubham Dugar',
    role: 'Director',
    tagline: '',
    photo: boardShubham,
  },
  {
    numeral: 'IV',
    name: 'Naman Dugar',
    role: 'Director',
    tagline: '',
    photo: boardNaman,
  },
]

const teamGroups = [
  {
    number: '01',
    label: 'Sales',
    headline: 'Built around',
    accent: 'the buyer.',
    photos: [salesTeamPhoto],
    caption: 'Kathmandu showroom · 2026',
    bio: "Our sales floor pairs technical depth with on-the-ground experience. They walk job sites, talk through applications, and stay involved long after the invoice is signed — because the relationship is the product.",
    capabilities: [
      'Showroom walk-throughs & site visits',
      'Application sizing & spec advice',
      'Finance & delivery coordination',
      'Long-term customer relationships',
    ],
  },
  {
    number: '02',
    label: 'Service',
    headline: 'Built to',
    accent: 'stay close.',
    photos: [serviceTeamPhoto1, serviceTeamPhoto2],
    caption: 'Service centre · 2026',
    bio: 'Factory-trained, parts-stocked, and always reachable. The service team carries the machine from first commissioning to its tenth season — through warranty work, scheduled servicing, and the late-night calls from remote sites.',
    capabilities: [
      'Factory-trained technicians',
      'Scheduled servicing & warranty',
      'Genuine Tata Hitachi parts',
      'Emergency field response',
    ],
  },
]

function TeamPhoto({ photos, label, number }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (photos.length <= 1) return
    const id = setInterval(
      () => setIdx((i) => (i + 1) % photos.length),
      4500
    )
    return () => clearInterval(id)
  }, [photos.length])

  return (
    <div className="group relative aspect-[4/3] overflow-hidden bg-black/5">
      {photos.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${label} team ${i + 1}`}
          className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1200ms] ease-out group-hover:scale-[1.02]"
          style={{ opacity: i === idx ? 1 : 0 }}
        />
      ))}
      <span className="absolute left-0 top-0 z-10 h-1 w-20 bg-[#f37022]" />
      <div className="absolute bottom-0 right-0 z-10 bg-white px-4 py-2">
        <span className="font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.3em] text-black">
          / {number} · {label}
        </span>
      </div>
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-4 z-10 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`h-1 w-7 transition-colors ${
                i === idx ? 'bg-[#f37022]' : 'bg-white/70 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function About() {
  const [storyIndex, setStoryIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setStoryIndex((i) => (i + 1) % storySlides.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

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
              <div className="mb-6 flex items-stretch gap-0">
                <div className="w-1 bg-[#f37022]" />
                <img
                  src={mvDugarLogo}
                  alt="MV Dugar Group"
                  className="-mx-6 h-20 w-auto self-center md:h-24"
                />
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
                {storySlides.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
                      i === storyIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                ))}
                <span className="absolute left-0 top-0 z-10 h-1 w-32 bg-[#f37022]" />
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
      <section className="relative overflow-hidden bg-black pt-12 pb-24 text-white md:pt-16 md:pb-32">
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-16 text-center">
            <div className="mb-5 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
              <span className="h-px w-10 bg-[#f37022]" />
              Trusted Partners
              <span className="h-px w-10 bg-[#f37022]" />
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-6xl">
              Working with
              <br />
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                Nepal's best.
              </span>
            </h2>
          </div>
        </div>

        {/* Scrolling partner logos — full-bleed, left-to-right */}
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee-partners items-center py-8 [animation-direction:reverse]">
            {[...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div
                key={i}
                className="flex h-48 w-56 shrink-0 items-center justify-center md:h-60 md:w-72 lg:h-72 lg:w-96"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  className={`max-h-full max-w-full object-contain ${logo.invert ? 'brightness-0 invert' : ''}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
            {trustPillars.map((p, i) => (
              <div
                key={p.label}
                className="bg-black p-6 md:p-7"
                style={{ animation: `fade-up 0.6s ease-out ${0.08 * i}s both` }}
              >
                <p className="font-mono text-[10px] font-bold tabular-nums tracking-[0.25em] text-[#f37022]">
                  / 0{i + 1}
                </p>
                <p className="mt-3 whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] text-white md:text-sm">
                  {p.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Board of Directors ──────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 top-10 hidden h-[480px] w-[480px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.08), transparent 70%)',
          }}
        />

        {/* Atmospheric wordmark across the bottom — family name */}
        <span
          aria-hidden
          className="pointer-events-none absolute -bottom-6 left-0 right-0 select-none text-center font-serif text-[24vw] font-black italic leading-none tracking-tight text-black/[0.045] md:-bottom-12 md:text-[20vw]"
        >
          Dugar.
        </span>

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-12 max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
              <span className="h-px w-10 bg-[#f37022]" />
              Board of Directors
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl lg:text-6xl">
              Steady hands.{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                The long view.
              </span>
            </h2>
          </div>

          {/* Annual-report style ribbon */}
          <div className="mb-12 flex flex-col items-center gap-2 border-y border-black/15 py-3 font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.3em] text-gray-600 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-x-5 sm:gap-y-0 md:text-[11px]">
            <div className="flex w-full items-center gap-5">
              <span>Est. 1995</span>
              <span className="hidden h-px flex-1 bg-black/15 sm:block" />
            </div>
            <span className="text-black">
              Three Generations
            </span>
            <div className="flex w-full items-center gap-5">
              <span className="hidden h-px flex-1 bg-black/15 sm:block" />
              <span className="sm:ml-auto">Dugar Earthmovers</span>
            </div>
          </div>

          {/* THE GALLERY WALL — one unified composition */}
          <div className="group/wall relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {boardDirectors.map((d, i) => {
                const parts = d.name.split(' ')
                const surname = parts.pop()
                const firstNames = parts.join(' ')

                return (
                  <article
                    key={d.numeral}
                    className="group/card relative"
                    style={{ animation: `fade-up 0.8s ease-out ${0.12 * i}s both` }}
                  >
                    {/* ── Portrait ───────────────────────────── */}
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#1a1714]">
                      {d.photo ? (
                        <img
                          src={d.photo}
                          alt={d.name}
                          className="absolute inset-0 h-full w-full object-cover object-[50%_28%] transition-[transform,filter] duration-[1400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover/wall:scale-100 group-hover/wall:brightness-50 group-hover/wall:saturate-50 group-hover/card:!brightness-100 group-hover/card:!saturate-100 group-hover/card:scale-[1.06]"
                          style={{ transformOrigin: 'center 38%' }}
                        />
                      ) : (
                        <>
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0"
                            style={{
                              background:
                                'linear-gradient(135deg, #efe9dd 0%, #e6dfd0 60%, #ddd5c3 100%)',
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              aria-hidden
                              className="select-none font-serif font-black italic leading-none text-black/[0.10]"
                              style={{
                                fontSize: 'clamp(120px, 18vw, 220px)',
                                letterSpacing: '-0.04em',
                              }}
                            >
                              {d.numeral}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Vignette — fades in on the active card */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 ease-out group-hover/card:opacity-100"
                        style={{
                          background:
                            'radial-gradient(ellipse at center 38%, transparent 48%, rgba(0,0,0,0.42) 100%)',
                        }}
                      />

                      {/* Orange interior frame — emerges on hover */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-4 z-10 border border-[#f37022] opacity-0 transition-opacity duration-500 ease-out group-hover/card:opacity-100 md:inset-6"
                      />

                      {/* Bottom orange hairline — sweeps in on the active card */}
                      <span
                        aria-hidden
                        className="absolute bottom-0 left-0 z-20 h-[2px] w-0 bg-[#f37022] transition-[width] duration-700 ease-out group-hover/card:w-full"
                      />
                    </div>

                    {/* ── Calling card typography ────────────── */}
                    <div className="relative px-5 py-7 transition-opacity duration-500 group-hover/wall:opacity-50 group-hover/card:!opacity-100 md:px-7 md:py-9">
                      {/* Orange tick — top, extends on hover */}
                      <span
                        aria-hidden
                        className="absolute left-5 top-0 h-1 w-12 bg-[#f37022] transition-[width] duration-500 ease-out group-hover/card:w-28 md:left-7"
                      />

                      {/* Mono caps: numeral · role */}
                      <p className="font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.3em] text-gray-500">
                        {d.numeral} <span className="mx-1 text-[#f37022]">·</span> {d.role}
                      </p>

                      {/* First names — italic serif */}
                      <p className="mt-5 font-serif text-2xl italic leading-[1] text-black md:text-3xl">
                        {firstNames}
                      </p>

                      {/* DUGAR — bold uppercase family seal */}
                      <h3 className="mt-1 text-3xl font-black uppercase leading-[0.95] tracking-[-0.01em] text-black md:text-[42px]">
                        {surname}
                      </h3>

                      {/* Subtle baseline rule */}
                      <span
                        aria-hidden
                        className="mt-6 block h-px w-full bg-black/15 transition-[background-color] duration-500 group-hover/card:bg-[#f37022]/40"
                      />
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Meet our team ───────────────────────────────────── */}
      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-16 max-w-3xl">
            <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
              <span className="h-px w-10 bg-[#f37022]" />
              Our team
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl lg:text-6xl">
              The people behind{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                the machines.
              </span>
            </h2>
          </div>

          <div className="space-y-24 md:space-y-32">
            {teamGroups.map((g, i) => {
              const isReversed = i % 2 === 1
              return (
                <article
                  key={g.label}
                  className="relative"
                  style={{ animation: `fade-up 0.7s ease-out ${0.1 * i}s both` }}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute -top-6 z-0 select-none font-serif text-[180px] font-black italic leading-none text-black/[0.04] md:-top-10 md:text-[260px] lg:text-[320px] ${
                      isReversed ? 'left-0' : 'right-0'
                    }`}
                  >
                    {g.number}
                  </span>

                  <div className="relative z-10 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                    <figure
                      className={`lg:col-span-6 ${isReversed ? 'lg:order-2' : ''}`}
                    >
                      <TeamPhoto photos={g.photos} label={g.label} number={g.number} />
                      <figcaption className="mt-3 font-mono text-[10px] font-bold uppercase tabular-nums tracking-[0.3em] text-gray-500">
                        {g.caption}
                      </figcaption>
                    </figure>

                    <div
                      className={`lg:col-span-6 ${isReversed ? 'lg:order-1' : ''}`}
                    >
                      <div className="mb-7 flex items-center gap-3 font-mono text-xs font-bold uppercase tabular-nums tracking-[0.3em] text-[#f37022] md:text-sm">
                        <span>Team / {g.number}</span>
                        <span className="h-px flex-1 bg-[#f37022]/40" />
                      </div>

                      <h3 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl lg:text-[60px]">
                        {g.headline}{' '}
                        <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                          {g.accent}
                        </span>
                      </h3>

                      <p className="mt-7 text-lg leading-relaxed text-gray-700 md:text-xl">
                        {g.bio}
                      </p>

                      <ul className="mt-10 border-t border-black/10">
                        {g.capabilities.map((c, j) => (
                          <li
                            key={c}
                            className="flex items-baseline gap-5 border-b border-black/10 py-4"
                          >
                            <span className="font-mono text-xs font-bold tabular-nums tracking-[0.25em] text-[#f37022]">
                              / {String(j + 1).padStart(2, '0')}
                            </span>
                            <span className="text-base font-medium uppercase tracking-[0.06em] text-black md:text-lg">
                              {c}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              )
            })}
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
