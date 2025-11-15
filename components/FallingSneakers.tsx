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
  finalRotation: number
  brightness: number
  saturation: number
  hueRotate: number
  opacity: number
  bouncePoints: { x: number; y: number; rotation: number }[]
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
  // Increased horizontal velocity for random dispersion (triangle pattern)
  let velocityX = (Math.random() - 0.5) * 1.5 // More random horizontal movement
  let velocityY = 0.5 + Math.random() * 0.3
  const bouncePoints: { x: number; y: number; rotation: number }[] = []
  
  const gravity = 0.15
  const damping = 0.98
  const stepSize = 4
  
  // Add random wobble for more natural random falling
  const wobbleAmount = Math.random() * 0.4
  const wobbleFrequency = 0.05 + Math.random() * 0.05
  
  // Simulate physics step by step
  for (let step = 0; step < 2000; step++) {
    // Apply gravity
    velocityY += gravity
    
    // Apply damping
    velocityX *= damping
    velocityY *= damping
    
    // Add random wobble for natural random falling (triangle pattern)
    const wobble = Math.sin(currentY * wobbleFrequency) * wobbleAmount * (Math.random() - 0.5)
    
    // Update position with random wobble
    currentX += velocityX + wobble
    currentY += velocityY
    
    // Boundary checks
    if (currentX < radius) {
      currentX = radius
      velocityX *= -0.5
    }
    if (currentX > viewportWidth - radius) {
      currentX = viewportWidth - radius
      velocityX *= -0.5
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
        
        // Only add bounce point if it's far enough from the last one
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
        
        // If velocity is very small, settle
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
  
  // Final position - CRITICAL: Never move up from where physics simulation ended
  // Keep some center bias for triangle/pyramid pattern
  const centerX = viewportWidth / 2
  const centerBias = 0.2 // Slight bias toward center for pyramid
  let finalX = currentX * (1 - centerBias) + centerX * centerBias
  finalX = Math.max(radius, Math.min(viewportWidth - radius, finalX))
  
  // Start from where physics ended - NEVER go higher (smaller Y)
  let finalY = currentY // Start at actual landing position from physics
  
  // Find the lowest point we can sit (only move DOWN, never up)
  for (const existing of existingSneakers) {
    const existingX = existing.endX
    const existingY = existing.endY
    const existingRadius = (SHOE_SIZE * existing.scale) / 2
    
    // If we're close enough horizontally to stack on top
    if (Math.abs(finalX - existingX) < radius + existingRadius + 2) {
      const topOfExisting = existingY - existingRadius
      const ourBottom = topOfExisting - radius - 1
      // Only move DOWN (larger Y value) - never up
      if (ourBottom > finalY) {
        finalY = ourBottom
      }
    }
  }
  
  // Ensure we're not below base
  if (finalY > baseY) {
    finalY = baseY
  }
  
  // Ensure no overlap with existing shoes - only adjust horizontally or DOWN
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
        
        // Recalculate Y based on new X - only move DOWN
        let newY = currentY // Start from physics landing position
        for (const existing2 of existingSneakers) {
          const existingX2 = existing2.endX
          const existingY2 = existing2.endY
          const existingRadius2 = (SHOE_SIZE * existing2.scale) / 2
          
          if (Math.abs(finalX - existingX2) < radius + existingRadius2 + 2) {
            const topOfExisting = existingY2 - existingRadius2
            const ourBottom = topOfExisting - radius - 1
            // Only move DOWN (larger Y value)
            if (ourBottom > newY) {
              newY = ourBottom
            }
          }
        }
        // Only update if newY is at or below currentY (never move up)
        if (newY >= finalY) {
          finalY = newY
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
      
      // Random start position with center bias for triangle/pyramid pattern
      // More variation for random falling, but still centered
      const centerBias = 0.3 // 30% toward center, 70% random
      const centerX = viewportWidth / 2
      const randomOffset = (Math.random() - 0.5) * 60 // More variation
      const startX = centerX * centerBias + ((SOURCE_X_PERCENT / 100) * viewportWidth + randomOffset) * (1 - centerBias)
      const startY = -SHOE_SIZE - Math.random() * 15
      
      // Simulate fall with collision detection
      const result = simulateFall(startX, startY, existing, viewportWidth, viewportHeight, scale)
      
      // Generate random color properties
      const colorProps = generateColorFilter()
      
      // Random initial rotation - completely random angle
      const rotation = (Math.random() - 0.5) * 360 // Full 360 degree random rotation
      // Calculate final rotation from all bounce rotations (tumbling adds to rotation)
      const cumulativeBounceRotation = result.bouncePoints.reduce((sum, bounce) => sum + bounce.rotation, 0)
      const finalRotation = rotation + cumulativeBounceRotation // Total rotation from tumbling
      // This finalRotation is LOCKED and will NEVER change
      
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

    // Add new sneakers
    const interval = setInterval(() => {
      if (!isActiveRef.current) return

      setSneakers((prev) => {
        const newSneaker = createSneaker(prev)
        if (!newSneaker) return prev
        
        // When a new shoe lands, existing shoes can tumble down (like rocks)
        // Only shoes that are NOT animating can tumble
        const viewportHeight = window.innerHeight
        const baseY = viewportHeight - PILE_BOTTOM_OFFSET
        const newSneakers = prev.map((existing) => {
          // Only check settled shoes (not currently falling)
          if (existing.isAnimating) return existing
          
          const existingRadius = (SHOE_SIZE * existing.scale) / 2
          const newRadius = (SHOE_SIZE * newSneaker.scale) / 2
          
          // Check if new shoe is above this existing shoe and close horizontally
          if (Math.abs(newSneaker.endX - existing.endX) < existingRadius + newRadius + 2) {
            const newShoeBottom = newSneaker.endY + newRadius
            const existingTop = existing.endY - existingRadius
            
            // If new shoe is above existing shoe, existing shoe might need to tumble down
            if (newShoeBottom < existingTop + 3 && newSneaker.endY < existing.endY) {
              // Find the lowest stable position this shoe can tumble to
              let lowestY = existing.endY // Start from current position
              
              // Try moving down incrementally to find lowest stable position
              for (let testY = existing.endY + 2; testY <= baseY; testY += 2) {
                let hasCollision = false
                
                // Check collision with new shoe
                if (checkCollision(existing.endX, testY, existingRadius, newSneaker.endX, newSneaker.endY, newRadius)) {
                  hasCollision = true
                }
                
                // Check collision with other existing shoes
                if (!hasCollision) {
                  for (const other of prev) {
                    if (other.id === existing.id || other.isAnimating) continue
                    const otherRadius = (SHOE_SIZE * other.scale) / 2
                    if (checkCollision(existing.endX, testY, existingRadius, other.endX, other.endY, otherRadius)) {
                      hasCollision = true
                      break
                    }
                  }
                }
                
                // If no collision, this is a valid lower position
                if (!hasCollision) {
                  lowestY = testY
                } else {
                  // Hit something, stop here
                  break
                }
              }
              
              // Only tumble if we found a lower position (larger Y = lower on screen)
              if (lowestY > existing.endY && lowestY <= baseY) {
                return {
                  ...existing,
                  endX: existing.endX, // Keep X position
                  endY: lowestY, // Tumble down to lowest stable position
                  // Rotation stays the same - no reorientation
                }
              }
            }
          }
          
          return existing
        })
        
        return [...newSneakers, newSneaker]
      })
    }, 2000)

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {sneakers.map((sneaker) => {
        // If shoe has finished animating, use STATIC positioning (locked forever)
        // But allow smooth tumbling down if position changes
        if (!sneaker.isAnimating) {
          return (
            <motion.div
              key={sneaker.id}
              className="absolute"
              initial={{
                x: sneaker.endX,
                y: sneaker.endY,
                rotate: sneaker.finalRotation,
                scale: sneaker.scale,
                opacity: sneaker.opacity,
              }}
              animate={{
                x: sneaker.endX,
                y: sneaker.endY,
                rotate: sneaker.finalRotation, // NEVER changes
                scale: sneaker.scale,
                opacity: sneaker.opacity,
              }}
              transition={{
                x: { duration: 0.3, ease: 'easeOut' },
                y: { duration: 0.3, ease: 'easeOut' }, // Smooth tumbling down
                rotate: { duration: 0 }, // Instant - rotation never changes
                scale: { duration: 0 },
                opacity: { duration: 0 },
              }}
              style={{
                transformOrigin: 'center center',
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
            </motion.div>
          )
        }

        // Build animation path: start -> bounces -> end
        const yPath = [sneaker.startY]
        const xPath = [sneaker.startX]
        // Start rotation from initial random rotation (not 0)
        const rotationPath = [sneaker.rotation]
        
        // Add bounce points with rotation (tumbling adds to initial rotation)
        let cumulativeRotation = sneaker.rotation
        sneaker.bouncePoints.forEach((bounce) => {
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
        
        // Add final landing position with final rotation
        const lastY = yPath[yPath.length - 1]
        const lastX = xPath[xPath.length - 1]
        const finalDistance = Math.sqrt(
          Math.pow(sneaker.endX - lastX, 2) + Math.pow(sneaker.endY - lastY, 2)
        )
        
        if (finalDistance > 5) {
          yPath.push(sneaker.endY)
          xPath.push(sneaker.endX)
          rotationPath.push(sneaker.finalRotation) // Final locked rotation
        } else {
          yPath[yPath.length - 1] = sneaker.endY
          xPath[xPath.length - 1] = sneaker.endX
          rotationPath[rotationPath.length - 1] = sneaker.finalRotation // Final locked rotation
        }
        
        // Calculate duration - CONSTANT SPEED for all shoes
        const FALL_SPEED = 200 // pixels per second
        const totalDistance = Math.abs(sneaker.endY - sneaker.startY)
        const baseDuration = totalDistance / FALL_SPEED
        
        // Create times array for keyframes
        const numKeyframes = yPath.length
        const times = Array.from({ length: numKeyframes }, (_, i) => i / (numKeyframes - 1))
        
        // Build opacity path - always visible from the start
        const opacityPath = Array.from({ length: numKeyframes }, () => sneaker.opacity)
        
        // Build scale path
        const scalePath = Array.from({ length: numKeyframes }, (_, i) => {
          const progress = i / (numKeyframes - 1)
          if (progress < 0.1) return sneaker.initialScale
          if (progress < 0.2) return sneaker.initialScale * 0.95
          return sneaker.scale
        })

        return (
          <motion.div
            key={sneaker.id}
            className="absolute"
            initial={{
              x: sneaker.startX,
              y: sneaker.startY,
              opacity: sneaker.opacity,
              scale: sneaker.initialScale,
              rotate: sneaker.rotation, // Start with initial random rotation
            }}
            animate={{
              x: xPath,
              y: yPath,
              opacity: opacityPath,
              scale: scalePath,
              rotate: rotationPath,
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
                ease: [0.3, 0, 0.5, 1],
              },
              opacity: {
                duration: 0.01,
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
                ease: 'easeInOut',
              },
            }}
            onAnimationComplete={() => {
              // Mark as settled - position and rotation are LOCKED FOREVER
              setSneakers((prev) =>
                prev.map((s) => 
                  s.id === sneaker.id 
                    ? { ...s, isAnimating: false }
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
