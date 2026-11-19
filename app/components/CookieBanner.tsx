'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShowBanner(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div
      dir="rtl"
      role="region"
      aria-label="מדיניות עוגיות"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-[400px] z-50 bg-[#141414] text-[#f2f1ec] border border-white/15 p-5 text-right fade-in"
    >
      <p className="text-[0.875rem] leading-relaxed">
        אנחנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה ולמדוד שימוש באתר.{' '}
        <Link href="/privacy" className="underline underline-offset-2">
          מדיניות הפרטיות
        </Link>
      </p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={handleAccept}
          className="px-4 py-2 bg-[#f2f1ec] text-black hover:bg-white transition text-[0.875rem] font-semibold"
        >
          אישור
        </button>
        <button
          onClick={handleReject}
          className="px-4 py-2 border border-white/40 hover:border-white transition text-[0.875rem]"
        >
          דחייה
        </button>
      </div>
    </div>
  )
}
