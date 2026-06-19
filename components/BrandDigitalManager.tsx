'use client'

import { useState } from 'react'
import { BrandDesign, AppCase } from '@/lib/types'

interface BrandDigitalManagerProps {
  brandDesigns: BrandDesign[]
  appCases: AppCase[]
  onUpdate: () => void
}

export default function BrandDigitalManager({
  brandDesigns,
  appCases,
  onUpdate
}: BrandDigitalManagerProps) {
  const [activeSection, setActiveSection] = useState<'brand' | 'app'>('brand')

  const handleDelete = async (id: string, type: 'brand' | 'app') => {
    if (!confirm('בטוח שברצונך למחוק?')) return

    try {
      const endpoint = type === 'brand' ? `/api/brand-design/${id}` : `/api/app-cases/${id}`
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  return (
    <div className="p-8">
      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveSection('brand')}
          className={`px-4 py-2 font-semibold transition border-b-2 ${
            activeSection === 'brand'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          עיצוב ומותגים ({brandDesigns.length})
        </button>
        <button
          onClick={() => setActiveSection('app')}
          className={`px-4 py-2 font-semibold transition border-b-2 ${
            activeSection === 'app'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-500 border-transparent hover:text-gray-700'
          }`}
        >
          מקרים דיגיטליים ({appCases.length})
        </button>
      </div>

      {/* Brand Designs */}
      {activeSection === 'brand' && (
        <div>
          <div className="mb-6">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold">
              + עיצוב חדש
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandDesigns.map((design) => (
              <div
                key={design.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {design.cover_image_url && (
                  <img
                    src={design.cover_image_url}
                    alt={design.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{design.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{design.story?.substring(0, 60) || 'Brand Design'}</p>
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(design.id, 'brand')}
                      className="flex-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* App Cases */}
      {activeSection === 'app' && (
        <div>
          <div className="mb-6">
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold">
              + מקרה חדש
            </button>
          </div>

          <div className="space-y-2">
            {appCases.map((appCase) => (
              <div
                key={appCase.id}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition"
              >
                {appCase.hero_image && (
                  <img
                    src={appCase.hero_image}
                    alt={appCase.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{appCase.title}</h3>
                  <p className="text-sm text-gray-500">{appCase.subtitle}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(appCase.id, 'app')}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
