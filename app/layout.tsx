import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { CookieBanner } from './components/CookieBanner'
import { AccessibilityWidget } from './components/AccessibilityWidget'

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
    <html lang="he" dir="rtl" className={`${spaceGrotesk.variable} rtl`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="font-space-grotesk text-right">
        {children}
        <CookieBanner />
        <AccessibilityWidget />
      </body>
    </html>
  )
}
// Trigger rebuild
