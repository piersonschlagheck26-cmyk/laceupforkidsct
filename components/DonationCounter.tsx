'use client'

import { useEffect, useState } from 'react'

interface DonationCounterProps {
  targetCount: number
  caption?: string
}

export default function DonationCounter({ 
  targetCount, 
  caption = "pairs and counting, help us with our mission" 
}: DonationCounterProps) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    // Start animation after a brief delay
    const startTimer = setTimeout(() => {
      setHasStarted(true)
    }, 100)

    return () => clearTimeout(startTimer)
  }, [])

  useEffect(() => {
    if (!hasStarted) return

    const duration = 4000 // 4 seconds total
    const startTime = Date.now()
    const startValue = 0
    const endValue = targetCount

    // Easing function: easeOutCubic - starts fast, slows down
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3)
    }

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Apply easing
      const easedProgress = easeOutCubic(progress)
      const currentCount = Math.floor(startValue + (endValue - startValue) * easedProgress)
      
      setCount(currentCount)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue) // Ensure we end exactly at target
      }
    }

    requestAnimationFrame(animate)
  }, [hasStarted, targetCount])

  // Format number with commas
  const formattedCount = count.toLocaleString()

  return (
    <section className="relative bg-gradient-to-br from-primary-500 via-primary-400 to-accent-500 py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center">
          {/* Large Counter Number */}
          <div className="mb-4 sm:mb-6">
            <span 
              className="inline-block font-extrabold text-white"
              style={{
                fontSize: 'clamp(6rem, 12vw, 12rem)',
                lineHeight: '1',
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.4)',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {formattedCount}
            </span>
          </div>

          {/* Caption */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-medium px-4">
            {caption}
          </p>
        </div>
      </div>
    </section>
  )
}

