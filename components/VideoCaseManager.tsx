'use client'

import { useState } from 'react'
import { AppCase } from '@/lib/types'
import CaseStudyForm from './CaseStudyForm'

interface VideoCaseManagerProps {
  cases: AppCase[]
  onUpdate: () => void
}

const VIDEO_CATEGORIES = [
  'documentary',
  'commercial',
  'music_video',
  'short_film',
  'educational',
  'other'
]

const CATEGORY_LABELS: Record<string, string> = {
  documentary: 'דוקומנטר',
  commercial: 'פרסום',
  music_video: 'קליפ מוסיקה',
  short_film: 'סרט קצר',
  educational: 'חינוכי',
  other: 'אחר'
}

export default function VideoCaseManager({ cases, onUpdate }: VideoCaseManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const videoCases = cases.filter(c => c.category === 'featured')
  const filteredCases = selectedCategory
    ? videoCases.filter(c => c.category === selectedCategory)
    : videoCases

  const handleDelete = async (id: string) => {
    if (!confirm('בטוח שברצונך למחוק סרט זה?')) return

    try {
      const res = await fetch(`/api/case-studies/${id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error deleting case:', error)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">סרטי וידאו ({filteredCases.length})</h2>
          <p className="text-sm text-gray-500 mt-1">ערוך ונהל את כל סרטי הווידאו שלך</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
        >
          {showForm ? '✕ ביטול' : '+ סרט חדש'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <CaseStudyForm
            onSave={() => {
              setShowForm(false)
              onUpdate()
            }}
          />
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            selectedCategory === null
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          הכל ({videoCases.length})
        </button>
        {VIDEO_CATEGORIES.map((cat) => {
          const count = videoCases.filter(c => c.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {CATEGORY_LABELS[cat]} ({count})
            </button>
          )
        })}
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">אין סרטים בקטגוריה זו</p>
        ) : (
          <div className="space-y-2">
            {filteredCases.map((videoCase) => (
              <div
                key={videoCase.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition"
              >
                {/* Thumbnail */}
                {videoCase.hero_image && (
                  <img
                    src={videoCase.hero_image}
                    alt={videoCase.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{videoCase.title}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                      {CATEGORY_LABELS[videoCase.category || 'other']}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      {videoCase.year || 'בלי שנה'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(videoCase.id)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                  >
                    ✏️ עריכה
                  </button>
                  <button
                    onClick={() => handleDelete(videoCase.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    🗑️ מחיקה
                  </button>
                  <a
                    href={`/case-studies/${videoCase.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                  >
                    👁️ צפייה
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">עריכת סרט</h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <CaseStudyForm
              caseStudy={cases.find(c => c.id === editingId) || null}
              onSave={() => {
                setEditingId(null)
                onUpdate()
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
