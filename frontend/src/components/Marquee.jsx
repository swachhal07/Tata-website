const items = [
  'Authorised Tata Hitachi distributor',
  'Kathmandu',
  'Est. 1995',
  '7 provinces served',
  '48-hour parts dispatch',
  'ZAXIS · Shinrai · ZW · EX-series',
]

export default function Marquee() {
  const loop = [...items, ...items, ...items]
  return (
    <section className="overflow-hidden border-y border-black/10 bg-black py-3">
      <div className="flex w-max animate-marquee">
        {loop.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className="flex shrink-0 items-center gap-6 px-6 font-mono text-[11px] uppercase tracking-[0.25em] text-white/90"
          >
            {label}
            <span className="text-[#f37022]">●</span>
          </span>
        ))}
      </div>
    </section>
  )
}
