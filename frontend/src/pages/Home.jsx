import HeroSlideshow from '../components/HeroSlideshow'
import Marquee from '../components/Marquee'
import WhatWeDo from '../components/WhatWeDo'
import OurDivisions from '../components/OurDivisions'
import Reviews from '../components/Reviews'
import Faqs, { faqs } from '../components/Faqs'
import Seo from '../seo/Seo'
import { faqSchema } from '../seo/structuredData'

export default function Home() {
  return (
    <>
      <Seo path="/" jsonLd={faqSchema(faqs)} />
      <HeroSlideshow />
      <Marquee />
      <WhatWeDo />
      <OurDivisions />
      <Reviews />
      <Faqs />
    </>
  )
}
