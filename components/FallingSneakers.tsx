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
  initialScale: number
  colorFilter: string
  rotation: number
  finalRotation: number // Final rotation after tumbling
  brightness: number
  saturation: number
  hueRotate: number
  opacity: number
  bouncePoints: { x: number; y: number; rotation: number }[] // Include rotation in bounce points
  isAnimating: boolean
}

const SHOE_SIZE = 80
const SOURCE_X_PERCENT = 50
const PILE_BOTTOM_OFFSET = 80
const MAX_SNEAKERS = 100

// Generate random color filter for each shoe
const generateColorFilter = () => {
  const brightness = 0.95 + Math.random() * 0.3
  const saturation = 1.0 + Math.random() * 0.5
  const hueRotate = (Math.random() - 0.5) * 40
  const sepia = Math.random() * 0.4
  
  return {
    brightness,
    saturation,
    hueRotate,
    sepia,
    filterString: `brightness(${brightness}) saturate(${saturation}) hue-rotate(${hueRotate}deg) sepia(${sepia})`,
  }
}

// Circular collision check (treat shoes as circles)
const checkCollision = (
  x1: number, y1: number, radius1: number,
  x2: number, y2: number, radius2: number
): boolean => {
  const dx = x1 - x2
  const dy = y1 - y2
  const distance = Math.sqrt(dx * dx + dy * dy)
  return distance < radius1 + radius2
}

// Calculate bounce physics for circular objects
const calculateBounce = (
  fallingX: number,
  fallingY: number,
  fallingRadius: number,
  hitX: number,
  hitY: number,
  hitRadius: number,
  velocityX: number,
  velocityY: number
): { bounceX: number; bounceY: number; newVelocityX: number; newVelocityY: number; rotation: number } => {
  // Calculate collision normal (direction from hit object to falling object)
  const dx = fallingX - hitX
  const dy = fallingY - hitY
  const distance = Math.sqrt(dx * dx + dy * dy) || 1
  
  const normalX = dx / distance
  const normalY = dy / distance
  
  // Calculate relative velocity
  const relativeVelocityX = velocityX
  const relativeVelocityY = velocityY
  
  // Calculate velocity along normal
  const velocityAlongNormal = relativeVelocityX * normalX + relativeVelocityY * normalY
  
  // Don't resolve if velocities are separating
  if (velocityAlongNormal > 0) {
    return {
      bounceX: fallingX,
      bounceY: fallingY,
      newVelocityX: velocityX,
      newVelocityY: velocityY,
      rotation: 0,
    }
  }
  
  // Calculate restitution (bounciness) - less bouncy for more realistic settling
  const restitution = 0.3 + Math.random() * 0.2 // 0.3-0.5
  
  // Calculate impulse
  const impulse = -(1 + restitution) * velocityAlongNormal
  
  // Apply impulse
  const newVelocityX = velocityX + impulse * normalX
  const newVelocityY = velocityY + impulse * normalY
  
  // Calculate bounce position - move away from collision
  const minSeparation = fallingRadius + hitRadius + 2
  const bounceX = hitX + normalX * minSeparation
  const bounceY = hitY + normalY * minSeparation
  
  // Add random tumbling rotation based on bounce
  const rotation = (Math.random() - 0.5) * 30 * Math.abs(impulse) / 2
  
  return {
    bounceX,
    bounceY,
    newVelocityX: newVelocityX * 0.7, // Damping
    newVelocityY: newVelocityY * 0.7,
    rotation,
  }
}

