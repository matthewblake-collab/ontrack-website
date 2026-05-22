import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { BlogPost } from '../../lib/blog'

interface Props {
  post: BlogPost
  index?: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BlogCard({ post, index = 0 }: Props) {
  const accent = post.category === 'learn' ? '#1a9e75' : '#e8ff47'
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.05 } as never}
      whileHover={{ y: -4, transition: { duration: 0.3, ease: 'easeOut' } }}
      className="group relative rounded-2xl border bg-[#111]/80 overflow-hidden card-noise"
      style={{ borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <Link to={`/blog/${post.slug}`} className="block p-8 h-full">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="font-['Syne'] font-bold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full"
            style={{ background: `${accent}10`, color: accent }}
          >
            {post.category}
          </span>
          <span className="font-['DM_Sans'] font-light text-xs text-white/60">
            {formatDate(post.date)}
          </span>
          <span className="font-['DM_Sans'] font-light text-xs text-white/60">
            · {post.reading_time} min
          </span>
        </div>
        <h3 className="font-['Syne'] font-bold text-xl lg:text-2xl text-white mb-3 leading-tight tracking-tight group-hover:text-[#e8ff47] transition-colors duration-300">
          {post.title}
        </h3>
        <p className="font-['DM_Sans'] font-light text-sm text-white/50 leading-relaxed mb-5">
          {post.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-['DM_Sans'] font-light text-[11px] text-white/60 px-2 py-0.5 rounded-full border border-white/10"
            >
              #{t}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  )
}
