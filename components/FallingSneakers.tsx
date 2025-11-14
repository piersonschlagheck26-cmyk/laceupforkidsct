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
  width: number
  height: number
}

// Color filters matching the site palette (gold and red tones)
const COLOR_FILTERS = [
  'brightness(1.1) saturate(1.2) hue-rotate(0deg)',
  'brightness(1.15) saturate(1.3) hue-rotate(5deg) sepia(0.2)',
  'brightness(1.1) saturate(1.4) hue-rotate(350deg) sepia(0.3)',
  'brightness(1.2) saturate(1.1) hue-rotate(15deg) sepia(0.15)',
  'brightness(1.05) saturate(1.3) hue-rotate(340deg) sepia(0.25)',
  'brightness(1.18) saturate(1.25) hue-rotate(10deg) sepia(0.2)',
]

const PILE_CENTER_X = 50 // Center of screen
const BUTTON_AREA_Y = 420 // Just above CTA buttons
const SHOE_SIZE = 70 // Base size in pixels
const MAX_SNEAKERS = 40

// Check if two shoes would overlap (using viewport width for percentage conversion)
const checkCollision = (sneaker1: Sneaker, sneaker2: Sneaker, viewportWidth: number): boolean => {
  const margin = 8 // Margin to prevent touching
  const w1 = sneaker1.width / 2
  const h1 = sneaker1.height / 2
  const w2 = sneaker2.width / 2
  const h2 = sneaker2.height / 2

  // Convert percentage to pixels for x position
  const x1 = (sneaker1.endLeft / 100) * viewportWidth
  const y1 = sneaker1.endY
  const x2 = (sneaker2.endLeft / 100) * viewportWidth
  const y2 = sneaker2.endY

  // Check bounding box overlap
  return (
    Math.abs(x1 - x2) < (w1 + w2 + margin) &&
    Math.abs(y1 - y2) < (h1 + h2 + margin)
  )
}

// Find a non-overlapping position
const findValidPosition = (
  existingSneakers: Sneaker[],
  centerX: number,
  targetY: number,
  viewportWidth: number
): { endLeft: number; endY: number } | null => {
  const maxAttempts = 50
  const spreadRange = 25 // How far to spread horizontally (in percentage)

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const scale = 0.65 + Math.random() * 0.25
    const width = SHOE_SIZE * scale
    const height = SHOE_SIZE * scale
    
    const testSneaker: Sneaker = {
      id: 'test',
      startLeft: centerX,
      endLeft: centerX + (Math.random() - 0.5) * spreadRange,
      rotation: 0,
      endRotation: (Math.random() - 0.5) * 60,
      duration: 0,
      endY: targetY + Math.random() * 15 - 7.5,
      scale,
      colorFilter: '',
      width,
      height,
    }

    // Check collision with all existing shoes
    const hasCollision = existingSneakers.some((existing) =>
      checkCollision(testSneaker, existing, viewportWidth)
    )

    if (!hasCollision) {
      return { endLeft: testSneaker.endLeft, endY: testSneaker.endY }
    }
  }

  return null
}

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])
  const isActiveRef = useRef(true)

  useEffect(() => {
    // Check if home section is visible
    const checkVisibility = () => {
      const homeSection = document.getElementById('home')
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect()
        // Continue until scrolled past
        isActiveRef.current = rect.bottom > 0
      }
    }

    checkVisibility()
    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    // Create a new sneaker
    const createSneaker = (existing: Sneaker[]): Sneaker | null => {
      if (existing.length >= MAX_SNEAKERS) return null

      const viewportWidth = window.innerWidth
      const scale = 0.65 + Math.random() * 0.25
      const width = SHOE_SIZE * scale
      const height = SHOE_SIZE * scale

      // Try to place just above buttons, stacking upward
      const baseY = BUTTON_AREA_Y - (existing.length * 10) // Stack up from buttons
      const position = findValidPosition(existing, PILE_CENTER_X, baseY, viewportWidth)

      if (!position) return null

      return {
        id: `sneaker-${Date.now()}-${Math.random()}`,
        startLeft: PILE_CENTER_X,
        endLeft: position.endLeft,
        rotation: (Math.random() - 0.5) * 30,
        endRotation: (Math.random() - 0.5) * 60,
        duration: 2.5 + Math.random() * 1.5,
        endY: position.endY,
        scale,
        colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
        width,
        height,
      }
    }

    // Add first sneaker immediately
    const firstSneaker = createSneaker([])
    if (firstSneaker) {
      setSneakers([firstSneaker])
    }

    // Add new sneakers
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        const newSneaker = createSneaker(prev)
        if (!newSneaker) return prev
        return [...prev, newSneaker]
      })
    }, 600) // Every 600ms

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
            rotate: sneaker.rotation,
          }}
          animate={{
            y: sneaker.endY,
            x: `${sneaker.endLeft - sneaker.startLeft}vw`,
            opacity: 0.5,
            scale: sneaker.scale,
            rotate: sneaker.endRotation,
          }}
          transition={{
            duration: sneaker.duration,
            ease: [0.3, 0, 0.2, 1],
            opacity: { duration: 0.4 },
          }}
          style={{
            left: `${sneaker.startLeft}%`,
          }}
        >
          <Image
            src="/images/sneaker-transparent.svg"
            alt="Falling sneaker"
            width={SHOE_SIZE}
            height={SHOE_SIZE}
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
