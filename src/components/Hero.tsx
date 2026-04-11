import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import heroCenter from '../assets/screenshots/ss_11_39_13.png'
import heroLeft from '../assets/photos/matt_skierg.png'
import heroRight from '../assets/screenshots/ss_13_44_47.png'
import heroBg from '../assets/photos/matt_skierg.png'

const stats = [
  { value: 'Free', label: 'On TestFlight' },
  { value: '1 app', label: 'Habits · Supps · Groups' },
  { value: 'iOS', label: 'App Store coming soon' },
]

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden grid-bg"
    >
      {/* Background photo — parallax, faded, grayscale */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          y: bgY,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          filter: 'grayscale(1)',
          opacity: 0.15,
          willChange: 'transform',
        }}
      />

      {/* Radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#e8ff47]/[0.025] blur-[140px]" />
        {/* Teal radial glow behind phones */}
        <div
          className="absolute top-1/2 right-[8%] -translate-y-1/2 pointer-events-none"
          style={{
            width: 500,
            height: 500,
            background: 'radial-gradient(circle, rgba(26,158,117,0.15) 0%, transparent 70%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-40 pb-32 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

          {/* Left: copy */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[#e8ff47]/20 bg-[#e8ff47]/[0.05]"
            >
              <span className="relative flex h-2 w-2">
                <motion.span
                  className="absolute inline-flex h-full w-full rounded-full bg-[#1a9e75]"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ opacity: 0.6 }}
                />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#1a9e75]" />
              </span>
              <span className="font-['DM_Sans'] font-light text-xs text-[#e8ff47]/80 tracking-widest uppercase">
                Now on iOS · TestFlight Live
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeUp}
              className="font-['Syne'] text-5xl lg:text-7xl leading-[1.05] text-white mb-6"
              style={{ fontWeight: 600, letterSpacing: '-0.03em' }}
            >
              The group that
              <br />
              won't let you{' '}
              <span className="shimmer-text">quit.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="font-['DM_Sans'] font-light text-base lg:text-lg text-white/50 leading-relaxed mb-10 max-w-lg lg:max-w-none"
            >
              Habits, supplements, group sessions, and daily check-ins — with a social layer
              built to keep you honest. Whether you've been at it for years or you're finally ready to start.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-20"
            >
              <motion.a
                href="https://testflight.apple.com/join/q65zPgbv"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group flex items-center gap-3 bg-[#e8ff47] text-[#0a0a0a] font-['Syne'] font-bold text-sm px-7 py-4 rounded-full accent-glow transition-colors duration-200 hover:bg-white"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Try Free on TestFlight
              </motion.a>
              <motion.a
                href="/#features"
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 font-['DM_Sans'] font-light text-sm text-white/50 hover:text-white transition-colors duration-200 px-2 py-4"
              >
                See what's inside
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={fadeUp}
              className="flex items-center gap-10 justify-center lg:justify-start"
            >
              {stats.map((s, i) => (
                <div key={i} className="text-center lg:text-left">
                  <p className="font-['Syne'] font-bold text-2xl text-white">{s.value}</p>
                  <p className="font-['DM_Sans'] font-light text-xs text-white/40 tracking-wide mt-1">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: phone mockups */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
            className="flex-shrink-0 relative w-full lg:w-auto flex justify-center"
          >
            <div className="relative h-[520px] w-[340px]">

              {/* Back phone — left, rotated -8deg */}
              <motion.div
                className="absolute left-0 top-10 phone-mockup opacity-50"
                style={{ width: 160, height: 346, borderRadius: 44, rotate: -8 }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={heroLeft}
                  alt="OnTrack athlete training"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ borderRadius: 44 }}
                />
              </motion.div>

              {/* Front phone — center */}
              <motion.div
                className="absolute left-1/2 top-0 -translate-x-1/2 phone-mockup z-10"
                style={{ width: 195, height: 422, borderRadius: 44 }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <img
                  src={heroCenter}
                  alt="OnTrack daily actions screen"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ borderRadius: 44 }}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none"
                  style={{ borderRadius: '44px 44px 0 0' }}
                />
              </motion.div>

              {/* Back phone — right, rotated 8deg */}
              <motion.div
                className="absolute right-0 top-16 phone-mockup opacity-50"
                style={{ width: 160, height: 346, borderRadius: 44, rotate: 8 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <img
                  src={heroRight}
                  alt="OnTrack supplements screen"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ borderRadius: 44 }}
                />
              </motion.div>

              {/* Accent glow beneath phones */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-20 bg-[#e8ff47]/[0.08] blur-3xl rounded-full" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
    </section>
  )
}
