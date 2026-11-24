'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Brand case studies are listed together with all other work.
export default function BrandCaseStudiesIndex() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/projects?c=brand_design')
  }, [router])
  return <main className="tone-dark min-h-screen" />
}
