'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNav from './AdminNav'
import PageEditor from './AdminPageEditor'
import ProjectsAdmin from './AdminProjects'
import VideosAdmin from './AdminVideos'
import SettingsAdmin from './AdminSettings'

type AdminPage = 'home' | 'projects' | 'videos' | 'settings'

export default function AdminV2() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<AdminPage>('home')
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const isAdmin = sessionStorage.getItem('isAdmin')
      if (!isAdmin) {
        router.push('/admin')
        return
      }
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-gray-400">טוען...</div>
      </div>
    )
  }

  const renderPage = () => {
    try {
      if (currentPage === 'home') return <PageEditor />
      if (currentPage === 'projects') return <ProjectsAdmin />
      if (currentPage === 'videos') return <VideosAdmin />
      if (currentPage === 'settings') return <SettingsAdmin />
      return <PageEditor />
    } catch (error) {
      console.error('Error rendering page:', error)
      return <div className="p-8 text-red-400">שגיאה בטעינת הדף</div>
    }
  }

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <AdminNav currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-gray-800 bg-gray-950 px-8 py-4">
          <h1 className="text-xl font-light tracking-wider">
            {currentPage === 'home' && 'עמוד הבית'}
            {currentPage === 'projects' && 'פרוייקטים'}
            {currentPage === 'videos' && 'סרטי וידאו'}
            {currentPage === 'settings' && 'הגדרות'}
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}
