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
  let finalX = Math.max(radius, Math.min(viewportWidth - radius, currentX))
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
    
    // If we're close enough horizontally to stack on top
    if (Math.abs(finalX - existingX) < radius + existingRadius + 2) {
      // Calculate the top of the existing shoe
      const topOfExisting = existingY - existingRadius
      // Our shoe should sit on top of this one
      const ourBottom = topOfExisting - radius - 1
      // Update finalY to be the lowest (highest on screen) position
      if (ourBottom < finalY) {
        finalY = ourBottom
      }
    }
  }
  
  // Ensure no overlap with existing shoes - refine position
  let attempts = 0
  while (attempts < 100) {
    let hasCollision = false
    for (const existing of existingSneakers) {
      const existingX = existing.endX
      const existingY = existing.endY
      const existingRadius = (SHOE_SIZE * existing.scale) / 2
      
      if (checkCollision(finalX, finalY, radius, existingX, existingY, existingRadius)) {
        hasCollision = true
        // Try moving horizontally first
        const offsetX = (attempts % 2 === 0 ? 1 : -1) * (radius * 2 + 8) * Math.ceil((attempts + 1) / 2)
        finalX = Math.max(radius, Math.min(viewportWidth - radius, currentX + offsetX))
        
        // Recalculate Y based on new X - find where to stack
        finalY = baseY
        for (const existing2 of existingSneakers) {
          const existingX2 = existing2.endX
          const existingY2 = existing2.endY
          const existingRadius2 = (SHOE_SIZE * existing2.scale) / 2
          
          if (Math.abs(finalX - existingX2) < radius + existingRadius2 + 2) {
            const topOfExisting = existingY2 - existingRadius2
            const ourBottom = topOfExisting - radius - 1
            if (ourBottom < finalY) {
              finalY = ourBottom
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

    // Continuous settling effect - shoes adjust as pile grows
    const settlingInterval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const baseY = viewportHeight - PILE_BOTTOM_OFFSET
        
        // Only settle shoes that have finished initial animation
        const settledShoes = prev.filter(s => s.isSettled)
        if (settledShoes.length === 0) return prev

        return prev.map((sneaker) => {
          if (!sneaker.isSettled) return sneaker

          const radius = (SHOE_SIZE * sneaker.scale) / 2
          let newX = sneaker.currentX
          let newY = sneaker.currentY
          let newRotation = sneaker.currentRotation
          let needsAdjustment = false

          // Check all other shoes to see if we need to settle
          for (const other of prev) {
            if (other.id === sneaker.id || !other.isSettled) continue

            const otherX = other.currentX
            const otherY = other.currentY
            const otherRadius = (SHOE_SIZE * other.scale) / 2

            // If we're overlapping with another shoe, only adjust if we need to move DOWN (never up)
            if (Math.abs(newX - otherX) < radius + otherRadius + 2) {
              const otherTop = otherY - otherRadius
              const ourBottom = newY + radius

              // If we're overlapping, only move down (never up) and slightly sideways
              if (ourBottom > otherTop - 1) {
                const targetY = otherTop - radius - 1
                // Only move if target is below or equal to current (never up)
                if (targetY >= newY) {
                  newY = targetY
                  // Add slight horizontal shift to create natural pile
                  const shiftDirection = (Math.random() - 0.5) * 0.2
                  newX = Math.max(radius, Math.min(viewportWidth - radius, newX + shiftDirection * 8))
                  // DO NOT adjust rotation - keep landing angle
                  needsAdjustment = true
                }
              }
            }

            // If another shoe is above us and pushing, only shift sideways (never up)
            if (Math.abs(newX - otherX) < radius + otherRadius + 2) {
              const otherBottom = otherY + otherRadius
              const ourTop = newY - radius

              // If another shoe is above us, only shift sideways (never move up)
              if (otherBottom < ourTop + 3 && otherY < newY) {
                const shiftAmount = (Math.random() - 0.5) * 12
                newX = Math.max(radius, Math.min(viewportWidth - radius, newX + shiftAmount))
                // DO NOT adjust rotation - keep landing angle
                needsAdjustment = true
              }
            }
          }

          // Ensure we're not below the base
          if (newY > baseY) {
            newY = baseY
            needsAdjustment = true
          }

          // Only update if we need adjustment AND we're not moving up (never move up)
          // Also never change rotation - keep the landing angle
          if (needsAdjustment && newY >= sneaker.currentY && (Math.abs(newX - sneaker.currentX) > 0.5 || Math.abs(newY - sneaker.currentY) > 0.5)) {
            return {
              ...sneaker,
              currentX: newX,
              currentY: newY,
              currentRotation: sneaker.currentRotation, // Keep original rotation, never change
            }
          }

          return sneaker
        })
      })
    }, 500) // Check every 500ms for settling adjustments

    return () => {
      clearInterval(interval)
      clearInterval(settlingInterval)
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

        // If shoe is settled, use current position for continuous settling
        const finalX = sneaker.isSettled ? sneaker.currentX : xPath
        const finalY = sneaker.isSettled ? sneaker.currentY : yPath
        const finalRotate = sneaker.isSettled ? sneaker.currentRotation : rotationPath

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
              x: finalX,
              y: finalY,
              opacity: sneaker.opacity, // Always visible
              scale: sneaker.isSettled ? sneaker.scale : scalePath,
              rotate: finalRotate, // Tumbling rotation or current rotation
            }}
            transition={{
              x: {
                duration: sneaker.isSettled ? 0.8 : baseDuration, // Smooth settling transitions
                times: sneaker.isSettled ? undefined : times,
                ease: sneaker.isSettled ? 'easeOut' : 'easeOut',
              },
              y: {
                duration: sneaker.isSettled ? 0.8 : baseDuration, // Smooth settling transitions
                times: sneaker.isSettled ? undefined : times,
                ease: sneaker.isSettled ? 'easeOut' : [0.3, 0, 0.5, 1], // Gravity curve
              },
              opacity: {
                duration: 0.01, // Instant (no transition needed since always visible)
                ease: 'linear',
              },
              scale: {
                duration: sneaker.isSettled ? 0.8 : baseDuration,
                times: sneaker.isSettled ? undefined : times,
                ease: 'easeOut',
              },
              rotate: {
                duration: sneaker.isSettled ? 0.8 : baseDuration, // Smooth rotation adjustments
                times: sneaker.isSettled ? undefined : times,
                ease: 'easeInOut', // Smooth tumbling
              },
            }}
            onAnimationComplete={() => {
              // Mark as settled and update current position
              setSneakers((prev) =>
                prev.map((s) => 
                  s.id === sneaker.id 
                    ? { ...s, isAnimating: false, isSettled: true, currentX: s.endX, currentY: s.endY, currentRotation: s.finalRotation }
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
