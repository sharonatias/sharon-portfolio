'use client'

import { useState, useEffect } from 'react'
import { Project, HeroVideo, CATEGORIES } from '@/lib/types'
import Link from 'next/link'
import HeroSection from '@/components/HeroSection'

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [heroLoaded, setHeroLoaded] = useState(false)

  useEffect(() => {
    fetchHeroVideos()
    fetchProjects()
  }, [])

  const fetchHeroVideos = async () => {
    try {
      const res = await fetch('/api/hero')
      const data = await res.json()
      if (data && data.length > 0) {
        setHeroVideos(data)
      }
    } catch (error) {
      console.error('Failed to fetch hero videos:', error)
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

  const filteredProjects = selectedCategory
    ? projects.filter((p) => p.category === selectedCategory)
    : projects

  return (
    <div className="bg-black text-white min-h-screen flex flex-col" suppressHydrationWarning>
      {/* Hero Videos */}
      <div className="flex-1">
        {heroVideos.map((video, index) => (
          <div
            key={video.id}
            style={{
              filter: menuOpen && index !== 0 ? 'blur(10px)' : 'none',
              transition: 'filter 0.3s ease-out'
            }}
          >
            <HeroSection
              video={video}
              showHeader={index === 0}
              menuOpen={menuOpen}
              onMenuToggle={setMenuOpen}
              onVideoLoaded={() => setHeroLoaded(true)}
            />
            {index < heroVideos.length - 1 && (
              <div className="h-1 bg-black border-t border-b border-gray-900" />
            )}
          </div>
        ))}
      </div>

      {/* Menu Overlay - Fixed positioning across entire page */}
      {/* Blur Overlay */}
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

      {/* Stats Section - Only show after hero loads */}
      {heroLoaded && (
      <section className="bg-black">
        <div className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-56">
            <div className="text-center">
              <div className="text-6xl lg:text-7xl font-light tracking-tighter text-white">10+</div>
              <h3 className="text-sm lg:text-base tracking-widest text-gray-300 font-light mt-4" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>YEARS EXPERIENCE</h3>
            </div>
            <div className="text-center">
              <div className="text-6xl lg:text-7xl font-light tracking-tighter text-white">50+</div>
              <h3 className="text-sm lg:text-base tracking-widest text-gray-300 font-light mt-4" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>PROJECTS DELIVERED</h3>
            </div>
            <div className="text-center">
              <div className="text-6xl lg:text-7xl font-light tracking-tighter text-white">8+</div>
              <h3 className="text-sm lg:text-base tracking-widest text-gray-300 font-light mt-4" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>YEARS IN PRODUCTION</h3>
            </div>
            <div className="text-center">
              <div className="text-6xl lg:text-7xl font-light tracking-tighter text-white">3</div>
              <h3 className="text-sm lg:text-base tracking-widest text-gray-300 font-light mt-4" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>CREATIVE DISCIPLINES</h3>
              <p className="text-sm text-gray-400 mt-0">FILM • DESIGN • AI</p>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* Currently Exploring Section */}
      {heroLoaded && (
      <section className="bg-black border-b border-gray-800">
        <div className="max-w-full mx-auto px-12 lg:px-24 pt-4 pb-24">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-4xl lg:text-5xl font-light tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, wordSpacing: '0.15em', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
              CURRENTLY EXPLORING
            </h3>
            <span className="text-xs tracking-widest text-gray-400" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
              VIEW ALL EXPERIMENTS →
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {[
              { title: 'GENESIS', subtitle: 'AI CINEMATIC UNIVERSE', image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop' },
              { title: 'MIRI', subtitle: 'AI PLATFORM FOR EDUCATORS', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop' },
              { title: 'RED CAMERA', subtitle: 'SHORT FILM IN DEVELOPMENT', image: 'https://images.unsplash.com/photo-1533390523327-130207cee930?w=800&h=600&fit=crop' }
            ].map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gray-900" style={{ aspectRatio: '4 / 3' }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h4 className="text-lg lg:text-xl font-bold mb-1" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
                      {item.title}
                    </h4>
                    <p className="text-xs lg:text-sm text-gray-300" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 300 }}>
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Featured Work Section */}
      {heroLoaded && (
      <section className="bg-black border-b border-gray-800">
        <div className="max-w-full mx-auto px-12 lg:px-24 pt-4 pb-24">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-4xl lg:text-5xl font-light tracking-tight" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, wordSpacing: '0.15em' }}>
              FEATURED WORK
            </h3>
            <Link href="/projects" className="text-xs tracking-widest hover:opacity-70 transition" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
              VIEW ALL PROJECTS →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            {projects.slice(0, 3).map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg bg-gray-900" style={{ aspectRatio: '4 / 3' }}>
                    {project.image_url ? (
                      <>
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h4 className="text-lg lg:text-xl font-bold" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>
                            {project.title}
                          </h4>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 bg-black">No image</div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Projects Header */}
      {heroLoaded && heroVideos.length === 0 && (
        <header className="border-b border-gray-800 p-6" suppressHydrationWarning>
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="hover:opacity-80 transition">
              <h1 className="text-xl font-bold">
                SHARON MOSHE ATTIAS
                <br />
                CREATIVE & DIRECTOR
              </h1>
            </Link>
            <Link href="/admin" className="text-pink-500 hover:text-pink-400">
              Admin
            </Link>
          </div>
        </header>
      )}

      {/* Footer - Always at bottom */}
      {heroLoaded && (
      <footer className="border-t border-gray-800 p-6">
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
      )}
    </div>
  )
}
