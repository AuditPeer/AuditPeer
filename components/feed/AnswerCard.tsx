'use client'
import { useState } from 'react'
import { Pencil, Trash2, X, Check } from 'lucide-react'
import { getInitials, timeAgo } from '@/lib/utils'
import type { Answer } from '@/types'

interface AnswerCardProps {
  answer: Answer
  isQuestionAuthor: boolean
  currentUserId?: string
  onVote: (id: string, value: 1 | -1) => void
  onAccept: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, newBody: string) => void
}

export default function AnswerCard({
  answer, isQuestionAuthor, currentUserId,
  onVote, onAccept, onDelete, onEdit
}: AnswerCardProps) {
  const [localVote, setLocalVote] = useState<1 | -1 | 0>(answer.user_vote || 0)
  const [voteCount, setVoteCount] = useState(answer.vote_count)
  const [isEditing, setIsEditing] = useState(false)
  const [editBody, setEditBody]   = useState(answer.body)
  const [body, setBody]           = useState(answer.body)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const isOwner = currentUserId === answer.author_id || answer.author_id === 'me'

  const handleVote = (val: 1 | -1) => {
    const newVote = localVote === val ? 0 : val
    const delta = newVote - localVote
    setLocalVote(newVote as 1 | -1 | 0)
    setVoteCount(c => c + delta)
    onVote(answer.id, val)
  }

  const handleSaveEdit = () => {
    if (!editBody.trim()) return
    setBody(editBody)
    onEdit(answer.id, editBody)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditBody(body)
    setIsEditing(false)
  }

  return (
    <div className={`rounded-xl border p-6 mb-4 transition-all relative overflow-hidden
      ${answer.is_accepted
        ? 'border-green/40 bg-gradient-to-br from-[#0a1f18] to-surface'
        : 'border-border bg-surface'}`}>

      {answer.is_accepted && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-green to-transparent opacity-60"/>
      )}
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
              ${localVote === 1 ? 'bg-green/10 border-green text-green' : 'border-border text-muted hover:border-accent hover:text-accent'}`}>▲</button>
          <span className="font-syne font-bold text-lg text-white">{voteCount}</span>
          <button onClick={() => handleVote(-1)}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center text-sm transition-all
              ${localVote === -1 ? 'bg-red/10 border-red text-red' : 'border-border text-muted hover:border-red hover:text-red'}`}>▼</button>
          {isQuestionAuthor && !answer.is_accepted && (
            <button onClick={() => onAccept(answer.id)} title="Mark as accepted answer"
              className="mt-2 w-8 h-8 rounded-lg border border-border text-muted hover:border-green hover:text-green flex items-center justify-center text-base transition-all">
              ✓
            </button>
          )}
        </div>

        {/* Body */}
        <div>
          {/* Owner actions — top right */}
          {isOwner && !isEditing && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <button onClick={() => setIsEditing(true)}
                title="Edit answer"
                className="w-7 h-7 rounded-md border border-border text-muted hover:border-accent hover:text-accent flex items-center justify-center transition-all">
                <Pencil size={12}/>
              </button>
              {!confirmDelete ? (
                <button onClick={() => setConfirmDelete(true)}
                  title="Delete answer"
                  className="w-7 h-7 rounded-md border border-border text-muted hover:border-red hover:text-red flex items-center justify-center transition-all">
                  <Trash2 size={12}/>
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-surface2 border border-red/30 rounded-lg px-2 py-1">
                  <span className="font-mono text-[10px] text-red">Delete?</span>
                  <button onClick={() => onDelete(answer.id)}
                    className="w-5 h-5 rounded bg-red/15 text-red hover:bg-red/25 flex items-center justify-center transition-all">
                    <Check size={10}/>
                  </button>
                  <button onClick={() => setConfirmDelete(false)}
                    className="w-5 h-5 rounded bg-surface text-muted hover:text-white flex items-center justify-center transition-all">
                    <X size={10}/>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Body — view or edit mode */}
          {isEditing ? (
            <div className="mb-4">
              <textarea
                value={editBody}
                onChange={e => setEditBody(e.target.value)}
                rows={8}
                className="w-full bg-surface2 border border-accent/40 rounded-xl px-4 py-3 text-[13.5px] text-white outline-none focus:border-accent transition-colors resize-none mb-3 leading-relaxed"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={handleCancelEdit}
                  className="px-3 py-1.5 rounded-lg font-syne font-semibold text-[12px] border border-border text-muted hover:text-white transition-all">
                  Cancel
                </button>
                <button onClick={handleSaveEdit} disabled={!editBody.trim()}
                  className="px-4 py-1.5 rounded-lg font-syne font-bold text-[12px] text-black transition-all hover:-translate-y-px disabled:opacity-40"
                  style={{ background: '#00d4ff' }}>
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="prose-audit mb-5 whitespace-pre-wrap">{body}</div>
          )}

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
