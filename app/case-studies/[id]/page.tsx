'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { AppCase } from '@/lib/types'

export default function CaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const [caseStudy, setCaseStudy] = useState<AppCase | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [allCaseStudies, setAllCaseStudies] = useState<AppCase[]>([])
  const [nextProject, setNextProject] = useState<AppCase | null>(null)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then((p) => {
      console.log('📌 Params received:', p.id)
      setId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (!id) return
    fetchCaseStudy()
  }, [id])

  useEffect(() => {
    // Setup video event listeners
    const videoElement = document.querySelector('video') as HTMLVideoElement
    if (!videoElement) return

    const handlePlay = () => setIsVideoPlaying(true)
    const handlePause = () => setIsVideoPlaying(false)
    const handleEnded = () => setIsVideoPlaying(false)

    videoElement.addEventListener('play', handlePlay)
    videoElement.addEventListener('pause', handlePause)
    videoElement.addEventListener('ended', handleEnded)

    return () => {
      videoElement.removeEventListener('play', handlePlay)
      videoElement.removeEventListener('pause', handlePause)
      videoElement.removeEventListener('ended', handleEnded)
    }
  }, [caseStudy?.video_file])

  // Setup scroll animations
  useEffect(() => {
    // Parallax effect on hero
    const handleParallax = () => {
      if (!heroRef.current) return
      const scrolled = window.scrollY
      const heroHeight = heroRef.current.clientHeight
      const parallax = Math.min(scrolled * 0.3, heroHeight * 0.15)
      setParallaxOffset(parallax)
    }

    // Intersection Observer for fade up animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const isNextProject = entry.target.hasAttribute('data-animate-next-project')
          const isImage = entry.target.hasAttribute('data-animate-image')

          if (isNextProject) {
            entry.target.classList.add('animate-next-project-scale-in')
          } else if (isImage) {
            entry.target.classList.add('animate-image-scale-in')
          } else {
            entry.target.classList.add('animate-fade-up-in')
          }

          observer.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // Observe all sections
    document.querySelectorAll('[data-animate-section]').forEach((el) => {
      el.classList.add('opacity-0')
      observer.observe(el)
    })

    // Observe all images
    document.querySelectorAll('[data-animate-image]').forEach((el) => {
      el.classList.add('opacity-0')
      observer.observe(el)
    })

    // Observe next project section
    const nextProjectEl = document.querySelector('[data-animate-next-project]')
    if (nextProjectEl) {
      nextProjectEl.classList.add('opacity-0')
      observer.observe(nextProjectEl)
    }

    window.addEventListener('scroll', handleParallax, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleParallax)
      observer.disconnect()
    }
  }, [])

  const fetchCaseStudy = async () => {
    try {
      console.log('🔄 Fetching from /api/case-studies/' + id)
      let res = await fetch(`/api/case-studies/${id}`)
      let data = await res.json()

      console.log('📦 Got data:', { id: data.id, title: data.title, video_file: data.video_file, watch_film_link: data.watch_film_link, hasProcess: !!data.process_blocks?.length })

      if (!data || !data.id) {
        console.log('⚠️ No ID found, trying /api/app-cases')
        res = await fetch(`/api/app-cases/${id}`)
        data = await res.json()
      }

      if (data && data.id) {
        console.log('✅ Setting case study:', data.title)
        setCaseStudy(data)

        // Fetch all case studies to find the next project
        try {
          const allRes = await fetch('/api/case-studies')
          const allData = await allRes.json()
          if (Array.isArray(allData)) {
            setAllCaseStudies(allData)

            // Find current index and get next project
            const currentIndex = allData.findIndex(cs => cs.id === data.id)
            if (currentIndex !== -1 && currentIndex < allData.length - 1) {
              setNextProject(allData[currentIndex + 1])
            } else if (currentIndex === allData.length - 1 && allData.length > 0) {
              // If it's the last one, loop to the first
              setNextProject(allData[0])
            }
          }
        } catch (err) {
          console.error('Failed to fetch all case studies:', err)
        }
      } else {
        console.log('❌ No valid data found')
        setCaseStudy(null)
      }
    } catch (error) {
      console.error('❌ Failed to fetch case study:', error)
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

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = url.split('v=')[1].split('&')[0]
        return `https://www.youtube.com/embed/${videoId}`
      } else if (url.includes('youtu.be')) {
        const videoId = url.split('/').pop()
        return `https://www.youtube.com/embed/${videoId}`
      }
    } catch (e) {
      return null
    }
    return null
  }

  const isYouTubeUrl = (url: string | undefined) => {
    if (!url) return false
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header - Overlay on Hero */}
      <header className="fixed top-0 left-0 right-0 z-40 px-8 lg:px-20 pt-8 pb-16 transition-all duration-300 bg-transparent">
        <Link href="/projects" className="hover:opacity-80 transition">
          <div>
            <h1 className="text-2xl font-light tracking-widest text-white" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>SHARON MOSHE ATTIAS</h1>
          </div>
        </Link>
      </header>

      {/* Hamburger - positioned in header */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-8 right-8 lg:right-20 flex flex-col gap-2 w-8 h-8 justify-center items-center cursor-pointer hover:opacity-70 transition z-50 bg-transparent"
      >
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
      </button>

      {/* Menu */}
      {menuOpen && (
        <>
          {/* Blur Overlay */}
          <div
            className="fixed inset-0 z-10 bg-black/40 transition-all duration-300 ease-out"
            onClick={() => setMenuOpen(false)}
            style={{
              animation: 'fadeIn 0.3s ease-out',
              backdropFilter: 'blur(20px)'
            }}
          />
          {/* Navigation Menu */}
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
            </div>
          </nav>
        </>
      )}

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative flex items-end overflow-hidden w-screen -mx-[calc((100vw-100%)/2)]"
        style={{ height: '85vh', minHeight: '700px' }}
      >
        {/* Uploaded Video - fill HERO when playing */}
        {caseStudy.video_file && showVideoModal && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            controls
            autoPlay
            muted
            onEnded={() => setShowVideoModal(false)}
          >
            <source src={caseStudy.video_file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* YouTube Video - fill HERO when playing */}
        {!caseStudy.video_file && isYouTubeUrl(caseStudy.watch_film_link) && showVideoModal && getYouTubeEmbedUrl(caseStudy.watch_film_link!) && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={getYouTubeEmbedUrl(caseStudy.watch_film_link!)!}
            title="Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {/* Hero Image Background - show when not playing video */}
        {!showVideoModal && (caseStudy.hero_image || caseStudy.video_file) && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${caseStudy.hero_image || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"%3E%3Crect fill="%23333" width="1200" height="600"/%3E%3C/svg%3E'})`,
                transform: `translateY(${parallaxOffset}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)' }} />
          </>
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-5" style={{ background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)' }} />

        {/* Hero Content */}
        <div className="relative z-10 w-full px-6 lg:px-20 pb-16">
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
              <button
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-2 text-white hover:text-gray-300 transition text-sm tracking-widest uppercase"
              >
                Watch Film
                <span className="text-lg">→</span>
              </button>
            )}
          </div>
        </div>

      </section>

      {/* Content wrapper with blur effect when menu is open */}
      <div
        style={{
          filter: menuOpen ? 'blur(10px)' : 'none',
          transition: 'filter 0.3s ease-out'
        }}
      >
      {/* PROJECT META GRID */}
      <section className=" py-16 px-6" data-animate-section>
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

      {/* CASE STUDY SECTIONS - SORTED BY ORDER */}
      {(() => {
        const defaultLabels: { [key: string]: string } = {
          'problem': 'THE BRIEF',
          'insight': 'THE CHALLENGE',
          'approach': 'CREATIVE CONCEPT',
          'flow': 'FLOW',
          'interaction': 'VISUAL LANGUAGE',
          'outcome': 'OUTCOME'
        }

        const sectionMap: { [key: string]: any } = {
          'problem': caseStudy.problem,
          'insight': caseStudy.insight,
          'approach': caseStudy.approach,
          'flow': caseStudy.flow,
          'interaction': caseStudy.interaction,
        }

        // Use section_order from database if available, otherwise use default
        const order = (caseStudy as any).section_order || ['problem', 'insight', 'approach', 'flow', 'interaction']

        const sections: { key: string; label: string; section?: any }[] = order
          .map(key => ({
            key,
            label: defaultLabels[key] || key,
            section: sectionMap[key]
          }))
          .filter(item => item.section && !item.section.isDeleted)

        return sections.map((item, idx) => (
          <CaseSection
            key={item.key}
            section={item.section}
            label={item.section.label || item.label}
            number={idx + 1}
            accentColor={accentColor}
          />
        ))
      })()}

      {/* PROCESS SECTION */}
      {caseStudy.process_blocks && caseStudy.process_blocks.length > 0 && (
        <section className="" data-animate-section>
          <div className="py-12 px-6">
            <div className="max-w-6xl mx-auto">
              <div className="space-y-12">
                {caseStudy.process_blocks.map((block, idx) => {
                  // Section numbering: 1-5 are standard sections, 6+ are process blocks
                  const blockNumber = 5 + idx + 1; // 6, 7, 8, etc.
                  return (
                    <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
                      {/* Text Content */}
                      <div className="pl-0 pr-8 border-r-2 border-gray-700 h-full flex flex-col py-6 max-w-sm" style={{ marginLeft: '-300px' }}>
                        <div className="mb-1 text-xs tracking-widest text-gray-500 uppercase">{String(blockNumber).padStart(2, '0')}</div>
                        <h2 className="text-3xl font-light mb-3 text-white">
                          {block.title}
                        </h2>
                        <p className="text-gray-300 text-base leading-tight whitespace-pre-wrap">{block.description}</p>
                      </div>

                      {/* Images */}
                      {block.images && block.images.length > 0 && (
                        <div className="flex" style={{ backgroundColor: '#000000', gap: '8px', marginLeft: '-440px' }}>
                          {block.images.map((img, imgIdx) => {
                            let imageWidth: number, imageHeight: number;

                            if (block.images!.length === 1) {
                              imageWidth = 1200;
                              imageHeight = 412;
                            } else if (block.images!.length === 2) {
                              imageWidth = 600;
                              imageHeight = 412;
                            } else {
                              imageWidth = 412;
                              imageHeight = 412;
                            }

                            return (
                              <div key={imgIdx} className="overflow-hidden bg-gray-900 flex-shrink-0" style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }} data-animate-image>
                                <img src={img} alt={`${block.title} ${imgIdx + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* OUTCOME SECTION */}
      {caseStudy.outcome && !caseStudy.outcome.isDeleted && (
        <CaseSection
          section={caseStudy.outcome}
          label={caseStudy.outcome.label || "OUTCOME"}
          number={5 + (caseStudy.process_blocks?.length || 0) + 1}
          accentColor={accentColor}
        />
      )}

      {/* MY ROLE SECTION */}
      {caseStudy.my_role_title && (
        <section className=" py-12 px-6" data-animate-section>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-light mb-6" style={{ color: accentColor }}>
              MY ROLE
            </h2>
            <h3 className="text-2xl font-light mb-6 text-white">{caseStudy.my_role_title}</h3>
            <p className="text-gray-300 leading-relaxed max-w-2xl">{caseStudy.my_role_description}</p>
          </div>
        </section>
      )}

      {/* NEXT PROJECT SECTION */}
      {nextProject && (
        <section className=" py-12 px-6" data-animate-next-project>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-light mb-8 text-gray-400 uppercase tracking-widest">Next Project</h2>
            <Link href={`/case-studies/${nextProject.id}`}>
              <div className="group cursor-pointer">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Image */}
                  <div className="lg:col-span-2" data-animate-image>
                    <div className="relative overflow-hidden rounded-lg bg-gray-900 h-80">
                      {nextProject.hero_image ? (
                        <img
                          src={nextProject.hero_image}
                          alt={nextProject.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gradient-to-br from-gray-800 to-black">
                          No image available
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center">
                    {nextProject.format && (
                      <p className="text-xs tracking-widest text-gray-500 uppercase mb-2">{nextProject.format}</p>
                    )}
                    <h3 className="text-3xl lg:text-4xl font-light mb-4 text-white group-hover:opacity-70 transition">
                      {nextProject.title}
                    </h3>
                    {nextProject.subtitle && (
                      <p className="text-gray-400 mb-6">{nextProject.subtitle}</p>
                    )}
                    <div className="flex items-center gap-2 text-white group-hover:gap-4 transition-all">
                      <span className="text-sm tracking-widest uppercase">Explore</span>
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* IMAGE GALLERY */}
      {caseStudy.gallery_images && caseStudy.gallery_images.length > 0 && (
        <section className="py-12 px-6 " data-animate-section>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.gallery_images.map((img, idx) => (
                <div
                  key={idx}
                  className={`overflow-hidden rounded-lg bg-gray-900 ${idx === 0 ? 'md:col-span-2' : ''}`}
                  style={{ aspectRatio: idx === 0 ? '16/9' : '1/1', marginLeft: idx === 1 ? '8px' : '0' }}
                  data-animate-image
                >
                  <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CUSTOM SECTIONS */}
      {caseStudy.custom_sections && caseStudy.custom_sections.map((customSection, idx) => (
        <CaseSection
          key={`custom-${customSection.id}`}
          section={customSection}
          label={customSection.label}
          number={7 + idx}
          accentColor={accentColor}
        />
      ))}
      </div>

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
    <section className="">
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            {/* Text Content */}
            <div className="pl-0 pr-8 border-r-2 border-gray-700 h-full flex flex-col py-6 max-w-sm" style={{ marginLeft: '-300px' }}>
              <div className="mb-1 text-xs tracking-widest text-gray-500 uppercase">{numberFormatted}</div>
              <h2 className="text-3xl font-light mb-3 text-white">
                {label}
              </h2>
              {section.title && <h3 className="text-xl font-light mb-3 text-white">{section.title}</h3>}
              {section.description && <p className="text-gray-300 text-base leading-tight whitespace-pre-wrap">{section.description}</p>}
            </div>

            {/* Images */}
            {section.images && section.images.length > 0 && (
              <div className={`flex ${section.images.length === 1 ? 'flex-col' : 'flex-row'}`} style={{ backgroundColor: '#000000', gap: '8px', marginLeft: '-440px' }}>
                {section.images.map((img: string, idx: number) => {
                  let imageWidth: number, imageHeight: number;

                  if (section.images.length === 1) {
                    imageWidth = 1200;
                    imageHeight = 412;
                  } else if (section.images.length === 2) {
                    imageWidth = 600;
                    imageHeight = 412;
                  } else {
                    imageWidth = 412;
                    imageHeight = 412;
                  }

                  return (
                    <div key={idx} className="overflow-hidden bg-gray-900 flex-shrink-0" style={{ width: `${imageWidth}px`, height: `${imageHeight}px` }}>
                      <img src={img} alt={`${label} ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
