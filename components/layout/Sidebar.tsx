'use client'
import { TAGS } from '@/lib/utils'
import type { FeedFilter } from '@/types'

type Page = 'feed' | 'jobs' | 'templates' | 'guidelines' | 'profile'

interface SidebarProps {
  currentPage: Page
  feedFilter: FeedFilter
  onPageChange: (page: Page) => void
  onFeedFilter: (filter: FeedFilter) => void
}

export default function Sidebar({ currentPage, feedFilter, onPageChange, onFeedFilter }: SidebarProps) {
  const navItem = (
    label: string,
    icon: string,
    page: Page,
    badge?: string,
    badgeStyle?: string,
    feedFilterVal?: FeedFilter
  ) => {
    const isActive = feedFilterVal
      ? currentPage === 'feed' && feedFilter === feedFilterVal
      : currentPage === page && !feedFilterVal

    const handleClick = () => {
      if (feedFilterVal) {
        onPageChange('feed')
        onFeedFilter(feedFilterVal)
      } else {
        onPageChange(page)
      }
    }

    return (
      <div
        onClick={handleClick}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-[13.5px] transition-all mb-0.5
          ${isActive
            ? 'bg-accent/10 text-accent border-l-2 border-accent'
            : 'text-muted hover:bg-surface2 hover:text-white'}`}
      >
        <span className="w-4 text-center text-sm">{icon}</span>
        <span>{label}</span>
        {badge && (
          <span className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full ${badgeStyle || 'bg-accent2 text-white'}`}>
            {badge}
          </span>
        )}
      </div>
    )
  }

  return (
    <aside className="sticky top-[60px] h-[calc(100vh-60px)] overflow-y-auto border-r border-border px-3 py-5 w-[220px] flex-shrink-0">

      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted mb-2 px-2">Community</p>
        {navItem('Home Feed',      '🏠', 'feed',      undefined, undefined, 'newest')}
        {navItem('Hot Questions',  '🔥', 'feed',      '12', undefined, 'hot')}
        {navItem('Unanswered',     '🕐', 'feed',      '47', undefined, 'unanswered')}
        {navItem('Bookmarked',     '⭐', 'feed',      undefined, undefined, 'bookmarked')}
        {navItem('My Profile',     '👤', 'profile')}
      </div>

      <div className="h-px bg-border my-3" />

      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted mb-2 px-2">Resources</p>
        {navItem('Jobs',      '💼', 'jobs',      'Soon', 'bg-accent/15 text-accent border border-accent/30')}
        {navItem('Templates', '📄', 'templates', '89')}
      </div>

      <div className="h-px bg-border my-3" />

      <div className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted mb-3 px-1">Tags</p>
        <div className="flex flex-wrap gap-1.5 px-1">
          {TAGS.map(tag => (
            <span key={tag} className="tag text-[11px]">{tag}</span>
          ))}
        </div>
      </div>

      <div className="h-px bg-border my-3" />

      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted mb-2 px-2">More</p>
        {navItem('Members',       '👥', 'profile')}
        {navItem('Guidelines',    '📋', 'guidelines')}
        {navItem('Announcements', '💬', 'feed')}
      </div>
    </aside>
  )
}
