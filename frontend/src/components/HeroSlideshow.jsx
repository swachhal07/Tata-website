import { useEffect, useRef, useState } from 'react'
import heroVideo from '../assets/hero-loop.mp4'
import heroPoster from '../assets/hero-poster.jpg'
import slide1 from '../assets/WhatsApp Image 2026-06-23 at 9.56.05 AM.jpeg'
import slide2 from '../assets/zaxis 370.png'
import slide3 from '../assets/ex 300 LC prime.jpg'
import slide4 from '../assets/desi-machines-tata-hitachi-excavator-ex200-infra-featured.jpg'
import slide5 from '../assets/ZAXIS 140H Ultra.JPG'
import slide6 from '../assets/ZX220LC Ultra 6.jpg'

const slides = [
  { video: heroVideo, alt: 'Tata Hitachi excavators at work on a project site in Nepal' },
  { image: slide1, alt: 'Tata Hitachi excavator on a Dugar Earthmovers project site in Nepal' },
  { image: slide2, alt: 'Tata Hitachi ZAXIS 370 LCH Ultra mining excavator working a quarry face' },
  { image: slide3, alt: 'Tata Hitachi EX 350 LC Prime excavator on a major earthworks contract' },
  { image: slide4, alt: 'Tata Hitachi EX 200 infrastructure excavator loading material' },
  { image: slide5, alt: 'Tata Hitachi ZAXIS 140 H excavator on a road construction site' },
  { image: slide6, alt: 'Tata Hitachi ZAXIS 220 LC Ultra long-crawler excavator at work' },
]

export default function HeroSlideshow() {
  const [index, setIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(true)
  /* Slides are fetched only once they have been shown at least once. Slide 0
   * (the video) plus its immediate neighbour start loading straight away; the
   * rest wait for the operator to actually navigate to them. Without this the
   * browser pulls every slide on first paint. */
  const [loaded, setLoaded] = useState(() => new Set([0, 1]))
  const videoRef = useRef(null)

  /* Navigation is the only thing that changes the slide, so widening the
   * loaded set here (rather than in an effect on `index`) keeps the fetch
   * exactly one render ahead of what the operator can see. */
  const goTo = (next) => {
    setIndex(next)
    setLoaded((prev) => {
      const grown = new Set(prev)
      grown.add(next)
      grown.add((next + 1) % slides.length)
      return grown
    })
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const tryUnmute = () => {
      if (!video) return
      video.muted = false
      const p = video.play()
      if (p !== undefined) {
        p.then(() => setIsMuted(false)).catch(() => {
          video.muted = true
          setIsMuted(true)
        })
      }
    }
    tryUnmute()

    const unmuteOnInteraction = () => {
      tryUnmute()
      cleanup()
    }
    const cleanup = () => {
      window.removeEventListener('click', unmuteOnInteraction)
      window.removeEventListener('touchstart', unmuteOnInteraction)
      window.removeEventListener('keydown', unmuteOnInteraction)
      window.removeEventListener('scroll', unmuteOnInteraction)
      window.removeEventListener('mousemove', unmuteOnInteraction)
    }
    window.addEventListener('click', unmuteOnInteraction)
    window.addEventListener('touchstart', unmuteOnInteraction)
    window.addEventListener('keydown', unmuteOnInteraction)
    window.addEventListener('scroll', unmuteOnInteraction)
    window.addEventListener('mousemove', unmuteOnInteraction)

    return cleanup
  }, [])

  const toggleMute = () => {
    const video = videoRef.current
    const next = !isMuted
    setIsMuted(next)
    if (video) video.muted = next
  }

  return (
    <section className="relative h-[calc(100vh-61px)] w-full overflow-hidden text-white md:h-[calc(100vh-81px)]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== index}
        >
          {slide.video ? (
            <>
              <video
                ref={videoRef}
                src={slide.video}
                poster={heroPoster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label={slide.alt}
                className="h-full w-full object-cover scale-[1.35]"
              />
              <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2">
                <button
                  onClick={toggleMute}
                  className="rounded-full bg-white/20 px-6 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30 transition-colors"
                >
                  {isMuted ? 'Tap to Unmute' : 'Mute'}
                </button>
              </div>
            </>
          ) : loaded.has(i) ? (
            <img
              src={slide.image}
              alt={slide.alt}
              loading={i <= 1 ? 'eager' : 'lazy'}
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        </div>
      ))}

      {/* The hero is deliberately image-only. The page still needs exactly one
          h1, so it lives here for assistive tech and crawlers rather than on
          screen — the wording matches what the sections below actually say. */}
      <h1 className="sr-only">
        Tata Hitachi in Nepal — Dugar Earthmovers, authorised distributor for
        excavators, backhoe loaders, mining equipment, genuine parts and service
      </h1>

      {/* Arrows - manual navigation only (no auto-advance) */}
      <button
        onClick={() => goTo((index - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => goTo((index + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur hover:bg-white/20"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </section>
  )
}
