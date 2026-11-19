'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { About } from '@/lib/types'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { useAllWork, useSiteContent } from '@/lib/useSiteContent'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/work'

export default function AboutPage() {
  const { texts } = useSiteContent()
  const { items } = useAllWork()
  const [about, setAbout] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/about', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setAbout(d && !d.error ? d : null))
      .catch(() => setAbout(null))
      .finally(() => setLoading(false))
  }, [])

  const paragraphs = (about?.text || '').split(/\n+/).map((p) => p.trim()).filter(Boolean)

  const disciplines = useMemo(
    () =>
      CATEGORY_ORDER.filter((c) => c !== 'featured' && c !== 'currently_exploring')
        .map((c) => ({ key: c, label: CATEGORY_LABELS[c], count: items.filter((i) => i.category === c).length }))
        .filter((d) => d.count > 0),
    [items]
  )

  return (
    <>
      <SiteHeader />
      <main className="tone-dark">
        <section className="wrap pt-14 md:pt-20 pb-16 md:pb-24">
          <h1 className="open-1 t-display text-[clamp(4rem,12vw,11rem)]">About</h1>
        </section>

        <section className="wrap pb-20 md:pb-32 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            {about?.image1_url ? (
              <div className="lg:sticky" style={{ top: 'calc(var(--header-h) + 32px)' }}>
                <img src={about.image1_url} alt="Sharon Moshe Attias" className="w-full aspect-[4/5] object-cover bg-[#111]" />
              </div>
            ) : (
              loading && <div className="w-full aspect-[4/5] bg-[#0f0f0f]" />
            )}
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="open-2 t-title text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.12]">{texts.aboutHeadline}</p>

            {paragraphs.length > 0 ? (
              <div className="mt-10 space-y-5 text-[1.0625rem] leading-[1.7] text-[#d6d5cf] max-w-[62ch]">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : (
              !loading && <p className="t-meta mt-10">The about text can be added in Admin, About page.</p>
            )}

            {disciplines.length > 0 && (
              <div className="mt-14">
                <h2 className="t-meta pb-3 rule-bottom">What I make</h2>
                <ul>
                  {disciplines.map((d) => (
                    <li key={d.key}>
                      <Link
                        href={`/projects?c=${d.key}`}
                        className="flex items-baseline justify-between py-3 rule-bottom hover:text-white text-[#d6d5cf] transition-colors"
                      >
                        <span className="t-title text-[1.375rem]">{d.label}</span>
                        <span className="t-meta t-num">{d.count} {d.count === 1 ? 'project' : 'projects'}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-[0.9375rem]">
              <Link href="/projects" className="link-draw">
                See the work
              </Link>
              <Link href="/contact" className="link-draw">
                Get in touch
              </Link>
            </p>
          </div>
        </section>

        {about?.image2_url && (
          <section className="pb-20 md:pb-32">
            <img src={about.image2_url} alt="" className="w-full aspect-[16/10] md:aspect-[2.39/1] object-cover bg-[#111]" loading="lazy" />
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  )
}
