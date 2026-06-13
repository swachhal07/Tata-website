import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import slide1 from '../assets/tata-hitachi-shinrai-pro-backhoe-loader.jpg'
import slide2 from '../assets/zaxis 370.png'
import slide3 from '../assets/ex 300 LC prime.jpg'
import slide4 from '../assets/desi-machines-tata-hitachi-excavator-ex200-infra-featured.jpg'

const slides = [
  { image: slide1 },
  { image: slide2 },
  { image: slide3 },
  { image: slide4 },
]

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden text-white">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        </div>
      ))}

      {slides[index].title && (
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="max-w-2xl">
            {slides[index].eyebrow && (
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-tata-red">
                {slides[index].eyebrow}
              </p>
            )}
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              {slides[index].title}
              {slides[index].highlight && (
                <>
                  <br />
                  <span className="text-tata-red">{slides[index].highlight}</span>
                </>
              )}
            </h1>
            {slides[index].subtitle && (
              <p className="mt-6 max-w-lg text-lg text-gray-200">
                {slides[index].subtitle}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="rounded-full bg-tata-red px-6 py-3 font-semibold shadow-lg hover:bg-red-700"
              >
                Explore Products
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/40 px-6 py-3 font-semibold backdrop-blur hover:bg-white/10"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Arrows */}
      <button
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </section>
  )
}
