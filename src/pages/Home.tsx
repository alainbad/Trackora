import HeroSection from '../components/home/HeroSection'
import CarriersSection from '../components/home/CarriersSection'
import FeaturesSection from '../components/home/FeaturesSection'
import HowItWorks from '../components/home/HowItWorks'
import PricingSection from '../components/home/PricingSection'
import CTASection from '../components/home/CTASection'
import { useSEO } from '../hooks/useSEO'

export default function Home() {
  useSEO({
    title:       'Trackora | Free Shipment Tracker — 1,200+ Carriers, Real-Time Results',
    description: 'Track any package, container, or air cargo shipment instantly. Enter any tracking number from FedEx, DHL, UPS, Maersk, MSC, Emirates SkyCargo and 1,200+ more carriers. Real-time results, free forever.',
    canonical:   'https://www.track-ora.com/',
  })

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
