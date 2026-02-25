'use client'
import { useState } from 'react'
import { getInitials, timeAgo } from '@/lib/utils'
import type { Answer } from '@/types'

interface AnswerCardProps {
  answer: Answer
  isQuestionAuthor: boolean
  onVote: (id: string, value: 1 | -1) => void
  onAccept: (id: string) => void
}

export default function AnswerCard({ answer, isQuestionAuthor, onVote, onAccept }: AnswerCardProps) {
  const [localVote, setLocalVote] = useState<1 | -1 | 0>(answer.user_vote || 0)
  const [voteCount, setVoteCount] = useState(answer.vote_count)

  const handleVote = (val: 1 | -1) => {
    const newVote = localVote === val ? 0 : val
    const delta = newVote - localVote
    setLocalVote(newVote as 1 | -1 | 0)
    setVoteCount(c => c + delta)
    onVote(answer.id, val)
  }

  return (
    <div className={`rounded-xl border p-6 mb-4 transition-all relative overflow-hidden
      ${answer.is_accepted
        ? 'border-green/40 bg-gradient-to-br from-[#0a1f18] to-surface'
        : 'border-border bg-surface hover:border-border/80'}`}>

      {/* Accepted top bar */}
      {answer.is_accepted && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green to-transparent opacity-60"/>
      )}

      {/* Accepted badge */}
      {answer.is_accepted && (
        <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-green bg-green/10 border border-green/25 px-2.5 py-1 rounded mb-4">
          ✓ Accepted Answer
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '48px 1fr', gap: '1.25rem' }}>
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1.5 pt-1">
          <button onClick={() => handleVote(1)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all
              ${localVote === 1
                ? 'bg-green/10 border-green text-green'
                : 'border-border text-muted hover:border-accent hover:text-accent'}`}>▲</button>
          <span className="font-syne font-bold text-lg text-white">{voteCount}</span>
          <button onClick={() => handleVote(-1)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all
              ${localVote === -1
                ? 'bg-red/10 border-red text-red'
                : 'border-border text-muted hover:border-red hover:text-red'}`}>▼</button>

          {/* Accept button — only shown to question author */}
          {isQuestionAuthor && !answer.is_accepted && (
            <button onClick={() => onAccept(answer.id)}
              title="Mark as accepted answer"
              className="mt-2 w-8 h-8 rounded-lg border border-border text-muted hover:border-green hover:text-green flex items-center justify-center text-base transition-all">
              ✓
            </button>
          )}
        </div>

        {/* Body */}
        <div>
          <div className="prose-audit mb-5 whitespace-pre-wrap">{answer.body}</div>

          {/* Author + time */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-syne font-bold text-[10px] text-white flex-shrink-0"
                style={{ background: `linear-gradient(${answer.author?.avatar_gradient || '135deg,#7b61ff,#00d4ff'})` }}>
                {getInitials(answer.author?.username || 'AP')}
              </div>
              <div>
                <div className="font-syne font-semibold text-[12px] text-white">{answer.author?.username || 'anonymous'}</div>
                <div className="font-mono text-[10px] text-muted">
                  {[answer.author?.job_title, answer.author?.industry].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>
            <span className="font-mono text-[11px] text-muted">{timeAgo(answer.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
