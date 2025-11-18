'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface DonationCounterProps {
  targetCount: number
  caption?: string
}

export default function DonationCounter({ 
  targetCount, 
  caption = "Pairs Donated, and Counting." 
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

    const duration = 8000 // 8 seconds total
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
    <section className="relative bg-gradient-to-br from-primary-500 via-primary-400 to-accent-500 py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden shadow-2xl">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 md:mb-10 flex justify-center">
            <div className="relative w-24 h-30 sm:w-28 sm:h-36 md:w-32 md:h-40 lg:w-36 lg:h-44 drop-shadow-2xl">
              <Image
                src="/assets/logo.png"
                alt="Lace Up for Kids logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Large Counter Number */}
          <div className="mb-6 sm:mb-8 md:mb-10 relative inline-block">
            {/* Radial gradient background behind numbers - circular fade blending into background */}
            <div 
              className="absolute inset-0 -z-10"
              style={{
                background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.4) 20%, rgba(0, 0, 0, 0.2) 40%, rgba(245, 171, 5, 0.3) 60%, rgba(245, 171, 5, 0.1) 80%, transparent 100%)',
                transform: 'scale(2.5)',
                filter: 'blur(40px)',
                opacity: 0.9
              }}
            ></div>
            <span 
              className="relative inline-block font-extrabold text-white"
              style={{
                fontSize: 'clamp(8rem, 16vw, 16rem)',
                lineHeight: '1',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.6), 0 0 60px rgba(255, 255, 255, 0.4), 0 6px 30px rgba(0, 0, 0, 0.5), 0 3px 12px rgba(0, 0, 0, 0.6)',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                filter: 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.5))'
              }}
            >
              {formattedCount}
            </span>
          </div>

          {/* Caption */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-semibold px-4" style={{
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
          }}>
            {caption}
          </p>
        </div>
      </div>
    </section>
  )
}

