'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Sneaker {
  id: string
  level: number
  position: number // Position within level (0-indexed)
  startX: number
  endX: number
  startY: number
  endY: number
  scale: number
  colorFilter: string
  rotation: number
  finalRotation: number
  opacity: number
  isAnimating: boolean
  hasFinished: boolean
}

const SHOE_SIZE = 100 // Slightly bigger to fill screen
const FALL_DURATION = 2.8 // Slow falling speed (2.5-3 seconds)

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

// Calculate pyramid positions: 5 base, 4 second, 3 third, 2 fourth, 1 top
const calculatePyramidPositions = (
  viewportWidth: number,
  viewportHeight: number,
  descriptionBottom: number, // Y position just under description text
  buttonsTop: number // Y position above donate buttons
): Array<{ level: number; position: number; x: number; y: number }> => {
  const positions: Array<{ level: number; position: number; x: number; y: number }> = []
  const centerX = viewportWidth / 2
  
  // Pyramid structure: 5 on bottom, then 4, 3, 2, 1 on top
  // levels[0] = bottom level (5 shoes), levels[4] = top level (1 shoe)
  const levels = [5, 4, 3, 2, 1]
  const totalLevels = levels.length
  
  // Calculate available height for pyramid
  const pyramidHeight = buttonsTop - descriptionBottom
  // Distribute levels with decreased spacing between levels
  // Top level (index 4) should be just under description, bottom level (index 0) should be above buttons
  // Use smaller spacing factor to bring levels closer together
  const levelSpacing = pyramidHeight / (totalLevels + 2) // Decreased spacing - levels closer together
  
  // Calculate shoe spacing within each level - EXTRA spaced out to prevent ANY overlap
  // Use 50% gap between shoes to ensure they never overlap
  const minSpacing = SHOE_SIZE * 1.5 // 50% gap - NO overlap possible
  
  levels.forEach((shoeCount, levelIndex) => {
    // Calculate Y position for this level
    // Reverse the order: top level (index 4 = 1 shoe) should be just under description
    // Bottom level (index 0 = 5 shoes) should be above buttons
    // Reverse levelIndex so level 4 (top) is at descriptionBottom, level 0 (bottom) is near buttonsTop
    const reversedIndex = totalLevels - 1 - levelIndex
    const levelY = descriptionBottom + reversedIndex * levelSpacing
    
    // Calculate total width needed for this level with proper spacing
    const totalWidth = (shoeCount - 1) * minSpacing
    const startX = centerX - totalWidth / 2
    
    // Position each shoe in this level - NO random offsets, precise positioning
    for (let pos = 0; pos < shoeCount; pos++) {
      const x = startX + pos * minSpacing
      
      positions.push({
        level: levelIndex,
        position: pos,
        x,
        y: levelY,
      })
    }
  })
  
  return positions
}

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
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

    // Wait for DOM to be ready, then calculate pyramid positions
    const initAnimation = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      // Measure description/tagline bottom dynamically - top shoe should be just under description
      // The description is the paragraph with "Lace Up for Kids recycles gently used shoes..."
      const descriptionElement = document.querySelector('#home p.text-xl, #home p.text-2xl')
      let descriptionBottom = 400 // Fallback estimate
      if (descriptionElement) {
        const descRect = descriptionElement.getBoundingClientRect()
        descriptionBottom = descRect.bottom + 20 // Description bottom + small spacing for top shoe
      }
      
      // Measure buttons top dynamically - bottom shoes should stack above buttons
      const buttonsContainer = document.querySelector('.btn-primary')?.parentElement
      let buttonsTop = viewportHeight - 250 // Fallback estimate
      if (buttonsContainer) {
        const buttonsRect = buttonsContainer.getBoundingClientRect()
        buttonsTop = buttonsRect.top - 20 // Buttons top - spacing for bottom shoes
      }
      
      const pyramidPositions = calculatePyramidPositions(
        viewportWidth,
        viewportHeight,
        descriptionBottom,
        buttonsTop
      )

      // Create all 15 shoes with their target positions
      const allSneakers: Sneaker[] = pyramidPositions.map((pos, index) => {
      const colorProps = generateColorFilter()
      const scale = 0.9 + Math.random() * 0.2 // Slightly different sizes (0.9-1.1)
      const rotation = (Math.random() - 0.5) * 360 // Random rotation
      const opacity = 0.5 + Math.random() * 0.2 // Transparency variation
      
      // Start position: random X near center, top of screen
      const startX = viewportWidth / 2 + (Math.random() - 0.5) * 100
      const startY = -SHOE_SIZE - Math.random() * 50
      
      return {
        id: `sneaker-${index}`,
        level: pos.level,
        position: pos.position,
        startX,
        endX: pos.x,
        startY,
        endY: pos.y,
        scale,
        colorFilter: colorProps.filterString,
        rotation,
        finalRotation: rotation + (Math.random() - 0.5) * 40, // Visible tumbling adds moderate rotation
        opacity,
        isAnimating: false,
        hasFinished: false,
      }
    })

      // Sort by level (base first) and position within level
      allSneakers.sort((a, b) => {
        if (a.level !== b.level) return a.level - b.level // Lower level first
        return a.position - b.position // Lower position first
      })

      setSneakers(allSneakers)

      // Start falling animation: one shoe at a time
      let index = 0
      const fallInterval = setInterval(() => {
        if (!isActiveRef.current || index >= allSneakers.length) {
          clearInterval(fallInterval)
          return
        }

        setSneakers((prev) =>
          prev.map((sneaker, i) =>
            i === index ? { ...sneaker, isAnimating: true } : sneaker
          )
        )

        setCurrentIndex(index)
        index++
      }, FALL_DURATION * 1000) // Wait for previous shoe to finish before starting next

      return () => {
        clearInterval(fallInterval)
      }
    }

    // Wait for DOM to be ready
    if (document.readyState === 'complete') {
      initAnimation()
    } else {
      window.addEventListener('load', initAnimation)
    }

    return () => {
      window.removeEventListener('scroll', checkVisibility)
      window.removeEventListener('resize', checkVisibility)
      window.removeEventListener('load', initAnimation)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[5]">
      {sneakers.map((sneaker) => {
        // If not animating yet, don't render
        if (!sneaker.isAnimating && !sneaker.hasFinished) {
          return null
        }

        // If finished animating, show static position
        if (sneaker.hasFinished) {
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
                  filter: sneaker.colorFilter,
                  imageRendering: 'auto',
                  mixBlendMode: 'normal',
                  WebkitFilter: sneaker.colorFilter,
                  width: `${SHOE_SIZE * sneaker.scale}px`,
                  height: `${SHOE_SIZE * sneaker.scale}px`,
                }}
                unoptimized
                priority={false}
              />
            </div>
          )
        }

        // Animate falling with visible tumbling
        const tumblingRotations = [
          sneaker.rotation,
          sneaker.rotation + (Math.random() - 0.5) * 20, // Visible tumbling
          sneaker.rotation + (Math.random() - 0.5) * 30, // Visible tumbling
          sneaker.finalRotation,
        ]

        return (
          <motion.div
            key={sneaker.id}
            className="absolute"
            initial={{
              x: sneaker.startX,
              y: sneaker.startY,
              opacity: sneaker.opacity,
              scale: sneaker.scale * 0.8,
              rotate: sneaker.rotation,
            }}
            animate={{
              x: sneaker.endX,
              y: sneaker.endY,
              opacity: sneaker.opacity,
              scale: sneaker.scale,
              rotate: tumblingRotations,
            }}
            transition={{
              x: {
                duration: FALL_DURATION,
                ease: [0.3, 0, 0.7, 1], // Ease out with slight curve
              },
              y: {
                duration: FALL_DURATION,
                ease: [0.2, 0, 0.6, 1], // Gravity curve
              },
              opacity: {
                duration: 0.1,
                ease: 'linear',
              },
              scale: {
                duration: FALL_DURATION,
                ease: 'easeOut',
              },
              rotate: {
                duration: FALL_DURATION,
                times: [0, 0.3, 0.7, 1],
                ease: 'easeInOut', // Smooth tumbling
              },
            }}
            onAnimationComplete={() => {
              // Mark as finished
              setSneakers((prev) =>
                prev.map((s) =>
                  s.id === sneaker.id ? { ...s, hasFinished: true, isAnimating: false } : s
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
                filter: sneaker.colorFilter,
                imageRendering: 'auto',
                mixBlendMode: 'normal',
                WebkitFilter: sneaker.colorFilter,
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
