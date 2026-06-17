'use client'

import { useState, useEffect } from 'react'
import { Project, BrandDesign, AppCase, CATEGORIES } from '@/lib/types'
import Link from 'next/link'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [brandDesigns, setBrandDesigns] = useState<BrandDesign[]>([])
  const [appCases, setAppCases] = useState<AppCase[]>([])
  const [videoCaseStudies, setVideoCaseStudies] = useState<AppCase[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>('films_video')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [categoryHeros, setCategoryHeros] = useState<Record<string, { title: string; image: string }>>({
    films_video: {
      title: 'Films & Video',
      image: ''
    },
    brand_digital_design: {
      title: 'Brand & Digital Design',
      image: ''
    },
    ai_creative_technology: {
      title: 'AI & Creative Technology',
      image: ''
    }
  })

  const categoryList = ['films_video', 'brand_digital_design', 'ai_creative_technology']

  const getCurrentCategoryIndex = () => categoryList.indexOf(selectedCategory || 'films_video')

  const goToNextCategory = () => {
    const currentIndex = getCurrentCategoryIndex()
    const nextIndex = (currentIndex + 1) % categoryList.length
    setSelectedCategory(categoryList[nextIndex])
  }

  useEffect(() => {
    fetchProjects()
    fetchBrandDesigns()
    fetchAppCases()
    fetchVideoCaseStudies()
    fetchCategoryHeros()
  }, [])

  useEffect(() => {
    setVisibleItems(new Set())
  }, [selectedCategory])

  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleItems(prev => new Set([...prev, entry.target.id]))
          }
        })
      }, { threshold: 0.1 })

      document.querySelectorAll('[data-item-id]').forEach(el => {
        observer.observe(el)
      })

      return () => observer.disconnect()
    }, 100)

    return () => clearTimeout(timer)
  }, [projects, brandDesigns, appCases, videoCaseStudies, selectedCategory])

  const fetchCategoryHeros = async () => {
    try {
      const res = await fetch('/api/category-heroes')
      const data = await res.json()
      if (Array.isArray(data)) {
        const heroMap: Record<string, { title: string; image: string }> = {}
        data.forEach((hero: any) => {
          heroMap[hero.category_key] = {
            title: hero.title,
            image: hero.image_url || ''
          }
        })
        setCategoryHeros(prev => ({ ...prev, ...heroMap }))
      }
    } catch (error) {
      console.error('Failed to fetch category heroes:', error)
    }
  }

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    }
  }

  const fetchBrandDesigns = async () => {
    try {
      const res = await fetch('/api/brand-design')
      const data = await res.json()
      setBrandDesigns(data)
    } catch (error) {
      console.error('Failed to fetch brand designs:', error)
    }
  }

  const fetchAppCases = async () => {
    try {
      const res = await fetch('/api/app-cases')
      const data = await res.json()
      setAppCases(data)
    } catch (error) {
      console.error('Failed to fetch app cases:', error)
    }
  }

  const fetchVideoCaseStudies = async () => {
    try {
      const res = await fetch('/api/case-studies')
      const data = await res.json()
      setVideoCaseStudies(data)
    } catch (error) {
      console.error('Failed to fetch video case studies:', error)
    }
  }

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects

  const filteredBrandDesigns = selectedCategory === 'brand_digital_design' || !selectedCategory
    ? brandDesigns
    : []

  const filteredAppCases = selectedCategory === 'brand_digital_design' || !selectedCategory
    ? appCases.filter((c) => c.category === 'brand_digital_design')
    : []

  const filteredVideoCases = selectedCategory === 'films_video' || !selectedCategory
    ? videoCaseStudies.filter((c) => c.category === 'films_video' || !c.category)
    : []

  // Combine all items and sort by display_order for Brand & Digital Design category
  const allItems = selectedCategory === 'brand_digital_design'
    ? [
        ...filteredProjects.map(p => ({ ...p, itemType: 'project' as const })),
        ...filteredBrandDesigns.map(b => ({ ...b, itemType: 'brand' as const })),
        ...filteredAppCases.map(c => ({ ...c, itemType: 'appcase' as const })),
      ].sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
    : selectedCategory === 'films_video'
    ? [
        ...filteredProjects.map(p => ({ ...p, itemType: 'project' as const })),
        ...filteredVideoCases.map(c => ({ ...c, itemType: 'videocase' as const })),
      ]
    : [
        ...filteredProjects.map(p => ({ ...p, itemType: 'project' as const })),
        ...filteredBrandDesigns.map(b => ({ ...b, itemType: 'brand' as const })),
      ]

  const isYouTubeUrl = (url?: string) => url?.includes('youtube') || url?.includes('youtu.be')

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 px-8 lg:px-20 pt-8 pb-16 transition-all duration-300">
        <Link href="/" className="max-w-7xl block hover:opacity-80 transition">
          <h1 className="text-2xl font-light tracking-widest text-white" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>SHARON MOSHE ATTIAS</h1>
        </Link>
      </header>

      {/* Hamburger Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-6 right-6 flex flex-col gap-2 w-8 h-8 justify-center items-center cursor-pointer hover:opacity-70 transition z-50 bg-transparent"
        aria-label="Toggle menu"
      >
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
      </button>

      {/* Menu Overlay - Blur Effect */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/40 transition-all duration-300 ease-out"
          onClick={() => setMenuOpen(false)}
          style={{
            animation: 'fadeIn 0.3s ease-out',
            backdropFilter: 'blur(20px)'
          }}
        />
      )}

      {/* Menu Panel */}
      {menuOpen && (
        <nav
          className="fixed top-0 left-0 w-full sm:w-1/2 h-screen sm:h-screen z-20 flex flex-col items-start justify-end px-8 sm:px-16 pb-16"
          style={{
            animation: 'slideInLeft 0.4s ease-out',
            background: 'transparent'
          }}
        >
          <div className="flex flex-col gap-3 sm:gap-4 w-full">
            <a href="/" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-7xl font-black tracking-tighter text-white hover:opacity-70 transition text-left uppercase leading-none" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em', fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }}>
              Home
            </a>
            <a href="/projects" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-7xl font-black tracking-tighter text-white transition text-left uppercase leading-none" style={{ filter: 'blur(4px)', fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em', fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'blur(0px)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'blur(4px)'}>
              Work
            </a>
            <a href="/about" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-7xl font-black tracking-tighter text-white transition text-left uppercase leading-none" style={{ filter: 'blur(4px)', fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em', fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'blur(0px)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'blur(4px)'}>
              About
            </a>
            <a href="/contact" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-7xl font-black tracking-tighter text-white transition text-left uppercase leading-none" style={{ filter: 'blur(4px)', fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em', fontSize: 'clamp(1.8rem, 5vw, 3.5rem)' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'blur(0px)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'blur(4px)'}>
              Contact
            </a>
            <a href="/admin" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em' }}>
              Admin
            </a>
          </div>
        </nav>
      )}

      {/* Top Section - Breadcrumb & Title */}
      <section className="relative pt-32 pb-16 px-8 lg:px-20">
        {/* Breadcrumb */}
        <div className="mb-12">
          <p className="text-sm lg:text-base tracking-widest text-gray-400" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
            HOME / WORKS
          </p>
        </div>

        {/* Main Title */}
        <h1 className="text-7xl lg:text-9xl mb-2 leading-tight" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em' }}>
          WORKS
        </h1>

        {/* Subtitle */}
        <p className="text-xl lg:text-2xl text-gray-400 mb-16" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '0.02em', lineHeight: '1.5', maxWidth: '600px' }}>
          Selected projects across film, documentary, branded content, design and emerging technologies.
        </p>
      </section>

      {/* Category Bar - Full Width */}
      <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginBottom: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="flex gap-12 lg:gap-16 overflow-x-auto pb-6 pt-6 px-8 lg:px-20">
          {['ALL', 'FEATURED', 'DOCUMENTARY', 'COMMERCIAL', 'TELEVISION', 'MUSIC', 'BRAND DESIGN', 'AI EXPERIMENTS'].map((cat) => (
            <button
              key={cat}
              className="text-sm lg:text-base tracking-widest whitespace-nowrap transition"
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontWeight: 400,
                color: cat === 'ALL' ? 'white' : 'rgba(255, 255, 255, 0.5)',
                borderBottom: cat === 'ALL' ? '2px solid white' : 'none',
                paddingBottom: cat === 'ALL' ? 'calc(1.5rem - 2px)' : '1.5rem'
              }}
            >
              {cat}
            </button>
          ))}
          <div className="flex-shrink-0 w-px bg-gray-700" />
          <button
            className="text-sm lg:text-base tracking-widest whitespace-nowrap text-gray-400 hover:text-white transition"
            style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, paddingBottom: '1.5rem' }}
          >
            SORT BY ↓
          </button>
        </div>
      </div>

      {/* Featured Work Section */}
      <section className="px-8 lg:px-20 mb-24 mt-8">
        <h2 className="text-3xl lg:text-4xl mb-12 leading-tight" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em' }}>
          FEATURED WORK
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24 w-full">
          {projects.slice(0, 3).map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gray-900 mb-4" style={{ aspectRatio: '4 / 3' }}>
                  {project.image_url ? (
                    <>
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-black">No image</div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-white group-hover:opacity-70 transition" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
                  {project.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Projects Section - Grid of 4 */}
      <section className="px-8 lg:px-20 pb-24">
        <h2 className="text-3xl lg:text-4xl mb-12 leading-tight" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em' }}>
          ALL PROJECTS
        </h2>

        {/* All Projects, Brands & Cases - Grid of 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mx-auto w-full">
          {/* Combined and sorted items */}
          {allItems.map((item) => {
            // Render project
            if (item.itemType === 'project') {
              const project = item as typeof item & { itemType: 'project' }
              const itemId = `project-${project.id}`
              const isVisible = visibleItems.has(itemId)
              return (
                <div
                  key={itemId}
                  id={itemId}
                  data-item-id="true"
                  className="group cursor-pointer transition-all duration-700 ease-out w-full"
                  style={{
                    opacity: visibleItems.size > 0 ? (isVisible ? 1 : 0) : 1,
                    transform: visibleItems.size > 0 ? (isVisible ? 'translateY(0)' : 'translateY(20px)') : 'translateY(0)',
                  }}
                  onClick={() => project.video_url && setSelectedProject(project)}
                >
                  <div className="relative overflow-hidden rounded-lg bg-gray-900" style={{ aspectRatio: '4 / 3' }}>
                    {project.image_url ? (
                      <>
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 bg-black">No image</div>
                    )}

                    {/* Text Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      {project.title && (
                        <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '0.02em' }}>
                          {project.title}
                        </h3>
                      )}
                      {project.description && (
                        <p className="text-base lg:text-lg text-gray-300" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 300, letterSpacing: '0.02em', lineHeight: '1.4' }}>
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            }

            // Render brand design
            if (item.itemType === 'brand') {
              const design = item as typeof item & { itemType: 'brand' }
              const itemId = `brand-${design.id}`
              const isVisible = visibleItems.has(itemId)
              return (
                <Link key={itemId} href={`/brand/${design.id}`}>
                  <div className="group cursor-pointer transition-all duration-700 ease-out w-full" style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  }} id={itemId} data-item-id="true">
                    <div className="relative overflow-hidden rounded-lg bg-gray-900 mb-3" style={{ aspectRatio: '4 / 3' }}>
                      {design.cover_image_url ? (
                        <>
                          <img
                            src={design.cover_image_url}
                            alt={design.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        </>
                      ) : design.logo_url ? (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                          <img
                            src={design.logo_url}
                            alt={design.title}
                            className="w-2/3 h-2/3 object-contain group-hover:scale-110 transition duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-black">No image</div>
                      )}
                    </div>
                    {design.title && (
                      <h3 className="text-sm lg:text-base font-bold text-white group-hover:opacity-70 transition" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
                        {design.title}
                      </h3>
                    )}
                  </div>
                </Link>
              )
            }

            // Render app case study
            if (item.itemType === 'appcase') {
              const appCase = item as typeof item & { itemType: 'appcase' }
              const itemId = `case-${appCase.id}`
              const isVisible = visibleItems.has(itemId)
              return (
                <Link key={itemId} href={`/case-studies/${appCase.id}`}>
                  <div className="group cursor-pointer transition-all duration-700 ease-out w-full" style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  }} id={itemId} data-item-id="true">
                    <div className="relative overflow-hidden rounded-lg bg-gray-900 mb-3" style={{ aspectRatio: '4 / 3' }}>
                      {appCase.hero_image ? (
                        <>
                          <img
                            src={appCase.hero_image}
                            alt={appCase.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-black">No image</div>
                      )}
                    </div>
                    {appCase.title && (
                      <h3 className="text-sm lg:text-base font-bold text-white group-hover:opacity-70 transition" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
                        {appCase.title}
                      </h3>
                    )}
                  </div>
                </Link>
              )
            }

            // Render video case study
            if (item.itemType === 'videocase') {
              const videoCase = item as typeof item & { itemType: 'videocase' }
              const itemId = `videocase-${videoCase.id}`
              const isVisible = visibleItems.has(itemId)
              return (
                <Link key={itemId} href={`/case-studies/${videoCase.id}`}>
                  <div className="group cursor-pointer transition-all duration-700 ease-out w-full" style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  }} id={itemId} data-item-id="true">
                    <div className="relative overflow-hidden rounded-lg bg-gray-900 mb-3" style={{ aspectRatio: '4 / 3' }}>
                      {videoCase.hero_image ? (
                        <>
                          <img
                            src={videoCase.hero_image}
                            alt={videoCase.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-black">No image</div>
                      )}
                    </div>
                    {videoCase.title && (
                      <h3 className="text-sm lg:text-base font-bold text-white group-hover:opacity-70 transition" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
                        {videoCase.title}
                      </h3>
                    )}
                  </div>
                </Link>
              )
            }
          })}

        </div>

        {allItems.length === 0 && (
          <div className="text-center text-gray-400 py-16">No projects in this category yet</div>
        )}
      </section>

      {/* Video Modal */}
      {selectedProject && selectedProject.video_url && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-4xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 z-50 text-white text-3xl hover:text-gray-300 transition bg-black/50 w-10 h-10 flex items-center justify-center rounded"
            >
              ✕
            </button>

            {/* Top Gradient Layer - Title Only */}
            <div
              className="h-32 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))',
              }}
            >
              <div className="text-center px-8 py-4 h-full flex flex-col items-center justify-center">
                <h2 className="text-lg font-bold text-white">{selectedProject.title}</h2>
              </div>
            </div>

            {/* Video Container */}
            <div className="aspect-video relative bg-black">
              {isYouTubeUrl(selectedProject.video_url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(selectedProject.video_url) + '?autoplay=1&fs=1&quality=hd1080'}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-full"
                >
                  <source src={selectedProject.video_url} type="video/mp4" />
                </video>
              )}
            </div>

            {/* Description Section */}
            {selectedProject.description && (
              <div className="bg-black/80 backdrop-blur px-8 py-6">
                <p
                  className={`text-gray-300 whitespace-pre-wrap ${
                    selectedProject.textStyles?.description?.alignment === 'left'
                      ? 'text-left'
                      : selectedProject.textStyles?.description?.alignment === 'right'
                      ? 'text-right'
                      : 'text-center'
                  }`}
                  style={{
                    fontFamily:
                      selectedProject.textStyles?.description?.fontFamily === 'serif'
                        ? 'Georgia, serif'
                        : selectedProject.textStyles?.description?.fontFamily === 'sans'
                        ? 'Arial, sans-serif'
                        : 'Courier New, monospace',
                    fontSize: `${selectedProject.textStyles?.description?.fontSize || 16}px`,
                    lineHeight: `${selectedProject.textStyles?.description?.lineHeight || 1.6}em`,
                    fontWeight: selectedProject.textStyles?.description?.bold ? 'bold' : 'normal',
                  }}
                >
                  {selectedProject.description}
                </p>
              </div>
            )}

            {/* Gallery Images */}
            {selectedProject.images && selectedProject.images.length > 0 && (
              <div className="bg-black/80 backdrop-blur px-8 py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProject.images.map((img, index) => (
                    <div key={index} className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
                      <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Gradient Layer */}
            <div
              className="h-16 backdrop-blur-sm"
              style={{
                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))',
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 p-6 mt-16">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-400">
          <div className="flex gap-4">
            <a href="https://www.instagram.com/sharon.attias/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              Instagram
            </a>
            <a href="https://www.youtube.com/@sharonattias7274" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
              YouTube
            </a>
          </div>
          <p>© 2026 Sharon Moshe Attias | OpenMindStudio</p>
        </div>
      </footer>
    </div>
  )
}
