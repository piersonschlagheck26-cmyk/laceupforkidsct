'use client'

import { useState, useEffect } from 'react'

const messages = [
  'Save shoes. Raise funds. Support families.',
  'Every pair makes a difference.',
  'Turning donations into hope.',
  'Join us in making an impact.',
  'Together we can do more.',
]

export default function RotatingBelt() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev: number) => (prev + 1) % messages.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [isPaused])

  return (
    <div
      className="relative w-full max-w-2xl mx-auto h-16 overflow-hidden rounded-3xl bg-gradient-to-r from-white/25 via-primary-50/20 to-white/25 backdrop-blur-2xl shadow-2xl border border-white/30 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-0.5"
      style={{
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out h-full items-center"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className="min-w-full flex items-center justify-center px-6"
          >
            <p className="text-lg sm:text-xl font-semibold text-ember-800/90 text-center">
              {message}
            </p>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {messages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'w-8 bg-gradient-to-r from-primary-400 to-accent-400'
                : 'w-2 bg-primary-200/80 hover:bg-primary-300'
            }`}
            aria-label={`Go to message ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

