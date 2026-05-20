'use client'

import { useState, useEffect } from 'react'
import { Project, BrandDesign, AppCase, CATEGORIES } from '@/lib/types'
import Link from 'next/link'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [brandDesigns, setBrandDesigns] = useState<BrandDesign[]>([])
  const [appCases, setAppCases] = useState<AppCase[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>('films_video')
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    fetchProjects()
    fetchBrandDesigns()
    fetchAppCases()
  }, [])

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

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects

  const filteredBrandDesigns = selectedCategory === 'brand_digital_design' || !selectedCategory
    ? brandDesigns
    : []

  const filteredAppCases = selectedCategory === 'brand_digital_design' || !selectedCategory
    ? appCases.filter((c) => c.category === 'brand_digital_design')
    : []

  // Combine all items and sort by display_order for Brand & Digital Design category
  const allItems = selectedCategory === 'brand_digital_design'
    ? [
        ...filteredProjects.map(p => ({ ...p, itemType: 'project' as const })),
        ...filteredBrandDesigns.map(b => ({ ...b, itemType: 'brand' as const })),
        ...filteredAppCases.map(c => ({ ...c, itemType: 'appcase' as const })),
      ].sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999))
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
      <header className="border-b border-gray-800 p-8 flex justify-between items-start">
        <Link href="/" className="hover:opacity-80 transition">
          <div>
            <h1 className="text-lg font-light tracking-widest text-white mb-1">SHARON MOSHE ATTIAS</h1>
            <h2 className="text-sm font-light tracking-widest text-gray-300">CREATIVE & DIRECTOR</h2>
          </div>
        </Link>
        <div className="text-2xl font-medium tracking-wide mr-20">Selected Work</div>
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

      {/* Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Menu Panel */}
      {menuOpen && (
        <nav className="fixed top-0 right-0 w-1/2 h-96 bg-black z-20 flex flex-col items-start justify-end px-16 pb-16 backdrop-blur animate-in slide-in-from-right duration-300">
          <div className="flex flex-col gap-3 text-2xl font-medium tracking-wide w-full">
            <a href="/" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Home
            </a>
            <a href="/about" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              About
            </a>
            <a href="/contact" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Contact
            </a>
            <a href="/admin" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Admin
            </a>
          </div>
        </nav>
      )}

      {/* Projects Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Categories */}
        <div className="mb-12 flex flex-wrap justify-center gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 transition ${
                selectedCategory === cat.value ? 'text-pink-500' : 'text-gray-300 hover:text-pink-500'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* All Projects, Brands & Cases - Conditional Grid */}
        <div className={`grid gap-6 ${
          selectedCategory === 'brand_digital_design'
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4'
        }`}>
          {/* Combined and sorted items */}
          {allItems.map((item) => {
            // Render project
            if (item.itemType === 'project') {
              const project = item as typeof item & { itemType: 'project' }
              // Large card for Brand & Digital Design
              if (selectedCategory === 'brand_digital_design') {
                return (
                  <div
                    key={`project-${project.id}`}
                    className="group cursor-pointer"
                    onClick={() => project.video_url && setSelectedProject(project)}
                  >
                    <div className="bg-gray-900/40 rounded-lg overflow-hidden space-y-0 h-full flex flex-col hover:bg-gray-900/60 transition cursor-pointer">
                      <div className="aspect-video bg-black overflow-hidden">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">No image</div>
                        )}
                      </div>
                      <div className="p-6 space-y-3 flex-1 flex flex-col">
                        {project.title && (
                          <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition">
                            {project.title}
                          </h3>
                        )}
                        {project.description && (
                          <p className="text-gray-300 text-sm leading-relaxed flex-1 line-clamp-4">
                            {project.description}
                          </p>
                        )}
                        <div className="pt-2">
                          <span className="inline-block px-4 py-2 border border-gray-700 text-sm rounded group-hover:border-white group-hover:text-white transition">
                            View Project →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              // Small card for other categories
              return (
                <div
                  key={`project-${project.id}`}
                  className="group cursor-pointer"
                  onClick={() => project.video_url && setSelectedProject(project)}
                >
                  <div className="relative overflow-hidden mb-4 bg-black aspect-square">
                    {project.image_url ? (
                      <>
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover opacity-10 group-hover:opacity-40 group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h3 className="text-base font-bold text-white text-center opacity-0 group-hover:opacity-100 transition duration-300 px-6">
                            {project.title}
                          </h3>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">No image</div>
                    )}
                  </div>
                </div>
              )
            }

            // Render brand design
            if (item.itemType === 'brand') {
              const design = item as typeof item & { itemType: 'brand' }
              // Large card for Brand & Digital Design
              if (selectedCategory === 'brand_digital_design') {
                return (
                  <Link key={`brand-${design.id}`} href={`/brand/${design.id}`}>
                    <div className="group cursor-pointer">
                      <div className="bg-gray-900/40 rounded-lg overflow-hidden space-y-0 h-full flex flex-col hover:bg-gray-900/60 transition">
                        <div className="aspect-video bg-gray-800 overflow-hidden flex items-center justify-center">
                          {design.cover_image_url ? (
                            <img
                              src={design.cover_image_url}
                              alt={design.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            />
                          ) : design.logo_url ? (
                            <img
                              src={design.logo_url}
                              alt={design.title}
                              className="w-2/3 h-2/3 object-contain group-hover:scale-110 transition duration-300"
                            />
                          ) : (
                            <div className="text-gray-600">No image</div>
                          )}
                        </div>
                        <div className="p-6 space-y-3 flex-1 flex flex-col">
                          {design.title && (
                            <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition">
                              {design.title}
                            </h3>
                          )}
                          {design.story && (
                            <p className="text-gray-300 text-sm leading-relaxed flex-1 line-clamp-4">
                              {design.story}
                            </p>
                          )}
                          <div className="pt-2">
                            <span className="inline-block px-4 py-2 border border-gray-700 text-sm rounded group-hover:border-white group-hover:text-white transition">
                              View Design →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              }

              // Small card for other categories
              return (
                <Link key={`brand-${design.id}`} href={`/brand/${design.id}`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden mb-4 bg-black aspect-square flex items-center justify-center">
                      {design.cover_image_url ? (
                        <>
                          <img
                            src={design.cover_image_url}
                            alt={design.title}
                            className="w-full h-full object-cover opacity-10 group-hover:opacity-40 group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-base font-bold text-white text-center opacity-0 group-hover:opacity-100 transition duration-300 px-6">
                              {design.title}
                            </h3>
                          </div>
                        </>
                      ) : design.logo_url ? (
                        <>
                          <img
                            src={design.logo_url}
                            alt={design.title}
                            className="w-2/3 h-2/3 object-contain opacity-10 group-hover:opacity-40 group-hover:scale-110 transition duration-300"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <h3 className="text-base font-bold text-white text-center opacity-0 group-hover:opacity-100 transition duration-300 px-6">
                              {design.title}
                            </h3>
                          </div>
                        </>
                      ) : (
                        <div className="text-gray-600">No image</div>
                      )}
                    </div>
                  </div>
                </Link>
              )
            }

            // Render app case study
            if (item.itemType === 'appcase') {
              const appCase = item as typeof item & { itemType: 'appcase' }
              return (
                <Link key={`case-${appCase.id}`} href={`/case-studies/${appCase.id}`}>
                  <div className="group cursor-pointer">
                    <div className="bg-gray-900/40 rounded-lg overflow-hidden space-y-0 h-full flex flex-col hover:bg-gray-900/60 transition">
                      {appCase.hero_image && (
                        <div className="aspect-video bg-gray-800 overflow-hidden">
                          <img
                            src={appCase.hero_image}
                            alt={appCase.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          />
                        </div>
                      )}

                      <div className="p-6 space-y-3 flex-1 flex flex-col">
                        {appCase.title && (
                          <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition line-clamp-2">
                            {appCase.title}
                          </h3>
                        )}

                        {appCase.subtitle && (
                          <p className="text-gray-400 text-sm">
                            {appCase.subtitle}
                          </p>
                        )}

                        {(appCase.year || appCase.role) && (
                          <p className="text-sm text-gray-500">
                            {appCase.year} {appCase.year && appCase.role ? '•' : ''} {appCase.role}
                          </p>
                        )}

                        {appCase.hero_description && (
                          <p className="text-gray-300 text-sm leading-relaxed flex-1 line-clamp-4">
                            {appCase.hero_description}
                          </p>
                        )}

                        <div className="pt-2">
                          <span className="inline-block px-4 py-2 border border-gray-700 text-sm rounded group-hover:border-white group-hover:text-white transition">
                            View Case Study →
                          </span>
                        </div>
                      </div>
                    </div>
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
