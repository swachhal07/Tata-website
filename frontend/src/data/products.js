import excavator from '../assets/650h zaxis.webp'
import compact from '../assets/zaxis 140.jpg'
import backhoe from '../assets/desi-machines-tata-hitachi-shinrai-power-cev-featured-image.jpg'
import zaxis220 from '../assets/Tata_Hitachi_Zaxis_220_LCM_Side_View_f037a1e7f1.webp'
import mining from '../assets/zaxis 370.png'
import ex70 from '../assets/EX 70 Super.webp'
import ex130 from '../assets/EX 130.jpg'
import ex210 from '../assets/EX 210 LC prime.webp'
import ex300 from '../assets/ex 300 LC prime.jpg'
import ex215 from '../assets/lq 215.jpg'

import pdf650h from '../assets/zaxis-650h-brochure.pdf'
import pdf140 from '../assets/zaxis140-ultra-feb-24.pdf'
import pdf220lc from '../assets/ZAXIS-220LC-Ultra_Brochure.pdf'
import pdf370lch from '../assets/zaxis-370lch-ultra_brochure-compressed.pdf'
import pdfShinrai from '../assets/shinrai-power-brochure.pdf'
import pdfEx70 from '../assets/ex70-super-new.pdf'
import pdfEx130 from '../assets/EX130 Prime-tunnel-excavator.pdf'
import pdfEx210 from '../assets/EX210LC Prime E 4 page.pdf'
import pdfEx300 from '../assets/ex-350lc-prime-brochure-.pdf'
import pdfEx215 from '../assets/EX-215LCQ-Prime.pdf'

export const categories = [
  { id: 'excavators', label: 'Excavators', count: 9 },
  { id: 'mining', label: 'Mining', count: 3 },
  { id: 'backhoes', label: 'Backhoe loaders', count: 1 },
]

