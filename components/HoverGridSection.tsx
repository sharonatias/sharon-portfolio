'use client'

import { useState } from 'react'

interface HoverImage {
  main: string
  hover?: string
}

interface HoverGridSectionProps {
  title: string
  images: string[] | HoverImage[]
  gap?: number
}

export default function HoverGridSection({ title, images, gap = 4 }: HoverGridSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Convert images to HoverImage format
  const hoverImages: HoverImage[] = images.map((img) => {
    if (typeof img === 'string') {
      return { main: img, hover: undefined }
    }
    return img as HoverImage
  })

  const gapClass = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }[gap] || 'gap-4'

  return (
    <section className="py-12 lg:py-16 px-4 sm:px-8 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-8 lg:mb-12 text-black">
          {title}
        </h2>

        {/* Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${gapClass} w-full auto-rows-max`}>
          {hoverImages.map((img, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden bg-gray-100 w-full h-[280px] cursor-pointer group"
              onMouseEnter={() => img.hover && setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Main Image */}
              <img
                src={img.main}
                alt={`Image ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  hoveredIndex === idx ? 'opacity-0' : 'opacity-100'
                }`}
                loading="lazy"
              />

              {/* Hover Image */}
              {img.hover && (
                <img
                  src={img.hover}
                  alt={`Image ${idx + 1} Hover`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    hoveredIndex === idx ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
