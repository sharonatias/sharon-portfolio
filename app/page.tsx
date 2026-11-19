'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { BackgroundVideo, WorkImage } from '@/components/site/Media'
import { CreditsRoll } from '@/components/site/CreditsRoll'
import { WorkPlayer } from '@/components/site/WorkPlayer'
import { useAllWork, useSiteContent } from '@/lib/useSiteContent'
import { CATEGORY_LABELS, CATEGORY_ORDER, pickByIds, WorkItem } from '@/lib/work'

export default function Home() {
  const { content, texts } = useSiteContent()
  const { items, ready } = useAllWork()
  const [heroVideos, setHeroVideos] = useState<{ video_url?: string }[]>([])
  const [player, setPlayer] = useState<{ list: WorkItem[]; index: number } | null>(null)

  useEffect(() => {
    fetch('/api/hero')
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setHeroVideos(d))
      .catch(() => {})
  }, [])

  // Selected work: what was picked in the admin, otherwise the first items in display order
  const featured = useMemo(() => {
    const picked = pickByIds(items, content.featured_project_ids)
    const base = picked.length ? picked : items.filter((i) => i.category !== 'currently_exploring')
    return base.slice(0, 10)
  }, [items, content.featured_project_ids])

  const exploring = useMemo(() => {
    const picked = pickByIds(items, content.exploring_ids)
    return (picked.length ? picked : items.filter((i) => i.category === 'currently_exploring')).slice(0, 3)
  }, [items, content.exploring_ids])

  const experiments = useMemo(() => {
    const picked = pickByIds(items, content.ai_experiments_ids)
    return (picked.length ? picked : items.filter((i) => i.category === 'ai_experiments')).slice(0, 6)
  }, [items, content.ai_experiments_ids])

  const disciplines = useMemo(
    () =>
      CATEGORY_ORDER.filter((c) => c !== 'featured')
        .map((c) => ({ key: c, label: CATEGORY_LABELS[c], count: items.filter((i) => i.category === c).length }))
        .filter((d) => d.count > 0),
    [items]
  )

  const heroVideo = content.heroVideoUrl || heroVideos.find((v) => v.video_url)?.video_url
  const heroPoster = texts.heroPoster || featured[0]?.image

  const play = (list: WorkItem[], item: WorkItem) => setPlayer({ list, index: Math.max(0, list.indexOf(item)) })

  const showreel: WorkItem | null = heroVideo
    ? {
        key: 'showreel',
        id: 'showreel',
        type: 'project',
        title: 'Showreel',
        categoryLabel: 'Showreel',
        role: content.heroRole,
        video: heroVideo,
        image: heroPoster,
        tone: 'dark',
        order: 0,
        raw: null,
      }
    : null

  return (
    <>
      <SiteHeader />
      <main className="tone-dark">
        {/* The screen */}
        <section aria-label="Showreel" className="relative">
          <BackgroundVideo
            url={heroVideo}
            poster={heroPoster}
            className="w-full aspect-[16/10] md:aspect-[2.39/1] md:max-h-[calc(100svh-var(--header-h)-120px)] md:min-h-[360px]"
          />
          {showreel && (
            <button
              type="button"
              onClick={() => setPlayer({ list: [showreel], index: 0 })}
              className="absolute right-[var(--gutter)] bottom-4 md:bottom-5 flex items-center gap-2.5 text-[0.875rem] text-white bg-black/55 backdrop-blur px-3.5 py-2 rounded-full hover:bg-black/75 transition-colors"
            >
              <span aria-hidden className="w-2 h-2 rounded-full bg-[var(--tally)]" />
              Watch with sound
            </button>
          )}
        </section>

        {/* Who */}
        <section className="wrap pt-10 md:pt-14 pb-20 md:pb-28 grid gap-8 lg:grid-cols-12 lg:items-end">
          <h1 className="open-1 t-display lg:col-span-8 text-[clamp(3rem,7.2vw,7.5rem)] max-w-[15ch]">
            {content.heroTitle}
          </h1>
          <div className="open-2 lg:col-span-4 lg:pb-2">
            <p className="t-lead text-[#d6d5cf] max-w-[42ch]">{content.heroSubtitle}</p>
            {texts.currently && <p className="t-meta mt-4 max-w-[42ch]">{texts.currently}</p>}
            <p className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-[0.9375rem]">
              <Link href="/projects" className="link-draw">
                See all work{ready && items.length ? ` (${items.length})` : ''}
              </Link>
              <Link href="/contact" className="link-draw">
                Get in touch
              </Link>
            </p>
          </div>
        </section>

        {/* Selected work, as credits */}
        {content.featured_visible !== false && featured.length > 0 && (
          <section aria-labelledby="selected" className="wrap pb-24 md:pb-32">
            <div className="flex items-baseline justify-between gap-4 pb-5 rule-bottom">
              <h2 id="selected" className="t-title text-[1.25rem] md:text-[1.5rem]">
                {texts.workHeading}
              </h2>
              <Link href="/projects" className="link-draw text-[0.9375rem]">
                All work
              </Link>
            </div>
            <CreditsRoll items={featured} onPlay={(it) => play(featured, it)} />
          </section>
        )}

        {/* Disciplines: a fast way into a large body of work */}
        {disciplines.length > 1 && (
          <section aria-labelledby="disc" className="wrap pb-24 md:pb-32">
            <h2 id="disc" className="t-meta pb-5 rule-bottom">
              Browse by discipline
            </h2>
            <ul className="flex flex-wrap gap-x-10 gap-y-3 pt-8">
              {disciplines.map((d) => (
                <li key={d.key}>
                  <Link
                    href={`/projects?c=${d.key}`}
                    className="t-display text-[clamp(2.25rem,5.2vw,4.75rem)] hover:text-white text-[#cfcec8] transition-colors inline-flex items-start gap-2"
                  >
                    {d.label}
                    <sup className="t-num text-[0.875rem] font-normal tracking-normal text-[var(--dim)] mt-2" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {d.count}
                    </sup>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {content.exploring_visible !== false && exploring.length > 0 && (
          <Strip title="In development" items={exploring} onPlay={(it) => play(exploring, it)} />
        )}

        {content.ai_experiments_visible !== false && experiments.length > 0 && (
          <Strip
            title="AI experiments"
            items={experiments}
            onPlay={(it) => play(experiments, it)}
            moreHref="/projects?c=ai_experiments"
          />
        )}
      </main>
      <SiteFooter />

      {player && (
        <WorkPlayer
          items={player.list}
          index={player.index}
          onChange={(i) => setPlayer({ ...player, index: i })}
          onClose={() => setPlayer(null)}
        />
      )}
    </>
  )
}

function Strip({
  title,
  items,
  onPlay,
  moreHref,
}: {
  title: string
  items: WorkItem[]
  onPlay: (it: WorkItem) => void
  moreHref?: string
}) {
  return (
    <section aria-label={title} className="wrap pb-24 md:pb-32">
      <div className="flex items-baseline justify-between gap-4 pb-5 rule-bottom mb-8">
        <h2 className="t-title text-[1.25rem] md:text-[1.5rem]">{title}</h2>
        {moreHref && (
          <Link href={moreHref} className="link-draw text-[0.9375rem]">
            See more
          </Link>
        )}
      </div>
      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const body = (
            <>
              <span className="block scope overflow-hidden bg-[#111]">
                <WorkImage src={it.image} video={it.video} alt={it.title} />
              </span>
              <span className="t-title block mt-4 text-[1.375rem]">{it.title}</span>
              <span className="t-meta block mt-1">{it.subtitle || [it.role, it.year].filter(Boolean).join(', ')}</span>
            </>
          )
          return (
            <li key={it.key}>
              {it.href ? (
                <Link href={it.href} className="lift block">
                  {body}
                </Link>
              ) : (
                <button type="button" onClick={() => onPlay(it)} className="lift block w-full text-left">
                  {body}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
