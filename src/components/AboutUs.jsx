import aboutImage from '../assets/Tata_Hitachi_ZAXIS_650_H_4_b67b5d4208.webp'

export default function AboutUs() {
  return (
    <section className="bg-white py-24">
      <div className="px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left — image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img
              src={aboutImage}
              alt="Tata Hitachi equipment on a project site in Nepal"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Right — text */}
          <div>
            <div className="mb-6 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#f37022] md:text-base">
              <span className="h-px w-8 bg-[#f37022]" />
              About Us
            </div>
            <h2 className="text-4xl font-black uppercase leading-[1] tracking-tight text-black md:text-5xl lg:text-6xl">
              A team.{' '}
              <span className="font-serif font-bold italic normal-case tracking-normal text-[#f37022]">
                A craft.
              </span>{' '}
              A Nepal standard.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-gray-600">
              Dugar Earthmovers P. Ltd is Nepal's authorised Tata Hitachi distributor.
              We supply, service, and stand behind every machine that leaves
              our yard — from hydropower access roads in the hills to quarry
              and mining work across the Terai.
            </p>
            <p className="mt-4 text-base leading-relaxed text-gray-600">
              Backed by a country-wide service network and genuine parts,
              we keep our customers' fleets running on every project, every
              shift. We don't disappear after delivery — we stay with the
              machine for the long haul.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
