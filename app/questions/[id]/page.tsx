'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Eye, MessageSquare } from 'lucide-react'
import AnswerCard from '@/components/feed/AnswerCard'
import { QUESTIONS_SEED } from '@/lib/seed'
import { ANSWERS_SEED } from '@/lib/seed-answers'
import { getInitials, timeAgo, AVATAR_GRADIENTS } from '@/lib/utils'
import type { Question, Answer } from '@/types'

export default function QuestionPage() {
  const params   = useParams()
  const router   = useRouter()
  const id       = params.id as string

  const [question, setQuestion] = useState<Question | null>(null)
  const [answers, setAnswers]   = useState<Answer[]>([])
  const [answerBody, setAnswerBody] = useState('')
  const [submitted, setSubmitted]   = useState(false)
  const [voteCount, setVoteCount]   = useState(0)
  const [localVote, setLocalVote]   = useState<1 | -1 | 0>(0)

  useEffect(() => {
    const q = QUESTIONS_SEED.find(q => q.id === id)
    if (q) {
      setQuestion(q)
      setVoteCount(q.vote_count)
      setLocalVote(q.user_vote || 0)
    }
    const a = ANSWERS_SEED.filter(a => a.question_id === id)
    setAnswers(a.sort((a, b) => {
      if (a.is_accepted) return -1
      if (b.is_accepted) return 1
      return b.vote_count - a.vote_count
    }))
  }, [id])

  const handleVoteQuestion = (val: 1 | -1) => {
    const newVote = localVote === val ? 0 : val
    const delta = newVote - localVote
    setLocalVote(newVote as 1 | -1 | 0)
    setVoteCount(c => c + delta)
  }

  const handleVoteAnswer = (answerId: string, val: 1 | -1) => {
    setAnswers(prev => prev.map(a => {
      if (a.id !== answerId) return a
      const newVote = a.user_vote === val ? 0 : val
      const delta = (newVote as number) - (a.user_vote as number || 0)
      return { ...a, vote_count: a.vote_count + delta, user_vote: newVote as 1 | -1 | 0 }
    }))
  }

  const handleAccept = (answerId: string) => {
    setAnswers(prev => prev.map(a => ({ ...a, is_accepted: a.id === answerId })))
    setQuestion(q => q ? { ...q, is_answered: true } : q)
  }

  const handleSubmitAnswer = () => {
    if (!answerBody.trim()) return
    const newAnswer: Answer = {
      id: Date.now().toString(),
      question_id: id,
      body: answerBody.trim(),
      author_id: 'me',
      author: {
        id: 'me', username: 'You', job_title: null, industry: null,
        experience: null, certifications: [], is_anonymous: true,
        avatar_gradient: AVATAR_GRADIENTS[0], reputation: 0,
        created_at: new Date().toISOString(),
      },
      vote_count: 0, is_accepted: false, user_vote: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    setAnswers(prev => [...prev, newAnswer])
    setQuestion(q => q ? { ...q, answer_count: q.answer_count + 1 } : q)
    setAnswerBody('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  if (!question) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-muted font-mono text-sm">Question not found</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-xl h-[60px] flex items-center px-8 gap-4">
        <button onClick={() => router.back()}
          className="flex items-center gap-2 text-muted hover:text-white transition-colors font-syne font-semibold text-[13px]">
          <ArrowLeft size={16}/> Back to Feed
        </button>
        <div className="h-4 w-px bg-border"/>
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
          <div className="w-6 h-6 rounded-[5px] flex items-center justify-center text-xs"
            style={{ background: 'linear-gradient(135deg, #00d4ff, #7b61ff)' }}>🔐</div>
          <span className="font-syne font-extrabold text-[1rem] tracking-tight text-white">
            Audit<span style={{ color: '#00d4ff' }}>Peer</span>
          </span>
        </div>
      </header>

      <div className="max-w-[860px] mx-auto px-6 py-8">

        {/* Question */}
        <div className="mb-8">
          {/* Status badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {question.is_answered && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-green bg-green/10 border border-green/25 px-2.5 py-1 rounded">
                ✓ Answered
              </span>
            )}
            {question.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-syne font-extrabold text-[1.6rem] leading-snug tracking-tight text-white mb-6">
            {question.title}
          </h1>

          <div className="grid" style={{ gridTemplateColumns: '48px 1fr', gap: '1.5rem' }}>
            {/* Vote column */}
            <div className="flex flex-col items-center gap-2 pt-1">
              <button onClick={() => handleVoteQuestion(1)}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all
                  ${localVote === 1
                    ? 'bg-green/10 border-green text-green'
                    : 'border-border text-muted hover:border-accent hover:text-accent'}`}>▲</button>
              <span className="font-syne font-bold text-xl text-white">{voteCount}</span>
              <button onClick={() => handleVoteQuestion(-1)}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all
                  ${localVote === -1
                    ? 'bg-red/10 border-red text-red'
                    : 'border-border text-muted hover:border-red hover:text-red'}`}>▼</button>
            </div>

            {/* Body */}
            <div>
              <div className="prose-audit mb-6 whitespace-pre-wrap text-[14.5px] leading-relaxed">
                {question.body}
              </div>

              {/* Meta row */}
              <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-3">
                <div className="flex items-center gap-4 text-muted font-mono text-[11px]">
                  <span className="flex items-center gap-1"><Eye size={12}/> {question.view_count.toLocaleString()} views</span>
                  <span className="flex items-center gap-1"><MessageSquare size={12}/> {question.answer_count} answer{question.answer_count !== 1 ? 's' : ''}</span>
                  <span>Asked {timeAgo(question.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-syne font-bold text-[10px] text-white"
                    style={{ background: `linear-gradient(${question.author?.avatar_gradient || '135deg,#7b61ff,#00d4ff'})` }}>
                    {getInitials(question.author?.username || 'AP')}
                  </div>
                  <div>
                    <div className="font-syne font-semibold text-[12px] text-white">{question.author?.username}</div>
                    <div className="font-mono text-[10px] text-muted">
                      {[question.author?.job_title, question.author?.certifications?.[0]].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-8"/>

        {/* Answers section */}
        {answers.length > 0 && (
          <>
            <h2 className="font-syne font-bold text-[16px] text-white mb-5 flex items-center gap-2">
              <span style={{ color: '#00d4ff' }}>{answers.length}</span>
              Answer{answers.length !== 1 ? 's' : ''}
            </h2>
            {answers.map(answer => (
              <AnswerCard
                key={answer.id}
                answer={answer}
                isQuestionAuthor={false}
                onVote={handleVoteAnswer}
                onAccept={handleAccept}
              />
            ))}
            <div className="h-px bg-border my-8"/>
          </>
        )}

        {/* Post answer */}
        <div>
          <h2 className="font-syne font-bold text-[16px] text-white mb-5">Your Answer</h2>

          {/* Guidelines reminder */}
          <div className="bg-accent2/5 border border-accent2/20 rounded-lg p-3 mb-4 text-[12px] text-muted leading-relaxed">
            <span className="font-semibold text-accent2">📋 Reminder:</span> Never include client names, company names, or identifying details. Cite your reasoning and reference the relevant framework or control where possible.
          </div>

          <textarea
            value={answerBody}
            onChange={e => setAnswerBody(e.target.value)}
            rows={10}
            placeholder="Share your experience, explain your reasoning, cite the relevant control or framework clause…"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-[13.5px] text-white outline-none focus:border-accent transition-colors resize-none mb-4 leading-relaxed"
          />

          <div className="flex items-center justify-between">
            <div className="font-mono text-[11px] text-muted">
              {answerBody.length > 0 ? `${answerBody.length} characters` : 'Markdown supported'}
            </div>
            <div className="flex items-center gap-3">
              {submitted && (
                <span className="font-mono text-[12px] text-green animate-fade">✓ Answer posted!</span>
              )}
              <button
                onClick={handleSubmitAnswer}
                disabled={!answerBody.trim()}
                className="px-5 py-2.5 rounded-lg font-syne font-bold text-[13px] text-black transition-all hover:-translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={{ background: '#00d4ff' }}>
                Post Your Answer →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
