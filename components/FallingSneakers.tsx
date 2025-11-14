'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Sneaker {
  id: number
  left: number
  rotation: number
  duration: number
  endY: number
  zIndex: number
  scale: number
  initialRotation: number
}

const MAX_SNEAKERS = 25
const PILE_START_Y = 480 // Just above the CTA buttons area

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])
  const isVisibleRef = useRef(true)

  useEffect(() => {
    // Check if user is on home section
    const checkScroll = () => {
      const homeSection = document.getElementById('home')
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect()
        const isInView = rect.top >= -100 && rect.bottom <= window.innerHeight + 100
        isVisibleRef.current = isInView
      }
    }

    checkScroll()
    window.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    // Drop first shoe immediately
    const dropShoe = () => {
      setSneakers((prev) => {
        if (!isVisibleRef.current || prev.length >= MAX_SNEAKERS) {
          return prev
        }

        const id = Date.now() + Math.random()
        const left = 8 + Math.random() * 84
        const rotation = Math.random() * 50 - 25
        const initialRotation = rotation - 15
        const duration = 4 + Math.random() * 3
        const endY = PILE_START_Y + (prev.length % 8) * 15 + Math.random() * 20
        const zIndex = prev.length
        const scale = 0.7 + Math.random() * 0.2

        return [
          ...prev,
          {
            id,
            left,
            rotation,
            initialRotation,
            duration,
            endY,
            zIndex,
            scale,
          },
        ]
      })
    }

    // Drop first shoe immediately
    dropShoe()

    // Start falling animation
    const interval = setInterval(() => {
      dropShoe()
    }, 800) // New shoe every 800ms

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {sneakers.map((sneaker) => (
          <motion.div
            key={sneaker.id}
            className="absolute"
            initial={{ y: -120, opacity: 0, scale: 0.6, rotate: sneaker.initialRotation }}
            animate={{ 
              y: sneaker.endY, 
              opacity: 0.85, 
              scale: sneaker.scale, 
              rotate: sneaker.rotation 
            }}
            transition={{ 
              duration: sneaker.duration, 
              ease: [0.4, 0, 0.2, 1],
              opacity: { duration: 0.5 }
            }}
            style={{ 
              left: `${sneaker.left}%`, 
              zIndex: sneaker.zIndex,
            }}
          >
            <Image
              src="/images/sneaker-clipart.png"
              alt="Falling sneaker"
              width={80}
              height={80}
              className="drop-shadow-lg"
              priority={sneaker.id === sneakers[0]?.id}
              unoptimized
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
