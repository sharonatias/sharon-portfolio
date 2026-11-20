'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { WorkItem } from '@/lib/work'
import { isVideoFile } from '@/lib/media'
import { WorkImage } from './Media'

/**
 * The headline work as a quiet catalogue: a framed picture and a short caption
 * beside it, alternating sides down the page. Hovering plays the footage.
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
    <ul className="wrap flex flex-col gap-20 md:gap-32">
      {items.map((it, i) => (
        <li key={it.key}>
          <Feature item={it} flip={i % 2 === 1} canPreview={canPreview} onPlay={onPlay} eager={i === 0} />
        </li>
      ))}
    </ul>
  )
}

function Feature({
  item,
  flip,
  canPreview,
  onPlay,
  eager,
}: {
  item: WorkItem
  flip: boolean
  canPreview: boolean
  onPlay: (item: WorkItem) => void
  eager?: boolean
}) {
  const [hover, setHover] = useState(false)
  const preview = canPreview && isVideoFile(item.video)
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
  }

  const body = (
    <span className="grid gap-6 lg:grid-cols-12 lg:gap-x-8 lg:items-end text-left">
      <span className={`block lg:col-span-8 ${flip ? 'lg:col-start-5 lg:row-start-1' : ''}`}>
        <span className="block relative aspect-[16/10] overflow-hidden bg-[#0d0d0d] edge">
          <span className="absolute inset-0 transition-transform duration-[1.2s] group-hover:scale-[1.015]" style={{ transitionTimingFunction: 'var(--ease)' }}>
            <WorkImage src={item.image} srcs={item.images} video={item.video} alt={item.title} eager={eager} />
            {preview && hover && (
              <video src={item.video} autoPlay muted loop playsInline data-managed="" className="cover absolute inset-0 fade-in" />
            )}
          </span>
        </span>
      </span>
      <span className={`block lg:col-span-4 ${flip ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
        <span className="t-meta block">{[item.categoryLabel, item.year].filter(Boolean).join(', ')}</span>
        <span className="t-display block mt-3 text-[clamp(1.75rem,2.4vw,2.5rem)]">{item.title}</span>
        {item.role && <span className="t-meta block mt-2">{item.role}</span>}
        {item.description && (
          <span className="block mt-5 text-[0.9875rem] leading-[1.65] text-[#c9c8c2] max-w-[42ch] line-clamp-4">{item.description}</span>
        )}
        <span className="inline-block mt-6 text-[0.9375rem]">
          <span className="link-draw" style={{ backgroundSize: hover ? '100% 1px' : undefined }}>
            {item.href ? 'View project' : item.video ? 'Play' : 'View'}
          </span>
        </span>
      </span>
    </span>
  )

  return item.href ? (
    <Link href={item.href} className="group block" {...handlers}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={() => onPlay(item)} className="group block w-full" {...handlers}>
      {body}
    </button>
  )
}
