'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { WorkItem } from '@/lib/work'
import { isVideoFile } from '@/lib/media'
import { WorkImage } from './Media'

/**
 * Selected work hung like a wall in a gallery: three columns of modest frames,
 * the middle column set slightly lower, small captions underneath.
 * A single item gets a quiet picture-and-caption pair instead.
 */
export function Spotlight({ items, onPlay }: { items: WorkItem[]; onPlay: (item: WorkItem) => void }) {
  const [canPreview, setCanPreview] = useState(false)
  useEffect(() => {
    setCanPreview(
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
  }, [])

  if (items.length === 1) {
    const it = items[0]
    return (
      <div className="wrap">
        <Piece item={it} canPreview={canPreview} onPlay={onPlay} single />
      </div>
    )
  }

  return (
    <ul className="wrap grid gap-x-8 gap-y-16 md:gap-y-20 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <li key={it.key} className={i % 3 === 1 ? 'lg:mt-24' : ''}>
          <Piece item={it} canPreview={canPreview} onPlay={onPlay} eager={i < 3} />
        </li>
      ))}
    </ul>
  )
}

function Piece({
  item,
  canPreview,
  onPlay,
  eager,
  single,
}: {
  item: WorkItem
  canPreview: boolean
  onPlay: (item: WorkItem) => void
  eager?: boolean
  single?: boolean
}) {
  const [hover, setHover] = useState(false)
  const preview = canPreview && isVideoFile(item.video)
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onFocus: () => setHover(true),
    onBlur: () => setHover(false),
  }

  const frame = (
    <span className="block grade aspect-[4/3] overflow-hidden bg-[#0d0d0d] edge">
      <span className="absolute inset-0 transition-[transform,opacity] duration-700 group-hover:scale-[1.02]" style={{ transitionTimingFunction: 'var(--ease)' }}>
        <WorkImage src={item.image} srcs={item.images} video={item.video} alt={item.title} eager={eager} />
        {preview && hover && (
          <video src={item.video} autoPlay muted loop playsInline data-managed="" className="cover absolute inset-0 fade-in" />
        )}
      </span>
    </span>
  )

  const caption = (
    <span className={`block ${single ? '' : 'mt-4'}`}>
      <span className="flex items-baseline justify-between gap-4">
        <span className="t-title text-[1.125rem] md:text-[1.1875rem]">{item.title}</span>
        {item.year && <span className="t-meta t-num shrink-0">{item.year}</span>}
      </span>
      <span className="t-meta block mt-1">{item.role || item.categoryLabel}</span>
      {single && item.description && (
        <span className="block mt-4 text-[0.9375rem] leading-[1.65] text-[#c9c8c2] max-w-[44ch] line-clamp-4">{item.description}</span>
      )}
    </span>
  )

  const body = single ? (
    <span className="grid gap-6 lg:grid-cols-12 lg:gap-x-8 lg:items-end text-left">
      <span className="block lg:col-span-6">{frame}</span>
      <span className="block lg:col-span-4 lg:col-start-8">{caption}</span>
    </span>
  ) : (
    <>
      {frame}
      {caption}
    </>
  )

  return item.href ? (
    <Link href={item.href} className="group block" {...handlers}>
      {body}
    </Link>
  ) : (
    <button type="button" onClick={() => onPlay(item)} className="group block w-full text-left" {...handlers}>
      {body}
    </button>
  )
}
