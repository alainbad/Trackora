import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useIsNativeApp } from './hooks/useIsNativeApp'
import Home from './pages/Home'
import Track from './pages/Track'
import Dashboard from './pages/Dashboard'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import CarrierPage from './pages/CarrierPage'
import FreightLandingPage from './pages/FreightLandingPage'
import LufthansaCargoPage from './pages/LufthansaCargoPage'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import FAQ from './pages/FAQ'
import Plans from './pages/Plans'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'

const Rates = lazy(() => import('./pages/Rates'))
const CustomsDuty = lazy(() => import('./pages/CustomsDuty'))
const DetentionCalc = lazy(() => import('./pages/DetentionCalc'))
const ProfitCalc = lazy(() => import('./pages/ProfitCalc'))
const PortLandingPage = lazy(() => import('./pages/PortLandingPage'))
const DocumentGenerator = lazy(() => import('./pages/DocumentGenerator'))
const Tools = lazy(() => import('./pages/Tools'))

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
  function HomeOrTrack() {
  const isNative = useIsNativeApp()
  return isNative ? <Navigate to="/track" replace /> : <Home />
}
export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: '#0a0f1e', color: '#f8fafc', width: '100%', overflowX: 'hidden' }}>
          <ScrollManager />
          <Navbar />
          <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
            <Routes>
              <Route path="/"                   element={<HomeOrTrack />} />
              <Route path="/track"              element={<Track />} />
              <Route path="/tools"               element={<Tools />} />
              <Route path="/document-generator"  element={<DocumentGenerator />} />
              <Route path="/ports/jebel-ali-dubai"    element={<PortLandingPage type="port" slug="jebel-ali-dubai" />} />
              <Route path="/ports/rotterdam"          element={<PortLandingPage type="port" slug="rotterdam" />} />
              <Route path="/ports/singapore"          element={<PortLandingPage type="port" slug="singapore" />} />
              <Route path="/ports/shanghai"           element={<PortLandingPage type="port" slug="shanghai" />} />
              <Route path="/ports/antwerp-bruges"     element={<PortLandingPage type="port" slug="antwerp-bruges" />} />
              <Route path="/airports/dubai-dxb"       element={<PortLandingPage type="airport" slug="dubai-dxb" />} />
              <Route path="/airports/frankfurt-fra"   element={<PortLandingPage type="airport" slug="frankfurt-fra" />} />
              <Route path="/airports/london-heathrow" element={<PortLandingPage type="airport" slug="london-heathrow" />} />
              <Route path="/airports/singapore-sin"   element={<PortLandingPage type="airport" slug="singapore-sin" />} />
              <Route path="/airports/hong-kong-hkg"   element={<PortLandingPage type="airport" slug="hong-kong-hkg" />} />
              <Route path="/air-cargo/lufthansa-cargo-tracking" element={<LufthansaCargoPage />} />
              <Route path="/tracking/020" element={<Navigate to="/air-cargo/lufthansa-cargo-tracking" replace />} />
              <Route path="/track/bill-of-lading" element={<FreightLandingPage pageKey="bol" />} />
              <Route path="/track/container"      element={<FreightLandingPage pageKey="container" />} />
              <Route path="/track/sea-freight"    element={<FreightLandingPage pageKey="sea-freight" />} />
              <Route path="/track/ocean-freight"  element={<FreightLandingPage pageKey="ocean-freight" />} />
              <Route path="/track/dhl"            element={<FreightLandingPage pageKey="dhl" />} />
              <Route path="/track/:trackingId"  element={<Track />} />
              <Route path="/dashboard"          element={<Dashboard />} />
              <Route path="/privacy"            element={<Privacy />} />
              <Route path="/terms"              element={<Terms />} />
              <Route path="/about"              element={<About />} />
              <Route path="/how-it-works"       element={<HowItWorks />} />
              <Route path="/carriers/:slug"     element={<CarrierPage />} />
              <Route path="/blog"               element={<Blog />} />
              <Route path="/blog/:slug"         element={<BlogPost />} />
              <Route path="/faq"                element={<FAQ />} />
              <Route path="/plans"              element={<Plans />} />
              <Route path="/contact"            element={<Contact />} />
              <Route path="/rates"              element={<Rates />} />
              <Route path="/customs-duty"       element={<CustomsDuty />} />
              <Route path="/detention-calculator" element={<DetentionCalc />} />
              <Route path="/profit-calculator"  element={<ProfitCalc />} />
              <Route path="*"                   element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  )
}
