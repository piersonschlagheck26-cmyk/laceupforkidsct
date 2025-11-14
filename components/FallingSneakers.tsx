'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Sneaker {
  id: string
  startX: number
  endX: number
  startY: number
  endY: number
  scale: number
  initialScale: number // Random initial scale for animation
  colorFilter: string
  rotation: number // Random rotation for each shoe
  brightness: number // Random brightness variation
  saturation: number // Random saturation variation
  hueRotate: number // Random hue rotation
  opacity: number // Random opacity
  bouncePoints: { x: number; y: number }[]
  isAnimating: boolean // Track if animation is complete
}

const SHOE_SIZE = 80
const SOURCE_X_PERCENT = 50 // Top center
const PILE_BOTTOM_OFFSET = 80
const MAX_SNEAKERS = 100 // Increased for more accumulation

// Generate random color filter for each shoe
const generateColorFilter = () => {
  const brightness = 0.95 + Math.random() * 0.3 // 0.95-1.25
  const saturation = 1.0 + Math.random() * 0.5 // 1.0-1.5
  const hueRotate = (Math.random() - 0.5) * 40 // -20 to 20 degrees
  const sepia = Math.random() * 0.4 // 0-0.4
  
  return {
    brightness,
    saturation,
    hueRotate,
    sepia,
    filterString: `brightness(${brightness}) saturate(${saturation}) hue-rotate(${hueRotate}deg) sepia(${sepia})`,
  }
}

