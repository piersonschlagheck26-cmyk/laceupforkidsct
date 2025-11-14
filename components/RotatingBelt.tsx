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
      className="relative w-full max-w-2xl mx-auto h-16 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-100/90 via-white to-accent-50/80 backdrop-blur shadow-xl shadow-primary-900/10 border border-white/60"
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
            <p className="text-lg sm:text-xl font-semibold text-ember-800 text-center">
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
                ? 'w-8 bg-gradient-to-r from-primary-500 to-accent-500'
                : 'w-2 bg-primary-200 hover:bg-primary-300'
            }`}
            aria-label={`Go to message ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

