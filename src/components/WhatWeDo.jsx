import excavator from '../assets/650h zaxis.webp'
import backhoe from '../assets/sinrahai pro img.jpg'
import mining from '../assets/zaxis 370.png'
import service from '../assets/Tata_Hitachi_Zaxis_140_H_Side_view_2ac73983e8.webp'
import parts from '../assets/Tata_Hitachi_Zaxis_220_LCM_Side_View_f037a1e7f1.webp'

const cards = [
  {
    number: '01',
    title: 'Excavators',
    description:
      'Mini to mining-class Tata Hitachi excavators built for hydropower, road, and infrastructure work across Nepal.',
    image: excavator,
    featured: true,
  },
  { number: '02', title: 'Backhoe Loaders', image: backhoe },
  { number: '03', title: 'Mining Equipment', image: mining },
  { number: '04', title: 'Service & Maintenance', image: service },
  { number: '05', title: 'Genuine Parts', image: parts },
]

function Card({ card }) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl bg-gray-900 ${
        card.featured ? 'md:row-span-2 min-h-[420px] md:min-h-0' : 'min-h-[240px]'
      }`}
    >
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3
          className={`font-extrabold uppercase tracking-wide text-white ${
            card.featured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
          }`}
        >
          {card.title}
        </h3>
        {card.featured && card.description && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-200 md:text-base">
            {card.description}
          </p>
        )}
      </div>
    </article>
  )
}

export default function WhatWeDo() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <div className="mb-5 flex items-center justify-center gap-3 text-base font-semibold uppercase tracking-[0.3em] text-[#f37022] md:text-lg">
            <span className="h-px w-8 bg-[#f37022]" />
            What We Do
            <span className="h-px w-8 bg-[#f37022]" />
          </div>
          <h2 className="mx-auto max-w-4xl text-4xl font-black uppercase leading-[1.05] tracking-tight text-black md:text-6xl">
            Five specialties.
            <br />
            <span className="font-serif text-4xl font-bold italic normal-case tracking-normal text-[#f37022] md:text-6xl">
              One yard.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:grid-rows-3">
          {cards.map((c) => (
            <Card key={c.number} card={c} />
          ))}
        </div>
      </div>
    </section>
  )
}