export const products = [
  {
    cat: 'excavators',
    tags: ['mining'],
    code: 'ZAXIS-650H',
    name: 'ZAXIS 650 H',
    series: 'Large excavator · Workhorse class',
    intro:
      'Our flagship excavator. Built for the heaviest cut-and-fill, mining-class work, and the hardest hydropower contracts.',
    specs: [
      { label: 'Operating weight', value: '58.3 t' },
      { label: 'Engine power', value: '400 HP' },
      { label: 'Bucket capacity', value: '3.8 m³' },
      { label: 'Max digging depth', value: '7.08 m' },
      { label: 'Fuel tank', value: '740 L' },
      { label: 'Track class', value: 'Heavy duty' },
    ],
    applications: ['Mining', 'Hydropower', 'Major earthworks', 'Quarry'],
    image: excavator,
    pdf: pdf650h,
  },
  {
    cat: 'excavators',
    tags: ['mining'],
    code: 'ZAXIS-370LCH',
    name: 'ZAXIS 370 LCH Ultra',
    series: 'Mining-class excavator · Quarry Ultra series',
    intro:
      'The pit machine. Reinforced structure, dedicated duty-cycle hydraulics, undercarriage rated for continuous extraction in quarry conditions.',
    specs: [
      { label: 'Operating weight', value: '37.5 t' },
      { label: 'Engine power', value: '290 HP' },
      { label: 'Bucket capacity', value: '2.1 m³' },
      { label: 'Max digging depth', value: '7.5 m' },
      { label: 'Fuel tank', value: '630 L' },
      { label: 'Duty cycle', value: 'Continuous' },
    ],
    applications: ['Mining', 'Coal', 'Limestone', 'Aggregate extraction'],
    image: mining,
    pdf: pdf370lch,
  },
  {
    cat: 'excavators',
    code: 'ZAXIS-220LC',
    name: 'ZAXIS 220 LC',
    series: 'Medium excavator · Long crawler',
    intro:
      'The site workhorse. Extended undercarriage for stability on uneven ground — the most-deployed machine on infrastructure contracts across Nepal.',
    specs: [
      { label: 'Operating weight', value: '22.4 t' },
      { label: 'Engine power', value: '175 HP' },
      { label: 'Bucket capacity', value: '1.1 m³' },
      { label: 'Max digging depth', value: '6.8 m' },
      { label: 'Fuel tank', value: '420 L' },
      { label: 'Track class', value: 'Long crawler' },
    ],
    applications: ['Infrastructure', 'Road construction', 'Hydropower', 'Earthworks'],
    image: zaxis220,
    pdf: pdf220lc,
  },
  {
    cat: 'excavators',
    code: 'ZAXIS-140H',
    name: 'ZAXIS 140 H',
    series: 'Medium excavator · Versatile class',
    intro:
      'The go-to mid-class machine. Tight enough for road work, capable enough for site development across Nepal.',
    specs: [
      { label: 'Operating weight', value: '13.8 t' },
      { label: 'Engine power', value: '115 HP' },
      { label: 'Bucket capacity', value: '0.70 m³' },
      { label: 'Max digging depth', value: '5.8 m' },
      { label: 'Fuel tank', value: '240 L' },
      { label: 'Track class', value: 'Standard' },
    ],
    applications: ['Road construction', 'Site development', 'Utilities'],
    image: compact,
    pdf: pdf140,
  },
  {
    cat: 'excavators',
    tags: ['mining'],
    code: 'EX-350-LCPRIME',
    name: 'EX 350 LC Prime',
    series: 'Large excavator · LC Prime series',
    intro:
      'Heavy-class excavator built for major earthworks and demanding infrastructure projects. The LC Prime undercarriage delivers stability on rough ground without sacrificing reach.',
    specs: [
      { label: 'Operating weight', value: '30.0 t' },
      { label: 'Engine power', value: '230 HP' },
      { label: 'Bucket capacity', value: '1.5 m³' },
      { label: 'Max digging depth', value: '7.2 m' },
      { label: 'Fuel tank', value: '560 L' },
      { label: 'Track class', value: 'LC Prime' },
    ],
    applications: ['Major earthworks', 'Hydropower', 'Heavy lift', 'Quarry'],
    image: ex300,
    pdf: pdfEx300,
  },
  {
    cat: 'excavators',
    code: 'EX-215',
    name: 'EX 215',
    series: 'Medium excavator · Infra-duty class',
    intro:
      'The 22-tonne workhorse for infrastructure contracts. Balanced reach, fuel economy, and undercarriage rated for the daily punishment of road and site work.',
    specs: [
      { label: 'Operating weight', value: '22.0 t' },
      { label: 'Engine power', value: '175 HP' },
      { label: 'Bucket capacity', value: '1.02 m³' },
      { label: 'Max digging depth', value: '6.8 m' },
      { label: 'Fuel tank', value: '420 L' },
      { label: 'Track class', value: 'Long crawler' },
    ],
    applications: ['Infrastructure', 'Road construction', 'Site development', 'Earthworks'],
    image: ex215,
    pdf: pdfEx215,
  },
  {
    cat: 'excavators',
    code: 'EX-210-LCPRIME',
    name: 'EX 210 LC Prime',
    series: 'Medium-large excavator · LC Prime series',
    intro:
      'The Prime series 20-tonne machine. Reinforced boom and stick, improved hydraulic response, and the LC Prime undercarriage for the long haul.',
    specs: [
      { label: 'Operating weight', value: '21.5 t' },
      { label: 'Engine power', value: '175 HP' },
      { label: 'Bucket capacity', value: '1.05 m³' },
      { label: 'Max digging depth', value: '6.8 m' },
      { label: 'Fuel tank', value: '420 L' },
      { label: 'Track class', value: 'LC Prime' },
    ],
    applications: ['Hydropower', 'Infrastructure', 'Earthworks', 'Site development'],
    image: ex210,
    pdf: pdfEx210,
  },
  {
    cat: 'excavators',
    code: 'EX-130',
    name: 'EX 130',
    series: 'Medium excavator · Standard class',
    intro:
      'A workhorse 13-tonne machine. Reliable, fuel-efficient, and built for the everyday earthworks that make up most contracts in Nepal.',
    specs: [
      { label: 'Operating weight', value: '12.8 t' },
      { label: 'Engine power', value: '76 HP' },
      { label: 'Bucket capacity', value: '0.65 m³' },
      { label: 'Max digging depth', value: '2.72 m' },
      { label: 'Swing speed', value: '13.8 rpm' },
      { label: 'Fuel tank', value: '250 L' },
    ],
    applications: ['Road construction', 'Site development', 'Drainage', 'Utilities'],
    image: ex130,
    pdf: pdfEx130,
  },
  {
    cat: 'excavators',
    code: 'EX-70-SUPER',
    name: 'EX 70 Super',
    series: 'Compact excavator · Super series',
    intro:
      'The compact specialist. Narrow enough for trenching and urban work, capable enough to outwork any machine in its weight class.',
    specs: [
      { label: 'Operating weight', value: '7.0 t' },
      { label: 'Engine power', value: '55 HP' },
      { label: 'Bucket capacity', value: '0.30 m³' },
      { label: 'Max digging depth', value: '4.66 m' },
      { label: 'Fuel tank', value: '135 L' },
      { label: 'Track class', value: 'Compact' },
    ],
    applications: ['Trenching', 'Utilities', 'Landscaping', 'Urban'],
    image: ex70,
    pdf: pdfEx70,
  },
  {
    cat: 'backhoes',
    code: 'SHINRAI-POWER',
    name: 'Shinrai Power',
    series: 'Backhoe loader · Multi-purpose',
    intro:
      'Built narrow for Nepali urban sites. The workhorse for municipal contracts, drainage, and utility infrastructure.',
    specs: [
      { label: 'Operating weight', value: '7.8 t' },
      { label: 'Engine power', value: '99 HP' },
      { label: 'Bucket capacity', value: '1.1 m³' },
      { label: 'Max digging depth', value: '5.7 m' },
      { label: 'Fuel tank', value: '135 L' },
      { label: 'Transmission', value: '4F / 4R' },
    ],
    applications: ['Municipal', 'Urban', 'Utilities', 'Drainage'],
    image: backhoe,
    pdf: pdfShinrai,
  },
]
