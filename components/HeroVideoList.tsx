'use client'

import { useState, useEffect } from 'react'
import { HeroVideo } from '@/lib/types'

interface HeroVideoListProps {
  videos: HeroVideo[]
  onEdit: (video: HeroVideo) => void
  onDelete: () => void
}

export default function HeroVideoList({ videos, onEdit, onDelete }: HeroVideoListProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [orderedVideos, setOrderedVideos] = useState<HeroVideo[]>([])

  useEffect(() => {
    setOrderedVideos(videos || [])
  }, [videos])

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newVideos = [...orderedVideos]
    const draggedVideo = newVideos[draggedIndex]
    newVideos.splice(draggedIndex, 1)
    newVideos.splice(dropIndex, 0, draggedVideo)

    setOrderedVideos(newVideos)
    setDraggedIndex(null)

    // Update order in database
    try {
      const updateData = newVideos.map((video, index) => ({
        id: video.id,
        order: index,
      }))

      const res = await fetch('/api/hero', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videos: updateData }),
      })

      if (!res.ok) {
        console.error('Failed to update order')
      }
    } catch (error) {
      console.error('Error updating order:', error)
    }
  }
  const handleDelete = async (id?: string) => {
    if (!id) return
    if (!confirm('Are you sure you want to delete this hero video?')) return

    try {
      const res = await fetch(`/api/hero/${id}`, { method: 'DELETE' })
      if (res.ok) {
        onDelete()
      } else {
        alert('Failed to delete hero video')
      }
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error deleting hero video')
    }
  }

  if (!Array.isArray(orderedVideos) || orderedVideos.length === 0) {
    return <div className="text-center text-gray-500 py-8">No hero videos yet</div>
  }

  return (
    <div className="space-y-4">
      {Array.isArray(orderedVideos) && orderedVideos.map((video, index) => (
        <div
          key={video.id}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          className={`bg-white rounded-lg p-6 border-2 transition cursor-move ${
            draggedIndex === index ? 'border-blue-500 opacity-50' : 'border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Hero Video {index + 1}</p>
              <h3 className="text-lg font-bold text-gray-900">
                {video.title_en || video.title_he || 'Hero Video'}
                {video.title_en && video.title_he && (
                  <span className="text-gray-600 ml-2">| {video.title_he}</span>
                )}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(video)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(video.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          {video.video_url && (
            <video controls className="w-full max-w-md rounded border border-gray-300 bg-black">
              <source src={video.video_url} type="video/mp4" />
            </video>
          )}
        </div>
      ))}
    </div>
  )
}
