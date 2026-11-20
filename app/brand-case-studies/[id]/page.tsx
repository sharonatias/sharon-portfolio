'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import HoverGridSection from '@/components/HoverGridSection'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { BackgroundVideo, WorkImage } from '@/components/site/Media'
import { ProjectPager } from '@/components/site/ProjectPager'
import { BRAND_KEYS, categoryLabel, collect, listImages, sectionImages } from '@/lib/work'

// Brand work sits on the light "screen" tone so identities read in their true colours.

const SECTION_LABELS: Record<string, string> = {
  idea: 'Idea',
  system: 'System',
  shape: 'Shape',
  motion: 'Motion',
  applications: 'Applications',
  color: 'Colour',
  type: 'Type',
}
const DEFAULT_ORDER = ['idea', 'system', 'shape', 'motion', 'applications', 'color', 'type']

type ImageItem = string | { url?: string; main?: string }
const imageUrl = (img: ImageItem) => (typeof img === 'string' ? img : img.url || img.main || '')

const isLight = (color?: string) => {
  if (!color) return true
  const hex = color.replace('#', '')
  if (!/^[0-9a-f]{3,6}$/i.test(hex)) return color.toLowerCase() === 'white'
  const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
  return 0.299 * r + 0.587 * g + 0.114 * b > 150
}

const paragraphs = (t?: string) => (t || '').split('\n').filter((p) => p.trim())

