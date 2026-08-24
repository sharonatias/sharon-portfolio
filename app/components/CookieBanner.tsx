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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50 border-t border-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 text-sm md:text-base">
          <p className="mb-2">
            🍪 <strong>עוגיות ומעקב:</strong> אנחנו משתמשים בעוגיות כדי לשפר את חוויית הגלישה.
            <Link href="/privacy" className="underline hover:text-blue-300 ml-1">
              קראו את מדיניות הפרטיות
            </Link>
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition text-sm font-medium"
          >
            דחיית
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition text-sm font-medium"
          >
            אני מסכים
          </button>
        </div>
      </div>
    </div>
  )
}
