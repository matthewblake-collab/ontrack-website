// TODO: replace BEEHIIV_EMBED_URL with the real Beehiiv embed URL once the
// Beehiiv account is provisioned. Until then, the iframe points at a
// placeholder and is non-interactive.
const BEEHIIV_EMBED_URL = 'about:blank'

export default function NewsletterSignup() {
  return (
    <section className="relative rounded-2xl border border-white/10 bg-[#111]/80 p-10 overflow-hidden card-noise">
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#e8ff47]/40 to-transparent" />
      <div className="max-w-xl">
        <div className="font-['Syne'] font-bold text-xs text-[#e8ff47] tracking-widest uppercase mb-3">
          Newsletter
        </div>
        <h3 className="font-['Syne'] font-bold text-2xl lg:text-3xl text-white mb-4 leading-tight tracking-tight">
          Two articles a week. No filler.
        </h3>
        <p className="font-['DM_Sans'] font-light text-sm text-white/50 leading-relaxed mb-6">
          Practical writing on training consistency, accountability, and the systems
          that actually keep people showing up. Tuesday and Friday — straight to your inbox.
        </p>
        <iframe
          title="Newsletter signup"
          src={BEEHIIV_EMBED_URL}
          className="w-full h-[112px] border border-white/10 rounded-xl bg-[#0a0a0a]"
          loading="lazy"
        />
        <p className="font-['DM_Sans'] font-light text-[11px] text-white/60 mt-3">
          Newsletter coming soon — embed will be live once Beehiiv is set up.
        </p>
      </div>
    </section>
  )
}
