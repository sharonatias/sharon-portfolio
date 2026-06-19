'use client'

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { BrandDesign, SKILLS } from '@/lib/types'

interface BrandDesignFormProps {
  project?: BrandDesign | null
  onSave: (project: BrandDesign) => void
}

export default function BrandDesignForm({ project, onSave }: BrandDesignFormProps) {
  const [formData, setFormData] = useState<BrandDesign>(
    project || {
      title: '',
      story: '',
      category: 'brand_design',
      logo_url: '',
      logo_size: 100,
      cover_image_url: '',
      skills: [],
      color_palette: {
        colors: ['#000000'],
        description: '',
      },
      images: [],
      mockups: [],
      process_description: '',
      process_images: [],
      video_url: '',
      background_url: '',
      textStyles: {
        story: {
          fontSize: 16,
          fontFamily: 'mono',
          alignment: 'center',
          bold: false,
          lineHeight: 1.6,
        },
        process: {
          fontSize: 16,
          fontFamily: 'mono',
          alignment: 'center',
          bold: false,
          lineHeight: 1.6,
        },
        colorDescription: {
          fontSize: 14,
          fontFamily: 'mono',
          alignment: 'center',
          bold: false,
          lineHeight: 1.6,
        },
      },
    }
  )
  const [uploading, setUploading] = useState(false)

  const getInitialBackgroundType = (): 'image' | 'video' => {
    if (project?.background_url) {
      return project.background_url.includes('.mp4') || project.background_url.includes('youtube') ? 'video' : 'image'
    }
    return 'image'
  }

  const [backgroundType, setBackgroundType] = useState<'image' | 'video'>(getInitialBackgroundType())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...formData.color_palette.colors]
    newColors[index] = value.trim()
    setFormData((prev) => ({
      ...prev,
      color_palette: { ...prev.color_palette, colors: newColors },
    }))
  }

  const addColor = () => {
    setFormData((prev) => ({
      ...prev,
      color_palette: {
        ...prev.color_palette,
        colors: [...prev.color_palette.colors, '#000000'],
      },
    }))
  }

  const removeColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      color_palette: {
        ...prev.color_palette,
        colors: prev.color_palette.colors.filter((_, i) => i !== index),
      },
    }))
  }

  const handleImageUpload = (result: any, type: 'logo' | 'images' | 'mockups' | 'process') => {
    const url = result.info.secure_url
    setFormData((prev) => {
      if (type === 'logo') {
        return { ...prev, logo_url: url }
      } else if (type === 'images') {
        return { ...prev, images: [...prev.images, url] }
      } else if (type === 'mockups') {
        return { ...prev, mockups: [...prev.mockups, url] }
      } else if (type === 'process') {
        return { ...prev, process_images: [...prev.process_images, url] }
      }
      return prev
    })
  }

  const removeImage = (type: 'images' | 'mockups' | 'process', index: number) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const url = project?.id ? `/api/brand-design/${project.id}` : '/api/brand-design'
      const method = project?.id ? 'PUT' : 'POST'

      console.log('Sending data:', formData)

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const responseText = await res.text()
      console.log('Response status:', res.status)
      console.log('Response body:', responseText)

      if (res.ok) {
        const saved = JSON.parse(responseText)
        onSave(saved)
      } else {
        alert(`Failed to save: ${responseText}`)
      }
    } catch (error) {
      console.error('Error saving:', error)
      alert('Error saving brand design: ' + (error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Title */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Title <span className="text-gray-400 font-normal">(Optional)</span></label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Leave empty if not needed"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
        />
      </div>

      {/* Brand Story */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Brand Story <span className="text-gray-400 font-normal">(Optional)</span></label>
        <textarea
          name="story"
          value={formData.story}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-black mb-4 resize-none ${
            formData.textStyles?.story?.alignment === 'left'
              ? 'text-left'
              : formData.textStyles?.story?.alignment === 'right'
              ? 'text-right'
              : 'text-center'
          }`}
          style={{
            fontFamily:
              formData.textStyles?.story?.fontFamily === 'serif'
                ? 'Georgia, serif'
                : formData.textStyles?.story?.fontFamily === 'sans'
                ? 'Arial, sans-serif'
                : 'Courier New, monospace',
            fontSize: `${formData.textStyles?.story?.fontSize || 16}px`,
            lineHeight: `${formData.textStyles?.story?.lineHeight || 1.6}em`,
            fontWeight: formData.textStyles?.story?.bold ? 'bold' : 'normal',
          }}
          rows={5}
          placeholder="סיפור המותג - מה השראה, המטרה והחזון"
        />

        {/* Story Styling */}
        <div className="bg-gray-50 rounded p-4 space-y-3">
          <h4 className="text-xs font-semibold text-gray-700">Styling Options</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Font Size (px)</label>
              <input
                type="number"
                min="10"
                max="48"
                value={formData.textStyles?.story?.fontSize || 16}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      story: { ...prev.textStyles?.story, fontSize: parseInt(e.target.value) } as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Font Family</label>
              <select
                value={formData.textStyles?.story?.fontFamily || 'mono'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      story: { ...prev.textStyles?.story, fontFamily: e.target.value as any } as any,
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
                value={formData.textStyles?.story?.alignment || 'center'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      story: { ...prev.textStyles?.story, alignment: e.target.value as any } as any,
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
                value={formData.textStyles?.story?.lineHeight || 1.6}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      story: { ...prev.textStyles?.story, lineHeight: parseFloat(e.target.value) } as any,
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
                  checked={formData.textStyles?.story?.bold || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        ...prev.textStyles,
                        story: { ...prev.textStyles?.story, bold: e.target.checked } as any,
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

      {/* Cover Image */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Cover Image <span className="text-gray-400 font-normal">(Optional)</span></label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => {
            const url = result.info.secure_url
            setFormData((prev) => ({ ...prev, cover_image_url: url }))
          }}
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
                Upload Cover Image
              </button>
              {formData.cover_image_url && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Cover image uploaded ✓</p>
                  <img src={formData.cover_image_url} alt="Cover" className="w-full h-48 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, cover_image_url: '' }))}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                  >
                    Remove Cover Image
                  </button>
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      {/* Logo */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Logo</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleImageUpload(result, 'logo')}
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
                Upload Logo
              </button>
              {formData.logo_url && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Logo uploaded ✓</p>
                  <img src={formData.logo_url} alt="Logo" className="w-32 h-32 object-contain" />
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      {/* Logo Size */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-4">Logo Size</label>
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <input
              type="range"
              min="50"
              max="200"
              value={formData.logo_size || 100}
              onChange={(e) => setFormData((prev) => ({ ...prev, logo_size: parseInt(e.target.value) }))}
              className="flex-1 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-center min-w-16">
              <p className="text-2xl font-bold text-gray-800">{formData.logo_size || 100}%</p>
              <p className="text-xs text-gray-500">scale</p>
            </div>
          </div>
          {formData.logo_url && (
            <div className="flex items-center justify-center p-6 bg-gray-50 rounded">
              <img
                src={formData.logo_url}
                alt="Logo preview"
                className="object-contain"
                style={{
                  maxHeight: '120px',
                  transform: `scale(${(formData.logo_size || 100) / 100})`,
                  transformOrigin: 'center',
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-4 text-black">Skills & Expertise</label>
        <div className="space-y-2">
          {SKILLS.map((skill) => (
            <label key={skill} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.skills?.includes(skill) || false}
                onChange={(e) => {
                  setFormData((prev) => {
                    const newSkills = e.target.checked
                      ? [...(prev.skills || []), skill]
                      : (prev.skills || []).filter((s) => s !== skill)
                    return { ...prev, skills: newSkills }
                  })
                }}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="text-sm text-black capitalize">{skill}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Background */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-4">Background Image/Video</label>
        <div className="space-y-4">
          {/* Toggle between Image and Video */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setBackgroundType('image')}
              className={`px-4 py-2 rounded ${
                backgroundType === 'image'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Image
            </button>
            <button
              type="button"
              onClick={() => setBackgroundType('video')}
              className={`px-4 py-2 rounded ${
                backgroundType === 'video'
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              Video
            </button>
          </div>

          {/* Image Upload */}
          {backgroundType === 'image' && (
            <CldUploadWidget
              uploadPreset="sharon_portfolio"
              onSuccess={(result: any) => {
                const url = result.info.secure_url
                setFormData((prev) => ({ ...prev, background_url: url }))
              }}
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
                    Upload Background Image
                  </button>
                  {formData.background_url && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Background uploaded ✓</p>
                      <img src={formData.background_url} alt="Background" className="w-full h-48 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, background_url: '' }))}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                      >
                        Remove Background
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          )}

          {/* Video Upload */}
          {backgroundType === 'video' && (
            <CldUploadWidget
              uploadPreset="sharon_portfolio"
              onSuccess={(result: any) => {
                console.log('Video upload result:', result)
                const url = result.info.secure_url
                setFormData((prev) => ({ ...prev, background_url: url }))
              }}
              onError={(error: any) => {
                console.error('Video upload error:', error)
                alert('Failed to upload video: ' + (error?.message || 'Unknown error'))
              }}
              options={{
                resourceType: 'auto',
                maxFileSize: 100000000,
              }}
            >
              {({ open, isLoading }) => (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => open()}
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    {isLoading ? 'Uploading...' : 'Upload Background Video'}
                  </button>
                  {formData.background_url && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Background video uploaded ✓</p>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, background_url: '' }))}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                      >
                        Remove Background
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CldUploadWidget>
          )}
        </div>
      </div>

      {/* Color Palette */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Color Palette</label>
        <div className="space-y-4">
          {formData.color_palette.colors.map((color, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                placeholder="#000000"
              />
              {formData.color_palette.colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addColor}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          >
            Add Color
          </button>
          <textarea
            name="color_palette.description"
            value={formData.color_palette.description || ''}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                color_palette: { ...prev.color_palette, description: e.target.value },
              }))
            }
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-black mb-4 resize-none ${
              formData.textStyles?.colorDescription?.alignment === 'left'
                ? 'text-left'
                : formData.textStyles?.colorDescription?.alignment === 'right'
                ? 'text-right'
                : 'text-center'
            }`}
            style={{
              fontFamily:
                formData.textStyles?.colorDescription?.fontFamily === 'serif'
                  ? 'Georgia, serif'
                  : formData.textStyles?.colorDescription?.fontFamily === 'sans'
                  ? 'Arial, sans-serif'
                  : 'Courier New, monospace',
              fontSize: `${formData.textStyles?.colorDescription?.fontSize || 14}px`,
              lineHeight: `${formData.textStyles?.colorDescription?.lineHeight || 1.6}em`,
              fontWeight: formData.textStyles?.colorDescription?.bold ? 'bold' : 'normal',
            }}
            placeholder="תיאור הפלטת הצבעים וההשראה מאחוריה"
            rows={3}
          />

          {/* Color Description Styling */}
          <div className="bg-gray-50 rounded p-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-700">Color Description Styling</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Font Size (px)</label>
                <input
                  type="number"
                  min="10"
                  max="48"
                  value={formData.textStyles?.colorDescription?.fontSize || 14}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        ...prev.textStyles,
                        colorDescription: { ...prev.textStyles?.colorDescription, fontSize: parseInt(e.target.value) } as any,
                      },
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Font Family</label>
                <select
                  value={formData.textStyles?.colorDescription?.fontFamily || 'mono'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        ...prev.textStyles,
                        colorDescription: { ...prev.textStyles?.colorDescription, fontFamily: e.target.value as any } as any,
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
                  value={formData.textStyles?.colorDescription?.alignment || 'center'}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        ...prev.textStyles,
                        colorDescription: { ...prev.textStyles?.colorDescription, alignment: e.target.value as any } as any,
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
                  value={formData.textStyles?.colorDescription?.lineHeight || 1.6}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        ...prev.textStyles,
                        colorDescription: { ...prev.textStyles?.colorDescription, lineHeight: parseFloat(e.target.value) } as any,
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
                    checked={formData.textStyles?.colorDescription?.bold || false}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        textStyles: {
                          ...prev.textStyles,
                          colorDescription: { ...prev.textStyles?.colorDescription, bold: e.target.checked } as any,
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
      </div>

      {/* Images */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Images</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleImageUpload(result, 'images')}
          options={{
            resourceType: 'auto',
            maxFileSize: 100000000,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload Image
            </button>
          )}
        </CldUploadWidget>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {formData.images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt={`Image ${index + 1}`} className="w-full h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage('images', index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mockups */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">Mockups</label>
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleImageUpload(result, 'mockups')}
          options={{
            resourceType: 'auto',
            maxFileSize: 100000000,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload Mockup
            </button>
          )}
        </CldUploadWidget>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {formData.mockups.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt={`Mockup ${index + 1}`} className="w-full h-40 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage('mockups', index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Process */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-2 text-black">Design Process</label>
        <textarea
          name="process_description"
          value={formData.process_description}
          onChange={handleInputChange}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-black resize-none ${
            formData.textStyles?.process?.alignment === 'left'
              ? 'text-left'
              : formData.textStyles?.process?.alignment === 'right'
              ? 'text-right'
              : 'text-center'
          }`}
          style={{
            fontFamily:
              formData.textStyles?.process?.fontFamily === 'serif'
                ? 'Georgia, serif'
                : formData.textStyles?.process?.fontFamily === 'sans'
                ? 'Arial, sans-serif'
                : 'Courier New, monospace',
            fontSize: `${formData.textStyles?.process?.fontSize || 16}px`,
            lineHeight: `${formData.textStyles?.process?.lineHeight || 1.6}em`,
            fontWeight: formData.textStyles?.process?.bold ? 'bold' : 'normal',
          }}
          placeholder="תיאור התהליך העיצובי"
          rows={4}
        />

        {/* Process Styling */}
        <div className="bg-gray-50 rounded p-4 space-y-3 mb-4">
          <h4 className="text-xs font-semibold text-gray-700">Styling Options</h4>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Font Size (px)</label>
              <input
                type="number"
                min="10"
                max="48"
                value={formData.textStyles?.process?.fontSize || 16}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      process: { ...prev.textStyles?.process, fontSize: parseInt(e.target.value) } as any,
                    },
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-black"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Font Family</label>
              <select
                value={formData.textStyles?.process?.fontFamily || 'mono'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      process: { ...prev.textStyles?.process, fontFamily: e.target.value as any } as any,
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
                value={formData.textStyles?.process?.alignment || 'center'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      process: { ...prev.textStyles?.process, alignment: e.target.value as any } as any,
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
                value={formData.textStyles?.process?.lineHeight || 1.6}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    textStyles: {
                      ...prev.textStyles,
                      process: { ...prev.textStyles?.process, lineHeight: parseFloat(e.target.value) } as any,
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
                  checked={formData.textStyles?.process?.bold || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      textStyles: {
                        ...prev.textStyles,
                        process: { ...prev.textStyles?.process, bold: e.target.checked } as any,
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
        <CldUploadWidget
          uploadPreset="sharon_portfolio"
          onSuccess={(result: any) => handleImageUpload(result, 'process')}
          options={{
            resourceType: 'auto',
            maxFileSize: 100000000,
          }}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={() => open()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Upload Process Image
            </button>
          )}
        </CldUploadWidget>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {formData.process_images.map((img, index) => (
            <div key={index} className="relative">
              <img src={img} alt={`Process ${index + 1}`} className="w-full h-32 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage('process', index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Video */}
      <div className="bg-white rounded-lg p-6">
        <label className="block text-sm font-medium mb-4">Video</label>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Upload from Computer</p>
            <CldUploadWidget
              uploadPreset="sharon_portfolio"
              onSuccess={(result: any) => {
                const url = result.info.secure_url
                setFormData((prev) => ({ ...prev, video_url: url }))
              }}
              options={{
                resourceType: 'auto',
                maxFileSize: 100000000,
              }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload Video File
                </button>
              )}
            </CldUploadWidget>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">YouTube Link</p>
            <input
              type="text"
              name="video_url"
              value={formData.video_url || ''}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=... או קישור וידאו"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black"
            />
          </div>

          {formData.video_url && (
            <div className="mt-4 space-y-2">
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm text-green-700">✓ Video URL set</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, video_url: '' }))}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Remove Video
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Submit */}
      <div className="bg-white rounded-lg p-6">
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {uploading ? 'Saving...' : project?.id ? 'Update Brand Design' : 'Create Brand Design'}
        </button>
      </div>
    </form>
  )
}
