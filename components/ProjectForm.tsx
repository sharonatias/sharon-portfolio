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
      category: 'films_video',
      image_url: '',
      video_url: '',
      images: [],
      textStyles: {
        description: {
          fontSize: 16,
          fontFamily: 'mono',
          alignment: 'center',
          bold: false,
          lineHeight: 1.6,
        },
      },
    }
  )
  const [uploading, setUploading] = useState(false)
  const [videoUploadType, setVideoUploadType] = useState<'file' | 'youtube'>('file')
  const [currentFrameTime, setCurrentFrameTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUploadSuccess = (result: any, type: 'image' | 'video' | 'gallery') => {
    const url = result.info.secure_url
    if (type === 'gallery') {
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), url],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [type === 'image' ? 'image_url' : 'video_url']: url,
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || [],
    }))
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

  const captureFrameAscover = () => {
    if (!formData.video_url || !formData.video_url.includes('cloudinary')) {
      alert('יש להעלות סרט קודם')
      return
    }

    const frameTime = Math.floor(currentFrameTime)

    // Extract the video URL and rebuild it with Cloudinary frame extraction syntax
    const videoUrl = formData.video_url.split('?')[0]

    // Parse Cloudinary URL: https://res.cloudinary.com/.../upload/v.../filename.mp4
    // We need to insert so_{frameTime} transformation before the filename
    const parts = videoUrl.split('/upload/')

    if (parts.length === 2) {
      const [baseUrl, path] = parts
      // Build new URL with so_{frameTime} transformation for frame extraction
      const coverUrl = `${baseUrl}/upload/so_${frameTime}/c_scale,w_1280/${path.replace('.mp4', '.jpg')}`

      setFormData((prev) => ({
        ...prev,
        image_url: coverUrl,
      }))

      alert(`Frame בשנייה ${frameTime} נשמר כתמונת כיסוי ✓`)
    } else {
      alert('סרט לא תקין')
    }
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
        <label className="block text-sm font-medium mb-2 text-black">Title</label>
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
        <label className="block text-sm font-medium mb-2 text-black">Description (Optional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-black mb-4 resize-none ${
            formData.textStyles?.description?.alignment === 'left'
              ? 'text-left'
              : formData.textStyles?.description?.alignment === 'right'
              ? 'text-right'
              : 'text-center'
          }`}
          style={{
            fontFamily:
              formData.textStyles?.description?.fontFamily === 'serif'
                ? 'Georgia, serif'
                : formData.textStyles?.description?.fontFamily === 'sans'
                ? 'Arial, sans-serif'
                : 'Courier New, monospace',
            fontSize: `${formData.textStyles?.description?.fontSize || 16}px`,
            lineHeight: `${formData.textStyles?.description?.lineHeight || 1.6}em`,
            fontWeight: formData.textStyles?.description?.bold ? 'bold' : 'normal',
          }}
          rows={4}
        />

        {/* Description Styling */}
        <div className="bg-gray-50 rounded p-4 space-y-3">
          <h4 className="text-xs font-semibold text-gray-700">Description Styling</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Font Size (px)</label>
              <input
                type="number"
                min="10"
                max="48"
                value={formData.textStyles?.description?.fontSize || 16}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      description: { ...prev.textStyles?.description, fontSize: parseInt(e.target.value) } as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Font Family</label>
              <select
                value={formData.textStyles?.description?.fontFamily || 'mono'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      description: { ...prev.textStyles?.description, fontFamily: e.target.value as any } as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
              >
                <option value="mono">Monospace</option>
                <option value="serif">Serif</option>
                <option value="sans">Sans-serif</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Alignment</label>
              <select
                value={formData.textStyles?.description?.alignment || 'center'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      description: { ...prev.textStyles?.description, alignment: e.target.value as any } as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Line Height (em)</label>
              <input
                type="number"
                min="1"
                max="3"
                step="0.1"
                value={formData.textStyles?.description?.lineHeight || 1.6}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      description: { ...prev.textStyles?.description, lineHeight: parseFloat(e.target.value) } as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.textStyles?.description?.bold || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        ...prev.textStyles,
                        description: { ...prev.textStyles?.description, bold: e.target.checked } as any,
                      },
                    }))
                  }
                  className="w-4 h-4"
                />
                <span className="text-xs font-medium">Bold</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-black">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
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
        <label className="block text-sm font-medium mb-2 text-black">Cover Image</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleUploadSuccess(result, 'image')}
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
        <label className="block text-sm font-medium mb-2 text-black">Video (Optional)</label>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setVideoUploadType('file')}
            className={`px-4 py-2 rounded ${videoUploadType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setVideoUploadType('youtube')}
            className={`px-4 py-2 rounded ${videoUploadType === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            YouTube Link
          </button>
        </div>

        {videoUploadType === 'file' ? (
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={(result: any) => handleUploadSuccess(result, 'video')}
            options={{
              resourceType: 'auto',
              maxFileSize: 100000000,
            }}
          >
            {({ open }) => (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => open()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload Video
                </button>
                {formData.video_url && formData.video_url.includes('cloudinary') && (
                  <>
                    <p className="text-sm text-gray-600">Video uploaded ✓</p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-black">גלול בסרט בחר פריים:</p>
                      <video
                        ref={videoRef}
                        src={formData.video_url}
                        controls
                        onTimeUpdate={(e) => setCurrentFrameTime((e.target as HTMLVideoElement).currentTime)}
                        onSeeked={(e) => setCurrentFrameTime((e.target as HTMLVideoElement).currentTime)}
                        className="w-full rounded border border-gray-300"
                        style={{ maxHeight: '300px' }}
                      />
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">זמן נוכחי: {Math.floor(currentFrameTime)}s</p>
                        <button
                          type="button"
                          onClick={captureFrameAscover}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                        >
                          🎬 Use as Cover Image
                        </button>
                      </div>

                      {formData.image_url && formData.image_url.includes('start_offset') && (
                        <div className="mt-4">
                          <p className="text-sm text-green-600 mb-2">✓ Cover Image Selected</p>
                          <img
                            key={formData.image_url}
                            src={formData.image_url}
                            alt="Cover Preview"
                            className="w-full h-40 object-cover rounded border border-gray-300"
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </CldUploadWidget>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={formData.video_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, video_url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            />
            {formData.video_url && formData.video_url.includes('youtube') && (
              <p className="text-sm text-green-600">YouTube link added ✓</p>
            )}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-black">Gallery Images (Optional)</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleUploadSuccess(result, 'gallery')}
          options={{
            resourceType: 'auto',
            maxFileSize: 100000000,
          }}
        >
          {({ open }) => (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => open()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Add Gallery Image
              </button>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
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
