export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="font-['DM_Sans'] font-light text-sm text-white/60 mb-12">
          Last updated: April 2026
        </p>

        <div className="space-y-8 font-['DM_Sans'] font-light text-base text-white/70 leading-relaxed">
          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">What we collect</h2>
            <p>OnTrack Focus collects the minimum data needed to provide the app experience:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-white/60">
              <li>Account information (email address or Apple ID used to sign in)</li>
              <li>Profile data you provide (display name, avatar)</li>
              <li>App usage data (habits, supplements, check-ins, session attendance) stored in your account</li>
              <li>HealthKit data (sleep, energy) — only when you grant permission, never shared or sold</li>
              <li>Device token for push notifications — only when you opt in</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">How we use it</h2>
            <p>Your data is used solely to provide the OnTrack Focus experience:</p>
            <ul className="list-disc list-inside mt-3 space-y-2 text-white/60">
              <li>Display your habits, supplements, and wellness trends</li>
              <li>Enable group accountability features (sessions, streaks, friend feeds)</li>
              <li>Send push notifications you've opted into</li>
              <li>Generate AI wellness insights from your check-in data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">What we don't do</h2>
            <ul className="list-disc list-inside space-y-2 text-white/60">
              <li>We don't sell your data to third parties</li>
              <li>We don't share your HealthKit data with anyone</li>
              <li>We don't use your data for advertising</li>
              <li>We don't track you across other apps or websites</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Data storage</h2>
            <p>Your data is stored securely using Supabase (hosted on AWS). All data is encrypted in transit (TLS) and at rest. Your account can be permanently deleted at any time from the app's Settings screen.</p>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Third-party services</h2>
            <ul className="list-disc list-inside space-y-2 text-white/60">
              <li>Supabase — authentication and database</li>
              <li>Apple Push Notification Service — push notifications</li>
              <li>Apple HealthKit — health data (read-only, with your permission)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-['Syne'] font-bold text-xl text-white mb-3">Contact</h2>
            <p>Questions about your privacy? Reach out at <a href="mailto:matt@ontrack-focus.com" className="text-[#e8ff47] hover:underline">matt@ontrack-focus.com</a></p>
          </section>
        </div>
      </div>
    </div>
  )
}
