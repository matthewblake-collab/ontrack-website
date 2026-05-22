import { promises as fs } from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(wordCount / wordsPerMinute))
}


const SITE_URL = 'https://ontrack-focus.com'
const STATIC_ROUTES = ['/', '/download', '/privacy', '/terms', '/blog']

interface Front {
  title: string
  slug: string
  date: string
  description: string
  tags: string[]
  category: 'articles' | 'learn'
  draft?: boolean
  author?: string
}

const REQUIRED: (keyof Front)[] = ['title', 'slug', 'date', 'description', 'tags', 'category']

function validate(fm: Partial<Front>, file: string): Front {
  for (const f of REQUIRED) {
    const v = fm[f]
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
      throw new Error(
        `[blog frontmatter] Missing required field "${f}" in ${file}. ` +
          `Required: ${REQUIRED.join(', ')}`,
      )
    }
  }
  if (!Array.isArray(fm.tags) || fm.tags.length === 0) {
    throw new Error(`[blog frontmatter] "tags" must be a non-empty array in ${file}`)
  }
  if (fm.category !== 'articles' && fm.category !== 'learn') {
    throw new Error(`[blog frontmatter] "category" must be "articles" or "learn" in ${file}`)
  }
  if (typeof fm.description === 'string' && fm.description.length > 160) {
    throw new Error(
      `[blog frontmatter] "description" must be ≤160 chars (SEO) — got ${fm.description.length} in ${file}`,
    )
  }
  return fm as Front
}

async function loadPosts(contentDir: string): Promise<{ fm: Front; body: string }[]> {
  const files = await fs.readdir(contentDir)
  const posts: { fm: Front; body: string }[] = []
  for (const file of files) {
    if (!file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(contentDir, file), 'utf8')
    const { data, content } = matter(raw)
    const fm = validate(data as Partial<Front>, file)
    if (fm.draft) continue
    posts.push({ fm, body: content })
  }
  posts.sort((a, b) => (a.fm.date < b.fm.date ? 1 : -1))
  return posts
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSitemap(posts: { fm: Front }[]): string {
  const urls: string[] = []
  for (const route of STATIC_ROUTES) {
    urls.push(
      `<url><loc>${SITE_URL}${route}</loc><changefreq>weekly</changefreq></url>`,
    )
  }
  for (const { fm } of posts) {
    urls.push(
      `<url><loc>${SITE_URL}/blog/${fm.slug}</loc><lastmod>${fm.date}</lastmod><changefreq>monthly</changefreq></url>`,
    )
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

function buildRss(posts: { fm: Front; body: string }[]): string {
  const items = posts.slice(0, 20).map(({ fm, body }) => {
    const minutes = estimateReadingTime(body)
    return `    <item>
      <title>${escapeXml(fm.title)}</title>
      <link>${SITE_URL}/blog/${fm.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${fm.slug}</guid>
      <pubDate>${new Date(fm.date).toUTCString()}</pubDate>
      <description>${escapeXml(fm.description)} (${minutes} min read)</description>
      ${(fm.tags ?? []).map((t) => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>OnTrack Focus — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Articles and guides on training, accountability, and consistency from OnTrack Focus.</description>
    <language>en-au</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`
}

export async function generateSitemapAndRss(rootDir: string, outDir: string): Promise<void> {
  const contentDir = path.join(rootDir, 'content', 'blog')
  const exists = await fs.stat(contentDir).then(() => true, () => false)
  if (!exists) {
    console.warn(`[sitemap] ${contentDir} does not exist — skipping`)
    return
  }
  const posts = await loadPosts(contentDir)
  await fs.mkdir(path.join(outDir, 'blog'), { recursive: true })
  await fs.writeFile(path.join(outDir, 'sitemap.xml'), buildSitemap(posts), 'utf8')
  await fs.writeFile(path.join(outDir, 'blog', 'rss.xml'), buildRss(posts), 'utf8')
  console.log(`[sitemap] wrote sitemap.xml + blog/rss.xml (${posts.length} posts)`)
}

if (process.argv[1] && process.argv[1].endsWith('generate-sitemap.ts')) {
  const root = process.cwd()
  generateSitemapAndRss(root, path.join(root, 'dist')).catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
