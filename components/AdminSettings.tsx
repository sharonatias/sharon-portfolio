'use client'

import { useState } from 'react'

export default function SettingsAdmin() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Sharon Moshe Attias',
    tagline: 'Creative & Director',
    email: 'sharonatias@gmail.com',
    instagramUrl: 'https://www.instagram.com/sharon.attias/',
    youtubeUrl: 'https://www.youtube.com/@sharonattias7274',
    aboutText: ''
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (res.ok) {
        alert('✅ הגדרות שמורו!')
      }
    } catch (error) {
      alert('❌ שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="space-y-8">
        {/* Site Info */}
        <section className="border-b border-gray-800 pb-8">
          <h2 className="text-lg font-light tracking-wider mb-6">מידע האתר</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">שם האתר</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">תגית</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">אימייל</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="border-b border-gray-800 pb-8">
          <h2 className="text-lg font-light tracking-wider mb-6">קישורים חברתיים</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Instagram</label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">YouTube</label>
              <input
                type="text"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* About */}
        <section className="border-b border-gray-800 pb-8">
          <h2 className="text-lg font-light tracking-wider mb-6">עמוד אודות</h2>

          <div>
            <label className="block text-sm text-gray-400 mb-2">ביוגרפיה</label>
            <textarea
              value={settings.aboutText}
              onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
              rows={6}
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
            {saving ? 'שומר...' : 'שמור הגדרות'}
          </button>
        </div>
      </div>
    </div>
  )
}
