'use client'

import { Project, CATEGORIES } from '@/lib/types'
import { useState, useEffect } from 'react'

interface ProjectListProps {
  projects: Project[]
  onEdit: (project: Project) => void
  onDelete: () => void
}

export default function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [orderedProjects, setOrderedProjects] = useState<Project[]>([])

  useEffect(() => {
    setOrderedProjects(projects || [])
  }, [projects])

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find((c) => c.value === value)?.label || value
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newProjects = [...orderedProjects]
    const draggedProject = newProjects[draggedIndex]
    newProjects.splice(draggedIndex, 1)
    newProjects.splice(dropIndex, 0, draggedProject)

    setOrderedProjects(newProjects)
    setDraggedIndex(null)

    // Update order in database
    try {
      const updateData = newProjects.map((project, index) => ({
        id: project.id,
        display_order: index,
      }))

      const res = await fetch('/api/projects', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: updateData }),
      })

      if (!res.ok) {
        console.error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
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

  if (orderedProjects.length === 0) {
    return <div className="text-center text-gray-500 py-8">No projects yet</div>
  }

  return (
    <div className="space-y-4">
      {orderedProjects.map((project, index) => (
        <div
          key={project.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          className={`bg-white rounded-lg overflow-hidden shadow-lg border-2 transition cursor-move ${
            draggedIndex === index ? 'border-blue-500 opacity-50' : 'border-gray-200'
          }`}
        >
          <div className="flex gap-4">
            {project.image_url && (
              <img src={project.image_url} alt={project.title} className="w-48 h-48 object-cover" />
            )}

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Project {index + 1}</p>
                <h3 className="text-lg font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{project.description}</p>

                <div className="flex items-center justify-start gap-2">
                  <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                    {getCategoryLabel(project.category)}
                  </span>
                  {project.video_url && (
                    <span className="inline-block bg-red-200 text-red-800 px-3 py-1 rounded text-xs font-medium">
                      {project.video_url.includes('youtube') ? '▶️ YouTube' : '▶️ Video'}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
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
        </div>
      ))}
    </div>
  )
}
