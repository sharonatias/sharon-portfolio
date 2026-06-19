'use client'

import { useState, useRef } from 'react'
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
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<BrandCaseStudy>(caseStudy)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [sectionOrder, setSectionOrder] = useState<string[]>((caseStudy as any).sections_order || SECTION_NAMES)
  const [draggedSection, setDraggedSection] = useState<string | null>(null)

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

  const handleSave = async () => {
    setSaving(true)
    try {
      const dataToSave = {
        ...formData,
        sections_order: sectionOrder
      }
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

  const handleImageUpload = async (callback: (url: string) => void) => {
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
            callback(data.url)
            setMessage({ type: 'success', text: `✅ Image uploaded: ${data.filename}` })
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
  }

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

        {/* Basic Info - Always Visible */}
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
                  onClick={() => handleImageUpload((url) => setFormData({ ...formData, hero_image: url }))}
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
              <div>
                <label className="block text-sm text-gray-400 mb-2">Upload Hero Video (Optional)</label>
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
                              hero_video: data.url
                            })
                            setMessage({ type: 'success', text: `✅ Hero video uploaded: ${file.name}` })
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
                  {uploading ? '⏳ Uploading...' : '🎥 Upload Hero Video'}
                </button>
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
              <button
                onClick={() => {
                  // Find deleted sections that can be restored
                  const deletedSections = SECTION_NAMES.filter(
                    s => (formData[s as keyof BrandCaseStudy] as any)?.isDeleted === true
                  )

                  if (deletedSections.length > 0) {
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
                  } else {
                    alert('All sections are already added or there are no deleted sections to restore.')
                  }
                }}
                className="w-full px-4 py-3 bg-orange-600/20 text-orange-400 rounded-lg hover:bg-orange-600/40 transition-all"
              >
                ➕ Add Section
              </button>

              {sectionOrder.map((sectionKey, idx) => {
                const section = formData[sectionKey] || { title: '', description: '', images: [] }
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
                    className={`border rounded-lg p-4 cursor-move transition-all ${
                      draggedSection === sectionKey
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-orange-500/20 hover:border-orange-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-gray-500 text-sm">⋮⋮</span>
                      <h3 className="text-orange-400 font-light text-lg">{SECTION_LABELS[sectionKey]}</h3>
                      <span className="text-gray-600 text-xs ml-auto">#{idx + 1}</span>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${SECTION_LABELS[sectionKey]} section?`)) {
                            setFormData({
                              ...formData,
                              [sectionKey]: { ...section, isDeleted: true }
                            })
                            setSectionOrder(sectionOrder.filter(s => s !== sectionKey))
                          }
                        }}
                        className="ml-2 px-2 py-1 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        placeholder="Section Label (e.g., Applications)"
                        value={(section as any).label || SECTION_LABELS[sectionKey]}
                        onChange={(e) => setFormData({
                          ...formData,
                          [sectionKey]: { ...section, label: e.target.value }
                        })}
                        className="w-full bg-slate-950/50 border border-orange-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none text-sm"
                      />
                      <input
                        placeholder="Section Title"
                        value={section.title}
                        onChange={(e) => setFormData({
                          ...formData,
                          [sectionKey]: { ...section, title: e.target.value }
                        })}
                        className="w-full bg-slate-950/50 border border-orange-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
                      />
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

                      <div>
                        <label className="block text-xs text-gray-400 mb-2">Add Images (with size)</label>
                        <div className="flex gap-2 flex-wrap">
                          {(['thumbnail', 'medium', 'large', 'xlarge', 'xxlarge'] as const).map((size) => {
                            const icons = {
                              'thumbnail': '🔲',
                              'medium': '▪️',
                              'large': '⬜',
                              'xlarge': '🟫',
                              'xxlarge': '🟪'
                            }
                            return (
                              <button
                                key={size}
                                onClick={() => handleImageUpload((url) => addSectionImage(sectionKey, { url, size: size as any }))}
                                disabled={uploading}
                                className="px-3 py-1.5 text-xs bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all disabled:opacity-50"
                              >
                                {icons[size]} {size}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {section.images && section.images.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {section.images.map((img, idx) => (
                            <div key={idx} className="flex items-center gap-2 p-2 bg-slate-950/30 rounded text-xs">
                              <span className="text-gray-400">{img.size}</span>
                              <button
                                onClick={() => removeSectionImage(sectionKey, idx)}
                                className="ml-auto text-red-400 hover:text-red-300"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {sectionKey === 'motion' && (
                        <div className="space-y-3">
                          <label className="block text-xs text-gray-400 mb-2">Add Video</label>
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
                                        videos: [...(formData.videos || []), { url: data.url, title: file.name }]
                                      })
                                      setMessage({ type: 'success', text: `✅ Video uploaded: ${file.name}` })
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
                            className="w-full px-4 py-2 text-xs bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all disabled:opacity-50"
                          >
                            {uploading ? '⏳ Uploading...' : '🎥 Add Video'}
                          </button>

                          {formData.videos && formData.videos.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <label className="block text-xs text-gray-400">Uploaded Videos:</label>
                              {formData.videos.map((video, vidIdx) => (
                                <div key={vidIdx} className="p-3 bg-slate-950/30 rounded space-y-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-300">{video.title}</span>
                                    <button
                                      onClick={() => setFormData({
                                        ...formData,
                                        videos: (formData.videos || []).filter((_, i) => i !== vidIdx)
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
                            applications_images: [...(formData.applications_images || []), data.url]
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

              {formData.applications_images && formData.applications_images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {formData.applications_images.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt={`Application ${idx + 1}`} className="w-full h-32 object-cover rounded" />
                      <button
                        onClick={() => setFormData({
                          ...formData,
                          applications_images: (formData.applications_images || []).filter((_, i) => i !== idx)
                        })}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all"
                      >
                        Remove
                      </button>
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
