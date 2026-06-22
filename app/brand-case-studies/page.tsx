'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BrandCaseStudy } from '@/lib/types'

export default function BrandCaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState<BrandCaseStudy[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    fetchCaseStudies()
  }, [])

  const fetchCaseStudies = async () => {
    try {
      const res = await fetch('/api/brand-case-studies')
      const data = await res.json()
      console.log('📊 Fetched case studies:', data.length, 'items')
      console.log('Featured studies:', data.filter((cs: BrandCaseStudy) => cs.category === 'featured').map((cs: BrandCaseStudy) => cs.title))
      setCaseStudies(data || [])
    } catch (error) {
      console.error('Error fetching case studies:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['featured', 'brand_design', 'ai_experiments', 'currently_exploring']
  const categoryLabels: { [key: string]: string } = {
    featured: 'Featured',
    brand_design: 'Brand Design',
    ai_experiments: 'AI Experiments',
    currently_exploring: 'Currently Exploring'
  }

  const filteredStudies = selectedCategory
    ? caseStudies.filter(cs => cs.category === selectedCategory)
    : caseStudies

  if (loading) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 lg:px-20 py-8 flex justify-between items-center">
        <Link href="/" className="hover:opacity-70 transition">
          <h1 className="text-2xl font-light tracking-widest">SHARON MOSHE ATTIAS</h1>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-1 w-6 h-6 justify-center items-center cursor-pointer hover:opacity-70 transition"
        >
          <span className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-black transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-10 bg-white/40 backdrop-blur"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="fixed top-0 right-0 w-full sm:w-1/2 h-screen z-20 flex flex-col items-start justify-end px-8 sm:px-16 pb-16 bg-white border-l border-gray-200">
            <div className="flex flex-col gap-4 w-full">
              <a href="/" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-6xl font-light text-black hover:opacity-70 transition text-left uppercase">
                Home
              </a>
              <a href="/projects" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-6xl font-light text-black hover:opacity-70 transition text-left uppercase">
                Work
              </a>
              <a href="/about" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-6xl font-light text-black hover:opacity-70 transition text-left uppercase">
                About
              </a>
              <a href="/contact" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-6xl font-light text-black hover:opacity-70 transition text-left uppercase">
                Contact
              </a>
            </div>
          </nav>
        </>
      )}

      {/* Page Title */}
      <div className="px-8 lg:px-20 py-16 border-b border-gray-200">
        <h1 className="text-5xl lg:text-6xl font-light mb-4">Brand Case Studies</h1>
        <p className="text-gray-600 text-lg">Design systems and branding projects</p>
      </div>

      {/* Category Filter */}
      <div className="px-8 lg:px-20 py-8 border-b border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg transition ${
              selectedCategory === null
                ? 'bg-black text-white'
                : 'border border-gray-300 text-gray-700 hover:border-black'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'border border-gray-300 text-gray-700 hover:border-black'
              }`}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Case Studies Grid */}
      <div className="px-8 lg:px-20 py-16">
        {filteredStudies.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No case studies in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudies.map((study) => (
              <Link key={study.id} href={`/brand-case-studies/${study.id}`}>
                <div className="group cursor-pointer">
                  {study.hero_image && (
                    <div className="relative overflow-hidden rounded-lg bg-gray-200 mb-4 aspect-video">
                      <img
                        src={study.hero_image}
                        alt={study.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-light mb-2 text-black group-hover:text-gray-700 transition">
                    {study.title}
                  </h3>
                  {study.subtitle && (
                    <p className="text-gray-600 mb-3">{study.subtitle}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{study.year}</span>
                    {study.category && (
                      <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded">
                        {categoryLabels[study.category] || study.category}
                      </span>
                    )}
                  </div>

                  {study.color_palette && study.color_palette.length > 0 && (
                    <div className="flex gap-1 mt-3">
                      {study.color_palette.slice(0, 4).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-8 lg:px-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm text-gray-600">
          <div className="flex gap-4">
            <a href="https://www.instagram.com/sharon.attias/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">
              Instagram
            </a>
            <a href="https://www.youtube.com/@sharonattias7274" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">
              YouTube
            </a>
          </div>
          <p>© 2026 Sharon Moshe Attias</p>
        </div>
      </footer>
    </div>
  )
}
