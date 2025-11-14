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

    // Calculate bottom position based on viewport
    const getBottomY = (index: number) => {
      const viewportHeight = window.innerHeight
      const startY = viewportHeight * 0.6 // Start piling at 60% down
      return startY + (index * 18) + Math.random() * 30 // Stack down to bottom
    }

    // Add first sneaker immediately
    const firstSneaker: Sneaker = {
      id: `sneaker-${Date.now()}-${Math.random()}`,
      left: 10 + Math.random() * 80,
      rotation: (Math.random() - 0.5) * 40,
      duration: 2.5 + Math.random() * 1.5, // Faster: 2.5-4 seconds
      endY: getBottomY(0),
      scale: 0.6 + Math.random() * 0.3,
    }
    setSneakers([firstSneaker])

    // Add new sneakers more frequently
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        if (prev.length >= 30) return prev // Allow more shoes

        const newSneaker: Sneaker = {
          id: `sneaker-${Date.now()}-${Math.random()}`,
          left: 10 + Math.random() * 80,
          rotation: (Math.random() - 0.5) * 40,
          duration: 2.5 + Math.random() * 1.5, // Faster: 2.5-4 seconds
          endY: getBottomY(prev.length), // Pile down to bottom
          scale: 0.6 + Math.random() * 0.3,
        }

        return [...prev, newSneaker]
      })
    }, 500) // More frequent: every 500ms (half a second)

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
            opacity: 0.45, 
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
            style={{ 
              backgroundColor: 'transparent',
              opacity: 1, // Image itself is fully opaque, container handles transparency
            }}
            unoptimized
            priority={false}
          />
        </motion.div>
      ))}
    </div>
  )
}
