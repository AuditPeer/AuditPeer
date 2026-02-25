'use client'
import { useState } from 'react'
import { getInitials, timeAgo } from '@/lib/utils'
import type { Question } from '@/types'

interface QuestionCardProps {
  question: Question
  onVote: (id: string, value: 1 | -1) => void
  onTagClick: (tag: string) => void
  delay?: number
}

export default function QuestionCard({ question, onVote, onTagClick, delay = 0 }: QuestionCardProps) {
  const [localVote, setLocalVote] = useState<1 | -1 | 0>(question.user_vote || 0)
  const [voteCount, setVoteCount] = useState(question.vote_count)

  const handleVote = (val: 1 | -1) => {
    const newVote = localVote === val ? 0 : val
    const delta = newVote - localVote
    setLocalVote(newVote as 1 | -1 | 0)
    setVoteCount(c => c + delta)
    onVote(question.id, val)
  }

  const answerStat = question.answer_count === 0
    ? <span className="font-mono text-[11px]" style={{ color: '#ff4d6a' }}>● Unanswered</span>
    : <span className={`font-mono text-[11px] ${question.is_answered ? 'text-green' : 'text-muted'}`}>
        {question.is_answered ? '✓' : '💬'} {question.answer_count} answer{question.answer_count !== 1 ? 's' : ''}
      </span>

  return (
    <div
      className="bg-surface border border-border rounded-xl p-5 mb-3 grid cursor-pointer relative overflow-hidden transition-all hover:border-accent/30 hover:translate-x-1 animate-fade-slide"
      style={{
        gridTemplateColumns: '48px 1fr',
        gap: '1rem',
        animationDelay: `${delay}s`,
        borderLeft: question.is_answered ? '3px solid #00e5a0' : '3px solid transparent',
      }}
    >
      {/* Vote column */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <button
          onClick={e => { e.stopPropagation(); handleVote(1) }}
          className={`w-7 h-7 rounded-md border flex items-center justify-center text-sm transition-all
            ${localVote === 1
              ? 'bg-green/10 border-green text-green'
              : 'border-border text-muted hover:border-accent hover:text-accent hover:bg-accent/5'}`}
        >▲</button>
        <span className="font-syne font-bold text-[15px] text-white">{voteCount}</span>
        <button
          onClick={e => { e.stopPropagation(); handleVote(-1) }}
          className={`w-7 h-7 rounded-md border flex items-center justify-center text-sm transition-all
            ${localVote === -1
              ? 'bg-red/10 border-red text-red'
              : 'border-border text-muted hover:border-red hover:text-red hover:bg-red/5'}`}
        >▼</button>
      </div>

      {/* Body */}
      <div className="min-w-0">
        <div className="font-syne font-semibold text-[15px] text-white leading-snug mb-1.5 hover:text-accent transition-colors">
          {question.title}
        </div>
        <div className="text-muted text-[13px] leading-relaxed mb-3 line-clamp-2">
          {question.body}
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {question.tags.map(tag => (
              <span
                key={tag}
                className="tag"
                onClick={e => { e.stopPropagation(); onTagClick(tag) }}
              >{tag}</span>
            ))}
          </div>
          {answerStat}
          <span className="font-mono text-[11px] text-muted">👁 {question.view_count.toLocaleString()} views</span>
          <div className="ml-auto flex items-center gap-1.5 text-muted text-[12px]">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: `linear-gradient(${question.author?.avatar_gradient || '135deg,#7b61ff,#00d4ff'})` }}
            >
              {getInitials(question.author?.username || 'AP')}
            </div>
            <span>{question.author?.username || 'anonymous'} · {timeAgo(question.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
