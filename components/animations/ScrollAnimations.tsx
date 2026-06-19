'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'

// Parallax effect on scroll
export const ParallaxSection = ({
  children,
  offset = 50,
  className = '',
}: {
  children: ReactNode
  offset?: number
  className?: string
}) => {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, (value) => value * 0.5 - offset)

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// Reveal on scroll
export const RevealOnScroll = ({
  children,
  className = '',
  direction = 'up',
}: {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
}) => {
  const getInitialState = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 40 }
      case 'down':
        return { opacity: 0, y: -40 }
      case 'left':
        return { opacity: 0, x: -40 }
      case 'right':
        return { opacity: 0, x: 40 }
      default:
        return { opacity: 0, y: 40 }
    }
  }

  return (
    <motion.div
      initial={getInitialState()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll-based opacity
export const ScrollOpacity = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <motion.div ref={ref} style={{ opacity }} className={className}>
      {children}
    </motion.div>
  )
}

// Scale on scroll
export const ScaleOnScroll = ({
  children,
  className = '',
  minScale = 0.8,
  maxScale = 1,
}: {
  children: ReactNode
  className?: string
  minScale?: number
  maxScale?: number
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [minScale, maxScale])

  return (
    <motion.div ref={ref} style={{ scale }} className={className}>
      {children}
    </motion.div>
  )
}

// Progress bar on scroll
export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

// Sticky section with animation
export const StickySection = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <motion.div
      className={`sticky top-0 ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

// Scroll to reveal with blur effect
export const BlurReveal = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scroll-triggered rotation
export const RotateOnScroll = ({
  children,
  className = '',
  rotation = 360,
}: {
  children: ReactNode
  className?: string
  rotation?: number
}) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  })
  const rotate = useTransform(scrollYProgress, [0, 1], [0, rotation])

  return (
    <motion.div ref={ref} style={{ rotate }} className={className}>
      {children}
    </motion.div>
  )
}
