import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Nav from '../Nav'
import Footer from '../Footer'
import BlogCard from './BlogCard'
import NewsletterSignup from './NewsletterSignup'
import SEO from './SEO'
import { getAllPosts, type BlogCategory } from '../../lib/blog'

type Tab = 'all' | BlogCategory

const tabs: { id: Tab; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'articles', label: 'Articles' },
  { id: 'learn', label: 'Learn' },
]

export default function BlogIndex() {
  const [tab, setTab] = useState<Tab>('all')
  const [q, setQ] = useState('')
  const all = useMemo(() => getAllPosts(), [])

  const filtered = useMemo(() => {
    const tabbed = tab === 'all' ? all : all.filter((p) => p.category === tab)
    if (!q.trim()) return tabbed
    const needle = q.toLowerCase()
    return tabbed.filter(
      (p) =>
        p.title.toLowerCase().includes(needle) ||
        p.tags.some((t) => t.toLowerCase().includes(needle)),
    )
  }, [all, tab, q])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <SEO />
      <div className="grain-overlay" />
      <Nav />

      <header className="relative pt-40 pb-20 px-6 lg:px-12 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="font-['Syne'] font-bold text-xs text-[#e8ff47] tracking-widest uppercase mb-4">
            Blog
          </div>
          <h1
            className="font-['Syne'] text-5xl lg:text-6xl leading-[1.05] text-white mb-6"
            style={{ fontWeight: 600, letterSpacing: '-0.03em' }}
          >
            Show up. Every single day.
          </h1>
          <p className="font-['DM_Sans'] font-light text-base lg:text-lg text-white/50 leading-relaxed max-w-2xl">
            Articles and guides on training consistency, accountability, and the
            systems that actually keep people showing up.
          </p>
        </motion.div>
      </header>

      <section className="px-6 lg:px-12 max-w-5xl mx-auto pb-12">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-10">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-full font-['DM_Sans'] text-sm transition-colors ${
                  tab === t.id
                    ? 'bg-[#e8ff47] text-[#0a0a0a] font-bold'
                    : 'border border-white/10 text-white/60 hover:text-white hover:border-white/30'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search by title or tag..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="px-4 py-2 rounded-full border border-white/10 bg-[#111] text-sm font-['DM_Sans'] text-white placeholder-white/30 focus:outline-none focus:border-[#e8ff47]/50 w-full md:w-72"
          />
        </div>

        {filtered.length === 0 ? (
          <p className="text-center text-white/60 py-16 font-['DM_Sans'] font-light">
            No articles match that filter yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((p, i) => (
              <BlogCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="px-6 lg:px-12 max-w-5xl mx-auto py-20">
        <NewsletterSignup />
      </section>

      <Footer />
    </div>
  )
}
