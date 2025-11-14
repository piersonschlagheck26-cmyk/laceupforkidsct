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
  currentX: number // Current position (for continuous settling)
  currentY: number // Current position (for continuous settling)
  scale: number
  initialScale: number
  colorFilter: string
  rotation: number
  finalRotation: number // Final rotation after tumbling
  currentRotation: number // Current rotation (for continuous settling)
  brightness: number
  saturation: number
  hueRotate: number
  opacity: number
  bouncePoints: { x: number; y: number; rotation: number }[] // Include rotation in bounce points
  isAnimating: boolean
  isSettled: boolean // Whether shoe has finished initial animation
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
// Strict collision detection to prevent overlapping
const checkCollision = (
  x1: number, y1: number, radius1: number,
  x2: number, y2: number, radius2: number
): boolean => {
  const dx = x1 - x2
  const dy = y1 - y2
  const distance = Math.sqrt(dx * dx + dy * dy)
  const minDistance = radius1 + radius2 - 1 // Minimum gap of 1px to prevent overlap
  return distance < minDistance
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
  let velocityX = (Math.random() - 0.5) * 0.6 // Reduced horizontal velocity for denser pile
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
        
        // Only add bounce point if it's far enough from the last one (prevent vibration)
        const minBounceDistance = 15
        const shouldAddBounce = bouncePoints.length === 0 || 
          Math.sqrt(
            Math.pow(bounce.bounceX - bouncePoints[bouncePoints.length - 1].x, 2) +
            Math.pow(bounce.bounceY - bouncePoints[bouncePoints.length - 1].y, 2)
          ) > minBounceDistance
        
        if (shouldAddBounce) {
          bouncePoints.push({
            x: bounce.bounceX,
            y: bounce.bounceY,
            rotation: bounce.rotation,
          })
        }
        
        currentX = bounce.bounceX
        currentY = bounce.bounceY
        velocityX = bounce.newVelocityX
        velocityY = bounce.newVelocityY
        
        // If velocity is very small, settle (prevent micro-bounces)
        if (Math.abs(velocityX) < 0.15 && Math.abs(velocityY) < 0.15) {
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
  
  // Final position - find the lowest point on the pile (proper stacking)
  // Keep near center with slight random variation (pyramid forms from center)
  const centerX = viewportWidth / 2
  const randomOffsetX = (Math.random() - 0.5) * 12 // Smaller random variation, centered
  let finalX = centerX + randomOffsetX + (currentX - centerX) * 0.3 // Blend with current position, favor center
  finalX = Math.max(radius + 5, Math.min(viewportWidth - radius - 5, finalX)) // Keep away from edges
  let finalY = baseY
  
  // Find the highest point where this shoe can sit (stacking logic)
  // Check all existing shoes to find where to stack
  for (const existing of existingSneakers) {
    const existingX = existing.endX
    const existingY = existing.endY
    const existingRadius = (SHOE_SIZE * existing.scale) / 2
    
    // Calculate distance between centers
    const distance = Math.sqrt(
      Math.pow(finalX - existingX, 2) + Math.pow(finalY - existingY, 2)
    )
    
    // If we're close enough horizontally to stack on top (pyramid formation)
    const horizontalDistance = Math.abs(finalX - existingX)
    const combinedRadius = radius + existingRadius
    if (horizontalDistance < combinedRadius) {
      // Calculate the top of the existing shoe
      const topOfExisting = existingY - existingRadius
      // Our shoe should sit on top of this one
      const ourBottom = topOfExisting - radius - 1 // 1px gap to prevent overlap
      // Update finalY to be the lowest (highest on screen) position
      // CRITICAL: Never move up - only down or stay same level
      if (ourBottom < finalY && ourBottom >= currentY) {
        finalY = ourBottom
        // Slight horizontal adjustment to center if overlapping
        if (horizontalDistance < combinedRadius - 2) {
          const adjustDirection = finalX > existingX ? 1 : -1
          finalX = existingX + adjustDirection * (combinedRadius - 1)
        }
      }
    }
  }
  
  // Ensure no overlap with existing shoes - refine position (avoid corner-seeking)
  let attempts = 0
  while (attempts < 50) {
    let hasCollision = false
    for (const existing of existingSneakers) {
      const existingX = existing.endX
      const existingY = existing.endY
      const existingRadius = (SHOE_SIZE * existing.scale) / 2
      
      if (checkCollision(finalX, finalY, radius, existingX, existingY, existingRadius)) {
        hasCollision = true
        // Try moving horizontally - prefer moving toward center, not edges
        const directionToCenter = centerX > finalX ? 1 : -1
        // Try both directions but prefer center
        const tryDirection = attempts % 3 === 0 ? directionToCenter : (Math.random() < 0.5 ? -1 : 1)
        const offsetX = tryDirection * (radius * 1.2 + 3 + Math.random() * 6)
        const newX = finalX + offsetX
        
        // Keep away from edges (prevent corner-seeking)
        finalX = Math.max(radius + 10, Math.min(viewportWidth - radius - 10, newX))
        
        // Recalculate Y based on new X - find where to stack
        finalY = baseY
        for (const existing2 of existingSneakers) {
          const existingX2 = existing2.endX
          const existingY2 = existing2.endY
          const existingRadius2 = (SHOE_SIZE * existing2.scale) / 2
          
          const horizontalDist = Math.abs(finalX - existingX2)
          if (horizontalDist < radius + existingRadius2) {
            const topOfExisting = existingY2 - existingRadius2
            const ourBottom = topOfExisting - radius - 1 // 1px gap
            // CRITICAL: Never move up - only down or stay same level
            if (ourBottom < finalY && ourBottom >= currentY) {
              finalY = ourBottom
              // Adjust horizontally if too close
              if (horizontalDist < radius + existingRadius2 - 2) {
                const adjustDir = finalX > existingX2 ? 1 : -1
                finalX = existingX2 + adjustDir * (radius + existingRadius2 - 1)
                finalX = Math.max(radius + 10, Math.min(viewportWidth - radius - 10, finalX))
              }
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
      
      // Smaller random offset for denser pile (reduced from 30 to 20)
      const startXOffset = (Math.random() - 0.5) * 20
      const startX = (SOURCE_X_PERCENT / 100) * viewportWidth + startXOffset
      const startY = -SHOE_SIZE - Math.random() * 10
      
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
        currentX: result.endX, // Start at end position
        currentY: result.endY,
        scale,
        initialScale,
        colorFilter: colorProps.filterString,
        rotation,
        finalRotation,
        currentRotation: finalRotation, // Start at final rotation
        brightness: colorProps.brightness,
        saturation: colorProps.saturation,
        hueRotate: colorProps.hueRotate,
        opacity,
        bouncePoints: result.bouncePoints,
        isAnimating: true,
        isSettled: false,
      }
    }

    // Add first sneaker
    const firstSneaker = createSneaker([])
    if (firstSneaker) {
      setSneakers([firstSneaker])
    }

    // Add new sneakers - DENSER (more frequent for tighter pile)
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        const newSneaker = createSneaker(prev)
        if (!newSneaker) return prev
        return [...prev, newSneaker]
      })
    }, 2000) // Every 2 seconds for denser pile (was 2.5)

    // NO continuous settling - shoes stay exactly where they land
    // Removed settling interval to prevent any post-landing movement

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
        
        // Add bounce points with rotation (smooth transitions)
        let cumulativeRotation = 0
        sneaker.bouncePoints.forEach((bounce) => {
          // Only add if significantly different from last point (smooth out micro-movements)
          const lastY = yPath[yPath.length - 1]
          const lastX = xPath[xPath.length - 1]
          const distance = Math.sqrt(
            Math.pow(bounce.x - lastX, 2) + Math.pow(bounce.y - lastY, 2)
          )
          
          // Only add bounce if it's a significant movement
          if (distance > 10) {
            yPath.push(bounce.y)
            xPath.push(bounce.x)
            cumulativeRotation += bounce.rotation
            rotationPath.push(cumulativeRotation)
          }
        })
        
        // Add final landing position (ensure smooth transition)
        const lastY = yPath[yPath.length - 1]
        const lastX = xPath[xPath.length - 1]
        const finalDistance = Math.sqrt(
          Math.pow(sneaker.endX - lastX, 2) + Math.pow(sneaker.endY - lastY, 2)
        )
        
        // Only add final position if it's different enough
        if (finalDistance > 5) {
          yPath.push(sneaker.endY)
          xPath.push(sneaker.endX)
          rotationPath.push(sneaker.finalRotation)
        } else {
          // Update last position to final position for smooth settling
          yPath[yPath.length - 1] = sneaker.endY
          xPath[xPath.length - 1] = sneaker.endX
          rotationPath[rotationPath.length - 1] = sneaker.finalRotation
        }
        
        // Calculate duration - CONSTANT SPEED for all shoes (same speed regardless of distance)
        // Use a constant fall speed: pixels per second
        const FALL_SPEED = 200 // pixels per second (consistent for all shoes)
        const totalDistance = Math.abs(sneaker.endY - sneaker.startY)
        const baseDuration = totalDistance / FALL_SPEED // Constant speed calculation
        
        // Create times array for keyframes
        const numKeyframes = yPath.length
        const times = Array.from({ length: numKeyframes }, (_, i) => i / (numKeyframes - 1))
        
        // Build opacity path - always visible from the start (no fade in)
        const opacityPath = Array.from({ length: numKeyframes }, () => sneaker.opacity)
        
        // Build scale path
        const scalePath = Array.from({ length: numKeyframes }, (_, i) => {
          const progress = i / (numKeyframes - 1)
          if (progress < 0.1) return sneaker.initialScale
          if (progress < 0.2) return sneaker.initialScale * 0.95
          return sneaker.scale
        })

        // If shoe is settled, use STATIC positioning (no animation, locked forever)
        if (sneaker.isSettled) {
          return (
            <div
              key={sneaker.id}
              className="absolute"
              style={{
                left: `${sneaker.endX}px`,
                top: `${sneaker.endY}px`,
                transform: `translate(-50%, -50%) rotate(${sneaker.finalRotation}deg) scale(${sneaker.scale})`,
                transformOrigin: 'center center',
                opacity: sneaker.opacity,
                pointerEvents: 'none',
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
            </div>
          )
        }

        // For falling shoes, use animation
        return (
          <motion.div
            key={sneaker.id}
            className="absolute"
            initial={{
              x: sneaker.startX,
              y: sneaker.startY,
              opacity: sneaker.opacity, // Start visible, no fade in
              scale: sneaker.initialScale,
              rotate: 0,
            }}
            animate={{
              x: xPath,
              y: yPath,
              opacity: sneaker.opacity, // Always visible
              scale: scalePath,
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
                duration: 0.01, // Instant (no transition needed since always visible)
                ease: 'linear',
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
              // Mark as settled - position and rotation are locked forever
              setSneakers((prev) =>
                prev.map((s) => 
                  s.id === sneaker.id 
                    ? { ...s, isAnimating: false, isSettled: true }
                    : s
                )
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
