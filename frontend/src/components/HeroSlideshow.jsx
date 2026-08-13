import { useEffect, useRef, useState } from 'react'
import heroVideo from '../assets/hero.mp4'
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
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)

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
        >
          {slide.video ? (
            <>
              <video
                ref={videoRef}
                src={slide.video}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-full w-full object-cover scale-[1.35]"
              />
              <div className="absolute bottom-10 left-1/2 z-20 -translate-x-1/2">
                <button
                  onClick={toggleMute}
                  className="rounded-full bg-white/20 px-6 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30 transition-colors"
                >
                  {isMuted ? 'Tap to Unmute' : 'Mute'}
                </button>
              </div>
            </>
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

      {/* Arrows - manual navigation only (no auto-advance) */}
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
