import type { Metadata, Viewport } from 'next'
import { Archivo, Heebo } from 'next/font/google'
import './globals.css'
import { CookieBanner } from './components/CookieBanner'
import { AccessibilityWidget } from './components/AccessibilityWidget'
import { MediaFallback } from '../components/MediaFallback'

// Archivo's width axis gives one family two voices: condensed for titles, regular for reading.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
})

// Hebrew glyphs (project titles, legal pages) fall back to Heebo.
const heebo = Heebo({
  subsets: ['hebrew'],
  variable: '--font-heebo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sharon Moshe Attias — Director & creative',
  description:
    'Director and creative. Documentaries, commercials, brand identities and AI-driven work by Sharon Moshe Attias.',
}

export const viewport: Viewport = {
  themeColor: '#000000',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${archivo.variable} ${heebo.variable}`}>
      <body>
        {children}
        <MediaFallback />
        <CookieBanner />
        <AccessibilityWidget />
      </body>
    </html>
  )
}
