import { useState } from 'react'

const faqs = [
  {
    q: 'What warranty comes with a new Tata Hitachi machine?',
    a: 'Every new machine ships with a standard manufacturer warranty covering structural components and major hydraulic systems. Extended warranty packages are available — speak to your Dugar sales contact for the option that fits your fleet usage.',
  },
  {
    q: 'How do I schedule a service visit?',
    a: 'Call our service desk or submit a request through the contact form on this site. Our team will dispatch a technician to your site, typically within 24–48 hours anywhere in Nepal. Scheduled preventive maintenance can be set up on a calendar basis for fleet customers.',
  },
  {
    q: 'Are genuine Tata Hitachi spare parts stocked in Nepal?',
    a: 'Yes. We carry a full inventory of fast-moving genuine parts at our central warehouse, with regional stocking in major work zones. Most orders ship the same day; specialised parts are sourced direct from the factory within 5–10 working days.',
  },
  {
    q: 'Do you offer financing or lease options?',
    a: 'We work with leading banks and financing partners across Nepal to structure equipment finance, hire purchase, and operating lease arrangements. Our team can help you compare options based on project tenure and cash flow.',
  },
  {
    q: 'Where are your service centres located?',
    a: 'Our headquarters is in Kathmandu, with branch service centres and field-deployable technician teams covering Biratnagar, Bharatpur, Butwal, Nepalgunj, and Surkhet. For remote project sites, on-site service can be arranged.',
  },
  {
    q: 'Is operator training included at the time of delivery?',
    a: 'Yes. Every machine handover includes structured operator training covering controls, daily inspection routines, and safe operating procedures. Refresher and advanced training programmes are available on request.',
  },
]

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        aria-expanded={isOpen}
      >
        <span
          className={`text-base font-bold tracking-tight transition-colors md:text-lg ${
            isOpen ? 'text-[#f37022]' : 'text-black'
          }`}
        >
          {faq.q}
        </span>
        <span
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? 'rotate-45 border-[#f37022] bg-[#f37022] text-white'
              : 'border-gray-400 text-gray-600 group-hover:border-[#f37022] group-hover:bg-[#f37022] group-hover:text-white'
          }`}
          aria-hidden
        >
          <svg viewBox="0 0 14 14" className="h-3 w-3 fill-current">
            <path d="M6 0h2v14H6z M0 6h14v2H0z" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-all duration-400 ease-out ${
          isOpen ? 'grid-rows-[1fr] pb-6 opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function Faqs() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="bg-[#f7f5f0] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          {/* Left — heading */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="mb-5 flex items-center gap-3 text-lg font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-xl">
              <span className="h-px w-10 bg-[#f37022]" />
              Got Questions?
            </div>
            <h2 className="text-5xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-6xl">
              Let's clear
              <br />
              it up.
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-gray-600">
              Straight answers to what Nepal's contractors, fleet owners, and
              operators ask us most often.
            </p>
            <a
              href="tel:+9779801007228"
              className="group mt-8 inline-flex items-center gap-3 bg-black px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#f37022]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
                aria-hidden
              >
                <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57-.35-.11-.74-.03-1.02.24l-2.2 2.2a15.05 15.05 0 0 1-6.59-6.59l2.2-2.2c.27-.27.36-.66.24-1.02A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
              </svg>
              Still unsure? Just call: +977 9801007228
            </a>
          </div>

          {/* Right — accordion */}
          <div className="border-t border-gray-200">
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.q}
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
