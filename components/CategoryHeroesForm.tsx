'use client'

import React, { useState, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'

interface CategoryHero {
  id?: string
  category_key: string
  title: string
  image_url: string
}

const CATEGORIES = [
  { key: 'featured', label: 'Films & Video' },
  { key: 'brand_design', label: 'Brand & Digital Design' },
  { key: 'ai_creative_technology', label: 'AI & Creative Technology' },
]

interface CategoryHeroesFormProps {
  onSave: () => void
}

export default function CategoryHeroesForm({ onSave }: CategoryHeroesFormProps) {
  const [heroes, setHeroes] = useState<CategoryHero[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchHeroes()
  }, [])

  const fetchHeroes = async () => {
    try {
      const res = await fetch('/api/category-heroes')
      const data = await res.json()
      console.log('Fetched heroes:', data)
      setHeroes(data || [])
    } catch (error) {
      console.error('Failed to fetch heroes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (categoryKey: string, field: string, value: string) => {
    setHeroes(heroes.map(h =>
      h.category_key === categoryKey
        ? { ...h, [field]: value }
        : h
    ))
  }

  const handleSave = async (categoryKey: string) => {
    setSaving(true)
    try {
      const hero = heroes.find(h => h.category_key === categoryKey)
      if (!hero) return

      const res = await fetch('/api/category-heroes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hero),
      })

      if (!res.ok) {
        throw new Error('Failed to save')
      }

      alert('✅ ' + CATEGORIES.find(c => c.key === categoryKey)?.label + ' updated!')
      onSave()
    } catch (error) {
      console.error('Failed to save:', error)
      alert('❌ Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>
  }

  return (
    <div className="space-y-8">
      {CATEGORIES.map(category => {
        const hero = heroes.find(h => h.category_key === category.key) || {
          category_key: category.key,
          title: category.label,
          image_url: '',
        }

        return (
          <div key={category.key} className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold mb-4">{category.label}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={hero.title || ''}
                  onChange={(e) => handleUpdate(category.key, 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Manual)
                </label>
                <input
                  type="text"
                  value={hero.image_url || ''}
                  onChange={(e) => handleUpdate(category.key, 'image_url', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Upload Image
                </label>
                <CldUploadWidget
                  uploadPreset="sharon_portfolio"
                  onSuccess={(result: any) => {
                    const url = result.info.secure_url
                    handleUpdate(category.key, 'image_url', url)
                  }}
                  options={{
                    resourceType: 'auto',
                    maxFileSize: 100000000,
                  }}
                >
                  {({ open }) => (
                    <button
                      type="button"
                      onClick={() => open()}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-black hover:text-black transition font-medium"
                    >
                      📸 Click to Upload Image
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              {hero.image_url && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={hero.image_url}
                      alt={hero.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={() => handleSave(category.key)}
                disabled={saving}
                className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 transition"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
