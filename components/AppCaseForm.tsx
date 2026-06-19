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
  label: undefined,
}

export default function AppCaseForm({ appCase, onSave }: AppCaseFormProps) {
  const defaultCase: AppCase = {
    title: '',
    subtitle: '',
    year: new Date().getFullYear().toString(),
    role: '',
    client: '',
    duration: '',
    format: '',
    hero_image: '',
    hero_description: '',
    watch_film_link: '',
    video_file: '',
    problem: { ...emptySection, label: 'THE BRIEF' },
    insight: { ...emptySection, label: 'THE CHALLENGE' },
    approach: { ...emptySection, label: 'CREATIVE CONCEPT' },
    flow: { ...emptySection, label: 'FLOW' },
    interaction: { ...emptySection, label: 'VISUAL LANGUAGE' },
    outcome: { ...emptySection, label: 'OUTCOME' },
    gallery_images: [],
    process_blocks: [],
    my_role_title: '',
    my_role_description: '',
    brand_color: '#000000',
    brand_design_id: undefined,
    custom_sections: [],
  }

  const [uploading, setUploading] = useState(false)
  const [brandDesigns, setBrandDesigns] = useState<BrandDesign[]>([])

  // Helper function to build form data
  const buildFormData = (caseData: AppCase | null | undefined): AppCase => {
    if (!caseData) return defaultCase
    return {
      ...defaultCase,
      ...caseData,
      // Ensure all required fields exist
      title: caseData.title || '',
      subtitle: caseData.subtitle || '',
      year: caseData.year || new Date().getFullYear().toString(),
      role: caseData.role || '',
      client: (caseData as any).client || '',
      duration: (caseData as any).duration || '',
      format: (caseData as any).format || '',
      hero_image: caseData.hero_image || '',
      hero_description: caseData.hero_description || '',
      watch_film_link: caseData.watch_film_link || '',
      video_file: caseData.video_file || '',
      problem: { ...emptySection, label: 'THE BRIEF', ...(caseData.problem || {}) },
      insight: { ...emptySection, label: 'THE CHALLENGE', ...(caseData.insight || {}) },
      approach: { ...emptySection, label: 'CREATIVE CONCEPT', ...(caseData.approach || {}) },
      flow: { ...emptySection, label: 'FLOW', ...(caseData.flow || {}) },
      interaction: { ...emptySection, label: 'VISUAL LANGUAGE', ...(caseData.interaction || {}) },
      outcome: { ...emptySection, label: 'OUTCOME', ...(caseData.outcome || {}) },
      gallery_images: (caseData as any).gallery_images || [],
      process_blocks: (caseData as any).process_blocks || [],
      my_role_title: (caseData as any).my_role_title || '',
      my_role_description: (caseData as any).my_role_description || '',
      brand_color: caseData.brand_color || '#000000',
      brand_design_id: caseData.brand_design_id,
      custom_sections: (caseData as any).custom_sections || [],
    }
  }

  const [formData, setFormData] = useState<AppCase>(buildFormData(appCase))

  useEffect(() => {
    // Update form data when appCase changes (e.g., switching between editing different cases)
    setFormData(buildFormData(appCase))
  }, [appCase?.id])

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

  const addProcessBlock = () => {
    const newBlock = {
      number: ((formData as any).process_blocks?.length || 0) + 1,
      title: '',
      description: '',
      image: '',
    }
    setFormData((prev) => ({
      ...prev,
      process_blocks: [...((prev as any).process_blocks || []), newBlock],
    }))
  }

  const removeProcessBlock = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      process_blocks: (prev as any).process_blocks.filter((_: any, i: number) => i !== index),
    }))
  }

  const addCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      label: '',
      title: '',
      description: '',
      images: [],
      order: ((formData as any).custom_sections?.length || 0) + 1,
    }
    setFormData((prev) => ({
      ...prev,
      custom_sections: [...((prev as any).custom_sections || []), newSection],
    }))
  }

  const removeCustomSection = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      custom_sections: ((prev as any).custom_sections || []).filter((_: any) => _.id !== id),
    }))
  }

  const updateCustomSection = (id: string, field: string, value: any) => {
    const updated = ((formData as any).custom_sections || []).map((section: any) =>
      section.id === id ? { ...section, [field]: value } : section
    )
    setFormData((prev) => ({ ...prev, custom_sections: updated }))
  }

  const addImageToCustomSection = (id: string, imageUrl: string) => {
    updateCustomSection(id, 'images', [
      ...((formData as any).custom_sections.find((s: any) => s.id === id)?.images || []),
      imageUrl,
    ])
  }

  const removeImageFromCustomSection = (id: string, index: number) => {
    const section = (formData as any).custom_sections.find((s: any) => s.id === id)
    if (section) {
      updateCustomSection(id, 'images', section.images.filter((_: string, i: number) => i !== index))
    }
  }

  const updateProcessBlock = (index: number, field: string, value: any) => {
    const updated = [...((formData as any).process_blocks || [])]
    updated[index] = { ...updated[index], [field]: value }
    setFormData((prev) => ({ ...prev, process_blocks: updated as any }))
  }

  const renderSectionForm = (sectionName: string, sectionLabel: string) => {
    const section = (formData as any)[sectionName]

    return (
      <div key={sectionName} className="bg-gray-100 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 text-black">{sectionLabel}</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Section Label (Editable)</label>
          <input
            type="text"
            value={section.label || sectionLabel}
            onChange={(e) => handleSectionChange(sectionName, 'label', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder={sectionLabel}
          />
        </div>

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

  const renderCustomSectionForm = (customSection: any) => {
    return (
      <div key={customSection.id} className="bg-white rounded-lg p-6 mb-6 border-l-4 border-blue-600">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-black">Custom Section {(formData as any).custom_sections?.indexOf(customSection) + 1}</h4>
          <button
            type="button"
            onClick={() => removeCustomSection(customSection.id)}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Remove
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Section Label *</label>
          <input
            type="text"
            value={customSection.label}
            onChange={(e) => updateCustomSection(customSection.id, 'label', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="e.g., MY PROCESS, RESULTS, etc."
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Title</label>
          <input
            type="text"
            value={customSection.title}
            onChange={(e) => updateCustomSection(customSection.id, 'title', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Section title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Description</label>
          <textarea
            value={customSection.description}
            onChange={(e) => updateCustomSection(customSection.id, 'description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black resize-none"
            rows={4}
            placeholder="Section description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Images</label>
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={(result: any) => addImageToCustomSection(customSection.id, result.info.secure_url)}
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

                {customSection.images && customSection.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {customSection.images.map((img: string, index: number) => (
                      <div key={index} className="relative group">
                        <img src={img} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded" />
                        <button
                          type="button"
                          onClick={() => removeImageFromCustomSection(customSection.id, index)}
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
            <label className="block text-sm font-medium mb-2 text-black">Client</label>
            <input
              type="text"
              name="client"
              value={(formData as any).client || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>
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
        </div>

        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Duration</label>
            <input
              type="text"
              name="duration"
              value={(formData as any).duration || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              placeholder="e.g., 2 months"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Format</label>
          <input
            type="text"
            name="format"
            value={(formData as any).format || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="e.g., Short Film, Commercial, etc."
          />
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
              value={formData.category || 'brand_design'}
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

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Watch Film Link (URL)</label>
          <input
            type="url"
            name="watch_film_link"
            value={formData.watch_film_link || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="https://example.com/video"
          />
          <p className="text-xs text-gray-500 mt-1">Link to external video (YouTube, Vimeo, etc.)</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Or Upload Video File</label>
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={(result: any) => setFormData((prev) => ({ ...prev, video_file: result.info.secure_url }))}
            options={{
              resourceType: 'video',
              maxFileSize: 500000000,
            }}
          >
            {({ open }) => (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => open()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload Video File
                </button>
                {formData.video_file && (
                  <div>
                    <p className="text-sm text-gray-600">Video file uploaded ✓</p>
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
          <p className="text-xs text-gray-500 mt-1">Upload MP4, WebM, or other video formats (max 500MB)</p>
        </div>
      </div>

      {/* Sections */}
      {renderSectionForm('problem', 'The Brief')}
      {renderSectionForm('insight', 'The Challenge')}
      {renderSectionForm('approach', 'Creative Concept')}
      {renderSectionForm('interaction', 'Visual Language')}
      {renderSectionForm('outcome', 'Outcome')}

      {/* Custom Sections */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-black">Custom Sections (Optional)</h3>
          <button
            type="button"
            onClick={addCustomSection}
            disabled={((formData as any).custom_sections?.length || 0) >= 5}
            className={`px-4 py-2 rounded text-white ${
              ((formData as any).custom_sections?.length || 0) >= 5
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            + Add Custom Section {((formData as any).custom_sections?.length || 0) >= 5 ? '(Max 5 reached)' : ''}
          </button>
        </div>

        {(formData as any).custom_sections && (formData as any).custom_sections.length > 0 && (
          <div className="space-y-6">
            {(formData as any).custom_sections.map((customSection: any) => renderCustomSectionForm(customSection))}
          </div>
        )}

        {(!((formData as any).custom_sections) || (formData as any).custom_sections.length === 0) && (
          <p className="text-sm text-gray-500 italic">No custom sections yet. Click "Add Custom Section" to create one.</p>
        )}
      </div>

      {/* Process Blocks */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 text-black">Process Blocks</h3>
        {(formData as any).process_blocks && (formData as any).process_blocks.length > 0 && (
          <div className="space-y-6 mb-6">
            {(formData as any).process_blocks.map((block: any, idx: number) => (
              <div key={idx} className="bg-white rounded p-4 border border-gray-300">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold text-black">Block {idx + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProcessBlock(idx)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-black">Title</label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) => updateProcessBlock(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-black text-sm"
                    placeholder="Block title"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-black">Description</label>
                  <textarea
                    value={block.description}
                    onChange={(e) => updateProcessBlock(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-black text-sm resize-none"
                    rows={3}
                    placeholder="Block description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Image (Optional)</label>
                  <div className="flex items-center gap-2">
                    {block.image && (
                      <img src={block.image} alt={block.title} className="w-16 h-16 object-cover rounded" />
                    )}
                    <CldUploadWidget
                      uploadPreset="sharon_portfolio"
                      onSuccess={(result: any) => updateProcessBlock(idx, 'image', result.info.secure_url)}
                      options={{
                        resourceType: 'auto',
                        maxFileSize: 100000000,
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                        >
                          Upload Image
                        </button>
                      )}
                    </CldUploadWidget>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={addProcessBlock}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Add Process Block
        </button>
      </div>

      {/* Gallery Images */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 text-black">Gallery Images</h3>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => {
            const newImages = [...((formData as any).gallery_images || []), result.info.secure_url]
            setFormData((prev) => ({ ...prev, gallery_images: newImages as any }))
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
                + Add Gallery Image
              </button>
              {(formData as any).gallery_images && (formData as any).gallery_images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {(formData as any).gallery_images.map((img: string, idx: number) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = (formData as any).gallery_images.filter((_: string, i: number) => i !== idx)
                          setFormData((prev) => ({ ...prev, gallery_images: filtered as any }))
                        }}
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

      {/* My Role Section */}
      <div className="bg-gray-100 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-bold mb-4 text-black">My Role</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Role Title</label>
          <input
            type="text"
            value={(formData as any).my_role_title || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, my_role_title: e.target.value as any }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="e.g., Creative Director"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Role Description</label>
          <textarea
            value={(formData as any).my_role_description || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, my_role_description: e.target.value as any }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black resize-none"
            rows={4}
            placeholder="Describe your role in this project"
          />
        </div>
      </div>

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
