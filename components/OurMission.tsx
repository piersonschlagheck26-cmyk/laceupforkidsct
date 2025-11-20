'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function OurMission() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="mission" ref={ref} className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-primary-50/70 to-transparent" />
      <div className="absolute -top-24 left-1/3 w-72 h-72 bg-accent-200/20 rounded-full blur-3xl" />

      <div className="container-custom relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-accent-100 text-accent-700 uppercase tracking-wider mb-4">
            Why We Lace Up
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Mission
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Lace Up for Kids Mission */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center mr-4 text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Lace Up for Kids</h3>
            </div>
            <p className="text-gray-800 leading-relaxed">
              Our mission is to empower young people to make a tangible difference in their communities by collecting and repurposing shoes that would otherwise be discarded. We believe that small actions can create big change, and by working together, we can support families facing difficult times while also reducing waste.
            </p>
          </motion.div>

          {/* RMH CTMA Mission */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6 }}
            className="card bg-gradient-to-br from-primary-100 via-white to-accent-50 border border-primary-200/60"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-primary-500 rounded-xl flex items-center justify-center mr-4 text-white shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">RMH of CT and MA</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              RMH CTMA provides a home away from home for families with seriously ill children receiving treatment at nearby hospitals. They offer comfort, support, and resources to help families stay close to their children during medical crises, reducing the financial and emotional burden of extended hospital stays.
            </p>
            <a
              href="https://www.rmhctma.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-accent-600 font-semibold hover:text-accent-500 transition-colors"
            >
              Learn More
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

