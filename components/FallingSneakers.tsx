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
  horizontalSpread: number // How far it spreads from center
  rotationSpeed: number // Rotation speed multiplier
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

const SHOE_SIZE = 80
const CONFETTI_SOURCE_X = 50 // Single point at top center - ALL shoes start here
const SCREEN_TOP = 0 // Start from very top of viewport
const PILE_BOTTOM_OFFSET = 80 // Distance from bottom of screen

// Check if two shoes would overlap
const checkCollision = (sneaker1: Sneaker, sneaker2: Sneaker, viewportWidth: number): boolean => {
  const margin = 12
  const w1 = sneaker1.width / 2
  const h1 = sneaker1.height / 2
  const w2 = sneaker2.width / 2
  const h2 = sneaker2.height / 2

  const x1 = (sneaker1.endLeft / 100) * viewportWidth
  const y1 = sneaker1.endY
  const x2 = (sneaker2.endLeft / 100) * viewportWidth
  const y2 = sneaker2.endY

  return (
    Math.abs(x1 - x2) < (w1 + w2 + margin) &&
    Math.abs(y1 - y2) < (h1 + h2 + margin)
  )
}

// Find a valid position in the uneven pile at bottom
const findValidPosition = (
  existingSneakers: Sneaker[],
  targetY: number,
  viewportWidth: number,
  preferredSpread: number
): { endLeft: number; endY: number } | null => {
  const maxAttempts = 60
  // Wider spread for uneven accumulation (like confetti)
  const spreadRange = 60 + Math.random() * 20 // 60-80% spread

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const scale = 0.65 + Math.random() * 0.35
    const width = SHOE_SIZE * scale
    const height = SHOE_SIZE * scale
    
    // Uneven distribution - more likely near center but can be anywhere
    const distributionBias = Math.random() < 0.6 ? 0.3 : 1.0 // 60% chance to be closer to center
    const randomOffset = (Math.random() - 0.5) * spreadRange * distributionBias
    const endLeft = CONFETTI_SOURCE_X + randomOffset + preferredSpread * 0.4
    
    const testSneaker: Sneaker = {
      id: 'test',
      startLeft: CONFETTI_SOURCE_X,
      endLeft: Math.max(5, Math.min(95, endLeft)), // Clamp to 5-95%
      rotation: 0,
      endRotation: 0,
      duration: 0,
      endY: targetY + (Math.random() - 0.5) * 20, // More vertical variation
      scale,
      colorFilter: '',
      width,
      height,
      horizontalSpread: 0,
      rotationSpeed: 0,
    }

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
        isActiveRef.current = rect.top < window.innerHeight && rect.bottom > 0
      }
    }

    checkVisibility()
    window.addEventListener('scroll', checkVisibility, { passive: true })
    window.addEventListener('resize', checkVisibility, { passive: true })

    // Create a new sneaker with confetti-like physics
    const createSneaker = (existing: Sneaker[]): Sneaker | null => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scale = 0.65 + Math.random() * 0.35
      const width = SHOE_SIZE * scale
      const height = SHOE_SIZE * scale

      // ALL shoes start from top center (CONFETTI_SOURCE_X = 50%)
      // Each shoe gets a random horizontal velocity that determines its spread as it falls
      const horizontalSpread = (Math.random() - 0.5) * 70 // -35% to +35% spread
      const rotationSpeed = 0.5 + Math.random() * 1.5 // Rotation speed variation
      
      // Calculate pile height - shoes stack upward from bottom
      const pileHeight = existing.length * 11
      const baseY = viewportHeight - PILE_BOTTOM_OFFSET - pileHeight
      
      // Find valid position in uneven pile
      const position = findValidPosition(existing, baseY, viewportWidth, horizontalSpread)

      if (!position) {
        // Try slightly higher
        const retryY = baseY - 10
        const retryPosition = findValidPosition(existing, retryY, viewportWidth, horizontalSpread)
        if (!retryPosition) return null
        
        // Natural confetti rotation - multiple full rotations
        const totalRotation = (Math.random() - 0.5) * 1080 + horizontalSpread * 3 // -540 to +540 degrees + spread influence
        
        return {
          id: `sneaker-${Date.now()}-${Math.random()}`,
          startLeft: CONFETTI_SOURCE_X,
          endLeft: retryPosition.endLeft,
          rotation: (Math.random() - 0.5) * 60,
          endRotation: totalRotation,
          duration: 2.2 + Math.random() * 1.4, // 2.2-3.6 seconds (natural variation)
          endY: retryPosition.endY,
          scale,
          colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
          width,
          height,
          horizontalSpread,
          rotationSpeed,
        }
      }

      // Natural confetti rotation
      const totalRotation = (Math.random() - 0.5) * 1080 + horizontalSpread * 3

      return {
        id: `sneaker-${Date.now()}-${Math.random()}`,
        startLeft: CONFETTI_SOURCE_X,
        endLeft: position.endLeft,
        rotation: (Math.random() - 0.5) * 60,
        endRotation: totalRotation,
        duration: 2.2 + Math.random() * 1.4,
        endY: position.endY,
        scale,
        colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
        width,
        height,
        horizontalSpread,
        rotationSpeed,
      }
    }

    // Add first sneaker immediately
    const firstSneaker = createSneaker([])
    if (firstSneaker) {
      setSneakers([firstSneaker])
    }

    // Add new sneakers (unlimited, like confetti stream)
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        const newSneaker = createSneaker(prev)
        if (!newSneaker) return prev
        return [...prev, newSneaker]
      })
    }, 300) // More frequent for confetti effect

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
          // Natural bounce - varies by impact
          const bounceHeight = 8 + Math.random() * 12 // 8-20px bounce
          const bounceY = sneaker.endY - bounceHeight

          // Calculate intermediate positions for natural confetti path
          // Confetti spreads more as it falls (like real confetti)
          const midPoint = (sneaker.startLeft + sneaker.endLeft) / 2
          const midSpread = sneaker.startLeft + (sneaker.endLeft - sneaker.startLeft) * 0.6

          return (
            <motion.div
              key={sneaker.id}
              className="absolute"
              initial={{
                y: SCREEN_TOP,
                x: '0%',
                opacity: 0,
                scale: 0.5,
                rotate: sneaker.rotation,
              }}
              animate={{
                y: [sneaker.endY, bounceY, sneaker.endY],
                x: [
                  '0%',
                  `${midSpread - sneaker.startLeft}vw`,
                  `${sneaker.endLeft - sneaker.startLeft}vw`
                ],
                opacity: [0, 0.5, 0.5],
                scale: [0.5, sneaker.scale * 0.95, sneaker.scale], // Slight scale on bounce
                rotate: [sneaker.rotation, sneaker.endRotation, sneaker.endRotation],
              }}
              transition={{
                y: {
                  duration: sneaker.duration + 0.25,
                  times: [0, 0.93, 1], // Fall 93%, bounce 7%
                  ease: [0.42, 0, 0.58, 1], // Natural gravity curve (ease-in-out)
                },
                x: {
                  duration: sneaker.duration,
                  times: [0, 0.5, 1], // Accelerate spread as it falls
                  ease: [0.25, 0.1, 0.5, 1], // Confetti-like spread acceleration
                },
                opacity: {
                  duration: 0.6,
                  times: [0, 0.2, 1],
                  ease: 'easeOut',
                },
                scale: {
                  duration: sneaker.duration + 0.25,
                  times: [0, 0.93, 1],
                  ease: [0.42, 0, 0.58, 1],
                },
                rotate: {
                  duration: sneaker.duration,
                  ease: [0.25, 0.1, 0.5, 1], // Natural tumbling
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
                  filter: `${sneaker.colorFilter} hue-rotate(-15deg) saturate(0.9) brightness(1.05)`, // Remove blue tint and artifacts
                  imageRendering: 'auto',
                  mixBlendMode: 'normal',
                  WebkitFilter: `${sneaker.colorFilter} hue-rotate(-15deg) saturate(0.9) brightness(1.05)`,
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
