'use client'
import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Sidebar from '@/components/layout/Sidebar'
import QuestionCard from '@/components/feed/QuestionCard'
import ProfileModal from '@/components/modals/ProfileModal'
import AskModal from '@/components/modals/AskModal'
import ShareTemplateModal from '@/components/modals/ShareTemplateModal'
import JobsComingSoon from '@/components/ui/JobsComingSoon'
import TemplateCard from '@/components/ui/TemplateCard'
import { QUESTIONS_SEED } from '@/lib/seed'
import { TEMPLATES_SEED } from '@/lib/seed-templates'
import { generateUsername, getInitials, AVATAR_GRADIENTS } from '@/lib/utils'
import type { Question, Template, Profile, FeedFilter } from '@/types'

type Page = 'feed' | 'jobs' | 'templates' | 'guidelines' | 'profile'

const GUIDELINES = [
  { num: '01', icon: '🎯', title: 'Ask Good Questions', body: 'Before posting, search to see if your question has already been answered. Include the framework (SOC 2, ISO 27001, NIST, etc.), type of organization, and what you\'ve already tried. Vague questions get vague answers.' },
  { num: '02', icon: '🔒', title: 'Keep It Professional & Confidential', body: 'Never share client names, engagement details, internal audit reports, or any information that could identify an organization. This community operates under an assumed duty of confidentiality. Sanitize all examples before posting.' },
  { num: '03', icon: '⚖️', title: 'No Legal or Regulatory Advice', body: 'Sharing knowledge is encouraged — but nothing posted here constitutes formal legal, regulatory, or professional audit opinion. Always apply your own judgment. Do not cite AuditPeer responses as authoritative sources in deliverables.' },
  { num: '04', icon: '📖', title: 'Cite Your Reasoning', body: 'When you answer a question, explain why, not just what. Reference the relevant control, clause, standard, or framework. Answers that explain rationale build lasting knowledge — not just quick fixes.' },
  { num: '05', icon: '🌍', title: 'Respect Different Frameworks & Jurisdictions', body: 'An answer correct for a US SaaS company under SOC 2 may not apply to a European financial institution under DORA or NIS2. Be specific about your context and open to different rules.' },
  { num: '06', icon: '🚫', title: 'No Vendor Promotion or Solicitation', body: 'Do not use AuditPeer to promote your products, services, or consulting practice. Mentioning tools is fine when genuinely relevant — but unsolicited promotion or repeated plugging of commercial offerings will result in removal.' },
  { num: '07', icon: '✏️', title: 'Be Accurate — and Correct Yourself', body: 'If you\'ve posted something inaccurate, edit or retract it promptly. Outdated guidance can cause real harm. The community values humility and self-correction far more than defended errors.' },
  { num: '08', icon: '📄', title: 'Templates Must Be Sanitized', body: 'Any template, workpaper, or checklist shared must be fully sanitized — no client names, company names, internal reference numbers, or engagement details. Violation results in immediate content removal and a warning.', highlight: true },
  { num: '09', icon: '🤝', title: 'Be Constructive, Not Critical of People', body: 'Critique methods and approaches — not the person asking. Everyone here was once a junior auditor. Condescension has no place here.' },
  { num: '10', icon: '🚩', title: 'Report, Don\'t Retaliate', body: 'If you see a post that violates these guidelines, use the report function. Do not respond with counter-attacks or public callouts.' },
]

