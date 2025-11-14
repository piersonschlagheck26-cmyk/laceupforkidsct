'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useInView } from 'framer-motion'

const steps = [
  {
    number: 1,
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    title: 'Donate Shoes',
    description:
      'Drop off your gently used shoes at one of our collection points, or contact us to arrange a pickup. We accept all types of shoes in good condition.',
  },
  {
    number: 2,
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    title: 'Shoes Are Traded',
    description:
      'We partner with organizations that purchase our collected shoes. These partners resell or recycle the shoes, providing us with funds for our mission.',
  },
  {
    number: 3,
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Proceeds Donated',
    description:
      '100% of the proceeds from shoe sales go directly to Ronald McDonald House, helping families stay close to their children during medical treatment.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [sliderValue, setSliderValue] = useState(0) // 0-100 for smooth sliding
  const [isUserInteracting, setIsUserInteracting] = useState(false)

  // Auto-progress every 2 seconds
  useEffect(() => {
    if (isUserInteracting) return

    const interval = setInterval(() => {
      setSliderValue((prev) => {
        const nextValue = prev + (100 / (steps.length - 1))
        return nextValue >= 100 ? 0 : nextValue
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isUserInteracting])

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsUserInteracting(true)
    setSliderValue(Number(event.target.value))
    
    // Reset interaction flag after user stops interacting
    setTimeout(() => {
      setIsUserInteracting(false)
    }, 3000)
  }

  const handleMouseDown = () => {
    setIsUserInteracting(true)
  }

  const handleMouseUp = () => {
    setTimeout(() => {
      setIsUserInteracting(false)
    }, 3000)
  }

  // Calculate which step to show based on slider position (0-100 maps to 0-2)
  const currentStep = useMemo(() => {
    const stepSize = 100 / (steps.length - 1)
    return Math.round(sliderValue / stepSize)
  }, [sliderValue])

  const progressPercent = sliderValue

  return (
    <section id="how-it-works" ref={ref} className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-ember-50" />
      <div className="absolute -top-32 right-0 w-64 h-64 bg-accent-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary-200/25 rounded-full blur-[120px]" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Our simple three-step process makes it easy to make a difference
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="relative grid grid-cols-1 lg:grid-cols-[220px_auto] gap-6 lg:gap-10 items-center">
            <div className="relative hidden lg:grid gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`relative rounded-3xl border backdrop-blur-2xl px-6 py-5 transition-all duration-300 ${
                    index === currentStep 
                      ? 'bg-white/25 border-white/40 text-gray-900 shadow-[0_8px_32px_rgba(0,0,0,0.12)]' 
                      : 'bg-white/15 border-white/20 text-gray-400 shadow-[0_4px_16px_rgba(0,0,0,0.08)]'
                  }`}
                  style={{
                    boxShadow: index === currentStep
                      ? '0 8px 32px 0 rgba(31, 38, 135, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
                      : '0 4px 16px 0 rgba(31, 38, 135, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.15) inset'
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold backdrop-blur-xl ${
                        index === currentStep
                          ? 'border-accent-500/60 bg-white/30 text-accent-600 shadow-lg'
                          : 'border-white/30 bg-white/20 text-gray-400'
                      }`}
                      style={{
                        boxShadow: index === currentStep
                          ? '0 4px 16px 0 rgba(228, 71, 34, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.3) inset'
                          : '0 2px 8px 0 rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
                      }}
                    >
                      {step.number}
                    </span>
                    <p className="font-semibold">{step.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="card overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[currentStep].title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-4 text-center"
                >
                  <div className="flex justify-center text-accent-600 mb-4">{steps[currentStep].icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-10 px-6 pb-4">
                <div className="relative h-6 flex items-center">
                  {/* Progress track */}
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-primary-200/50 rounded-full -translate-y-1/2" />
                  <div 
                    className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full -translate-y-1/2 transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                  
                  {/* Smooth range input */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderValue}
                    onChange={handleRangeChange}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onTouchStart={handleMouseDown}
                    onTouchEnd={handleMouseUp}
                    className="w-full h-6 appearance-none bg-transparent cursor-pointer relative z-10"
                    style={{
                      background: 'transparent',
                    }}
                    aria-label="Navigate through process steps"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

