'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AppCase } from '@/lib/types'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { PlayableVideo } from '@/components/site/Media'
import { ProjectPager } from '@/components/site/ProjectPager'
import { categoryLabel } from '@/lib/work'

const DEFAULT_LABELS: Record<string, string> = {
  problem: 'The brief',
  insight: 'The challenge',
  approach: 'Creative concept',
  flow: 'Flow',
  interaction: 'Visual language',
  outcome: 'Outcome',
}

const sentence = (s?: string) => {
  if (!s) return ''
  return s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s
}

export default function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [cs, setCs] = useState<(AppCase & Record<string, any>) | null>(null)
  const [source, setSource] = useState<'film' | 'app'>('film')
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setPlaying(false)
    ;(async () => {
      try {
        let data = await fetch(`/api/case-studies/${id}`).then((r) => r.json()).catch(() => null)
        let from: 'film' | 'app' = 'film'
        if (!data?.id) {
          data = await fetch(`/api/app-cases/${id}`).then((r) => r.json()).catch(() => null)
          from = 'app'
        }
        setCs(data?.id ? data : null)
        setSource(from)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) {
    return (
      <>
        <SiteHeader />
        <main className="tone-dark min-h-[80vh]">
          <div className="w-full scope bg-[#0d0d0d]" />
        </main>
      </>
    )
  }

  if (!cs) {
    return (
      <>
        <SiteHeader />
        <main className="tone-dark wrap min-h-[70vh] py-24">
          <h1 className="t-display text-[clamp(3rem,8vw,6rem)]">Project not found</h1>
          <p className="t-lead mt-6 max-w-[48ch] text-[#d6d5cf]">This project may have been moved or unpublished.</p>
          <Link href="/projects" className="link-draw inline-block mt-6">
            Back to all work
          </Link>
        </main>
        <SiteFooter />
      </>
    )
  }

  const film = cs.video_file || cs.watch_film_link
  const order: string[] = cs.section_order || ['problem', 'insight', 'approach', 'flow', 'interaction']
  const sections = order
    .map((key) => ({ key, s: cs[key] }))
    .filter((x) => x.s && !x.s.isDeleted && (x.s.title || x.s.description || x.s.images?.length))

  const meta = [
    ['Role', cs.role],
    ['Year', cs.year],
    ['Client', cs.client],
    ['Length', cs.duration],
    ['Format', cs.format],
    ['Category', cs.category ? categoryLabel(cs.category) : ''],
  ].filter(([, v]) => v) as [string, string][]

  return (
    <>
      <SiteHeader />
      <main className="tone-dark">
        {/* The screen: still, or the film itself once played */}
        <section className="relative w-full aspect-[16/10] md:aspect-[2.39/1] md:max-h-[calc(100svh-var(--header-h)-80px)] bg-black overflow-hidden">
          {playing && film ? (
            <div className="absolute inset-0">
              <PlayableVideo url={film} title={cs.title} />
            </div>
          ) : (
            <>
              {cs.hero_image && <img src={cs.hero_image} alt="" className="cover absolute inset-0" />}
              {film && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute inset-0 flex items-end justify-end p-[var(--gutter)] group"
                  aria-label={`Play ${cs.title}`}
                >
                  <span className="flex items-center gap-2.5 text-[0.9375rem] text-white bg-black/55 backdrop-blur px-4 py-2.5 rounded-full group-hover:bg-black/80 transition-colors">
                    <span aria-hidden className="w-2 h-2 rounded-full bg-[var(--tally)]" />
                    Watch the film
                  </span>
                </button>
              )}
            </>
          )}
        </section>

        {/* Title */}
        <section className="wrap pt-10 md:pt-14 pb-14 md:pb-20 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-meta mb-4">{cs.format || categoryLabel(cs.category)}</p>
            <h1 className="open-1 t-display text-[clamp(2.75rem,6.6vw,7rem)]">{cs.title}</h1>
            {cs.subtitle && <p className="open-2 t-title mt-4 text-[clamp(1.25rem,2vw,1.75rem)] text-[#d6d5cf]">{cs.subtitle}</p>}
          </div>
          {cs.hero_description && (
            <p className="open-3 lg:col-span-4 t-lead text-[#d6d5cf] max-w-[44ch] lg:pb-2">{cs.hero_description}</p>
          )}
        </section>

        {meta.length > 0 && (
          <section className="wrap">
            <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6 py-8 rule-top rule-bottom">
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="t-meta">{k}</dt>
                  <dd className="mt-1 text-[0.9375rem]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {sections.map(({ key, s }) => (
          <Chapter key={key} label={sentence(s.label) || DEFAULT_LABELS[key] || key} title={s.title} text={s.description} images={s.images} />
        ))}

        {(cs.process_blocks || []).map((b: any, i: number) => (
          <Chapter key={`p${i}`} label="Process" title={b.title} text={b.description} images={b.images} />
        ))}

        {cs.outcome && !cs.outcome.isDeleted && (
          <Chapter label={sentence(cs.outcome.label) || 'Outcome'} title={cs.outcome.title} text={cs.outcome.description} images={cs.outcome.images} />
        )}

        {(cs.custom_sections || []).filter((c: any) => !c.isDeleted).map((c: any) => (
          <Chapter key={c.id} label={sentence(c.label) || 'Notes'} title={c.title} text={c.description} images={c.images} />
        ))}

        {cs.gallery_images && cs.gallery_images.length > 0 && (
          <section className="wrap py-14 md:py-20" aria-label="Gallery">
            <div className="grid gap-3 md:gap-4 md:grid-cols-2">
              {cs.gallery_images.map((src: string, i: number) => (
                <figure key={i} className={i === 0 ? 'md:col-span-2 scope overflow-hidden bg-[#111]' : 'aspect-[3/2] overflow-hidden bg-[#111]'}>
                  <img src={src} alt={`${cs.title}, still ${i + 1}`} className="cover" loading="lazy" />
                </figure>
              ))}
            </div>
          </section>
        )}

        {cs.my_role_title && (
          <section className="wrap py-14 md:py-20 grid gap-6 lg:grid-cols-12 rule-top">
            <h2 className="t-meta lg:col-span-4">My role</h2>
            <div className="lg:col-span-8">
              <p className="t-title text-[clamp(1.5rem,2.6vw,2.25rem)]">{cs.my_role_title}</p>
              {cs.my_role_description && <p className="t-lead mt-4 max-w-[62ch] text-[#d6d5cf] whitespace-pre-line">{cs.my_role_description}</p>}
            </div>
          </section>
        )}

        <ProjectPager type={source} id={cs.id!} />
      </main>
      <SiteFooter />
    </>
  )
}

/** One chapter of the story: words on the left, pictures on the right. */
function Chapter({ label, title, text, images }: { label: string; title?: string; text?: string; images?: string[] }) {
  const imgs = (images || []).filter(Boolean)
  const n = imgs.length
  return (
    <section className="wrap py-14 md:py-20 rule-top">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-4">
          <h2 className="t-meta">{label}</h2>
          {title && <p className="t-title mt-3 text-[clamp(1.5rem,2.4vw,2.125rem)]">{title}</p>}
          {text && <p className="mt-4 text-[1rem] leading-[1.65] text-[#cfcec8] max-w-[52ch] whitespace-pre-line">{text}</p>}
        </div>
        {n > 0 && (
          <div className={`lg:col-span-8 grid gap-3 md:gap-4 ${n === 1 ? '' : n === 2 ? 'sm:grid-cols-2' : n === 4 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
            {imgs.map((src, i) => (
              <figure
                key={i}
                className={`overflow-hidden bg-[#111] ${n === 1 ? 'aspect-[16/9]' : n === 2 ? 'aspect-[4/5] sm:aspect-[3/4]' : 'aspect-[4/5]'}`}
              >
                <img src={src} alt={`${title || label} ${i + 1}`} className="cover" loading="lazy" />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
