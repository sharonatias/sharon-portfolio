'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { WorkItem } from '@/lib/work'
import { isVideoFile } from '@/lib/media'
import { WorkImage } from './Media'

/**
 * The headline work, shown the way it was made to be seen: edge to edge, in
 * widescreen, with the title set on the picture. Hovering plays the footage.
 */
export function Spotlight({ items, onPlay }: { items: WorkItem[]; onPlay: (item: WorkItem) => void }) {
  const [canPreview, setCanPreview] = useState(false)
  useEffect(() => {
    setCanPreview(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  return (
    <ul className="flex flex-col gap-2 md:gap-3">
      {items.map((it, i) => (
        <li key={it.key}>
          <Frame item={it} index={i} total={items.length} canPreview={canPreview} onPlay={onPlay} />
        </li>
      ))}
    </ul>
  )
}

function Frame({
  item,
  index,
  total,
  canPreview,
  onPlay,
}: {
  item: WorkItem
  index: number
  total: number
  canPreview: boolean
  onPlay: (item: WorkItem) => void
}) {
  const [hover, setHover] = useState(false)
  const preview = canPreview && isVideoFile(item.video)

  const inner = (
    <>
      <div className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-[1.02]" style={{ transitionTimingFunction: 'var(--ease)' }}>
        <WorkImage src={item.image} srcs={item.images} video={item.video} alt={item.title} eager={index === 0} />
        {preview && hover && (
          <video src={item.video} autoPlay muted loop playsInline data-managed="" className="cover absolute inset-0 fade-in" />
        )}
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[65%] pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,0))' }}
      />
      <div className="absolute inset-x-0 bottom-0 wrap pb-6 md:pb-10 grid gap-4 md:grid-cols-12 md:items-end text-left">
        <div className="md:col-span-8">
          <p className="t-meta text-white/70 mb-3">{item.categoryLabel}</p>
          <h3 className="t-display text-[clamp(2.5rem,6.4vw,7.5rem)] text-[#f6f5f0] max-w-[16ch]">{item.title}</h3>
        </div>
        <div className="md:col-span-4 md:text-right text-[0.9375rem] text-white/85">
          {item.role && <p>{item.role}</p>}
          {item.year && <p className="t-num text-white/60">{item.year}</p>}
          <p className="mt-4 inline-flex items-center gap-2 text-white">
            <span className="link-draw" style={{ backgroundSize: hover ? '100% 1px' : undefined }}>
              {item.href ? 'View project' : item.video ? 'Play' : 'View'}
            </span>
          </p>
        </div>
      </div>
    </>
  )

  const cls =
    'group relative block w-full overflow-hidden bg-[#0d0d0d] aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2.39/1] lg:max-h-[calc(100svh-var(--header-h))]'
  const handlers = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), onFocus: () => setHover(true), onBlur: () => setHover(false) }

  return item.href ? (
    <Link href={item.href} className={cls} {...handlers}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={() => onPlay(item)} className={cls} {...handlers}>
      {inner}
    </button>
  )
}
