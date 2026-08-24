'use client'

import { useState, useEffect } from 'react'

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    const savedFontSize = localStorage.getItem('font-size')
    const savedContrast = localStorage.getItem('high-contrast')

    if (savedFontSize) {
      setFontSize(parseInt(savedFontSize))
      document.documentElement.style.fontSize = `${parseInt(savedFontSize)}%`
    }
    if (savedContrast) {
      setHighContrast(JSON.parse(savedContrast))
    }
  }, [])

  const handleFontSize = (size: number) => {
    setFontSize(size)
    localStorage.setItem('font-size', size.toString())
    document.documentElement.style.fontSize = `${size}%`
  }

  const handleContrast = () => {
    const newContrast = !highContrast
    setHighContrast(newContrast)
    localStorage.setItem('high-contrast', JSON.stringify(newContrast))

    if (newContrast) {
      document.documentElement.classList.add('high-contrast-mode')
    } else {
      document.documentElement.classList.remove('high-contrast-mode')
    }
  }

  const handleReset = () => {
    setFontSize(100)
    setHighContrast(false)
    localStorage.removeItem('font-size')
    localStorage.removeItem('high-contrast')
    document.documentElement.style.fontSize = '100%'
    document.documentElement.classList.remove('high-contrast-mode')
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition focus:outline-2 focus:outline-offset-2 focus:outline-blue-400"
        aria-label="הגדרות הנגשה"
        aria-expanded={isOpen}
      >
        ♿
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl p-6 z-40 w-80 high-contrast:border-2 high-contrast:border-black dark:high-contrast:border-white">
          <h2 className="text-lg font-bold mb-4">הגדרות הנגשה</h2>

          <div className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">
                גודל טקסט
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFontSize(80)}
                  className={`px-3 py-1 rounded text-sm ${
                    fontSize === 80 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-pressed={fontSize === 80}
                >
                  קטן
                </button>
                <button
                  onClick={() => handleFontSize(100)}
                  className={`px-3 py-1 rounded text-sm ${
                    fontSize === 100 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-pressed={fontSize === 100}
                >
                  רגיל
                </button>
                <button
                  onClick={() => handleFontSize(120)}
                  className={`px-3 py-1 rounded text-sm ${
                    fontSize === 120 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-pressed={fontSize === 120}
                >
                  גדול
                </button>
                <button
                  onClick={() => handleFontSize(150)}
                  className={`px-3 py-1 rounded text-sm ${
                    fontSize === 150 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                  aria-pressed={fontSize === 150}
                >
                  גדול מאוד
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={handleContrast}
                  className="w-4 h-4 rounded"
                  aria-label="מצב ניגודיות גבוהה"
                />
                <span className="text-sm font-medium">ניגודיות גבוהה</span>
              </label>
            </div>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-full px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition text-sm font-medium"
            >
              איפוס הגדרות
            </button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            ⚡ האתר עומד בתקן WCAG 2.0 Level AA
          </p>
        </div>
      )}

      <style>{`
        .high-contrast-mode {
          --tw-bg-opacity: 1;
        }

        .high-contrast-mode * {
          border-width: 2px !important;
          font-weight: 600 !important;
        }

        .high-contrast-mode button,
        .high-contrast-mode a {
          border: 2px solid currentColor !important;
          text-decoration: underline !important;
        }

        .high-contrast-mode {
          background-color: #000 !important;
          color: #fff !important;
        }

        .high-contrast-mode a {
          color: #ffff00 !important;
        }
      `}</style>
    </>
  )
}
