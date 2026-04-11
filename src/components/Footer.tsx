export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/[0.06] py-14 bg-[#080808]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-0.5">
          <span className="font-['Syne'] font-bold text-lg text-white tracking-tight">On</span>
          <span className="font-['Syne'] font-bold text-lg text-[#e8ff47] tracking-tight">Track</span>
        </a>

        {/* Copyright */}
        <p className="font-['DM_Sans'] font-light text-xs text-white/70 tracking-wide">
          © {year} OnTrack Focus. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex items-center gap-8">
          {[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
            { label: 'Support', href: 'https://matthewblake-collab.github.io/ontrack-support' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-['DM_Sans'] font-light text-xs text-white/60 hover:text-white transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
