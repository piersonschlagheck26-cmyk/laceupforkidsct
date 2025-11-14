'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Sneaker {
  id: string
  left: number
  rotation: number
  duration: number
  endY: number
  scale: number
}

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const isActiveRef = useRef(true)

  useEffect(() => {
    // Check if home section is visible
    const checkVisibility = () => {
      const homeSection = document.getElementById('home')
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect()
        isActiveRef.current = rect.top < window.innerHeight && rect.bottom > 0
      }
    }

    checkVisibility()
    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    // Add first sneaker immediately
    const firstSneaker: Sneaker = {
      id: `sneaker-${Date.now()}-${Math.random()}`,
      left: 10 + Math.random() * 80,
      rotation: (Math.random() - 0.5) * 40,
      duration: 5 + Math.random() * 3,
      endY: 450 + Math.random() * 50,
      scale: 0.6 + Math.random() * 0.3,
    }
    setSneakers([firstSneaker])

    // Add new sneakers periodically
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        if (prev.length >= 20) return prev

        const newSneaker: Sneaker = {
          id: `sneaker-${Date.now()}-${Math.random()}`,
          left: 10 + Math.random() * 80,
          rotation: (Math.random() - 0.5) * 40,
          duration: 5 + Math.random() * 3,
          endY: 450 + Math.random() * 50 + (prev.length * 15), // Pile up naturally
          scale: 0.6 + Math.random() * 0.3,
        }

        return [...prev, newSneaker]
      })
    }, 1000) // New shoe every second

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, []) // Empty deps - only run once on mount

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-[5]"
    >
      {sneakers.map((sneaker) => (
        <motion.div
          key={sneaker.id}
          className="absolute"
          initial={{ 
            y: -100, 
            opacity: 0, 
            scale: 0.5,
            rotate: sneaker.rotation - 20
          }}
          animate={{ 
            y: sneaker.endY, 
            opacity: 0.9, 
            scale: sneaker.scale,
            rotate: sneaker.rotation
          }}
          transition={{ 
            duration: sneaker.duration,
            ease: 'easeIn',
            opacity: { duration: 0.3 }
          }}
          style={{ 
            left: `${sneaker.left}%`,
          }}
        >
          <Image
            src="/images/sneaker-clipart.png"
            alt="Falling sneaker"
            width={70}
            height={70}
            className="drop-shadow-lg"
            unoptimized
            priority={false}
          />
        </motion.div>
      ))}
    </div>
  )
}
