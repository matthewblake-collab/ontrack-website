import { Link } from 'react-router-dom'
import type { BlogPost } from '../../lib/blog'

interface Props {
  prev?: BlogPost
  next?: BlogPost
}

export default function BlogNav({ prev, next }: Props) {
  if (!prev && !next) return null
  return (
    <nav className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
      {next ? (
        <Link
          to={`/blog/${next.slug}`}
          className="group rounded-2xl border border-white/10 bg-[#111]/60 p-6 hover:border-[#e8ff47]/40 transition-colors"
        >
          <div className="font-['DM_Sans'] font-light text-xs text-white/60 tracking-widest uppercase mb-2">
            Newer
          </div>
          <div className="font-['Syne'] font-bold text-base text-white group-hover:text-[#e8ff47] transition-colors leading-tight">
            ← {next.title}
          </div>
        </Link>
      ) : (
        <div />
      )}
      {prev ? (
        <Link
          to={`/blog/${prev.slug}`}
          className="group rounded-2xl border border-white/10 bg-[#111]/60 p-6 text-right hover:border-[#e8ff47]/40 transition-colors"
        >
          <div className="font-['DM_Sans'] font-light text-xs text-white/60 tracking-widest uppercase mb-2">
            Older
          </div>
          <div className="font-['Syne'] font-bold text-base text-white group-hover:text-[#e8ff47] transition-colors leading-tight">
            {prev.title} →
          </div>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
