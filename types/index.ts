// ─── User / Profile ─────────────────────────────────────────────
export interface Profile {
  id: string
  username: string
  job_title: string | null
  industry: string | null
  experience: string | null
  certifications: string[]
  avatar_gradient: string
  is_anonymous: boolean
  reputation: number
  created_at: string
}

// ─── Questions ──────────────────────────────────────────────────
export interface Question {
  id: string
  title: string
  body: string
  author_id: string
  author?: Profile
  tags: string[]
  vote_count: number
  answer_count: number
  view_count: number
  is_answered: boolean
  user_vote?: -1 | 0 | 1
  created_at: string
  updated_at: string
}

// ─── Answers ────────────────────────────────────────────────────
export interface Answer {
  id: string
  question_id: string
  body: string
  author_id: string
  author?: Profile
  vote_count: number
  is_accepted: boolean
  user_vote?: -1 | 0 | 1
  created_at: string
  updated_at: string
}

// ─── Templates ──────────────────────────────────────────────────
export interface Template {
  id: string
  title: string
  description: string
  category: string
  file_url: string
  file_format: 'xlsx' | 'docx' | 'pdf' | 'zip'
  author_id: string
  author?: Profile
  download_count: number
  rating_avg: number
  rating_count: number
  tags: string[]
  created_at: string
}

// ─── Votes ──────────────────────────────────────────────────────
export interface Vote {
  id: string
  user_id: string
  target_id: string
  target_type: 'question' | 'answer'
  value: 1 | -1
  created_at: string
}

// ─── Feed filters ───────────────────────────────────────────────
export type FeedFilter = 'newest' | 'top' | 'unanswered' | 'hot' | 'bookmarked'

export type TemplateCategory =
  | 'all'
  | 'Evidence'
  | 'Risk Assessment'
  | 'Checklists'
  | 'Reports'
  | 'Policies'
