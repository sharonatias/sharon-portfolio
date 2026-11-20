'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AppCase } from '@/lib/types'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { HeroScreen } from '@/components/site/HeroScreen'
import { WorkPlayer } from '@/components/site/WorkPlayer'
import { isVideoFile, videoFrameUrl, videoThumb } from '@/lib/media'
import { ProjectPager } from '@/components/site/ProjectPager'
import { FrameSheet } from '@/components/site/FrameSheet'
import { categoryLabel, collect, listImages, SECTION_KEYS, sectionImages } from '@/lib/work'

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

  useEffect(() => {
    if (cs?.title) document.title = `${cs?.title} — Sharon Moshe Attias`
  }, [cs?.title])

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
        {/* The screen: the opening still (or a silent loop of the film file), title on the picture */}
        <HeroScreen
          video={cs.video_file && isVideoFile(cs.video_file) ? cs.video_file : undefined}
          poster={cs.hero_image || collect(cs.gallery_images, sectionImages(cs, SECTION_KEYS))[0] || videoFrameUrl(film) || videoThumb(film)}
          kicker={cs.format || categoryLabel(cs.category)}
          title={cs.title}
          subtitle={cs.subtitle}
          onWatch={film ? () => setPlaying(true) : undefined}
          watchLabel="Watch the film"
        />

        {cs.hero_description && (
          <section className="wrap py-16 md:py-28 grid gap-8 lg:grid-cols-12">
            <p className="t-meta lg:col-span-3 pt-2">The film</p>
            <p className="lg:col-span-9 t-title text-[clamp(1.625rem,3vw,3rem)] leading-[1.12] max-w-[30ch]">{cs.hero_description}</p>
          </section>
        )}

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

        {/* Stills as a contact sheet; falls back to every frame used in the story */}
        <FrameSheet
          title={cs.title}
          frames={
            cs.gallery_images?.length
              ? cs.gallery_images.filter(Boolean)
              : collect(sectionImages(cs, SECTION_KEYS), listImages(cs.process_blocks)).length >= 4
                ? collect(sectionImages(cs, SECTION_KEYS), listImages(cs.process_blocks))
                : []
          }
        />

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

      {playing && film && (
        <WorkPlayer
          items={[{ key: 'film', id: 'film', type: 'project', title: cs.title, categoryLabel: cs.format || 'Film', role: cs.role, year: cs.year, video: film, image: cs.hero_image, images: [], tone: 'dark', order: 0, raw: null }]}
          index={0}
          onChange={() => {}}
          onClose={() => setPlaying(false)}
        />
      )}
    </>
  )
}

/** One chapter of the story: words on the left, pictures on the right. */
function Chapter({ label, title, text, images }: { label: string; title?: string; text?: string; images?: string[] }) {
  const imgs = (images || []).filter(Boolean)
  const n = imgs.length
  return (
    <section className="wrap py-16 md:py-28 rule-top">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8">
        <div className="lg:col-span-4">
          <h2 className="t-meta">{label}</h2>
          {title && <p className="t-title mt-3 text-[clamp(1.75rem,2.8vw,3rem)] leading-[1.05]">{title}</p>}
          {text && <p className="mt-5 text-[1.0625rem] leading-[1.7] text-[#cfcec8] max-w-[52ch] whitespace-pre-line">{text}</p>}
        </div>
        {n > 0 && (
          <div
            className={`lg:col-span-8 grid gap-3 md:gap-4 items-start ${
              n === 1 ? '' : n === 2 || n === 4 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
            }`}
          >
            {imgs.map((src, i) => (
              <figure key={i} className="overflow-hidden">
                {/* Frames keep their own aspect ratio: a film still is never cropped to fit a box */}
                <img
                  src={src}
                  alt={`${title || label} ${i + 1}`}
                  className={`block w-full h-auto bg-[#111] ${n === 1 ? 'max-h-[80vh] object-contain object-left' : ''}`}
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
