'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { About } from '@/lib/types'

// No animations
const fadeInWords = ``

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    try {
      const res = await fetch('/api/about', {
        cache: 'no-store', // Sempre busca dados frescos
      })
      const data = await res.json()
      console.log('📥 Fetched about data:', data)
      setAbout(data)
    } catch (error) {
      console.error('Failed to fetch about:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <style>{fadeInWords}</style>
      {/* Header */}
      <header className="border-b border-gray-800 p-8 flex justify-between items-start">
        <Link href="/" className="hover:opacity-80 transition">
          <div>
            <h1 className="text-lg font-light tracking-widest text-white mb-1">SHARON MOSHE ATTIAS</h1>
            <h2 className="text-sm font-light tracking-widest text-gray-300">CREATIVE & DIRECTOR</h2>
          </div>
        </Link>
        <div className="text-2xl font-medium tracking-wide mr-20">About</div>
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
            <a href="/projects" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Selected Work
            </a>
            <a href="/about" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              About
            </a>
            <button onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Contact
            </button>
            <a href="/admin" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Admin
            </a>
          </div>
        </nav>
      )}

      {/* Content */}
      <section className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Loading...</p>
          </div>
        ) : about ? (
          <div className="space-y-12">
            {/* Text Section - Centered */}
            <div className="flex justify-center">
              <div className="p-8 max-w-2xl">
                <p
                  className="text-gray-300 whitespace-pre-wrap about-text"
                  style={{
                    fontFamily:
                      about.textStyles?.main?.fontFamily === 'serif'
                        ? 'Georgia, serif'
                        : about.textStyles?.main?.fontFamily === 'sans'
                        ? 'Arial, sans-serif'
                        : 'Courier New, monospace',
                    fontSize: `${about.textStyles?.main?.fontSize || 16}px`,
                    lineHeight: `${about.textStyles?.main?.lineHeight || 1.6}em`,
                    fontWeight: about.textStyles?.main?.bold ? 'bold' : 'normal',
                    textAlign: (about.textStyles?.main?.alignment || 'center') as any,
                  }}
                >
                  {about.text}
                </p>
              </div>
            </div>

            {/* Images Section - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {about.image1_url && (
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-900">
                  <img
                    src={about.image1_url}
                    alt="About Image 1"
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              )}
              {about.image2_url && (
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-900">
                  <img
                    src={about.image2_url}
                    alt="About Image 2"
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 py-16">
            <p>No about page content yet. Visit admin to add it.</p>
          </div>
        )}
      </section>

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
