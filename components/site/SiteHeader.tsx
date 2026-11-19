'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useSiteContent } from '@/lib/useSiteContent'
import { tidyRole } from '@/lib/site'

const NAV = [
  { href: '/projects', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

/**
 * The top bar of the letterbox: name on the left, three links on the right.
 * Sticky and solid, so it always reads, on video or on white.
 */
export function SiteHeader({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const pathname = usePathname() || '/'
  const { content } = useSiteContent()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const isActive = (href: string) =>
    href === '/projects'
      ? pathname.startsWith('/projects') ||
        pathname.startsWith('/case-studies') ||
        pathname.startsWith('/brand')
      : pathname.startsWith(href)

  // Close on route change
  useEffect(() => setOpen(false), [pathname])

  // Lock scroll, close on Escape, move focus into the menu
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    menuRef.current?.querySelector('a')?.focus()
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      buttonRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <header
        className={`${tone === 'light' ? 'tone-light' : 'tone-dark'} sticky top-0 z-40 rule-bottom`}
        style={{ height: 'var(--header-h)' }}
      >
        <div className="wrap h-full flex items-center justify-between gap-6">
          <Link href="/" className="flex items-baseline gap-4 min-w-0" aria-label="Sharon Moshe Attias, home">
            <span
              className="whitespace-nowrap text-[1.125rem] md:text-[1.375rem]"
              style={{ fontWeight: 800, fontVariationSettings: "'wdth' 68", letterSpacing: '0.01em' }}
            >
              SHARON MOSHE ATTIAS
            </span>
            <span className="t-meta hidden lg:inline truncate">{tidyRole(content.heroRole)}</span>
          </Link>

          <nav aria-label="Main" className="hidden md:flex items-center gap-8 text-[0.9375rem]">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? 'page' : undefined}
                className="link-draw transition-colors"
                style={{ color: isActive(n.href) ? 'var(--fg)' : 'var(--mute)' }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <button
            ref={buttonRef}
            type="button"
            className="md:hidden text-[0.9375rem] py-2 -my-2"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {open && (
        <div
          id="site-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="tone-dark fixed inset-0 z-50 flex flex-col fade-in md:hidden"
        >
          <div className="wrap flex items-center justify-between rule-bottom" style={{ height: 'var(--header-h)' }}>
            <span style={{ fontWeight: 800, fontVariationSettings: "'wdth' 68" }} className="text-[1.125rem]">
              SHARON MOSHE ATTIAS
            </span>
            <button type="button" className="text-[0.9375rem] py-2" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
          <nav aria-label="Main" className="wrap flex-1 flex flex-col justify-center gap-2">
            {[{ href: '/', label: 'Home' }, ...NAV].map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={(n.href === '/' ? pathname === '/' : isActive(n.href)) ? 'page' : undefined}
                className="t-display text-[clamp(3.5rem,17vw,6rem)]"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="wrap pb-8 t-meta">{tidyRole(content.heroRole)}</div>
        </div>
      )}
    </>
  )
}