export default function Home() {
  const [page, setPage]               = useState<Page>('feed')
  const [feedFilter, setFeedFilter]   = useState<FeedFilter>('newest')
  const [questions, setQuestions]     = useState<Question[]>(QUESTIONS_SEED)
  const [templates, setTemplates]     = useState<Template[]>(TEMPLATES_SEED)
  const [templateFilter, setTemplateFilter] = useState<string>('all')
  const [showShareModal, setShowShareModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [profile, setProfile]         = useState<Profile | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileModalMode, setProfileModalMode] = useState<'signup'|'edit'>('signup')
  const [showAskModal, setShowAskModal]         = useState(false)

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setShowProfileModal(false); setShowAskModal(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── Derived: filtered questions ──────────────────────────────
  const filteredQuestions = (() => {
    let qs = [...questions]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      qs = qs.filter(q2 => q2.title.toLowerCase().includes(q) || q2.tags.some(t => t.toLowerCase().includes(q)))
    }
    switch (feedFilter) {
      case 'unanswered':  return qs.filter(q => q.answer_count === 0)
      case 'bookmarked':  return qs.filter(q => (q as any).bookmarked)
      case 'hot':         return qs.filter(q => q.vote_count >= 15 || q.view_count >= 300).sort((a,b) => (b.vote_count*2+b.view_count*0.01)-(a.vote_count*2+a.view_count*0.01))
      case 'top':         return qs.sort((a,b) => b.vote_count - a.vote_count)
      default:            return qs.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  })()

  const feedTitles: Record<FeedFilter, string> = {
    newest: 'All Questions', top: 'Top Voted', unanswered: 'Unanswered Questions',
    hot: '🔥 Hot Questions', bookmarked: '⭐ Bookmarked',
  }

  // ── Handlers ────────────────────────────────────────────────
  const handleVote = (id: string, val: 1 | -1) => {
    setQuestions(qs => qs.map(q => q.id === id
      ? { ...q, vote_count: q.vote_count + (q.user_vote === val ? -val : val), user_vote: q.user_vote === val ? 0 : val }
      : q
    ))
  }

  const handleBookmark = (id: string, bookmarked: boolean) => {
    setQuestions(qs => qs.map(q => q.id === id ? { ...q, bookmarked } as any : q))
  }

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag)
    setFeedFilter('newest')
    setPage('feed')
  }

  const handleAskSubmit = (data: { title: string; body: string; tags: string[] }) => {
    const newQ: Question = {
      id: Date.now().toString(),
      ...data,
      author_id: profile?.id || 'anon',
      author: profile || undefined,
      vote_count: 0, answer_count: 0, view_count: 0,
      is_answered: false, user_vote: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setQuestions(qs => [newQ, ...qs])
    setPage('feed'); setFeedFilter('newest')
  }

  const handleProfileSave = (data: Partial<Profile>) => {
    const newProfile: Profile = {
      id: profile?.id || Date.now().toString(),
      username: data.username || generateUsername(),
      job_title: data.job_title || null,
      industry: data.industry || null,
      experience: data.experience || null,
      certifications: data.certifications || [],
      avatar_gradient: data.avatar_gradient || AVATAR_GRADIENTS[0],
      is_anonymous: true,
      reputation: profile?.reputation || 0,
      created_at: profile?.created_at || new Date().toISOString(),
    }
    setProfile(newProfile)
  }

  const openLogin   = () => { setProfileModalMode('signup'); setShowProfileModal(true) }
  const openEdit    = () => { setProfileModalMode('edit');   setShowProfileModal(true) }

  const ctaConfig: Record<Page, { label: string; action: () => void; show: boolean }> = {
    feed:       { label: '+ Ask Question', action: () => setShowAskModal(true), show: true },
    jobs:       { label: '🔔 Get Notified', action: () => {}, show: true },
    templates:  { label: '+ Share Template', action: () => setShowShareModal(true), show: true },
    guidelines: { label: '', action: () => {}, show: false },
    profile:    { label: '', action: () => {}, show: false },
  }

  const isFullWidth = page === 'guidelines' || page === 'profile'

  return (
    <>
      <Header
        profile={profile}
        onLoginClick={openLogin}
        onProfileClick={() => setPage('profile')}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        ctaLabel={ctaConfig[page].label}
        onCtaClick={ctaConfig[page].action}
        showCta={ctaConfig[page].show}
      />

      <div className="flex max-w-[1400px] mx-auto min-h-[calc(100vh-60px)]">
        <Sidebar
          currentPage={page}
          feedFilter={feedFilter}
          onPageChange={setPage}
          onFeedFilter={(f) => { setFeedFilter(f); setPage('feed') }}
          onTagClick={handleTagClick}
        />

        {/* Main content */}
        <main className={`flex-1 min-w-0 px-6 py-5 ${isFullWidth ? 'max-w-full' : ''}`}>

          {/* ── FEED ── */}
          {page === 'feed' && (
            <>
              <div className="flex items-center justify-between mb-5">
                <h1 className="font-syne font-extrabold text-xl text-white">{feedTitles[feedFilter]}</h1>
                <div className="flex gap-1.5">
                  {(['newest','top','unanswered'] as FeedFilter[]).map(f => (
                    <button key={f} onClick={() => setFeedFilter(f)}
                      className={`px-3 py-1.5 rounded-lg font-syne font-semibold text-[12px] capitalize transition-all
                        ${feedFilter === f ? 'bg-accent/10 text-accent border border-accent/30' : 'text-muted border border-border hover:text-white hover:border-muted'}`}>
                      {f === 'newest' ? 'Newest' : f === 'top' ? 'Top Voted' : 'Unanswered'}
                    </button>
                  ))}
                </div>
              </div>

              {filteredQuestions.length === 0 ? (
                <div className="text-center py-16 text-muted">
                  <div className="text-4xl mb-4">🔍</div>
                  <div className="font-syne font-bold text-white text-lg mb-1">No questions found</div>
                  <div className="text-sm">Try a different filter or be the first to ask!</div>
                </div>
              ) : (
                filteredQuestions.map((q, i) => (
                  <QuestionCard key={q.id} question={q} onVote={handleVote}
                    onTagClick={handleTagClick}
                    onBookmark={handleBookmark}
                    delay={i * 0.04}/>
                ))
              )}
            </>
          )}

          {/* ── JOBS ── */}
          {page === 'jobs' && <JobsComingSoon/>}

          {/* ── TEMPLATES ── */}
          {page === 'templates' && (() => {
            const CATEGORIES = ['all', 'Evidence', 'Checklists', 'Risk Assessment', 'Reports', 'Policies']
            const filtered = templateFilter === 'all'
              ? templates
              : templates.filter(t => t.category === templateFilter)
            const sorted = [...filtered].sort((a, b) => b.download_count - a.download_count)

            return (
              <>
                {/* Header + filters */}
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <h1 className="font-syne font-extrabold text-xl text-white">
                    Templates
                    <span className="ml-2 font-mono text-[13px] font-normal" style={{ color: '#00d4ff' }}>
                      {filtered.length}
                    </span>
                  </h1>
                </div>

                {/* Category filter tabs */}
                <div className="flex gap-1.5 flex-wrap mb-6">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setTemplateFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg font-syne font-semibold text-[12px] capitalize transition-all
                        ${templateFilter === cat
                          ? 'bg-accent/10 text-accent border border-accent/30'
                          : 'text-muted border border-border hover:text-white hover:border-muted'}`}>
                      {cat === 'all' ? 'All Templates' : cat}
                    </button>
                  ))}
                </div>

                {/* Sanitization reminder */}
                <div className="bg-red/5 border border-red/20 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
                  <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                  <p className="text-[12px] text-muted leading-relaxed">
                    <strong className="text-white">Reminder:</strong> All templates must be fully sanitized before sharing — no client names, company names, internal reference numbers, or engagement details. See <span className="text-accent cursor-pointer hover:underline" onClick={() => setPage('guidelines')}>Guideline #8</span>.
                  </p>
                </div>

                {/* Grid */}
                {sorted.length === 0 ? (
                  <div className="text-center py-16 text-muted">
                    <div className="text-4xl mb-4">📄</div>
                    <div className="font-syne font-bold text-white text-lg mb-1">No templates yet</div>
                    <div className="text-sm">Be the first to share one in this category</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {sorted.map((t, i) => (
                      <TemplateCard
                        key={t.id}
                        template={t}
                        onDownload={id => console.log('download', id)}
                        delay={i * 0.04}
                      />
                    ))}
                  </div>
                )}
              </>
            )
          })()}

          {/* ── GUIDELINES ── */}
          {page === 'guidelines' && (
            <div className="max-w-[900px] mx-auto pb-12">
              <div className="text-center mb-10 pb-8 border-b border-border">
                <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent bg-accent/7 border border-accent/20 px-4 py-1.5 rounded-full mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"/>Community Standards
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"/>
                </div>
                <h1 className="font-syne font-extrabold text-[2.2rem] tracking-tight text-white mb-3">Community Guidelines</h1>
                <p className="text-muted text-[14.5px] leading-relaxed max-w-[600px] mx-auto">
                  AuditPeer is a peer community for IT and cybersecurity audit professionals. These guidelines keep the knowledge here accurate, respectful, and genuinely useful.
                </p>
                <p className="font-mono text-[11px] text-muted/60 mt-3">Last updated: February 2025 · Applies to all members</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {GUIDELINES.map((g, i) => (
                  <div key={g.num}
                    className={`rounded-xl p-5 border transition-all hover:-translate-y-0.5 animate-fade-slide relative overflow-hidden
                      ${g.highlight
                        ? 'border-red/25 bg-gradient-to-br from-[#1a1118] to-surface hover:border-red/45'
                        : 'border-border bg-surface hover:border-accent/25'}`}
                    style={{ animationDelay: `${i * 0.04}s` }}>
                    <div className={`absolute top-0 left-0 right-0 h-[2px] ${g.highlight ? 'bg-gradient-to-r from-transparent via-red/20 to-transparent' : 'bg-gradient-to-r from-transparent via-accent/10 to-transparent'}`}/>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${g.highlight ? 'text-red bg-red/8 border-red/25' : 'text-accent bg-accent/8 border-accent/20'}`}>{g.num}</span>
                      <span className="text-base">{g.icon}</span>
                      <span className="font-syne font-bold text-[13.5px] text-white">{g.title}</span>
                    </div>
                    <p className="text-[12.5px] text-muted leading-relaxed">{g.body}</p>
                    {g.highlight && (
                      <div className="mt-3 inline-block font-mono text-[11px] text-red bg-red/8 border border-red/20 px-3 py-1 rounded">
                        ⚠ Strict enforcement — no exceptions
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-br from-[#0d1a2e] to-surface border border-accent/20 rounded-xl p-6 flex gap-4 items-start mb-6 animate-fade-slide" style={{ animationDelay: '0.44s' }}>
                <span className="text-3xl">🛡️</span>
                <div>
                  <h3 className="font-syne font-extrabold text-[15px] text-white mb-2">Enforcement</h3>
                  <p className="text-[13px] text-muted leading-relaxed">
                    Violations are handled progressively: a <strong className="text-white">warning</strong>, then a <strong className="text-white">temporary suspension</strong>, then a <strong className="text-white">permanent ban</strong> for serious or repeated breaches. Severe violations — such as sharing genuinely confidential client data — may result in immediate permanent removal without prior warning.
                  </p>
                </div>
              </div>

              <div className="text-center font-mono text-[11px] text-muted border-t border-border pt-5">
                Questions? Contact the moderation team via the{' '}
                <span onClick={() => setPage('feed')} className="text-accent cursor-pointer hover:underline">Announcements</span> section.
              </div>
            </div>
          )}

          {/* ── PROFILE ── */}
          {page === 'profile' && (
            <div className="max-w-[760px] mx-auto pb-12">
              {/* Hero */}
              <div className="flex gap-7 items-start mb-8 pb-8 border-b border-border">
                <div className="relative cursor-pointer flex-shrink-0" onClick={openEdit}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center font-syne font-extrabold text-3xl text-white border-3 border-border"
                    style={{ background: `linear-gradient(${profile?.avatar_gradient || AVATAR_GRADIENTS[0]})` }}>
                    {getInitials(profile?.username || '?')}
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] text-black border-2 border-bg"
                    style={{ background: '#00d4ff' }}>✏</div>
                </div>
                <div className="flex-1">
                  <h1 className="font-syne font-extrabold text-[1.6rem] text-white tracking-tight mb-1">
                    {profile?.username || 'Anonymous Auditor'}
                  </h1>
                  <p className="text-accent text-[13px] mb-2">
                    {[profile?.job_title, profile?.industry].filter(Boolean).join(' · ') || '—'}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {profile?.experience && <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-accent/8 text-accent border border-accent/20">{profile.experience}</span>}
                    {profile?.industry   && <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-green/8 text-green border border-green/20">{profile.industry}</span>}
                    {profile?.certifications.filter(c => c !== 'None yet').map(c => (
                      <span key={c} className="font-mono text-[11px] px-2 py-0.5 rounded bg-accent2/12 text-accent2 border border-accent2/25">{c}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-yellow-400 bg-yellow-400/8 border border-yellow-400/20 px-2 py-1 rounded">
                      🔒 Anonymous Mode
                    </span>
                    <button onClick={openEdit}
                      className="text-[12px] font-syne font-semibold text-muted border border-border px-3 py-1 rounded hover:border-accent hover:text-accent transition-all">
                      ✏ Edit Profile
                    </button>
                    {!profile && (
                      <button onClick={openLogin}
                        className="text-[13px] font-syne font-bold px-4 py-1.5 rounded-lg text-black"
                        style={{ background: '#00d4ff' }}>
                        Create Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-8">
                {[['0','Questions'],['0','Answers'],['0','Reputation'],['0','Helpful Votes']].map(([n, l]) => (
                  <div key={l} className="bg-surface border border-border rounded-xl p-4 text-center">
                    <span className="font-syne font-extrabold text-2xl block" style={{ color: '#00d4ff' }}>{n}</span>
                    <span className="font-mono text-[10px] text-muted uppercase tracking-widest">{l}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-4 pb-3 border-b border-border">
                <h2 className="font-syne font-bold text-[14px] text-white">Your Questions</h2>
                <span onClick={() => setPage('feed')} className="font-mono text-[10px] text-accent cursor-pointer hover:underline">Browse all →</span>
              </div>
              <div className="bg-surface border border-border rounded-xl p-10 text-center text-muted">
                <div className="text-3xl mb-3">💬</div>
                <div className="font-syne font-bold text-white text-[14px] mb-1">No questions yet</div>
                <div className="text-[12px]">Ask your first question to get started</div>
              </div>
            </div>
          )}
        </main>

        {/* Right panel — only on feed/jobs/templates */}
        {!isFullWidth && (
          <aside className="w-[280px] flex-shrink-0 border-l border-border px-5 py-5">
            {page === 'feed' && (
              <>
                <div className="bg-surface border border-border rounded-xl p-4 mb-4">
                  <h3 className="font-syne font-bold text-[13px] text-white mb-3">Community Stats</h3>
                  {[['1.2k','Questions'],['4.8k','Answers'],['342','Members'],['78%','Answered']].map(([v,l]) => (
                    <div key={l} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                      <span className="font-mono text-[12px] text-muted">{l}</span>
                      <span className="font-syne font-bold text-[13px]" style={{ color: '#00d4ff' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <h3 className="font-syne font-bold text-[13px] text-white mb-3">Top Contributors</h3>
                  {[['SC','s.chen','CISA · FinServ',3420],['AW','a.wilson','CISSP · Tech',2890],['MR','m.reyes','CIA · Consulting',2310],['TP','t.patel','QSA · Retail',2100],['DL','d.liu','CISM · Gov',1890]].map(([init,name,role,rep],i) => (
                    <div key={name} className="flex items-center gap-2.5 mb-3 last:mb-0">
                      <span className="font-mono text-[11px] text-muted w-4">{i+1}</span>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center font-syne font-bold text-[10px] text-white flex-shrink-0"
                        style={{ background: `linear-gradient(${AVATAR_GRADIENTS[i]})` }}>{init}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-syne font-semibold text-[12px] text-white">{name}</div>
                        <div className="font-mono text-[10px] text-muted truncate">{role}</div>
                      </div>
                      <span className="font-mono text-[11px]" style={{ color: '#00d4ff' }}>{rep.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
            {page === 'templates' && (
              <>
                <div className="bg-surface border border-border rounded-xl p-4 mb-4">
                  <h3 className="font-syne font-bold text-[13px] text-white mb-3">Template Stats</h3>
                  {[
                    [templates.length.toString(), 'Total Templates'],
                    [templates.reduce((s,t) => s + t.download_count, 0).toLocaleString(), 'Total Downloads'],
                    [([...templates].sort((a,b) => b.rating_avg - a.rating_avg)[0]?.rating_avg || 0).toFixed(1) + ' ★', 'Top Rating'],
                  ].map(([v,l]) => (
                    <div key={l} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                      <span className="font-mono text-[12px] text-muted">{l}</span>
                      <span className="font-syne font-bold text-[13px]" style={{ color: '#00d4ff' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-surface border border-border rounded-xl p-4">
                  <h3 className="font-syne font-bold text-[13px] text-white mb-3">Most Downloaded</h3>
                  {[...templates].sort((a,b) => b.download_count - a.download_count).slice(0,5).map((t, i) => (
                    <div key={t.id} className="flex items-start gap-2 mb-3 last:mb-0">
                      <span className="font-mono text-[11px] text-muted w-4 flex-shrink-0 mt-0.5">{i+1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-syne font-semibold text-[11px] text-white leading-snug mb-0.5 line-clamp-2">{t.title}</div>
                        <div className="font-mono text-[10px] text-muted">{t.download_count.toLocaleString()} downloads</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </aside>
        )}
      </div>

      {/* Modals */}
      <ProfileModal
        open={showProfileModal}
        mode={profileModalMode}
        profile={profile}
        onClose={() => setShowProfileModal(false)}
        onSave={handleProfileSave}
      />
      <AskModal
        open={showAskModal}
        onClose={() => setShowAskModal(false)}
        onSubmit={handleAskSubmit}
      />
      <ShareTemplateModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        onSubmit={data => {
          const newTemplate: Template = {
            id: Date.now().toString(),
            title: data.title,
            description: data.description,
            category: data.category,
            file_url: '#',
            file_format: data.file_format as any,
            author_id: profile?.id || 'anon',
            author: profile || undefined,
            download_count: 0,
            rating_avg: 0,
            rating_count: 0,
            tags: data.tags,
            created_at: new Date().toISOString(),
          }
          setTemplates(prev => [newTemplate, ...prev])
          setPage('templates')
          setTemplateFilter('all')
        }}
      />
    </>
  )
}
