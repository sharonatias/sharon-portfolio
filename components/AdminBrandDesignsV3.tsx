'use client'

import { useState, useEffect } from 'react'
import { BrandDesign } from '@/lib/types'
import BrandDesignForm from './BrandDesignForm'

export default function BrandDesignsAdminV3() {
  const [designs, setDesigns] = useState<BrandDesign[]>([])
  const [editingDesign, setEditingDesign] = useState<BrandDesign | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDesigns()
  }, [])

  const loadDesigns = async () => {
    try {
      const res = await fetch('/api/brand-design')
      const data = await res.json()
      setDesigns(data)
    } catch (error) {
      console.error('Error loading designs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (updatedDesign: BrandDesign) => {
    try {
      if (editingDesign?.id) {
        // Update existing design
        const res = await fetch(`/api/brand-design/${editingDesign.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDesign)
        })

        if (res.ok) {
          setEditingDesign(null)
          loadDesigns()
        } else {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to save design')
        }
      } else {
        // Create new design
        const res = await fetch('/api/brand-design', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDesign)
        })

        if (res.ok) {
          setEditingDesign(null)
          loadDesigns()
        } else {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to create design')
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this brand design?')) return

    try {
      const res = await fetch(`/api/brand-design/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDesigns()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleCreateNew = () => {
    setEditingDesign({
      title: '',
      story: '',
      logo_url: '',
      color_palette: { colors: [] },
      images: [],
      mockups: [],
      process_description: '',
      process_images: [],
      category: 'brand_design'
    })
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8">
      {editingDesign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-950 p-6 border-b border-blue-500/20 flex justify-between items-center">
              <h2 className="text-2xl font-light text-orange-400">Edit Brand Design</h2>
              <button
                onClick={() => setEditingDesign(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <BrandDesignForm
                project={editingDesign}
                onSave={async (updatedDesign) => {
                  await handleSave(updatedDesign)
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light tracking-wider text-purple-400">Brand Designs ({designs.length})</h2>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            ➕ New Brand Design
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {designs.map((design) => (
            <div key={design.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300 group">
              {design.logo_url && (
                <img
                  src={design.logo_url}
                  alt={design.title}
                  className="w-16 h-16 object-contain rounded-lg mb-4"
                />
              )}

              <h3 className="text-sm font-light text-white mb-2">{design.title || '(Untitled)'}</h3>

              {design.color_palette && design.color_palette.colors && design.color_palette.colors.length > 0 && (
                <div className="flex gap-1 mb-4">
                  {design.color_palette.colors.slice(0, 4).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded border border-gray-600"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingDesign(design)}
                  className="flex-1 px-3 py-1.5 text-xs bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/40 transition-all duration-300"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(design.id || '')}
                  className="flex-1 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all duration-300"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
