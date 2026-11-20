'use client'

import Link from 'next/link'
import { useSiteContent } from '@/lib/useSiteContent'

export function whatsappLink(phone?: string) {
  const digits = (phone || '').replace(/\D/g, '')
  return digits ? `https://wa.me/${digits}` : ''
}

/** Closing credits: one big invitation, then the practical details. */
export function SiteFooter({ tone = 'dark', cta = true }: { tone?: 'dark' | 'light'; cta?: boolean }) {
  const { texts } = useSiteContent()
  const socials = [
    { label: 'Instagram', href: texts.instagram },
    { label: 'YouTube', href: texts.youtube },
    { label: 'Vimeo', href: texts.vimeo },
    { label: 'LinkedIn', href: texts.linkedin },
  ].filter((s) => s.href)
  const wa = whatsappLink(texts.phone)

  return (
    <footer className={`${tone === 'light' ? 'tone-light' : 'tone-dark'} rule-top`}>
      <div className={`wrap ${cta ? 'pt-24 md:pt-32 pb-10' : 'py-6'}`}>
        {cta && (
        <a
          href={`mailto:${texts.email}`}
          className="t-display block text-[clamp(2.25rem,4.2vw,4.25rem)] max-w-[12ch] hover:opacity-80 transition-opacity"
        >
          {texts.ctaLine}
        </a>
        )}

        {cta && (
        <div className={`mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-[0.9375rem]`}>
          <div>
            <p className="t-meta mb-1">Email</p>
            <a href={`mailto:${texts.email}`} className="link-draw break-all">
              {texts.email}
            </a>
          </div>
          {texts.phone && (
            <div>
              <p className="t-meta mb-1">Phone & WhatsApp</p>
              <a href={wa || `tel:${texts.phone}`} target="_blank" rel="noopener noreferrer" className="link-draw t-num">
                {texts.phone}
              </a>
            </div>
          )}
          {socials.length > 0 && (
            <div>
              <p className="t-meta mb-1">Follow</p>
              <ul className="flex flex-wrap gap-x-5 gap-y-1">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-draw">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {texts.location && (
            <div>
              <p className="t-meta mb-1">Based in</p>
              <p>{texts.location}</p>
            </div>
          )}
        </div>

        )}

        <div className={`${cta ? 'mt-20 pt-6 rule-top' : ''} flex flex-wrap justify-between gap-4 t-meta`}>
          <p>© {new Date().getFullYear()} Sharon Moshe Attias, OpenMindStudio</p>
          <p className="flex gap-5">
            <Link href="/privacy" className="link-draw">
              Privacy
            </Link>
            <Link href="/admin" className="link-draw">
              Admin
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
