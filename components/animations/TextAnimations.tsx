'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface TextAnimationProps {
  children: ReactNode
  variant?: 'fadeIn' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'blur'
  delay?: number
  duration?: number
  className?: string
}

const variants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  slideInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
  },
}

export const FadeInText = (props: TextAnimationProps) => {
  return <AnimatedText {...props} variant="fadeIn" />
}

export const SlideInUpText = (props: TextAnimationProps) => {
  return <AnimatedText {...props} variant="slideInUp" />
}

export const SlideInLeftText = (props: TextAnimationProps) => {
  return <AnimatedText {...props} variant="slideInLeft" />
}

export const SlideInDownText = (props: TextAnimationProps) => {
  return <AnimatedText {...props} variant="slideInDown" />
}

export const SlideInRightText = (props: TextAnimationProps) => {
  return <AnimatedText {...props} variant="slideInRight" />
}

export const ScaleInText = (props: TextAnimationProps) => {
  return <AnimatedText {...props} variant="scaleIn" />
}

export const BlurInText = (props: TextAnimationProps) => {
  return <AnimatedText {...props} variant="blur" />
}

function AnimatedText({
  children,
  variant = 'fadeIn',
  delay = 0,
  duration = 0.6,
  className = '',
}: TextAnimationProps) {
  const variantConfig = variants[variant]

  return (
    <motion.div
      initial={variantConfig.initial}
      whileInView={variantConfig.animate}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Letter-by-letter animation
export const LetterByLetterText = ({
  text,
  className = '',
  delay = 0,
}: {
  text: string
  className?: string
  delay?: number
}) => {
  const letters = text.split('')

  return (
    <motion.span className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.3,
            delay: delay + index * 0.05,
            ease: 'easeOut',
          }}
        >
          {letter === ' ' ? ' ' : letter}
        </motion.span>
      ))}
    </motion.span>
  )
}

// Staggered children animation
export const StaggerContainer = ({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
