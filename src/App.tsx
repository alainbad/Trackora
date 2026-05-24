import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Track from './pages/Track'
import Dashboard from './pages/Dashboard'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen" style={{ background: '#0a0f1e', color: '#f8fafc' }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<Track />} />
          <Route path="/track/:trackingId" element={<Track />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
