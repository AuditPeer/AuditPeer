'use client'
import { useState } from 'react'

export default function JobsComingSoon() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center overflow-hidden px-8 py-12">
      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #00d4ff 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}/>
      {/* Blobs */}
      <div className="absolute top-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full pointer-events-none opacity-[0.06]"
        style={{ background: '#00d4ff', filter: 'blur(80px)' }}/>
      <div className="absolute bottom-[-40px] left-[-40px] w-[250px] h-[250px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: '#7b61ff', filter: 'blur(80px)' }}/>

      <div className="relative z-10 max-w-[580px] w-full text-center animate-fade-slide">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent bg-accent/7 border border-accent/20 px-4 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"/>
          In Development
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"/>
        </div>

        <div className="text-5xl mb-4">💼</div>
        <h1 className="font-syne font-extrabold text-[2.6rem] leading-tight tracking-tight text-white mb-4">
          Audit Jobs<br/><span style={{ color: '#00d4ff' }}>Coming Soon</span>
        </h1>
        <p className="text-muted text-[14px] leading-relaxed mb-8 max-w-[460px] mx-auto">
          We're building a curated job board for IT & Cybersecurity audit professionals — with direct postings from top employers and aggregated listings from leading job networks.
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-3 mb-8 text-left">
          {[
            { icon: '🎯', title: 'Curated for Auditors', sub: 'Only IT, cybersecurity & GRC audit roles — no noise' },
            { icon: '🔗', title: 'Aggregated from Top Boards', sub: 'Indeed, ZipRecruiter, USAJobs & more' },
            { icon: '📣', title: 'Direct Employer Posts', sub: 'Companies post directly to reach our community' },
            { icon: '🔔', title: 'Job Alerts', sub: 'Get notified when roles matching your profile post' },
          ].map(f => (
            <div key={f.title} className="bg-surface border border-border rounded-xl p-4 flex gap-3 hover:border-accent/30 transition-colors">
              <span className="text-xl flex-shrink-0">{f.icon}</span>
              <div>
                <div className="font-syne font-bold text-[13px] text-white mb-0.5">{f.title}</div>
                <div className="text-[11.5px] text-muted leading-snug">{f.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Email capture */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <p className="font-syne font-bold text-[14px] text-white mb-3">Get notified when Jobs launches</p>
          {submitted ? (
            <div className="text-green font-mono text-sm">✓ You're on the list! We'll let you know.</div>
          ) : (
            <>
              <div className="flex gap-2">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[12px] font-mono text-white outline-none focus:border-accent transition-colors"/>
                <button onClick={() => email && setSubmitted(true)}
                  className="px-4 py-2.5 rounded-lg font-syne font-bold text-[13px] text-black whitespace-nowrap"
                  style={{ background: '#00d4ff' }}>
                  Notify Me
                </button>
              </div>
              <p className="font-mono text-[10px] text-muted mt-2">No spam. One email when we go live.</p>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center">
          {['SOC 2','ISO 27001','PCIDSS','NIST','zero-trust','CISA','CISSP','cloud','GRC'].map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
