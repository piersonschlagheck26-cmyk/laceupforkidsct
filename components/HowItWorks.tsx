'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const steps = [
    {
      number: 1,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Donate Shoes',
      description: 'Drop off your gently used shoes at one of our collection points, or contact us to arrange a pickup. We accept all types of shoes in good condition.',
    },
    {
      number: 2,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      title: 'Shoes Are Traded',
      description: 'We partner with organizations that purchase our collected shoes. These partners resell or recycle the shoes, providing us with funds for our mission.',
    },
    {
      number: 3,
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Proceeds Donated',
      description: '100% of the proceeds from shoe sales go directly to Ronald McDonald House, helping families stay close to their children during medical treatment.',
    },
  ]

  const handleDonateClick = () => {
    // TODO: Replace with actual donation modal/flow
    alert('Donation information: Please email us at donate@laceupforkids.org or mail checks to [Your Address]. Online donations coming soon!')
  }

  return (
    <section id="how-it-works" ref={ref} className="section-padding bg-gradient-to-br from-primary-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our simple three-step process makes it easy to make a difference
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Number Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg z-10">
                  {step.number}
                </div>

                {/* Card */}
                <div className="card pt-8 text-center hover:scale-105 transition-transform">
                  <div className="text-primary-600 mb-4 flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress Bar Visual */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: '33%' }}></div>
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                <div className="h-full bg-primary-600 rounded-full" style={{ width: '66%' }}></div>
              </div>
              <div className="flex-1 h-2 bg-primary-600 rounded-full ml-2"></div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-center"
          >
            <button onClick={handleDonateClick} className="btn-primary text-lg px-8 py-4">
              Get Involved - Donate Today
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

