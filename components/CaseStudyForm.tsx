'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { AppCase } from '@/lib/types'

interface CaseStudyFormProps {
  caseStudy?: AppCase | null
  onSave: (caseStudy: AppCase) => void
}

export default function CaseStudyForm({ caseStudy, onSave }: CaseStudyFormProps) {
  const [formData, setFormData] = useState<Partial<AppCase>>(
    caseStudy || {
      title: '',
      subtitle: '',
      year: new Date().getFullYear().toString(),
      role: '',
      hero_image: '',
      hero_description: '',
      brand_color: '#000000',
    }
  )
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleHeroUpload = (result: any) => {
    setFormData((prev) => ({
      ...prev,
      hero_image: result.info.secure_url,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      // Validate required fields
      if (!formData.title?.trim()) {
        alert('Title is required')
        setUploading(false)
        return
      }

      if (!formData.hero_image) {
        alert('Hero image is required')
        setUploading(false)
        return
      }

      console.log('Submitting case study data:', formData)

      const url = caseStudy?.id ? `/api/case-studies/${caseStudy.id}` : '/api/case-studies'
      const method = caseStudy?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const saved = await res.json()
        console.log('Case Study saved:', saved)
        onSave(saved)
        alert('Video Case Study saved successfully!')
      } else {
        const errorData = await res.text()
        console.error('Failed to save case study:', errorData)
        alert(`Failed to save case study: ${errorData}`)
      }
    } catch (error) {
      console.error('Error saving case study:', error)
      alert(`Error saving case study: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Main Details */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-black">Video Case Study Details</h2>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Case study title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Case study subtitle"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              placeholder="2025"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              placeholder="Your role"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Brand Color</label>
          <input
            type="color"
            name="brand_color"
            value={formData.brand_color || '#000000'}
            onChange={handleInputChange}
            className="w-20 h-10 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Hero Description</label>
          <textarea
            name="hero_description"
            value={formData.hero_description || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black resize-none"
            rows={3}
            placeholder="Describe the case study"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Hero Image *</label>
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={(result: any) => {
              console.log('Upload success:', result)
              handleHeroUpload(result)
            }}
            options={{
              resourceType: 'auto',
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
                  Upload Hero Image
                </button>
                {formData.hero_image && (
                  <div>
                    <p className="text-sm text-gray-600">Hero image uploaded ✓</p>
                    <img src={formData.hero_image} alt="Hero" className="w-32 h-32 object-cover rounded mt-2" />
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
      >
        {uploading ? 'Saving...' : caseStudy?.id ? 'Update Case Study' : 'Create Case Study'}
      </button>
    </form>
  )
}
