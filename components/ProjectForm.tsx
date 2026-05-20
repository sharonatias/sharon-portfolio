'use client'

import { useState, useRef } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Project, CATEGORIES } from '@/lib/types'

interface ProjectFormProps {
  project?: Project | null
  onSave: (project: Project) => void
}

export default function ProjectForm({ project, onSave }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(
    project || {
      title: '',
      description: '',
      category: 'videos_for_companies',
      image_url: '',
      video_url: '',
    }
  )
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadSuccess = (result: any, type: 'image' | 'video') => {
    const url = result.info.secure_url
    setFormData((prev) => ({
      ...prev,
      [type === 'image' ? 'image_url' : 'video_url']: url,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const url = project?.id ? `/api/projects/${project.id}` : '/api/projects'
      const method = project?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const saved = await res.json()
        onSave(saved)
      } else {
        console.error('Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-8 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cover Image</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleUploadSuccess(result, 'image')}
        >
          {({ open }) => (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => open()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upload Image
              </button>
              {formData.image_url && (
                <div>
                  <p className="text-sm text-gray-600">Image uploaded ✓</p>
                  <img src={formData.image_url} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Video (Optional)</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleUploadSuccess(result, 'video')}
          options={{
            resourceType: 'video',
            maxFileSize: 100000000,
          }}
        >
          {({ open }) => (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => open()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upload Video
              </button>
              {formData.video_url && <p className="text-sm text-gray-600">Video uploaded ✓</p>}
            </div>
          )}
        </CldUploadWidget>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
      >
        {uploading ? 'Saving...' : project?.id ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  )
}
