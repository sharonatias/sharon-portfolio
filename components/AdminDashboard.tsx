'use client'

import React, { useState, useEffect } from 'react'
import { Project, AppCase, HeroVideo, BrandDesign } from '@/lib/types'
import AdminSidebar from './AdminSidebar'
import ProjectsManager from './ProjectsManager'
import VideoCaseManager from './VideoCaseManager'
import BrandDigitalManager from './BrandDigitalManager'
import SiteContentManager from './SiteContentManager'

type AdminTab = 'projects' | 'videos' | 'brand' | 'content'

export default function AdminDashboardUI() {
  const [activeTab, setActiveTab] = useState<AdminTab>('projects')
  const [loading, setLoading] = useState(true)

  // Data states
  const [projects, setProjects] = useState<Project[]>([])
  const [videoCases, setVideoCases] = useState<AppCase[]>([])
  const [brandDesigns, setBrandDesigns] = useState<BrandDesign[]>([])
  const [appCases, setAppCases] = useState<AppCase[]>([])

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [projectsRes, videoCasesRes, brandRes, appRes] = await Promise.all([
        fetch('/api/projects?cache=no-store'),
        fetch('/api/case-studies?cache=no-store'),
        fetch('/api/brand-design?cache=no-store'),
        fetch('/api/app-cases?cache=no-store'),
      ])

      if (projectsRes.ok) setProjects(await projectsRes.json())
      if (videoCasesRes.ok) setVideoCases(await videoCasesRes.json())
      if (brandRes.ok) setBrandDesigns(await brandRes.json())
      if (appRes.ok) setAppCases(await appRes.json())
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadAllData()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'projects' && 'פרוייקטים'}
            {activeTab === 'videos' && 'סרטי וידאו'}
            {activeTab === 'brand' && 'עיצוב ודיגיטל'}
            {activeTab === 'content' && 'תוכן אתר'}
          </h1>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {loading ? 'טוען...' : 'רענן'}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">טוען נתונים...</p>
            </div>
          ) : (
            <>
              {activeTab === 'projects' && (
                <ProjectsManager
                  projects={projects}
                  onUpdate={loadAllData}
                />
              )}
              {activeTab === 'videos' && (
                <VideoCaseManager
                  cases={videoCases}
                  onUpdate={loadAllData}
                />
              )}
              {activeTab === 'brand' && (
                <BrandDigitalManager
                  brandDesigns={brandDesigns}
                  appCases={appCases}
                  onUpdate={loadAllData}
                />
              )}
              {activeTab === 'content' && (
                <SiteContentManager onUpdate={loadAllData} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
