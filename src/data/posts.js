import excavator from '../assets/Tata_Hitachi_ZAXIS_650_H_4_b67b5d4208.webp'
import serviceImg from '../assets/Tata_Hitachi_Zaxis_140_H_Side_view_2ac73983e8.webp'
import wheelLoader from '../assets/Tata_Hitachi_Shinrai_Power_Over_View_b51f6a79fc.webp'
import backhoe from '../assets/2a28a805-690b-4239-baf1-e3c1ec7be1e6_machanx-628392-application_backhoe_loaders_mbl_745_manitou_006_5UAyddusp.webp'
import mining from '../assets/zaxis 370.png'

export const categories = ['All', 'Equipment', 'Service', 'Projects', 'Operators', 'Industry']

export const posts = [
  {
    slug: 'inside-the-karnali-highway-upgrade',
    issue: 'No. 014',
    category: 'Projects',
    title: 'Inside the Karnali Highway upgrade',
    excerpt:
      'How a fleet of nine ZAXIS-200s and a pair of ZW220 loaders kept the cut-and-fill schedule on time through monsoon season — and what we learned about parts logistics 700 km from Kathmandu.',
    date: '14 Nov 2026',
    readTime: '7 min read',
    author: 'Dugar Earthmovers team',
    image: excavator,
    lead:
      'The Karnali Highway upgrade has been one of the most logistically demanding projects we have supported in recent memory — and one of the most instructive.',
    content: [
      { type: 'p', text: 'With sites spread across 700 km of mountainous terrain and the monsoon arriving on schedule, the project demanded a fleet that could move dirt fast and keep moving when conditions turned. We worked with the lead contractor to size a mixed fleet around cut-and-fill volume, expected cycle times, and the harsh reality of working monsoon weeks into the timeline.' },
      { type: 'h', text: 'The fleet' },
      { type: 'p', text: 'Nine ZAXIS-200 excavators handled the bulk of cut-and-fill work, paired with two ZW220 wheel loaders for material handling at staging points. The 200-class is the workhorse of Nepali infrastructure — the right balance of reach, bucket capacity, and ground pressure for terrain that switches from compacted spoil to soft monsoon clay inside a single shift.' },
      { type: 'h', text: 'Parts logistics, 700 km out' },
      { type: 'p', text: 'The hardest variable was not the machines. It was the distance from our central warehouse in Balaju. We staged a forward parts cache at the project office with the highest-turnover items — hydraulic filters, undercarriage components, common consumables — and reserved 48-hour airfreight for anything specialised. Over the project duration we hit zero unscheduled downtime longer than a single shift.' },
      { type: 'h', text: 'What we would do differently' },
      { type: 'p', text: 'On the next long-distance project we will pre-position a service technician for the first two weeks, not the first month. Operator confidence dropped the moment the deployed tech rotated home; in hindsight a shorter, more concentrated hand-holding period would have delivered the same result with less travel.' },
    ],
  },
  {
    slug: 'speccing-the-right-excavator-for-hydropower',
    issue: 'No. 013',
    category: 'Equipment',
    title: 'Speccing the right excavator for hydropower contracts',
    excerpt:
      'Three things to weigh before you sign the purchase order — and the one variable most fleet buyers underestimate.',
    date: '08 Nov 2026',
    readTime: '5 min read',
    author: 'Dugar Earthmovers team',
    image: wheelLoader,
    lead:
      'Hydropower work in Nepal is unforgiving on equipment. The right machine on day one is the difference between a profitable contract and a year of unscheduled repairs.',
    content: [
      { type: 'p', text: 'Before you sign the purchase order, three numbers matter more than the brochure spec: realistic operating weight against the access roads you will actually use, swing reach against the haul-truck geometry on your site, and ground pressure against the typical sub-base of your work zones. Get those three right and the rest follows.' },
      { type: 'h', text: 'Underestimated: spare-parts proximity' },
      { type: 'p', text: 'The variable most fleet buyers underestimate is parts proximity. A machine that needs a six-week wait for a non-stocked part is not a 30-tonne asset, it is a 30-tonne liability. Before you commit, ask the dealer for the in-country stocking depth for the model you are buying — and the average dispatch time over the last 12 months.' },
      { type: 'h', text: 'Match the machine to the season' },
      { type: 'p', text: 'Most contracts in Nepal have a hard monsoon component. A machine that performs beautifully in dry season may struggle when access roads turn to mud. Track width, undercarriage drainage, and cab ventilation all matter. These are easy to overlook on a showroom visit and expensive to discover on a remote site.' },
    ],
  },
  {
    slug: 'monsoon-readiness-checklist-zaxis',
    issue: 'No. 012',
    category: 'Service',
    title: 'Monsoon-readiness checklist for the ZAXIS series',
    excerpt:
      'Fourteen items our service techs run through before the rains hit. Save your fleet a week of avoidable downtime.',
    date: '02 Nov 2026',
    readTime: '4 min read',
    author: 'Dugar Earthmovers service team',
    image: serviceImg,
    lead:
      'Every year, a few avoidable downtime events happen because monsoon preparation slipped. Here is the checklist our service technicians run before the first rains.',
    content: [
      { type: 'h', text: 'Before the rains' },
      { type: 'list', items: [
        'Inspect all hydraulic hose abrasion points and replace any sleeves showing wear',
        'Drain and refill the hydraulic tank if the last service interval is approaching',
        'Confirm cab door seals are intact and the air filter is clean',
        'Check track tensioning — wet ground accelerates undercarriage wear at the wrong tension',
        'Inspect grease fittings and ensure all are taking grease properly',
        'Test all work lights and beacon lights for sealed-housing integrity',
        'Verify the battery terminals are clean and lightly greased',
      ]},
      { type: 'h', text: 'During the season' },
      { type: 'list', items: [
        'Daily walk-around with attention to tracks, hoses, and the engine bay',
        'Greasing schedule moves from 8-hour to 4-hour intervals on submerged or muddy work',
        'Wash down at end-of-shift to prevent corrosion on exposed metal surfaces',
        'Keep a forward parts kit on site with common consumables',
      ]},
      { type: 'p', text: 'None of this is glamorous. All of it is the difference between scheduled service and a stuck machine on a Sunday. Talk to our service desk if you would like a copy of the full operator-facing checklist for your fleet.' },
    ],
  },
  {
    slug: 'from-day-one-to-expert-operator-training',
    issue: 'No. 011',
    category: 'Operators',
    title: 'From day one to expert — how we train operators',
    excerpt:
      'A walk through the structured handover programme every machine ships with, from controls to safe-shutdown drills.',
    date: '24 Oct 2026',
    readTime: '6 min read',
    author: 'Dugar Earthmovers training team',
    image: backhoe,
    lead:
      'A new machine is only as good as the operator running it. Every delivery includes a structured training programme built around the first 90 days.',
    content: [
      { type: 'h', text: 'Day one — controls and safety' },
      { type: 'p', text: 'The handover begins with cab familiarisation: control layout, monitor readouts, safe start-up and shutdown procedures, and emergency stop drills. Operators leave the first session able to perform a pre-start inspection unsupervised.' },
      { type: 'h', text: 'Week one — productive operation' },
      { type: 'p', text: 'In the first week, our trainer rides with the operator for the first two shifts and observes the next three. The focus is on cycle efficiency, bucket fill, swing economy, and reading the machine\'s feedback — not just running it, but running it well.' },
      { type: 'h', text: 'Month one — independent operation' },
      { type: 'p', text: 'By the end of the first month, the operator is independent, with weekly check-in calls from our team. Daily inspection routines are now habit, and the operator is logging performance data we use to advise on operating-cost optimisation.' },
      { type: 'h', text: 'Beyond' },
      { type: 'p', text: 'Refresher courses and advanced training (precision grading, mining-class operation, attachment changes) are available on request. The cost of a half-day refresher is a fraction of what an avoidable hydraulic repair costs.' },
    ],
  },
  {
    slug: 'mining-class-machines-for-nepal-quarries',
    issue: 'No. 010',
    category: 'Industry',
    title: 'Why mining-class machines belong in Nepal\'s quarries',
    excerpt:
      'Limestone, aggregate, and coal extraction need the right tool. A field comparison of three EX-series setups.',
    date: '18 Oct 2026',
    readTime: '5 min read',
    author: 'Dugar Earthmovers team',
    image: mining,
    lead:
      'Quarrying in Nepal has historically been done with under-specced machines, and the operating cost shows. The EX-series is built for the work.',
    content: [
      { type: 'p', text: 'A mining-class excavator carries the kind of structural reinforcement that quarry work demands. Boom and stick built to take the constant impact of breaker work, undercarriage rated for the abrasive material that comes back into the tracks, and engines tuned for the duty cycle of a continuous quarry shift.' },
      { type: 'h', text: 'The economics' },
      { type: 'p', text: 'The upfront cost of an EX-series is higher than a comparable 20-tonne machine. The total cost per tonne extracted is meaningfully lower when the operating environment is what the machine is built for. We have run the numbers with three different quarry operators in Bagmati and Lumbini provinces, and the break-even sits between 14 and 22 months depending on shift schedule.' },
      { type: 'h', text: 'When it is not the right tool' },
      { type: 'p', text: 'Mining-class is wrong for general earthworks. The cab visibility, manoeuvrability, and access requirements are tuned for stationary extraction work, not road-building or hydropower access. Match the machine to the duty cycle — that is the entire game.' },
    ],
  },
  {
    slug: '48-hour-parts-promise',
    issue: 'No. 009',
    category: 'Service',
    title: 'The 48-hour parts promise — and what it actually takes',
    excerpt:
      'A peek inside our Balaju warehouse and the logistics that move genuine parts to a site within two working days.',
    date: '10 Oct 2026',
    readTime: '4 min read',
    author: 'Dugar Earthmovers parts team',
    image: excavator,
    lead:
      'Saying parts ship in 48 hours is easy. Doing it consistently, across the country, with genuine Tata Hitachi inventory, is a logistics problem most dealers underestimate.',
    content: [
      { type: 'h', text: 'What sits in Balaju' },
      { type: 'p', text: 'Our central warehouse stocks every fast-moving part for every Tata Hitachi model in country. Filters, hoses, undercarriage components, common hydraulic seals, electrical sensors, and the wear parts that come off most often. The list is reviewed quarterly against actual dispatch data.' },
      { type: 'h', text: 'How it gets out' },
      { type: 'p', text: 'For most of Nepal, ground transport hits any project site within 48 hours of dispatch. For remote sites — far-west Karnali, high-altitude hydropower sites — we have airfreight arrangements with the relevant carriers, and pre-staged forward caches at the regional service centres in Biratnagar, Butwal, and Nepalgunj.' },
      { type: 'h', text: 'When it goes longer' },
      { type: 'p', text: 'Specialised parts — boom castings, mining-class hydraulic components, specific factory consumables — come direct from the manufacturer and ship inside a working week. We tell you the realistic window when you call, not the optimistic one.' },
    ],
  },
  {
    slug: 'shinrai-pro-backhoe-for-tight-nepali-sites',
    issue: 'No. 008',
    category: 'Equipment',
    title: 'Shinrai Pro: the backhoe built for tight Nepali sites',
    excerpt:
      'Why municipal contracts and urban infrastructure projects keep specifying the Shinrai Pro over wider machines.',
    date: '02 Oct 2026',
    readTime: '5 min read',
    author: 'Dugar Earthmovers team',
    image: backhoe,
    lead:
      'On urban sites in Kathmandu and Pokhara, machine width is often the constraint. The Shinrai Pro is the answer to that constraint.',
    content: [
      { type: 'p', text: 'A standard backhoe on a Lalitpur municipal contract is a 2.3 metre-wide problem. The Shinrai Pro\'s footprint is narrower, the cab visibility is better, and the operator comfort over an 8-hour shift in a dusty urban site is meaningfully better than competing machines.' },
      { type: 'h', text: 'The work it is built for' },
      { type: 'list', items: [
        'Municipal drainage and pipe-laying contracts',
        'Urban road maintenance and repair',
        'Hydropower distribution work in tight valley sites',
        'Small-to-mid earthworks where access matters',
      ]},
      { type: 'h', text: 'The work it is not' },
      { type: 'p', text: 'It is not a quarry machine. It is not a long-reach excavator. It is a precision tool for the kind of work where a half-metre of extra clearance is the difference between getting the job done and abandoning the site. Match the machine to the work and the Shinrai Pro pays back its purchase price fast.' },
    ],
  },
]
