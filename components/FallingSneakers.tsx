'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Sneaker {
  id: string
  startLeft: number
  endLeft: number
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

// Calculate bounce when hitting another shoe (no rotation)
const calculateBounce = (
  fallingX: number,
  fallingY: number,
  fallingW: number,
  fallingH: number,
  hitX: number,
  hitY: number,
  hitW: number,
  hitH: number
): { bounceX: number; bounceY: number } => {
  // Calculate collision angle
  const dx = fallingX - hitX
  const dy = fallingY - hitY
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance === 0) {
    // Direct collision - bounce to the side
    return {
      bounceX: fallingX + (Math.random() - 0.5) * 25,
      bounceY: fallingY - 12, // Bounce up slightly
    }
  }
  
  // Bounce away from collision point (like raindrops)
  const bounceDistance = 15 + Math.random() * 12
  const bounceX = fallingX + (dx / distance) * bounceDistance
  const bounceY = fallingY - 8 - Math.random() * 8 // Bounce up and away
  
  return { bounceX, bounceY }
}

// Find landing position with collision and bounce simulation (raindrop style - minimal horizontal drift)
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
  
  // Simulate fall with potential bounces (like raindrops - mostly straight down)
  let currentX = (startX / 100) * viewportWidth
  let currentY = startY
  const horizontalVelocity = (Math.random() - 0.5) * 0.5 // Minimal drift for raindrop effect
  const bounceOffsets: { x: number; y: number }[] = []
  
  // Simulate falling and checking for collisions
  const stepSize = 15
  let hasBounced = false
  
  for (let y = startY; y < baseY + 200; y += stepSize) {
    currentY = y
    // Minimal horizontal movement - raindrops fall mostly straight
    currentX += horizontalVelocity * (y - startY) / 200
    
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
    if (hasBounced && y > currentY + 40) {
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
      
      // Find landing position with bounce physics (raindrop style)
      const landing = findLandingPosition(
        existing,
        CONFETTI_SOURCE_X,
        SCREEN_TOP,
        viewportWidth,
        viewportHeight,
        scale
      )
      
      return {
        id: `sneaker-${Date.now()}-${Math.random()}`,
        startLeft: CONFETTI_SOURCE_X,
        endLeft: landing.endLeft,
        duration: 1.8 + Math.random() * 1.2, // 1.8-3.0 seconds (faster like raindrops)
        endY: landing.endY,
        scale,
        colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
        width: SHOE_SIZE * scale,
        height: SHOE_SIZE * scale,
        horizontalVelocity: (Math.random() - 0.5) * 0.5, // Minimal drift
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
          // Calculate animation path with bounces (raindrop style - no rotation)
          const bounceHeight = 8 + Math.random() * 12
          const bounceY = sneaker.endY - bounceHeight
          
          // Create keyframe path with bounces (straight down like raindrops)
          const yKeyframes = [sneaker.endY, bounceY, sneaker.endY]
          const xKeyframes = ['0%', `${sneaker.endLeft - sneaker.startLeft}vw`, `${sneaker.endLeft - sneaker.startLeft}vw`]
          
          // Add bounce points if they exist (no rotation)
          if (sneaker.bounceOffsets.length > 0 && typeof window !== 'undefined') {
            const firstBounce = sneaker.bounceOffsets[0]
            const bounceXPercent = ((firstBounce.x / window.innerWidth) * 100) - sneaker.startLeft
            const bounceYPercent = firstBounce.y
            
            // Insert bounce into keyframes
            yKeyframes.splice(1, 0, bounceYPercent)
            xKeyframes.splice(1, 0, `${bounceXPercent}vw`)
          }

          return (
            <motion.div
              key={sneaker.id}
              className="absolute"
              initial={{
                y: SCREEN_TOP,
                x: '0%',
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                y: yKeyframes,
                x: xKeyframes,
                opacity: [0, 0.5, 0.5],
                scale: [0.7, sneaker.scale * 0.98, sneaker.scale],
              }}
              transition={{
                y: {
                  duration: sneaker.duration + 0.2,
                  times: sneaker.bounceOffsets.length > 0 
                    ? [0, 0.75, 0.88, 1] 
                    : [0, 0.93, 1],
                  ease: [0.4, 0, 0.6, 1], // Natural gravity for raindrops
                },
                x: {
                  duration: sneaker.duration,
                  times: sneaker.bounceOffsets.length > 0
                    ? [0, 0.75, 0.88, 1]
                    : [0, 0.5, 1],
                  ease: 'easeOut', // Minimal horizontal movement
                },
                opacity: {
                  duration: 0.4,
                  times: [0, 0.15, 1],
                  ease: 'easeOut',
                },
                scale: {
                  duration: sneaker.duration + 0.2,
                  times: sneaker.bounceOffsets.length > 0
                    ? [0, 0.75, 0.88, 1]
                    : [0, 0.93, 1],
                  ease: [0.4, 0, 0.6, 1],
                },
              }}
              style={{
                left: `${sneaker.startLeft}%`,
                transformOrigin: 'center center',
              }}
            >
              <Image
                src="/images/sneaker-new.jpg"
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
