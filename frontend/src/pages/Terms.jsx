import { Link } from 'react-router-dom'
import Seo from '../seo/Seo'

const UPDATED = '10 August 2026'

const sections = [
  {
    id: '01',
    title: 'Who this site belongs to',
    body: [
      'This website is operated by Dugar Earthmovers P. Ltd, the authorised Tata Hitachi distributor in Nepal. By using the site you accept the terms on this page. If you do not accept them, please do not use the site.',
    ],
  },
  {
    id: '02',
    title: 'Specifications are a guide, not a contract',
    body: [
      'The specifications, images and descriptions on this site are taken from official Tata Hitachi brochures and are published to help you compare machines. Manufacturers change specifications, trim and equipment by year and by market without notice, so figures here may differ from the machine you are actually buying.',
      'Nothing on this site is a quotation or an offer to sell. Prices, availability, delivery dates and the final specification of any machine are confirmed only in a written quotation or sales agreement issued by us. Where this site and a written quotation disagree, the quotation is what counts.',
      'Photographs are illustrative. A machine may be shown with attachments or options that are not part of the standard build.',
    ],
  },
  {
    id: '03',
    title: 'Warranty and service',
    body: [
      'Warranty on new equipment is provided by the manufacturer under the manufacturer’s terms, and is set out in the documents supplied with the machine. Statements on this site about warranty periods or service intervals summarise those terms; they do not replace or extend them.',
      'Service intervals quoted here assume the machine is operated and maintained as the manufacturer specifies, using genuine parts and the specified oils and filters.',
    ],
  },
  {
    id: '04',
    title: 'Enquiries you send us',
    body: [
      'When you send an enquiry through this site, please give us details that are accurate and your own. We use them to answer you, as set out in our Privacy Policy.',
      'Do not use the forms on this site to send abusive content, anything unlawful, or bulk or automated messages.',
    ],
  },
  {
    id: '05',
    title: 'Content on this site',
    body: [
      'The text, photographs, layout and design of this site belong to Dugar Earthmovers P. Ltd unless stated otherwise. You may read, print and share pages for your own use or to evaluate our equipment. You may not republish our content commercially, or copy the site’s design, without our written permission.',
      'Tata Hitachi, the Tata Hitachi logo and machine model names are trademarks of their respective owners and are used here as the authorised distributor. Other company names and logos on this site, including those of our partners, belong to those companies.',
      'Articles on the blog reflect our experience servicing machines in Nepal. They are general guidance, not instructions for a specific machine. Always follow the operator and service manuals for the machine in front of you.',
    ],
  },
  {
    id: '06',
    title: 'Links and embedded services',
    body: [
      'This site links to other websites and embeds maps from third parties. We do not control those services and are not responsible for their content or their terms. Following a link means leaving this site.',
    ],
  },
  {
    id: '07',
    title: 'Availability and accuracy',
    body: [
      'We work to keep this site accurate and available, but we do not guarantee it will be uninterrupted or free of errors. We may change, suspend or withdraw any part of it, including any machine listed, at any time.',
      'To the extent the law allows, we are not liable for loss arising from relying on information published here rather than on a written quotation, a manufacturer brochure, or advice from our staff. Nothing in these terms limits liability that cannot be limited by law.',
    ],
  },
  {
    id: '08',
    title: 'Governing law',
    body: [
      'These terms are governed by the laws of Nepal, and the courts of Nepal have jurisdiction over any dispute arising from this site.',
    ],
  },
  {
    id: '09',
    title: 'Changes to these terms',
    body: [
      'We may update these terms. The current version is always the one on this page, with the date shown at the top.',
    ],
  },
]

export default function Terms() {
  return (
    <main className="bg-white">
      <Seo path="/terms" />
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#f7f5f0] pt-20 pb-14 md:pt-28 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 hidden h-[480px] w-[480px] lg:block"
          style={{
            background:
              'radial-gradient(closest-side, rgba(243,112,34,0.13), transparent 70%)',
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6">
          <div style={{ animation: 'fade-up 0.6s ease-out both' }}>
            <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.32em] text-[#f37022]">
              <span className="h-px w-12 bg-[#f37022]" />
              Terms
            </div>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-6xl">
              Using this site,
              <br />
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                and what it commits us to.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-gray-700">
              The short version: the specs here are a guide to help you compare
              machines. What you actually buy is set by the written quotation we
              issue, and the warranty is the manufacturer's.
            </p>
            <p className="mt-6 font-mono text-[11px] font-bold uppercase tabular-nums tracking-[0.22em] text-gray-500">
              Last updated · {UPDATED}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Terms ────────────────────────────────────────────── */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="space-y-14">
            {sections.map((s) => (
              <section key={s.id}>
                <div className="flex items-baseline gap-4 border-b border-gray-300 pb-4">
                  <span className="font-mono text-xs font-bold tabular-nums tracking-[0.25em] text-[#f37022]">
                    / {s.id}
                  </span>
                  <h2 className="text-xl font-black uppercase leading-[1.1] tracking-tight text-black md:text-2xl">
                    {s.title}
                  </h2>
                </div>
                <div className="mt-6 space-y-5">
                  {s.body.map((p, i) => (
                    <p key={i} className="text-base leading-[1.75] text-gray-700">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 border-t border-gray-300 pt-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#f37022]">
              / Questions
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-3xl">
              Ask before you assume
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-700">
              If a specification matters to your project, ask us to confirm it in
              writing before you order. That is what our sales team is for.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="bg-[#f37022] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#d95f16]"
              >
                Contact page
              </Link>
              <Link
                to="/privacy"
                className="border border-gray-800 bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.24em] text-gray-900 transition-colors hover:border-[#f37022] hover:text-[#f37022]"
              >
                Privacy policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
