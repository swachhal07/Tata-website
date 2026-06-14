import { useState } from 'react'

const interests = [
  'Excavators',
  'Backhoe loaders',
  'Wheel loaders',
  'Mining equipment',
  'Service & maintenance',
  'Genuine parts',
  'Operator training',
  'Something else',
]

const offices = [
  { city: 'Jeetpur',    activeFor: 'Service & Parts', coordinator: 'Sahzad Ansari',    phone: '9802919537' },
  { city: 'Biratnagar', activeFor: 'Service & Parts', coordinator: 'Jakir Hussain',    phone: '9801558692' },
  { city: 'Bardibaas',  activeFor: 'Service',         coordinator: 'Jakir Hussain',    phone: '9801558692' },
  { city: 'Kathmandu',  activeFor: 'Service & Parts', coordinator: 'Rupesh Mahato',    phone: '9800018809' },
  { city: 'Nepalgunj',  activeFor: 'Service & Parts', coordinator: 'Rahul Kumar Jha',  phone: '9802573217' },
  { city: 'Dhangadi',   activeFor: 'Service',         coordinator: 'Rahul Kumar Jha',  phone: '9802573217' },
  { city: 'Surkhet',    activeFor: 'Service',         coordinator: 'Rahul Kumar Jha',  phone: '9802573217' },
  { city: 'Dang',       activeFor: 'Service',         coordinator: 'Rahul Kumar Jha',  phone: '9802573217' },
  { city: 'Pokhara',    activeFor: 'Service & Parts', coordinator: 'Dipendra Paudel',  phone: '9802773245' },
  { city: 'Butwal',     activeFor: 'Service',         coordinator: 'Dipendra Paudel',  phone: '9802773245' },
]

function Field({ label, required, children, span = 1 }) {
  return (
    <label className={span === 2 ? 'block md:col-span-2' : 'block'}>
      <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.28em] text-gray-500">
        {label}
        {required && <span className="ml-1 text-[#f37022]">*</span>}
      </span>
      {children}
    </label>
  )
}

const inputClass =
  'block w-full appearance-none rounded-none border-0 border-b border-gray-300 bg-transparent pb-3 text-base text-black placeholder:text-gray-400 transition-colors focus:border-black focus:outline-none focus:ring-0'

