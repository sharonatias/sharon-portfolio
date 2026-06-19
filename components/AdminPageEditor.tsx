'use client'

import { useState } from 'react'

export default function PageEditor() {
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState({
    heroTitle: 'Creating documentaries, brands and visual experiences.',
    heroSubtitle: 'Blending design and AI-driven creation.',
    heroVideoUrl: '',
    statsYears: '10+',
    statsProjects: '50+',
    statsProduction: '8+',
    statsDisciplines: '3',
    currentlyExploringTitle: 'CURRENTLY EXPLORING',
    aboutText: '',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save content
      const res = await fetch('/api/page-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      })

      if (res.ok) {
        alert('✅ שמור בהצלחה!')
      }
    } catch (error) {
      alert('❌ שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="border-b border-gray-800 pb-8">
          <h2 className="text-lg font-light tracking-wider mb-6">סקשן הגדול</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">כותרת ראשית</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">תת-כותרת</label>
              <input
                type="text"
                value={content.heroSubtitle}
                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">לינק וידאו (YouTube או mp4)</label>
              <input
                type="text"
                value={content.heroVideoUrl}
                onChange={(e) => setContent({ ...content, heroVideoUrl: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
                placeholder="https://youtube.com/... או https://example.com/video.mp4"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-b border-gray-800 pb-8">
          <h2 className="text-lg font-light tracking-wider mb-6">סטטיסטיקה</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">שנים ניסיון</label>
              <input
                type="text"
                value={content.statsYears}
                onChange={(e) => setContent({ ...content, statsYears: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">פרוייקטים</label>
              <input
                type="text"
                value={content.statsProjects}
                onChange={(e) => setContent({ ...content, statsProjects: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">שנים בייצור</label>
              <input
                type="text"
                value={content.statsProduction}
                onChange={(e) => setContent({ ...content, statsProduction: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">דיסציפלינות</label>
              <input
                type="text"
                value={content.statsDisciplines}
                onChange={(e) => setContent({ ...content, statsDisciplines: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Currently Exploring */}
        <section className="border-b border-gray-800 pb-8">
          <h2 className="text-lg font-light tracking-wider mb-6">כרגע משוכללים</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-2">כותרת</label>
            <input
              type="text"
              value={content.currentlyExploringTitle}
              onChange={(e) => setContent({ ...content, currentlyExploringTitle: e.target.value })}
              className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
            />
          </div>
        </section>

        {/* Save Button */}
        <div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-white text-black text-sm font-light tracking-wider hover:bg-gray-200 transition disabled:opacity-50"
          >
            {saving ? 'שומר...' : 'שמור שינויים'}
          </button>
        </div>
      </div>
    </div>
  )
}
