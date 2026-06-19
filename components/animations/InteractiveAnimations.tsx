'use client'

import { motion } from 'framer-motion'
import { useState, ReactNode } from 'react'

// Animated counter
export const AnimatedCounter = ({
  from = 0,
  to = 100,
  duration = 2,
  className = '',
  suffix = '',
  prefix = '',
}: {
  from?: number
  to: number
  duration?: number
  className?: string
  suffix?: string
  prefix?: string
}) => {
  const [count, setCount] = useState(from)

  return (
    <motion.div
      className={className}
      onViewportEnter={() => {
        let start = Date.now()
        const timer = setInterval(() => {
          const progress = (Date.now() - start) / (duration * 1000)
          if (progress < 1) {
            setCount(Math.floor(from + (to - from) * progress))
          } else {
            setCount(to)
            clearInterval(timer)
          }
        }, 16)
      }}
    >
      {prefix}
      {count}
      {suffix}
    </motion.div>
  )
}

// Animated button with hover effect
export const HoverButton = ({
  children,
  className = '',
  onClick,
  href,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
}) => {
  const Element = href ? 'a' : 'button'

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Element
        href={href}
        onClick={onClick}
        className={`relative overflow-hidden ${className}`}
      >
        <motion.div
          className="absolute inset-0 bg-white/10"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.5 }}
        />
        {children}
      </Element>
    </motion.div>
  )
}

// Underline animation on hover
export const UnderlineHover = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <motion.div className={`relative inline-block ${className}`}>
      {children}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-600"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

// Glitch effect on hover
export const GlitchText = ({
  text,
  className = '',
}: {
  text: string
  className?: string
}) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover="hover"
    >
      <motion.span
        className="relative inline-block"
        variants={{
          hover: {
            x: [0, -2, 2, -2, 0],
            transition: { duration: 0.3 },
          },
        }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-cyan-400/50"
        variants={{
          hover: {
            x: [0, 2, -2, 2, 0],
            transition: { duration: 0.3 },
          },
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  )
}

// Animated gradient text
export const GradientText = ({
  text,
  className = '',
  from = 'from-cyan-400',
  to = 'to-purple-600',
}: {
  text: string
  className?: string
  from?: string
  to?: string
}) => {
  return (
    <motion.span
      className={`bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent ${className}`}
      animate={{
        backgroundPosition: ['0%', '100%', '0%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {text}
    </motion.span>
  )
}

// Pulsing element
export const PulseElement = ({
  children,
  className = '',
  scale = 1.05,
}: {
  children: ReactNode
  className?: string
  scale?: number
}) => {
  return (
    <motion.div
      className={className}
      animate={{ scale: [1, scale, 1] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// Float animation
export const FloatElement = ({
  children,
  className = '',
  distance = 10,
  duration = 3,
}: {
  children: ReactNode
  className?: string
  distance?: number
  duration?: number
}) => {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -distance, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// Rotate animation
export const RotateElement = ({
  children,
  className = '',
  duration = 4,
}: {
  children: ReactNode
  className?: string
  duration?: number
}) => {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.div>
  )
}

// Fade in and out loop
export const FadeLoop = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <motion.div
      className={className}
      animate={{ opacity: [0, 1, 0] }}
      transition={{
        duration: 3,
        repeat: Infinity,
      }}
    >
      {children}
    </motion.div>
  )
}

// Bounce animation
export const BounceElement = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -20, 0] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}
