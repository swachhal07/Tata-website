import excavator from '../assets/650h zaxis.webp'
import backhoe from '../assets/sinrahai pro img.jpg'
import mining from '../assets/zaxis 370.png'
import service from '../assets/IMG_5286.JPG.jpeg'
import parts from '../assets/IMG_5291.JPG.jpeg'

const cards = [
  { number: '01', title: 'Excavators', image: mining },
  { number: '02', title: 'Backhoe Loaders', image: backhoe },
  { number: '03', title: 'Mining Equipment', image: excavator },
  { number: '04', title: 'Service & Maintenance', image: service },
  { number: '05', title: 'Genuine Parts', image: parts },
]

function Card({ card }) {
  return (
    <article className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-900 md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)]">
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h3 className="text-xl font-extrabold uppercase tracking-wide text-white md:text-2xl">
          {card.title}
        </h3>
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

        <div className="flex flex-wrap justify-center gap-4">
          {cards.map((c) => (
            <Card key={c.number} card={c} />
          ))}
        </div>
      </div>
    </section>
  )
}
