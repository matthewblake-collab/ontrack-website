// reading-time removed — replaced with browser-safe implementation
function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.round(wordCount / wordsPerMinute))
}

export type BlogCategory = 'articles' | 'learn'

export interface BlogFrontmatter {
  title: string
  slug: string
  date: string
  description: string
  tags: string[]
  category: BlogCategory
  cover_image?: string
  reading_time?: number
  author?: string
  draft?: boolean
}

export interface BlogPost extends BlogFrontmatter {
  reading_time: number
  author: string
  draft: boolean
  Component: React.ComponentType
  raw: string
}

interface MdxModule {
  default: React.ComponentType
  frontmatter: Partial<BlogFrontmatter>
}

const REQUIRED_FIELDS: (keyof BlogFrontmatter)[] = [
  'title',
  'slug',
  'date',
  'description',
  'tags',
  'category',
]

function validateFrontmatter(fm: Partial<BlogFrontmatter>, path: string): BlogFrontmatter {
  for (const field of REQUIRED_FIELDS) {
    const v = fm[field]
    if (v === undefined || v === null || (typeof v === 'string' && v.trim() === '')) {
      throw new Error(
        `[blog] Missing required frontmatter field "${field}" in ${path}. ` +
          `Required: ${REQUIRED_FIELDS.join(', ')}`,
      )
    }
  }
  if (!Array.isArray(fm.tags) || fm.tags.length === 0) {
    throw new Error(`[blog] "tags" must be a non-empty array in ${path}`)
  }
  if (fm.category !== 'articles' && fm.category !== 'learn') {
    throw new Error(`[blog] "category" must be "articles" or "learn" in ${path}`)
  }
  if (typeof fm.description === 'string' && fm.description.length > 160) {
    throw new Error(
      `[blog] "description" must be ≤160 chars (SEO) — got ${fm.description.length} in ${path}`,
    )
  }
  return fm as BlogFrontmatter
}

const modules = import.meta.glob<MdxModule>('/content/blog/*.mdx', { eager: true })
const rawSources = import.meta.glob<string>('/content/blog/*.mdx', {
  eager: true,
  query: '?raw',
  import: 'default',
})

let _cache: BlogPost[] | null = null

export function getAllPosts(): BlogPost[] {
  if (_cache) return _cache
  const posts: BlogPost[] = []
  for (const [path, mod] of Object.entries(modules)) {
    const fm = validateFrontmatter(mod.frontmatter ?? {}, path)
    if (fm.draft) continue
    const raw = rawSources[path] ?? ''
    posts.push({
      ...fm,
      reading_time: fm.reading_time ?? estimateReadingTime(raw),
      author: fm.author ?? 'Matt Blake',
      draft: fm.draft ?? false,
      Component: mod.default,
      raw,
    })
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  _cache = posts
  return posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export function getAdjacentPosts(slug: string): {
  prev: BlogPost | undefined
  next: BlogPost | undefined
} {
  const posts = getAllPosts()
  const i = posts.findIndex((p) => p.slug === slug)
  if (i === -1) return { prev: undefined, next: undefined }
  return { prev: posts[i + 1], next: posts[i - 1] }
}
