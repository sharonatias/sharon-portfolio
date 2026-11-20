'use client'

import { BackgroundVideo } from './Media'

/**
 * The opening frame: the picture sits inside the page margins like a print on a
 * wall, in widescreen, with the title set quietly beneath it.
 */
export function HeroScreen({
  video,
  poster,
  title,
  kicker,
  aside,
  onWatch,
  watchLabel = 'Watch the showreel',
}: {
  video?: string
  poster?: string
  title: string
  kicker?: string
  aside?: React.ReactNode
  onWatch?: () => void
  watchLabel?: string
}) {
  return (
    <section aria-label={title} className="wrap pt-6 md:pt-10">
      <div className="grade w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[2.39/1] lg:max-h-[64svh] overflow-hidden bg-[#0b0b0b] edge fade-in">
        <BackgroundVideo url={video} poster={poster} className="absolute inset-0" />
        {onWatch && (
          <button
            type="button"
            onClick={onWatch}
            className="press absolute z-[2] right-4 bottom-4 md:right-5 md:bottom-5 flex items-center gap-2.5 text-[0.875rem] text-white bg-black/45 backdrop-blur-md px-3.5 py-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-[var(--tally)]" />
            {watchLabel}
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-12 pt-10 md:pt-14 pb-20 md:pb-32">
        <div className="lg:col-span-7">
          {kicker && <p className="t-meta mb-4">{kicker}</p>}
          <h1 className="open-1 t-display text-[clamp(2.25rem,3.6vw,3.75rem)] max-w-[20ch]">{title}</h1>
        </div>
        {aside && <div className="open-2 lg:col-span-4 lg:col-start-9 lg:pt-2">{aside}</div>}
      </div>
    </section>
  )
}
