'use client'

import { useEffect, useRef, useState } from 'react'
import { embedUrl, isVideoFile, videoFrameUrl, videoSource, videoThumb } from '@/lib/media'

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
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden bg-black cq ${className}`} aria-label={label} role={label ? 'img' : undefined}>
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

/**
 * Still for a card or frame. Tries, in order: the given image, every other image found on the
 * project, a frame rendered by the video host, a YouTube thumbnail, then a frame taken from the
 * video file itself. Only if all of that fails does it show the title on a quiet frame.
 */
export function WorkImage({
  src,
  srcs,
  video,
  alt,
  className = '',
  eager = false,
}: {
  src?: string
  srcs?: string[]
  video?: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const candidates = Array.from(
    new Set([src, ...(srcs || []), videoFrameUrl(video), videoThumb(video)].filter((x): x is string => !!x))
  )
  const signature = candidates.join('|')
  const [failed, setFailed] = useState(0)
  const [videoFailed, setVideoFailed] = useState(false)
  useEffect(() => {
    setFailed(0)
    setVideoFailed(false)
  }, [signature])

  if (failed < candidates.length) {
    const current = candidates[failed]
    return (
      <img
        key={current}
        src={current}
        alt={alt}
        data-managed=""
        className={`cover ${className}`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed((n) => n + 1)}
      />
    )
  }

  if (isVideoFile(video) && !videoFailed) {
    // Let the browser decode a frame a couple of seconds in: a real frame from the film
    return (
      <video
        src={`${video}#t=2`}
        muted
        playsInline
        preload="metadata"
        data-managed=""
        aria-label={alt}
        className={`cover ${className}`}
        onError={() => setVideoFailed(true)}
      />
    )
  }

  return (
    <div className={`w-full h-full flex items-end p-4 bg-[#141414] text-[var(--dim)] ${className}`}>
      <span className="t-title text-lg">{alt}</span>
    </div>
  )
}
