import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Track from './pages/Track'
import Dashboard from './pages/Dashboard'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import CarrierPage from './pages/CarrierPage'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import FAQ from './pages/FAQ'
import Plans from './pages/Plans'
import Contact from './pages/Contact'
import Rates from './pages/Rates'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import { AuthProvider } from './contexts/AuthContext'
import { ProfileProvider } from './contexts/ProfileContext'

// Scrolls to #features / #pricing anchors (React Router doesn't do this on its own),
// and scrolls to top on normal route changes.
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

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: '#0a0f1e', color: '#f8fafc', width: '100%', overflowX: 'hidden' }}>
          <ScrollManager />
          <Navbar />
          <Routes>
            <Route path="/"                   element={<Home />} />
            <Route path="/track"              element={<Track />} />
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
            <Route path="/rates"             element={<Rates />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  )
}
