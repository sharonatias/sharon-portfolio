'use client'

import Link from 'next/link'
import { useState } from 'react'
import { WorkItem } from '@/lib/work'
import { WorkImage } from './Media'

/**
 * The work as end credits: what Sharon did on the left, the title on the right.
 * On wide screens a letterboxed still follows the row being read.
 */
export function CreditsRoll({ items, onPlay }: { items: WorkItem[]; onPlay: (item: WorkItem) => void }) {
  const [active, setActive] = useState(0)
  const current = items[active] || items[0]
  if (!items.length) return null

  return (
    <div className="grid lg:grid-cols-12 gap-x-8">
      {/* Preview, desktop only */}
      <div className="hidden lg:block lg:col-span-5">
        <div className="sticky" style={{ top: 'calc(var(--header-h) + 32px)' }}>
          <div className="scope overflow-hidden bg-[#0d0d0d] relative">
            {items.map((it, i) => (
              <div
                key={it.key}
                className="absolute inset-0"
                style={{ opacity: i === active ? 1 : 0, transition: 'opacity .45s ease' }}
                aria-hidden={i !== active}
              >
                <WorkImage src={it.image} video={it.video} alt={it.title} eager={i < 3} />
              </div>
            ))}
          </div>
          {current?.description && (
            <p className="t-meta mt-4 max-w-[52ch] line-clamp-3">{current.description}</p>
          )}
        </div>
      </div>

      <ol className="lg:col-span-7" role="list">
        {items.map((it, i) => {
          const isActive = i === active
          const inner = (
            <>
              <span className="t-meta lg:text-right pt-[0.35em] order-2 sm:order-none">{it.role || it.categoryLabel}</span>
              <span className="min-w-0">
                <span
                  className="t-title block text-[clamp(1.5rem,2.6vw,2.375rem)] transition-colors duration-300"
                  style={{ color: isActive ? 'var(--fg)' : undefined }}
                >
                  {it.title}
                </span>
                {(it.year || it.categoryLabel) && (
                  <span className="t-meta block mt-1">
                    {[it.categoryLabel !== it.role ? it.categoryLabel : null, it.year].filter(Boolean).join(', ')}
                  </span>
                )}
              </span>
            </>
          )
          const cls =
            'group grid grid-cols-[72px_1fr] sm:grid-cols-[minmax(140px,0.7fr)_1.6fr] gap-x-5 lg:gap-x-8 items-start py-4 md:py-5 rule-bottom w-full text-left'
          const handlers = {
            onMouseEnter: () => setActive(i),
            onFocus: () => setActive(i),
          }
          // Mobile shows a small still instead of the role column
          const mobileThumb = (
            <span className="sm:hidden block w-[72px] aspect-[4/3] overflow-hidden bg-[#111] row-span-2">
              <WorkImage src={it.image} video={it.video} alt="" />
            </span>
          )
          return (
            <li key={it.key} className="text-[color:var(--fg)] lg:text-[color:#9a9993]">
              {it.href ? (
                <Link href={it.href} className={cls} {...handlers}>
                  {mobileThumb}
                  {inner}
                </Link>
              ) : (
                <button type="button" className={cls} onClick={() => onPlay(it)} {...handlers}>
                  {mobileThumb}
                  {inner}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
