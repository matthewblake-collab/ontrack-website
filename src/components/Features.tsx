import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import ssHome from '../assets/screenshots/01_home_daily_actions.png'
import ssGroups from '../assets/screenshots/03_group_detail.png'
import ssSupplements from '../assets/screenshots/04_supplements_protocol.png'
import ssProtocol from '../assets/screenshots/06_protocol_detail.png'
import ssWellbeing from '../assets/screenshots/07_wellbeing.png'
import ssProgress from '../assets/screenshots/08_progress.png'
import xmasComp from '../assets/photos/xmas_comp_53.jpg'

type Pill = { label: string; description: string }

type Feature = {
  label: string
  title: string
  description: string
  pills: Pill[]
  accent: string
  screenshot: string
  alt: string
}

const features: Feature[] = [
  {
    label: 'Daily Actions',
    title: 'Check off every session, habit, and dose — all in one view.',
    description:
      'Your workouts, supplements, and habits surfaced in a clean daily dashboard that resets at midnight. No menus, no digging. Just show up and execute.',
    pills: [
      { label: 'Habits', description: 'Build daily habits with streak tracking and completion rings. Personal or group habits, fully customisable.' },
      { label: 'Sessions', description: 'Log your training sessions and mark attendance. Linked to your groups for shared accountability.' },
      { label: 'Supplements', description: 'See your full supplement stack for the day in one view. Tap to log each dose as you take it.' },
      { label: 'Check-in', description: 'Rate your sleep, energy, and wellbeing each day. Takes 10 seconds and builds your wellness timeline.' },
      { label: 'Quick-Log FAB', description: 'Tap + to instantly log a supplement or workout. Pick from your stack, scan a barcode, or choose a workout type. Done in seconds.' },
    ],
    accent: '#e8ff47',
    screenshot: ssHome,
    alt: 'Daily Actions dashboard screen',
  },
  {
    label: 'Wellbeing',
    title: 'Sleep tracking, energy check-ins, and AI-powered wellness insights.',
    description:
      'Log your sleep, mood, and energy each day. OnTrack\'s AI Wellness Insight surfaces patterns so you can train smarter and recover harder.',
    pills: [
      { label: 'Sleep Tracking', description: 'Log hours slept each night and see weekly trends in a clean chart.' },
      { label: 'AI Insights', description: 'OnTrack analyses your check-in history and surfaces patterns — like how your energy dips on low sleep nights.' },
      { label: 'Energy Log', description: 'Track your daily energy levels alongside sleep and wellbeing for a full picture of your recovery.' },
      { label: 'Recovery Score', description: 'See how your sleep, energy and wellbeing combine into a simple daily score.' },
    ],
    accent: '#1a9e75',
    screenshot: ssWellbeing,
    alt: 'Wellbeing sleep chart and AI Wellness Insight screen',
  },
  {
    label: 'Supplements',
    title: 'Track your full supplement stack with a daily progress ring.',
    description:
      'Build your complete supplement protocol from a library of 70+ research-backed compounds. Smart reminders, daily logging, and streak tracking keep your nutrition dialled.',
    pills: [
      { label: 'Smart Reminders', description: 'Set reminders by time of day — morning, pre-workout, evening. OnTrack notifies you when it\'s time.' },
      { label: 'Protocol Builder', description: 'Build your full supplement stack once. OnTrack surfaces the right doses at the right time each day.' },
      { label: 'Streak Tracking', description: 'See your supplement consistency streak and full stack completion rate over time.' },
      { label: 'Barcode Scanner', description: 'Scan any supplement barcode to pre-fill your stack automatically. Australian products resolve instantly with the correct name, dose, and timing.' },
      { label: 'Stock Tracking', description: 'Log doses, track remaining stock, and get low-stock visibility across your whole stack so you never run out mid-cycle.' },
    ],
    accent: '#e8ff47',
    screenshot: ssSupplements,
    alt: 'Supps Today screen with progress ring',
  },
  {
    label: 'Knowledge Library',
    title: '70+ research-backed compounds with dosing protocols and guides.',
    description:
      '70+ research-backed supplements and peptides. Dosing protocols, reconstitution guides, stack recommendations, and benefits — all in one place. Tap any compound to add it to your protocol instantly.',
    pills: [
      { label: 'Research Protocols', description: 'Step-by-step dosing protocols with phases, cycle lengths, and stacking recommendations — sourced from clinical research.' },
      { label: 'Peptide Database', description: 'Comprehensive peptide reference covering dosage, half-life, reconstitution, storage, and benefits for 30+ compounds.' },
      { label: 'Add to Protocol', description: 'Tap any compound to pre-fill your supplement stack — name, dose, timing, and notes pulled straight from the library.' },
      { label: 'Dosing Guides', description: 'Clear dosage ranges with timing, cycling, and stacking advice for every compound in the database.' },
    ],
    accent: '#1a9e75',
    screenshot: ssProtocol,
    alt: 'Knowledge Library protocols screen',
  },
  {
    label: 'Progress',
    title: 'Your personal bests and trophy room — earned, not given.',
    description:
      'Charts, streaks, and session history give you the full picture of your training journey. Every PR logged. Every milestone celebrated.',
    pills: [
      { label: 'Personal Bests', description: 'Log your PRs — squat, deadlift, run time, anything. OnTrack detects possible new PBs from your session history.' },
      { label: 'Streak Calendar', description: 'See your training consistency laid out as a streak calendar. Every day you showed up, marked.' },
      { label: 'HealthKit Sync', description: 'Pull sleep and activity data directly from Apple Health to pre-fill your daily check-ins.' },
    ],
    accent: '#1a9e75',
    screenshot: ssProgress,
    alt: 'Progress and personal bests screen',
  },
  {
    label: 'Groups',
    title: 'Group training, shared streaks, and real accountability.',
    description:
      'Create training groups with friends, track collective consistency, and hold each other accountable. Shared streaks hit different.',
    pills: [
      { label: 'Group Streaks', description: 'Track how consistently your whole group shows up. Shared streaks create real accountability.' },
      { label: 'Live Feed', description: 'See your friends\' sessions, group streaks, and milestones in a live social feed.' },
      { label: 'Leaderboard', description: 'Ranked by session attendance and streaks. Friendly competition that drives consistency.' },
      { label: 'Session RSVP', description: 'RSVP to upcoming sessions directly from the group view. Going, Maybe, or Can\'t Go — your crew knows who\'s showing up.' },
    ],
    accent: '#e8ff47',
    screenshot: ssGroups,
    alt: 'Groups and social training screen',
  },
]

