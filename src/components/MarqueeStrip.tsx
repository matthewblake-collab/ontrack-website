const items = [
  'Daily Workouts',
  'Supplement Tracking',
  'Group Accountability',
  'Progress Analytics',
  'Mental Health',
  'Friend Feed',
  'HealthKit Sync',
  'Dark Aesthetic',
  'Streak Tracking',
  'Custom Habits',
]

export default function MarqueeStrip() {
  // Quadruple for seamless infinite loop with no gaps
  const track = [...items, ...items, ...items, ...items]

  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-[#0e0e0e] py-5">
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0e0e0e] to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0e0e0e] to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-0 whitespace-nowrap marquee-track"
        style={{ animation: 'marquee 30s linear infinite' }}
      >
        {track.map((item, i) => (
          <div key={i} className="flex items-center gap-6 px-6">
            <span className="font-['Syne'] font-black text-sm tracking-widest uppercase text-white/25">
              {item}
            </span>
            <span className="text-[#e8ff47] text-lg leading-none" style={{ opacity: 0.6 }}>·</span>
          </div>
        ))}
      </div>
    </div>
  )
}
