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
      let res = await fetch(`/api/case-studies/${id}`)
      let data = await res.json()

      if (!data || !data.id) {
        res = await fetch(`/api/app-cases/${id}`)
        data = await res.json()
      }

      if (data && data.id) {
        setCaseStudy(data)
      } else {
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

      {/* HERO SECTION */}
      <section className="relative flex items-center overflow-hidden w-screen -mx-[calc((100vw-100%)/2)]" style={{ height: '800px' }}>
        {/* Background Image with Gradient Overlay */}
        {caseStudy.hero_image && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${caseStudy.hero_image})`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          </>
        )}

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 lg:px-20">
          <div className="max-w-2xl">
            {/* Project Label */}
            <div className="mb-4 text-xs tracking-widest uppercase text-gray-400">
              {caseStudy.format || 'Short Film'}
            </div>

            {/* Title */}
            <h1 className="text-5xl lg:text-6xl font-light mb-4 leading-tight">{caseStudy.title}</h1>

            {/* Subtitle */}
            {caseStudy.subtitle && (
              <p className="text-lg text-gray-300 mb-4">{caseStudy.subtitle}</p>
            )}

            {/* Description */}
            <p className="text-base text-gray-300 leading-relaxed mb-8 max-w-lg">{caseStudy.hero_description}</p>

            {/* Watch Film CTA */}
            {(caseStudy.watch_film_link || caseStudy.video_file) && (
              <a
                href={caseStudy.watch_film_link || '#'}
                {...(caseStudy.watch_film_link ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={caseStudy.video_file && !caseStudy.watch_film_link ? (e) => { e.preventDefault(); } : undefined}
                className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition text-sm tracking-widest uppercase"
              >
                Watch Film
                <span className="text-lg">→</span>
              </a>
            )}
          </div>
        </div>

        {/* Play Button (if video URL or file exists) */}
        {(caseStudy.watch_film_link || caseStudy.video_file) && (
          <a
            href={caseStudy.watch_film_link || '#'}
            {...(caseStudy.watch_film_link ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="absolute inset-0 flex items-center justify-center group z-20 hover:bg-black/20 transition"
          >
            <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center group-hover:scale-110 transition">
              <span className="text-white text-xl ml-1">▶</span>
            </div>
          </a>
        )}
      </section>

      {/* PROJECT META GRID */}
      <section className="border-b border-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {caseStudy.client && (
              <div>
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Client</p>
                <p className="text-lg text-white">{caseStudy.client}</p>
              </div>
            )}
            {caseStudy.role && (
              <div>
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Role</p>
                <p className="text-lg text-white">{caseStudy.role}</p>
              </div>
            )}
            {caseStudy.year && (
              <div>
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Year</p>
                <p className="text-lg text-white">{caseStudy.year}</p>
              </div>
            )}
            {caseStudy.duration && (
              <div>
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Duration</p>
                <p className="text-lg text-white">{caseStudy.duration}</p>
              </div>
            )}
            {caseStudy.format && (
              <div>
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Format</p>
                <p className="text-lg text-white">{caseStudy.format}</p>
              </div>
            )}
            {caseStudy.category && (
              <div>
                <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">Category</p>
                <p className="text-lg text-white capitalize">{caseStudy.category.replace(/_/g, ' ')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CASE STUDY SECTIONS */}
      {caseStudy.problem && <CaseSection section={caseStudy.problem} label="THE BRIEF" number={1} accentColor={accentColor} />}
      {caseStudy.insight && <CaseSection section={caseStudy.insight} label="THE CHALLENGE" number={2} accentColor={accentColor} />}
      {caseStudy.approach && <CaseSection section={caseStudy.approach} label="CREATIVE CONCEPT" number={3} accentColor={accentColor} />}
      {caseStudy.interaction && <CaseSection section={caseStudy.interaction} label="VISUAL LANGUAGE" number={4} accentColor={accentColor} />}

      {/* IMAGE GALLERY */}
      {caseStudy.gallery_images && caseStudy.gallery_images.length > 0 && (
        <section className="py-12 px-6 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.gallery_images.map((img, idx) => (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-lg bg-gray-900 ${idx === 0 ? 'md:col-span-2' : ''}`}
                  style={{ aspectRatio: idx === 0 ? '16/9' : '1/1' }}
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS SECTION */}
      {caseStudy.process_blocks && caseStudy.process_blocks.length > 0 && (
        <section className="py-12 px-6 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-light mb-12" style={{ color: accentColor }}>
              PROCESS
            </h2>
            <div className="space-y-12">
              {caseStudy.process_blocks.map((block, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="text-5xl font-light text-gray-600 mb-4">{String(block.number).padStart(2, '0')}</div>
                    <h3 className="text-2xl font-light mb-4 text-white">{block.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{block.description}</p>
                  </div>
                  {block.image && (
                    <div className="aspect-video overflow-hidden rounded-lg bg-gray-900">
                      <img src={block.image} alt={block.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MY ROLE SECTION */}
      {caseStudy.my_role_title && (
        <section className="py-12 px-6 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-light mb-6" style={{ color: accentColor }}>
              MY ROLE
            </h2>
            <h3 className="text-2xl font-light mb-6 text-white">{caseStudy.my_role_title}</h3>
            <p className="text-gray-300 leading-relaxed max-w-2xl">{caseStudy.my_role_description}</p>
          </div>
        </section>
      )}

      {/* OUTCOME SECTION */}
      {caseStudy.outcome && (
        <section className="py-12 px-6 bg-gray-950 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-light mb-6" style={{ color: accentColor }}>
              OUTCOME
            </h2>
            {caseStudy.outcome.title && <h3 className="text-2xl font-light mb-6 text-white">{caseStudy.outcome.title}</h3>}
            {caseStudy.outcome.description && (
              <p className="text-gray-300 leading-relaxed max-w-2xl whitespace-pre-wrap">{caseStudy.outcome.description}</p>
            )}
          </div>
        </section>
      )}

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

function CaseSection({
  section,
  label,
  number,
  accentColor,
}: {
  section: any
  label: string
  number: number
  accentColor: string
}) {
  if (!section) return null

  const numberFormatted = String(number).padStart(2, '0')

  return (
    <section className="border-b border-gray-800">
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            {/* Text Content */}
            <div className="pl-0 pr-8 border-r-2 border-gray-700 h-full flex flex-col py-6 max-w-sm">
              <div className="mb-1 text-xs tracking-widest text-gray-500 uppercase">{numberFormatted}</div>
              <h2 className="text-3xl font-light mb-3" style={{ color: accentColor }}>
                {label}
              </h2>
              {section.title && <h3 className="text-xl font-light mb-3 text-white">{section.title}</h3>}
              {section.description && <p className="text-gray-300 text-base leading-tight whitespace-pre-wrap">{section.description}</p>}
            </div>

            {/* Images */}
            {section.images && section.images.length > 0 && (
              <div className={`-mx-6 -my-12 pl-6 flex flex-col ${section.images.length === 1 ? 'space-y-0' : 'grid grid-cols-2 gap-1'}`} style={{ backgroundColor: section.images.length > 1 ? '#000000' : 'transparent' }}>
                {section.images.map((img: string, idx: number) => (
                  <div key={idx} className={`overflow-hidden bg-gray-900 ${section.images.length === 1 ? 'flex-1' : 'aspect-square'}`}>
                    <img src={img} alt={`${label} ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
