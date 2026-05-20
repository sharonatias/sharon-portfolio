'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { HeroVideo } from '@/lib/types'

interface HeroVideoFormProps {
  video?: HeroVideo | null
  onSave: (video: HeroVideo) => void
}

export default function HeroVideoForm({ video, onSave }: HeroVideoFormProps) {
  const [formData, setFormData] = useState<HeroVideo>(
    video || {
      title_en: '',
      title_he: '',
      description: '',
      video_url: '',
    }
  )
  const [uploading, setUploading] = useState(false)
  const [uploadType, setUploadType] = useState<'file' | 'youtube'>('file')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

  const handleUploadSuccess = (result: any) => {
    const url = result.info.secure_url
    setFormData((prev) => ({ ...prev, video_url: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const url = video?.id ? `/api/hero/${video.id}` : '/api/hero'
      const method = video?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const saved = await res.json()
        onSave(saved)
        setFormData({ title_en: '', title_he: '', description: '', video_url: '' })
      } else {
        const error = await res.json()
        console.error('Failed to save:', error)
        alert('Failed to save hero video')
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving hero video')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-8 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Title (English) - Optional</label>
        <input
          type="text"
          name="title_en"
          value={formData.title_en}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
          placeholder="Enter English title..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Title (Hebrew - עברית) - Optional</label>
        <input
          type="text"
          name="title_he"
          value={formData.title_he}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
          placeholder="הכנס כותרת בעברית..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Description - Optional</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
          placeholder="e.g., Documentary film & Creative Direction"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Hero Video</label>
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setUploadType('file')}
            className={`px-4 py-2 rounded ${uploadType === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setUploadType('youtube')}
            className={`px-4 py-2 rounded ${uploadType === 'youtube' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            YouTube Link
          </button>
        </div>

        {uploadType === 'file' ? (
          <CldUploadWidget
            uploadPreset="sharon_portfolio"
            onSuccess={handleUploadSuccess}
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
                {formData.video_url && formData.video_url.includes('cloudinary') && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-green-600 mb-2">✓ Video uploaded</p>
                    <video controls className="w-full max-w-md rounded border border-gray-300 bg-black">
                      <source src={formData.video_url} type="video/mp4" />
                    </video>
                  </div>
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500"
            />
            {formData.video_url && formData.video_url.includes('youtube') && (
              <div className="mt-3">
                <p className="text-sm font-medium text-green-600 mb-2">✓ YouTube link added</p>
                <div className="aspect-video w-full max-w-md bg-black rounded border border-gray-300">
                  <iframe
                    src={getYouTubeEmbedUrl(formData.video_url)}
                    className="w-full h-full rounded"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={uploading || !formData.video_url || (uploadType === 'youtube' && !formData.video_url.includes('youtube'))}
        className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
      >
        {uploading ? 'Saving...' : video?.id ? 'Update Hero Video' : 'Create Hero Video'}
      </button>
    </form>
  )
}
