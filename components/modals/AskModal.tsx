'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { TAGS } from '@/lib/utils'

interface AskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: { title: string; body: string; tags: string[] }) => void
}

export default function AskModal({ open, onClose, onSubmit }: AskModalProps) {
  const [title, setTitle]       = useState('')
  const [body, setBody]         = useState('')
  const [selectedTags, setTags] = useState<string[]>([])

  if (!open) return null

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev)

  const handleSubmit = () => {
    if (!title.trim() || !body.trim()) return
    onSubmit({ title: title.trim(), body: body.trim(), tags: selectedTags })
    setTitle(''); setBody(''); setTags([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-fade"
      style={{ background: 'rgba(5,8,18,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-[640px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-slide">

        <div className="sticky top-0 bg-surface border-b border-border px-7 py-5 flex justify-between items-center z-10">
          <h2 className="font-syne font-extrabold text-xl text-white">Ask a Question</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-surface2 border border-border text-muted flex items-center justify-center hover:text-white transition-colors">
            <X size={14}/>
          </button>
        </div>

        <div className="px-7 py-6">
          {/* Guidelines reminder */}
          <div className="bg-accent2/5 border border-accent2/20 rounded-lg p-3 mb-5 text-xs text-muted leading-relaxed">
            <span className="font-semibold text-accent2">📋 Reminder:</span> Never include client names, company names, or any identifying information. Sanitize all examples.
          </div>

          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Question Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} maxLength={200}
            className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-1"
            placeholder="Be specific — what exactly are you trying to figure out?"/>
          <div className="text-right font-mono text-[10px] text-muted mb-4">{title.length}/200</div>

          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Details</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={8}
            className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors resize-none mb-4"
            placeholder="Include context: framework, type of organization, what you've already tried or considered…"/>

          <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
            Tags <span className="normal-case tracking-normal text-[9px]">(up to 5)</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-6">
            {TAGS.map(tag => (
              <button key={tag} onClick={() => toggleTag(tag)}
                className={`font-mono text-[11px] px-2.5 py-1 rounded border transition-all
                  ${selectedTags.includes(tag)
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-tag-bg border-tag-border text-muted hover:border-accent hover:text-accent'}`}>
                {tag}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-5 border-t border-border">
            <button onClick={onClose} className="px-4 py-2 rounded-lg font-syne font-semibold text-[13px] border border-border text-muted hover:text-white transition-all">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!title.trim() || !body.trim()}
              className="px-5 py-2 rounded-lg font-syne font-bold text-[13px] text-black transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: '#00d4ff' }}>
              Post Question →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
