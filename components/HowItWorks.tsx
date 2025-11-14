'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import Image from 'next/image'

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
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const autoAdvance = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 6000)

    return () => clearInterval(autoAdvance)
  }, [])

  const handlePrev = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  const handleNext = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length)
  }

  const progressPercent = (currentStep / (steps.length - 1)) * 100

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

        <div className="max-w-4xl mx-auto">
          <div className="card text-center relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/60 to-transparent pointer-events-none" />

            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handlePrev}
                className="rounded-full border border-primary-200 bg-white/80 px-3 py-2 text-accent-600 hover:bg-white transition"
                aria-label="Previous step"
              >
                ‹
              </button>
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-widest">
                Step {steps[currentStep].number}
              </span>
              <button
                onClick={handleNext}
                className="rounded-full border border-primary-200 bg-white/80 px-3 py-2 text-accent-600 hover:bg-white transition"
                aria-label="Next step"
              >
                ›
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={steps[currentStep].title}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="flex justify-center text-accent-600 mb-4">{steps[currentStep].icon}</div>
                <h3 className="text-2xl font-bold text-gray-900">{steps[currentStep].title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {steps[currentStep].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10">
              <div className="relative h-24">
                <div className="absolute top-1/2 left-6 right-6 h-1 bg-primary-200 rounded-full" />
                <motion.div
                  className="absolute -top-1 flex items-center justify-center"
                  style={{ left: `calc(${progressPercent}% - 32px)` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                >
                  <Image
                    src="/images/sneaker-top.svg"
                    alt="Current step indicator"
                    width={64}
                    height={64}
                    className="drop-shadow-lg"
                  />
                </motion.div>
                <div className="absolute top-1/2 left-6 right-6 flex justify-between -translate-y-1/2">
                  {steps.map((step, index) => (
                    <button
                      key={step.title}
                      onClick={() => setCurrentStep(index)}
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                        index === currentStep
                          ? 'border-accent-500 bg-white text-accent-600 shadow-md'
                          : 'border-primary-200 bg-white/70 text-gray-500 hover:border-primary-300'
                      }`}
                      aria-label={`Go to step ${step.number}`}
                    >
                      {step.number}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

