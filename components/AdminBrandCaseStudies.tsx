'use client'

import { useState, useEffect } from 'react'
import { BrandCaseStudy } from '@/lib/types'
import AdminBrandCaseStudyEditorV3 from './AdminBrandCaseStudyEditorV3'

export default function BrandCaseStudiesAdminV3() {
  const [cases, setCases] = useState<BrandCaseStudy[]>([])
  const [editingCase, setEditingCase] = useState<BrandCaseStudy | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    try {
      const res = await fetch('/api/brand-case-studies')
      const data = await res.json()
      setCases(data)
    } catch (error) {
      console.error('Error loading cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (updatedCase: BrandCaseStudy) => {
    try {
      if (editingCase?.id) {
        // Update existing case study
        const res = await fetch(`/api/brand-case-studies/${editingCase.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCase)
        })

        if (res.ok) {
          setEditingCase(null)
          loadCases()
        } else {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to save case study')
        }
      } else {
        // Create new case study
        const res = await fetch('/api/brand-case-studies', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCase)
        })

        if (res.ok) {
          setEditingCase(null)
          loadCases()
        } else {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to create case study')
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this case study?')) return

    try {
      const res = await fetch(`/api/brand-case-studies/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadCases()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleCreateNew = () => {
    setEditingCase({
      title: '',
      subtitle: '',
      year: '',
      client: '',
      role: '',
      hero_image: '',
      hero_description: '',
      central_description: '',
      color_palette: [],
      idea: { title: '', description: '', images: [] },
      system: { title: '', description: '', images: [] },
      shape: { title: '', description: '', images: [] },
      motion: { title: '', description: '', images: [] },
      applications: { title: '', description: '', images: [], imageLayout: 'grid' },
      color: { title: '', description: '', images: [] },
      type: { title: '', description: '', images: [] },
      videos: [],
      cto: {
        name: 'Hila',
        title: 'CEO of Shine',
        image: '',
        description: `Hila leads the creation of high-impact business presentations for publicly traded companies combining strategy, storytelling, and design to drive clarity and results.

Through in depth research, brand positioning, and audience analysis, we crafted a refined visual identity that reflects both creativity and corporate precision.`
      },
      category: 'brand_design'
    })
  }

  const handleCreateFromTemplate = () => {
    // Use Brand Case 2 template ID directly
    const TEMPLATE_ID = '6bd2ffa2-2b79-4c1e-9121-6d841e107192'
    const brandCase2 = cases.find(c => c.id === TEMPLATE_ID)
    if (!brandCase2) {
      alert('Brand Case 2 template not found')
      return
    }
    const newCase = JSON.parse(JSON.stringify(brandCase2))
    delete newCase.id
    newCase.title = 'New Brand Case'
    newCase.subtitle = 'Your Brand Story'
    newCase.client = 'Your Client Name'
    setEditingCase(newCase as BrandCaseStudy)
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8">
      {editingCase && (
        <AdminBrandCaseStudyEditorV3
          caseStudy={editingCase}
          onSave={handleSave}
          onClose={() => setEditingCase(null)}
        />
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light tracking-wider text-orange-400">Brand Case Studies ({cases.length})</h2>
          <div className="flex gap-3">
            <button
              onClick={handleCreateFromTemplate}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-blue-500/50 transition-all"
            >
              📋 Brand Case 2 Template
            </button>
            <button
              onClick={handleCreateNew}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              ➕ New Brand Case Study
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((caseStudy) => (
            <div key={caseStudy.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/50 transition-all duration-300 group">
              {caseStudy.hero_image && (
                <img
                  src={caseStudy.hero_image}
                  alt={caseStudy.title}
                  className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
              )}

              <h3 className="text-sm font-light text-white mb-2">{caseStudy.title}</h3>
              <div className="flex justify-between items-start mb-4">
                <p className="text-xs text-gray-500">{caseStudy.year}</p>
                {caseStudy.category && (
                  <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                    {caseStudy.category.replace(/_/g, ' ').toUpperCase()}
                  </span>
                )}
              </div>

              {caseStudy.color_palette && caseStudy.color_palette.length > 0 && (
                <div className="flex gap-1 mb-4">
                  {caseStudy.color_palette.slice(0, 4).map((color, i) => (
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
                  onClick={() => setEditingCase(caseStudy)}
                  className="flex-1 px-3 py-1.5 text-xs bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all duration-300"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(caseStudy.id || '')}
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
