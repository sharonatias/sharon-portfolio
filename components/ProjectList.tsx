'use client'

import { Project, CATEGORIES } from '@/lib/types'
import { useState } from 'react'

interface ProjectListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: () => void
}

export default function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find((c) => c.value === value)?.label || value
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        onDelete()
      }
    } catch (error) {
      console.error('Failed to delete project:', error)
    } finally {
      setDeletingId(null)
    }
  }

  if (projects.length === 0) {
    return <div className="text-center text-gray-500 py-8">No projects yet</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
          {project.image_url && (
            <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover" />
          )}

          <div className="p-4">
            <h3 className="text-lg font-bold mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{project.description}</p>

            <div className="flex items-center justify-between mb-4">
              <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                {getCategoryLabel(project.category)}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(project)}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id!)}
                disabled={deletingId === project.id}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm font-medium disabled:bg-gray-400"
              >
                {deletingId === project.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
