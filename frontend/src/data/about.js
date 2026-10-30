/* About-page copy. Plain data so the React page and the prerender snapshot
 * (scripts/prerender.mjs) say exactly the same thing — the snapshot is what
 * crawlers read, and it must never carry a claim the page does not show.
 *
 * Every figure in AT_A_GLANCE restates a commitment already made elsewhere
 * on the site (FAQ, product pages). Change it there too if it changes.
 */

export const ABOUT_INTRO =
  "Dugar Earthmovers P. Ltd is the authorised Tata Hitachi distributor for Nepal, supplying, servicing, and standing behind the machines that build the country's roads, hydropower, and quarries."

export const STORY = [
  "Dugar Earthmovers Pvt. Ltd. has been a trusted partner in Nepal's construction and infrastructure sector for decades. As the authorized distributor of Tata Hitachi equipment, we provide reliable machinery, genuine spare parts, and dedicated after-sales support to customers across the country.",
  "From road construction and hydropower projects to mining and large-scale development, our equipment helps power the projects that shape Nepal's future. Backed by experienced professionals and a commitment to customer success, we strive to deliver quality, reliability, and long-term value in every partnership.",
  'At Dugar Earthmovers, we believe that strong infrastructure begins with dependable equipment and exceptional service.',
]

export const AT_A_GLANCE = [
  {
    label: 'The range',
    body: 'Tata Hitachi excavators from the compact EX 70 Super for urban trenching to the ZAXIS 650 H for mining and major hydropower work, plus the Shinrai Power backhoe loader built for narrow Nepali sites.',
  },
  {
    label: 'The network',
    body: 'Ten branches across seven provinces: Kathmandu (head office), Biratnagar, Pokhara, Jeetpur, Bardibaas, Nepalgunj, Dhangadi, Surkhet, Dang and Butwal.',
  },
  {
    label: 'Service response',
    body: 'A factory-trained technician can typically be on a project site within 24 to 48 hours anywhere in Nepal. Fleet customers can set up scheduled preventive maintenance.',
  },
  {
    label: 'Genuine parts',
    body: 'Fast-moving genuine Tata Hitachi parts are stocked at our central warehouse with regional stocking in the major work zones. Most orders ship the same day; specialised parts come direct from the factory within 5–10 working days.',
  },
  {
    label: 'Handover',
    body: 'Every machine is commissioned by our own technicians and handed over with structured operator training covering controls, daily inspection routines and safe operating procedure.',
  },
  {
    label: 'Finance',
    body: 'We work with leading banks and financing partners across Nepal to arrange equipment finance, hire purchase and operating leases.',
  },
]

/* Customers whose logos appear on the page. Placeholder logos ("Partner 4")
 * are left out of the text so a crawler never reads a non-name. */
export const PARTNER_NAMES = [
  'Swachchhanda Nirman Sewa',
  'CG Cement',
  'Riddhi Siddhi Cement',
  'Sumo Construction & Engineering',
]

export const TRUST_PILLARS = [
  'Authorised distributor',
  'Factory-trained service',
  'Manufacturer warranty',
  'Genuine parts supply',
]

export const TEAMS = [
  {
    label: 'Sales',
    headline: 'Built around',
    accent: 'the buyer.',
    bio: "Our sales floor pairs technical depth with on-the-ground experience. They walk job sites, talk through applications, and stay involved long after the invoice is signed, because the relationship is the product.",
    capabilities: [
      'Showroom walk-throughs & site visits',
      'Application sizing & spec advice',
      'Finance & delivery coordination',
      'Long-term customer relationships',
    ],
  },
  {
    label: 'Service',
    headline: 'Built to',
    accent: 'stay close.',
    bio: 'Factory-trained, parts-stocked, and always reachable. The service team carries the machine from first commissioning to its tenth season, through warranty work, scheduled servicing, and the late-night calls from remote sites.',
    capabilities: [
      'Factory-trained technicians',
      'Scheduled servicing & warranty',
      'Genuine Tata Hitachi parts',
      'Emergency field response',
    ],
  },
]

export const PROMISE = {
  quote: "We don't disappear after delivery. We stay with the machine.",
  body: "Every machine we deliver is supported by the same team for as long as it's working. The people who answer the call know the machine, the operator, and the project it's on.",
}
