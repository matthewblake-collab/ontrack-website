import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import Nav from './Nav'
import Footer from './Footer'
import ss_11_39_13 from '../assets/screenshots/ss_11_39_13.png'
import ss_13_44_02 from '../assets/screenshots/ss_13_44_02.png'
import ss_13_44_47 from '../assets/screenshots/ss_13_44_47.png'
import ss_11_39_05 from '../assets/screenshots/ss_11_39_05.png'
import ss_11_36_11 from '../assets/screenshots/ss_11_36_11.png'

const TESTFLIGHT_URL = 'https://testflight.apple.com/join/q65zPgbv'
const TESTFLIGHT_APPSTORE = 'https://apps.apple.com/app/testflight/id899247664'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

const walkthroughs = [
  {
    screenshot: ss_11_39_13,
    alt: 'Daily Actions screen',
    title: 'Your day, all in one place.',
    description:
      'Every habit, session, and supplement due today — surfaced in a single clean view. Check things off as you go. Hit 100% and feel it.',
    pills: ['Habits', 'Sessions', 'Supplements', 'Daily Streak'],
    accent: '#e8ff47',
    left: true,
  },
  {
    screenshot: ss_13_44_02,
    alt: 'Wellbeing screen',
    title: 'Know how you\'re actually feeling.',
    description:
      'Log your sleep, energy, and wellbeing in seconds. Over time, patterns emerge — and OnTrack\'s AI surfaces them so you can train and recover smarter.',
    pills: ['Sleep Log', 'Energy Check-in', 'AI Insights', 'Weekly Trends'],
    accent: '#1a9e75',
    left: false,
  },
  {
    screenshot: ss_13_44_47,
    alt: 'Supplements screen',
    title: 'Your stack. Dialled in.',
    description:
      'Build your supplement protocol once. Smart reminders, daily logging, and streak tracking make sure your nutrition is as consistent as your training.',
    pills: ['Smart Reminders', 'Daily Logging', 'Streak Tracking'],
    accent: '#e8ff47',
    left: true,
  },
  {
    screenshot: ss_11_39_05,
    alt: 'Progress screen',
    title: 'Every rep. Every session. Recorded.',
    description:
      'Charts, personal bests, and session history give you the full picture of how far you\'ve come. Every PR logged. Every milestone earned.',
    pills: ['Personal Bests', 'Session History', 'HealthKit Sync'],
    accent: '#1a9e75',
    left: false,
  },
  {
    screenshot: ss_11_36_11,
    alt: 'Groups screen',
    title: 'Your crew keeps you honest.',
    description:
      'Create training groups with friends, track collective consistency, and hold each other accountable. This is where motivation becomes a system.',
    pills: ['Group Streaks', 'Leaderboard', 'Live Feed', 'Shared Accountability'],
    accent: '#e8ff47',
    left: true,
  },
]