function SuccessState({ onReset }) {
  return (
    <div className="flex flex-col items-start py-10">
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center bg-[#f37022]">
        <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-white stroke-[3]" aria-hidden>
          <path d="M5 12l5 5L20 7" strokeLinecap="square" strokeLinejoin="miter" />
        </svg>
      </div>
      <h3 className="text-3xl font-black uppercase leading-[1] tracking-tight text-black md:text-4xl">
        Message received.
      </h3>
      <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
        Our team in Kathmandu will be in touch within one working day. For
        anything urgent — a machine down on site, a part you need today —
        call us directly on the number on the right.
      </p>
      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 border-b-2 border-[#f37022] pb-1 text-xs font-bold uppercase tracking-[0.25em] text-black transition-colors hover:text-[#f37022]"
      >
        Send another
        <span aria-hidden>→</span>
      </button>
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    interest: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 700)
  }

  const reset = () => {
    setStatus('idle')
    setForm({ name: '', company: '', phone: '', email: '', interest: '', message: '' })
  }

  return (
    <main className="bg-white">
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-20 pb-28 md:pt-28 md:pb-36">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 hidden h-[480px] w-[480px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.15), transparent 70%)',
          }}
        />

        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <div style={{ animation: 'fade-up 0.7s ease-out both' }}>
              <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.32em] text-[#f37022] md:text-base">
                <span className="h-px w-12 bg-[#f37022]" />
                Contact us
              </div>
              <h1 className="text-[44px] font-black uppercase leading-[0.92] tracking-[-0.02em] text-black sm:text-6xl md:text-7xl lg:text-[112px]">
                Talk to us.
                <br />
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  We answer.
                </span>
              </h1>
            </div>

            <div
              className="lg:pb-3"
              style={{ animation: 'fade-up 0.7s ease-out 0.15s both' }}
            >
              <div className="mb-5 border-l-2 border-[#f37022] pl-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                  Average reply time
                </p>
                <p className="mt-1 text-2xl font-black tracking-tight text-black">
                  Under 4 working hours
                </p>
              </div>
              <p className="max-w-md text-base leading-relaxed text-gray-700 md:text-lg">
                Whether you're sizing a fleet for a hydropower project,
                booking a service visit, or sourcing genuine parts — our team
                in Kathmandu answers the phone and gets back to you the same day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Form + Info panel ─────────────────────────────────── */}
      <section className="bg-white pb-24">
        <div className="mx-auto -mt-20 max-w-[1400px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
            {/* ── Form card ── */}
            <div
              className="relative bg-white p-8 md:p-12 lg:p-14"
              style={{
                boxShadow: '0 40px 90px -50px rgba(0,0,0,0.35)',
                animation: 'fade-up 0.7s ease-out 0.3s both',
              }}
            >
              <span className="absolute left-0 top-0 h-1 w-24 bg-[#f37022]" />

              {status === 'sent' ? (
                <SuccessState onReset={reset} />
              ) : (
                <>
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                    Send us a note
                  </p>
                  <h2 className="mt-3 text-3xl font-black uppercase leading-[1] tracking-tight text-black md:text-4xl">
                    Tell us about
                    <br />
                    your project.
                  </h2>

                  <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 md:gap-y-9">
                    <Field label="Your name" required>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={update('name')}
                        placeholder="Bishal Shrestha"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Company">
                      <input
                        type="text"
                        value={form.company}
                        onChange={update('company')}
                        placeholder="Himalayan Infra Builders"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Phone" required>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={update('phone')}
                        placeholder="+977 98•••••••"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Email" required>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={update('email')}
                        placeholder="you@company.com"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="What can we help with" required span={2}>
                      <div className="relative">
                        <select
                          required
                          value={form.interest}
                          onChange={update('interest')}
                          className={`${inputClass} pr-8`}
                        >
                          <option value="" disabled>
                            Pick an area…
                          </option>
                          {interests.map((i) => (
                            <option key={i} value={i}>
                              {i}
                            </option>
                          ))}
                        </select>
                        <svg
                          viewBox="0 0 12 8"
                          className="pointer-events-none absolute right-1 top-1.5 h-3 w-3 fill-[#f37022]"
                          aria-hidden
                        >
                          <path d="M0 0h12L6 8z" />
                        </svg>
                      </div>
                    </Field>

                    <Field label="Your message" required span={2}>
                      <textarea
                        required
                        rows={4}
                        value={form.message}
                        onChange={update('message')}
                        maxLength={600}
                        placeholder="Project location, machine you're interested in, timeline, anything we should know…"
                        className={`${inputClass} resize-none pt-2`}
                      />
                      <span className="mt-1 block text-right text-[11px] tabular-nums text-gray-400">
                        {form.message.length}/600
                      </span>
                    </Field>

                    <div className="md:col-span-2 md:flex md:items-center md:justify-between md:gap-8">
                      <p className="text-xs leading-relaxed text-gray-500 md:max-w-sm">
                        By sending this you agree we may contact you about your
                        enquiry. We never share details with third parties.
                      </p>
                      <button
                        type="submit"
                        disabled={status === 'sending'}
                        className="group mt-6 inline-flex items-center gap-4 bg-black px-8 py-5 text-xs font-bold uppercase tracking-[0.28em] text-white transition-colors hover:bg-[#f37022] disabled:cursor-not-allowed disabled:opacity-60 md:mt-0"
                      >
                        {status === 'sending' ? 'Sending…' : 'Send message'}
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3 w-5 transition-transform group-hover:translate-x-1"
                          aria-hidden
                        >
                          <path d="M0 11h20l-6-6 1.4-1.4L24 12l-8.6 8.4L14 19l6-6H0z" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* ── Info panel — black slab ── */}
            <aside
              className="relative self-start bg-black p-8 text-white md:p-10 lg:sticky lg:top-28"
              style={{ animation: 'fade-up 0.7s ease-out 0.4s both' }}
            >
              <span className="absolute left-0 top-0 h-1 w-24 bg-[#f37022]" />

              <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                Reach us directly
              </p>
              <h3 className="mt-3 text-3xl font-black uppercase leading-[1] tracking-tight text-white md:text-4xl">
                Faster?
                <br />
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  Pick up the phone.
                </span>
              </h3>

              {/* Contact rows */}
              <div className="mt-10 space-y-7 border-t border-white/10 pt-8">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Sales
                  </p>
                  <a
                    href="tel:+9779801007228"
                    className="mt-1 block text-xl font-bold text-white transition-colors hover:text-[#f37022]"
                  >
                    +977 9801007228
                  </a>
                  <a
                    href="tel:+9779812010558"
                    className="mt-0.5 block text-xs text-gray-400 transition-colors hover:text-[#f37022]"
                  >
                    Also +977 9812010558
                  </a>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f37022]">
                    Toll Free
                  </p>
                  <a
                    href="tel:+9779801571065"
                    className="mt-1 block text-xl font-bold text-white transition-colors hover:text-[#f37022]"
                  >
                    +977 9801571065
                  </a>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Email
                  </p>
                  <a
                    href="mailto:sales.tatahitachi@mvdugar.com"
                    className="mt-1 block break-all text-base font-medium text-white transition-colors hover:text-[#f37022]"
                  >
                    sales.tatahitachi@mvdugar.com
                  </a>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                    Headquarters
                  </p>
                  <address className="mt-1 text-base not-italic leading-relaxed text-white">
                    MV Dugar Building
                    <br />
                    Balaju, Kathmandu
                    <br />
                    Nepal
                  </address>
                </div>
              </div>

              {/* Hours — control-panel style */}
              <div className="mt-8 border-t border-white/10 pt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500">
                  Hours
                </p>
                <ul className="mt-4 space-y-2.5 text-sm tabular-nums">
                  <li className="flex items-baseline justify-between">
                    <span className="text-white">Sun — Fri</span>
                    <span className="font-bold text-[#f37022]">09:30 — 18:30</span>
                  </li>
                  <li className="flex items-baseline justify-between">
                    <span className="text-gray-500">Saturday</span>
                    <span className="text-gray-500">Closed</span>
                  </li>
                </ul>
              </div>

              {/* Live indicator */}
              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-[#f37022]"
                    style={{ animation: 'status-pulse 2s ease-out infinite' }}
                  />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#f37022]" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-white">
                  Sales desk online now
                </span>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ─── Showroom map ──────────────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
                <span className="h-px w-10 bg-[#f37022]" />
                Find us
              </div>
              <h3 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl">
                Our showroom.{' '}
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  In Kathmandu.
                </span>
              </h3>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-600 sm:text-right">
              On the ring road in Balaju, north Kathmandu. Walk-ins welcome
              during business hours — or call ahead to schedule a meeting
              with our sales team.
            </p>
          </div>

          <div className="relative overflow-hidden border border-gray-200">
            <span className="pointer-events-none absolute left-0 top-0 z-10 h-1 w-32 bg-[#f37022]" />
            <iframe
              title="Dugar Earthmovers Pvt. Ltd. showroom location, Kathmandu"
              src="https://maps.google.com/maps?q=27.7300363,85.3020595&hl=en&z=17&output=embed"
              width="100%"
              height="520"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, display: 'block' }}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=27.7300363,85.3020595"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-gray-800 bg-white px-7 py-4 text-xs font-bold uppercase tracking-[0.28em] text-gray-900 transition-colors hover:border-[#f37022] hover:bg-[#f37022] hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm5.5 7-5 9-2-4-4-2 11-3z" />
              </svg>
              Get directions on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ─── Service network ───────────────────────────────────── */}
      <section className="border-t border-gray-200 bg-[#f7f5f0] py-24">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="mb-14 grid grid-cols-1 items-end gap-8 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <div className="mb-5 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
                <span className="h-px w-10 bg-[#f37022]" />
                Our network
              </div>
              <h3 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-5xl">
                On the ground.
                <br />
                <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                  Across Nepal.
                </span>
              </h3>
            </div>
            <p className="max-w-xl text-base leading-relaxed text-gray-700 lg:justify-self-end lg:text-right">
              Service centres and field-deployable technicians in every major
              region. A machine on site is never more than a day's reach from
              help — wherever you're working.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px overflow-hidden border border-gray-300 bg-gray-300 md:grid-cols-3 lg:grid-cols-5">
            {offices.map((o, i) => (
              <div
                key={o.city}
                className="group relative flex flex-col bg-[#f7f5f0] p-6 transition-colors hover:bg-white"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-[11px] font-bold tabular-nums tracking-[0.2em] text-[#f37022]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-gray-400 transition-colors group-hover:text-[#f37022]">
                    NP
                  </span>
                </div>
                <p className="text-xl font-black uppercase leading-none tracking-tight text-black">
                  {o.city}
                </p>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500">
                  {o.activeFor}
                </p>
                <div className="mt-auto pt-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-400">
                    Coordinator
                  </p>
                  <p className="mt-1 text-sm font-bold leading-tight text-black">
                    {o.coordinator}
                  </p>
                  <a
                    href={`tel:+977${o.phone}`}
                    className="mt-1 inline-block text-sm font-mono tabular-nums tracking-tight text-gray-700 transition-colors hover:text-[#f37022]"
                  >
                    {o.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-gray-300 pt-8 sm:flex-row sm:items-center">
            <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
              Need help reaching a remote site?
            </p>
            <a
              href="tel:+9779801007228"
              className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-black transition-colors hover:text-[#f37022]"
            >
              Call dispatch · +977 9801007228
              <span aria-hidden className="transition-transform group-hover:translate-x-1">↗</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
