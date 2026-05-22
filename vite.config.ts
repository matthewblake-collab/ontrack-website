import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypeShiki from '@shikijs/rehype'
import path from 'node:path'
import { generateSitemapAndRss } from './scripts/generate-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [[rehypeShiki, { theme: 'one-dark-pro' }]],
        providerImportSource: '@mdx-js/react',
      }),
    },
    tailwindcss(),
    react(),
    {
      name: 'ontrack-blog-sitemap',
      apply: 'build',
      async closeBundle() {
        const root = path.resolve(__dirname)
        await generateSitemapAndRss(root, path.join(root, 'dist'))
      },
    },
  ],
})
