import HeroSlideshow from '../components/HeroSlideshow'
import Marquee from '../components/Marquee'
import WhatWeDo from '../components/WhatWeDo'
import OurDivisions from '../components/OurDivisions'
import Reviews from '../components/Reviews'
import Faqs from '../components/Faqs'

export default function Home() {
  return (
    <>
      <HeroSlideshow />
      <Marquee />
      <WhatWeDo />
      <OurDivisions />
      <Reviews />
      <Faqs />
    </>
  )
}
