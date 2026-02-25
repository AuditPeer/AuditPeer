'use client'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types'

interface HeaderProps {
  profile: Profile | null
  onLoginClick: () => void
  onProfileClick: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  ctaLabel: string
  onCtaClick: () => void
  showCta: boolean
}

export default function Header({
  profile,
  onLoginClick,
  onProfileClick,
  searchQuery,
  onSearchChange,
  ctaLabel,
  onCtaClick,
  showCta,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl h-[60px] flex items-center justify-between px-8">

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => window.location.href = '/'}>
        <div className="w-7 h-7 rounded-[6px] flex items-center justify-center text-sm"
          style={{ background: 'linear-gradient(135deg, #00d4ff, #7b61ff)' }}>
          🔐
        </div>
        <span className="font-syne font-extrabold text-[1.15rem] tracking-tight text-white">
          Audit<span style={{ color: '#00d4ff' }}>Peer</span>
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted w-3.5 h-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search questions, templates…"
          className="w-full bg-surface2 border border-border rounded-lg pl-9 pr-4 py-1.5 text-[12px] font-mono text-white placeholder-muted outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(0,212,255,0.08)]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {!profile ? (
          <button
            onClick={onLoginClick}
            className="px-4 py-1.5 rounded-lg font-syne font-semibold text-[13px] text-muted border border-border bg-transparent hover:text-white hover:border-muted transition-all"
          >
            Log in / Sign up
          </button>
        ) : null}

        {showCta && (
          <button
            onClick={onCtaClick}
            className="px-4 py-1.5 rounded-lg font-syne font-bold text-[13px] text-black transition-all hover:-translate-y-px"
            style={{ background: '#00d4ff' }}
          >
            {ctaLabel}
          </button>
        )}

        {profile ? (
          <button
            onClick={onProfileClick}
            className="w-8 h-8 rounded-full flex items-center justify-center font-syne font-bold text-[12px] text-white border-2 border-border cursor-pointer transition-all hover:border-accent"
            style={{ background: `linear-gradient(${profile.avatar_gradient})` }}
          >
            {getInitials(profile.username)}
          </button>
        ) : (
          <div
            onClick={onLoginClick}
            className="w-8 h-8 rounded-full flex items-center justify-center font-syne font-bold text-[12px] text-white border-2 border-border cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #7b61ff, #00d4ff)' }}
          >
            ?
          </div>
        )}
      </div>
    </header>
  )
}
