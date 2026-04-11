import { motion } from 'framer-motion'
import missionBg from '../assets/photos/xmas_comp_27.jpg'

const pillars = [
  {
    icon: '⚡',
    label: 'Train',
    title: 'Show up. Every single day.',
    description:
      'Whether you\'re chasing a PB or just trying to move more — OnTrack logs your sessions, tracks your streaks, and makes sure yesterday\'s effort counts toward tomorrow\'s results.',
    accent: '#e8ff47',
  },
  {
    icon: '◎',
    label: 'Connect',
    title: 'Your crew keeps you honest.',
    description:
      'Train with friends, share milestones, and build groups that hold each other accountable. Shared streaks hit different when your mates can see them.',
    accent: '#1a9e75',
  },
  {
    icon: '◈',
    label: 'Thrive',
    title: 'Systems beat motivation.',
    description:
      'Supplements, habits, check-ins — OnTrack turns the boring stuff into a locked-in daily system. You don\'t need to feel like it. You just need to show up.',
    accent: '#e8ff47',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
}

export default function Mission() {
  return (
    <section id="about" className="relative py-32 lg:py-40 overflow-hidden">
      {/* Background photo — faded, grayscale */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${missionBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(1)',
          opacity: 0.04,
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/80" />

      {/* Teal blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1a9e75]/[0.04] blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10">
            <span className="font-['DM_Sans'] font-light text-xs text-white/40 tracking-widest uppercase">
              Why OnTrack
            </span>
          </div>
          <h2 className="font-['Syne'] font-bold text-4xl lg:text-6xl leading-tight tracking-tight text-white max-w-3xl mx-auto">
            Built by someone who's been{' '}
            <span className="text-[#e8ff47]">exactly where you are.</span>
          </h2>
        </motion.div>

        {/* Quote */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="max-w-2xl mx-auto mb-24 text-center"
        >
          <blockquote
            className="font-['Syne'] text-2xl lg:text-3xl text-white/80 leading-snug"
            style={{ fontWeight: 600, letterSpacing: '-0.02em' }}
          >
            "I didn't need another program. I needed two mates who wouldn't let me quit.{' '}
            <span className="text-[#e8ff47]">That's what OnTrack is.</span>"
          </blockquote>
          <div className="mt-6 font-['DM_Sans'] font-light text-sm text-white/30">
            — Matt, Founder of OnTrack Focus
          </div>
        </motion.div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1 } as never}
              whileHover={{
                y: -8,
                borderColor: 'rgba(26,158,117,0.4)',
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              className="group relative rounded-2xl border bg-[#111]/80 p-8 overflow-hidden card-noise"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-8 right-8 h-px opacity-60"
                style={{ background: `linear-gradient(90deg, transparent, ${p.accent}50, transparent)` }}
              />

              {/* Icon */}
              <div
                className="text-2xl mb-6 w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                style={{ background: `${p.accent}10`, color: p.accent }}
              >
                {p.icon}
              </div>

              <div
                className="font-['Syne'] font-bold text-xs tracking-widest uppercase mb-2"
                style={{ color: p.accent }}
              >
                {p.label}
              </div>
              <h3 className="font-['Syne'] font-bold text-xl text-white mb-3 tracking-tight">
                {p.title}
              </h3>
              <p className="font-['DM_Sans'] font-light text-sm text-white/45 leading-relaxed">
                {p.description}
              </p>

              {/* Bottom glow on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `linear-gradient(to top, ${p.accent}08, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
