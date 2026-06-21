'use client'

import { useState, useRef, useCallback } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { BrandCaseStudy, BrandCaseStudyImage } from '@/lib/types'

interface AdminBrandCaseStudyEditorProps {
  caseStudy: BrandCaseStudy
  onSave: (data: BrandCaseStudy) => Promise<void>
  onClose: () => void
}

type Tab = 'basic' | 'hero' | 'description' | 'sections' | 'colors' | 'videos' | 'applications' | 'cto'

const SECTION_NAMES: (keyof Omit<BrandCaseStudy, 'id' | 'title' | 'subtitle' | 'year' | 'client' | 'role' | 'hero_image' | 'hero_description' | 'central_description' | 'color_palette' | 'videos' | 'category' | 'display_order' | 'created_at' | 'updated_at'>)[] = [
  'idea', 'system', 'shape', 'motion', 'applications', 'color', 'type'
]

const SECTION_LABELS: { [key: string]: string } = {
  idea: 'Idea',
  system: 'System',
  shape: 'Shape',
  motion: 'Motion',
  applications: 'Applications',
  color: 'Color',
  type: 'Type'
}

export default function AdminBrandCaseStudyEditorV3({ caseStudy, onSave, onClose }: AdminBrandCaseStudyEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<BrandCaseStudy>(() => {
    // Convert custom_sections array from DB into individual form fields
    const data = { ...caseStudy } as any
    if (Array.isArray(data.custom_sections) && data.custom_sections.length > 0) {
      data.custom_sections.forEach((section: any) => {
        if (section.id) {
          data[section.id] = section
        }
      })
      delete data.custom_sections
    }
    return data as BrandCaseStudy
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    let order = (caseStudy as any).sections_order || SECTION_NAMES
    // Ensure all standard sections are present
    const missingStandard = SECTION_NAMES.filter(s => !order.includes(s as string))
    if (missingStandard.length > 0) {
      order = [...order, ...missingStandard]
    }
    // Add custom sections to order if they exist and not already in order
    if (Array.isArray((caseStudy as any).custom_sections)) {
      const customIds = (caseStudy as any).custom_sections.map((s: any) => s.id).filter((id: string) => !order.includes(id))
      return [...order, ...customIds]
    }
    return order
  })
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [newSectionName, setNewSectionName] = useState('')

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'basic', label: 'Basic', icon: '📋' },
    { id: 'hero', label: 'Hero', icon: '🎬' },
    { id: 'description', label: 'Description', icon: '📝' },
    { id: 'sections', label: 'Sections', icon: '🎨' },
    { id: 'colors', label: 'Colors', icon: '🎭' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
    { id: 'applications', label: 'Applications', icon: '📱' },
    { id: 'cto', label: 'CTO', icon: '👤' }
  ]

  const uploadBase64ToCloudinary = async (base64Url: string) => {
    if (!base64Url.startsWith('data:')) return base64Url
    try {
      console.log('🔄 Uploading base64 to Cloudinary, size:', base64Url.length)
      const res = await fetch('/api/cloudinary-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: base64Url })
      })
      console.log('📦 Cloudinary response:', res.status, res.ok)
      if (!res.ok) {
        const error = await res.text()
        console.error('❌ Cloudinary error:', error)
        return base64Url
      }
      const data = await res.json()
      console.log('✅ Base64 uploaded to Cloudinary:', data.url)
      return data.url || base64Url
    } catch (e) {
      console.error('🔴 Error uploading base64:', e)
      return base64Url
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let cleanedData = { ...formData } as any

      // Upload all base64 images to Cloudinary
      console.log('🔄 Uploading base64 images to Cloudinary...')

      if (cleanedData.hero_image?.startsWith('data:')) {
        cleanedData.hero_image = await uploadBase64ToCloudinary(cleanedData.hero_image)
      }

      // Process all sections
      const standardSections = SECTION_NAMES
      for (const key of Object.keys(cleanedData)) {
        const section = cleanedData[key]
        if (section?.images && Array.isArray(section.images)) {
          section.images = await Promise.all(
            section.images.map(async (img: string) => {
              if (typeof img === 'string' && img.startsWith('data:')) {
                return await uploadBase64ToCloudinary(img)
              }
              return img
            })
          )
        }
      }

      console.log('✅ Base64 images uploaded to Cloudinary')

      const customSections: any[] = []

      // Extract custom sections (premium_*, custom_*)
      Object.keys(cleanedData).forEach((key) => {
        if ((key.startsWith('premium_') || key.startsWith('custom_')) && !standardSections.includes(key as any)) {
          const section = cleanedData[key]
          // Ensure images are stored as array of strings
          if (section.images && Array.isArray(section.images)) {
            section.images = section.images.map((img: any) => typeof img === 'string' ? img : img.url || img)
          }
          customSections.push({
            id: key,
            ...section
          })
          delete cleanedData[key] // Remove from main data
        }
      })

      // Remove custom_sections from cleanedData (it's a database property, not a form field)
      delete cleanedData.custom_sections

      const dataToSave = {
        ...cleanedData,
        sections_order: sectionOrder, // Save full order including custom/premium sections
        custom_sections: customSections // Add custom sections as array
      }
      console.log('📤 Saving Brand Case Study:', { hero_image: dataToSave.hero_image, title: dataToSave.title })
      await onSave(dataToSave)
      setMessage({ type: 'success', text: '✅ Saved Successfully!' })
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error instanceof Error ? error.message : 'Save Error'}` })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = useCallback(async (callback: (url: string) => void) => {
    if (!fileInputRef.current) return

    const handleChange = async (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]

      if (!file) {
        console.warn('⚠️ No file selected')
        return
      }

      // Check file size - max 2MB
      const MAX_SIZE = 2 * 1024 * 1024 // 2MB
      if (file.size > MAX_SIZE) {
        setMessage({ type: 'error', text: `❌ Image too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max 2MB.` })
        setTimeout(() => setMessage(null), 5000)
        return
      }

      setUploading(true)
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      try {
        console.log('🔄 Uploading file:', file.name, file.size)

        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/cloudinary-upload', { method: 'POST', body: formData })

        if (!res.ok) {
          const text = await res.text()
          console.error('❌ Upload error:', text)
          throw new Error(`Upload failed: ${res.status}`)
        }

        const data = await res.json()
        console.log('✅ Upload successful:', data.url)
        callback(data.url)
        setMessage({ type: 'success', text: `✅ Image uploaded: ${file.name}` })
        setTimeout(() => setMessage(null), 3000)
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Network error'
        console.error('🔴 Upload failed:', errorMsg)
        setMessage({ type: 'error', text: `❌ Upload failed: ${errorMsg}` })
        setTimeout(() => setMessage(null), 5000)
      } finally {
        setUploading(false)
      }
    }

    const input = fileInputRef.current
    input.value = '' // Reset input value
    input.addEventListener('change', handleChange, { once: true })
    input.click()
  }, [])

  const addColorToPalette = (color: string) => {
    setFormData({
      ...formData,
      color_palette: [...(formData.color_palette || []), color]
    })
  }

  const removeColorFromPalette = (index: number) => {
    setFormData({
      ...formData,
      color_palette: (formData.color_palette || []).filter((_, i) => i !== index)
    })
  }

  const updateColorPalette = (index: number, color: string) => {
    const newPalette = [...(formData.color_palette || [])]
    newPalette[index] = color
    setFormData({ ...formData, color_palette: newPalette })
  }

  const addSectionImage = (sectionKey: string, image: BrandCaseStudyImage) => {
    const section = formData[sectionKey as keyof BrandCaseStudy] as any
    if (section) {
      setFormData({
        ...formData,
        [sectionKey]: {
          ...section,
          images: [...(section.images || []), image]
        }
      })
    }
  }

  const removeSectionImage = (sectionKey: string, index: number) => {
    const section = formData[sectionKey as keyof BrandCaseStudy] as any
    if (section) {
      setFormData({
        ...formData,
        [sectionKey]: {
          ...section,
          images: (section.images || []).filter((_: any, i: number) => i !== index)
        }
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-orange-500/30 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-orange-500/20 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-light text-orange-400">{formData.title || 'New Brand Case Study'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 text-2xl">✕</button>
        </div>

        {/* Basic Info - Only when Basic tab is active */}
        {activeTab === 'basic' && (
        <div className="border-b border-orange-500/20 p-6 bg-slate-950/30">
          <div className="grid grid-cols-2 gap-4 max-w-3xl">
            <input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="col-span-2 bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
            />
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="col-span-2 bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white focus:border-orange-500 focus:outline-none"
            >
              <option value="">Choose Category</option>
              <option value="featured">FEATURED</option>
              <option value="brand_design">BRAND DESIGN</option>
              <option value="ai_experiments">AI EXPERIMENTS</option>
              <option value="currently_exploring">CURRENTLY EXPLORING</option>
            </select>
            <input placeholder="Subtitle" value={formData.subtitle || ''} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none" />
            <input placeholder="Year" value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none" />
            <input placeholder="Client" value={formData.client || ''} onChange={(e) => setFormData({ ...formData, client: e.target.value })} className="col-span-2 bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none" />
            <input placeholder="Role" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="col-span-2 bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none" />
          </div>
        </div>
        )}

        {/* Tabs */}
        <div className="border-b border-orange-500/20 px-6 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-orange-400 border-b-2 border-orange-500'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className={`px-6 pt-4 pb-0 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {message.text}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
        />

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {activeTab === 'hero' && (
            <div className="space-y-4 max-w-3xl">
              <textarea
                placeholder="Hero Description"
                value={formData.hero_description}
                onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                rows={3}
                className="w-full bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
              />
              <div>
                <label className="block text-sm text-gray-400 mb-2">Upload Hero Image</label>
                <button
                  onClick={() => handleImageUpload((url) => {
                    console.log('✅ Callback received URL:', url)
                    setFormData({ ...formData, hero_image: url })
                    console.log('✅ FormData updated with hero_image')
                  })}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-orange-600/20 text-orange-400 rounded-lg hover:bg-orange-600/40 transition-all disabled:opacity-50"
                >
                  {uploading ? '⏳ Uploading...' : '📤 Upload Hero Image'}
                </button>
                {formData.hero_image && (
                  <div className="mt-3">
                    <img src={formData.hero_image} alt="Hero" className="w-full max-h-48 object-cover rounded-lg mb-2" />
                    <button
                      onClick={() => setFormData({ ...formData, hero_image: '' })}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Hero Video */}
              <div className="space-y-3">
                <label className="block text-sm text-gray-400 mb-2">Hero Video (Optional)</label>
                <div className="flex gap-2">
                  <CldUploadWidget
                    uploadPreset="sharon_portfolio"
                    onSuccess={(result: any) => {
                      const url = result.info.secure_url
                      setFormData({ ...formData, hero_video: url })
                      setMessage({ type: 'success', text: `✅ Video uploaded` })
                      setTimeout(() => setMessage(null), 3000)
                    }}
                    onError={() => {
                      setMessage({ type: 'error', text: `❌ Video upload failed` })
                      setTimeout(() => setMessage(null), 5000)
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="px-4 py-2 bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all"
                      >
                        🎥 Upload Video
                      </button>
                    )}
                  </CldUploadWidget>
                  <span className="text-xs text-gray-500 py-2">or paste URL →</span>
                </div>
                <input
                  type="url"
                  placeholder="Or paste video URL"
                  value={(formData as any).hero_video || ''}
                  onChange={(e) => setFormData({ ...formData, hero_video: e.target.value })}
                  className="w-full bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none text-sm"
                />
                {(formData as any).hero_video && (
                  <div className="mt-3 p-2 bg-slate-950/30 rounded text-xs text-gray-400">
                    ✓ {((formData as any).hero_video as string).split('/').pop()}
                    <button
                      onClick={() => setFormData({ ...formData, hero_video: '' } as any)}
                      className="ml-2 text-red-400 hover:text-red-300"
                    >
                      ✕ Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <label className="block text-sm text-gray-400 mb-2">Central Project Description</label>
              <textarea
                placeholder="Main description of the project..."
                value={formData.central_description || ''}
                onChange={(e) => setFormData({ ...formData, central_description: e.target.value })}
                rows={8}
                className="w-full bg-slate-950/50 border border-orange-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
              />
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-6 max-w-3xl">
              <div className="space-y-3 p-4 bg-slate-950/30 rounded-lg border border-orange-500/20">
                <div className="space-y-3">
                  <label className="block text-sm text-gray-400">➕ הוסף סקשן חדש</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="שם הסקשן החדש (למשל: Gallery, Process וכו')"
                      value={newSectionName}
                      onChange={(e) => setNewSectionName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newSectionName.trim()) {
                          const customKey = `custom_${Date.now()}`
                          setFormData({
                            ...formData,
                            [customKey]: { title: '', description: '', images: [], label: newSectionName }
                          } as any)
                          setSectionOrder([...sectionOrder, customKey])
                          setNewSectionName('')
                        }
                      }}
                      className="flex-1 bg-slate-950/50 border border-orange-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (newSectionName.trim()) {
                          const customKey = `custom_${Date.now()}`
                          setFormData({
                            ...formData,
                            [customKey]: { title: '', description: '', images: [], label: newSectionName }
                          } as any)
                          setSectionOrder([...sectionOrder, customKey])
                          setNewSectionName('')
                        }
                      }}
                      className="px-6 py-2 bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all font-medium"
                    >
                      הוסף
                    </button>
                  </div>
                </div>

                <div className="border-t border-orange-500/20 pt-3">
                  <button
                    onClick={() => {
                      const premiumKey = `premium_${Date.now()}`
                      setFormData({
                        ...formData,
                        [premiumKey]: {
                          title: '',
                          description: '',
                          images: [],
                          label: 'Premium Section',
                          number: '',
                          subtitle: '',
                          backgroundColor: '#ffffff',
                          backgroundImage: undefined,
                          imageLayout: 'single'
                        }
                      } as any)
                      setSectionOrder([...sectionOrder, premiumKey])
                    }}
                    className="w-full px-4 py-2 bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/40 transition-all font-medium"
                  >
                    ✨ הוסף Premium Section (עם Template)
                  </button>
                  <p className="text-xs text-gray-500 mt-2">סקשן עם layout מיוחד: מספור, כותרות, טקסט + תמונה גדולה או grid</p>
                </div>
              </div>

              {(() => {
                const deletedSections = SECTION_NAMES.filter(
                  s => (formData[s as keyof BrandCaseStudy] as any)?.isDeleted === true
                )
                const hasDeletedSections = deletedSections.length > 0

                return (
                  <button
                    onClick={() => {
                      if (hasDeletedSections) {
                        const sectionToRestore = deletedSections[0]
                        const section = formData[sectionToRestore as keyof BrandCaseStudy] as any
                        setFormData({
                          ...formData,
                          [sectionToRestore]: {
                            ...section,
                            isDeleted: false
                          }
                        })
                        if (!sectionOrder.includes(sectionToRestore)) {
                          setSectionOrder([...sectionOrder, sectionToRestore])
                        }
                      }
                    }}
                    disabled={!hasDeletedSections}
                    className={`w-full px-4 py-3 rounded-lg transition-all ${
                      hasDeletedSections
                        ? 'bg-orange-600/20 text-orange-400 hover:bg-orange-600/40 cursor-pointer'
                        : 'bg-slate-950/30 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    {hasDeletedSections ? `↩️ Restore Deleted (${deletedSections.length})` : '✓ All Sections Added'}
                  </button>
                )
              })()}

              {sectionOrder.map((sectionKey, idx) => {
                const section = formData[sectionKey] || { title: '', description: '', images: [] }
                const isExpanded = expandedSections.has(sectionKey)
                const toggleExpanded = () => {
                  const newExpanded = new Set(expandedSections)
                  if (newExpanded.has(sectionKey)) {
                    newExpanded.delete(sectionKey)
                  } else {
                    newExpanded.add(sectionKey)
                  }
                  setExpandedSections(newExpanded)
                }
                return (
                  <div
                    key={sectionKey}
                    draggable
                    onDragStart={() => setDraggedSection(sectionKey)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedSection && draggedSection !== sectionKey) {
                        const draggedIdx = sectionOrder.indexOf(draggedSection)
                        const targetIdx = idx
                        const newOrder = [...sectionOrder]
                        newOrder.splice(draggedIdx, 1)
                        newOrder.splice(targetIdx, 0, draggedSection)
                        setSectionOrder(newOrder)
                        setDraggedSection(null)
                      }
                    }}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      draggedSection === sectionKey
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-orange-500/20 hover:border-orange-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 p-4 bg-slate-950/30 hover:bg-slate-950/50 transition-all">
                      <button
                        onClick={toggleExpanded}
                        className="flex items-center gap-2 flex-1 cursor-pointer border-none bg-transparent text-left"
                      >
                        <span className="text-gray-500 text-sm">⋮⋮</span>
                        <h3 className="text-orange-400 font-light text-lg">{SECTION_LABELS[sectionKey] || (section as any).label || sectionKey}</h3>
                        <span className="text-gray-600 text-xs ml-auto">#{idx + 1}</span>
                        <span className="text-orange-400">{isExpanded ? '▼' : '▶'}</span>
                      </button>
                      <button
                        onClick={() => {
                          const sectionLabel = SECTION_LABELS[sectionKey] || (section as any).label || sectionKey
                          if (confirm(`Delete ${sectionLabel} section?`)) {
                            setFormData({
                              ...formData,
                              [sectionKey]: { ...section, isDeleted: true }
                            })
                            setSectionOrder(sectionOrder.filter(s => s !== sectionKey))
                          }
                        }}
                        className="px-3 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                    {isExpanded && (
                    <div className="border-t border-orange-500/20 p-4">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          placeholder="Section Label (e.g., Applications)"
                          value={(section as any).label ?? ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            [sectionKey]: { ...section, label: e.target.value }
                          })}
                          className="flex-1 bg-slate-950/50 border border-orange-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none text-sm"
                        />
                        {(section as any).label && (
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              [sectionKey]: { ...section, label: '' }
                            })}
                            className="px-3 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all text-sm"
                            title="Delete label"
                          >
                            🗑️ מחק
                          </button>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input
                          placeholder="Section Title"
                          value={section.title}
                          onChange={(e) => setFormData({
                            ...formData,
                            [sectionKey]: { ...section, title: e.target.value }
                          })}
                          className="flex-1 bg-slate-950/50 border border-orange-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
                        />
                        {section.title && (
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              [sectionKey]: { ...section, title: '' }
                            })}
                            className="px-3 py-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all text-sm"
                            title="Delete title"
                          >
                            🗑️ מחק
                          </button>
                        )}
                      </div>
                      <textarea
                        placeholder="Section Description"
                        value={section.description}
                        onChange={(e) => setFormData({
                          ...formData,
                          [sectionKey]: { ...section, description: e.target.value }
                        })}
                        rows={3}
                        className="w-full bg-slate-950/50 border border-orange-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
                      />

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-orange-500/20">
                        <input
                          placeholder="מיספור (01, 02, וכו')"
                          value={(section as any).number || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            [sectionKey]: { ...section, number: e.target.value }
                          })}
                          className="bg-slate-950/50 border border-orange-500/30 px-3 py-2 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none text-sm"
                        />
                        <input
                          placeholder="כותרת קטנה (THE IDEA וכו')"
                          value={(section as any).subtitle || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            [sectionKey]: { ...section, subtitle: e.target.value }
                          })}
                          className="bg-slate-950/50 border border-orange-500/30 px-3 py-2 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none text-sm"
                        />
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={(section as any).backgroundColor || '#ffffff'}
                              onChange={(e) => setFormData({
                                ...formData,
                                [sectionKey]: { ...section, backgroundColor: e.target.value }
                              })}
                              className="w-12 h-10 rounded cursor-pointer border border-orange-500/30"
                              title="בחר צבע רקע"
                            />
                            <span className="text-xs text-gray-400">צבע רקע</span>
                          </div>
                          <button
                            onClick={() => handleImageUpload((url) => {
                              const sectionData = formData[sectionKey as keyof BrandCaseStudy] as any
                              if (sectionData) {
                                setFormData({
                                  ...formData,
                                  [sectionKey]: {
                                    ...sectionData,
                                    backgroundImage: url
                                  }
                                })
                              }
                            })}
                            disabled={uploading}
                            className="w-full px-4 py-2 text-sm bg-purple-600/20 text-purple-400 rounded hover:bg-purple-600/40 transition-all disabled:opacity-50"
                          >
                            {uploading ? '...מעלה' : '🖼️ העלה תמונה רקע'}
                          </button>
                          {(section as any).backgroundImage && (
                            <div className="flex items-center gap-2 p-2 bg-slate-950/30 rounded text-xs">
                              <img src={(section as any).backgroundImage} alt="background" className="w-8 h-8 object-cover rounded" />
                              <span className="text-gray-400 flex-1 truncate">תמונת רקע</span>
                              <button
                                onClick={() => setFormData({
                                  ...formData,
                                  [sectionKey]: { ...section, video: undefined }
                                })}
                                className="text-red-400 hover:text-red-300 text-xs"
                              >
                                ✕
                              </button>
                              </div>
                              <video
                                className="w-full h-32 bg-gray-900 rounded object-cover"
                                controls
                              >
                                <source src={(section as any).video} type="video/mp4" />
                              </video>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    </div>
                    )}
                  </div>
                          )}
                        </div>
                        <select
                          value={(section as any).imageLayout || 'single'}
                          onChange={(e) => setFormData({
                            ...formData,
                            [sectionKey]: { ...section, imageLayout: e.target.value as 'single' | 'grid' }
                          })}
                          className="bg-slate-950/50 border border-orange-500/30 px-3 py-2 rounded text-white text-sm focus:border-orange-500 focus:outline-none"
                        >
                          <option value="single">תמונה גדולה</option>
                          <option value="grid">Grid 4 תמונות</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-400 mb-2">
                          📤 העלה תמונות
                          {(section as any).imageLayout === 'grid' ? ' (עד 4 תמונות לגריד)' : ''}
                        </label>
                        <CldUploadWidget
                          uploadPreset="sharon_portfolio"
                          onSuccess={(result: any) => {
                            const url = result.info.secure_url
                            const sectionData = formData[sectionKey as keyof BrandCaseStudy] as any
                            if (sectionData) {
                              setFormData({
                                ...formData,
                                [sectionKey]: {
                                  ...sectionData,
                                  images: [...(sectionData.images || []), url]
                                }
                              })
                              setMessage({ type: 'success', text: `✅ Image uploaded` })
                              setTimeout(() => setMessage(null), 3000)
                            }
                          }}
                          onError={() => {
                            setMessage({ type: 'error', text: `❌ Upload failed` })
                            setTimeout(() => setMessage(null), 5000)
                          }}
                        >
                          {({ open }) => (
                            <button
                              type="button"
                              onClick={() => open()}
                              className="px-4 py-2 text-sm bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all"
                            >
                              📤 בחר תמונה
                            </button>
                          )}
                        </CldUploadWidget>
                      </div>

                      {section.images && section.images.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {section.images.map((img: any, idx: number) => {
                            const isString = typeof img === 'string'
                            const imgUrl = isString ? img : img.url
                            const imgLabel = isString ? 'תמונה' : img.size || 'תמונה'
                            return (
                              <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950/30 rounded text-xs">
                                <img src={imgUrl} alt="thumbnail" className="w-8 h-8 object-cover rounded" />
                                <span className="text-gray-400 flex-1 truncate">{imgLabel}</span>
                                <button
                                  onClick={() => removeSectionImage(sectionKey, idx)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  ✕
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {sectionKey === 'motion' && (
                        <div className="space-y-3">
                          <label className="block text-xs text-gray-400 mb-2">🎥 Upload Video</label>
                          <CldUploadWidget
                            uploadPreset="sharon_portfolio"
                            onSuccess={(result: any) => {
                              const url = result.info.secure_url
                              setFormData({
                                ...formData,
                                [sectionKey]: { ...section, video: url }
                              })
                              setMessage({ type: 'success', text: `✅ Video uploaded` })
                              setTimeout(() => setMessage(null), 3000)
                            }}
                            onError={() => {
                              setMessage({ type: 'error', text: `❌ Video upload failed` })
                              setTimeout(() => setMessage(null), 5000)
                            }}
                          >
                            {({ open }) => (
                              <button
                                type="button"
                                onClick={() => open()}
                                className="w-full px-4 py-2 text-xs bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all"
                              >
                                🎥 Upload Video
                              </button>
                            )}
                          </CldUploadWidget>

                          {(section as any).video && (
                            <div className="mt-3 p-2 bg-slate-950/30 rounded text-xs">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-300">✓ Video Uploaded</span>
                                <button
                                  onClick={() => setFormData({
                                    ...formData,
                                    [sectionKey]: { ...section, video: undefined }
                                  })}
                                  className="text-red-400 hover:text-red-300 text-xs"
                                >
                                      ✕ Remove
                                    </button>
                                  </div>
                                  <video
                                    className="w-full h-32 bg-gray-900 rounded object-cover"
                                    controls
                                  >
                                    <source src={video.url} type="video/mp4" />
                                  </video>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'colors' && (
            <div className="space-y-4 max-w-3xl">
              <label className="block text-sm text-gray-400 mb-4">Color Palette</label>
              <div className="flex gap-2 mb-4">
                <input
                  type="color"
                  id="colorPicker"
                  defaultValue="#000000"
                  className="w-12 h-12 rounded cursor-pointer"
                />
                <button
                  onClick={() => {
                    const color = (document.getElementById('colorPicker') as HTMLInputElement)?.value
                    addColorToPalette(color)
                  }}
                  className="px-4 py-2 bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all"
                >
                  + Add Color
                </button>
              </div>

              {formData.color_palette && formData.color_palette.length > 0 && (
                <div className="space-y-2">
                  {formData.color_palette.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-950/30 rounded">
                      <div
                        className="w-8 h-8 rounded border border-gray-600 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          const picker = document.getElementById(`colorPicker${idx}`) as HTMLInputElement
                          picker?.click()
                        }}
                      />
                      <input
                        id={`colorPicker${idx}`}
                        type="color"
                        value={color}
                        onChange={(e) => updateColorPalette(idx, e.target.value)}
                        className="w-0 h-0 opacity-0"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => updateColorPalette(idx, e.target.value)}
                        className="flex-1 bg-slate-950/50 border border-orange-500/30 px-3 py-1 rounded text-white text-sm placeholder-gray-600 focus:border-orange-500 focus:outline-none font-mono"
                      />
                      <button
                        onClick={() => removeColorFromPalette(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-4 max-w-3xl">
              <label className="block text-sm text-gray-400 mb-4">Additional Videos</label>
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'video/*'
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      setUploading(true)
                      const formDataUpload = new FormData()
                      formDataUpload.append('file', file)
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload })
                        const data = await res.json()
                        if (res.ok) {
                          setFormData({
                            ...formData,
                            videos: [...(formData.videos || []), { url: data.url }]
                          })
                          setMessage({ type: 'success', text: `✅ Video uploaded` })
                          setTimeout(() => setMessage(null), 3000)
                        }
                      } catch (error) {
                        setMessage({ type: 'error', text: '❌ Upload failed' })
                        setTimeout(() => setMessage(null), 3000)
                      } finally {
                        setUploading(false)
                      }
                    }
                  }
                  input.click()
                }}
                disabled={uploading}
                className="w-full px-4 py-3 bg-orange-600/20 text-orange-400 rounded-lg hover:bg-orange-600/40 transition-all disabled:opacity-50"
              >
                {uploading ? '⏳ Uploading...' : '🎥 Add Video'}
              </button>

              {formData.videos && formData.videos.length > 0 && (
                <div className="space-y-2 mt-4">
                  {formData.videos.map((video, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-950/30 rounded">
                      <span className="text-sm text-gray-300">{video.url.split('/').pop()}</span>
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          videos: (formData.videos || []).filter((_, i) => i !== idx)
                        })}
                        className="text-red-400 hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-4 max-w-3xl">
              <label className="block text-sm text-gray-400 mb-4">Brand Applications / Mockups</label>
              <button
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) {
                      setUploading(true)
                      const formDataUpload = new FormData()
                      formDataUpload.append('file', file)
                      try {
                        const res = await fetch('/api/upload', { method: 'POST', body: formDataUpload })
                        const data = await res.json()
                        if (res.ok) {
                          setFormData({
                            ...formData,
                            brand_applications: [...(formData.brand_applications || []), { id: Date.now().toString(), name: 'Application', images: [data.url], position: 'after', section: 'applications' }]
                          })
                          setMessage({ type: 'success', text: `✅ Image uploaded` })
                          setTimeout(() => setMessage(null), 3000)
                        }
                      } catch (error) {
                        setMessage({ type: 'error', text: '❌ Upload failed' })
                        setTimeout(() => setMessage(null), 3000)
                      } finally {
                        setUploading(false)
                      }
                    }
                  }
                  input.click()
                }}
                disabled={uploading}
                className="w-full px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-all disabled:opacity-50"
              >
                {uploading ? '⏳ Uploading...' : '📱 Add Application Image'}
              </button>

              {formData.brand_applications && formData.brand_applications.length > 0 && (
                <div className="space-y-3 mt-4">
                  {(formData.brand_applications as unknown as any[]).map((app, idx) => (
                    <div key={app.id} className="p-3 bg-slate-950/30 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{app.name}</span>
                        <button
                          onClick={() => setFormData({
                            ...formData,
                            brand_applications: (formData.brand_applications || []).filter((_, i) => i !== idx)
                          })}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ✕ Delete
                        </button>
                      </div>
                      {app.images && app.images.map((img, imgIdx) => (
                        <img key={imgIdx} src={img} alt={`${app.name} ${imgIdx + 1}`} className="w-full h-24 object-cover rounded mb-2" />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'cto' && (
            <div className="space-y-4 max-w-3xl">
              <label className="block text-sm text-gray-400 mb-4">CTO/Leader Information</label>

              {/* CTO Name */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.cto?.name || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    cto: { ...formData.cto || { name: '', title: '', image: '', description: '' }, name: e.target.value }
                  })}
                  placeholder="e.g., Hila"
                  className="w-full px-3 py-2 bg-slate-950/30 border border-slate-700 rounded text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* CTO Title */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Title/Role</label>
                <input
                  type="text"
                  value={formData.cto?.title || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    cto: { ...formData.cto || { name: '', title: '', image: '', description: '' }, title: e.target.value }
                  })}
                  placeholder="e.g., CEO of Shine"
                  className="w-full px-3 py-2 bg-slate-950/30 border border-slate-700 rounded text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* CTO Image */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Profile Image</label>
                <button
                  onClick={() => handleImageUpload((url) => setFormData({
                    ...formData,
                    cto: { ...formData.cto || { name: '', title: '', image: '', description: '' }, image: url }
                  }))}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-orange-600/20 text-orange-400 rounded-lg hover:bg-orange-600/40 transition-all disabled:opacity-50"
                >
                  {uploading ? '⏳ Uploading...' : '📸 Upload Image'}
                </button>
                {formData.cto?.image && (
                  <div className="mt-2 p-2 bg-slate-950/30 rounded text-xs text-gray-400">
                    ✓ {formData.cto.image.split('/').pop()}
                  </div>
                )}
              </div>

              {/* CTO Description */}
              <div>
                <label className="block text-xs text-gray-500 mb-2">Description</label>
                <textarea
                  value={formData.cto?.description || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    cto: { ...formData.cto || { name: '', title: '', image: '', description: '' }, description: e.target.value }
                  })}
                  placeholder="Enter the CTO/leader's description..."
                  rows={6}
                  className="w-full px-3 py-2 bg-slate-950/30 border border-slate-700 rounded text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-orange-500/20 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
          >
            {saving ? '⏳ Saving...' : '💾 Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
