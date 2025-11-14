'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

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
  horizontalVelocity: number // For realistic drift
  rotationVelocity: number // For tumbling effect
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

const SHOE_SIZE = 80 // Slightly larger for more realistic appearance
const SCREEN_TOP = -100 // Start from above viewport
const PILE_BOTTOM_OFFSET = 100 // Distance from bottom of screen for pile

// Check if two shoes would overlap (using viewport width for percentage conversion)
const checkCollision = (sneaker1: Sneaker, sneaker2: Sneaker, viewportWidth: number): boolean => {
  const margin = 10 // Margin to prevent touching
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
  const spreadRange = 35 // How far to spread horizontally (in percentage)

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const scale = 0.7 + Math.random() * 0.3 // Slightly larger range
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
      horizontalVelocity: 0,
      rotationVelocity: 0,
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
        // Stop when scrolled past the frame
        isActiveRef.current = rect.top < window.innerHeight && rect.bottom > 0
      }
    }

    checkVisibility()
    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    // Create a new sneaker with realistic physics
    const createSneaker = (existing: Sneaker[]): Sneaker | null => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scale = 0.7 + Math.random() * 0.3
      const width = SHOE_SIZE * scale
      const height = SHOE_SIZE * scale

      // Random starting position across the top of the screen
      const randomStartX = 10 + Math.random() * 80 // 10% to 90% across screen
      
      // Pile forms at bottom center, but shoes drift during fall
      const pileCenterX = 50 // Center of screen for pile
      
      // Calculate pile height - shoes stack upward from bottom
      const pileHeight = existing.length * 12 // Each shoe adds ~12px height
      const baseY = viewportHeight - PILE_BOTTOM_OFFSET - pileHeight
      
      // Find valid position in the pile (at bottom center, but with spread)
      const position = findValidPosition(existing, pileCenterX, baseY, viewportWidth)

      if (!position) {
        // If can't find position, try slightly higher
        const retryY = baseY - 8
        const retryPosition = findValidPosition(existing, pileCenterX, retryY, viewportWidth)
        if (!retryPosition) return null
        
        // Realistic physics: horizontal drift and rotation
        const horizontalDrift = (Math.random() - 0.5) * 30 // Drift during fall
        const rotationAmount = (Math.random() - 0.5) * 720 // Multiple rotations
        const rotationVelocity = (Math.random() - 0.5) * 4
        
        return {
          id: `sneaker-${Date.now()}-${Math.random()}`,
          startLeft: randomStartX,
          endLeft: retryPosition.endLeft + horizontalDrift * 0.2,
          rotation: (Math.random() - 0.5) * 45,
          endRotation: retryPosition.endLeft * 2 + rotationAmount,
          duration: 2.0 + Math.random() * 1.2, // 2.0-3.2 seconds (longer fall from top)
          endY: retryPosition.endY,
          scale,
          colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
          width,
          height,
          horizontalVelocity: horizontalDrift,
          rotationVelocity,
        }
      }

      // Realistic physics: horizontal drift and rotation
      const horizontalDrift = (Math.random() - 0.5) * 30
      const rotationAmount = (Math.random() - 0.5) * 720
      const rotationVelocity = (Math.random() - 0.5) * 4

      return {
        id: `sneaker-${Date.now()}-${Math.random()}`,
        startLeft: randomStartX,
        endLeft: position.endLeft + horizontalDrift * 0.2,
        rotation: (Math.random() - 0.5) * 45,
        endRotation: position.endLeft * 2 + rotationAmount,
        duration: 2.0 + Math.random() * 1.2,
        endY: position.endY,
        scale,
        colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
        width,
        height,
        horizontalVelocity: horizontalDrift,
        rotationVelocity,
      }
    }

    // Add first sneaker immediately
    const firstSneaker = createSneaker([])
    if (firstSneaker) {
      setSneakers([firstSneaker])
    }

    // Add new sneakers more frequently (unlimited)
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        const newSneaker = createSneaker(prev)
        if (!newSneaker) return prev
        return [...prev, newSneaker]
      })
    }, 350) // Slightly more frequent for better effect

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      <AnimatePresence>
        {sneakers.map((sneaker) => {
          // Calculate bounce height based on impact
          const bounceHeight = 12 + Math.random() * 8 // 12-20px bounce
          const bounceY = sneaker.endY - bounceHeight

          return (
            <motion.div
              key={sneaker.id}
              className="absolute"
              initial={{
                y: SCREEN_TOP,
                x: '0%',
                opacity: 0,
                scale: 0.6,
                rotate: sneaker.rotation,
              }}
              animate={{
                y: [sneaker.endY, bounceY, sneaker.endY],
                x: `${sneaker.endLeft - sneaker.startLeft}vw`,
                opacity: [0, 0.5, 0.5],
                scale: [0.6, sneaker.scale, sneaker.scale],
                rotate: [sneaker.rotation, sneaker.endRotation, sneaker.endRotation],
              }}
              transition={{
                y: {
                  duration: sneaker.duration + 0.3,
                  times: [0, 0.92, 1], // Fall 92% of time, bounce in last 8%
                  ease: [0.25, 0.1, 0.25, 1], // More realistic gravity curve
                },
                x: {
                  duration: sneaker.duration,
                  ease: [0.25, 0.1, 0.25, 1], // Smooth horizontal drift
                },
                opacity: {
                  duration: 0.5,
                  times: [0, 0.3, 1],
                },
                scale: {
                  duration: 0.4,
                  ease: 'easeOut',
                },
                rotate: {
                  duration: sneaker.duration,
                  ease: [0.25, 0.1, 0.25, 1], // Smooth rotation
                },
              }}
              style={{
                left: `${sneaker.startLeft}%`,
                transformOrigin: 'center center',
              }}
            >
              <Image
                src="/images/sneaker-realistic.png"
                alt="Falling sneaker"
                width={SHOE_SIZE}
                height={SHOE_SIZE}
                className="drop-shadow-xl"
                style={{
                  backgroundColor: 'transparent',
                  filter: sneaker.colorFilter,
                  imageRendering: 'auto', // Better quality for realistic image
                }}
                unoptimized
                priority={false}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
