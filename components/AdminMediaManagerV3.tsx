'use client'

import { useState, useRef } from 'react'

interface FileItem {
  id: string
  name: string
  url: string
  type: 'image' | 'document' | 'video'
  uploadedAt: string
  size: number
}

export default function AdminMediaManagerV3() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document' | 'video'>('all')
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload error')
      }

      const type = getFileType(file.type)
      const newFile: FileItem = {
        id: Date.now().toString(),
        name: data.filename,
        url: data.url,
        type: type,
        uploadedAt: new Date().toLocaleString('en-US'),
        size: data.size
      }

      setFiles([newFile, ...files])
      setMessage({ type: 'success', text: `✅ File "${data.filename}" uploaded successfully!` })
      setTimeout(() => setMessage(null), 4000)

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `❌ ${error instanceof Error ? error.message : 'Upload error'}`
      })
      setTimeout(() => setMessage(null), 4000)
    } finally {
      setUploading(false)
    }
  }

  const getFileType = (mimeType: string): 'image' | 'document' | 'video' => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    return 'document'
  }

  const getFileIcon = (type: 'image' | 'document' | 'video'): string => {
    switch (type) {
      case 'image':
        return '🖼️'
      case 'document':
        return '📄'
      case 'video':
        return '🎬'
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const filteredFiles = filterType === 'all'
    ? files
    : files.filter(f => f.type === filterType)

  const deleteFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id))
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('URL copied!')
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h2 className="text-2xl font-light tracking-wider text-orange-400 mb-6">Media Library</h2>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-600/20 border border-green-500/30 text-green-400'
              : 'bg-red-600/20 border border-red-500/30 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-xl p-8 mb-8">
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg text-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '⏳ Uploading...' : '📤 Upload File'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              accept="image/*,video/*,.pdf,.doc,.docx"
              className="hidden"
              disabled={uploading}
            />
            <p className="text-sm text-gray-400">Images, videos, PDF, and documents</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex gap-2 mb-6">
          {(['all', 'image', 'document', 'video'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterType === type
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/50'
              }`}
            >
              {type === 'all' && '📁 All'}
              {type === 'image' && '🖼️ Images'}
              {type === 'document' && '📄 Documents'}
              {type === 'video' && '🎬 Videos'}
              ({type === 'all' ? files.length : files.filter(f => f.type === type).length})
            </button>
          ))}
        </div>

        {/* Files Grid */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No files to display
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-orange-500/20 rounded-lg p-4 hover:border-orange-500/50 transition-all"
              >
                {file.type === 'image' && (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
                {file.type === 'video' && (
                  <div className="w-full h-40 bg-slate-950 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
                {file.type === 'document' && (
                  <div className="w-full h-40 bg-slate-950 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-4xl">📄</span>
                  </div>
                )}

                <p className="text-sm text-white font-light mb-2 truncate">{file.name}</p>
                <p className="text-xs text-gray-500 mb-3">{formatFileSize(file.size)}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(file.url)}
                    className="flex-1 px-3 py-1.5 text-xs bg-orange-600/20 text-orange-400 rounded hover:bg-orange-600/40 transition-all"
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="flex-1 px-3 py-1.5 text-xs bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 transition-all"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-xs text-orange-400 hover:text-orange-300 text-center truncate"
                >
                  Open ↗
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
