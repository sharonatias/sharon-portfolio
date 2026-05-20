'use client'

import { useState, useEffect } from 'react'
import { Project, BrandDesign, AppCase } from '@/lib/types'

interface OrderItem {
  id: string
  title: string
  type: 'projects' | 'brand_designs' | 'app_cases'
  order: number
}

export default function ManageOrderBrandDigital() {
  const [items, setItems] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedItem, setDraggedItem] = useState<OrderItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [migrationSql, setMigrationSql] = useState<string | null>(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const [projectsRes, brandsRes, casesRes] = await Promise.all([
        fetch('/api/projects'),
        fetch('/api/brand-design'),
        fetch('/api/app-cases'),
      ])

      const projects = (await projectsRes.json()) as Project[]
      const brands = (await brandsRes.json()) as BrandDesign[]
      const cases = (await casesRes.json()) as AppCase[]

      // Filter by Brand & Digital Design and create items
      const filtered: OrderItem[] = [
        ...projects
          .filter((p) => p.category === 'brand_digital_design')
          .map((p, i) => ({
            id: p.id!,
            title: p.title,
            type: 'projects' as const,
            order: p.display_order ?? i,
          })),
        ...brands.map((b, i) => ({
          id: b.id!,
          title: b.title,
          type: 'brand_designs' as const,
          order: b.display_order ?? i,
        })),
        ...cases
          .filter((c) => c.category === 'brand_digital_design')
          .map((c, i) => ({
            id: c.id!,
            title: c.title,
            type: 'app_cases' as const,
            order: c.display_order ?? i,
          })),
      ]

      // Sort by order
      filtered.sort((a, b) => a.order - b.order)
      setItems(filtered)
    } catch (error) {
      console.error('Failed to fetch items:', error)
      setMessage('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (item: OrderItem) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-gray-700/50')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-gray-700/50')
  }

  const handleDrop = (e: React.DragEvent, targetItem: OrderItem) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-gray-700/50')

    if (!draggedItem || draggedItem.id === targetItem.id) return

    const draggedIndex = items.findIndex((i) => i.id === draggedItem.id)
    const targetIndex = items.findIndex((i) => i.id === targetItem.id)

    const newItems = [...items]
    newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItem)

    // Update orders
    const updated = newItems.map((item, i) => ({
      ...item,
      order: i,
    }))

    setItems(updated)
    setDraggedItem(null)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage('')
      setMigrationSql(null)

      const updateItems = items.map((item) => ({
        id: item.id,
        type: item.type,
        order: item.order,
      }))

      console.log('📤 Saving order with items:', updateItems)

      const res = await fetch('/api/manage-order', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updateItems }),
      })

      console.log('📥 Server response:', res.status, res.statusText)

      const data = await res.json()

      if (res.ok) {
        setMessage('✅ Order saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else if (res.status === 409 && data.requiresMigration) {
        // Database migration needed
        setMigrationSql(data.migrationSql)
        setMessage('⚠️ Database migration required')
      } else {
        setMessage(`❌ Failed to save order: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error saving order:', error)
      setMessage('❌ Error saving order')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center text-gray-400 py-8">Loading items...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2 text-black">Manage Order - Brand & Digital Design</h2>
        <p className="text-gray-600 text-sm">Drag items to reorder. Click Save when done.</p>
      </div>

      {message && (
        <div className="p-4 rounded-lg bg-gray-100 text-gray-800 text-center">
          {message}
        </div>
      )}

      {migrationSql && (
        <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Database Migration Required</h3>
          <p className="text-sm text-yellow-800 mb-3">
            The database is missing a required column. Please run this SQL in Supabase:
          </p>
          <div className="bg-white p-3 rounded border border-yellow-200 mb-3 font-mono text-sm overflow-x-auto">
            <code>{migrationSql}</code>
          </div>
          <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
            <li>Go to <a href="https://app.supabase.com/project/whqqammiamoajavokauw/sql/new" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Supabase SQL Editor</a></li>
            <li>Copy the SQL above and paste it</li>
            <li>Click "Execute"</li>
            <li>Come back here and try saving again</li>
          </ol>
        </div>
      )}

      <div className="space-y-2 bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
        {items.map((item) => (
          <div
            key={`${item.type}-${item.id}`}
            draggable
            onDragStart={() => handleDragStart(item)}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, item)}
            className={`p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-move transition ${
              draggedItem?.id === item.id ? 'opacity-50 border-gray-400' : 'hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-gray-400">⋮⋮</div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {item.type.replace('_', ' ')} • Order: {item.order}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
      >
        {saving ? 'Saving...' : 'Save Order'}
      </button>
    </div>
  )
}
