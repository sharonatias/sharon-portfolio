'use client'

import { useState, useRef, useEffect } from 'react'
import { About, TextStyle } from '@/lib/types'

export default function AdminAboutEditorV3() {
  const [about, setAbout] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState<About>({
    text: '',
    image1_url: '',
    image2_url: '',
    textStyles: {
      main: {
        fontSize: 16,
        fontFamily: 'mono',
        alignment: 'center',
        bold: false,
        lineHeight: 1.6,
      },
    },
  })
  const contentEditableRef = useRef<HTMLParagraphElement>(null)

  // Fetch about data on mount
  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about')
      const data = await res.json()
      if (data) {
        setAbout(data)
        setFormData(data)
        if (contentEditableRef.current) {
          contentEditableRef.current.textContent = data.text || 'Click to edit...'
        }
      }
    } catch (error) {
      console.error('Failed to fetch about:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (imageNum: 1 | 2, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setFormData((prev) => ({
        ...prev,
        [imageNum === 1 ? 'image1_url' : 'image2_url']: url,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const savedData = await res.json()
        setAbout(savedData)
        setMessage({ type: 'success', text: '✅ About Page Saved Successfully!' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        const error = await res.json()
        setMessage({ type: 'error', text: `❌ ${error.error || 'Save failed'}` })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ type: 'error', text: `❌ ${error instanceof Error ? error.message : 'Save Error'}` })
      setTimeout(() => setMessage(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400">
        <p>Loading about page...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {/* Live Preview */}
      <div className="mb-8 bg-slate-900/50 border border-blue-500/20 rounded-lg p-8">
        <h3 className="text-sm font-medium text-blue-400 mb-4">📱 Live Preview</h3>
        <div className="flex justify-center">
          <div className="p-8 max-w-2xl bg-gray-950 rounded-lg">
            <p
              ref={contentEditableRef}
              className="text-gray-300 whitespace-pre-wrap outline-none focus:outline-blue-500 focus:outline-2 focus:outline-offset-2 focus:bg-gray-900 focus:rounded focus:p-2 cursor-text"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const text = e.currentTarget.textContent || ''
                setFormData((prev) => ({ ...prev, text }))
              }}
              style={{
                fontFamily:
                  formData.textStyles?.main?.fontFamily === 'serif'
                    ? 'Georgia, serif'
                    : formData.textStyles?.main?.fontFamily === 'sans'
                    ? 'Arial, sans-serif'
                    : 'Courier New, monospace',
                fontSize: `${formData.textStyles?.main?.fontSize || 16}px`,
                lineHeight: `${formData.textStyles?.main?.lineHeight || 1.6}em`,
                fontWeight: formData.textStyles?.main?.bold ? 'bold' : 'normal',
                textAlign: (formData.textStyles?.main?.alignment || 'center') as any,
                minHeight: '100px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6 bg-slate-900/30 border border-blue-500/20 rounded-lg p-6">
        {/* Text Content */}
        <div>
          <label className="block text-sm font-medium text-blue-400 mb-3">About Text</label>
          <textarea
            value={formData.text}
            onChange={(e) => {
              setFormData((prev) => ({ ...prev, text: e.target.value }))
              if (contentEditableRef.current) {
                contentEditableRef.current.textContent = e.target.value
              }
            }}
            className="w-full px-4 py-2 bg-slate-950/50 border border-blue-500/30 rounded-lg text-white text-sm placeholder-gray-600 focus:border-blue-500 focus:outline-none resize-none"
            rows={6}
            placeholder="Write your about text here..."
          />
        </div>

        {/* Text Styling */}
        <div className="bg-slate-950/50 border border-blue-500/20 rounded-lg p-4 space-y-3">
          <h4 className="text-sm font-medium text-blue-400">Text Styling</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font Size (px)</label>
              <input
                type="number"
                min="10"
                max="48"
                value={formData.textStyles?.main?.fontSize || 16}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      main: {
                        ...prev.textStyles?.main,
                        fontSize: parseInt(e.target.value),
                        fontFamily: (prev.textStyles?.main?.fontFamily || 'mono') as 'mono' | 'serif' | 'sans',
                        alignment: (prev.textStyles?.main?.alignment || 'center') as string,
                        bold: prev.textStyles?.main?.bold || false,
                        lineHeight: prev.textStyles?.main?.lineHeight || 1.6
                      } as TextStyle,
                    },
                  }))
                }
                className="w-full px-3 py-2 bg-slate-950/50 border border-blue-500/30 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Font Family</label>
              <select
                value={formData.textStyles?.main?.fontFamily || 'mono'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      main: {
                        ...prev.textStyles?.main,
                        fontFamily: e.target.value as 'mono' | 'serif' | 'sans',
                        fontSize: prev.textStyles?.main?.fontSize || 16,
                        alignment: (prev.textStyles?.main?.alignment || 'center') as string,
                        bold: prev.textStyles?.main?.bold || false,
                        lineHeight: prev.textStyles?.main?.lineHeight || 1.6
                      } as TextStyle,
                    },
                  }))
                }
                className="w-full px-3 py-2 bg-slate-950/50 border border-blue-500/30 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="mono">Monospace</option>
                <option value="serif">Serif</option>
                <option value="sans">Sans-serif</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alignment</label>
              <select
                value={formData.textStyles?.main?.alignment || 'center'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      main: {
                        ...prev.textStyles?.main,
                        alignment: e.target.value,
                        fontSize: prev.textStyles?.main?.fontSize || 16,
                        fontFamily: (prev.textStyles?.main?.fontFamily || 'mono') as 'mono' | 'serif' | 'sans',
                        bold: prev.textStyles?.main?.bold || false,
                        lineHeight: prev.textStyles?.main?.lineHeight || 1.6
                      } as TextStyle,
                    },
                  }))
                }
                className="w-full px-3 py-2 bg-slate-950/50 border border-blue-500/30 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Line Height (em)</label>
              <input
                type="number"
                min="1"
                max="3"
                step="0.1"
                value={formData.textStyles?.main?.lineHeight || 1.6}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      main: {
                        ...prev.textStyles?.main,
                        lineHeight: parseFloat(e.target.value),
                        fontSize: prev.textStyles?.main?.fontSize || 16,
                        fontFamily: (prev.textStyles?.main?.fontFamily || 'mono') as 'mono' | 'serif' | 'sans',
                        alignment: (prev.textStyles?.main?.alignment || 'center') as string,
                        bold: prev.textStyles?.main?.bold || false
                      } as TextStyle,
                    },
                  }))
                }
                className="w-full px-3 py-2 bg-slate-950/50 border border-blue-500/30 rounded text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.textStyles?.main?.bold || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        main: {
                          ...prev.textStyles?.main,
                          bold: e.target.checked,
                          fontSize: prev.textStyles?.main?.fontSize || 16,
                          fontFamily: (prev.textStyles?.main?.fontFamily || 'mono') as 'mono' | 'serif' | 'sans',
                          alignment: (prev.textStyles?.main?.alignment || 'center') as string,
                          lineHeight: prev.textStyles?.main?.lineHeight || 1.6
                        } as TextStyle,
                      },
                    }))
                  }
                  className="w-4 h-4 rounded border-blue-500/30 accent-blue-500"
                />
                <span className="text-xs text-gray-400">Bold</span>
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((num) => (
            <div key={num}>
              <label className="block text-sm font-medium text-blue-400 mb-3">Image {num}</label>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(num as 1 | 2, file)
                  }}
                  className="w-full px-4 py-2 bg-slate-950/50 border border-blue-500/30 rounded-lg text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700 focus:outline-none"
                />
                {formData[num === 1 ? 'image1_url' : 'image2_url'] && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400 mb-2">✓ Image {num} uploaded</p>
                    <img
                      src={formData[num === 1 ? 'image1_url' : 'image2_url']}
                      alt={`Image ${num}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? '💾 Saving...' : '💾 Save About Page'}
          </button>
        </div>
      </div>
    </div>
  )
}