function PhoneMockup({ src, alt, accent, i, left }: { src: string; alt: string; accent: string; i: number; left: boolean }) {
  return (
    <motion.div
      className="flex-shrink-0 relative"
      initial={{ opacity: 0, x: left ? 40 : -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, delay: i * 0.05 + 0.1, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
    >
      <div
        className="absolute -inset-4 rounded-[52px] blur-2xl opacity-20 pointer-events-none"
        style={{ background: accent }}
      />
      <div
        className="relative overflow-hidden"
        style={{
          width: 230,
          height: 498,
          borderRadius: 44,
          border: '1.5px solid rgba(255,255,255,0.12)',
          background: '#141414',
          boxShadow: '0 48px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <img src={src} alt={alt} className="absolute inset-0 w-full h-full object-cover" style={{ borderRadius: 44 }} />
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10" style={{ width: 88, height: 26, borderRadius: 20, background: '#000' }} />
        <div className="absolute top-0 left-0 right-0 h-2/5 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)', borderRadius: '44px 44px 0 0' }} />
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-36 h-14 blur-2xl rounded-full pointer-events-none" style={{ background: `${accent}30` }} />
    </motion.div>
  )
}

function WalkthroughRow({ item, i }: { item: typeof walkthroughs[0]; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.75, delay: i * 0.05 }}
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${!item.left ? 'lg:flex-row-reverse' : ''}`}
    >
      <PhoneMockup src={item.screenshot} alt={item.alt} accent={item.accent} i={i} left={item.left} />
      <motion.div
        className="flex-1 max-w-lg"
        initial={{ opacity: 0, x: item.left ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: i * 0.05 + 0.15, ease: 'easeOut' }}
      >
        <h3 className="font-['Syne'] font-bold text-3xl lg:text-[2.6rem] text-white leading-[1.15] mb-5" style={{ letterSpacing: '-0.02em' }}>
          {item.title}
        </h3>
        <p className="font-['DM_Sans'] font-light text-base text-white/45 leading-[1.75] mb-8">
          {item.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.pills.map((pill, j) => (
            <span
              key={j}
              className="font-['DM_Sans'] font-light text-xs px-3.5 py-1.5 rounded-full border"
              style={{
                borderColor: `${item.accent}35`,
                color: `${item.accent}90`,
                background: `${item.accent}0a`,
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <div className="grain-overlay" />
      <Nav />

      {/* SECTION 1 — Hero */}
      <section className="relative min-h-screen flex items-center grid-bg overflow-hidden pt-24 pb-32">
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#e8ff47]/[0.03] blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/60 pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[#e8ff47]/20 bg-[#e8ff47]/[0.05]">
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
                Free on TestFlight · iOS
              </span>
            </div>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-['Syne'] font-bold text-5xl lg:text-7xl text-white mb-6 leading-[1.05]"
            style={{ letterSpacing: '-0.03em' }}
          >
            You're one tap away.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-['DM_Sans'] font-light text-base lg:text-lg text-white/50 leading-relaxed mb-10 max-w-xl mx-auto"
          >
            OnTrack is free on TestFlight. Follow these steps to get started in under 2 minutes.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center gap-4 mb-8"
          >
            <motion.a
              href={TESTFLIGHT_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-[#e8ff47] text-[#0a0a0a] font-['Syne'] font-bold text-base px-8 py-4 rounded-full hover:bg-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Get OnTrack Free
            </motion.a>
            <p className="font-['DM_Sans'] font-light text-sm text-white/30">
              Already have TestFlight? Tap the button above.
            </p>
          </motion.div>

          {/* QR Code — desktop only */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="hidden md:flex flex-col items-center gap-3"
          >
            <div className="p-4 rounded-2xl bg-white inline-block">
              <QRCodeSVG
                value={TESTFLIGHT_URL}
                size={140}
                bgColor="#ffffff"
                fgColor="#0a0a0a"
                level="M"
              />
            </div>
            <p className="font-['DM_Sans'] font-light text-xs text-white/25">
              Scan with your iPhone camera
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />
      </section>

      {/* SECTION 2 — How to install */}
      <section className="relative py-32 lg:py-44 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8ff47]/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#1a9e75]/[0.04] blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
              <span className="font-['DM_Sans'] font-light text-xs text-white/40 tracking-widest uppercase">
                How to Install
              </span>
            </div>
            <h2 className="font-['Syne'] font-bold text-4xl lg:text-5xl text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Up and running in{' '}
              <span className="text-[#e8ff47]">2 minutes.</span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-6">
            {/* Step 1 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="flex gap-6 p-8 rounded-2xl bg-[#111]"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e8ff47] text-[#0a0a0a] font-['Syne'] font-bold text-sm flex items-center justify-center">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-['Syne'] font-bold text-lg text-white mb-2">Download TestFlight</h3>
                <p className="font-['DM_Sans'] font-light text-sm text-white/45 leading-relaxed mb-5">
                  TestFlight is Apple's free app for testing new apps before they hit the App Store. Download it from the App Store first.
                </p>
                <a
                  href={TESTFLIGHT_APPSTORE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-['DM_Sans'] font-light text-sm text-white/70 hover:text-white transition-colors duration-200"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <svg className="w-5 h-5 text-[#e8ff47]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                  Download TestFlight on the App Store
                </a>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.1 } as never}
              className="flex gap-6 p-8 rounded-2xl bg-[#111]"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e8ff47] text-[#0a0a0a] font-['Syne'] font-bold text-sm flex items-center justify-center">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-['Syne'] font-bold text-lg text-white mb-2">Join OnTrack Focus</h3>
                <p className="font-['DM_Sans'] font-light text-sm text-white/45 leading-relaxed mb-5">
                  Tap the button below to open the OnTrack Focus beta in TestFlight.
                </p>
                <motion.a
                  href={TESTFLIGHT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2.5 bg-[#e8ff47] text-[#0a0a0a] font-['Syne'] font-bold text-sm px-6 py-3 rounded-full hover:bg-white transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  Join the Beta
                </motion.a>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.2 } as never}
              className="flex gap-6 p-8 rounded-2xl bg-[#111]"
              style={{ border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e8ff47] text-[#0a0a0a] font-['Syne'] font-bold text-sm flex items-center justify-center">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-['Syne'] font-bold text-lg text-white mb-2">Install and open</h3>
                <p className="font-['DM_Sans'] font-light text-sm text-white/45 leading-relaxed">
                  Tap Install in TestFlight, then Open. Sign up with Apple or email — takes 30 seconds.
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <svg className="w-6 h-6 text-[#e8ff47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — App walkthrough */}
      <section className="relative py-32 lg:py-44 bg-[#0a0a0a] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-28"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
              <span className="font-['DM_Sans'] font-light text-xs text-white/40 tracking-widest uppercase">
                Inside the App
              </span>
            </div>
            <h2 className="font-['Syne'] font-bold text-4xl lg:text-6xl text-white leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Built for people who{' '}
              <span className="text-[#e8ff47]">show up.</span>
            </h2>
          </motion.div>

          <div className="flex flex-col gap-24 lg:gap-36">
            {walkthroughs.map((item, i) => (
              <WalkthroughRow key={i} item={item} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Final CTA */}
      <section className="relative py-32 lg:py-44 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8ff47]/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#e8ff47]/[0.04] blur-[110px] pointer-events-none" />
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
          >
            <h2
              className="font-['Syne'] font-bold text-4xl lg:text-6xl text-white mb-6 leading-tight"
              style={{ letterSpacing: '-0.02em' }}
            >
              Stop waiting for{' '}
              <span className="text-[#e8ff47]">motivation.</span>
            </h2>
            <p className="font-['DM_Sans'] font-light text-base text-white/40 leading-relaxed mb-10 max-w-md mx-auto">
              It's free. It takes 2 minutes. Your future self is watching.
            </p>
            <motion.a
              href={TESTFLIGHT_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-3 bg-[#e8ff47] text-[#0a0a0a] font-['Syne'] font-bold text-base px-8 py-4 rounded-full hover:bg-white transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Get OnTrack Free
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
