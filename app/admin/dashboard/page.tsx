'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Project, HeroVideo, BrandDesign, About, AppCase, CATEGORIES } from '@/lib/types'
import ProjectForm from '@/components/ProjectForm'
import ProjectList from '@/components/ProjectList'
import HeroVideoForm from '@/components/HeroVideoForm'
import HeroVideoList from '@/components/HeroVideoList'
import BrandDesignForm from '@/components/BrandDesignForm'
import AboutForm from '@/components/AboutForm'
import AppCaseForm from '@/components/AppCaseForm'
import ManageOrderBrandDigital from '@/components/ManageOrderBrandDigital'

export default function AdminDashboard() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>([])
  const [brandDesigns, setBrandDesigns] = useState<BrandDesign[]>([])
  const [about, setAbout] = useState<About | null>(null)
  const [appCases, setAppCases] = useState<AppCase[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showHeroForm, setShowHeroForm] = useState(false)
  const [showBrandForm, setShowBrandForm] = useState(false)
  const [showAboutForm, setShowAboutForm] = useState(false)
  const [showAppCaseForm, setShowAppCaseForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingHeroVideo, setEditingHeroVideo] = useState<HeroVideo | null>(null)
  const [editingBrandDesign, setEditingBrandDesign] = useState<BrandDesign | null>(null)
  const [editingAppCase, setEditingAppCase] = useState<AppCase | null>(null)
  const [activeTab, setActiveTab] = useState<'projects' | 'hero' | 'brand' | 'about' | 'app' | 'manage-order'>('projects')

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (!isAdmin) {
      router.push('/admin')
    }
    fetchProjects()
    fetchHeroVideos()
    fetchBrandDesigns()
    fetchAbout()
    fetchAppCases()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        cache: 'no-store', // Always fetch fresh data
      })
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  const fetchHeroVideos = async () => {
    try {
      const res = await fetch('/api/hero', {
        cache: 'no-store', // Always fetch fresh data
      })
      const data = await res.json()
      setHeroVideos(data)
    } catch (error) {
      console.error('Failed to fetch hero videos:', error)
    }
  }

  const fetchBrandDesigns = async () => {
    try {
      const res = await fetch('/api/brand-design', {
        cache: 'no-store', // Always fetch fresh data
      })
      const data = await res.json()
      setBrandDesigns(data)
    } catch (error) {
      console.error('Failed to fetch brand designs:', error)
    }
  }

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about', {
        cache: 'no-store', // Always fetch fresh data
      })
      const data = await res.json()
      console.log('📥 Fetched about data:', data)
      setAbout(data)
    } catch (error) {
      console.error('Failed to fetch about:', error)
    }
  }

  const fetchAppCases = async () => {
    try {
      const res = await fetch('/api/app-cases', {
        cache: 'no-store', // Always fetch fresh data
      })
      const data = await res.json()
      setAppCases(data)
    } catch (error) {
      console.error('Failed to fetch app cases:', error)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin')
    router.push('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <nav className="bg-black text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'projects'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'brand'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Brand Designs
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'hero'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hero Videos
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'about'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'app'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            App Case Studies
          </button>
          <button
            onClick={() => setActiveTab('manage-order')}
            className={`px-4 py-2 font-medium transition ${
              activeTab === 'manage-order'
                ? 'border-b-2 border-black text-black'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Order
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowForm(!showForm)
                  setEditingProject(null)
                }}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                {showForm ? 'Cancel' : '+ Add New Project'}
              </button>
            </div>

            {showForm && (
              <ProjectForm
                project={editingProject}
                onSave={(project) => {
                  fetchProjects()
                  setShowForm(false)
                  setEditingProject(null)
                }}
              />
            )}

            <ProjectList
              projects={projects}
              onEdit={(project) => {
                setEditingProject(project)
                setShowForm(true)
              }}
              onDelete={() => fetchProjects()}
            />
          </>
        )}

        {/* Hero Videos Tab */}
        {activeTab === 'hero' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowHeroForm(!showHeroForm)
                  setEditingHeroVideo(null)
                }}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                {showHeroForm ? 'Cancel' : '+ Add Hero Video'}
              </button>
            </div>

            {showHeroForm && (
              <HeroVideoForm
                video={editingHeroVideo}
                onSave={(video) => {
                  fetchHeroVideos()
                  setShowHeroForm(false)
                  setEditingHeroVideo(null)
                }}
              />
            )}

            <HeroVideoList
              videos={heroVideos}
              onEdit={(video) => {
                setEditingHeroVideo(video)
                setShowHeroForm(true)
              }}
              onDelete={() => fetchHeroVideos()}
            />
          </>
        )}

        {/* Brand Designs Tab */}
        {activeTab === 'brand' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowBrandForm(!showBrandForm)
                  setEditingBrandDesign(null)
                }}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                {showBrandForm ? 'Cancel' : '+ Add Brand Design'}
              </button>
            </div>

            {showBrandForm && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">{editingBrandDesign ? 'Edit' : 'Create'} Brand Design</h3>
                <BrandDesignForm
                  project={editingBrandDesign}
                  onSave={(design) => {
                    fetchBrandDesigns()
                    setShowBrandForm(false)
                    setEditingBrandDesign(null)
                  }}
                />
              </div>
            )}

            {/* Brand Designs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brandDesigns.map((design) => (
                <div key={design.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                  {design.logo_url && (
                    <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                      <img src={design.logo_url} alt={design.title} className="h-32 w-auto object-contain" />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{design.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{design.story}</p>

                    <div className="mb-4">
                      <span className="inline-block bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs font-medium">
                        Brand & Digital Design
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingBrandDesign(design)
                          setShowBrandForm(true)
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm('Are you sure?')) return
                          try {
                            await fetch(`/api/brand-design/${design.id}`, { method: 'DELETE' })
                            fetchBrandDesigns()
                          } catch (error) {
                            console.error('Failed to delete:', error)
                          }
                        }}
                        className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                      <a
                        href={`/brand/${design.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm font-medium text-center"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {brandDesigns.length === 0 && !showBrandForm && (
              <div className="text-center text-gray-500 py-8">No brand designs yet</div>
            )}
          </>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowAboutForm(!showAboutForm)}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                {showAboutForm ? 'Cancel' : '✎ Edit About Page'}
              </button>
            </div>

            {showAboutForm && (
              <AboutForm
                about={about}
                onSave={(updatedAbout) => {
                  console.log('✅ AboutForm onSave called with:', updatedAbout)
                  setAbout(updatedAbout)
                  setShowAboutForm(false)
                  console.log('🔄 Fetching about data after save...')
                  fetchAbout()
                }}
              />
            )}

            {!showAboutForm && about && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">{about.id ? 'Current About Page' : 'No About Page Yet'}</h3>
                {about.id && (
                  <>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2 text-gray-700">Text:</h4>
                      <p className="text-gray-600 whitespace-pre-wrap">{about.text}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {about.image1_url && (
                        <div>
                          <p className="font-semibold mb-2 text-gray-700">Image 1:</p>
                          <img src={about.image1_url} alt="Image 1" className="w-full h-40 object-cover rounded" />
                        </div>
                      )}
                      {about.image2_url && (
                        <div>
                          <p className="font-semibold mb-2 text-gray-700">Image 2:</p>
                          <img src={about.image2_url} alt="Image 2" className="w-full h-40 object-cover rounded" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {!showAboutForm && !about && (
              <div className="text-center text-gray-500 py-8">
                <p>No about page content yet. Click "Edit About Page" to create one.</p>
              </div>
            )}
          </>
        )}

        {/* App Case Studies Tab */}
        {activeTab === 'app' && (
          <>
            <div className="mb-6">
              <button
                onClick={() => {
                  setShowAppCaseForm(!showAppCaseForm)
                  setEditingAppCase(null)
                }}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition"
              >
                {showAppCaseForm ? 'Cancel' : '+ Create New Case Study'}
              </button>
            </div>

            {showAppCaseForm && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6">{editingAppCase ? 'Edit' : 'Create'} App Case Study</h3>
                <AppCaseForm
                  appCase={editingAppCase}
                  onSave={(appCase) => {
                    fetchAppCases()
                    setShowAppCaseForm(false)
                    setEditingAppCase(null)
                  }}
                />
              </div>
            )}

            {/* App Cases List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {appCases.map((appCase) => (
                <div key={appCase.id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                  {appCase.hero_image && (
                    <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
                      <img src={appCase.hero_image} alt={appCase.title} className="h-40 w-auto object-contain" />
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">{appCase.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{appCase.subtitle}</p>
                    <p className="text-gray-500 text-xs mb-3">{appCase.year} • {appCase.role}</p>

                    <div className="mb-4">
                      <span className="inline-block bg-blue-200 text-blue-800 px-3 py-1 rounded text-xs font-medium">
                        App Case Study
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingAppCase(appCase)
                          setShowAppCaseForm(true)
                        }}
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm('Are you sure?')) return
                          try {
                            await fetch(`/api/app-cases/${appCase.id}`, { method: 'DELETE' })
                            fetchAppCases()
                          } catch (error) {
                            console.error('Failed to delete:', error)
                          }
                        }}
                        className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                      <a
                        href={`/case-studies/${appCase.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm font-medium text-center"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {appCases.length === 0 && !showAppCaseForm && (
              <div className="text-center text-gray-500 py-8">No case studies yet</div>
            )}
          </>
        )}

        {/* Manage Order Tab */}
        {activeTab === 'manage-order' && (
          <ManageOrderBrandDigital />
        )}
      </div>
    </div>
  )
}
