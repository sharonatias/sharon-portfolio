'use client'

import { useState, useRef } from 'react'

export default function PageEditorV3() {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [content, setContent] = useState({
    heroTitle: 'Creating documentaries, brands and visual experiences.',
    heroSubtitle: 'Blending design and AI-driven creation.',
    heroVideoUrl: ''
  })
  const videoInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    setSaving(true)
    try {
      setMessage({ type: 'success', text: '✅ Saved successfully!' })
      setTimeout(() => setMessage(null), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Error saving' })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setContent({ ...content, heroVideoUrl: data.url })
      setMessage({ type: 'success', text: `✅ Video "${data.filename}" uploaded successfully!` })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error instanceof Error ? error.message : 'Upload error'}` })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="p-8">
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-600/20 border border-green-500/30 text-green-400'
            : 'bg-red-600/20 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-3xl space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-xl p-8 backdrop-blur">
          <h2 className="text-xl font-light tracking-wider text-cyan-400 mb-6">Hero Section</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-3 font-light">Main Title</label>
              <input
                type="text"
                value={content.heroTitle}
                onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
                className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-blue-500 focus:bg-slate-950 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3 font-light">Subtitle</label>
              <input
                type="text"
                value={content.heroSubtitle}
                onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })}
                className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-blue-500 focus:bg-slate-950 focus:outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-3 font-light">Hero Section Video</label>
              <div className="space-y-3">
                {content.heroVideoUrl && (
                  <div className="bg-slate-950/30 border border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-2">Video Preview:</p>
                    <video
                      src={content.heroVideoUrl}
                      controls
                      className="w-full max-h-48 rounded-lg mb-3"
                    />
                    <div className="flex gap-2">
                      <a
                        href={content.heroVideoUrl}
                        download
                        className="flex-1 px-3 py-2 text-sm bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all text-center"
                      >
                        📥 Download Video
                      </a>
                      <button
                        onClick={() => setContent({ ...content, heroVideoUrl: '' })}
                        className="flex-1 px-3 py-2 text-sm bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="flex-1 px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-all"
                  >
                    🎬 {content.heroVideoUrl ? 'Replace Video' : 'Upload Video'}
                  </button>
                </div>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />

                <input
                  type="text"
                  placeholder="Or paste video link (YouTube, Vimeo, etc.)"
                  value={content.heroVideoUrl}
                  onChange={(e) => setContent({ ...content, heroVideoUrl: e.target.value })}
                  className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 text-white text-sm rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-light rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? '💾 Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
