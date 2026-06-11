'use client'

import { useState, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { AppCase, CaseStudySection, CATEGORIES, ProcessBlock } from '@/lib/types'

interface CaseStudyFormProps {
  caseStudy?: AppCase | null
  onSave: (caseStudy: AppCase) => void
}

const emptySection: CaseStudySection = {
  title: '',
  description: '',
  images: [],
  accentColor: undefined,
}

const emptyProcessBlock: ProcessBlock = {
  number: 1,
  title: '',
  description: '',
  image: '',
}

export default function CaseStudyForm({ caseStudy, onSave }: CaseStudyFormProps) {
  // Helper function to build form data
  const buildFormData = (caseData: AppCase | null | undefined): AppCase => {
    if (!caseData) {
      return {
        title: '',
        subtitle: '',
        year: new Date().getFullYear().toString(),
        role: '',
        client: '',
        duration: '',
        format: '',
        category: 'films_video',
        hero_image: '',
        hero_description: '',
        watch_film_link: '',
        video_file: '',
        problem: { ...emptySection },
        insight: { ...emptySection },
        approach: { ...emptySection },
        flow: { ...emptySection },
        interaction: { ...emptySection },
        outcome: { ...emptySection },
        gallery_images: [],
        process_blocks: [],
        my_role_title: '',
        my_role_description: '',
        brand_color: '#000000',
      }
    }

    return {
      ...caseData,
      title: caseData.title || '',
      subtitle: caseData.subtitle || '',
      year: caseData.year || new Date().getFullYear().toString(),
      role: caseData.role || '',
      client: (caseData as any).client || '',
      duration: caseData.duration || '',
      format: caseData.format || '',
      category: caseData.category || 'films_video',
      hero_image: caseData.hero_image || '',
      hero_description: caseData.hero_description || '',
      watch_film_link: caseData.watch_film_link || '',
      video_file: caseData.video_file || '',
      problem: caseData.problem || { ...emptySection },
      insight: caseData.insight || { ...emptySection },
      approach: caseData.approach || { ...emptySection },
      flow: caseData.flow || { ...emptySection },
      interaction: caseData.interaction || { ...emptySection },
      outcome: caseData.outcome || { ...emptySection },
      gallery_images: caseData.gallery_images || [],
      process_blocks: caseData.process_blocks || [],
      my_role_title: caseData.my_role_title || '',
      my_role_description: caseData.my_role_description || '',
      brand_color: caseData.brand_color || '#000000',
    }
  }

  const [formData, setFormData] = useState<AppCase>(buildFormData(caseStudy))
  const [uploading, setUploading] = useState(false)

  // Update form data when caseStudy changes (e.g., switching between editing different cases)
  useEffect(() => {
    setFormData(buildFormData(caseStudy))
  }, [caseStudy?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSectionChange = (sectionName: string, field: string, value: any) => {
    console.log(`🔧 handleSectionChange: ${sectionName}.${field}`, value)
    setFormData((prev) => {
      const updated = {
        ...prev,
        [sectionName]: {
          ...(prev as any)[sectionName],
          [field]: value,
        },
      }
      console.log(`✅ Updated ${sectionName}:`, updated[sectionName as keyof typeof updated])
      return updated
    })
  }

  const handleUploadSuccess = (result: any, sectionName: string) => {
    const url = result.info?.secure_url || result.info?.url
    console.log('📸 Upload success for', sectionName)
    console.log('🔗 URL:', url)

    setFormData((prev) => {
      const currentImages = (prev as any)[sectionName]?.images || []
      console.log('📦 Current images:', currentImages)

      const newImages = [...currentImages, url]
      console.log('✅ New images array:', newImages)

      return {
        ...prev,
        [sectionName]: {
          ...(prev as any)[sectionName],
          images: newImages,
        },
      }
    })
  }

  const removeImage = (sectionName: string, index: number) => {
    handleSectionChange(
      sectionName,
      'images',
      ((formData as any)[sectionName]?.images || []).filter((_: string, i: number) => i !== index)
    )
  }

  const handleGalleryUpload = (result: any) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: [...(prev.gallery_images || []), result.info.secure_url],
    }))
  }

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: (prev.gallery_images || []).filter((_, i) => i !== index),
    }))
  }

  const handleHeroUpload = (result: any) => {
    setFormData((prev) => ({
      ...prev,
      hero_image: result.info.secure_url,
    }))
  }

  const addProcessBlock = () => {
    const newBlock: ProcessBlock = {
      number: ((formData.process_blocks?.length || 0) + 1),
      title: '',
      description: '',
      image: '',
    }
    setFormData((prev) => ({
      ...prev,
      process_blocks: [...(prev.process_blocks || []), newBlock],
    }))
  }

  const updateProcessBlock = (index: number, field: string, value: any) => {
    const blocks = formData.process_blocks || []
    const updated = [...blocks]
    updated[index] = { ...updated[index], [field]: value }
    setFormData((prev) => ({
      ...prev,
      process_blocks: updated,
    }))
  }

  const removeProcessBlock = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      process_blocks: (prev.process_blocks || []).filter((_, i) => i !== index),
    }))
  }

  const handleProcessBlockImageUpload = (result: any, index: number) => {
    updateProcessBlock(index, 'image', result.info.secure_url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      if (!formData.title?.trim()) {
        alert('Title is required')
        setUploading(false)
        return
      }

      if (!(formData as any).client?.trim()) {
        alert('Client name is required')
        setUploading(false)
        return
      }

      if (!formData.hero_image) {
        alert('Hero image is required')
        setUploading(false)
        return
      }

      const url = caseStudy?.id ? `/api/case-studies/${caseStudy.id}` : '/api/case-studies'
      const method = caseStudy?.id ? 'PUT' : 'POST'

      console.log('📤 Submitting formData:')
      console.log('  problem:', JSON.stringify(formData.problem, null, 2))
      console.log('Full body being sent:', JSON.stringify(formData, null, 2))

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const saved = await res.json()
        onSave(saved)
        alert('Case Study saved successfully!')
      } else {
        const errorData = await res.text()
        alert(`Failed to save case study: ${errorData}`)
      }
    } catch (error) {
      alert(`Error saving case study: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  const renderSectionForm = (sectionName: string, sectionLabel: string) => {
    const section = (formData as any)[sectionName]

    const deleteSection = () => {
      if (window.confirm(`Delete ${sectionLabel}? This will remove all content.`)) {
        handleSectionChange(sectionName, 'title', '')
        handleSectionChange(sectionName, 'description', '')
        handleSectionChange(sectionName, 'images', [])
        handleSectionChange(sectionName, 'accentColor', undefined)
      }
    }

    return (
      <div key={sectionName} className="bg-gray-100 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black">{sectionLabel}</h3>
          <button
            type="button"
            onClick={deleteSection}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            🗑️ Delete
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Section Label (Custom Name)</label>
          <input
            type="text"
            value={section.label || sectionLabel}
            onChange={(e) => handleSectionChange(sectionName, 'label', e.target.value || undefined)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder={sectionLabel}
          />
          <p className="text-xs text-gray-600 mt-1">Leave empty to use default: {sectionLabel}</p>
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
          <label className="block text-sm font-medium mb-2 text-black">Images (Max 4)</label>
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={(result: any) => {
              if (section.images && section.images.length >= 4) {
                alert('Maximum 4 images allowed per section')
                return
              }
              handleUploadSuccess(result, sectionName)
            }}
            options={{
              resourceType: 'auto',
              maxFileSize: 100000000,
            }}
          >
            {({ open }) => (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => open()}
                    disabled={section.images && section.images.length >= 4}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    + Add Image
                  </button>
                  {section.images && section.images.length > 0 && (
                    <span className="text-sm text-gray-600">({section.images.length}/4)</span>
                  )}
                </div>

                {section.images && section.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
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
      {/* Main Details */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-black">Case Study Details</h2>

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
          <label className="block text-sm font-medium mb-2 text-black">Client *</label>
          <input
            type="text"
            name="client"
            value={(formData as any).client || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="Client name"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              placeholder="e.g., 1:26"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Format</label>
            <input
              type="text"
              name="format"
              value={formData.format || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
              placeholder="e.g., Short Film"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Category</label>
            <select
              value={(formData as any).category || 'films_video'}
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
          <label className="block text-sm font-medium mb-2 text-black">Watch Film Link (URL)</label>
          <input
            type="url"
            name="watch_film_link"
            value={formData.watch_film_link || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="https://youtube.com/watch?v=..."
          />
          <p className="text-xs text-gray-500 mt-1">או העלה קובץ וידאו בשדה למטה</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Upload Video File (MP4, WebM, etc)</label>
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={(result: any) => {
              console.log('✅ Video uploaded successfully!')
              const videoUrl = result.info?.secure_url || result.info?.url
              console.log('🔗 Video URL:', videoUrl)

              if (videoUrl) {
                setFormData((prev) => {
                  const updated = { ...prev, video_file: videoUrl }
                  console.log('✅ formData updated with video_file:', videoUrl)
                  return updated
                })
              } else {
                console.error('❌ No URL found in response')
                alert('Error: Could not get video URL from upload')
              }
              setUploading(false)
            }}
            onError={(error: any) => {
              console.error('❌ Upload error:', error)
              alert('Failed to upload video: ' + error.message)
              setUploading(false)
            }}
            options={{
              resourceType: 'auto',
              maxFileSize: 500000000, // 500MB for videos
            }}
          >
            {({ open }) => (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setUploading(true)
                    open()
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload Video
                </button>
                {formData.video_file && (
                  <div className="space-y-2">
                    <div className="text-sm text-green-600">
                      ✅ Video uploaded: {formData.video_file.substring(0, 50)}...
                    </div>
                    <video
                      src={formData.video_file}
                      controls
                      className="w-32 h-32 object-cover rounded bg-gray-900"
                    />
                  </div>
                )}
              </div>
            )}
          </CldUploadWidget>
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

      {/* Case Study Sections */}
      {renderSectionForm('problem', 'THE BRIEF')}
      {renderSectionForm('insight', 'THE CHALLENGE')}
      {renderSectionForm('approach', 'CREATIVE CONCEPT')}
      {renderSectionForm('interaction', 'VISUAL LANGUAGE')}
      {renderSectionForm('flow', 'PROCESS')}
      {renderSectionForm('outcome', 'OUTCOME')}

      {/* Gallery Images */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-black">Image Gallery</h3>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleGalleryUpload(result)}
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

              {formData.gallery_images && formData.gallery_images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {formData.gallery_images.map((img: string, index: number) => (
                    <div key={index} className="relative group">
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(index)}
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

      {/* Process Blocks */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-black">Process Blocks</h3>
          <button
            type="button"
            onClick={addProcessBlock}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add Block
          </button>
        </div>

        {formData.process_blocks && formData.process_blocks.length > 0 && (
          <div className="space-y-6">
            {formData.process_blocks.map((block, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-black">Block {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeProcessBlock(index)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-black">Title</label>
                  <input
                    type="text"
                    value={block.title}
                    onChange={(e) => updateProcessBlock(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                    placeholder="Block title"
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1 text-black">Description</label>
                  <textarea
                    value={block.description}
                    onChange={(e) => updateProcessBlock(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-black resize-none"
                    rows={3}
                    placeholder="Block description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Image (Optional)</label>
                  <CldUploadWidget
                    uploadPreset="sharon_portfolio"
                    onSuccess={(result: any) => handleProcessBlockImageUpload(result, index)}
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
                          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          Upload Image
                        </button>
                        {block.image && (
                          <img src={block.image} alt={`Block ${index + 1}`} className="w-32 h-32 object-cover rounded" />
                        )}
                      </div>
                    )}
                  </CldUploadWidget>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Role */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-black">My Role</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-black">Role Title</label>
          <input
            type="text"
            name="my_role_title"
            value={formData.my_role_title || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            placeholder="e.g., Creative Director, Cinematographer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-black">Role Description</label>
          <textarea
            name="my_role_description"
            value={formData.my_role_description || ''}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black resize-none"
            rows={4}
            placeholder="Describe your role in the project"
          />
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
