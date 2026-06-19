'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/types'

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: 'featured',
    display_order: 1
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Error loading projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingId(project.id)
    setFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      category: project.category,
      display_order: project.display_order || 1
    })
  }

  const handleSave = async () => {
    if (!editingId) return

    try {
      const res = await fetch(`/api/projects/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setEditingId(null)
        loadProjects()
      }
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('למחוק?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadProjects()
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
          <h2 className="text-lg font-light tracking-wider mb-6">עריכה</h2>

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
              <label className="block text-sm text-gray-400 mb-2">תיאור</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">לינק תמונה</label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">קטגוריה</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
                >
                  <option value="films_video">סרטים</option>
                  <option value="brand_digital_design">עיצוב</option>
                  <option value="ai_creative_technology">AI</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">סדר</label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full bg-gray-900 border border-gray-800 px-4 py-2 text-white text-sm focus:border-gray-700 focus:outline-none"
                />
              </div>
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
        <h2 className="text-lg font-light tracking-wider mb-6">פרוייקטים ({projects.length})</h2>

        {projects.map((project, idx) => (
          <div key={project.id} className="border border-gray-800 p-4 hover:border-gray-700 transition">
            <div className="flex items-start gap-4">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-12 h-12 object-cover rounded"
                />
              )}

              <div className="flex-1">
                <div className="text-white font-light">{idx + 1}. {project.title}</div>
                <div className="text-xs text-gray-500 mt-1">{project.category}</div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-3 py-1 text-xs border border-gray-700 text-gray-400 hover:text-gray-300 transition"
                >
                  עריכה
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-3 py-1 text-xs border border-red-900 text-red-400 hover:text-red-300 transition"
                >
                  מחיקה
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