// Simulate fall with realistic physics
const simulateFall = (
  startX: number,
  startY: number,
  existingSneakers: Sneaker[],
  viewportWidth: number,
  viewportHeight: number,
  scale: number
): { endX: number; endY: number; bouncePoints: { x: number; y: number; rotation: number }[] } => {
  const radius = (SHOE_SIZE * scale) / 2
  const baseY = viewportHeight - PILE_BOTTOM_OFFSET
  
  let currentX = startX
  let currentY = startY
  let velocityX = (Math.random() - 0.5) * 0.8 // Initial horizontal velocity
  let velocityY = 0.5 + Math.random() * 0.3 // Initial vertical velocity (gravity)
  const bouncePoints: { x: number; y: number; rotation: number }[] = []
  
  const gravity = 0.15 // Gravity acceleration
  const damping = 0.98 // Air resistance
  const stepSize = 4 // Smaller steps for smoother physics
  
  // Simulate physics step by step
  for (let step = 0; step < 2000; step++) {
    // Apply gravity
    velocityY += gravity
    
    // Apply damping
    velocityX *= damping
    velocityY *= damping
    
    // Update position
    currentX += velocityX
    currentY += velocityY
    
    // Boundary checks
    if (currentX < radius) {
      currentX = radius
      velocityX *= -0.5 // Bounce off left wall
    }
    if (currentX > viewportWidth - radius) {
      currentX = viewportWidth - radius
      velocityX *= -0.5 // Bounce off right wall
    }
    
    // Check collision with existing shoes
    for (const existing of existingSneakers) {
      const existingX = existing.endX
      const existingY = existing.endY
      const existingRadius = (SHOE_SIZE * existing.scale) / 2
      
      if (checkCollision(currentX, currentY, radius, existingX, existingY, existingRadius)) {
        const bounce = calculateBounce(
          currentX,
          currentY,
          radius,
          existingX,
          existingY,
          existingRadius,
          velocityX,
          velocityY
        )
        
        bouncePoints.push({
          x: bounce.bounceX,
          y: bounce.bounceY,
          rotation: bounce.rotation,
        })
        
        currentX = bounce.bounceX
        currentY = bounce.bounceY
        velocityX = bounce.newVelocityX
        velocityY = bounce.newVelocityY
        
        // If velocity is very small, settle
        if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
          break
        }
      }
    }
    
    // Stop if we've reached the pile area and velocity is low
    if (currentY >= baseY - 50 && Math.abs(velocityY) < 0.2) {
      break
    }
    
    // Stop if we've gone too far
    if (currentY > baseY + 100) {
      break
    }
  }
  
  // Final position - find the lowest point on the pile
  let finalY = baseY
  let finalX = Math.max(radius, Math.min(viewportWidth - radius, currentX))
  
  // Check all existing shoes to find the highest point
  for (const existing of existingSneakers) {
    const existingX = existing.endX
    const existingY = existing.endY
    const existingRadius = (SHOE_SIZE * existing.scale) / 2
    
    // If we're above this shoe, check if we should sit on it
    if (Math.abs(finalX - existingX) < radius + existingRadius) {
      const topOfExisting = existingY - existingRadius
      if (topOfExisting < finalY) {
        finalY = topOfExisting - radius - 1 // Sit on top
      }
    }
  }
  
  // Ensure no overlap with existing shoes
  let attempts = 0
  while (attempts < 50) {
    let hasCollision = false
    for (const existing of existingSneakers) {
      const existingX = existing.endX
      const existingY = existing.endY
      const existingRadius = (SHOE_SIZE * existing.scale) / 2
      
      if (checkCollision(finalX, finalY, radius, existingX, existingY, existingRadius)) {
        hasCollision = true
        // Try moving horizontally
        const offsetX = (attempts % 2 === 0 ? 1 : -1) * (radius * 2 + 5) * Math.ceil((attempts + 1) / 2)
        finalX = Math.max(radius, Math.min(viewportWidth - radius, currentX + offsetX))
        
        // Recalculate Y based on new X
        finalY = baseY
        for (const existing2 of existingSneakers) {
          const existingX2 = existing2.endX
          const existingY2 = existing2.endY
          const existingRadius2 = (SHOE_SIZE * existing2.scale) / 2
          
          if (Math.abs(finalX - existingX2) < radius + existingRadius2) {
            const topOfExisting = existingY2 - existingRadius2
            if (topOfExisting < finalY) {
              finalY = topOfExisting - radius - 1
            }
          }
        }
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
      const scale = 0.6 + Math.random() * 0.5
      
      // Slight random offset to start position
      const startXOffset = (Math.random() - 0.5) * 30
      const startX = (SOURCE_X_PERCENT / 100) * viewportWidth + startXOffset
      const startY = -SHOE_SIZE - Math.random() * 15
      
      // Simulate fall with collision detection
      const result = simulateFall(startX, startY, existing, viewportWidth, viewportHeight, scale)
      
      // Generate random color properties
      const colorProps = generateColorFilter()
      
      // Random rotation (-15 to 15 degrees)
      const rotation = (Math.random() - 0.5) * 30
      const finalRotation = (Math.random() - 0.5) * 20 // Final settled rotation
      
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
        finalRotation,
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

    // Add new sneakers - SLOWED DOWN (trickling in like sand)
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        const newSneaker = createSneaker(prev)
        if (!newSneaker) return prev
        return [...prev, newSneaker]
      })
    }, 2500) // Much slower: every 2.5 seconds (trickling effect)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {sneakers.map((sneaker) => {
        // Build animation path: start -> bounces -> end
        const yPath = [sneaker.startY]
        const xPath = [sneaker.startX]
        const rotationPath = [0]
        
        // Add bounce points with rotation
        sneaker.bouncePoints.forEach((bounce) => {
          yPath.push(bounce.y)
          xPath.push(bounce.x)
          rotationPath.push(rotationPath[rotationPath.length - 1] + bounce.rotation)
        })
        
        // Add final landing position
        yPath.push(sneaker.endY)
        xPath.push(sneaker.endX)
        rotationPath.push(sneaker.finalRotation)
        
        // Calculate duration - graceful slow fall
        const totalDistance = Math.abs(sneaker.endY - sneaker.startY)
        const baseDuration = 6.0 + (totalDistance / 1000) * 4.0 // 6-10 seconds (graceful)
        
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
              scale: sneaker.initialScale,
              rotate: 0,
            }}
            animate={{
              x: xPath,
              y: yPath,
              opacity: [0, 0, sneaker.opacity, sneaker.opacity], // Graceful fade in (not sharp)
              scale: [sneaker.initialScale, sneaker.initialScale * 0.95, sneaker.scale, sneaker.scale],
              rotate: rotationPath, // Tumbling rotation
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
                ease: [0.3, 0, 0.5, 1], // Gravity curve
              },
              opacity: {
                duration: baseDuration,
                times: [0, 0.1, 0.3, 1], // Graceful fade in over 30% of animation
                ease: 'easeIn',
              },
              scale: {
                duration: baseDuration,
                times,
                ease: 'easeOut',
              },
              rotate: {
                duration: baseDuration,
                times,
                ease: 'easeInOut', // Smooth tumbling
              },
            }}
            onAnimationComplete={() => {
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
