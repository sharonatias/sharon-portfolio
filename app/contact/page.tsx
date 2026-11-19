'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter, whatsappLink } from '@/components/site/SiteFooter'
import { useSiteContent } from '@/lib/useSiteContent'

export default function ContactPage() {
  const { texts } = useSiteContent()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const wa = whatsappLink(texts.phone)

  // Sends the message through WhatsApp, or by email when there is no phone number
  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    const body = name.trim() ? `${message.trim()}\n\n— ${name.trim()}` : message.trim()
    const url = wa
      ? `${wa}?text=${encodeURIComponent(body)}`
      : `mailto:${texts.email}?subject=${encodeURIComponent('Hello from your website')}&body=${encodeURIComponent(body)}`
    window.open(url, '_blank', 'noopener')
  }

  const field =
    'w-full bg-transparent border-0 border-b border-[var(--rule)] focus:border-[var(--paper)] outline-none py-3 text-[1.125rem] placeholder:text-[#6f6e69] transition-colors'

  return (
    <>
      <SiteHeader />
      <main className="tone-dark">
        <section className="wrap pt-14 md:pt-20 pb-16 md:pb-24 grid gap-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <h1 className="open-1 t-display text-[clamp(4rem,12vw,11rem)]">Contact</h1>
            <p className="open-2 t-lead text-[#d6d5cf] mt-8 max-w-[44ch]">
              Have a film, a brand or an idea that needs a director’s eye? Write a few lines and I’ll get back to you.
            </p>

            <dl className="mt-12 grid gap-6 sm:grid-cols-2 max-w-[640px]">
              <div>
                <dt className="t-meta">Email</dt>
                <dd className="mt-1">
                  <a href={`mailto:${texts.email}`} className="link-draw text-[1.125rem] break-all">
                    {texts.email}
                  </a>
                </dd>
              </div>
              {texts.phone && (
                <div>
                  <dt className="t-meta">Phone & WhatsApp</dt>
                  <dd className="mt-1">
                    <a href={`tel:${texts.phone}`} className="link-draw text-[1.125rem] t-num">
                      {texts.phone}
                    </a>
                  </dd>
                </div>
              )}
              {texts.location && (
                <div>
                  <dt className="t-meta">Based in</dt>
                  <dd className="mt-1 text-[1.125rem]">{texts.location}</dd>
                </div>
              )}
            </dl>
          </div>

          <form onSubmit={send} className="lg:col-span-5 lg:pt-6 self-end" aria-label="Send a message">
            <label className="block">
              <span className="t-meta">Your name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={field} autoComplete="name" />
            </label>
            <label className="block mt-8">
              <span className="t-meta">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                className={`${field} resize-none`}
                placeholder="Tell me about the project"
              />
            </label>
            <div className="mt-8 flex items-center justify-between gap-4 flex-wrap">
              <button
                type="submit"
                disabled={!message.trim()}
                className="bg-[var(--paper)] text-black px-6 py-3 text-[0.9375rem] font-semibold disabled:opacity-40 hover:bg-white transition-colors"
              >
                {wa ? 'Send on WhatsApp' : 'Send by email'}
              </button>
              <span className="t-meta">Opens {wa ? 'WhatsApp' : 'your email app'} with your message.</span>
            </div>
          </form>
        </section>
      </main>
      <SiteFooter cta={false} />
    </>
  )
}
