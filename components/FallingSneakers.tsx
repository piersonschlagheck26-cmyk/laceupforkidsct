'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Sneaker {
  id: string
  startLeft: number
  endLeft: number
  rotation: number
  endRotation: number
  duration: number
  endY: number
  scale: number
  colorFilter: string
}

// Color filters matching the site palette (gold and red tones)
const COLOR_FILTERS = [
  'brightness(1.1) saturate(1.2) hue-rotate(0deg)', // Original
  'brightness(1.15) saturate(1.3) hue-rotate(5deg) sepia(0.2)', // Warm gold
  'brightness(1.1) saturate(1.4) hue-rotate(350deg) sepia(0.3)', // Red-orange
  'brightness(1.2) saturate(1.1) hue-rotate(15deg) sepia(0.15)', // Golden yellow
  'brightness(1.05) saturate(1.3) hue-rotate(340deg) sepia(0.25)', // Deep red
  'brightness(1.18) saturate(1.25) hue-rotate(10deg) sepia(0.2)', // Amber
]

const PILE_CENTER_X = 50 // Center of screen
const PILE_START_Y = 450 // Above CTA buttons
const MAX_SNEAKERS = 35

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])
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

    // Calculate sand-like pile position
    const getPilePosition = (index: number) => {
      // Start from center, spread out like sand as pile grows
      const pileHeight = index * 12 // Each shoe adds ~12px height
      const spreadAngle = Math.min(index * 2, 45) // Spread angle increases with pile
      const horizontalOffset = (Math.random() - 0.5) * spreadAngle * 0.8 // Random spread
      
      return {
        endLeft: PILE_CENTER_X + horizontalOffset, // Spread from center
        endY: PILE_START_Y + pileHeight + Math.random() * 15, // Stack up
        endRotation: (Math.random() - 0.5) * 60, // Tumble rotation
      }
    }

    // Create first sneaker
    const firstPos = getPilePosition(0)
    const firstSneaker: Sneaker = {
      id: `sneaker-${Date.now()}-${Math.random()}`,
      startLeft: PILE_CENTER_X, // Start from center
      endLeft: firstPos.endLeft,
      rotation: (Math.random() - 0.5) * 30,
      endRotation: firstPos.endRotation,
      duration: 2.5 + Math.random() * 1.5,
      endY: firstPos.endY,
      scale: 0.65 + Math.random() * 0.25,
      colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
    }
    setSneakers([firstSneaker])

    // Add new sneakers
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        if (prev.length >= MAX_SNEAKERS) return prev

        const pos = getPilePosition(prev.length)
        const newSneaker: Sneaker = {
          id: `sneaker-${Date.now()}-${Math.random()}`,
          startLeft: PILE_CENTER_X, // Always start from center
          endLeft: pos.endLeft,
          rotation: (Math.random() - 0.5) * 30,
          endRotation: pos.endRotation,
          duration: 2.5 + Math.random() * 1.5,
          endY: pos.endY,
          scale: 0.65 + Math.random() * 0.25,
          colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
        }

        return [...prev, newSneaker]
      })
    }, 500)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {sneakers.map((sneaker) => (
        <motion.div
          key={sneaker.id}
          className="absolute"
          initial={{ 
            y: -80, 
            x: '0%',
            opacity: 0, 
            scale: 0.5,
            rotate: sneaker.rotation
          }}
          animate={{ 
            y: sneaker.endY,
            x: `${sneaker.endLeft - sneaker.startLeft}vw`, // Tumble horizontally using viewport width
            opacity: 0.5, 
            scale: sneaker.scale,
            rotate: sneaker.endRotation // Tumble rotation
          }}
          transition={{ 
            duration: sneaker.duration,
            ease: [0.3, 0, 0.2, 1], // Ease in for sand-like fall
            opacity: { duration: 0.4 }
          }}
          style={{
            left: `${sneaker.startLeft}%`,
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
              filter: sneaker.colorFilter,
            }}
            unoptimized
            priority={false}
          />
        </motion.div>
      ))}
    </div>
  )
}
