import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { CookieBanner } from './components/CookieBanner'
import { AccessibilityWidget } from './components/AccessibilityWidget'
import { MediaFallback } from '../components/MediaFallback'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'Sharon Moshe Attias - Creative & Director',
  description: 'Portfolio of Sharon Moshe Attias',
  other: {
    'X-UA-Compatible': 'IE=edge',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className={spaceGrotesk.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-space-grotesk">
        {children}
        <MediaFallback />
        <CookieBanner />
        <AccessibilityWidget />
      </body>
    </html>
  )
}
// Trigger rebuild
