'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Hides images and videos that fail to load (e.g. dead Cloudinary URLs),
 * so the public site shows clean empty areas instead of broken-image icons.
 * Admin pages are left untouched so broken media stays visible while editing.
 */
export function MediaFallback() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return

    const onError = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      if (target instanceof HTMLImageElement) {
        target.style.display = 'none'
        return
      }

      // A <source> inside a <video> failed: hide the whole video element.
      if (target instanceof HTMLSourceElement && target.parentElement instanceof HTMLVideoElement) {
        target.parentElement.style.display = 'none'
      }
    }

    // Images that already failed before this effect ran would not fire again.
    document.querySelectorAll('img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) {
        img.style.display = 'none'
      }
    })

    // Resource errors do not bubble, so listen in the capture phase.
    window.addEventListener('error', onError, true)
    return () => window.removeEventListener('error', onError, true)
  }, [pathname])

  return null
}
