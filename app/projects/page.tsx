'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { WorkImage } from '@/components/site/Media'
import { CreditsRoll } from '@/components/site/CreditsRoll'
import { WorkPlayer } from '@/components/site/WorkPlayer'
import { useAllWork, useSiteContent } from '@/lib/useSiteContent'
import { CATEGORY_LABELS, CATEGORY_ORDER, WorkItem } from '@/lib/work'

type View = 'grid' | 'index'

export default function WorkPage() {
  const { texts } = useSiteContent()
  const { items, ready } = useAllWork()
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState<View>('grid')
  const [playerIndex, setPlayerIndex] = useState<number | null>(null)
  const [pendingPlay, setPendingPlay] = useState<string | null>(null)

  // Read ?c= (discipline) and ?play= (open a project) once on load
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    const c = q.get('c')
    if (c) setFilter(c)
    setPendingPlay(q.get('play'))
    try {
      const v = localStorage.getItem('work-view')
      if (v === 'grid' || v === 'index') setView(v)
    } catch {}
  }, [])

  const disciplines = useMemo(
    () =>
      CATEGORY_ORDER.map((c) => ({ key: c, label: CATEGORY_LABELS[c], count: items.filter((i) => i.category === c).length })).filter(
        (d) => d.count > 0
      ),
    [items]
  )

  const shown = useMemo(() => (filter === 'all' ? items : items.filter((i) => i.category === filter)), [items, filter])

  useEffect(() => {
    if (!pendingPlay || !ready) return
    const i = shown.findIndex((w) => w.key === pendingPlay)
    if (i !== -1) setPlayerIndex(i)
    setPendingPlay(null)
  }, [pendingPlay, ready, shown])

  const choose = (key: string) => {
    setFilter(key)
    const url = new URL(window.location.href)
    if (key === 'all') url.searchParams.delete('c')
    else url.searchParams.set('c', key)
    url.searchParams.delete('play')
    window.history.replaceState(null, '', url.toString())
  }

  const chooseView = (v: View) => {
    setView(v)
    try {
      localStorage.setItem('work-view', v)
    } catch {}
  }

  const open = (it: WorkItem) => setPlayerIndex(shown.indexOf(it))

  return (
    <>
      <SiteHeader />
      <main className="tone-dark min-h-[70vh]">
        <section className="wrap pt-14 md:pt-20 pb-10 md:pb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <h1 className="open-1 t-display lg:col-span-7 text-[clamp(4rem,12vw,11rem)]">Work</h1>
          <p className="open-2 lg:col-span-5 t-lead text-[#d6d5cf] max-w-[44ch] lg:pb-3">
            {texts.workIntro}
            {ready && <span className="t-meta block mt-2 t-num">{items.length} projects</span>}
          </p>
        </section>

        {/* Filters stay in reach while scrolling a long list */}
        <div className="sticky z-30 tone-dark rule-top rule-bottom" style={{ top: 'var(--header-h)' }}>
          <div className="wrap flex items-center justify-between gap-6 h-14">
            <div role="group" aria-label="Filter by discipline" className="no-scrollbar flex gap-6 overflow-x-auto text-[0.9375rem] min-w-0">
              {[{ key: 'all', label: 'All', count: items.length }, ...disciplines].map((d) => (
                <button
                  key={d.key}
                  type="button"
                  aria-pressed={filter === d.key}
                  onClick={() => choose(d.key)}
                  className="whitespace-nowrap py-2 transition-colors link-draw"
                  style={{
                    color: filter === d.key ? 'var(--fg)' : 'var(--mute)',
                    backgroundSize: filter === d.key ? '100% 1px' : undefined,
                  }}
                >
                  {d.label} <span className="t-num text-[0.8125rem] opacity-70">{d.count}</span>
                </button>
              ))}
            </div>
            <div role="group" aria-label="Layout" className="hidden sm:flex gap-4 text-[0.9375rem] shrink-0">
              {(['grid', 'index'] as View[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => chooseView(v)}
                  className="py-2 capitalize transition-colors"
                  style={{ color: view === v ? 'var(--fg)' : 'var(--mute)' }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        <section className="wrap pt-10 md:pt-14 pb-24 md:pb-32" aria-live="polite">
          {!ready ? (
            <GridSkeleton />
          ) : shown.length === 0 ? (
            <div className="py-24 max-w-[48ch]">
              <p className="t-lead">Nothing in this discipline yet.</p>
              <button type="button" onClick={() => choose('all')} className="link-draw mt-3 text-[0.9375rem]">
                Show all work
              </button>
            </div>
          ) : view === 'index' ? (
            <CreditsRoll key={filter} items={shown} onPlay={open} />
          ) : (
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((it, i) => (
                <li key={it.key}>
                  <Card item={it} eager={i < 6} onPlay={() => open(it)} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <SiteFooter />

      {playerIndex !== null && shown[playerIndex] && (
        <WorkPlayer items={shown} index={playerIndex} onChange={setPlayerIndex} onClose={() => setPlayerIndex(null)} />
      )}
    </>
  )
}

function Card({ item, onPlay, eager }: { item: WorkItem; onPlay: () => void; eager?: boolean }) {
  const body = (
    <>
      <span className="block aspect-[16/10] overflow-hidden bg-[#111] relative">
        <WorkImage src={item.image} video={item.video} alt={item.title} eager={eager} />
        {!item.href && item.video && (
          <span className="absolute left-3 bottom-3 text-[0.8125rem] text-white bg-black/60 backdrop-blur px-2.5 py-1 rounded-full">
            Play
          </span>
        )}
      </span>
      <span className="flex items-baseline justify-between gap-4 mt-4">
        <span className="t-title text-[1.375rem] md:text-[1.5rem] min-w-0">{item.title}</span>
        {item.year && <span className="t-meta t-num shrink-0">{item.year}</span>}
      </span>
      <span className="t-meta block mt-1">{item.subtitle || item.role || item.categoryLabel}</span>
    </>
  )
  return item.href ? (
    <Link href={item.href} className="lift block">
      {body}
    </Link>
  ) : (
    <button type="button" onClick={onPlay} className="lift block w-full text-left">
      {body}
    </button>
  )
}

function GridSkeleton() {
  return (
    <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading work">
      {Array.from({ length: 6 }).map((_, i) => (
        <li key={i}>
          <div className="aspect-[16/10] bg-[#121212]" />
          <div className="h-5 w-2/3 bg-[#151515] mt-4" />
          <div className="h-4 w-1/3 bg-[#121212] mt-2" />
        </li>
      ))}
    </ul>
  )
}
