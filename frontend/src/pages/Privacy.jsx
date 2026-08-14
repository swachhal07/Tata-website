import { Link } from 'react-router-dom'
import Seo from '../seo/Seo'

const UPDATED = '10 August 2026'

const sections = [
  {
    id: '01',
    title: 'What we collect',
    body: [
      'When you fill in an enquiry form on this site, we collect the details you type into it: your name, company, phone number, email address, the equipment or service you are asking about, and your message. When you request a brochure, we collect your name, phone number and email so we can send it and follow up.',
      'We do not ask for financial details on this website. We never ask for card numbers, bank details or passwords by email, and we will not do so over the phone either. If someone claiming to be from us asks for those, it is not us.',
    ],
  },
  {
    id: '02',
    title: 'Why we hold it',
    body: [
      'Enquiry details are used to answer your enquiry: quoting a machine, arranging a demo, sourcing a part, or booking a service visit. Our sales and service staff in the relevant branch see them so the person nearest you can respond.',
      'We may keep a record of past enquiries so that when you come back to us about the same machine or project, you are not starting from scratch.',
    ],
  },
  {
    id: '03',
    title: 'Who else sees it',
    body: [
      'We do not sell your details, and we do not share them with advertisers or data brokers.',
      'Enquiries are delivered to us by email, so our email provider handles them in transit. This site is hosted by Vercel and its data is stored with MongoDB Atlas and Cloudinary. Where a machine enquiry needs manufacturer involvement, such as a warranty question, we may share the relevant details with Tata Hitachi.',
    ],
  },
  {
    id: '04',
    title: 'What this site loads from elsewhere',
    body: [
      'The office map is a Google Maps embed, and the branch network map draws its map tiles from CARTO and OpenStreetMap. When those load, your browser contacts those services directly and they will see your IP address, as they would on any site that embeds a map.',
      'We do not run advertising trackers or third-party analytics scripts on this site.',
    ],
  },
  {
    id: '05',
    title: 'Cookies',
    body: [
      'This site sets no cookies for visitors. There is a single cookie used by our own staff to stay signed in to the admin console, and it is only set after someone logs in there.',
    ],
  },
  {
    id: '06',
    title: 'How long we keep it',
    body: [
      'Enquiries are kept while they are useful for serving you and for our own records of what was quoted or serviced. If you want your details removed from our records, ask us and we will remove them, unless we are required to keep something for warranty, tax or legal reasons.',
    ],
  },
  {
    id: '07',
    title: 'Your say over your details',
    body: [
      'Write to us and you can ask what we hold about you, ask us to correct anything wrong, ask us to delete it, or tell us to stop contacting you. A phone call works too. We will not make you jump through hoops for it.',
    ],
  },
  {
    id: '08',
    title: 'Changes to this policy',
    body: [
      'If how we handle enquiry details changes, we will update this page and change the date at the top. This policy applies to this website. It does not cover other sites we link to, which have their own policies.',
    ],
  },
]

export default function Privacy() {
  return (
    <main className="bg-white">
      <Seo path="/privacy" />
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
              Privacy
            </div>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-[-0.02em] text-black md:text-6xl">
              Your details,
              <br />
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                and what we do with them.
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-relaxed text-gray-700">
              Plainly: we collect what you type into an enquiry form, we use it
              to answer that enquiry, and we do not sell it to anyone.
            </p>
            <p className="mt-6 font-mono text-[11px] font-bold uppercase tabular-nums tracking-[0.22em] text-gray-500">
              Last updated · {UPDATED}
            </p>
          </div>
        </div>
      </section>

      {/* ─── Policy ───────────────────────────────────────────── */}
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

          {/* Contact for privacy questions */}
          <div className="mt-16 border-t border-gray-300 pt-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#f37022]">
              / Reaching us about this
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-3xl">
              Ask us anything about your details
            </h2>
            <div className="mt-6 space-y-2 text-base text-gray-700">
              <p>Dugar Earthmovers P. Ltd, authorised Tata Hitachi distributor in Nepal</p>
              <p>
                <a
                  href="mailto:sales.tatahitachinp@gmail.com"
                  className="underline underline-offset-4 transition-colors hover:text-[#f37022]"
                >
                  sales.tatahitachinp@gmail.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+9779802591430"
                  className="tabular-nums underline underline-offset-4 transition-colors hover:text-[#f37022]"
                >
                  +977 9802591430
                </a>
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-8 inline-block bg-[#f37022] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-[#d95f16]"
            >
              Contact page
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
