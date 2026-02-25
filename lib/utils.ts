const ADJECTIVES = [
  'Silent', 'Phantom', 'Covert', 'Stealth', 'Shadow', 'Cryptic',
  'Discrete', 'Secure', 'Vigilant', 'Astute', 'Diligent', 'Resilient',
  'Careful', 'Tactical', 'Precise', 'Methodical', 'Thorough', 'Keen',
]

const NOUNS = [
  'Auditor', 'Assessor', 'Analyst', 'Reviewer', 'Inspector', 'Examiner',
  'Investigator', 'Validator', 'Controller', 'Advisor', 'Specialist', 'Practitioner',
]

export function generateUsername(): string {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)]
  const num  = Math.floor(Math.random() * 900) + 10
  return `${adj}${noun}${num}`
}

export function getInitials(username: string): string {
  if (!username) return '??'
  const words = username.replace(/([A-Z])/g, ' $1').trim().split(' ')
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return username.slice(0, 2).toUpperCase()
}

export function timeAgo(dateStr: string): string {
  const now  = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diff < 60)   return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return `${Math.floor(diff / 604800)}w ago`
}

export const INDUSTRIES = [
  'Financial Services / Banking',
  'Healthcare / Life Sciences',
  'Technology / SaaS',
  'Government / Public Sector',
  'Consulting / Professional Services',
  'Retail / E-commerce',
  'Energy / Utilities',
  'Insurance',
  'Manufacturing',
  'Education',
  'Other',
]

export const CERTIFICATIONS = [
  'CISA', 'CISM', 'CISSP', 'CCSP', 'CIA',
  'QSA', 'CRISC', 'CDPSE', 'CEH', 'OSCP', 'CPA',
]

export const EXPERIENCE_RANGES = [
  '0–2 years', '3–5 years', '6–10 years', '11–15 years', '15+ years',
]

export const TAGS = [
  'SOC 2', 'ISO 27001', 'NIST', 'PCIDSS', 'SOX', 'CMMC',
  'GDPR', 'HIPAA', 'zero-trust', 'cloud', 'IAM', 'SIEM',
  'logging', 'evidence', 'risk', 'access-control', 'penetration',
]

export const AVATAR_GRADIENTS = [
  '135deg, #00d4ff, #7b61ff',
  '135deg, #00e5a0, #0891b2',
  '135deg, #fbbf24, #f97316',
  '135deg, #ff4d6a, #7b61ff',
  '135deg, #a78bfa, #ec4899',
  '135deg, #f97316, #fbbf24',
  '135deg, #00d4ff, #00e5a0',
  '135deg, #ec4899, #f97316',
]
