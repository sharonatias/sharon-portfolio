'use client'

import { useState, useEffect } from 'react'
import { AppCase } from '@/lib/types'
import AdminCaseStudyEditorV3 from './AdminCaseStudyEditorV3'

export default function CaseStudiesAdminV3() {
  const [cases, setCases] = useState<AppCase[]>([])
  const [editingCase, setEditingCase] = useState<AppCase | null>(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])
  const [showProjects, setShowProjects] = useState(false)

  useEffect(() => {
    loadCases()
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data.filter((p: any) => p.category === 'brand_design'))
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const loadCases = async () => {
    try {
      const res = await fetch('/api/case-studies')
      const data = await res.json()
      setCases(data)
    } catch (error) {
      console.error('Error loading cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (updatedCase: AppCase) => {
    try {
      if (editingCase?.id) {
        // Update existing case study
        const res = await fetch(`/api/case-studies/${editingCase.id}`, {
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
        const res = await fetch('/api/case-studies', {
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
      const res = await fetch(`/api/case-studies/${id}`, { method: 'DELETE' })
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
      duration: '',
      format: '',
      category: 'documentary',
      hero_image: '',
      hero_description: '',
      watch_film_link: '',
      video_file: '',
      problem: { title: '', description: '', images: [] },
      insight: { title: '', description: '', images: [] },
      approach: { title: '', description: '', images: [] },
      flow: { title: '', description: '', images: [] },
      interaction: { title: '', description: '', images: [] },
      outcome: { title: '', description: '', images: [] },
      gallery_images: [],
      my_role_title: '',
      my_role_description: '',
      custom_sections: []
    })
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8">
      {editingCase && (
        <AdminCaseStudyEditorV3
          caseStudy={editingCase}
          onSave={handleSave}
          onClose={() => setEditingCase(null)}
        />
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <h2 className="text-2xl font-light tracking-wider text-purple-400">Film Case Studies ({cases.length})</h2>
            <button
              onClick={() => setShowProjects(!showProjects)}
              className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              {showProjects ? '👁️ Hide' : '🎨 Design Projects'} ({projects.length})
            </button>
          </div>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
            ➕ New Case Study
          </button>
        </div>

        {showProjects && (
          <div className="mb-12 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg">
            <h3 className="text-lg font-light text-orange-400 mb-4">All Design Projects ({projects.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="bg-slate-950/50 border border-orange-500/30 rounded-lg p-4 hover:border-orange-500/50 transition-all">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h4 className="text-sm font-light text-white mb-2">{project.title}</h4>
                  <p className="text-xs text-gray-500">{project.description?.substring(0, 60)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cases.map((caseStudy) => (
            <div key={caseStudy.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300 group">
              {caseStudy.hero_image && (
                <img
                  src={caseStudy.hero_image}
                  alt={caseStudy.title}
                  className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
              )}

              <h3 className="text-sm font-light text-white mb-2">{caseStudy.title}</h3>
              <p className="text-xs text-gray-500 mb-4">{caseStudy.year}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingCase(caseStudy)}
                  className="flex-1 px-3 py-1.5 text-xs bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/40 transition-all duration-300"
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
