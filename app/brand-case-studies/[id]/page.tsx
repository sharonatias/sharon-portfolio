'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BrandCaseStudy } from '@/lib/types'
import HoverGridSection from '@/components/HoverGridSection'

const SECTION_LABELS: Record<string, string> = {
  idea: 'Idea',
  system: 'System',
  shape: 'Shape',
  motion: 'Motion',
  applications: 'Applications',
  color: 'Color',
  type: 'Type',
}

const DEFAULT_ORDER = ['idea', 'system', 'shape', 'motion', 'applications', 'color', 'type']

type ImageItem = string | { url: string }

const imageUrl = (img: ImageItem) => (typeof img === 'string' ? img : img.url)

const isLightColor = (color?: string) => {
  if (!color) return true
  const c = color.toLowerCase()
  return c === '#ffffff' || c === '#fff' || c === 'white' || c === '#f3f4f6' || c === '#fafafa'
}

function Header({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  // mix-blend-difference keeps the header readable on both the dark hero and the white pages.
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 lg:px-20 py-6 pointer-events-none">
      <Link href="/" className="pointer-events-auto text-sm sm:text-base tracking-[0.25em] font-light text-white mix-blend-difference hover:opacity-70 transition">
        SHARON MOSHE ATTIAS
      </Link>
      <button onClick={onMenu} aria-label="Toggle menu" aria-expanded={menuOpen} className="pointer-events-auto flex flex-col gap-1.5 w-8 h-8 justify-center items-center">
        <span className={`block w-7 h-0.5 bg-white mix-blend-difference transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-7 h-0.5 bg-white mix-blend-difference transition-all ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-7 h-0.5 bg-white mix-blend-difference transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>
    </header>
  )
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/projects', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]
  return (
    <div className="fixed inset-0 z-30 bg-black/95 flex flex-col justify-center px-8 sm:px-20 gap-4">
      {links.map((l) => (
        <a key={l.href} href={l.href} onClick={onClose} className="text-5xl sm:text-7xl font-light uppercase text-white hover:opacity-60 transition">
          {l.label}
        </a>
      ))}
    </div>
  )
}

export default function BrandCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const [caseStudy, setCaseStudy] = useState<any | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [nextProject, setNextProject] = useState<BrandCaseStudy | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hoveredColorIdx, setHoveredColorIdx] = useState<number | null>(null)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const res = await fetch(`/api/brand-case-studies/${id}`)
        const data = await res.json()
        if (data && data.id) {
          setCaseStudy(data)
          try {
            const allRes = await fetch('/api/brand-case-studies')
            const all = await allRes.json()
            if (Array.isArray(all) && all.length > 1) {
              const i = all.findIndex((cs: any) => cs.id === data.id)
              if (i !== -1) setNextProject(all[(i + 1) % all.length])
            }
          } catch (err) {
            console.error('Failed to load related case studies:', err)
          }
        } else {
          setCaseStudy(null)
        }
      } catch (error) {
        console.error('Failed to load case study:', error)
        setCaseStudy(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    )
  }

  if (!caseStudy) {
    return (
      <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Case study not found</p>
        <a href="/projects" className="underline">Back to Work</a>
      </div>
    )
  }

  const palette: string[] = caseStudy.color_palette || []
  const heroIsVideo = !!caseStudy.hero_video
  const sectionsOrder: string[] = caseStudy.sections_order || DEFAULT_ORDER
  const mainText: string | undefined = caseStudy.main_text

  const renderSection = (sectionKey: string, index: number) => {
    let section: any
    if (sectionKey.startsWith('custom_') || sectionKey.startsWith('premium_')) {
      section = (caseStudy.custom_sections || []).find((s: any) => s.id === sectionKey)
    } else {
      section = caseStudy[sectionKey]
    }
    if (!section || section.isDeleted) return null

    const images: ImageItem[] = section.images || []
    const hasImages = images.length > 0
    const isCustom = sectionKey.startsWith('custom_') || sectionKey.startsWith('premium_')

    // Hover-grid custom layout
    if (isCustom && section.imageLayout === 'hover-grid') {
      return <HoverGridSection key={sectionKey} title={section.title || ''} images={section.images || []} gap={4} />
    }

    // Custom sections: optional background colour or image
    if (isCustom) {
      const bgColor: string = section.backgroundColor || '#ffffff'
      const bgImage: string | undefined = section.backgroundImage
      const dark = !!bgImage || !isLightColor(bgColor)
      const ink = dark ? 'text-white' : 'text-black'
      const muted = dark ? 'text-gray-300' : 'text-gray-600'
      return (
        <section
          key={sectionKey}
          className={`relative px-6 sm:px-10 lg:px-20 py-20 lg:py-28 ${ink}`}
          style={bgImage ? { backgroundImage: `url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : { backgroundColor: bgColor }}
        >
          {bgImage && <div className="absolute inset-0 bg-black/60" />}
          <div className="relative max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className={hasImages ? 'lg:col-span-5' : 'lg:col-span-8'}>
              {section.subtitle && <p className={`text-xs tracking-[0.25em] uppercase mb-4 ${muted}`}>{section.subtitle}</p>}
              {section.title && <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-6">{section.title}</h2>}
              {section.description && (
                <div className={`text-base lg:text-lg leading-relaxed font-light space-y-4 ${muted}`}>
                  {section.description.split('\n').filter((p: string) => p.trim()).map((p: string, i: number) => <p key={i}>{p}</p>)}
                </div>
              )}
            </div>
            {hasImages && (
              <div className="lg:col-span-7 grid grid-cols-2 gap-4">
                {images.map((img, i) => (
                  <img key={i} src={imageUrl(img)} alt={`${section.title || 'Section'} ${i + 1}`} className="w-full h-auto object-cover rounded-md" loading="lazy" />
                ))}
              </div>
            )}
          </div>
        </section>
      )
    }

    // Standard design-system sections
    const label = SECTION_LABELS[sectionKey] || sectionKey
    const isApplications = sectionKey === 'applications'
    const isFullWidth = isApplications || images.length === 2 || sectionKey === 'idea' || sectionKey === 'system'
    const imageRight = index % 2 === 1
    const cols = images.length === 1 ? 1 : images.length === 2 ? 2 : 3

    const textBlock = (
      <div className={isFullWidth ? 'max-w-3xl' : ''}>
        <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">{label}</p>
        {section.title && <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light leading-tight mb-6 text-black">{section.title}</h2>}
        {section.description && (
          <div className="text-base lg:text-lg leading-relaxed font-light text-gray-700 space-y-4">
            {section.description.split('\n').filter((p: string) => p.trim()).map((p: string, i: number) => <p key={i}>{p}</p>)}
          </div>
        )}
        {sectionKey === 'motion' && section.video && (
          <div className="mt-8 aspect-video bg-gray-900 rounded-md overflow-hidden">
            <video className="w-full h-full object-cover" autoPlay muted loop controls playsInline>
              <source src={section.video} type="video/mp4" />
            </video>
          </div>
        )}
      </div>
    )

    if (isFullWidth) {
      return (
        <section key={sectionKey} className={`px-6 sm:px-10 lg:px-20 py-20 lg:py-28 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
          <div className="max-w-7xl mx-auto">
            {textBlock}
            {hasImages && (
              <div className={`mt-12 grid gap-4 sm:gap-6 ${cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                {images.map((img, i) => (
                  <img key={i} src={imageUrl(img)} alt={`${label} ${i + 1}`} className="w-full h-auto object-cover rounded-md" loading="lazy" />
                ))}
              </div>
            )}
          </div>
        </section>
      )
    }

    return (
      <section key={sectionKey} className={`px-6 sm:px-10 lg:px-20 py-20 lg:py-28 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className={`lg:col-span-5 ${imageRight ? 'lg:order-2' : ''}`}>{textBlock}</div>
          {hasImages && (
            <div className={`lg:col-span-7 ${imageRight ? 'lg:order-1' : ''}`}>
              <div className="grid grid-cols-2 gap-4">
                {images.map((img, i) => (
                  <img key={i} src={imageUrl(img)} alt={`${label} ${i + 1}`} className="w-full h-auto object-cover rounded-md" loading="lazy" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <div className="bg-white text-black overflow-x-hidden">
      <Header onMenu={() => setMenuOpen(!menuOpen)} menuOpen={menuOpen} />
      {menuOpen && <MenuOverlay onClose={() => setMenuOpen(false)} />}

      {/* Hero */}
      <section className="relative h-[92vh] min-h-[560px] w-full overflow-hidden flex items-end bg-black">
        {heroIsVideo ? (
          <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
            <source src={caseStudy.hero_video} type="video/mp4" />
          </video>
        ) : caseStudy.hero_image ? (
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${caseStudy.hero_image})` }} />
        ) : null}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative z-10 w-full px-6 sm:px-10 lg:px-20 pb-16 lg:pb-24 text-white">
          <div className="flex flex-wrap gap-2 mb-6">
            {caseStudy.category && (
              <span className="px-3 py-1 text-xs tracking-widest uppercase border border-white/70 bg-black/30 backdrop-blur-sm">
                {String(caseStudy.category).replace(/_/g, ' ')}
              </span>
            )}
            {caseStudy.year && <span className="px-3 py-1 text-xs tracking-widest border border-white/70 bg-black/30 backdrop-blur-sm">{caseStudy.year}</span>}
            {caseStudy.client && <span className="px-3 py-1 text-xs tracking-widest border border-white/70 bg-black/30 backdrop-blur-sm">{caseStudy.client}</span>}
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light leading-none mb-5">{caseStudy.title}</h1>
          {caseStudy.subtitle && <p className="text-lg sm:text-2xl font-light mb-4">{caseStudy.subtitle}</p>}
          {caseStudy.hero_description && <p className="max-w-2xl text-sm sm:text-base text-gray-200 leading-relaxed font-light">{caseStudy.hero_description}</p>}
        </div>
      </section>

      {/* Meta */}
      <section className="px-6 sm:px-10 lg:px-20 py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {caseStudy.year && (
            <div><p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-2">Year</p><p className="text-lg font-light">{caseStudy.year}</p></div>
          )}
          {caseStudy.client && (
            <div><p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-2">Client</p><p className="text-lg font-light">{caseStudy.client}</p></div>
          )}
          {caseStudy.role && (
            <div><p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-2">Role</p><p className="text-lg font-light">{caseStudy.role}</p></div>
          )}
          {palette.length > 0 && (
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-2">Palette</p>
              <div className="flex gap-2">
                {palette.slice(0, 5).map((c, i) => <span key={i} className="w-6 h-6 rounded-full border border-gray-300" style={{ backgroundColor: c }} title={c} />)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Intro */}
      {caseStudy.central_description && (
        <section className="px-6 sm:px-10 lg:px-20 py-20 lg:py-28">
          <p className="max-w-4xl mx-auto text-2xl sm:text-3xl lg:text-4xl leading-snug font-light text-gray-900">
            {String(caseStudy.central_description).replace(/\s+/g, ' ')}
          </p>
        </section>
      )}

      {/* Leader / CTO */}
      {caseStudy.cto && (mainText || caseStudy.cto.description) && (
        <section className="px-6 sm:px-10 lg:px-20 py-20 lg:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {caseStudy.cto.image && (
              <div className="lg:col-span-5">
                <img src={caseStudy.cto.image} alt={caseStudy.cto.name} className="w-full h-auto object-cover rounded-md" loading="lazy" />
              </div>
            )}
            <div className={caseStudy.cto.image ? 'lg:col-span-7' : 'lg:col-span-12'}>
              {caseStudy.cto.name && <h2 className="text-3xl sm:text-4xl font-light mb-2">{caseStudy.cto.name}</h2>}
              {caseStudy.cto.title && <p className="text-lg text-gray-600 font-light mb-8">{caseStudy.cto.title}</p>}
              <div className="text-base lg:text-lg leading-relaxed font-light text-gray-800 space-y-4">
                {String(mainText || caseStudy.cto.description).split('\n').filter((p) => p.trim()).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Palette */}
      {palette.length > 0 && (
        <section className="px-6 sm:px-10 lg:px-20 py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3">Palette</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light mb-12">Color</h2>
            <div className="flex flex-wrap gap-6">
              {palette.map((color, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-start gap-3"
                  onMouseEnter={() => setHoveredColorIdx(idx)}
                  onMouseLeave={() => setHoveredColorIdx(null)}
                >
                  <div
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-md transition-transform duration-300"
                    style={{ backgroundColor: color, transform: hoveredColorIdx === idx ? 'scale(1.04)' : 'scale(1)' }}
                  />
                  <span className="text-xs font-mono text-gray-700">{color}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Design-system sections */}
      {sectionsOrder.map((key, idx) => renderSection(key, idx))}

      {/* Next project */}
      {nextProject && (
        <section className="px-6 sm:px-10 lg:px-20 py-20 lg:py-28 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-8">Next project</p>
            <Link href={`/brand-case-studies/${nextProject.id}`} className="group grid lg:grid-cols-12 gap-8 items-center">
              {nextProject.hero_image && (
                <div className="lg:col-span-8 overflow-hidden rounded-md bg-gray-200 h-64 sm:h-96">
                  <img src={nextProject.hero_image} alt={nextProject.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
              )}
              <div className="lg:col-span-4">
                <h3 className="text-3xl sm:text-4xl font-light mb-3 group-hover:opacity-70 transition">{nextProject.title}</h3>
                {nextProject.subtitle && <p className="text-gray-600 font-light mb-4 line-clamp-2">{nextProject.subtitle}</p>}
                <span className="text-sm underline underline-offset-4">View project →</span>
              </div>
            </Link>
          </div>
        </section>
      )}

      <footer className="px-6 sm:px-10 lg:px-20 py-10 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 font-light">
          <div className="flex gap-6">
            <a href="https://www.instagram.com/sharon.attias/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">Instagram</a>
            <a href="https://www.youtube.com/@sharonattias7274" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">YouTube</a>
          </div>
          <p>© 2026 Sharon Moshe Attias</p>
        </div>
      </footer>
    </div>
  )
}
