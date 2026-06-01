'use client'

import { useState, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { AppCase, CaseStudySection, BrandDesign, CATEGORIES } from '@/lib/types'

interface AppCaseFormProps {
  appCase?: AppCase | null
  onSave: (appCase: AppCase) => void
}

const emptySection: CaseStudySection = {
  title: '',
  description: '',
  images: [],
  accentColor: undefined,
}

export default function AppCaseForm({ appCase, onSave }: AppCaseFormProps) {
  const defaultCase: AppCase = {
    title: '',
    subtitle: '',
    year: new Date().getFullYear().toString(),
    role: '',
    hero_image: '',
    hero_description: '',
    problem: { ...emptySection },
    insight: { ...emptySection },
    approach: { ...emptySection },
    flow: { ...emptySection },
    interaction: { ...emptySection },
    outcome: { ...emptySection },
    brand_color: '#000000',
    brand_design_id: undefined,
  }

  const [formData, setFormData] = useState<AppCase>(
    appCase ? {
      ...defaultCase,
      ...appCase,
      // Ensure all required fields exist
      title: appCase.title || '',
      subtitle: appCase.subtitle || '',
      year: appCase.year || new Date().getFullYear().toString(),
      role: appCase.role || '',
      hero_image: appCase.hero_image || '',
      hero_description: appCase.hero_description || '',
      problem: appCase.problem || { ...emptySection },
      insight: appCase.insight || { ...emptySection },
      approach: appCase.approach || { ...emptySection },
      flow: appCase.flow || { ...emptySection },
      interaction: appCase.interaction || { ...emptySection },
      outcome: appCase.outcome || { ...emptySection },
      brand_color: appCase.brand_color || '#000000',
      brand_design_id: appCase.brand_design_id,
    } : defaultCase
  )
  const [uploading, setUploading] = useState(false)
  const [brandDesigns, setBrandDesigns] = useState<BrandDesign[]>([])

  useEffect(() => {
    fetchBrandDesigns()
  }, [])

  const fetchBrandDesigns = async () => {
    try {
      const res = await fetch('/api/brand-design')
      const data = await res.json()
      setBrandDesigns(data)
    } catch (error) {
      console.error('Failed to fetch brand designs:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSectionChange = (sectionName: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [sectionName]: {
        ...(prev as any)[sectionName],
        [field]: value,
      },
    }))
  }

  const handleUploadSuccess = (result: any, sectionName: string) => {
    const url = result.info.secure_url
    handleSectionChange(sectionName, 'images', [
      ...((formData as any)[sectionName]?.images || []),
      url,
    ])
  }

  const removeImage = (sectionName: string, index: number) => {
    handleSectionChange(
      sectionName,
      'images',
      ((formData as any)[sectionName]?.images || []).filter((_: string, i: number) => i !== index)
    )
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
      if (!formData.title.trim()) {
        alert('Title is required')
        setUploading(false)
        return
      }

      if (!formData.hero_image) {
        alert('Hero image is required')
        setUploading(false)
        return
      }

      console.log('Submitting form data:', formData)

      const url = appCase?.id ? `/api/app-cases/${appCase.id}` : '/api/app-cases'
      const method = appCase?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const saved = await res.json()
        console.log('Case Study saved:', saved)
        onSave(saved)
        alert('Case Study saved successfully!')
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

  const renderSectionForm = (sectionName: string, sectionLabel: string) => {
    const section = (formData as any)[sectionName]

    return (
      <div key={sectionName} className="bg-gray-100 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 text-black">{sectionLabel}</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Title</label>
          <input
            type="text"
            value={section.title}
            onChange={(e) => handleSectionChange(sectionName, 'title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Section title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Description</label>
          <textarea
            value={section.description}
            onChange={(e) => handleSectionChange(sectionName, 'description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black resize-none"
            rows={4}
            placeholder="Section description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Accent Color (Optional)</label>
          <input
            type="color"
            value={section.accentColor || '#000000'}
            onChange={(e) => handleSectionChange(sectionName, 'accentColor', e.target.value)}
            className="w-20 h-10 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Images</label>
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={(result: any) => handleUploadSuccess(result, sectionName)}
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
                  + Add Image
                </button>

                {section.images && section.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {section.images.map((img: string, index: number) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImage(sectionName, index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hero Section */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-black">Case Study Details</h2>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Year</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Role</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Brand Color</label>
            <input
              type="color"
              name="brand_color"
              value={formData.brand_color}
              onChange={handleInputChange}
              className="w-20 h-10 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Category</label>
            <select
              value={formData.category || 'brand_digital_design'}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as any }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Link to Brand Design (Optional)</label>
          <select
            value={formData.brand_design_id || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, brand_design_id: e.target.value || undefined }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
          >
            <option value="">None</option>
            {brandDesigns.map((design) => (
              <option key={design.id} value={design.id}>
                {design.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Hero Description</label>
          <textarea
            name="hero_description"
            value={formData.hero_description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black resize-none"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Hero Image *</label>
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={(result: any) => handleHeroUpload(result)}
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

      {/* Sections */}
      {renderSectionForm('problem', 'The Challenge')}
      {renderSectionForm('insight', 'The Insight')}
      {renderSectionForm('approach', 'Our Approach')}
      {renderSectionForm('flow', 'User Experience Flow')}
      {renderSectionForm('interaction', 'Key Interaction')}
      {renderSectionForm('outcome', 'Outcome')}

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
      >
        {uploading ? 'Saving...' : appCase?.id ? 'Update Case Study' : 'Create Case Study'}
      </button>
    </form>
  )
}
