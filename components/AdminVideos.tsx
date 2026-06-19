'use client'

import { useState, useEffect } from 'react'
import { AppCase } from '@/lib/types'

export default function VideosAdmin() {
  const [cases, setCases] = useState<AppCase[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    hero_description: '',
    watch_film_link: '',
    video_file: '',
    hero_image: '',
    year: new Date().getFullYear().toString(),
    my_role_title: '',
    my_role_description: ''
  })

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    try {
      const res = await fetch('/api/case-studies')
      const data = await res.json()
      setCases(data.filter((c: AppCase) => c.category === 'documentary'))
    } catch (error) {
      console.error('Error loading cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (caseStudy: AppCase) => {
    setEditingId(caseStudy.id)
    setFormData({
      title: caseStudy.title,
      subtitle: caseStudy.subtitle || '',
      hero_description: caseStudy.hero_description || '',
      watch_film_link: caseStudy.watch_film_link || '',
      video_file: caseStudy.video_file || '',
      hero_image: caseStudy.hero_image || '',
      year: caseStudy.year || new Date().getFullYear().toString(),
      my_role_title: caseStudy.my_role_title || '',
      my_role_description: caseStudy.my_role_description || ''
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    try {
      const res = await fetch(`/api/case-studies/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setEditingId(null)
        loadCases()
      }
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק?')) return

    try {
      const res = await fetch(`/api/case-studies/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadCases()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  if (loading) return <div className="p-8 text-gray-400">טוען...</div>

  return (
    <div className="p-8 max-w-5xl">
      {editingId ? (
        <div className="border border-gray-800 p-8 mb-8">
          <h2 className="text-lg font-light tracking-wider mb-6">עריכת סרט</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">כותרת</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">תת-כותרת</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">תיאור הגדול</label>
              <textarea
                value={formData.hero_description}
                onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                rows={3}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">שנה</label>
              <input
                type="text"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">לינק וידאו (YouTube)</label>
              <input
                type="text"
                value={formData.watch_film_link}
                onChange={(e) => setFormData({ ...formData, watch_film_link: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">לינק וידאו (מקומי)</label>
              <input
                type="text"
                value={formData.video_file}
                onChange={(e) => setFormData({ ...formData, video_file: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
                placeholder="https://example.com/video.mp4"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">תמונת הגדול</label>
              <input
                type="text"
                value={formData.hero_image}
                onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">תפקידי בסרט</label>
              <input
                type="text"
                value={formData.my_role_title}
                onChange={(e) => setFormData({ ...formData, my_role_title: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">תיאור התפקיד</label>
              <textarea
                value={formData.my_role_description}
                onChange={(e) => setFormData({ ...formData, my_role_description: e.target.value })}
                rows={3}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-white text-black text-sm font-light tracking-wider hover:bg-gray-200 transition"
              >
                שמור
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="px-6 py-2 border border-gray-700 text-gray-400 text-sm hover:text-gray-300 transition"
              >
                ביטול
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <h2 className="text-lg font-light tracking-wider mb-6">סרטי וידאו ({cases.length})</h2>

        {cases.map((caseStudy) => (
          <div key={caseStudy.id} className="border border-gray-800 p-4 hover:border-gray-700 transition">
            <div className="flex items-start gap-4">
              {caseStudy.hero_image && (
                <img
                  src={caseStudy.hero_image}
                  alt={caseStudy.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <div className="text-white font-light">{caseStudy.title}</div>
                <div className="text-xs text-gray-500 mt-1">{caseStudy.year}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(caseStudy)}
                  className="px-3 py-1 text-xs border border-gray-700 text-gray-400 hover:text-gray-300 transition"
                >
                  עריכה
                </button>
                <button
                  onClick={() => handleDelete(caseStudy.id)}
                  className="px-3 py-1 text-xs border border-red-900 text-red-400 hover:text-red-300 transition"
                >
                  מחיקה
                </button>
                <a
                  href={`/case-studies/${caseStudy.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-xs border border-gray-700 text-gray-400 hover:text-gray-300 transition"
                >
                  צפייה
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
