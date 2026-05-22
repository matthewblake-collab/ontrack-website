import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Nav from './components/Nav'
import Hero from './components/Hero'
import MarqueeStrip from './components/MarqueeStrip'
import Mission from './components/Mission'
import Features from './components/Features'
import Download from './components/Download'
import Footer from './components/Footer'
import DownloadPage from './components/DownloadPage'
import PrivacyPage from './components/PrivacyPage'
import TermsPage from './components/TermsPage'
import BlogIndex from './components/blog/BlogIndex'
import BlogPost from './components/blog/BlogPost'

function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <div className="grain-overlay" />
      <Nav />
      <Hero />
      <MarqueeStrip />
      <Mission />
      <Features />
      <Download />
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  )
}
