'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { HeroVideo } from '@/lib/types'

interface HeroSectionProps {
  video: HeroVideo
  showHeader?: boolean
  onMenuToggle?: (open: boolean) => void
  menuOpen?: boolean
}

export default function HeroSection({ video, showHeader = true, onMenuToggle, menuOpen = false }: HeroSectionProps) {
  const [charOffsets, setCharOffsets] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const titleRef = useRef<HTMLDivElement>(null)
  const isYouTubeUrl = (url?: string) => url?.includes('youtube') || url?.includes('youtu.be')

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => {
      console.log('Minimum load time reached')
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.message.trim()) {
      const phoneNumber = '972526512503'
      const encodedMessage = encodeURIComponent(formData.message)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
      window.open(whatsappUrl, '_blank')
      setFormData({ name: '', email: '', message: '' })
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!titleRef.current) return

    const chars = titleRef.current.querySelectorAll('[data-char]')
    const newOffsets: { [key: number]: { x: number; y: number } } = {}

    chars.forEach((char, index) => {
      const rect = char.getBoundingClientRect()
      const charCenterX = rect.left + rect.width / 2
      const charCenterY = rect.top + rect.height / 2

      const mouseX = e.clientX
      const mouseY = e.clientY

      const deltaX = mouseX - charCenterX
      const deltaY = mouseY - charCenterY
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      // If mouse is close enough, make character move away
      if (distance < 100) {
        const angle = Math.atan2(deltaY, deltaX)
        const pushDistance = 100 - distance
        newOffsets[index] = {
          x: Math.cos(angle) * pushDistance * 0.8,
          y: Math.sin(angle) * pushDistance * 0.8
        }
      } else {
        newOffsets[index] = { x: 0, y: 0 }
      }
    })

    setCharOffsets(newOffsets)
  }

  const handleMouseLeave = () => {
    setCharOffsets({})
  }

  const renderTextWithChars = (text: string) => {
    return text.split('').map((char, i) => {
      const nextChar = text[i + 1]
      const prevChar = text[i - 1]
      const isPunct = /[.,!?;:']/.test(char)
      const isAfterLetter = prevChar && /[a-zA-Z]/.test(prevChar)

      return (
        <span
          key={i}
          data-char={i}
          style={{
            display: 'inline-block',
            transform: `translate(${charOffsets[i]?.x || 0}px, ${charOffsets[i]?.y || 0}px)`,
            transition: 'transform 0.2s ease-out',
            marginRight: char === ' ' ? '0.15em' : (isPunct && isAfterLetter ? '-0.05em' : '0'),
            marginLeft: isPunct && isAfterLetter ? '-0.1em' : '0'
          }}
        >
          {char}
        </span>
      )
    })
  }

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

  const handleVideoReady = () => {
    setTimeout(() => {
      setVideoLoaded(true)
    }, 1200)
  }

  console.log('Rendering HeroSection with videoLoaded:', videoLoaded, 'video.video_url:', video.video_url)

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Video Background */}
      {video.video_url && (
        <div className="absolute inset-0 z-0">
          {isYouTubeUrl(video.video_url) ? (
            <iframe
              src={getYouTubeEmbedUrl(video.video_url)}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay"
              allowFullScreen
              onLoad={handleVideoReady}
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              onCanPlay={handleVideoReady}
            >
              <source src={video.video_url} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black/30" />

          {/* Loading Spinner */}
          {!videoLoaded && (
            <div className="absolute inset-0 z-10 bg-black flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-gray-600 border-t-white rounded-full" style={{ animation: 'spin 1s linear infinite' }} />
                <p className="text-gray-400 text-sm tracking-widest">LOADING</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hamburger Menu Button */}
      <button
        onClick={() => onMenuToggle?.(!menuOpen)}
        className="fixed top-6 right-6 flex flex-col gap-2 w-8 h-8 justify-center items-center cursor-pointer hover:opacity-70 transition z-50 bg-transparent"
        aria-label="Toggle menu"
      >
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2.5' : ''}`} />
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-8 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
      </button>

      {/* Header */}
      {showHeader && (
        <header className={`fixed top-0 left-0 right-0 px-8 lg:px-20 pt-8 pb-16 transition-all duration-300 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} z-40`}>
          <Link href="/" className="max-w-7xl block hover:opacity-80 transition">
            <h1 className="text-2xl font-light tracking-widest text-white" style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}>SHARON MOSHE ATTIAS</h1>
          </Link>
        </header>
      )}

      {/* Gradient Overlay at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-screen z-5 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col justify-between text-white px-8 lg:px-20 py-16"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top - Contact Form Right Side */}
        <div className="flex justify-end mt-64">
          <form onSubmit={handleFormSubmit} className="w-full max-w-lg">
            <div className="mb-4">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                rows={5}
                autoFocus
                className="w-full bg-transparent text-white focus:outline-none pb-4 text-6xl lg:text-7xl resize-none"
                style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em', caretColor: 'rgba(255,255,255,0.7)' }}
              />
            </div>
            {formData.message && (
              <button
                type="submit"
                className="text-white hover:text-pink-500 transition text-lg tracking-widest"
                style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400 }}
              >
                SEND TO SHARON →
              </button>
            )}
          </form>
        </div>

        {/* Bottom - Description Left Aligned */}
        <div className="flex flex-col gap-10">
          <div className="max-w-2xl">
            <p className="text-sm lg:text-base tracking-widest mb-8 text-gray-300">FILMMAKER • CREATIVE DIRECTOR</p>
            <h2
              ref={titleRef}
              className="text-5xl lg:text-7xl mb-8 leading-tight"
              style={{ fontFamily: '"Bebas Neue", sans-serif', fontWeight: 400, letterSpacing: '-0.02em', textWrap: 'balance' }}
            >
              {renderTextWithChars('Creating documentaries,')}
              <br />
              {renderTextWithChars('brands and visual experiences.')}
            </h2>
            <p className="text-lg lg:text-xl text-gray-400 leading-relaxed">
              10+ years crafting stories<br />
              through film, design and emerging technologies.
            </p>
          </div>

          {/* Scroll Down Arrow */}
          <div>
            <svg
              className="w-5 h-5 text-gray-400 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>

    </div>
  )
}
