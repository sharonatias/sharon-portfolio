'use client'

import { useEffect, useRef } from 'react'
import { BackgroundVideo } from './Media'

/**
 * The opening frame. It fills the screen; as the visitor starts to scroll,
 * black bars close in from top and bottom until the picture sits in a 2.39:1
 * cinemascope frame — the lights going down before the film.
 * Only transform and opacity animate, driven by a CSS variable.
 */
export function HeroScreen({
  video,
  poster,
  title,
  subtitle,
  onWatch,
  watchLabel = 'Watch the showreel',
  kicker,
}: {
  video?: string
  poster?: string
  title: string
  subtitle?: string
  onWatch?: () => void
  watchLabel?: string
  kicker?: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1')
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const h = el.offsetHeight || 1
      const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.55)))
      el.style.setProperty('--p', p.toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section
      ref={ref}
      aria-label="Showreel"
      className="hero-screen relative overflow-hidden bg-black"
      style={{ ['--p' as any]: 0 }}
    >
      <BackgroundVideo url={video} poster={poster} className="absolute inset-0" />

      {/* Readability: a soft shade under the title only */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.72), rgba(0,0,0,0))' }}
      />

      {/* Letterbox bars */}
      <div aria-hidden className="hero-bar hero-bar--top" />
      <div aria-hidden className="hero-bar hero-bar--bottom" />

      <div className="hero-copy absolute inset-x-0 bottom-0 wrap pb-8 md:pb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
        {kicker && <p className="lg:col-span-12 t-meta text-white/70 -mb-2">{kicker}</p>}
        <h1 className="open-1 t-display lg:col-span-9 text-[clamp(3rem,6.2vw,8.5rem)] max-w-[19ch] text-[#f6f5f0]">
          {title}
        </h1>
        <div className="open-2 lg:col-span-3 lg:justify-self-end lg:text-right flex flex-col gap-4 lg:items-end">
          {subtitle && <p className="t-lead text-[#e4e3dd] max-w-[34ch]">{subtitle}</p>}
          {onWatch && (
            <button
              type="button"
              onClick={onWatch}
              className="press self-start lg:self-end flex items-center gap-2.5 text-[0.9375rem] text-white bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <span aria-hidden className="w-2 h-2 rounded-full bg-[var(--tally)]" />
              {watchLabel}
            </button>
          )}
        </div>
      </div>

      <p aria-hidden className="hero-ratio t-meta t-num absolute right-[var(--gutter)] top-4 text-white/70">
        2.39 : 1
      </p>
    </section>
  )
}
