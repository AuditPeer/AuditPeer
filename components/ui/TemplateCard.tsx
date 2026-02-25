'use client'
import { useState } from 'react'
import { Download, Star } from 'lucide-react'
import { getInitials, timeAgo } from '@/lib/utils'
import type { Template } from '@/types'

interface TemplateCardProps {
  template: Template
  onDownload: (id: string) => void
  delay?: number
}

const FORMAT_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  xlsx: { bg: 'rgba(0,229,160,0.08)', text: '#00e5a0', border: 'rgba(0,229,160,0.2)' },
  docx: { bg: 'rgba(0,212,255,0.08)', text: '#00d4ff', border: 'rgba(0,212,255,0.2)' },
  pdf:  { bg: 'rgba(255,77,106,0.08)', text: '#ff4d6a', border: 'rgba(255,77,106,0.2)' },
  zip:  { bg: 'rgba(123,97,255,0.08)', text: '#7b61ff', border: 'rgba(123,97,255,0.2)' },
}

const FORMAT_ICONS: Record<string, string> = {
  xlsx: '📊', docx: '📝', pdf: '📄', zip: '🗜️',
}

const CATEGORY_COLORS: Record<string, string> = {
  'Evidence':        'rgba(0,212,255,0.08)',
  'Checklists':      'rgba(0,229,160,0.08)',
  'Risk Assessment': 'rgba(123,97,255,0.08)',
  'Reports':         'rgba(251,191,36,0.08)',
  'Policies':        'rgba(255,77,106,0.08)',
}

export default function TemplateCard({ template, onDownload, delay = 0 }: TemplateCardProps) {
  const [downloads, setDownloads] = useState(template.download_count)
  const [downloaded, setDownloaded] = useState(false)

  const fmt = FORMAT_COLORS[template.file_format] || FORMAT_COLORS.docx

  const handleDownload = () => {
    setDownloads(d => d + 1)
    setDownloaded(true)
    onDownload(template.id)
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <div
      className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 transition-all hover:border-accent/30 hover:-translate-y-0.5 animate-fade-slide relative overflow-hidden"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/15 to-transparent"/>

      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category badge */}
          <span className="font-mono text-[10px] px-2 py-0.5 rounded border"
            style={{
              background: CATEGORY_COLORS[template.category] || 'rgba(0,212,255,0.08)',
              color: '#94a3b8',
              borderColor: 'rgba(255,255,255,0.06)',
            }}>
            {template.category}
          </span>
          {/* Format badge */}
          <span className="font-mono text-[11px] px-2 py-0.5 rounded border font-semibold"
            style={{ background: fmt.bg, color: fmt.text, borderColor: fmt.border }}>
            {FORMAT_ICONS[template.file_format]} .{template.file_format.toUpperCase()}
          </span>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Star size={11} className="text-yellow-400 fill-yellow-400"/>
          <span className="font-mono text-[11px] text-yellow-400 font-semibold">{template.rating_avg.toFixed(1)}</span>
          <span className="font-mono text-[10px] text-muted">({template.rating_count})</span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-syne font-bold text-[14px] text-white leading-snug mb-2">
          {template.title}
        </h3>
        <p className="text-[12.5px] text-muted leading-relaxed line-clamp-3">
          {template.description}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {template.tags.map(tag => (
          <span key={tag} className="tag text-[10px]">{tag}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center font-syne font-bold text-[9px] text-white flex-shrink-0"
            style={{ background: `linear-gradient(${template.author?.avatar_gradient || '135deg,#7b61ff,#00d4ff'})` }}>
            {getInitials(template.author?.username || 'AP')}
          </div>
          <div>
            <div className="font-mono text-[10px] text-muted">{template.author?.username}</div>
            <div className="font-mono text-[9px] text-muted/60">{timeAgo(template.created_at)}</div>
          </div>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-syne font-bold text-[12px] transition-all hover:-translate-y-px
            ${downloaded
              ? 'bg-green/10 border border-green/30 text-green'
              : 'text-black hover:opacity-90'}`}
          style={downloaded ? {} : { background: '#00d4ff' }}
        >
          <Download size={12}/>
          {downloaded ? '✓ Saved' : `Download · ${downloads.toLocaleString()}`}
        </button>
      </div>
    </div>
  )
}
