'use client'

import { useState, useRef } from 'react'
import { AppCase, CaseStudySection, DynamicSection } from '@/lib/types'

interface AdminCaseStudyEditorProps {
  caseStudy: AppCase
  onSave: (data: AppCase) => Promise<void>
  onClose: () => void
}

type Tab = 'basic' | 'hero' | 'sections' | 'gallery' | 'role' | 'files' | 'custom'

export default function AdminCaseStudyEditorV3({ caseStudy, onSave, onClose }: AdminCaseStudyEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<AppCase>(caseStudy)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingSection, setUploadingSection] = useState<string | null>(null)
  const [sectionOrder, setSectionOrder] = useState<string[]>((caseStudy as any).section_order || ['problem', 'insight', 'approach', 'flow', 'interaction', 'outcome'])
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const filesInputRef = useRef<HTMLInputElement>(null)
  const sectionFileInputRef = useRef<HTMLInputElement>(null)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'basic', label: 'Basic', icon: '📋' },
    { id: 'hero', label: 'Hero Section', icon: '🎬' },
    { id: 'sections', label: 'Sections', icon: '📄' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'role', label: 'My Role', icon: '👤' },
    { id: 'files', label: 'Files', icon: '📎' },
    { id: 'custom', label: 'Custom', icon: '✨' },
  ]

  const handleSave = async () => {
    setSaving(true)
    try {
      const dataToSave = {
        ...formData,
        section_order: sectionOrder
      }
      await onSave(dataToSave as AppCase)
      const details = []
      if (formData.video_file) details.push(`Video: ${formData.video_file.split('/').pop()}`)
      if (formData.hero_image) details.push(`Hero Image`)
      const detailsText = details.length > 0 ? ` (${details.join(', ')})` : ''
      setMessage({ type: 'success', text: `✅ Saved Successfully!${detailsText}` })
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error instanceof Error ? error.message : 'Save Error'}` })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const addSectionImage = (sectionKey: string, imageUrl: string) => {
    const section = formData[sectionKey as keyof AppCase] as CaseStudySection | undefined
    if (section) {
      const images = [...(section.images || []), imageUrl]
      setFormData({
        ...formData,
        [sectionKey]: { ...section, images }
      })
    }
  }

  const removeSectionImage = (sectionKey: string, index: number) => {
    const section = formData[sectionKey as keyof AppCase] as CaseStudySection | undefined
    if (section) {
      const images = section.images?.filter((_, i) => i !== index) || []
      setFormData({
        ...formData,
        [sectionKey]: { ...section, images }
      })
    }
  }

  const handleSectionFileUpload = async (sectionKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingSection(sectionKey)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      addSectionImage(sectionKey, data.url)
      setMessage({ type: 'success', text: `✅ קובץ "${data.filename}" הועלה בהצלחה!` })
      setTimeout(() => setMessage(null), 3000)

      // Reset input
      if (filesInputRef.current[sectionKey]) {
        filesInputRef.current[sectionKey]!.value = ''
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ ${error instanceof Error ? error.message : 'שגיאה בהעלאה'}`
      })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setUploadingSection(null)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      // Add the uploaded file URL to gallery_images (reusing for files)
      const files = [...(formData.gallery_images || []), data.url]
      setFormData({ ...formData, gallery_images: files })

      setMessage({ type: 'success', text: `✅ קובץ "${data.filename}" הועלה בהצלחה!` })
      setTimeout(() => setMessage(null), 3000)

      // Reset input
      if (sectionFileInputRef.current) {
        sectionFileInputRef.current.value = ''
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ ${error instanceof Error ? error.message : 'שגיאה בהעלאה'}`
      })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-blue-500/20 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-light text-blue-400">{formData.title || 'New Case Study'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 text-2xl">✕</button>
        </div>

        {/* Tabs */}
        <div className="border-b border-blue-500/20 px-6 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-blue-400 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className={`px-6 pt-4 pb-0 ${
            message.type === 'success'
              ? 'text-green-400'
              : 'text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="grid grid-cols-2 gap-4 max-w-3xl">
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-2 bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="col-span-2 bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="">Choose Category</option>
                <option value="featured">FEATURED</option>
                <option value="documentary">DOCUMENTARY</option>
                <option value="commercial">COMMERCIAL</option>
                <option value="television">TELEVISION</option>
                <option value="music">MUSIC</option>
                <option value="brand_design">BRAND DESIGN</option>
                <option value="ai_experiments">AI EXPERIMENTS</option>
                <option value="currently_exploring">CURRENTLY EXPLORING</option>
              </select>
              <input placeholder="Subtitle" value={formData.subtitle || ''} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none" />
              <input placeholder="Year" value={formData.year || ''} onChange={(e) => setFormData({ ...formData, year: e.target.value })} className="bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none" />
              <input placeholder="Client" value={formData.client || ''} onChange={(e) => setFormData({ ...formData, client: e.target.value })} className="bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none" />
              <input placeholder="Role" value={formData.role || ''} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none" />
              <input placeholder="Duration" value={formData.duration || ''} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none" />
              <input placeholder="Format" value={formData.format || ''} onChange={(e) => setFormData({ ...formData, format: e.target.value })} className="bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none" />
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-4 max-w-3xl">
              <textarea
                placeholder="Hero Section Description"
                value={formData.hero_description}
                onChange={(e) => setFormData({ ...formData, hero_description: e.target.value })}
                rows={4}
                className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              />

              <div>
                <label className="block text-sm text-gray-400 mb-2">Upload Video File</label>
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
                            setFormData({ ...formData, video_file: data.url })
                            setMessage({ type: 'success', text: `✅ Video uploaded: ${data.filename}` })
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
                  {uploading ? '⏳ Uploading...' : '📤 Upload Video'}
                </button>
                {formData.video_file && (
                  <div className="mt-3 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
                    <p className="text-sm text-gray-300">✅ Video: {formData.video_file.split('/').pop()}</p>
                    <button
                      onClick={() => setFormData({ ...formData, video_file: '' })}
                      className="mt-2 text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {formData.video_file && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Upload Video Preview Image (Poster)</label>
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
                              setFormData({ ...formData, hero_image: data.url })
                              setMessage({ type: 'success', text: `✅ Preview image uploaded: ${data.filename}` })
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
                    {uploading ? '⏳ Uploading...' : '🖼️ Upload Preview Image'}
                  </button>
                  {formData.hero_image && (
                    <div className="mt-3">
                      <img src={formData.hero_image} alt="Preview" className="w-full max-h-48 object-cover rounded-lg mb-2" />
                      <button
                        onClick={() => setFormData({ ...formData, hero_image: '' })}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove Preview
                      </button>
                    </div>
                  )}
                </div>
              )}

              <input placeholder="Video Link (YouTube)" value={formData.watch_film_link || ''} onChange={(e) => setFormData({ ...formData, watch_film_link: e.target.value })} className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none" />

              <div>
                <label className="block text-sm text-gray-400 mb-2">Upload Hero Image</label>
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
                            setFormData({ ...formData, hero_image: data.url })
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
                  }}
                  disabled={uploading}
                  className="w-full px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-all disabled:opacity-50"
                >
                  {uploading ? '⏳ Uploading...' : '📤 Upload Image'}
                </button>
                {formData.hero_image && (
                  <div className="mt-3">
                    <img src={formData.hero_image} alt="Hero" className="w-full max-h-48 object-cover rounded-lg mb-2" />
                    <button
                      onClick={() => setFormData({ ...formData, hero_image: '' })}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sections' && (
            <div className="space-y-6 max-w-3xl">
              {sectionOrder.map((section, idx) => (
                <div
                  key={section}
                  draggable
                  onDragStart={() => setDraggedSection(section)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (draggedSection && draggedSection !== section) {
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
                    draggedSection === section
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-blue-500/20 hover:border-blue-500/40'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">⋮⋮</span>
                      <h3 className="text-blue-400 font-light capitalize">{section}</h3>
                      <span className="text-gray-600 text-xs ml-auto">#{idx + 1}</span>
                    </div>
                    <button
                      onClick={() => {
                        const sectionData = formData[section as keyof AppCase] as any
                        if (sectionData && typeof sectionData === 'object' && 'isDeleted' in sectionData) {
                          setFormData({
                            ...formData,
                            [section]: { ...sectionData, isDeleted: !sectionData.isDeleted }
                          })
                        }
                      }}
                      className={`text-xs px-2 py-1 rounded ${
                        (formData[section as keyof AppCase] as any)?.isDeleted
                          ? 'bg-yellow-600/20 text-yellow-400'
                          : 'bg-blue-600/20 text-blue-400'
                      }`}
                    >
                      {(formData[section as keyof AppCase] as any)?.isDeleted ? '↩️ Restore' : '🗑️ Delete'}
                    </button>
                  </div>
                  {!(formData[section as keyof AppCase] as any)?.isDeleted && (
                    <>
                      <input
                        placeholder="Section Label (e.g., The Brief)"
                        value={(formData[section as keyof AppCase] as any)?.label || section.charAt(0).toUpperCase() + section.slice(1)}
                        onChange={(e) => setFormData({
                          ...formData,
                          [section]: { ...(formData[section as keyof AppCase] as any), label: e.target.value }
                        })}
                        className="w-full mb-2 bg-slate-950/50 border border-blue-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      />
                      <input
                        placeholder="Title"
                        value={(formData[section as keyof AppCase] as any)?.title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          [section]: { ...(formData[section as keyof AppCase] as any), title: e.target.value }
                        })}
                        className="w-full mb-2 bg-slate-950/50 border border-blue-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <textarea
                        placeholder="Description"
                        value={(formData[section as keyof AppCase] as any)?.description || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          [section]: { ...(formData[section as keyof AppCase] as any), description: e.target.value }
                        })}
                        rows={3}
                        className="w-full mb-2 bg-slate-950/50 border border-blue-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <div className="text-xs text-gray-400 mb-2">Files/Images:</div>
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*,video/*,.pdf,.doc,.docx'
                            input.onchange = (e) => {
                              const event = e as any
                              handleSectionFileUpload(section, event)
                            }
                            input.click()
                          }}
                          disabled={uploadingSection === section}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploadingSection === section ? '⏳ Uploading...' : '📤 Upload'}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {((formData[section as keyof AppCase] as any)?.images || []).map((img, idx) => (
                          <div key={idx} className="relative">
                            <img src={img} alt={`${section} ${idx}`} className="w-full h-20 object-cover rounded-lg" />
                            <button
                              onClick={() => removeSectionImage(section, idx)}
                              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Or add URL"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            addSectionImage(section, e.currentTarget.value)
                            e.currentTarget.value = ''
                          }
                        }}
                        className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-2 rounded text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none text-sm"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4 max-w-3xl">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? '⏳ Uploading Image...' : '📤 Upload Image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />

              {formData.gallery_images && formData.gallery_images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {formData.gallery_images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img src={img} alt={`gallery ${idx}`} className="w-full h-32 object-cover rounded-lg" />
                      <button
                        onClick={() => {
                          const images = formData.gallery_images?.filter((_, i) => i !== idx) || []
                          setFormData({ ...formData, gallery_images: images })
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Or add URLs:</label>
                <input
                  type="text"
                  placeholder="Add image URL and press Enter"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      const images = [...(formData.gallery_images || []), e.currentTarget.value]
                      setFormData({ ...formData, gallery_images: images })
                      e.currentTarget.value = ''
                    }
                  }}
                  className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'role' && (
            <div className="space-y-4 max-w-3xl">
              <input
                placeholder="Role Title"
                value={formData.my_role_title || ''}
                onChange={(e) => setFormData({ ...formData, my_role_title: e.target.value })}
                className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <textarea
                placeholder="Role Description"
                value={formData.my_role_description || ''}
                onChange={(e) => setFormData({ ...formData, my_role_description: e.target.value })}
                rows={6}
                className="w-full bg-slate-950/50 border border-blue-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-4 max-w-3xl">
              <button
                onClick={() => filesInputRef.current?.click()}
                disabled={uploading}
                className="w-full px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? '⏳ Uploading File...' : '📎 Upload File'}
              </button>
              <input
                ref={filesInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt,.zip,.jpg,.jpeg,.png,.mp4,.mov"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />

              <div className="text-sm text-gray-400">
                <p className="mb-3">Attached Files:</p>
                {formData.gallery_images && formData.gallery_images.length > 0 ? (
                  <div className="space-y-2">
                    {formData.gallery_images.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-950/30 p-3 rounded-lg border border-blue-500/20 hover:border-blue-500/50 transition-all">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-lg">📄</span>
                          <span className="truncate text-gray-300">{url.split('/').pop()}</span>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-xs"
                          >
                            Open ↗
                          </a>
                          <button
                            onClick={() => {
                              const images = formData.gallery_images?.filter((_, i) => i !== idx) || []
                              setFormData({ ...formData, gallery_images: images })
                            }}
                            className="text-red-400 hover:text-red-300"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No files yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6 max-w-3xl">
              <h3 className="text-blue-400 font-light mb-4">Custom Sections</h3>
              {formData.custom_sections && formData.custom_sections.length > 0 ? (
                <div className="space-y-4">
                  {formData.custom_sections.map((section, idx) => (
                    <div key={section.id} className="border border-blue-500/20 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-3">
                        <input
                          placeholder="Section Name"
                          value={section.label}
                          onChange={(e) => {
                            const custom = formData.custom_sections || []
                            custom[idx].label = e.target.value
                            setFormData({ ...formData, custom_sections: custom })
                          }}
                          className="flex-1 bg-slate-950/50 border border-blue-500/30 px-3 py-2 rounded text-white text-sm placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            const custom = formData.custom_sections?.filter((_, i) => i !== idx) || []
                            setFormData({ ...formData, custom_sections: custom })
                          }}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>
                      </div>
                      <input
                        placeholder="Title"
                        value={section.title}
                        onChange={(e) => {
                          const custom = formData.custom_sections || []
                          custom[idx].title = e.target.value
                          setFormData({ ...formData, custom_sections: custom })
                        }}
                        className="w-full mb-2 bg-slate-950/50 border border-blue-500/30 px-3 py-2 rounded text-white text-sm placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <textarea
                        placeholder="Description"
                        value={section.description}
                        onChange={(e) => {
                          const custom = formData.custom_sections || []
                          custom[idx].description = e.target.value
                          setFormData({ ...formData, custom_sections: custom })
                        }}
                        rows={3}
                        className="w-full mb-2 bg-slate-950/50 border border-blue-500/30 px-3 py-2 rounded text-white text-sm placeholder-gray-600 focus:border-blue-500 focus:outline-none"
                      />
                      <div className="text-xs text-gray-400 mb-2">Files/Images:</div>
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => {
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*,video/*,.pdf,.doc,.docx'
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onload = (event) => {
                                  const dataUrl = event.target?.result as string
                                  const custom = formData.custom_sections || []
                                  custom[idx].images = [...(custom[idx].images || []), dataUrl]
                                  setFormData({ ...formData, custom_sections: custom })
                                }
                                reader.readAsDataURL(file)
                              }
                            }
                            input.click()
                          }}
                          className="flex-1 px-3 py-2 text-sm bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 transition-all"
                        >
                          📤 Upload
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(section.images || []).map((img, imgIdx) => (
                          <div key={imgIdx} className="relative">
                            <img src={img} alt={`custom ${idx} ${imgIdx}`} className="w-full h-20 object-cover rounded" />
                            <button
                              onClick={() => {
                                const custom = formData.custom_sections || []
                                custom[idx].images = custom[idx].images?.filter((_, i) => i !== imgIdx) || []
                                setFormData({ ...formData, custom_sections: custom })
                              }}
                              className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <button
                onClick={() => {
                  const custom = formData.custom_sections || []
                  if (custom.length < 5) {
                    custom.push({
                      id: Date.now().toString(),
                      label: 'New Section',
                      title: '',
                      description: '',
                      images: [],
                      order: custom.length
                    })
                    setFormData({ ...formData, custom_sections: custom })
                  }
                }}
                disabled={(formData.custom_sections?.length || 0) >= 5}
                className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ➕ Add New Section ({(formData.custom_sections?.length || 0)}/5)
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-blue-500/20 p-6 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50"
          >
            {saving ? '💾 Saving...' : '💾 Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
