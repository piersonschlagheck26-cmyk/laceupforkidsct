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
  horizontalVelocity: number
  bounceOffsets: { x: number; y: number }[] // Multiple bounce points during fall
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
const CONFETTI_SOURCE_X = 50 // Single point at top center
const SCREEN_TOP = 0
const PILE_BOTTOM_OFFSET = 80

// Check collision between two shoes
const checkCollision = (
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean => {
  const margin = 8
  return (
    Math.abs(x1 - x2) < (w1 + w2) / 2 + margin &&
    Math.abs(y1 - y2) < (h1 + h2) / 2 + margin
  )
}

// Calculate bounce when hitting another shoe
const calculateBounce = (
  fallingX: number,
  fallingY: number,
  fallingW: number,
  fallingH: number,
  hitX: number,
  hitY: number,
  hitW: number,
  hitH: number
): { bounceX: number; bounceY: number; bounceRotation: number } => {
  // Calculate collision angle
  const dx = fallingX - hitX
  const dy = fallingY - hitY
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance === 0) {
    // Direct collision - bounce to the side
    return {
      bounceX: fallingX + (Math.random() - 0.5) * 30,
      bounceY: fallingY - 15, // Bounce up slightly
      bounceRotation: (Math.random() - 0.5) * 90,
    }
  }
  
  // Bounce away from collision point
  const bounceDistance = 20 + Math.random() * 15
  const bounceX = fallingX + (dx / distance) * bounceDistance
  const bounceY = fallingY - 10 - Math.random() * 10 // Bounce up and away
  const bounceRotation = (Math.random() - 0.5) * 120
  
  return { bounceX, bounceY, bounceRotation }
}

// Find landing position with collision and bounce simulation
const findLandingPosition = (
  existingSneakers: Sneaker[],
  startX: number,
  startY: number,
  viewportWidth: number,
  viewportHeight: number,
  scale: number
): { endLeft: number; endY: number; bounceOffsets: { x: number; y: number }[] } => {
  const width = SHOE_SIZE * scale
  const height = SHOE_SIZE * scale
  const baseY = viewportHeight - PILE_BOTTOM_OFFSET
  
  // Simulate fall with potential bounces
  let currentX = (startX / 100) * viewportWidth
  let currentY = startY
  const horizontalVelocity = (Math.random() - 0.5) * 2 // Random drift
  const bounceOffsets: { x: number; y: number }[] = []
  
  // Simulate falling and checking for collisions
  const stepSize = 20
  let hasBounced = false
  
  for (let y = startY; y < baseY + 200; y += stepSize) {
    currentY = y
    currentX += horizontalVelocity * (y - startY) / 100 // Drift as falls
    
    // Check collision with existing shoes
    for (const existing of existingSneakers) {
      const existingX = (existing.endLeft / 100) * viewportWidth
      const existingY = existing.endY
      const existingW = existing.width
      const existingH = existing.height
      
      if (checkCollision(currentX, currentY, width, height, existingX, existingY, existingW, existingH)) {
        // Bounce off this shoe
        const bounce = calculateBounce(currentX, currentY, width, height, existingX, existingY, existingW, existingH)
        currentX = bounce.bounceX
        currentY = bounce.bounceY
        bounceOffsets.push({ x: bounce.bounceX, y: bounce.bounceY })
        hasBounced = true
        break
      }
    }
    
    // If we've bounced and are falling again, continue
    if (hasBounced && y > currentY + 50) {
      hasBounced = false
    }
  }
  
  // Final position - ensure it's on the pile
  const finalY = Math.min(currentY, baseY - (existingSneakers.length * 8))
  const finalX = Math.max(5, Math.min(95, (currentX / viewportWidth) * 100))
  
  return {
    endLeft: finalX,
    endY: finalY,
    bounceOffsets,
  }
}

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])
  const isActiveRef = useRef(true)

  useEffect(() => {
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

    const createSneaker = (existing: Sneaker[]): Sneaker | null => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scale = 0.65 + Math.random() * 0.35
      
      // Find landing position with bounce physics
      const landing = findLandingPosition(
        existing,
        CONFETTI_SOURCE_X,
        SCREEN_TOP,
        viewportWidth,
        viewportHeight,
        scale
      )
      
      // Natural rotation based on horizontal movement
      const horizontalMovement = landing.endLeft - CONFETTI_SOURCE_X
      const totalRotation = (Math.random() - 0.5) * 1080 + horizontalMovement * 2
      
      return {
        id: `sneaker-${Date.now()}-${Math.random()}`,
        startLeft: CONFETTI_SOURCE_X,
        endLeft: landing.endLeft,
        rotation: (Math.random() - 0.5) * 60,
        endRotation: totalRotation,
        duration: 2.0 + Math.random() * 1.5, // 2.0-3.5 seconds
        endY: landing.endY,
        scale,
        colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
        width: SHOE_SIZE * scale,
        height: SHOE_SIZE * scale,
        horizontalVelocity: (Math.random() - 0.5) * 2,
        bounceOffsets: landing.bounceOffsets,
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
    }, 350)

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
          // Calculate animation path with bounces
          const bounceHeight = 10 + Math.random() * 15
          const bounceY = sneaker.endY - bounceHeight
          
          // Create keyframe path with bounces
          const yKeyframes = [sneaker.endY, bounceY, sneaker.endY]
          const xKeyframes = ['0%', `${sneaker.endLeft - sneaker.startLeft}vw`, `${sneaker.endLeft - sneaker.startLeft}vw`]
          const rotateKeyframes = [sneaker.rotation, sneaker.endRotation, sneaker.endRotation]
          
          // Add bounce points if they exist
          if (sneaker.bounceOffsets.length > 0 && typeof window !== 'undefined') {
            const firstBounce = sneaker.bounceOffsets[0]
            const bounceXPercent = ((firstBounce.x / window.innerWidth) * 100) - sneaker.startLeft
            const bounceYPercent = firstBounce.y
            
            // Insert bounce into keyframes
            yKeyframes.splice(1, 0, bounceYPercent)
            xKeyframes.splice(1, 0, `${bounceXPercent}vw`)
            rotateKeyframes.splice(1, 0, sneaker.endRotation + (Math.random() - 0.5) * 60)
          }

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
                y: yKeyframes,
                x: xKeyframes,
                opacity: [0, 0.5, 0.5],
                scale: [0.6, sneaker.scale * 0.95, sneaker.scale],
                rotate: rotateKeyframes,
              }}
              transition={{
                y: {
                  duration: sneaker.duration + 0.3,
                  times: sneaker.bounceOffsets.length > 0 
                    ? [0, 0.7, 0.85, 1] 
                    : [0, 0.92, 1],
                  ease: [0.42, 0, 0.58, 1],
                },
                x: {
                  duration: sneaker.duration,
                  times: sneaker.bounceOffsets.length > 0
                    ? [0, 0.7, 0.85, 1]
                    : [0, 0.5, 1],
                  ease: [0.25, 0.1, 0.5, 1],
                },
                opacity: {
                  duration: 0.6,
                  times: [0, 0.2, 1],
                  ease: 'easeOut',
                },
                scale: {
                  duration: sneaker.duration + 0.3,
                  times: sneaker.bounceOffsets.length > 0
                    ? [0, 0.7, 0.85, 1]
                    : [0, 0.92, 1],
                  ease: [0.42, 0, 0.58, 1],
                },
                rotate: {
                  duration: sneaker.duration,
                  ease: [0.25, 0.1, 0.5, 1],
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
                  filter: `${sneaker.colorFilter} hue-rotate(-15deg) saturate(0.9) brightness(1.05)`,
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
