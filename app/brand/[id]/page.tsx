'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BrandDesign, AppCase } from '@/lib/types'

export default function BrandDesignPage({ params }: { params: Promise<{ id: string }> }) {
  const [design, setDesign] = useState<BrandDesign | null>(null)
  const [id, setId] = useState<string | null>(null)
  const [selectedVideoProject, setSelectedVideoProject] = useState<BrandDesign | null>(null)
  const [selectedMockup, setSelectedMockup] = useState<string | null>(null)
  const [relatedCaseStudy, setRelatedCaseStudy] = useState<AppCase | null>(null)

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    fetchDesign()
  }, [id])

  const fetchDesign = async () => {
    try {
      const res = await fetch(`/api/brand-design/${id}`)
      const data = await res.json()
      setDesign(data)

      // Fetch related case study
      if (id) {
        fetchRelatedCaseStudy(id)
      }
    } catch (error) {
      console.error('Failed to fetch design:', error)
    }
  }

  const fetchRelatedCaseStudy = async (brandId: string) => {
    try {
      const res = await fetch(`/api/app-cases/by-brand/${brandId}`)
      const data = await res.json()
      // Only set if it's a valid object with an id
      if (data && data.id) {
        setRelatedCaseStudy(data)
      } else {
        setRelatedCaseStudy(null)
      }
    } catch (error) {
      console.error('Failed to fetch related case study:', error)
      setRelatedCaseStudy(null)
    }
  }

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = ''

    // Handle different YouTube URL formats
    if (url.includes('youtu.be/')) {
      // youtu.be/VIDEO_ID
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/watch')) {
      // youtube.com/watch?v=VIDEO_ID
      videoId = new URL(url).searchParams.get('v') || ''
    } else if (url.includes('youtube.com/embed/')) {
      // youtube.com/embed/VIDEO_ID
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/v/')) {
      // youtube.com/v/VIDEO_ID
      videoId = url.split('youtube.com/v/')[1]?.split('?')[0] || ''
    } else if (url.includes('youtube.com/shorts/')) {
      // youtube.com/shorts/VIDEO_ID
      videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0] || ''
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

  const isYouTubeUrl = (url?: string) => url?.includes('youtube') || url?.includes('youtu.be')

  if (!design)
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )

  const backgroundImage = design.mockups[0] || design.images[0]

  const getFontFamily = (family?: string) => {
    switch (family) {
      case 'serif':
        return 'font-serif'
      case 'sans':
        return 'font-sans'
      case 'mono':
      default:
        return ''
    }
  }

  const getTextAlign = (align?: string) => {
    switch (align) {
      case 'left':
        return 'text-left'
      case 'right':
        return 'text-right'
      case 'center':
      default:
        return 'text-center'
    }
  }

  return (
    <div className="bg-black text-white min-h-screen relative overflow-hidden">
      {/* Background with low opacity */}
      {design.background_url ? (
        <div className="fixed inset-0 z-0">
          {isYouTubeUrl(design.background_url) ? (
            <div className="w-full h-full opacity-40">
              <iframe
                src={getYouTubeEmbedUrl(design.background_url)}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
              />
            </div>
          ) : (
            <video
              autoPlay
              muted
              loop
              className="w-full h-full object-cover opacity-40"
            >
              <source src={design.background_url} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        </div>
      ) : backgroundImage ? (
        <div className="fixed inset-0 z-0">
          <img
            src={backgroundImage}
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black" />
        </div>
      ) : null}

      {/* Content */}
      <div className="relative z-10">
        {/* Header - Back Button */}
        <header className="border-b border-gray-800 p-8 sticky top-0 bg-black/80 backdrop-blur">
          <div className="max-w-4xl mx-auto">
            <a href="/projects" className="text-gray-400 hover:text-white transition text-sm">
              ← Back
            </a>
          </div>
        </header>


        {/* Skills Animation at Top */}
        {design.skills && design.skills.length > 0 && (
          <div className="flex justify-center gap-6 px-8 pt-12 pb-6 flex-wrap">
            {design.skills.map((skill, index) => (
              <style key={skill}>
                {`
                  @keyframes colorWave-${index} {
                    0% {
                      background-position: 0% center;
                    }
                    100% {
                      background-position: 100% center;
                    }
                  }
                  .skill-animate-${index} {
                    background: linear-gradient(
                      90deg,
                      #fff 0%,
                      #fff 50%,
                      #9ca3af 50%,
                      #9ca3af 100%
                    );
                    background-size: 200% 100%;
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: colorWave-${index} 2s ease-in-out infinite;
                    animation-delay: ${index * 0.3}s;
                  }
                `}
              </style>
            ))}
            {design.skills.map((skill, index) => (
              <div key={skill} className={`text-sm capitalize skill-animate-${index}`}>
                {skill}
              </div>
            ))}
          </div>
        )}

        {/* Unified Content Block */}
        <div className="py-24 px-8">
          <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur rounded-lg p-12 space-y-16">

            {/* Logo Section - Centered */}
            <div className="flex justify-center mb-8">
              {design.logo_url && (
                <img
                  src={design.logo_url}
                  alt={design.title}
                  className="h-64 w-auto object-contain"
                  style={{
                    transform: `scale(${(design.logo_size || 100) / 100})`,
                    transformOrigin: 'center',
                  }}
                />
              )}
            </div>

            {/* Story Section */}
            {design.story && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-center">The Story</h2>
                <div className="max-w-xl mx-auto h-64 overflow-y-auto pr-4">
                  <p
                    className={`text-gray-300 whitespace-pre-wrap ${getTextAlign(design.textStyles?.story?.alignment)}`}
                    style={{
                      fontFamily:
                        design.textStyles?.story?.fontFamily === 'serif'
                          ? 'Georgia, serif'
                          : design.textStyles?.story?.fontFamily === 'sans'
                          ? 'Arial, sans-serif'
                          : 'Space Grotesk, sans-serif',
                      fontSize: `${design.textStyles?.story?.fontSize || 16}px`,
                      lineHeight: `${design.textStyles?.story?.lineHeight || 1.6}em`,
                      fontWeight: design.textStyles?.story?.bold ? 'bold' : 'normal',
                    }}
                  >
                    {design.story}
                  </p>
                </div>
              </div>
            )}

            {/* Color Palette Section */}
            {design.color_palette.colors.length > 0 && (
              <div className="space-y-12">
                <h2 className="text-2xl font-bold tracking-tight text-center">Color</h2>

                {/* Color Wheel */}
                <div className="flex flex-col items-center gap-12">
                  {/* Color Circle */}
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <svg className="w-full h-full" viewBox="0 0 300 300">
                      {design.color_palette.colors.map((color, index) => {
                        const angle = (360 / design.color_palette.colors.length) * index
                        const radius = 120
                        const x = 150 + radius * Math.cos((angle - 90) * (Math.PI / 180))
                        const y = 150 + radius * Math.sin((angle - 90) * (Math.PI / 180))

                        return (
                          <g key={index}>
                            {/* Line from center */}
                            <line
                              x1="150"
                              y1="150"
                              x2={x}
                              y2={y}
                              stroke="#4B5563"
                              strokeWidth="1"
                              opacity="0.3"
                            />
                            {/* Color circle */}
                            <circle
                              cx={x}
                              cy={y}
                              r="22"
                              fill={color}
                              stroke="#1F2937"
                              strokeWidth="2"
                              className="hover:filter hover:brightness-110 transition-all cursor-pointer"
                            />
                          </g>
                        )
                      })}
                      {/* Center circle */}
                      <circle
                        cx="150"
                        cy="150"
                        r="30"
                        fill="url(#colorGradient)"
                        stroke="#4B5563"
                        strokeWidth="2"
                      />
                      <defs>
                        <linearGradient id="colorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={design.color_palette.colors[0]} />
                          <stop
                            offset="100%"
                            stopColor={design.color_palette.colors[design.color_palette.colors.length - 1]}
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Color Codes */}
                  <div className="flex flex-wrap gap-3 justify-center">
                    {design.color_palette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-700 hover:border-gray-500 transition-all duration-200 cursor-default group"
                      >
                        <div
                          className="w-3 h-3 rounded-full shadow-md"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-gray-300 text-xs group-hover:text-white transition-colors">
                          {color.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Description */}
                {design.color_palette.description && (
                  <div className="max-w-lg mx-auto h-48 overflow-y-auto">
                    <p
                      className={`text-gray-300 whitespace-pre-wrap ${getTextAlign(design.textStyles?.colorDescription?.alignment)}`}
                      style={{
                        fontFamily:
                          design.textStyles?.colorDescription?.fontFamily === 'serif'
                            ? 'Georgia, serif'
                            : design.textStyles?.colorDescription?.fontFamily === 'sans'
                            ? 'Arial, sans-serif'
                            : 'Space Grotesk, sans-serif',
                        fontSize: `${design.textStyles?.colorDescription?.fontSize || 14}px`,
                        lineHeight: `${design.textStyles?.colorDescription?.lineHeight || 1.6}em`,
                        fontWeight: design.textStyles?.colorDescription?.bold ? 'bold' : 'normal',
                      }}
                    >
                      {design.color_palette.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Process Section */}
            {design.process_description && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight text-center">Process</h2>
                <div className="max-w-lg mx-auto h-64 overflow-y-auto pr-4">
                  <p
                    className={`text-gray-300 whitespace-pre-wrap ${getTextAlign(design.textStyles?.process?.alignment)}`}
                    style={{
                      fontFamily:
                        design.textStyles?.process?.fontFamily === 'serif'
                          ? 'Georgia, serif'
                          : design.textStyles?.process?.fontFamily === 'sans'
                          ? 'Arial, sans-serif'
                          : 'Space Grotesk, sans-serif',
                      fontSize: `${design.textStyles?.process?.fontSize || 16}px`,
                      lineHeight: `${design.textStyles?.process?.lineHeight || 1.6}em`,
                      fontWeight: design.textStyles?.process?.bold ? 'bold' : 'normal',
                    }}
                  >
                    {design.process_description}
                  </p>
                </div>

                {/* Process Images */}
                {design.process_images.length > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    {design.process_images.map((img, index) => (
                      <div key={index} className="aspect-square bg-gray-900 rounded-lg overflow-hidden">
                        <img src={img} alt={`Process ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Images Gallery Section */}
            {design.images.length > 0 && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {design.images.map((img, index) => (
                    <div key={index} className="aspect-square bg-gray-900 rounded-lg overflow-hidden group cursor-pointer">
                      <img
                        src={img}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mockups Section */}
            {design.mockups.length > 0 && (
              <div className="space-y-4">
                {design.mockups.map((mockup, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden aspect-video bg-gray-900 cursor-pointer group hover:opacity-80 transition-opacity duration-300"
                    onClick={() => setSelectedMockup(mockup)}
                  >
                    <img
                      src={mockup}
                      alt={`Mockup ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Video Section */}
            {design.video_url && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight text-center">Video</h2>
                <div
                  className="aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={() => setSelectedVideoProject(design)}
                >
                  {isYouTubeUrl(design.video_url) ? (
                    <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block mb-4">
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-200 transition">
                            <span className="text-3xl ml-1">▶</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm">Play video</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-200 transition">
                        <span className="text-3xl ml-1">▶</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Related Case Study Section */}
            {relatedCaseStudy && relatedCaseStudy.id && (
              <div className="space-y-8 border-t border-gray-800 pt-12 mt-12">
                <h2 className="text-2xl font-bold tracking-tight text-center">Related App Case Study</h2>

                <Link href={`/case-studies/${relatedCaseStudy.id}`}>
                  <div className="group cursor-pointer max-w-sm mx-auto">
                    {/* Square Image Card */}
                    <div className="bg-gray-900/50 rounded-lg overflow-hidden p-6 space-y-4">
                      {relatedCaseStudy.hero_image && (
                        <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={relatedCaseStudy.hero_image}
                            alt={relatedCaseStudy.title || 'Case Study'}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                          />
                        </div>
                      )}

                      {/* Case Study Info */}
                      <div className="space-y-3">
                        {relatedCaseStudy.title && (
                          <h3 className="text-lg font-bold group-hover:text-gray-300 transition line-clamp-2">
                            {relatedCaseStudy.title}
                          </h3>
                        )}

                        {/* Meta Info */}
                        {(relatedCaseStudy.year || relatedCaseStudy.role) && (
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            {relatedCaseStudy.year && <span>{relatedCaseStudy.year}</span>}
                            {relatedCaseStudy.year && relatedCaseStudy.role && <span>•</span>}
                            {relatedCaseStudy.role && <span className="line-clamp-1">{relatedCaseStudy.role}</span>}
                          </div>
                        )}

                        {relatedCaseStudy.hero_description && (
                          <p className="text-gray-400 text-sm line-clamp-2">
                            {relatedCaseStudy.hero_description}
                          </p>
                        )}

                        <div className="pt-2">
                          <span className="inline-block px-4 py-2 border border-gray-700 rounded text-sm group-hover:border-white group-hover:text-white transition">
                            View Case Study →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

          </div>
        </div>

        {/* Mockup Zoom Modal */}
        {selectedMockup && (
          <>
            <style>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                }
                to {
                  opacity: 1;
                }
              }
              @keyframes zoomInSmooth {
                from {
                  opacity: 0;
                  transform: scale(0.9);
                }
                to {
                  opacity: 1;
                  transform: scale(1.3);
                }
              }
              .mockup-modal-backdrop {
                animation: fadeIn 0.4s ease-out forwards;
              }
              .mockup-image {
                animation: zoomInSmooth 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }
            `}</style>
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 mockup-modal-backdrop"
              onClick={() => setSelectedMockup(null)}
            >
              <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setSelectedMockup(null)}
                  className="absolute top-4 right-4 z-50 text-white text-3xl hover:text-gray-300 transition bg-black/50 w-10 h-10 flex items-center justify-center rounded"
                >
                  ✕
                </button>

                <img
                  src={selectedMockup}
                  alt="Zoomed mockup"
                  className="mockup-image max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </>
        )}

        {/* Video Modal */}
        {selectedVideoProject && selectedVideoProject.video_url && (
          <div
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={() => setSelectedVideoProject(null)}
          >
            <div className="w-full h-full relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setSelectedVideoProject(null)}
                className="absolute top-4 right-4 z-50 text-white text-3xl hover:text-gray-300 transition bg-black/50 w-10 h-10 flex items-center justify-center rounded"
              >
                ✕
              </button>

              {isYouTubeUrl(selectedVideoProject.video_url) ? (
                <iframe
                  src={getYouTubeEmbedUrl(selectedVideoProject.video_url) + '?autoplay=1'}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video controls autoPlay className="w-full h-full">
                  <source src={selectedVideoProject.video_url} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-800 py-16 px-8 mt-24">
          <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
            <p>© 2026 Sharon Moshe Attias | OpenMindStudio</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
