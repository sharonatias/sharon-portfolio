'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Project, CATEGORIES } from '@/lib/types'
import ProjectForm from '@/components/ProjectForm'
import ProjectList from '@/components/ProjectList'

export default function AdminDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (!isAdmin) {
      router.push('/admin')
    }
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingProject(null)
            }}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
          >
            {showForm ? 'Cancel' : '+ Add New Project'}
          </button>
        </div>

        {showForm && (
          <ProjectForm
            project={editingProject}
            onSave={(project) => {
              fetchProjects()
              setShowForm(false)
              setEditingProject(null)
            }}
          />
        )}

        <ProjectList
          projects={projects}
          onEdit={(project) => {
            setEditingProject(project)
            setShowForm(true)
          }}
          onDelete={() => fetchProjects()}
        />
      </div>
    </div>
  )
}
