'use client'

import { useState, useRef } from 'react'
import { Project, CATEGORIES } from '@/lib/types'

interface AdminProjectEditorProps {
  project: Project
  onSave: (data: Project) => Promise<void>
  onClose: () => void
}

type Tab = 'basic' | 'media' | 'gallery' | 'styling'

export default function AdminProjectEditorV3({ project, onSave, onClose }: AdminProjectEditorProps) {
  const [activeTab, setActiveTab] = useState<Tab>('basic')
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Project>(project)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const galleryFileInputRef = useRef<HTMLInputElement>(null)
  const attachmentInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'basic', label: 'Basic', icon: '📋' },
    { id: 'media', label: 'Media', icon: '🎬' },
    { id: 'gallery', label: 'Gallery', icon: '🖼️' },
    { id: 'styling', label: 'Styling', icon: '🎨' },
  ]

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(formData)
      setMessage({ type: 'success', text: '✅ Saved successfully!' })
      setTimeout(() => {
        setMessage(null)
      }, 2000)
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error instanceof Error ? error.message : 'Error saving'}` })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setFormData({ ...formData, image_url: dataUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        const images = [...(formData.images || []), dataUrl]
        setFormData({ ...formData, images })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeGalleryImage = (index: number) => {
    const images = formData.images?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, images })
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setFormData({ ...formData, video_url: dataUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAttachmentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

      const files = [...(formData.files || []), data.url]
      setFormData({ ...formData, files })
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }

  const removeAttachment = (index: number) => {
    const files = formData.files?.filter((_, i) => i !== index) || []
    setFormData({ ...formData, files })
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-green-500/30 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b border-green-500/20 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-light text-green-400">{formData.title || 'New Project'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300 text-2xl">✕</button>
        </div>

        {/* Tabs */}
        <div className="border-b border-green-500/20 px-6 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm whitespace-nowrap transition-all duration-300 ${
                activeTab === tab.id
                  ? 'text-green-400 border-b-2 border-green-500'
                  : 'text-gray-500 hover:text-gray-400'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className={`mx-6 mt-4 px-4 py-3 rounded-lg font-semibold text-center ${
            message.type === 'success'
              ? 'bg-green-600/20 text-green-300 border border-green-600/50'
              : 'bg-red-600/20 text-red-300 border border-red-600/50'
          }`}>
            {message.text}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-4 max-w-3xl">
              <input
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950/50 border border-green-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full bg-slate-950/50 border border-green-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
              />

              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full bg-slate-950/50 border border-green-500/30 px-4 py-3 rounded-lg text-white focus:border-green-500 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order || 0}
                  onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                  className="w-full bg-slate-950/50 border border-green-500/30 px-4 py-3 rounded-lg text-white focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Main Image</label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mb-3 px-4 py-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 transition-all duration-300"
                >
                  📤 Select Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {formData.image_url && (
                  <div className="relative">
                    <img src={formData.image_url} alt="preview" className="w-full max-h-48 object-cover rounded-lg mb-2" />
                    <button
                      onClick={() => setFormData({ ...formData, image_url: '' })}
                      className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <input
                placeholder="Image URL (alternative)"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-slate-950/50 border border-green-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
              />

              <div>
                <label className="block text-sm text-gray-400 mb-2">Video</label>
                <button
                  onClick={() => videoInputRef.current?.click()}
                  className="w-full mb-3 px-4 py-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 transition-all duration-300"
                >
                  🎥 Upload Video File
                </button>
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <input
                  placeholder="Or paste video URL"
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="w-full bg-slate-950/50 border border-green-500/30 px-4 py-3 rounded-lg text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
                />
                {formData.video_url && (
                  <div className="mt-3">
                    <button
                      onClick={() => setFormData({ ...formData, video_url: '' })}
                      className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded text-sm hover:bg-red-600/40 transition-all"
                    >
                      🗑️ Remove Video
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Attachments (PDF, DOC, etc.)</label>
                <button
                  onClick={() => attachmentInputRef.current?.click()}
                  className="w-full mb-3 px-4 py-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 transition-all duration-300"
                >
                  📎 Add File
                </button>
                <input
                  ref={attachmentInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.zip"
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />

                {formData.files && formData.files.length > 0 && (
                  <div className="space-y-2">
                    {formData.files.map((file, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-950/50 border border-green-500/20 rounded-lg p-3">
                        <span className="text-sm text-gray-300 truncate">📄 {file.split('/').pop()}</span>
                        <button
                          onClick={() => removeAttachment(idx)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4 max-w-3xl">
              <div>
                <button
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="w-full mb-4 px-4 py-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/40 transition-all duration-300"
                >
                  📤 Add Gallery Images
                </button>
                <input
                  ref={galleryFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGalleryImageUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {formData.images?.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`gallery ${idx}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="block text-sm text-gray-400">Or add URLs directly:</label>
                {(formData.images || []).map((_, idx) => (
                  <input
                    key={idx}
                    placeholder={`Image ${idx + 1} URL`}
                    value={formData.images?.[idx] || ''}
                    onChange={(e) => {
                      const images = [...(formData.images || [])]
                      images[idx] = e.target.value
                      setFormData({ ...formData, images })
                    }}
                    className="w-full bg-slate-950/50 border border-green-500/30 px-4 py-2 rounded-lg text-white placeholder-gray-600 focus:border-green-500 focus:outline-none"
                  />
                ))}
                <button
                  onClick={() => setFormData({ ...formData, images: [...(formData.images || []), ''] })}
                  className="px-4 py-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40 transition-all"
                >
                  + Add Another URL
                </button>
              </div>
            </div>
          )}

          {activeTab === 'styling' && (
            <div className="text-gray-400 text-center py-12">
              Styling coming soon...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-green-500/20 p-6 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-700 text-gray-400 hover:text-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all disabled:opacity-50"
          >
            {saving ? '💾 Saving...' : '💾 Save'}
          </button>
        </div>
      </div>
    </div>
  )
}
