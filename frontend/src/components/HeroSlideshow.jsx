import { useState } from 'react'
import heroVideo from '../assets/Shinrai Power- Nepali Language.mp4'
import slide1 from '../assets/WhatsApp Image 2026-06-23 at 9.56.05 AM.jpeg'
import slide2 from '../assets/zaxis 370.png'
import slide3 from '../assets/ex 300 LC prime.jpg'
import slide4 from '../assets/desi-machines-tata-hitachi-excavator-ex200-infra-featured.jpg'
import slide5 from '../assets/ZAXIS 140H Ultra.JPG'
import slide6 from '../assets/ZX220LC Ultra 6.jpg'

const slides = [
  { video: heroVideo },
  { image: slide1 },
  { image: slide2 },
  { image: slide3 },
  { image: slide4 },
  { image: slide5 },
  { image: slide6 },
]

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0)

  return (
    <section className="relative h-screen w-full overflow-hidden text-white">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.video ? (
            <video
              src={slide.video}
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        </div>
      ))}

      {/* Arrows — manual navigation only (no auto-advance) */}
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
