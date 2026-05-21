'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HeroVideo } from '@/lib/types'

interface HeroSectionProps {
  video: HeroVideo
  showHeader?: boolean
  onMenuToggle?: (open: boolean) => void
  menuOpen?: boolean
}

export default function HeroSection({ video, showHeader = true, onMenuToggle, menuOpen = false }: HeroSectionProps) {
  const isYouTubeUrl = (url?: string) => url?.includes('youtube') || url?.includes('youtu.be')

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)?.[1]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

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
            />
          ) : (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            >
              <source src={video.video_url} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black/30" />
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
        <header className={`fixed top-0 left-0 right-0 p-8 transition-all duration-300 ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} z-40`}>
          <Link href="/" className="max-w-7xl block hover:opacity-80 transition">
            <h1 className="text-lg font-light tracking-widest text-white mb-1">SHARON MOSHE ATTIAS</h1>
            <h2 className="text-sm font-light tracking-widest text-gray-300">CREATIVE & DIRECTOR</h2>
          </Link>
        </header>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between text-white px-8 py-16">
        {/* Title at top center */}
        <div className="flex items-center justify-center h-full">
          {video.title_en && (
            <h1 className="text-6xl md:text-7xl font-light tracking-tight text-center max-w-2xl hover:opacity-80 transition duration-300">
              {video.title_en}
            </h1>
          )}
        </div>

        {/* Description and Arrow at bottom */}
        <div className="flex justify-between items-end">
          {video.description && (
            <p className="text-gray-300 text-base leading-relaxed max-w-xs">
              {video.description}
            </p>
          )}

          {/* Scroll Down Arrow */}
          <div className="flex-1 flex justify-center">
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
