// Helpers for the different ways a video can be given in the admin:
// an uploaded file (mp4/webm/mov), a YouTube link or a Vimeo link.

export function youTubeId(url?: string) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/)
  return m ? m[1] : null
}

export function vimeoId(url?: string) {
  if (!url) return null
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  return m ? m[1] : null
}

export type VideoSource =
  | { kind: 'file'; src: string }
  | { kind: 'youtube'; id: string }
  | { kind: 'vimeo'; id: string }

export function videoSource(url?: string): VideoSource | null {
  if (!url) return null
  const yt = youTubeId(url)
  if (yt) return { kind: 'youtube', id: yt }
  const vm = vimeoId(url)
  if (vm) return { kind: 'vimeo', id: vm }
  return { kind: 'file', src: url }
}

/** Embed URL. `background` = muted, looping, no controls (for heroes). */
export function embedUrl(source: VideoSource, opts: { background?: boolean; autoplay?: boolean } = {}) {
  if (source.kind === 'youtube') {
    const p = new URLSearchParams({ rel: '0', modestbranding: '1', playsinline: '1' })
    if (opts.autoplay || opts.background) p.set('autoplay', '1')
    if (opts.background) {
      p.set('mute', '1')
      p.set('controls', '0')
      p.set('loop', '1')
      p.set('playlist', source.id)
    }
    return `https://www.youtube.com/embed/${source.id}?${p.toString()}`
  }
  if (source.kind === 'vimeo') {
    const p = new URLSearchParams({ dnt: '1' })
    if (opts.autoplay || opts.background) p.set('autoplay', '1')
    if (opts.background) {
      p.set('muted', '1')
      p.set('loop', '1')
      p.set('background', '1')
    }
    return `https://player.vimeo.com/video/${source.id}?${p.toString()}`
  }
  return source.src
}

/** A still for a YouTube link, used when a project has no image of its own. */
export function videoThumb(url?: string) {
  const yt = youTubeId(url)
  return yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : undefined
}
