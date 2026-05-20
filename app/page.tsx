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
          <div key={video.id}>
            <HeroSection
              video={video}
              showHeader={index === 0}
              menuOpen={menuOpen}
              onMenuToggle={setMenuOpen}
            />
            {index < heroVideos.length - 1 && (
              <div className="h-1 bg-black border-t border-b border-gray-900" />
            )}
          </div>
        ))}
      </div>

      {/* Menu Overlay - Fixed positioning across entire page */}
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
            <a href="/projects" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Selected Work
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

      {/* Projects Header */}
      {heroVideos.length === 0 && (
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
    </div>
  )
}
