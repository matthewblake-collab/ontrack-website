# OnTrack Landing Page — Handoff Context

## Stack
- React 18 + Vite v8 + Tailwind v4 + Framer Motion
- Location: ~/ontrack-website
- Run: npm run dev → localhost:5173

## Tailwind v4 Note
No tailwind.config.js — configuration is CSS-first in src/index.css using @theme block.
PostCSS replaced by @tailwindcss/vite plugin in vite.config.ts.

## Components
- src/components/Nav.tsx — sticky frosted glass nav, scroll listener
- src/components/Hero.tsx — parallax bg, 3 floating phones, stagger animations
- src/components/MarqueeStrip.tsx — infinite scrolling ticker, pause on hover
- src/components/Mission.tsx — mission statement, quote, 3 pillar cards
- src/components/Features.tsx — 5 alternating feature rows with screenshots
- src/components/Download.tsx — iOS/Android/Web platform cards
- src/components/Footer.tsx — logo, copyright, links
- src/App.tsx — renders all sections

## Screenshots (src/assets/)
- ss_11_39_13.png → Daily Actions (hero centre + features row 1)
- ss_13_44_02.png → Wellbeing sleep chart (hero left + features row 2)
- ss_13_44_47.png → Supplements Today (hero right + features row 3)
- ss_11_39_05.png → Progress/Personal Bests (features row 4)
- ss_11_36_11.png → Groups (features row 5)
- 98_Xmas_Comp__53_of_63.JPG → Hero background (opacity 0.07 grayscale)
- 98_Xmas_Comp__27_of_63.JPG → Mission background (opacity 0.04 grayscale)
- Matt-skierg.PNG → Download background (opacity 0.06 grayscale)

## Design Tokens
- Background: #0a0a0a
- Accent: #e8ff47 (lime)
- Teal: #1a9e75
- Fonts: Syne (headings weight 600-700), DM Sans (body weight 300)

## Status
- Build: CLEAN, zero TypeScript errors
- Animations: All done (parallax, floating phones, scroll reveals, marquee)
- Screenshots: All wired up and correctly mapped
- 21st.dev: DO NOT attempt — service is down

## TODO
1. Review full page in browser at localhost:5173
2. Fix any visual issues
3. Add domain URL and meta tags (OG image, title, description)
4. Deploy to Netlify (drag dist/ folder after npm run build)
5. Wire up App Store link when TestFlight approved
