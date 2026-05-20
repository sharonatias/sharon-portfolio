'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  const contactInfo = {
    email: 'sharonatias@gmail.com',
    phone: '+972526512503',
    whatsapp: 'https://wa.me/972526512503',
    location: 'Tel-Aviv, Israel',
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 p-8 flex justify-between items-start">
        <Link href="/" className="hover:opacity-80 transition">
          <div>
            <h1 className="text-lg font-light tracking-widest text-white mb-1">SHARON MOSHE ATTIAS</h1>
            <h2 className="text-sm font-light tracking-widest text-gray-300">CREATIVE & DIRECTOR</h2>
          </div>
        </Link>
        <div className="text-2xl font-medium tracking-wide mr-20">Contact</div>
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
            <a href="/contact" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Contact
            </a>
            <a href="/admin" onClick={() => setMenuOpen(false)} className="text-white hover:text-pink-500 transition text-left">
              Admin
            </a>
          </div>
        </nav>
      )}

      {/* Content - Centered */}
      <section className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-2xl space-y-12">
          {/* Tagline */}
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-4 text-white">
              Have something in mind?
            </h2>
            <p className="text-xl md:text-2xl font-light text-gray-400">
              Let's make it count
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-lg text-gray-300 hover:text-pink-500 transition inline-flex items-center gap-2"
              >
                <span className="text-pink-500">✉</span>
                {contactInfo.email}
              </a>
            </div>

            {/* Phone */}
            <div>
              <a
                href={`tel:${contactInfo.phone}`}
                className="text-lg text-gray-300 hover:text-pink-500 transition inline-flex items-center gap-2"
              >
                <span className="text-pink-500">☎</span>
                {contactInfo.phone}
              </a>
            </div>

            {/* WhatsApp */}
            <div>
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg text-gray-300 hover:text-pink-500 transition inline-flex items-center gap-2"
              >
                <span className="text-pink-500">💬</span>
                WhatsApp
              </a>
            </div>

            {/* Location */}
            <div>
              <p className="text-lg text-gray-300 inline-flex items-center gap-2">
                <span className="text-pink-500">📍</span>
                {contactInfo.location}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 py-6">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-gray-600 text-sm">or follow</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/sharon.attias/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition text-sm"
            >
              Instagram
            </a>
            <a
              href="https://www.youtube.com/@sharonattias7274"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-pink-500 transition text-sm"
            >
              YouTube
            </a>
          </div>
        </div>
      </section>

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
