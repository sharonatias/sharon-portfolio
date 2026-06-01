'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AppCase } from '@/lib/types'

export default function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const [caseStudy, setCaseStudy] = useState<AppCase | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    fetchCaseStudy()
  }, [id])

  const fetchCaseStudy = async () => {
    try {
      // Try video case studies first
      let res = await fetch(`/api/case-studies/${id}`)
      let data = await res.json()

      // If not found, try app cases
      if (!data || !data.id) {
        res = await fetch(`/api/app-cases/${id}`)
        data = await res.json()
      }

      console.log('Fetched case study:', data)

      // Check if data is valid
      if (data && data.id) {
        setCaseStudy(data)
      } else {
        console.error('Invalid case study data:', data)
        setCaseStudy(null)
      }
    } catch (error) {
      console.error('Failed to fetch case study:', error)
      setCaseStudy(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!caseStudy) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">Case study not found</p>
        <a href="/projects" className="text-blue-400 hover:text-blue-300">
          ← Back to Projects
        </a>
      </div>
    )
  }

  const accentColor = caseStudy.brand_color || '#000000'

  const CaseSection = ({ section, label }: { section: any; label: string }) => {
    // Safety check: if section is undefined or doesn't have required properties, don't render
    if (!section) return null

    return (
      <section className="py-20 px-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Text */}
            <div className="flex-1">
              <h2
                className="text-4xl font-bold mb-6"
                style={{ color: accentColor }}
              >
                {label}
              </h2>
              {section.title && (
                <h3 className="text-2xl font-light mb-6 text-white">{section.title}</h3>
              )}
              {section.description && (
                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                  {section.description}
                </p>
              )}
            </div>

            {/* Images */}
            {section.images && section.images.length > 0 && (
              <div className="flex-1">
                <div className="space-y-6">
                  {section.images.map((img: string, idx: number) => (
                    <div key={idx} className="aspect-video overflow-hidden rounded-lg bg-gray-900">
                      <img
                        src={img}
                        alt={`${label} ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-800 p-8 flex justify-between items-start">
        <Link href="/projects" className="hover:opacity-80 transition">
          <div>
            <h1 className="text-lg font-light tracking-widest text-white mb-1">SHARON MOSHE ATTIAS</h1>
            <h2 className="text-sm font-light tracking-widest text-gray-300">CREATIVE & DIRECTOR</h2>
          </div>
        </Link>
        <div className="text-sm text-gray-400">← Back</div>
      </header>

      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-6 right-6 flex flex-col gap-2 w-8 h-8 justify-center items-center cursor-pointer hover:opacity-70 transition z-50 bg-transparent"
      >
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
      </button>

      {/* Menu */}
      {menuOpen && (
        <>
          <div className="fixed inset-0 z-20 bg-black/30" onClick={() => setMenuOpen(false)} />
          <nav className="fixed top-0 right-0 w-1/2 h-96 bg-black z-20 flex flex-col items-start justify-end px-16 pb-16 backdrop-blur">
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
            </div>
          </nav>
        </>
      )}

      {/* Hero */}
      <section className="min-h-screen flex items-center pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <p className="text-sm tracking-widest text-gray-400 mb-6 uppercase">{caseStudy.year} • {caseStudy.role}</p>
              <h1 className="text-5xl lg:text-6xl font-light mb-6 leading-tight">{caseStudy.title}</h1>
              <p className="text-xl text-gray-300 leading-relaxed">{caseStudy.subtitle}</p>
              <p className="text-gray-400 mt-8 text-lg">{caseStudy.hero_description}</p>
            </div>

            {/* Hero Image */}
            {caseStudy.hero_image && (
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-900">
                <img
                  src={caseStudy.hero_image}
                  alt={caseStudy.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Case Sections */}
      <CaseSection section={caseStudy.problem} label="THE CHALLENGE" />
      <CaseSection section={caseStudy.insight} label="THE INSIGHT" />
      <CaseSection section={caseStudy.approach} label="OUR APPROACH" />
      <CaseSection section={caseStudy.flow} label="USER EXPERIENCE FLOW" />
      <CaseSection section={caseStudy.interaction} label="KEY INTERACTION" />
      <CaseSection section={caseStudy.outcome} label="OUTCOME" />

      {/* Footer */}
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
