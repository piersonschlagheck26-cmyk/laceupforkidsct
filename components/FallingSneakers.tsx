'use client'

import { useEffect, useMemo, useState } from 'react'
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
  'hue-rotate(10deg) brightness(1.05)',
  'hue-rotate(45deg) saturate(1.1)',
  'hue-rotate(90deg) brightness(1.1)',
  'hue-rotate(150deg) saturate(0.95)',
  'hue-rotate(210deg) brightness(0.95)',
  'hue-rotate(280deg) saturate(1.2)',
]

export default function FallingSneakers() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setSneakers((prev) => {
        if (prev.length >= 48) {
          return prev
        }
        const id = Date.now() + Math.random()
        const left = Math.random() * 90
        const rotation = Math.random() * 40 - 20
        const duration = 6 + Math.random() * 5
        const endY = 260 + Math.random() * 140
        const tint = TINT_FILTERS[Math.floor(Math.random() * TINT_FILTERS.length)]

        return [
          ...prev,
          {
            id,
            left,
            rotation,
            duration,
            endY,
            tint,
          },
        ]
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  const layers = useMemo(() => sneakers.slice(0, 48), [sneakers])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {layers.map((sneaker) => (
        <motion.div
          key={sneaker.id}
          className="absolute"
          initial={{ y: -140, opacity: 0, scale: 0.8, rotate: sneaker.rotation - 8 }}
          animate={{ y: sneaker.endY, opacity: 0.95, scale: 1, rotate: sneaker.rotation }}
          transition={{ duration: sneaker.duration, ease: 'easeOut' }}
          style={{ left: `${sneaker.left}%`, filter: sneaker.tint }}
        >
          <Image
            src="/images/sneaker-top.svg"
            alt="Animated sneaker"
            width={90}
            height={180}
            className="opacity-90 drop-shadow-xl"
            priority={sneaker.id === layers[0]?.id}
          />
        </motion.div>
      ))}
    </div>
  )
}
