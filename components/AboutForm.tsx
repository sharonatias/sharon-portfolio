'use client'

import { useState, useRef, useEffect } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { About } from '@/lib/types'

interface AboutFormProps {
  about?: About | null
  onSave: (about: About) => void
}

export default function AboutForm({ about, onSave }: AboutFormProps) {
  const contentEditableRef = useRef<HTMLParagraphElement>(null)
  const [formData, setFormData] = useState<About>(
    about || {
      text: '',
      image1_url: '',
      image2_url: '',
      textStyles: {
        main: {
          fontSize: 16,
          fontFamily: 'mono',
          alignment: 'left',
          bold: false,
          lineHeight: 1.6,
        },
      },
    }
  )
  const [uploading, setUploading] = useState(false)

  // Initialize contentEditable element with text on mount and when about prop changes
  useEffect(() => {
    if (contentEditableRef.current) {
      // Only update if not currently focused
      if (document.activeElement !== contentEditableRef.current) {
        contentEditableRef.current.textContent = formData.text || 'לחץ כאן וכתוב...'
        console.log('📝 Initialized contentEditable with:', formData.text)
      }
    }
  }, [])

  // Update formData when about prop changes (from parent component)
  useEffect(() => {
    if (about) {
      console.log('📥 About prop changed, updating formData:', about)
      setFormData(about)
      // Also update contentEditable
      if (contentEditableRef.current) {
        contentEditableRef.current.textContent = about.text || 'לחץ כאן וכתוב...'
      }
    }
  }, [about])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Also update the contentEditable element when textarea changes
    if (name === 'text' && contentEditableRef.current) {
      contentEditableRef.current.textContent = value
    }
  }

  const handleUploadSuccess = (result: any, imageNum: 1 | 2) => {
    const url = result.info.secure_url
    setFormData((prev) => ({
      ...prev,
      [imageNum === 1 ? 'image1_url' : 'image2_url']: url,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('📋 Form submission triggered')
    console.log('Form data text:', formData.text)
    console.log('Form data text length:', formData.text?.length)
    console.log('Image 1:', formData.image1_url ? '✓' : '✗')
    console.log('Image 2:', formData.image2_url ? '✓' : '✗')

    if (!formData.text || !formData.image1_url || !formData.image2_url) {
      const missing = []
      if (!formData.text) missing.push('text')
      if (!formData.image1_url) missing.push('image1')
      if (!formData.image2_url) missing.push('image2')
      alert(`Please fill in all fields (missing: ${missing.join(', ')})`)
      console.warn('Missing fields:', missing)
      return
    }

    setUploading(true)
    console.log('📤 Submitting form data:', JSON.stringify(formData, null, 2))

    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      console.log('📥 API response status:', res.status)
      const responseData = await res.json()
      console.log('📥 API response data:', responseData)

      if (res.ok) {
        console.log('✅ API returned saved data:', responseData)
        onSave(responseData)
        alert('About page saved successfully!')
      } else {
        console.error('Failed to save about:', responseData)
        alert(`Failed to save about page: ${responseData.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving about:', error)
      alert('Error saving about page')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Live Preview */}
      <div className="bg-black text-white rounded-lg p-8 min-h-96">
        <h3 className="text-sm font-medium text-gray-400 mb-6">📱 Live Preview - לחץ על הטקסט כדי לערוך</h3>
        <div className="flex justify-center">
          <div className="p-8 max-w-2xl bg-gray-950 rounded-lg">
            <p
              ref={contentEditableRef}
              className="text-gray-300 whitespace-pre-wrap outline-none focus:outline-blue-500 focus:outline-2 focus:outline-offset-2 focus:bg-gray-900 focus:rounded focus:p-2 cursor-text"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                const text = e.currentTarget.textContent || ''
                console.log('Text updated from live preview:', text)
                setFormData((prev) => ({ ...prev, text }))
              }}
              onKeyDown={(e) => {
                // Allow normal text editing
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault()
                  // Submit form with Ctrl+Enter if needed
                }
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
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-8 space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2 text-black">About Text (ou edita na live preview acima)</label>
        <textarea
          name="text"
          value={formData.text}
          onChange={(e) => {
            handleInputChange(e)
            console.log('Text updated from textarea:', e.target.value)
          }}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-black resize-none mb-4 ${
            formData.textStyles?.main?.alignment === 'left'
              ? 'text-left'
              : formData.textStyles?.main?.alignment === 'right'
              ? 'text-right'
              : 'text-center'
          }`}
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
          }}
          rows={6}
          placeholder="Write your about text here..."
          required
        />

        {/* Text Styling */}
        <div className="bg-gray-50 rounded p-4 space-y-3">
          <h4 className="text-xs font-semibold text-gray-700">Text Styling</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Font Size (px)</label>
              <input
                type="number"
                min="10"
                max="48"
                value={formData.textStyles?.main?.fontSize || 16}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      main: { ...prev.textStyles?.main, fontSize: parseInt(e.target.value) } as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Font Family</label>
              <select
                value={formData.textStyles?.main?.fontFamily || 'mono'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      main: { ...prev.textStyles?.main, fontFamily: e.target.value as any } as any,
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
                value={formData.textStyles?.main?.alignment || 'center'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      main: { ...prev.textStyles?.main, alignment: e.target.value as any } as any,
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
                value={formData.textStyles?.main?.lineHeight || 1.6}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      main: { ...prev.textStyles?.main, lineHeight: parseFloat(e.target.value) } as any,
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
                  checked={formData.textStyles?.main?.bold || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        ...prev.textStyles,
                        main: { ...prev.textStyles?.main, bold: e.target.checked } as any,
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
        <label className="block text-sm font-medium mb-2 text-black">First Image</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleUploadSuccess(result, 1)}
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
                Upload Image 1
              </button>
              {formData.image1_url && (
                <div>
                  <p className="text-sm text-gray-600">Image 1 uploaded ✓</p>
                  <img src={formData.image1_url} alt="Image 1" className="w-32 h-32 object-cover rounded mt-2" />
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-black">Second Image</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleUploadSuccess(result, 2)}
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
                Upload Image 2
              </button>
              {formData.image2_url && (
                <div>
                  <p className="text-sm text-gray-600">Image 2 uploaded ✓</p>
                  <img src={formData.image2_url} alt="Image 2" className="w-32 h-32 object-cover rounded mt-2" />
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
        {uploading ? 'Saving...' : 'Save About Page'}
      </button>
    </form>
    </div>
  )
}
