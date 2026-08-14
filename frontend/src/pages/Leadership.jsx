import { useEffect, useMemo, useState } from 'react'
import Seo from '../seo/Seo'
import { seedPeople, photoFor } from '../data/people'

/* The roster is managed from the admin console (`/admin/people`) and
 * served by `GET /api/people`; the bundled seed is the fallback. */
function useTeam() {
  const [people, setPeople] = useState(seedPeople)

  useEffect(() => {
    let cancelled = false
    fetch('/api/people')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('bad response'))))
      .then((d) => {
        if (!cancelled && Array.isArray(d.people) && d.people.length) setPeople(d.people)
      })
      .catch(() => {
        /* keep the seed roster */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return useMemo(
    () => ({
      boardDirectors: people.filter((p) => p.kind === 'board'),
      managementTeam: people.filter((p) => p.kind === 'management'),
    }),
    [people],
  )
}

function range(items) {
  return items.length ? `01 - ${String(items.length).padStart(2, '0')}` : '-'
}

function splitName(name) {
  const parts = name.split(' ')
  const surname = parts.pop()
  return { first: parts.join(' '), surname }
}

function initials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function PersonCard({ person, index, delay }) {
  const { first, surname } = splitName(person.name)
  const photo = photoFor(person)
  return (
    <article
      className="group relative overflow-hidden bg-[#1a1714] shadow-[0_22px_45px_-26px_rgba(60,40,20,0.55)] ring-1 ring-black/5"
      style={{ animation: `fade-up 0.6s ease-out ${delay}s both` }}
    >
      <div className="relative aspect-[3/4]">
        {photo ? (
          <img
            src={photo}
            alt={person.name}
            className="absolute inset-0 h-full w-full object-cover object-[50%_20%] brightness-[0.92] transition-[transform,filter] duration-[900ms] ease-out group-hover:scale-[1.05] group-hover:brightness-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none text-7xl font-black tracking-tight text-white/10 transition-colors duration-500 group-hover:text-[#f37022]/25 md:text-8xl">
              {initials(person.name)}
            </span>
          </div>
        )}

        {/* Bottom gradient for legibility */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(18,14,10,0.94) 0%, rgba(18,14,10,0.45) 34%, rgba(18,14,10,0) 62%)',
          }}
        />

        {/* Index numeral */}
        <span className="absolute right-4 top-4 font-mono text-[11px] font-bold tabular-nums tracking-[0.2em] text-white/45 transition-colors duration-500 group-hover:text-[#f37022]">
          {index}
        </span>

        {/* Top orange hairline draws in on hover */}
        <span
          aria-hidden
          className="absolute left-0 top-0 z-10 h-[3px] w-0 bg-[#f37022] transition-[width] duration-500 ease-out group-hover:w-full"
        />

        {/* Name plate */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-7">
          <div className="mb-3 flex items-center gap-2">
            <span className="h-px w-6 bg-[#f37022] transition-[width] duration-500 ease-out group-hover:w-12" />
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#f37022] md:text-[11px]">
              {person.role}
            </p>
          </div>
          <p className="font-serif text-lg italic leading-[1] text-white/80 md:text-xl">
            {first}
          </p>
          <h3 className="mt-0.5 text-2xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-[28px]">
            {surname}
          </h3>
          <span
            aria-hidden
            className="mt-3 block h-px w-0 bg-[#f37022]/70 transition-[width] duration-700 ease-out group-hover:w-16"
          />
        </div>
      </div>
    </article>
  )
}

function SectionIntro({ kicker, lead, accent, range }) {
  return (
    <div className="relative mb-14">
      <div className="relative">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
              <span className="h-px w-10 bg-[#f37022]" />
              {kicker}
            </div>
            <h2 className="text-4xl font-black uppercase leading-[0.92] tracking-tight text-black md:text-5xl lg:text-6xl">
              {lead}{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                {accent}
              </span>
            </h2>
          </div>
          <span className="hidden font-mono text-[11px] font-bold tabular-nums tracking-[0.25em] text-gray-400 sm:block">
            {range}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function Leadership() {
  const { boardDirectors, managementTeam } = useTeam()

  return (
    <main className="bg-white">
      <Seo path="/leadership" />
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-24 pb-20 md:pt-32 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.14), transparent 72%)',
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
          <div
            className="flex flex-col items-center text-center"
            style={{ animation: 'fade-up 0.7s ease-out both' }}
          >
            <div className="mb-7 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.32em] text-[#f37022] md:text-base">
              <span className="h-px w-12 bg-[#f37022]" />
              Leadership
              <span className="h-px w-12 bg-[#f37022]" />
            </div>
            <h1 className="text-[44px] font-black uppercase leading-[0.92] tracking-[-0.02em] text-black sm:text-6xl md:text-7xl lg:text-[96px]">
              Meet the people.
              <br />
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                Behind it all.
              </span>
            </h1>
            <p className="mt-9 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
              Five generations of family leadership have guided Dugar
              Earthmovers from a single dealership into Nepal's trusted Tata
              Hitachi partner, with the same long-term view that has defined
              the business since 2020.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Gallery stage (Board + Management) ────────────────── */}
      <div className="relative overflow-hidden bg-white">
        {/* Board of Directors */}
        <section className="relative z-10 py-24 md:py-32">
          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionIntro
              kicker="Board of Directors"
              lead="Guided by"
              accent="family."
              range={range(boardDirectors)}
            />
            <div className="grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
              {boardDirectors.map((d, i) => (
                <PersonCard
                  key={d.id ?? d.name}
                  person={d}
                  index={String(i + 1).padStart(2, '0')}
                  delay={0.08 * i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Management Team */}
        <section className="relative z-10 pb-24 md:pb-32">
          <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12">
            <SectionIntro
              kicker="Management Team"
              lead="Running the"
              accent="day-to-day."
              range={range(managementTeam)}
            />
            <div className="mx-auto grid max-w-3xl grid-cols-2 gap-5 sm:gap-6">
              {managementTeam.map((m, i) => (
                <PersonCard
                  key={m.id ?? m.name}
                  person={m}
                  index={String(i + 1).padStart(2, '0')}
                  delay={0.08 * i}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
