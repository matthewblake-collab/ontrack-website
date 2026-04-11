import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-0.5 group">
          <span className="font-['Syne'] font-bold text-xl tracking-tight text-white transition-opacity duration-200 group-hover:opacity-80">
            On
          </span>
          <span className="font-['Syne'] font-bold text-xl tracking-tight text-[#e8ff47] transition-opacity duration-200 group-hover:opacity-80">
            Track
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {['About', 'Features'].map((item) => (
            <a
              key={item}
              href={`/#${item.toLowerCase()}`}
              className="relative font-['DM_Sans'] font-light text-sm text-white/55 hover:text-white transition-colors duration-200 tracking-wide group"
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#e8ff47]/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
            </a>
          ))}
          <Link
            to="/download"
            className="relative font-['DM_Sans'] font-light text-sm text-white/55 hover:text-white transition-colors duration-200 tracking-wide group"
          >
            Download
            <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-[#e8ff47]/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/download">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="inline-block font-['Syne'] font-bold text-sm bg-[#e8ff47] text-[#0a0a0a] px-5 py-2.5 rounded-full hover:bg-white transition-colors duration-200 tracking-tight cursor-pointer"
            >
              Get the App
            </motion.span>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white/70 hover:text-white p-1 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-[5px]">
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-px bg-current origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block h-px bg-current"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-px bg-current origin-center"
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/[0.06]"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {['About', 'Features'].map((item, i) => (
                <motion.a
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  href={`/#${item.toLowerCase()}`}
                  className="font-['DM_Sans'] font-light text-base text-white/70 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <Link
                  to="/download"
                  className="font-['DM_Sans'] font-light text-base text-white/70 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Download
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.2 }}
              >
                <Link
                  to="/download"
                  className="block font-['Syne'] font-bold text-sm bg-[#e8ff47] text-[#0a0a0a] px-5 py-3 rounded-full text-center hover:bg-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Get the App
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
