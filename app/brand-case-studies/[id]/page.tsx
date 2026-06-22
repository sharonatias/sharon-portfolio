'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { BrandCaseStudy } from '@/lib/types'

const SECTION_LABELS: { [key: string]: string } = {
  idea: 'Idea',
  system: 'System',
  shape: 'Shape',
  motion: 'Motion',
  applications: 'Applications',
  color: 'Color',
  type: 'Type'
}

export default function BrandCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const [caseStudy, setCaseStudy] = useState<BrandCaseStudy | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [nextProject, setNextProject] = useState<BrandCaseStudy | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [visibleImages, setVisibleImages] = useState<Set<string>>(new Set())
  const [hoveredColorIdx, setHoveredColorIdx] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(typeof window !== 'undefined' && window.innerWidth < 640)
  }, [])

  useEffect(() => {
    params.then((p) => {
      setId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (!id) return
    fetchCaseStudy()
  }, [id])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleImages(prev => new Set([...prev, entry.target.id]))
        }
      })
    }, { threshold: 0.1 })

    document.querySelectorAll('[data-image-id]').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [caseStudy])

  const fetchCaseStudy = async () => {
    try {
      const res = await fetch(`/api/brand-case-studies/${id}`)
      const data = await res.json()

      if (data && data.id) {
        setCaseStudy(data)

        try {
          const allRes = await fetch('/api/brand-case-studies')
          const allData = await allRes.json()
          if (Array.isArray(allData)) {
            const currentIndex = allData.findIndex(cs => cs.id === data.id)
            if (currentIndex !== -1 && currentIndex < allData.length - 1) {
              setNextProject(allData[currentIndex + 1])
            } else if (currentIndex === allData.length - 1 && allData.length > 0) {
              setNextProject(allData[0])
            }
          }
        } catch (err) {
          console.error('Failed to fetch all case studies:', err)
        }
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

  const getGradientColor = () => {
    if (!caseStudy?.color_palette || caseStudy.color_palette.length === 0) {
      return 'from-blue-500 to-purple-500'
    }
    const colors = caseStudy.color_palette
    return `from-[${colors[0]}] to-[${colors[colors.length - 1]}]`
  }

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

  if (!caseStudy) {
    return (
      <div className="bg-white text-black min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-600">Case study not found</p>
        <a href="/projects" className="text-blue-600 hover:text-blue-800">
          ← Back to Projects
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white text-black overflow-x-hidden">
      {/* Hero Section - Full Height */}
      <section className="relative w-screen h-screen overflow-hidden -mx-[calc((100vw-100%)/2)] flex items-end">
        {/* Hero Video Background */}
        {(caseStudy as any).hero_video && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
          >
            <source src={(caseStudy as any).hero_video} type="video/mp4" />
          </video>
        )}

        {/* Hero Image Background */}
        {!((caseStudy as any).hero_video) && caseStudy.hero_image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${caseStudy.hero_image})` }}
          />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />

        {/* Header - Positioned on Hero */}
        <header className="absolute top-0 left-0 right-0 z-50 px-8 lg:px-20 pt-6">
          <Link href="/" className="hover:opacity-70 transition inline-block">
            <h1 className="text-xl font-light tracking-widest text-black">SHARON MOSHE ATTIAS</h1>
          </Link>
        </header>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute top-6 right-8 lg:right-20 flex flex-col gap-2 w-8 h-8 justify-center items-center cursor-pointer hover:opacity-70 transition z-50"
        >
          <span className={`block w-8 h-0.5 bg-black transition-all ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
          <span className={`block w-8 h-0.5 bg-black transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-8 h-0.5 bg-black transition-all ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
        </button>

        {/* Menu */}
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10 bg-black/40 transition-all duration-300 ease-out"
              onClick={() => setMenuOpen(false)}
              style={{
                animation: 'fadeIn 0.3s ease-out',
                backdropFilter: 'blur(20px)'
              }}
            />
            <nav
              className="fixed top-0 left-0 w-full sm:w-1/2 h-screen z-20 flex flex-col items-start justify-end px-8 sm:px-16 pb-16"
              style={{
                animation: 'slideInLeft 0.4s ease-out',
                background: 'transparent'
              }}
            >
              <div className="flex flex-col gap-4 w-full">
                <a href="/" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-6xl font-light text-white hover:opacity-70 transition text-left uppercase" style={{ filter: 'blur(4px)' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'blur(0px)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'blur(4px)'}>Home</a>
                <a href="/projects" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-6xl font-light text-white hover:opacity-70 transition text-left uppercase">Work</a>
                <a href="/about" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-6xl font-light text-white hover:opacity-70 transition text-left uppercase" style={{ filter: 'blur(4px)' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'blur(0px)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'blur(4px)'}>About</a>
                <a href="/contact" onClick={() => setMenuOpen(false)} className="text-5xl sm:text-6xl font-light text-white hover:opacity-70 transition text-left uppercase" style={{ filter: 'blur(4px)' }} onMouseEnter={(e) => e.currentTarget.style.filter = 'blur(0px)'} onMouseLeave={(e) => e.currentTarget.style.filter = 'blur(4px)'}>Contact</a>
              </div>
            </nav>
          </>
        )}

        {/* Hero Content */}
        <div className="relative z-30 w-full px-4 sm:px-8 lg:px-20 pb-8 sm:pb-20">
          <div className="max-w-4xl">
            {/* Categories */}
            <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-8 flex-wrap">
              {caseStudy.category && (
                <span className="px-3 py-1.5 text-sm font-light border border-black text-black">
                  {caseStudy.category.replace(/_/g, ' ').toUpperCase()}
                </span>
              )}
              {caseStudy.year && (
                <span className="px-3 py-1.5 text-sm font-light border border-black text-black">
                  {caseStudy.year}
                </span>
              )}
              {caseStudy.client && (
                <span className="px-3 py-1.5 text-sm font-light border border-black text-black">
                  {caseStudy.client}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl xl:text-8xl font-light mb-3 sm:mb-6 leading-tight text-black">{caseStudy.title}</h1>
            {caseStudy.subtitle && (
              <p className="text-sm sm:text-lg lg:text-2xl text-gray-700 mb-3 sm:mb-6 font-light">{caseStudy.subtitle}</p>
            )}
            {caseStudy.hero_description && (
              <p className="text-xs sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl font-light">{caseStudy.hero_description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Project Meta - Compact */}
      <section className="py-10 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {caseStudy.year && (
            <div>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-2 sm:mb-3">Year</p>
              <p className="text-sm sm:text-base lg:text-lg text-black font-light">{caseStudy.year}</p>
            </div>
          )}
          {caseStudy.client && (
            <div>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-2 sm:mb-3">Client</p>
              <p className="text-sm sm:text-base lg:text-lg text-black font-light">{caseStudy.client}</p>
            </div>
          )}
          {caseStudy.role && (
            <div>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-2 sm:mb-3">Role</p>
              <p className="text-sm sm:text-base lg:text-lg text-black font-light">{caseStudy.role}</p>
            </div>
          )}
          {caseStudy.color_palette && caseStudy.color_palette.length > 0 && (
            <div>
              <p className="text-xs tracking-widest text-gray-500 uppercase mb-2 sm:mb-3">Palette</p>
              <div className="flex gap-2">
                {caseStudy.color_palette.slice(0, 3).map((color, i) => (
                  <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-gray-300" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Central Description - Large */}
      {caseStudy.central_description && (
        <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-20 -ml-0 sm:-ml-16 lg:-ml-32 mb-16 sm:mb-48 lg:mb-64">
          <div className="max-w-md sm:max-w-lg lg:max-w-2xl mx-auto">
            <div className="text-sm sm:text-base lg:text-2xl xl:text-3xl leading-relaxed lg:leading-relaxed text-black font-light">
              {caseStudy.central_description.split('\n').map((line, i) => {
                const words = line.split(' ').filter(w => w.length > 0)
                const wordsPerLine = isMobile ? 6 : 12
                const lines = []
                for (let i = 0; i < words.length; i += wordsPerLine) {
                  lines.push(words.slice(i, i + wordsPerLine))
                }
                let globalWordCount = 0
                return (
                  <div key={i}>
                    {lines.map((lineWords, lineIdx) => (
                      <div key={lineIdx} className="mb-2">
                        {lineWords.map((word, j) => {
                          globalWordCount++
                          const isHighlight = word.length > 5 && Math.random() > 0.7
                          if (isHighlight && caseStudy.color_palette && caseStudy.color_palette.length > 0) {
                            const colorIndex = (globalWordCount - 1) % caseStudy.color_palette.length
                            const nextColorIndex = (colorIndex + 1) % caseStudy.color_palette.length
                            return (
                              <span
                                key={j}
                                className="inline-block"
                                style={{
                                  background: `linear-gradient(135deg, ${caseStudy.color_palette[colorIndex]}, ${caseStudy.color_palette[nextColorIndex]})`,
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  backgroundClip: 'text',
                                  fontWeight: '600',
                                  marginRight: '0.35rem'
                                }}
                              >
                                {word}
                              </span>
                            )
                          }
                          return <span key={j} className="inline" style={{marginRight: '0.35rem'}}>{word}</span>
                        })}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTO/Leader Section */}
      {caseStudy.cto && (
        <section className="min-h-screen flex flex-col sm:flex-row bg-white relative overflow-hidden -mt-12 sm:-mt-24">
          {/* Image Column */}
          {caseStudy.cto.image && (
            <div className="w-full sm:w-1/2 h-64 sm:h-full flex items-center justify-center overflow-visible order-2 sm:order-2 relative">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-3/4 h-3/4 flex items-center justify-center">
                  <img
                    src={caseStudy.cto.image}
                    alt={caseStudy.cto.name}
                    className="w-full h-full object-contain opacity-75 transition-transform duration-500 hover:opacity-90"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Content Column */}
          <div className={`${caseStudy.cto.image ? 'w-full sm:w-1/2' : 'w-full'} flex items-start justify-center sm:justify-end px-4 sm:px-8 lg:px-0 py-8 sm:pt-32 lg:pt-40 pb-0 order-1 relative z-10 pr-0 sm:pr-8 lg:pr-16`}>
            <div className="max-w-sm sm:max-w-lg lg:max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-6xl font-light mb-3 sm:mb-4 text-black leading-tight">
                {caseStudy.cto.name}
              </h2>
              <h3 className="text-lg sm:text-xl lg:text-3xl font-light text-gray-700 mb-6 sm:mb-8">{caseStudy.cto.title}</h3>

              <div className="text-sm sm:text-lg lg:text-3xl xl:text-4xl leading-relaxed lg:leading-relaxed font-light block">
                {caseStudy.cto.description.split('\n').map((line, i) => {
                  const words = line.split(' ')
                  let wordCount = 0
                  return (
                    <div key={i} className="mb-6">
                      {words.map((word, j) => {
                        wordCount++
                        const isHighlight = word.length > 5 && Math.random() > 0.7
                        if (isHighlight && caseStudy.color_palette && caseStudy.color_palette.length > 0) {
                          const colorIndex = (wordCount - 1) % caseStudy.color_palette.length
                          const nextColorIndex = (colorIndex + 1) % caseStudy.color_palette.length
                          return (
                            <span
                              key={j}
                              style={{
                                background: `linear-gradient(135deg, ${caseStudy.color_palette[colorIndex]}, ${caseStudy.color_palette[nextColorIndex]})`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: '600'
                              }}
                            >
                              {word}{j < words.length - 1 ? ' ' : ''}
                            </span>
                          )
                        }
                        return <span key={j} className="text-gray-700">{word}{j < words.length - 1 ? ' ' : ''}</span>
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Color Palette - Enhanced Digital Fan */}
      {caseStudy.color_palette && caseStudy.color_palette.length > 0 && (
        <section className="min-h-screen flex flex-col items-center px-4 sm:px-8 lg:px-20 bg-gradient-to-b from-white to-gray-50 -mt-12 sm:-mt-96 lg:-mt-[28rem] pt-12 sm:pt-80 lg:pt-96 -mb-12 sm:-mb-96">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-light mb-8 sm:mb-16 text-black">Color Palette</h2>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-12">
              <div className="relative w-full sm:w-1/2 h-64 sm:h-96 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
                {caseStudy.color_palette.map((_, idx) => {
                  const angle = (idx / caseStudy.color_palette!.length) * 360 - 90
                  const radius = 100
                  const x = 300 + Math.cos((angle * Math.PI) / 180) * radius
                  const y = 150 + Math.sin((angle * Math.PI) / 180) * radius
                  return <line key={idx} x1="300" y1="150" x2={x} y2={y} stroke="#e5e7eb" strokeWidth="1" />
                })}
              </svg>

              {caseStudy.color_palette.map((color, idx) => {
                const angle = (idx / caseStudy.color_palette!.length) * 360 - 90
                const radius = 130
                const x = Math.cos((angle * Math.PI) / 180) * radius
                const y = Math.sin((angle * Math.PI) / 180) * radius

                return (
                  <div
                    key={idx}
                    className="absolute flex flex-col items-center cursor-pointer"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    }}
                    onMouseEnter={() => setHoveredColorIdx(idx)}
                    onMouseLeave={() => setHoveredColorIdx(null)}
                  >
                    {hoveredColorIdx === idx && caseStudy.color_palette && (
                      <svg className="absolute w-48 h-48 animate-pulse" style={{ left: '-96px', top: '-96px' }} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        {caseStudy.color_palette.map((fanColor, fanIdx) => {
                          const fanAngle = (fanIdx / caseStudy.color_palette!.length) * 360
                          const nextAngle = ((fanIdx + 1) / caseStudy.color_palette!.length) * 360
                          const midAngle = (fanAngle + nextAngle) / 2
                          const radius = 80
                          const x1 = 100 + Math.cos((fanAngle * Math.PI) / 180) * radius
                          const y1 = 100 + Math.sin((fanAngle * Math.PI) / 180) * radius
                          const x2 = 100 + Math.cos((nextAngle * Math.PI) / 180) * radius
                          const y2 = 100 + Math.sin((nextAngle * Math.PI) / 180) * radius
                          return (
                            <path
                              key={fanIdx}
                              d={`M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                              fill={fanColor}
                              opacity="0.8"
                            />
                          )
                        })}
                      </svg>
                    )}
                    <div
                      className="w-20 h-20 rounded-full shadow-xl border-4 border-white transition-all relative z-10"
                      style={{
                        backgroundColor: color,
                        transform: hoveredColorIdx === idx ? 'scale(1.3)' : 'scale(1)',
                        boxShadow: hoveredColorIdx === idx ? '0 20px 25px -5px rgba(0, 0, 0, 0.3)' : ''
                      }}
                      title={color}
                    />
                    <span className="text-xs mt-4 text-gray-700 font-mono transition whitespace-nowrap" style={{fontWeight: hoveredColorIdx === idx ? 'bold' : 'normal'}}>
                      {color}
                    </span>
                  </div>
                )
              })}
              </div>
              <div className="w-full sm:w-1/2 flex items-center justify-center sm:justify-start text-center sm:text-left">
                <p className="text-sm sm:text-base lg:text-xl font-light text-gray-800 leading-relaxed">
                  A spectrum-driven<br />palette expressing energy<br />and optimism.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Design System Sections */}
      {(() => {
        const defaultOrder = ['idea', 'system', 'shape', 'motion', 'applications', 'color', 'type']
        const sectionsOrder = (caseStudy as any).sections_order || defaultOrder
        return sectionsOrder.map((sectionKey: string, sectionIdx: number) => {
        let section: any
        if (sectionKey.startsWith('custom_') || sectionKey.startsWith('premium_')) {
          section = (caseStudy.custom_sections || []).find((s: any) => s.id === sectionKey)
        } else {
          section = caseStudy[sectionKey as keyof BrandCaseStudy] as any
        }
        if (!section || section.isDeleted) return null

        const hasImages = section.images && section.images.length > 0
        if (sectionKey === 'applications') {
          console.log('🔍 Applications Section Debug:', {
            hasImages,
            imagesCount: section.images?.length || 0,
            imagesArray: section.images,
            section: JSON.stringify(section).substring(0, 200)
          })
        }
        const isCustomSection = sectionKey.startsWith('custom_') || sectionKey.startsWith('premium_')
        const sectionLabel = (section as any).label || ''


        // Custom section with 25/75 layout
        if (isCustomSection) {
          const bgColor = (section as any).backgroundColor || 'white'
          const bgImage = (section as any).backgroundImage
          const imageLayout = (section as any).imageLayout || 'single'
          // Determine text color based on background - check multiple white variations
          const normalizedBgColor = bgColor?.toLowerCase?.() || ''
          const isLightBg = !bgColor ||
            normalizedBgColor === '#ffffff' ||
            normalizedBgColor === '#fff' ||
            normalizedBgColor === 'white' ||
            normalizedBgColor === '#f3f4f6' ||
            normalizedBgColor === '#fafafa'
          // If background image exists, assume dark background for text contrast
          const textColorClass = bgImage ? 'text-white' : (isLightBg ? 'text-black' : 'text-white')
          const subtitleColorClass = bgImage ? 'text-gray-200' : (isLightBg ? 'text-gray-500' : 'text-gray-300')

          const isCleanSection = section.title?.includes('Clean. Intuitive. Focused on what')
          const sectionStyle = bgImage
            ? {
                backgroundImage: `url('${bgImage}')`,
                backgroundSize: isCleanSection ? 'contain' : 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }
            : { backgroundColor: bgColor }

          const isWhiteTitle = section.title?.includes('system that works everywhere')
          const pbClass = isWhiteTitle ? 'pb-8 lg:pb-12' : 'pb-24 lg:pb-32'
          const ptClass = isCleanSection ? 'pt-[24rem] lg:pt-[32rem]' : (isWhiteTitle ? 'pt-24 lg:pt-32' : 'pt-[32rem] lg:pt-[48rem]')

          return (
            <section key={sectionKey} style={sectionStyle} className={`flex items-center ${ptClass} ${pbClass} relative`}>
              {/* Content Column (Always Left) */}
              <div className={`${hasImages ? 'w-1/4' : 'w-full'} flex items-center justify-start pl-24 lg:pl-32 order-1 relative z-10`}>
                <div className="w-full">
                  {section.number && (
                    <div className="mb-6 -mt-8">
                      <p className={`text-xs lg:text-sm tracking-widest uppercase ${bgImage ? 'text-purple-300' : (isLightBg ? 'text-gray-500' : 'text-purple-400')}`}>{section.number}</p>
                    </div>
                  )}
                  {section.subtitle && (
                    <p className={`text-xs lg:text-sm tracking-widest uppercase mb-4 -mt-2`} style={{color: '#000'}}>{section.subtitle}</p>
                  )}
                  <h2 className={`text-2xl sm:text-3xl lg:text-6xl font-light mb-4 sm:mb-6 max-w-2xl leading-tight`} style={{color: isWhiteTitle ? '#fff' : '#000'}}>{section.title}</h2>
                  {section.description && (
                    <div className={`text-base lg:text-lg leading-relaxed font-light space-y-4 max-w-lg`} style={{color: bgImage ? '#f3f4f6' : (isLightBg ? '#000' : '#fff')}}>
                      {section.description.split('\n').filter((p: string) => p.trim()).map((line: string, lineIdx: number) => (
                        <p key={lineIdx}>{line}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Images Column (Always Right) */}
              {hasImages && (
                <div className={`${sectionKey === 'applications' ? 'w-full' : 'w-3/4'} flex items-center justify-center ${sectionKey === 'applications' ? 'px-0' : 'px-12'} order-2 relative z-10`}>
                  {imageLayout === 'grid' ? (
                    <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
                      {section.images.slice(0, 4).map((img: any, imgIdx: number) => {
                        const imgUrl = typeof img === 'string' ? img : img.url
                        return (
                          <div key={imgIdx} className="overflow-hidden rounded-lg aspect-square">
                            <img
                              src={imgUrl}
                              alt={`${sectionLabel} ${imgIdx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )
                      })}
                    </div>
                  ) : section.images.length >= 3 ? (
                    <div className="w-full">
                      <div className={`grid gap-6 w-full ${section.images.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                        {section.images.slice(0, 4).map((img: any, imgIdx: number) => {
                          const imgUrl = typeof img === 'string' ? img : img.url
                          return (
                            <div key={imgIdx} className="overflow-hidden rounded-lg aspect-square">
                              <img
                                src={imgUrl}
                                alt={`${sectionLabel} ${imgIdx + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className={`w-full ${isCleanSection ? 'max-w-2xl' : 'max-w-6xl'} flex items-center justify-center`}>
                      <div className="overflow-hidden rounded-lg w-full">
                        <img
                          src={typeof section.images[0] === 'string' ? section.images[0] : section.images[0].url}
                          alt={sectionLabel}
                          className="w-full h-auto object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )
        }

        // Standard section with 50/50 layout
        const isIdeaSection = sectionKey === 'idea'
        const isSystemSection = sectionKey === 'system'
        const isShapeSection = sectionKey === 'shape'
        const isApplicationsSection = sectionKey === 'applications'
        const hasTwoImages = section.images && section.images.length === 2
        const isFullWidthImage = isIdeaSection || isSystemSection || hasTwoImages || isApplicationsSection
        let isImageLeft = sectionIdx % 2 === 0
        if (isSystemSection) {
          isImageLeft = true // Image always on left in System section
        }
        return (
          <section key={sectionKey} className={`${isFullWidthImage ? 'h-auto' : isShapeSection ? 'h-80 sm:h-[584px]' : 'min-h-auto sm:min-h-screen'} flex flex-col sm:flex-row ${isFullWidthImage ? 'py-0 -my-0 sm:-my-12' : isShapeSection ? 'py-0 -my-2' : 'py-8 sm:py-12'} ${isSystemSection ? 'pb-0' : ''} ${sectionIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            {/* Images Column */}
            {hasImages && (
              <div className={`${isFullWidthImage ? 'w-full' : 'w-full sm:w-1/2'} flex items-center justify-center overflow-hidden order-2 sm:${isImageLeft && !isFullWidthImage ? 'order-1' : 'order-2'}`}>
                <div className={`w-full flex items-center justify-center ${isFullWidthImage ? 'p-0' : 'p-8'}`}>
                  <div className={`${isApplicationsSection ? 'grid gap-2 sm:gap-6 w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : isFullWidthImage ? (hasTwoImages ? 'grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 w-full' : 'grid grid-cols-1 gap-0 w-full') : isShapeSection ? 'grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-6xl' : 'grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-4xl'}`}>
                    {section.images.map((img: any, idx: number) => {
                      const imageId = `${sectionKey}-${idx}`
                      const imgUrl = typeof img === 'string' ? img : img.url
                      return (
                        <div key={idx} className={isFullWidthImage ? "w-full h-auto" : "aspect-square overflow-hidden rounded-lg"}>
                          <img
                            src={imgUrl}
                            alt={`${sectionLabel} ${idx + 1}`}
                            className={`${isFullWidthImage ? 'w-full h-auto' : 'w-full h-full'} object-contain`}
                            loading="lazy"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Content Column */}
            {!isApplicationsSection && (
            <div className={`${hasImages ? 'w-full sm:w-1/2' : 'w-full'} flex items-center justify-center px-4 sm:px-6 lg:px-16 py-6 sm:py-12 lg:py-24 order-1 sm:${isImageLeft ? 'order-2' : 'order-1'}`}>
              <div className={sectionKey === 'motion' ? 'w-full' : 'max-w-md lg:max-w-lg'}>
                {sectionLabel && (
                  <h2 className="text-3xl sm:text-4xl lg:text-6xl font-light mb-4 text-black">
                    {sectionLabel}
                  </h2>
                )}
                {section.title && (
                  <h3 className="text-2xl lg:text-3xl font-light text-gray-700 mb-8">{section.title}</h3>
                )}

                {section.description && (
                  <div className="text-sm sm:text-lg lg:text-2xl text-gray-700 leading-relaxed lg:leading-relaxed font-light space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    {section.description.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="text-left">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}

                {sectionKey === 'motion' && (section as any).video && (
                  <div className="w-full">
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                      <video
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        controls
                      >
                        <source src={(section as any).video} type="video/mp4" />
                      </video>
                    </div>
                  </div>
                )}
              </div>
            </div>
            )}
          </section>
        )
        })
      })()}


      {/* Next Project */}
      {nextProject && (
        <section className="min-h-auto sm:min-h-screen flex items-center px-4 sm:px-8 lg:px-20 py-12 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-light mb-8 sm:mb-12 text-black uppercase tracking-tight">Next Project</h2>
            <Link href={`/brand-case-studies/${nextProject.id}`}>
              <div className="group cursor-pointer">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12 items-center">
                  {nextProject.hero_image && (
                    <div className="lg:col-span-2 order-2 sm:order-1">
                      <div className="relative overflow-hidden rounded-lg bg-gray-300 h-64 sm:h-80 lg:h-96">
                        <img
                          src={nextProject.hero_image}
                          alt={nextProject.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                    </div>
                  )}
                  <div className="order-1 sm:order-2">
                    <h3 className="text-xl sm:text-2xl lg:text-4xl font-light mb-2 sm:mb-3 text-black group-hover:text-gray-700 transition leading-tight">
                      {nextProject.title}
                    </h3>
                    {nextProject.subtitle && (
                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 sm:mb-6 font-light line-clamp-2">{nextProject.subtitle}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600 group-hover:text-black transition font-light">Explore →</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-8 px-8 lg:px-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex gap-6">
            <a href="https://www.instagram.com/sharon.attias/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition font-light">Instagram</a>
            <a href="https://www.youtube.com/@sharonattias7274" target="_blank" rel="noopener noreferrer" className="hover:text-black transition font-light">YouTube</a>
          </div>
          <p className="font-light">© 2026 Sharon Moshe Attias</p>
        </div>
      </footer>
    </div>
  )
}
