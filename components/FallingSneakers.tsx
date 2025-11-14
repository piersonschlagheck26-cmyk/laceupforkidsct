'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Sneaker {
  id: number
  left: number
  rotation: number
  duration: number
  endY: number
  zIndex: number
}

const MAX_SNEAKERS = 25
const PILE_START_Y = 480 // Just above the CTA buttons area

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if user is on home section
    const checkScroll = () => {
      const homeSection = document.getElementById('home')
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect()
        const isInView = rect.top >= -100 && rect.bottom <= window.innerHeight + 100
        setIsVisible(isInView)
      }
    }

    checkScroll()
    window.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    // Start falling animation
    const interval = setInterval(() => {
      if (!isVisible) return

      setSneakers((prev) => {
        // Keep accumulating shoes, don't remove them
        if (prev.length >= MAX_SNEAKERS) {
          return prev
        }

        const id = Date.now() + Math.random()
        const left = 8 + Math.random() * 84 // Spread across most of the width
        const rotation = Math.random() * 50 - 25
        const duration = 4 + Math.random() * 3 // 4-7 seconds
        const endY = PILE_START_Y + (prev.length % 8) * 15 + Math.random() * 20 // Pile up naturally
        const zIndex = prev.length

        return [
          ...prev,
          {
            id,
            left,
            rotation,
            duration,
            endY,
            zIndex,
          },
        ]
      })
    }, 800) // New shoe every 800ms

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [isVisible])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <AnimatePresence>
        {sneakers.map((sneaker) => (
          <motion.div
            key={sneaker.id}
            className="absolute"
            initial={{ y: -120, opacity: 0, scale: 0.6, rotate: sneaker.rotation - 15 }}
            animate={{ 
              y: sneaker.endY, 
              opacity: 0.85, 
              scale: 0.7 + Math.random() * 0.2, 
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
