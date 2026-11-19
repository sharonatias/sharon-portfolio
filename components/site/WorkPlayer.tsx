'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { WorkItem } from '@/lib/work'
import { PlayableVideo, WorkImage } from './Media'

/**
 * Screening-room viewer for projects that live in a single video or image.
 * Arrow keys / buttons step through the whole list, so visitors can watch
 * one piece after another without going back to the grid.
 */
export function WorkPlayer({
  items,
  index,
  onChange,
  onClose,
}: {
  items: WorkItem[]
  index: number
  onChange: (i: number) => void
  onClose: () => void
}) {
  const item = items[index]
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const total = items.length
  const go = (d: number) => onChange((index + d + total) % total)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = prev
      opener?.focus?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>('a,button,iframe,video,[tabindex]:not([tabindex="-1"])')
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!item) return null

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="tone-dark fixed inset-0 z-[60] flex flex-col fade-in"
    >
      <div className="wrap flex items-center justify-between rule-bottom shrink-0" style={{ height: 'var(--header-h)' }}>
        <p className="t-meta t-num">
          {index + 1} / {total}
        </p>
        <button ref={closeRef} type="button" onClick={onClose} className="link-draw text-[0.9375rem] py-2">
          Close
        </button>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center wrap py-4 md:py-8">
        <div className="w-full max-w-[1400px] max-h-full aspect-video bg-black relative">
          {item.video ? (
            <PlayableVideo key={item.key} url={item.video} title={item.title} />
          ) : (
            <WorkImage src={item.image} alt={item.title} className="!object-contain" eager />
          )}
        </div>
      </div>

      <div className="wrap rule-top shrink-0 py-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="min-w-0">
          <h2 className="t-title text-[clamp(1.5rem,3vw,2.25rem)]">{item.title}</h2>
          <p className="t-meta mt-1">
            {[item.role, item.year].filter(Boolean).join(', ')}
          </p>
          {item.description && <p className="mt-2 max-w-[70ch] text-[0.9375rem] text-[#cfcec8] line-clamp-2">{item.description}</p>}
        </div>
        <div className="flex items-center gap-6 text-[0.9375rem]">
          {item.href && (
            <Link href={item.href} className="link-draw">
              Open case study
            </Link>
          )}
          {total > 1 && (
            <>
              <button type="button" onClick={() => go(-1)} className="link-draw" aria-label="Previous project">
                Previous
              </button>
              <button type="button" onClick={() => go(1)} className="link-draw" aria-label="Next project">
                Next
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
