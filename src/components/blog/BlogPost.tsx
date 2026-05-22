import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MDXProvider } from '@mdx-js/react'
import Nav from '../Nav'
import Footer from '../Footer'
import BlogNav from './BlogNav'
import NewsletterSignup from './NewsletterSignup'
import SEO from './SEO'
import { getPostBySlug, getAdjacentPosts } from '../../lib/blog'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function fireViewIncrement(slug: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON) return
  void fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_blog_view`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_slug: slug }),
    keepalive: true,
  }).catch(() => {
    /* fire-and-forget */
  })
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined
  const { prev, next } = slug ? getAdjacentPosts(slug) : { prev: undefined, next: undefined }

  useEffect(() => {
    if (post) fireViewIncrement(post.slug)
  }, [post])

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <Nav />
        <div className="max-w-3xl mx-auto px-6 lg:px-12 pt-40 pb-20 text-center">
          <h1 className="font-['Syne'] font-bold text-4xl mb-4">Article not found</h1>
          <p className="font-['DM_Sans'] font-light text-white/50 mb-8">
            We couldn't find the article you were looking for.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#e8ff47] text-[#0a0a0a] font-['Syne'] font-bold text-sm px-6 py-3 rounded-full"
          >
            Back to blog
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const accent = post.category === 'learn' ? '#1a9e75' : '#e8ff47'
  const Mdx = post.Component

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      <SEO post={post} />
      <div className="grain-overlay" />
      <Nav />

      <header className="relative pt-40 pb-12 px-6 lg:px-12 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <Link
            to="/blog"
            className="inline-block font-['DM_Sans'] font-light text-xs text-white/60 hover:text-white tracking-widest uppercase mb-6"
          >
            ← Blog
          </Link>
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
              · {post.reading_time} min read
            </span>
            <span className="font-['DM_Sans'] font-light text-xs text-white/60">
              · {post.author}
            </span>
          </div>
          <h1
            className="font-['Syne'] text-4xl lg:text-5xl leading-[1.1] text-white mb-2"
            style={{ fontWeight: 600, letterSpacing: '-0.03em' }}
          >
            {post.title}
          </h1>
        </motion.div>
      </header>

      {post.cover_image ? (
        <div className="max-w-4xl mx-auto px-6 lg:px-12 mb-16">
          <img
            src={post.cover_image}
            alt=""
            className="w-full rounded-2xl border border-white/10"
          />
        </div>
      ) : null}

      <article
        className="
          prose prose-invert prose-lg max-w-3xl mx-auto px-6 lg:px-12 pb-20
          font-['DM_Sans'] font-light
          prose-headings:font-['Syne'] prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
          prose-h2:text-3xl prose-h2:mt-12
          prose-h3:text-2xl
          prose-p:text-white/70 prose-p:leading-relaxed
          prose-a:text-[#e8ff47] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white
          prose-blockquote:border-l-[#e8ff47] prose-blockquote:text-white/80
          prose-code:text-[#e8ff47] prose-code:bg-[#111] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-[#0d0d0d] prose-pre:border prose-pre:border-white/10
          prose-li:text-white/70
        "
      >
        <MDXProvider>
          <Mdx />
        </MDXProvider>

        <div className="not-prose mt-12 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span
              key={t}
              className="font-['DM_Sans'] font-light text-xs text-white/60 px-2.5 py-1 rounded-full border border-white/10"
            >
              #{t}
            </span>
          ))}
        </div>

        <div className="not-prose">
          <BlogNav prev={prev} next={next} />
        </div>
      </article>

      <section className="px-6 lg:px-12 max-w-3xl mx-auto pb-20">
        <NewsletterSignup />
      </section>

      <Footer />
    </div>
  )
}
