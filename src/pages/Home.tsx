import HeroSection from '../components/home/HeroSection'
import CarriersSection from '../components/home/CarriersSection'
import FeaturesSection from '../components/home/FeaturesSection'
import HowItWorks from '../components/home/HowItWorks'
import PricingSection from '../components/home/PricingSection'
import CTASection from '../components/home/CTASection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CarriersSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <CTASection />
    </main>
  )
}
