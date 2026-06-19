'use client'

import { useState } from 'react'
import { Project } from '@/lib/types'
import ProjectForm from './ProjectForm'

interface ProjectsManagerProps {
  projects: Project[]
  onUpdate: () => void
}

export default function ProjectsManager({ projects, onUpdate }: ProjectsManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('בטוח שברצונך למחוק פרוייקט זה?')) return

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' })
      if (res.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  const handleReorder = async (fromIndex: number, toIndex: number) => {
    const newProjects = [...projects]
    const [movedProject] = newProjects.splice(fromIndex, 1)
    newProjects.splice(toIndex, 0, movedProject)

    // Update display_order for all affected projects
    const updates = newProjects.map((p, idx) => ({
      id: p.id,
      display_order: idx + 1
    }))

    try {
      for (const update of updates) {
        await fetch(`/api/projects/${update.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ display_order: update.display_order })
        })
      }
      onUpdate()
    } catch (error) {
      console.error('Error reordering:', error)
    }
  }

  return (
    <div className="p-8">
      {/* Add New Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
        >
          {showForm ? '✕ ביטול' : '+ פרוייקט חדש'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <ProjectForm
            onSave={() => {
              setShowForm(false)
              onUpdate()
            }}
          />
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">כל הפרוייקטים ({projects.length})</h2>

        {projects.length === 0 ? (
          <p className="text-gray-500 py-8 text-center">אין פרוייקטים עדיין</p>
        ) : (
          <div className="space-y-2">
            {projects.map((project, index) => (
              <div
                key={project.id}
                draggable
                onDragStart={() => setDraggedId(project.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedId && draggedId !== project.id) {
                    const draggedIndex = projects.findIndex((p) => p.id === draggedId)
                    handleReorder(draggedIndex, index)
                  }
                }}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition cursor-move group"
              >
                {/* Drag Handle */}
                <div className="text-gray-400 group-hover:text-gray-600">☰</div>

                {/* Project Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{project.category}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingId(project.id)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                  >
                    ✏️ עריכה
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    🗑️ מחיקה
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">עריכת פרוייקט</h2>
              <button
                onClick={() => setEditingId(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <ProjectForm
              project={projects.find(p => p.id === editingId) || null}
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
