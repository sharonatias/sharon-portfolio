'use client'

import { useEffect, useRef, useState } from 'react'
import { embedUrl, videoSource, videoThumb } from '@/lib/media'

/**
 * Silent, looping video that fills its frame (file, YouTube or Vimeo).
 * The poster shows until the video is ready, and stays if it never is.
 */
export function BackgroundVideo({
  url,
  poster,
  className = '',
  label,
}: {
  url?: string
  poster?: string
  className?: string
  label?: string
}) {
  const source = videoSource(url)
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    // Some browsers ignore autoplay until play() is called explicitly
    if (source?.kind === 'file' && !reduced) ref.current?.play().catch(() => {})
  }, [source?.kind, reduced, url])

  const stillSrc = poster || videoThumb(url)

  return (
    <div className={`relative overflow-hidden bg-black cq ${className}`} aria-label={label} role={label ? 'img' : undefined}>
      {stillSrc && (
        <img
          src={stillSrc}
          alt=""
          className="cover absolute inset-0"
          style={{ opacity: ready ? 0 : 1, transition: 'opacity .6s ease' }}
        />
      )}
      {source && !reduced && source.kind === 'file' && (
        <video
          ref={ref}
          className="cover absolute inset-0"
          src={source.src}
          poster={stillSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setReady(true)}
          style={{ opacity: ready ? 1 : 0, transition: 'opacity .6s ease' }}
        />
      )}
      {source && !reduced && source.kind !== 'file' && (
        <iframe
          src={embedUrl(source, { background: true })}
          className="embed-cover"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          title={label || 'Background video'}
          onLoad={() => setTimeout(() => setReady(true), 900)}
          style={{ opacity: ready ? 1 : 0, transition: 'opacity .6s ease' }}
        />
      )}
    </div>
  )
}

/** A playable video with controls (file, YouTube or Vimeo). */
export function PlayableVideo({ url, title, autoPlay = true }: { url: string; title?: string; autoPlay?: boolean }) {
  const source = videoSource(url)
  if (!source) return null
  if (source.kind === 'file') {
    return (
      <video className="w-full h-full bg-black" src={source.src} controls autoPlay={autoPlay} playsInline>
        Your browser can’t play this video.
      </video>
    )
  }
  return (
    <iframe
      src={embedUrl(source, { autoplay: autoPlay })}
      className="w-full h-full border-0 bg-black"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      title={title || 'Video'}
    />
  )
}

/** Image for a card; falls back to the video's thumbnail, then to a quiet frame with the title. */
export function WorkImage({
  src,
  video,
  alt,
  className = '',
  eager = false,
}: {
  src?: string
  video?: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const s = src || videoThumb(video)
  if (!s) {
    return (
      <div className={`flex items-end p-4 bg-[#141414] text-[var(--dim)] ${className}`}>
        <span className="t-title text-lg">{alt}</span>
      </div>
    )
  }
  return <img src={s} alt={alt} className={`cover ${className}`} loading={eager ? 'eager' : 'lazy'} decoding="async" />
}
