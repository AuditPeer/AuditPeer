'use client'
import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { TAGS } from '@/lib/utils'

const CATEGORIES = ['Evidence', 'Checklists', 'Risk Assessment', 'Reports', 'Policies']
const FORMATS = ['xlsx', 'docx', 'pdf', 'zip'] as const

interface ShareTemplateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string
    category: string
    file_format: string
    tags: string[]
    fileName: string
  }) => void
}

export default function ShareTemplateModal({ open, onClose, onSubmit }: ShareTemplateModalProps) {
  const [step, setStep]             = useState(1)
  const [title, setTitle]           = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory]     = useState('')
  const [format, setFormat]         = useState('')
  const [selectedTags, setTags]     = useState<string[]>([])
  const [fileName, setFileName]     = useState('')
  const [sanitized, setSanitized]   = useState(false)
  const [dragging, setDragging]     = useState(false)

  if (!open) return null

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : prev.length < 5 ? [...prev, tag] : prev)

  const handleFile = (file: File) => {
    setFileName(file.name)
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    if (FORMATS.includes(ext as any)) setFormat(ext)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleSubmit = () => {
    onSubmit({ title, description, category, file_format: format, tags: selectedTags, fileName })
    // Reset
    setStep(1); setTitle(''); setDescription(''); setCategory('')
    setFormat(''); setTags([]); setFileName(''); setSanitized(false)
    onClose()
  }

  const canProceedStep1 = title.trim() && description.trim() && category && format
  const canProceedStep2 = selectedTags.length > 0
  const canSubmit = fileName && sanitized

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 animate-fade"
      style={{ background: 'rgba(5,8,18,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-surface border border-border rounded-2xl w-full max-w-[580px] max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-slide">

        {/* Header */}
        <div className="sticky top-0 bg-surface border-b border-border px-7 py-5 flex justify-between items-center z-10">
          <div>
            <h2 className="font-syne font-extrabold text-xl text-white">Share a Template</h2>
            <p className="text-muted text-xs mt-0.5">Contribute to the community — all files must be fully sanitized</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-surface2 border border-border text-muted flex items-center justify-center hover:text-white transition-colors">
            <X size={14}/>
          </button>
        </div>

        <div className="px-7 py-6">

          {/* Step indicators */}
          <div className="flex mb-7">
            {['Details', 'Tags', 'Upload'].map((label, i) => {
              const n = i + 1
              return (
                <div key={label} className="flex-1 flex flex-col items-center relative">
                  {n < 3 && <div className="absolute top-3.5 left-1/2 w-full h-px bg-border z-0"/>}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-mono z-10 border-2 transition-all
                    ${n < step   ? 'bg-green border-green text-black font-bold'
                    : n === step ? 'border-accent bg-accent/10 text-accent font-bold'
                    :              'bg-surface2 border-border text-muted'}`}>
                    {n < step ? '✓' : n}
                  </div>
                  <span className={`text-[9px] font-mono uppercase tracking-widest mt-1 ${n === step ? 'text-accent' : 'text-muted'}`}>{label}</span>
                </div>
              )
            })}
          </div>

          {/* ── Step 1: Details ── */}
          {step === 1 && (
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Template Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} maxLength={120}
                className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors mb-4"
                placeholder="e.g. SOC 2 Evidence Tracker, ISO 27001 Audit Checklist…"/>

              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4}
                className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors resize-none mb-4"
                placeholder="What does this template do? What framework does it cover? What makes it useful?"/>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors appearance-none cursor-pointer">
                    <option value="">Select…</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-1.5">File Format</label>
                  <select value={format} onChange={e => setFormat(e.target.value)}
                    className="w-full bg-surface2 border border-border rounded-lg px-3 py-2.5 text-[13px] text-white outline-none focus:border-accent transition-colors appearance-none cursor-pointer">
                    <option value="">Select…</option>
                    {FORMATS.map(f => <option key={f}>.{f.toUpperCase()}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Tags ── */}
          {step === 2 && (
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-muted mb-2">
                Tags <span className="normal-case tracking-normal text-[9px]">(select up to 5 — choose what frameworks/topics this covers)</span>
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {TAGS.map(tag => (
                  <button key={tag} onClick={() => toggleTag(tag)}
                    className={`font-mono text-[11px] px-2.5 py-1.5 rounded border transition-all
                      ${selectedTags.includes(tag)
                        ? 'bg-accent/10 border-accent text-accent'
                        : 'bg-tag-bg border-tag-border text-muted hover:border-accent hover:text-accent'}`}>
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="font-mono text-[11px] text-accent">
                  Selected: {selectedTags.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Upload ── */}
          {step === 3 && (
            <div>
              {/* Sanitization warning */}
              <div className="bg-red/5 border border-red/25 rounded-xl p-4 mb-5">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">⚠️</span>
                  <div>
                    <div className="font-syne font-bold text-[13px] text-white mb-1">Sanitization Required</div>
                    <p className="text-[12px] text-muted leading-relaxed">
                      Before uploading, confirm your file contains <strong className="text-white">no client names</strong>, <strong className="text-white">no company names</strong>, <strong className="text-white">no internal reference numbers</strong>, and <strong className="text-white">no engagement details</strong>. Files failing this check will be removed immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center mb-5 transition-all cursor-pointer
                  ${dragging
                    ? 'border-accent bg-accent/5'
                    : fileName
                      ? 'border-green/40 bg-green/5'
                      : 'border-border hover:border-accent/50 hover:bg-accent/3'}`}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input id="fileInput" type="file" className="hidden"
                  accept=".xlsx,.docx,.pdf,.zip"
                  onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]) }}/>
                {fileName ? (
                  <>
                    <div className="text-3xl mb-2">✓</div>
                    <div className="font-syne font-bold text-[14px] text-green mb-1">{fileName}</div>
                    <div className="font-mono text-[11px] text-muted">Click to change file</div>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-muted mx-auto mb-3"/>
                    <div className="font-syne font-bold text-[14px] text-white mb-1">Drop your file here</div>
                    <div className="font-mono text-[11px] text-muted">or click to browse · .xlsx .docx .pdf .zip · max 10MB</div>
                  </>
                )}
              </div>

              {/* Sanitization checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={sanitized} onChange={e => setSanitized(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-accent cursor-pointer flex-shrink-0"/>
                <span className="text-[12.5px] text-muted leading-relaxed">
                  I confirm this file has been fully sanitized and contains no client names, company names, internal reference numbers, or any identifying information.
                </span>
              </label>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center mt-7 pt-5 border-t border-border">
            <button onClick={() => step > 1 ? setStep(s => s - 1) : onClose()}
              className="px-4 py-2 rounded-lg font-syne font-semibold text-[13px] border border-border text-muted hover:text-white hover:border-muted transition-all">
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            <button
              onClick={() => step < 3 ? setStep(s => s + 1) : handleSubmit()}
              disabled={step === 1 ? !canProceedStep1 : step === 2 ? !canProceedStep2 : !canSubmit}
              className="px-5 py-2 rounded-lg font-syne font-bold text-[13px] text-black transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{ background: '#00d4ff' }}>
              {step === 3 ? '📤 Submit Template' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
