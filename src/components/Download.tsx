import { motion } from 'framer-motion'
import downloadBg from '../assets/photos/matt_skierg.png'

const platforms = [
  {
    name: 'iOS',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    status: 'Live',
    statusColor: '#1a9e75',
    live: true,
    cta: 'Download Free on TestFlight',
    ctaHref: 'https://testflight.apple.com/join/q65zPgbv',
    note: 'iOS only · App Store coming soon',
    available: true,
    borderColor: 'rgba(232,255,71,0.2)',
    glowColor: 'rgba(232,255,71,0.06)',
    accentColor: '#e8ff47',
  },
]

export default function Download() {
  return (
    <section id="download" className="relative py-32 lg:py-44 overflow-hidden">
      {/* Background photo — faded, grayscale */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${downloadBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          filter: 'grayscale(1)',
          opacity: 0.06,
        }}
      />

      {/* Layered overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/75 to-[#0a0a0a]" />
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#e8ff47]/20 to-transparent" />

      {/* Lime glow centre */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#e8ff47]/[0.04] blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
            <span className="font-['DM_Sans'] font-light text-xs text-white/40 tracking-widest uppercase">
              Get Started
            </span>
          </div>
          <h2
            className="font-['Syne'] font-bold text-4xl lg:text-6xl leading-tight text-white mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            Show up today.
            <br />
            <span className="text-[#e8ff47]">Your future self is watching.</span>
          </h2>
          <p className="font-['DM_Sans'] font-light text-base text-white/40 max-w-lg mx-auto leading-relaxed">
            Free on TestFlight. No credit card. Moving to the App Store soon.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex justify-center max-w-4xl mx-auto">
          {platforms.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
              whileHover={{ y: -6, transition: { duration: 0.3, ease: 'easeOut' } }}
              className="group relative flex flex-col items-center text-center overflow-hidden rounded-2xl p-8"
              style={{
                border: `1px solid ${p.borderColor}`,
                background: p.available
                  ? 'rgba(17,17,17,0.9)'
                  : 'rgba(13,13,13,0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: p.available
                  ? '0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)'
                  : '0 16px 32px rgba(0,0,0,0.3)',
              }}
            >
              {/* Gradient border top line */}
              {p.available && (
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${p.accentColor}60, transparent)`,
                  }}
                />
              )}

              {/* Background inner glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${p.glowColor}, transparent 70%)`,
                }}
              />

              {/* Icon */}
              <div
                className="relative mb-6 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: p.available
                    ? `${p.accentColor}12`
                    : 'rgba(255,255,255,0.04)',
                  color: p.available ? p.accentColor : 'rgba(255,255,255,0.25)',
                  border: `1px solid ${p.available ? `${p.accentColor}20` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {p.icon}
              </div>

              <h3
                className="font-['Syne'] font-bold text-xl text-white mb-2 tracking-tight"
              >
                {p.name}
              </h3>

              {/* Status badge with pulsing dot for live */}
              <div
                className="inline-flex items-center gap-1.5 font-['DM_Sans'] font-light text-xs tracking-widest uppercase mb-6 px-3 py-1.5 rounded-full"
                style={{
                  color: p.statusColor,
                  background: `${p.statusColor}15`,
                }}
              >
                {p.live && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: p.statusColor }}
                    />
                    <span
                      className="relative inline-flex h-1.5 w-1.5 rounded-full"
                      style={{ background: p.statusColor }}
                    />
                  </span>
                )}
                {p.status}
              </div>

              <motion.a
                href={p.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={p.available ? { scale: 1.03 } : {}}
                whileTap={p.available ? { scale: 0.97 } : {}}
                className={`w-full font-['Syne'] font-bold text-sm py-3.5 rounded-full transition-colors duration-200 mb-3 ${
                  p.available
                    ? 'bg-[#e8ff47] text-[#0a0a0a] hover:bg-white'
                    : 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                }`}
                onClick={p.available ? undefined : (e) => e.preventDefault()}
              >
                {p.cta}
              </motion.a>

              <span className="font-['DM_Sans'] font-light text-xs text-white/25">
                {p.note}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
