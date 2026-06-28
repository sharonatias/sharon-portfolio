'use client'

import { useState, useEffect } from 'react'
import { Project } from '@/lib/types'
import AdminProjectEditorV3 from './AdminProjectEditorV3'

export default function ProjectsAdminV3() {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

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

  const handleSave = async (updatedProject: Project) => {
    try {
      if (editingProject?.id) {
        // Update existing project
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProject)
        })

        if (res.ok) {
          setEditingProject(null)
          loadProjects()
        }
      } else {
        // Create new project
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProject)
        })

        if (res.ok) {
          setEditingProject(null)
          loadProjects()
        }
      }
    } catch (error) {
      console.error('Error saving:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadProjects()
      }
    } catch (error) {
      console.error('Error deleting:', error)
    }
  }

  const handleCreateNew = () => {
    setEditingProject({
      title: '',
      description: '',
      category: 'featured',
      image_url: '',
      images: [],
      display_order: 0
    })
  }

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>

  return (
    <div className="p-8">
      {editingProject && (
        <AdminProjectEditorV3
          project={editingProject}
          onSave={handleSave}
          onClose={() => setEditingProject(null)}
        />
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-light tracking-wider text-green-400">Projects ({projects.length})</h2>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg text-sm hover:shadow-lg hover:shadow-green-500/50 transition-all"
          >
            ➕ New Project
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-green-500/20 rounded-lg p-4 hover:border-green-500/50 transition-all duration-300 group">
              {project.image_url && (
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                />
              )}

              <h3 className="text-sm font-light text-white mb-2">{project.title}</h3>
              <p className="text-xs text-gray-500 mb-4">{project.category}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProject(project)}
                  className="flex-1 px-3 py-1.5 text-xs bg-green-600/20 text-green-400 rounded hover:bg-green-600/40 transition-all duration-300"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id || '')}
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
