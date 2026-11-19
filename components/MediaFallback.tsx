'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Handles images and videos that fail to load (e.g. dead Cloudinary URLs):
 * the element is hidden and its card gets a neutral gradient, so the public
 * site never shows broken-image icons or blank boxes.
 * Admin pages are left untouched so broken media stays visible while editing.
 */

const FALLBACK_BG = 'linear-gradient(135deg, #1c1c1e 0%, #000000 100%)'

function hideMedia(el: HTMLElement) {
  // Components that handle their own fallbacks mark their media with data-managed
  if (el.hasAttribute('data-managed')) return
  el.style.display = 'none'
  const parent = el.parentElement
  if (parent && !parent.style.background) {
    parent.style.background = FALLBACK_BG
  }
}

export function MediaFallback() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return

    // Images that already failed before this effect ran will not fire an error again.
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
        hideMedia(img)
      }
    })

    const onError = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      if (target instanceof HTMLImageElement) {
        hideMedia(target)
        return
      }

      // A <source> inside a <video> failed: hide the whole video element.
      if (target instanceof HTMLSourceElement && target.parentElement instanceof HTMLVideoElement) {
        hideMedia(target.parentElement)
      }
    }

    // Resource errors do not bubble, so listen in the capture phase.
    window.addEventListener('error', onError, true)
    return () => window.removeEventListener('error', onError, true)
  }, [pathname])

  return null
}
