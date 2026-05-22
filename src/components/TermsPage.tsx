export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="grain-overlay" />
      <div className="max-w-3xl mx-auto px-6 lg:px-12 pt-32 pb-20">
        <a href="/" className="inline-flex items-center gap-2 font-['DM_Sans'] font-light text-sm text-white/50 hover:text-white transition-colors mb-12">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 12H5m0 0l7 7m-7-7l7-7" />
          </svg>
          Back to home
        </a>

        <h1 className="font-['Syne'] font-bold text-4xl lg:text-5xl text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
          Terms of Use
        </h1>
        <p className="font-['DM_Sans'] font-light text-sm text-white/60 mb-12">
          Last updated: April 2026
        </p>

        <div className="space-y-8 font-['DM_Sans'] font-light text-base text-white/70 leading-relaxed">
          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Agreement</h2>
            <p>By using OnTrack Focus, you agree to these terms. If you don't agree, don't use the app. Simple.</p>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">What OnTrack Focus is</h2>
            <p>OnTrack Focus is a personal wellness and group accountability app. It helps you track habits, supplements, training sessions, and daily check-ins. It is not medical software and does not provide medical advice.</p>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Your account</h2>
            <ul className="list-disc list-inside space-y-2 text-white/60">
              <li>You're responsible for keeping your login credentials secure</li>
              <li>You must be at least 13 years old to use OnTrack Focus</li>
              <li>One account per person — don't share accounts</li>
              <li>You can delete your account at any time from Settings</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Your content</h2>
            <p>Anything you enter into OnTrack Focus (habits, check-ins, supplements, group messages) belongs to you. We don't claim ownership of your data. We store it to provide the service and delete it when you ask us to.</p>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Acceptable use</h2>
            <p>Don't use OnTrack Focus to:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-white/60">
              <li>Harass, bully, or abuse other users</li>
              <li>Share inappropriate content in group chats</li>
              <li>Attempt to access other users' accounts or data</li>
              <li>Reverse-engineer or interfere with the app's operation</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Disclaimers</h2>
            <ul className="list-disc list-inside space-y-2 text-white/60">
              <li>OnTrack Focus is provided "as is" — we don't guarantee uptime or error-free operation</li>
              <li>Supplement information in the Knowledge Library is for educational purposes only and is not medical advice</li>
              <li>AI wellness insights are generated from your data and should not replace professional health advice</li>
              <li>We're not responsible for actions taken based on information in the app</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Changes</h2>
            <p>We may update these terms. If we make significant changes, we'll notify you in the app. Continued use after changes means you accept the new terms.</p>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Contact</h2>
            <p>Questions? <a href="mailto:matt@ontrack-focus.com" className="text-[#e8ff47] hover:underline">matt@ontrack-focus.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
