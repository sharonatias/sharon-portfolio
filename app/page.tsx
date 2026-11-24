'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { WorkImage } from '@/components/site/Media'
import { WorkPlayer } from '@/components/site/WorkPlayer'
import { HeroScreen } from '@/components/site/HeroScreen'
import { SectionHead } from '@/components/site/SectionHead'
import { Spotlight } from '@/components/site/Spotlight'
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

  // Two quiet rows of three; the full list lives on the Work page
  const spotlight = featured.slice(0, 6)

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
        images: heroPoster ? [heroPoster] : [],
        tone: 'dark',
        order: 0,
        raw: null,
      }
    : null

  return (
    <>
      <SiteHeader />
      <main className="tone-dark">
        <HeroScreen
          video={heroVideo}
          poster={heroPoster}
          title={content.heroTitle}
          onWatch={showreel ? () => setPlayer({ list: [showreel], index: 0 }) : undefined}
          aside={
            <>
              <p className="t-lead text-[#d6d5cf] max-w-[38ch]">{content.heroSubtitle}</p>
              {texts.currently && <p className="t-meta mt-4 max-w-[38ch]">{texts.currently}</p>}
              <p className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-[0.9375rem]">
                <Link href="/projects" className="link-draw">
                  See all work{ready && items.length ? ` (${items.length})` : ''}
                </Link>
                <Link href="/contact" className="link-draw">
                  Get in touch
                </Link>
              </p>
            </>
          }
        />

        {content.featured_visible !== false && spotlight.length > 0 && (
          <section aria-labelledby="selected">
            <SectionHead id="selected" title={texts.workHeading} href="/projects" linkLabel="All work" />
            <div className="h-6 md:h-10" />
            <Spotlight items={spotlight} onPlay={(it) => play(featured, it)} />
          </section>
        )}

        {/* Disciplines: a fast way into a large body of work */}
        {disciplines.length > 1 && (
          <section aria-labelledby="disc" className="pt-24 md:pt-36">
            <SectionHead id="disc" title="Browse by discipline" />
            <ul className="wrap pt-6">
              {disciplines.map((d) => (
                <li key={d.key} className="rule-bottom">
                  <Link
                    href={`/projects?c=${d.key}`}
                    className="group flex items-baseline justify-between gap-6 py-4 md:py-5 text-[#bdbcb6] hover:text-white transition-colors"
                  >
                    <span className="t-display text-[clamp(1.5rem,2vw,2.25rem)] transition-transform duration-500 group-hover:translate-x-2" style={{ transitionTimingFunction: 'var(--ease)' }}>
                      {d.label}
                    </span>
                    <span className="t-meta t-num text-[1rem]">
                      {d.count} {d.count === 1 ? 'project' : 'projects'}
                    </span>
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

        <div className="h-24 md:h-36" />
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

/** A row of work. Fewer items get bigger frames, so a short list never looks empty. */
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
  const n = items.length
  if (n === 1) {
    return (
      <section aria-label={title} className="pt-24 md:pt-36">
        <SectionHead title={title} href={moreHref} linkLabel="See more" />
        <Spotlight items={items} onPlay={onPlay} />
      </section>
    )
  }
  return (
    <section aria-label={title} className="pt-24 md:pt-36">
      <SectionHead title={title} count={n} href={moreHref} linkLabel="See more" />
      <ul className={`wrap pt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 ${n >= 3 ? 'lg:grid-cols-3' : ''}`}>
        {items.map((it) => {
          const body = (
            <>
              <span className={`block grade overflow-hidden bg-[#111] edge ${n === 2 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                <WorkImage src={it.image} srcs={it.images} video={it.video} alt={it.title} />
              </span>
              <span className="t-title block mt-5 text-[clamp(1.375rem,1.8vw,1.875rem)]">{it.title}</span>
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