function FeatureRow({ feature, i }: { feature: Feature; i: number }) {
  const [activePill, setActivePill] = useState<string | null>(null)
  const isEven = i % 2 === 0

  const handlePillClick = (label: string) => {
    setActivePill(prev => (prev === label ? null : label))
  }

  const activeDesc = feature.pills.find(p => p.label === activePill)?.description ?? null

  return (
    <motion.div
      key={i}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.75, delay: i * 0.1 }}
      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${
        !isEven ? 'lg:flex-row-reverse' : ''
      }`}
    >
      {/* Phone mockup */}
      <motion.div
        className="flex-shrink-0 relative"
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: i * 0.1 + 0.1, ease: 'easeOut' }}
        whileHover={{ scale: 1.03, y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      >
        {/* Outer glow ring */}
        <div
          className="absolute -inset-4 rounded-[52px] blur-2xl opacity-20 pointer-events-none"
          style={{ background: feature.accent }}
        />

        {/* Frame */}
        <div
          className="relative overflow-hidden"
          style={{
            width: 230,
            height: 498,
            borderRadius: 44,
            border: '1.5px solid rgba(255,255,255,0.12)',
            background: '#141414',
            boxShadow: `0 48px 96px rgba(0,0,0,0.65), 0 0 0 1px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)`,
          }}
        >
          <img
            src={feature.screenshot}
            alt={feature.alt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ borderRadius: 44 }}
          />
          {/* Dynamic island notch */}
          <div
            className="absolute top-3.5 left-1/2 -translate-x-1/2 z-10"
            style={{
              width: 88,
              height: 26,
              borderRadius: 20,
              background: '#000',
            }}
          />
          {/* Screen glare */}
          <div
            className="absolute top-0 left-0 right-0 h-2/5 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
              borderRadius: '44px 44px 0 0',
            }}
          />
        </div>

        {/* Accent glow under phone */}
        <div
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-36 h-14 blur-2xl rounded-full pointer-events-none"
          style={{ background: `${feature.accent}30` }}
        />
      </motion.div>

      {/* Copy */}
      <motion.div
        className="flex-1 max-w-lg"
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, delay: i * 0.1 + 0.15, ease: 'easeOut' }}
      >
        <div
          className="font-['Syne'] font-bold text-xs tracking-[0.15em] uppercase mb-5"
          style={{ color: feature.accent }}
        >
          {feature.label}
        </div>
        <h3
          className="font-['Syne'] font-bold text-3xl lg:text-[2.6rem] text-white leading-[1.15] mb-5"
          style={{ letterSpacing: '-0.02em' }}
        >
          {feature.title}
        </h3>
        <p className="font-['DM_Sans'] font-light text-base text-white/45 leading-[1.75] mb-8">
          {feature.description}
        </p>

        {/* Pills — clickable toggles */}
        <div className="flex flex-wrap gap-2 mb-0">
          {feature.pills.map((pill, j) => {
            const isActive = activePill === pill.label
            return (
              <motion.button
                key={j}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: j * 0.07 }}
                onClick={() => handlePillClick(pill.label)}
                className="font-['DM_Sans'] font-light text-xs px-3.5 py-1.5 rounded-full border transition-colors duration-200 cursor-pointer"
                style={{
                  borderColor: isActive ? feature.accent : `${feature.accent}35`,
                  color: isActive ? feature.accent : `${feature.accent}90`,
                  background: isActive ? `${feature.accent}15` : `${feature.accent}0a`,
                }}
              >
                {pill.label}
              </motion.button>
            )
          })}
        </div>

        {/* Expanded description */}
        <AnimatePresence>
          {activeDesc && (
            <motion.div
              key={activePill}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              style={{ overflow: 'hidden' }}
            >
              <p className="font-['DM_Sans'] font-light text-xs text-white/60 leading-relaxed mt-2 px-1">
                {activeDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['-15%', '15%'])

  return (
    <section ref={sectionRef} id="features" className="relative py-32 lg:py-44 bg-[#0a0a0a] overflow-hidden">
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-0 w-full pointer-events-none"
        style={{ y: bgY }}
      >
        <img
          src={xmasComp}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(1)', opacity: 0.06 }}
        />
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-28"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
            <span className="font-['DM_Sans'] font-light text-xs text-white/40 tracking-widest uppercase">
              Features
            </span>
          </div>
          <h2 className="font-['Syne'] font-bold text-4xl lg:text-6xl leading-tight text-white" style={{ letterSpacing: '-0.02em' }}>
            Everything you need.
            <br />
            <span className="text-white/25">Nothing you don't.</span>
          </h2>
        </motion.div>

        {/* Feature rows */}
        <div className="flex flex-col gap-24 lg:gap-36">
          {features.map((feature, i) => (
            <FeatureRow key={i} feature={feature} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