export default function BrandCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null)
  const [cs, setCs] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/brand-case-studies/${id}`)
      .then((r) => r.json())
      .then((d) => setCs(d?.id ? d : null))
      .catch(() => setCs(null))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (cs?.title) document.title = `${cs?.title} — Sharon Moshe Attias`
  }, [cs?.title])

  if (loading) {
    return (
      <>
        <SiteHeader tone="light" />
        <main className="tone-light min-h-[80vh]">
          <div className="w-full aspect-[16/10] md:aspect-[2.39/1] bg-[#e7e7e3]" />
        </main>
      </>
    )
  }

  if (!cs) {
    return (
      <>
        <SiteHeader tone="light" />
        <main className="tone-light wrap min-h-[70vh] py-24">
          <h1 className="t-display text-[clamp(2.25rem,4vw,3.5rem)]">Project not found</h1>
          <p className="t-lead mt-6 max-w-[48ch]">This project may have been moved or unpublished.</p>
          <Link href="/projects" className="link-draw inline-block mt-6">
            Back to all work
          </Link>
        </main>
        <SiteFooter tone="light" />
      </>
    )
  }

  const palette: string[] = Array.isArray(cs.color_palette) ? cs.color_palette : []
  const order: string[] = cs.sections_order?.length ? cs.sections_order : DEFAULT_ORDER
  const leaderText: string | undefined = cs.main_text || cs.cto?.description

  const meta = [
    ['Client', cs.client],
    ['Role', cs.role],
    ['Year', cs.year],
    ['Discipline', cs.category ? categoryLabel(cs.category) : ''],
  ].filter(([, v]) => v) as [string, string][]

  const renderSection = (key: string) => {
    const isCustom = key.startsWith('custom_') || key.startsWith('premium_')
    const s = isCustom ? (cs.custom_sections || []).find((c: any) => c.id === key) : cs[key]
    if (!s || s.isDeleted) return null
    const imgs: string[] = (s.images || []).map(imageUrl).filter(Boolean)

    if (isCustom && s.imageLayout === 'hover-grid') {
      return <HoverGridSection key={key} title={s.title || ''} images={s.images || []} gap={4} />
    }

    // Custom sections may carry their own background colour or image
    const bgColor: string | undefined = isCustom ? s.backgroundColor : undefined
    const bgImage: string | undefined = isCustom ? s.backgroundImage : undefined
    const dark = !!bgImage || (bgColor ? !isLight(bgColor) : false)
    const style: React.CSSProperties = bgImage
      ? { backgroundImage: `linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6)), url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : bgColor
        ? { backgroundColor: bgColor }
        : {}
    const label = isCustom ? s.label || s.subtitle || '' : SECTION_LABELS[key] || key
    const wide = imgs.length !== 1 && imgs.length !== 0
    const n = imgs.length

    return (
      <section key={key} className={`${dark ? 'tone-dark' : ''} rule-top`} style={style}>
        <div className="wrap py-16 md:py-24">
          <div className={`grid gap-8 lg:gap-x-8 ${wide ? '' : 'lg:grid-cols-12'}`}>
            <div className={wide ? 'grid gap-6 lg:grid-cols-12' : 'lg:col-span-4'}>
              <h2 className={`t-meta ${wide ? 'lg:col-span-4' : ''}`}>{label}</h2>
              <div className={wide ? 'lg:col-span-8' : ''}>
                {s.title && <p className={`t-title text-[clamp(1.75rem,3vw,2.75rem)] ${wide ? '' : 'mt-3'}`}>{s.title}</p>}
                {paragraphs(s.description).map((p, i) => (
                  <p key={i} className="mt-4 text-[1.0625rem] leading-[1.65] max-w-[60ch] opacity-80">
                    {p}
                  </p>
                ))}
                {key === 'motion' && s.video && (
                  <div className="mt-8 aspect-video bg-black overflow-hidden">
                    <BackgroundVideo url={s.video} className="w-full h-full" />
                  </div>
                )}
              </div>
            </div>
            {n > 0 && (
              <div
                className={`${wide ? 'mt-4' : 'lg:col-span-8'} grid gap-3 md:gap-4 ${
                  n === 1 ? '' : n === 2 ? 'sm:grid-cols-2' : n === 4 ? 'grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {imgs.map((src, i) => (
                  <figure key={i} className="overflow-hidden bg-black/5">
                    <img src={src} alt={`${s.title || label} ${i + 1}`} className="w-full h-auto block" loading="lazy" />
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <SiteHeader tone="light" />
      <main className="tone-light">
        <div className="wrap pt-6 md:pt-10"><section className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[2.39/1] lg:max-h-[64svh] bg-[#e7e7e3] overflow-hidden">
          {cs.hero_video ? (
            <BackgroundVideo url={cs.hero_video} poster={cs.hero_image} className="absolute inset-0" />
          ) : (
            <div className="absolute inset-0">
              <WorkImage
                src={cs.hero_image}
                srcs={collect(sectionImages(cs, BRAND_KEYS), listImages(cs.custom_sections), listImages(cs.brand_applications))}
                video={cs.motion?.video}
                alt={cs.title}
                eager
              />
            </div>
          )}
        </section></div>

        <section className="wrap pt-10 md:pt-14 pb-14 md:pb-20 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="t-meta mb-4">{categoryLabel(cs.category || 'brand_design')}</p>
            <h1 className="open-1 t-display text-[clamp(2.25rem,4vw,4rem)]">{cs.title}</h1>
            {cs.subtitle && <p className="open-2 t-title mt-4 text-[clamp(1.25rem,2vw,1.75rem)] opacity-80">{cs.subtitle}</p>}
          </div>
          {cs.hero_description && (
            <p className="open-3 lg:col-span-4 t-lead max-w-[44ch] lg:pb-2 opacity-80">{cs.hero_description}</p>
          )}
        </section>

        {(meta.length > 0 || palette.length > 0) && (
          <section className="wrap">
            <dl className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-6 py-8 rule-top rule-bottom">
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="t-meta">{k}</dt>
                  <dd className="mt-1 text-[0.9375rem]">{v}</dd>
                </div>
              ))}
              {palette.length > 0 && (
                <div>
                  <dt className="t-meta">Palette</dt>
                  <dd className="mt-2 flex gap-1.5">
                    {palette.slice(0, 6).map((c, i) => (
                      <span key={i} title={c} className="w-5 h-5 rounded-full border border-black/10" style={{ background: c }} />
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {cs.central_description && (
          <section className="wrap py-16 md:py-28">
            <p className="t-title text-[clamp(1.625rem,3.4vw,3rem)] max-w-[30ch] leading-[1.15]">
              {String(cs.central_description).replace(/\s+/g, ' ')}
            </p>
          </section>
        )}

        {cs.cto && leaderText && (
          <section className="wrap py-16 md:py-24 rule-top grid gap-8 lg:grid-cols-12">
            {cs.cto.image && (
              <div className="lg:col-span-4">
                <img src={cs.cto.image} alt={cs.cto.name || ''} className="w-full h-auto block" loading="lazy" />
              </div>
            )}
            <div className={cs.cto.image ? 'lg:col-span-7 lg:col-start-6' : 'lg:col-span-8'}>
              {cs.cto.name && <p className="t-title text-[clamp(1.5rem,2.4vw,2.25rem)]">{cs.cto.name}</p>}
              {cs.cto.title && <p className="t-meta mt-1">{cs.cto.title}</p>}
              {paragraphs(leaderText).map((p, i) => (
                <p key={i} className="mt-4 text-[1.0625rem] leading-[1.65] max-w-[60ch] opacity-80">
                  {p}
                </p>
              ))}
            </div>
          </section>
        )}

        {palette.length > 0 && (
          <section className="wrap py-16 md:py-24 rule-top" aria-label="Colour palette">
            <h2 className="t-meta mb-8">Colour</h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {palette.map((c, i) => (
                <li key={i}>
                  <div className="aspect-square" style={{ background: c }} />
                  <p className="t-meta t-num mt-2 uppercase">{c}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {order.map(renderSection)}

        <ProjectPager type="brandcase" id={cs.id} />
      </main>
      <SiteFooter tone="light" />
    </>
  )
}
