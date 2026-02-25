'use client'
import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { generateUsername, getInitials, INDUSTRIES, CERTIFICATIONS, EXPERIENCE_RANGES, AVATAR_GRADIENTS } from '@/lib/utils'
import type { Profile } from '@/types'

interface ProfileModalProps {
  open: boolean
  mode: 'signup' | 'edit'
  profile: Profile | null
  onClose: () => void
  onSave: (data: Partial<Profile>) => void
}

const STEPS = ['Identity', 'Role', 'Avatar']

export default function ProfileModal({ open, mode, profile, onClose, onSave }: ProfileModalProps) {
  const [view, setView]           = useState<'login' | 'signup'>('login')
  const [step, setStep]           = useState(1)
  const [username, setUsername]   = useState('')
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [jobTitle, setJobTitle]   = useState('')
  const [industry, setIndustry]   = useState('')
  const [experience, setExperience] = useState('')
  const [certs, setCerts]         = useState<string[]>([])
  const [avatarGrad, setAvatarGrad] = useState(AVATAR_GRADIENTS[0])
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    if (!open) return
    setStep(1)
    setLoginError('')
    if (mode === 'edit' && profile) {
      setView('signup') // reuse signup steps for edit
      setUsername(profile.username)
      setJobTitle(profile.job_title || '')
      setIndustry(profile.industry || '')
      setExperience(profile.experience || '')
      setCerts(profile.certifications || [])
      setAvatarGrad(profile.avatar_gradient || AVATAR_GRADIENTS[0])
    } else {
      setView('login')
      setUsername(generateUsername())
      setEmail(''); setPassword(''); setJobTitle('')
      setIndustry(''); setExperience(''); setCerts([])
      setAvatarGrad(AVATAR_GRADIENTS[0])
    }
  }, [open, mode, profile])

  if (!open) return null

  const initials = getInitials(username) || '?'
  const isEdit = mode === 'edit'

  const toggleCert = (cert: string) =>
    setCerts(prev => prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert])

  const handleSave = () => {
    onSave({ username, job_title: jobTitle, industry, experience, certifications: certs, avatar_gradient: avatarGrad })
    onClose()
  }

  // Simulate login — in production this hits Supabase Auth
  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      setLoginError('Please enter your email and password.')
      return
    }
    // For demo: any email/password logs you in as a guest
    onSave({ username: email.split('@')[0], avatar_gradient: AVATAR_GRADIENTS[0], certifications: [] })
    onClose()
  }

  // ── LOGIN VIEW ─────────────────────────────────────────────
  if (view === 'login' && !isEdit) {
    return (
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-fade"
        style={{ background: 'rgba(5,8,18,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose() }}>
        <div className="bg-surface border border-border rounded-2xl w-full max-w-[420px] shadow-2xl animate-fade-slide">

          {/* Header */}
          <div className="border-b border-border px-7 py-5 flex justify-between items-start">
            <div>
              <h2 className="font-syne font-extrabold text-xl text-white">Welcome back</h2>
              <p className="text-muted text-xs mt-0.5">Sign in to your AuditPeer account</p>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-surface2 border border-border text-muted flex items-center justify-center hover:text-white transition-colors">
              <X size={14}/>
            </button>
          </div>

          <div className="px-7 py-6">
            {/* Logo mark */}
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: 'linear-gradient(135deg, #00d4ff, #7b61ff)' }}>🔐</div>
            </div>

            {loginError && (
              <div className="bg-red/8 border border-red/25 rounded-lg px-3 py-2 text-[12px] text-red mb-4">
                {loginError}
              </div>
            )}

            <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setLoginError('') }}
              className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-4"
              placeholder="your@email.com"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}/>

            <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setLoginError('') }}
              className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-1"
              placeholder="Your password"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}/>

            <div className="text-right mb-6">
              <span className="font-mono text-[11px] text-accent cursor-pointer hover:underline">Forgot password?</span>
            </div>

            <button onClick={handleLogin}
              className="w-full py-2.5 rounded-lg font-syne font-bold text-[14px] text-black transition-all hover:-translate-y-px mb-4"
              style={{ background: '#00d4ff' }}>
              Sign In →
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border"/>
              <span className="font-mono text-[10px] text-muted">or</span>
              <div className="flex-1 h-px bg-border"/>
            </div>

            {/* Switch to signup */}
            <div className="text-center">
              <span className="text-[13px] text-muted">Don't have an account? </span>
              <span
                onClick={() => { setView('signup'); setLoginError('') }}
                className="text-[13px] font-syne font-bold cursor-pointer hover:underline"
                style={{ color: '#00d4ff' }}>
                Create one free →
              </span>
            </div>

            {/* Privacy note */}
            <div className="mt-5 text-center font-mono text-[10px] text-muted/60 leading-relaxed">
              🔒 Your real identity is never shown to the community.<br/>Anonymous usernames only.
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── SIGNUP / EDIT VIEW ────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-fade"
      style={{ background: 'rgba(5,8,18,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-slide">

        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-7 py-5 flex justify-between items-start z-10">
          <div>
            <h2 className="font-syne font-extrabold text-xl text-white">
              {isEdit ? 'Edit Profile' : 'Create Your Profile'}
            </h2>
            <p className="text-muted text-xs mt-0.5">
              {isEdit ? 'Update your community identity' : 'Set up your anonymous identity — no real name needed'}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-surface2 border border-border text-muted flex items-center justify-center hover:text-white transition-colors">
            <X size={14}/>
          </button>
        </div>

        <div className="px-7 py-6">
          {/* Step dots */}
          <div className="flex mb-7">
            {STEPS.map((label, i) => {
              const n = i + 1
              const isActive = n === step
              const isDone   = n < step
              return (
                <div key={label} className="flex-1 flex flex-col items-center relative">
                  {n < STEPS.length && (
                    <div className="absolute top-3.5 left-1/2 w-full h-px bg-border z-0"/>
                  )}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono z-10 border-2 transition-all
                    ${isDone   ? 'bg-green border-green text-black font-bold'
                    : isActive ? 'border-accent bg-accent/10 text-accent font-bold'
                    :            'bg-surface2 border-border text-muted'}`}>
                    {isDone ? '✓' : n}
                  </div>
                  <span className={`text-[9px] font-mono uppercase tracking-widest mt-1 ${isActive ? 'text-accent' : 'text-muted'}`}>{label}</span>
                </div>
              )
            })}
          </div>

          {/* ── Step 1: Identity ── */}
          {step === 1 && (
            <div>
              <div className="bg-accent/5 border border-accent/15 rounded-lg p-3 mb-5 flex gap-2 text-xs text-muted leading-relaxed">
                <span className="text-sm flex-shrink-0">🔒</span>
                Your real name is never required. Your username is all the community sees.
              </div>

              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Username</label>
              <div className="flex gap-2 mb-4">
                <input value={username} onChange={e => setUsername(e.target.value)} maxLength={30}
                  className="flex-1 bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors"
                  placeholder="e.g. SilentAuditor42"/>
                <button onClick={() => setUsername(generateUsername())}
                  className="px-3 py-2.5 bg-surface2 border border-border rounded-lg font-mono text-[11px] text-muted hover:border-accent hover:text-accent transition-all whitespace-nowrap">
                  🎲 Random
                </button>
              </div>

              {!isEdit && <>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">
                  Email <span className="normal-case tracking-normal text-[9px]">(private — notifications only)</span>
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-4"
                  placeholder="your@email.com"/>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-4"
                  placeholder="Min. 8 characters"/>

                {/* Already have account link */}
                <div className="text-center mt-2">
                  <span className="text-[12px] text-muted">Already have an account? </span>
                  <span onClick={() => setView('login')}
                    className="text-[12px] font-syne font-bold cursor-pointer hover:underline"
                    style={{ color: '#00d4ff' }}>
                    Sign in instead
                  </span>
                </div>
              </>}
            </div>
          )}

          {/* ── Step 2: Role ── */}
          {step === 2 && (
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Job Title</label>
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-4"
                placeholder="e.g. Senior IT Auditor, GRC Analyst…"/>

              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Industry</label>
              <select value={industry} onChange={e => setIndustry(e.target.value)}
                className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-4 appearance-none cursor-pointer">
                <option value="">Select industry…</option>
                {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
              </select>

              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Years of Experience</label>
              <select value={experience} onChange={e => setExperience(e.target.value)}
                className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-4 appearance-none cursor-pointer">
                <option value="">Select range…</option>
                {EXPERIENCE_RANGES.map(r => <option key={r}>{r}</option>)}
              </select>

              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                Certifications <span className="normal-case tracking-normal text-[9px]">(select all that apply)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CERTIFICATIONS.map(cert => (
                  <button key={cert} onClick={() => toggleCert(cert)}
                    className={`font-mono text-[11px] px-3 py-1.5 rounded-md border transition-all
                      ${certs.includes(cert)
                        ? 'bg-accent2/15 border-accent2 text-accent2'
                        : 'bg-tag-bg border-tag-border text-muted hover:border-accent2 hover:text-accent2'}`}>
                    {cert}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Avatar ── */}
          {step === 3 && (
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-3">Choose your avatar color</label>
              <div className="flex gap-3 flex-wrap mb-6">
                {AVATAR_GRADIENTS.map(grad => (
                  <button key={grad} onClick={() => setAvatarGrad(grad)}
                    className={`w-11 h-11 rounded-full transition-all hover:scale-110 ${avatarGrad === grad ? 'ring-2 ring-white ring-offset-2 ring-offset-surface scale-110' : ''}`}
                    style={{ background: `linear-gradient(${grad})` }}/>
                ))}
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-20 h-20 rounded-full flex items-center justify-center font-syne font-extrabold text-3xl text-white border-3 border-border"
                  style={{ background: `linear-gradient(${avatarGrad})` }}>
                  {initials}
                </div>
                <p className="font-mono text-[11px] text-muted">Your community avatar</p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-7 pt-5 border-t border-border">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
              className="px-4 py-2 rounded-lg font-syne font-semibold text-[13px] border border-border text-muted hover:text-white hover:border-muted transition-all">
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            <button onClick={() => step < 3 ? setStep(s => s + 1) : handleSave()}
              className="px-5 py-2 rounded-lg font-syne font-bold text-[13px] text-black transition-all hover:-translate-y-px"
              style={{ background: '#00d4ff' }}>
              {step === 3 ? '🎉 Save Profile' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
