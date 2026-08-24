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
    <div className="fixed bottom-0 right-0 left-0 bg-black text-white p-6 z-50 border-t border-white border-opacity-10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-8">
        <div className="flex-1 text-right">
          <p className="text-sm md:text-base leading-relaxed">
            <strong className="block mb-2">🍪 מדיניות עוגיות ומעקב</strong>
            אנו משתמשים בעוגיות לשיפור חוויית הגלישה ו-analytics. על ידי המשך הגלישה, אתה מסכים לשימוש בעוגיות.
            <Link href="/privacy" className="underline hover:text-gray-300 transition block mt-2">
              ← קראו את מדיניות הפרטיות המלאה
            </Link>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0 md:flex-row flex-row-reverse">
          <button
            onClick={handleAccept}
            className="px-6 py-2 rounded bg-white text-black hover:bg-gray-200 transition text-sm font-semibold whitespace-nowrap"
            aria-label="אישור עוגיות"
          >
            אני מסכים
          </button>
          <button
            onClick={handleReject}
            className="px-6 py-2 rounded border border-white text-white hover:bg-white hover:text-black transition text-sm font-semibold whitespace-nowrap"
            aria-label="דחיית עוגיות"
          >
            דחיה
          </button>
        </div>
      </div>
    </div>
  )
}
