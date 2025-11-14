'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Sneaker {
  id: number
  left: number
  rotation: number
  duration: number
  endY: number
  tint: string
}

const TINT_FILTERS = [
  'brightness(1) saturate(1)',
  'hue-rotate(15deg) brightness(1.05)',
  'hue-rotate(45deg) saturate(1.1)',
  'hue-rotate(90deg) brightness(1.1)',
  'hue-rotate(150deg) saturate(0.95)',
  'hue-rotate(210deg) brightness(0.95)',
  'hue-rotate(280deg) saturate(1.15)',
]

const MAX_SNEAKERS = 18

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setSneakers((prev) => {
        const id = Date.now() + Math.random()
        const left = 5 + Math.random() * 90
        const rotation = Math.random() * 40 - 20
        const duration = 6 + Math.random() * 5
        const endY = 420 + Math.random() * 160
        const tint = TINT_FILTERS[Math.floor(Math.random() * TINT_FILTERS.length)]
        const next = [...prev.slice(Math.max(0, prev.length - (MAX_SNEAKERS - 1))), {
          id,
          left,
          rotation,
          duration,
          endY,
          tint,
        }]

        setTimeout(() => {
          setSneakers((current) => current.filter((s) => s.id !== id))
        }, (duration + 0.5) * 1000)

        return next
      })
    }, 900)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sneakers.map((sneaker) => (
        <motion.div
          key={sneaker.id}
          className="absolute"
          initial={{ y: -160, opacity: 0, scale: 0.8, rotate: sneaker.rotation - 8 }}
          animate={{ y: sneaker.endY, opacity: 0.2, scale: 1, rotate: sneaker.rotation }}
          transition={{ duration: sneaker.duration, ease: 'easeInOut' }}
          style={{ left: `${sneaker.left}%`, filter: sneaker.tint }}
        >
          <Image
            src="/images/sneaker-top.svg"
            alt="Animated sneaker"
            width={90}
            height={180}
            className="drop-shadow-xl opacity-80"
            priority={false}
          />
        </motion.div>
      ))}
    </div>
  )
}
