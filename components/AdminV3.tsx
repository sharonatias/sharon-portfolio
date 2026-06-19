'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavV3 from './AdminNavV3'
import PageEditorV3 from './AdminPageEditorV3'
import ProjectsAdminV3 from './AdminProjectsV3'
import CaseStudiesAdminV3 from './AdminCaseStudiesV3'
import BrandCaseStudiesAdminV3 from './AdminBrandCaseStudies'
import AdminAboutEditorV3 from './AdminAboutEditorV3'
import SettingsAdminV3 from './AdminSettingsV3'

type AdminPage = 'home' | 'cases' | 'brand_cases' | 'about' | 'projects' | 'settings'

export default function AdminV3() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState<AdminPage>('home')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 mt-4 text-sm tracking-wide">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <AdminNavV3 currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-blue-500/20 bg-slate-950/50 backdrop-blur px-8 py-6">
          <h1 className="text-3xl font-light tracking-wider bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            {currentPage === 'home' && '🏠 Home'}
            {currentPage === 'cases' && '🎬 Film Case Studies'}
            {currentPage === 'brand_cases' && '🎨 Brand Case Studies'}
            {currentPage === 'about' && '📖 About Page'}
            {currentPage === 'projects' && '📊 Projects'}
            {currentPage === 'settings' && '⚙️ Settings'}
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {currentPage === 'home' && <PageEditorV3 />}
          {currentPage === 'cases' && <CaseStudiesAdminV3 />}
          {currentPage === 'brand_cases' && <BrandCaseStudiesAdminV3 />}
          {currentPage === 'about' && <AdminAboutEditorV3 />}
          {currentPage === 'projects' && <ProjectsAdminV3 />}
          {currentPage === 'settings' && <SettingsAdminV3 />}
        </div>
      </div>
    </div>
  )
}
