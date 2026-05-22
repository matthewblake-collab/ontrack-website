import { Helmet } from 'react-helmet-async'
import type { BlogPost } from '../../lib/blog'

const SITE_URL = 'https://ontrack-focus.com'
const SITE_NAME = 'OnTrack Focus'
const DEFAULT_OG = `${SITE_URL}/og-default.png`

interface Props {
  post?: BlogPost
  title?: string
  description?: string
  path?: string
}

export default function SEO({ post, title, description, path }: Props) {
  if (post) {
    const url = `${SITE_URL}/blog/${post.slug}`
    const image = post.cover_image ? `${SITE_URL}${post.cover_image}` : DEFAULT_OG
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      image,
      author: { '@type': 'Person', name: post.author },
      datePublished: post.date,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    }
    return (
      <Helmet>
        <title>{`${post.title} — ${SITE_NAME}`}</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={image} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        {post.tags.map((t) => (
          <meta property="article:tag" content={t} key={t} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={image} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
    )
  }

  const t = title ?? `Blog — ${SITE_NAME}`
  const d =
    description ??
    'Articles and guides on training, accountability, and consistency from OnTrack Focus.'
  const url = `${SITE_URL}${path ?? '/blog'}`
  return (
    <Helmet>
      <title>{t}</title>
      <meta name="description" content={d} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t} />
      <meta property="og:description" content={d} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={DEFAULT_OG} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t} />
      <meta name="twitter:description" content={d} />
    </Helmet>
  )
}
