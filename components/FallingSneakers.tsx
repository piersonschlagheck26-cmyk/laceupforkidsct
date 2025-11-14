'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Sneaker {
  id: string
  startX: number // Pixel position from left
  endX: number // Final pixel position
  startY: number
  endY: number
  scale: number
  colorFilter: string
  bouncePoints: { x: number; y: number }[] // Intermediate bounce positions
}

const SHOE_SIZE = 80
const SOURCE_X_PERCENT = 50 // Top center
const PILE_BOTTOM_OFFSET = 80
const MAX_SNEAKERS = 50

// Color filters matching the site palette
const COLOR_FILTERS = [
  'brightness(1.1) saturate(1.2) hue-rotate(0deg)',
  'brightness(1.15) saturate(1.3) hue-rotate(5deg) sepia(0.2)',
  'brightness(1.1) saturate(1.4) hue-rotate(350deg) sepia(0.3)',
  'brightness(1.2) saturate(1.1) hue-rotate(15deg) sepia(0.15)',
  'brightness(1.05) saturate(1.3) hue-rotate(340deg) sepia(0.25)',
  'brightness(1.18) saturate(1.25) hue-rotate(10deg) sepia(0.2)',
]

// Simple collision check
const checkCollision = (
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean => {
  const margin = 10
  return (
    Math.abs(x1 - x2) < (w1 + w2) / 2 + margin &&
    Math.abs(y1 - y2) < (h1 + h2) / 2 + margin
  )
}

// Simulate fall with real-time collision and bounce
const simulateFall = (
  startX: number,
  startY: number,
  existingSneakers: Sneaker[],
  viewportWidth: number,
  viewportHeight: number,
  scale: number
): { endX: number; endY: number; bouncePoints: { x: number; y: number }[] } => {
  const width = SHOE_SIZE * scale
  const height = SHOE_SIZE * scale
  const baseY = viewportHeight - PILE_BOTTOM_OFFSET
  
  let currentX = startX
  let currentY = startY
  const bouncePoints: { x: number; y: number }[] = []
  
  // Simulate step-by-step fall
  const stepSize = 10
  // Each shoe disperses left or right - random direction and speed
  const direction = Math.random() < 0.5 ? -1 : 1 // Left or right
  const speed = 0.5 + Math.random() * 1.5 // Speed of dispersion
  let velocityX = direction * speed // Horizontal velocity for dispersion
  
  for (let y = startY; y < baseY + 300; y += stepSize) {
    currentY = y
    currentX += velocityX // Apply horizontal drift
    
    // Check collision with all existing shoes
    for (const existing of existingSneakers) {
      const existingX = existing.endX
      const existingY = existing.endY
      const existingW = SHOE_SIZE * existing.scale
      const existingH = SHOE_SIZE * existing.scale
      
      if (checkCollision(currentX, currentY, width, height, existingX, existingY, existingW, existingH)) {
        // Bounce off - calculate bounce direction
        const dx = currentX - existingX
        const dy = currentY - existingY
        const distance = Math.sqrt(dx * dx + dy * dy) || 1
        
        // Bounce away from collision
        const bounceDistance = 20 + Math.random() * 15
        const bounceX = currentX + (dx / distance) * bounceDistance
        const bounceY = currentY - 10 - Math.random() * 10 // Bounce up
        
        bouncePoints.push({ x: bounceX, y: bounceY })
        
        // Update position after bounce
        currentX = bounceX
        currentY = bounceY
        
        // Change velocity after bounce - maintain dispersion direction but adjust
        const bounceDirection = dx > 0 ? 1 : -1
        velocityX = bounceDirection * (0.5 + Math.random() * 1.0) // Continue dispersing after bounce
        break
      }
    }
  }
  
  // Final position - ensure it's on the pile and doesn't overlap
  const pileHeight = existingSneakers.length * 10
  const finalY = Math.min(currentY, baseY - pileHeight)
  
  // Ensure no overlap with existing shoes (rigid structures)
  let finalX = Math.max(width / 2, Math.min(viewportWidth - width / 2, currentX))
  
  // Check for collisions at final position and adjust if needed
  let attempts = 0
  while (attempts < 20) {
    let hasCollision = false
    for (const existing of existingSneakers) {
      const existingX = existing.endX
      const existingY = existing.endY
      const existingW = SHOE_SIZE * existing.scale
      const existingH = SHOE_SIZE * existing.scale
      
      if (checkCollision(finalX, finalY, width, height, existingX, existingY, existingW, existingH)) {
        hasCollision = true
        // Try moving left or right
        const offset = (attempts % 2 === 0 ? 1 : -1) * (width + 15) * (attempts + 1)
        finalX = Math.max(width / 2, Math.min(viewportWidth - width / 2, currentX + offset))
        break
      }
    }
    if (!hasCollision) break
    attempts++
  }
  
  return { endX: finalX, endY: finalY, bouncePoints }
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
      if (existing.length >= MAX_SNEAKERS) return null
      
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const scale = 0.7 + Math.random() * 0.3
      
      const startX = (SOURCE_X_PERCENT / 100) * viewportWidth
      const startY = -SHOE_SIZE // Start above viewport
      
      // Simulate fall with collision detection
      const result = simulateFall(startX, startY, existing, viewportWidth, viewportHeight, scale)
      
      return {
        id: `sneaker-${Date.now()}-${Math.random()}`,
        startX,
        endX: result.endX,
        startY,
        endY: result.endY,
        scale,
        colorFilter: COLOR_FILTERS[Math.floor(Math.random() * COLOR_FILTERS.length)],
        bouncePoints: result.bouncePoints,
      }
    }

    // Add first sneaker
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
    }, 400)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {sneakers.map((sneaker) => {
        // Build animation path: start -> bounces -> end -> final bounce
        const yPath = [sneaker.startY]
        const xPath = [sneaker.startX]
        
        // Add bounce points
        sneaker.bouncePoints.forEach((bounce) => {
          yPath.push(bounce.y)
          xPath.push(bounce.x)
        })
        
        // Add final landing position
        yPath.push(sneaker.endY)
        xPath.push(sneaker.endX)
        
        // Add final bounce
        const finalBounceY = sneaker.endY - (8 + Math.random() * 10)
        yPath.push(finalBounceY, sneaker.endY)
        xPath.push(sneaker.endX, sneaker.endX)
        
        // Calculate duration based on distance
        const totalDistance = Math.abs(sneaker.endY - sneaker.startY)
        const duration = 1.5 + (totalDistance / 1000) * 1.5 // 1.5-3 seconds
        
        // Create times array for keyframes
        const numKeyframes = yPath.length
        const times = Array.from({ length: numKeyframes }, (_, i) => i / (numKeyframes - 1))

        return (
          <motion.div
            key={sneaker.id}
            className="absolute"
            initial={{
              x: sneaker.startX,
              y: sneaker.startY,
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              x: xPath,
              y: yPath,
              opacity: [0, 0.5, 0.5],
              scale: [0.8, sneaker.scale, sneaker.scale],
            }}
            transition={{
              x: {
                duration,
                times,
                ease: 'easeOut',
              },
              y: {
                duration,
                times,
                ease: [0.4, 0, 0.6, 1], // Gravity curve
              },
              opacity: {
                duration: 0.5,
                times: [0, 0.2, 1],
              },
              scale: {
                duration,
                times,
                ease: 'easeOut',
              },
            }}
            style={{
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
                width: `${SHOE_SIZE * sneaker.scale}px`,
                height: `${SHOE_SIZE * sneaker.scale}px`,
              }}
              unoptimized
              priority={false}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
