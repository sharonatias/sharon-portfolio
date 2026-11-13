'use client'

import { usePathname } from 'next/navigation'

/**
 * A soft dark gradient behind the fixed header on the dark pages, so the
 * logo and menu stay readable when content scrolls underneath them.
 * Brand case-study pages are white, so they are skipped.
 */
export function TopShade() {
  const pathname = usePathname() ?? ''
  if (pathname.startsWith('/brand') || pathname.startsWith('/admin')) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 h-28 z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent"
    />
  )
}