// Simple collision check
const checkCollision = (
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean => {
  const margin = 12 // Increased margin for rigid structures
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
  
  // Simulate step-by-step fall with more randomization
  const stepSize = 6 // Smaller steps for smoother simulation
  // Each shoe disperses left or right - random direction and speed with more variation
  const direction = Math.random() < 0.5 ? -1 : 1 // Left or right
  const speed = 0.4 + Math.random() * 2.0 // More variation: 0.4-2.4
  let velocityX = direction * speed // Horizontal velocity for dispersion
  
  // Add random wobble to horizontal movement
  const wobbleAmount = Math.random() * 0.3 // Random wobble intensity
  
  for (let y = startY; y < baseY + 400; y += stepSize) {
    currentY = y
    // Apply horizontal drift with random wobble
    const wobble = Math.sin(y * 0.1) * wobbleAmount * (Math.random() - 0.5)
    currentX += velocityX + wobble // Apply horizontal drift with wobble
    
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
        
        // Bounce away from collision with more randomization
        const bounceDistance = 15 + Math.random() * 20 // More variation: 15-35
        const bounceX = currentX + (dx / distance) * bounceDistance
        const bounceY = currentY - 6 - Math.random() * 12 // More variation: 6-18 bounce up
        
        bouncePoints.push({ x: bounceX, y: bounceY })
        
        // Update position after bounce
        currentX = bounceX
        currentY = bounceY
        
        // Change velocity after bounce - maintain dispersion direction but adjust
        const bounceDirection = dx > 0 ? 1 : -1
        velocityX = bounceDirection * (0.6 + Math.random() * 0.9) // Continue dispersing after bounce
        break
      }
    }
  }
  
  // Final position - ensure it's on the pile and doesn't overlap
  const pileHeight = existingSneakers.length * 12 // Each shoe adds height
  const targetY = baseY - pileHeight
  
  // Ensure no overlap with existing shoes (rigid structures)
  let finalX = Math.max(width / 2, Math.min(viewportWidth - width / 2, currentX))
  let finalY = targetY
  
  // Check for collisions at final position and adjust if needed
  let attempts = 0
  while (attempts < 30) {
    let hasCollision = false
    for (const existing of existingSneakers) {
      const existingX = existing.endX
      const existingY = existing.endY
      const existingW = SHOE_SIZE * existing.scale
      const existingH = SHOE_SIZE * existing.scale
      
      if (checkCollision(finalX, finalY, width, height, existingX, existingY, existingW, existingH)) {
        hasCollision = true
        // Try moving left or right, or slightly up
        const offsetX = (attempts % 2 === 0 ? 1 : -1) * (width + 18) * Math.ceil((attempts + 1) / 2)
        const offsetY = attempts > 10 ? -8 : 0 // Try moving up if many attempts
        finalX = Math.max(width / 2, Math.min(viewportWidth - width / 2, currentX + offsetX))
        finalY = Math.max(0, targetY + offsetY)
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
        // Continue as long as hero page is visible
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
      // More scale variation
      const scale = 0.6 + Math.random() * 0.5 // 0.6-1.1 (more variation)
      
      // Add slight random offset to start position for more natural dispersion
      const startXOffset = (Math.random() - 0.5) * 40 // ±20px variation
      const startX = (SOURCE_X_PERCENT / 100) * viewportWidth + startXOffset
      const startY = -SHOE_SIZE - Math.random() * 20 // Slight vertical variation
      
      // Simulate fall with collision detection
      const result = simulateFall(startX, startY, existing, viewportWidth, viewportHeight, scale)
      
      // Generate random color properties
      const colorProps = generateColorFilter()
      
      // Random rotation (-15 to 15 degrees)
      const rotation = (Math.random() - 0.5) * 30
      
      // Random initial scale for animation
      const initialScale = 0.7 + Math.random() * 0.2
      
      // Random opacity
      const opacity = 0.45 + Math.random() * 0.15
      
      return {
        id: `sneaker-${Date.now()}-${Math.random()}`,
        startX,
        endX: result.endX,
        startY,
        endY: result.endY,
        scale,
        initialScale,
        colorFilter: colorProps.filterString,
        rotation,
        brightness: colorProps.brightness,
        saturation: colorProps.saturation,
        hueRotate: colorProps.hueRotate,
        opacity,
        bouncePoints: result.bouncePoints,
        isAnimating: true,
      }
    }

    // Add first sneaker
    const firstSneaker = createSneaker([])
    if (firstSneaker) {
      setSneakers([firstSneaker])
    }

    // Add new sneakers (vastly slower - much less frequent)
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        const newSneaker = createSneaker(prev)
        if (!newSneaker) return prev
        return [...prev, newSneaker]
      })
    }, 1800) // Vastly slower: every 1800ms (1.8 seconds) - 3x slower than before

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
        
        // Add final bounce with more variation
        const finalBounceHeight = 4 + Math.random() * 12 // More variation: 4-16
        const finalBounceY = sneaker.endY - finalBounceHeight
        yPath.push(finalBounceY, sneaker.endY)
        xPath.push(sneaker.endX, sneaker.endX)
        
        // Calculate duration - VASTLY SLOWED DOWN (4-5x slower)
        const totalDistance = Math.abs(sneaker.endY - sneaker.startY)
        const baseDuration = 8.0 + (totalDistance / 1000) * 6.0 // 8-14 seconds (vastly slower)
        
        // Create times array for keyframes
        const numKeyframes = yPath.length
        const times = Array.from({ length: numKeyframes }, (_, i) => i / (numKeyframes - 1))
        
        // Add random rotation animation matching keyframes
        const rotationPath = Array.from({ length: numKeyframes }, (_, i) => {
          const progress = i / (numKeyframes - 1)
          return sneaker.rotation * progress
        })

        return (
          <motion.div
            key={sneaker.id}
            className="absolute"
            initial={{
              x: sneaker.startX,
              y: sneaker.startY,
              opacity: 0,
              scale: sneaker.initialScale,
            }}
            animate={{
              x: xPath,
              y: yPath,
              opacity: [0, sneaker.opacity, sneaker.opacity, sneaker.opacity], // Stay visible with random opacity
              scale: [sneaker.initialScale, sneaker.scale, sneaker.scale, sneaker.scale], // Scale variation
              rotate: rotationPath, // Random rotation throughout animation
            }}
            transition={{
              x: {
                duration: baseDuration,
                times,
                ease: 'easeOut',
              },
              y: {
                duration: baseDuration,
                times,
                ease: [0.4, 0, 0.6, 1], // Gravity curve
              },
              opacity: {
                duration: 0.8,
                times: [0, 0.2, 0.6, 1], // Slower fade in
                ease: 'easeOut',
              },
              scale: {
                duration: baseDuration,
                times,
                ease: 'easeOut',
              },
              rotate: {
                duration: baseDuration,
                times,
                ease: 'easeInOut',
              },
            }}
            onAnimationComplete={() => {
              // Mark as no longer animating, but keep visible
              setSneakers((prev) =>
                prev.map((s) => (s.id === sneaker.id ? { ...s, isAnimating: false } : s))
              )
            }}
            style={{
              transformOrigin: 'center center',
            }}
          >
            <Image
              src="/images/sneaker-updated.png"
              alt="Falling sneaker"
              width={SHOE_SIZE}
              height={SHOE_SIZE}
              className="drop-shadow-xl"
              style={{
                backgroundColor: 'transparent',
                filter: `${sneaker.colorFilter}`,
                imageRendering: 'auto',
                mixBlendMode: 'normal',
                WebkitFilter: `${sneaker.colorFilter}`,
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
