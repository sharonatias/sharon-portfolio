'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

// Image reveal with mask effect
export const ImageReveal = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) => {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
      </motion.div>
    </motion.div>
  )
}

// Image scale on hover
export const HoverScaleImage = ({
  src,
  alt,
  className = '',
  scale = 1.05,
  width = 800,
  height = 600,
}: {
  src: string
  alt: string
  className?: string
  scale?: number
  width?: number
  height?: number
}) => {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      whileHover={{ scale }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
    </motion.div>
  )
}

// Image with parallax text overlay
export const ImageWithParallaxText = ({
  src,
  alt,
  title,
  subtitle,
  className = '',
  width = 800,
  height = 600,
}: {
  src: string
  alt: string
  title: string
  subtitle?: string
  className?: string
  width?: number
  height?: number
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden group ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto group-hover:scale-110 transition-transform duration-500" />

      <motion.div
        className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {subtitle && <p className="text-gray-200 mt-2">{subtitle}</p>}
      </motion.div>
    </motion.div>
  )
}

// Gradient overlay image
export const GradientImageOverlay = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.8 }}
      />
    </motion.div>
  )
}

// Image with floating effect
export const FloatingImage = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
  duration = 3,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  duration?: number
}) => {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
    </motion.div>
  )
}

// Image flip on scroll
export const FlipImage = ({
  src,
  alt,
  className = '',
  width = 800,
  height = 600,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, rotateY: 90 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ perspective: 1000 }}
    >
      <Image src={src} alt={alt} width={width} height={height} className="w-full h-auto" />
    </motion.div>
  )
}
