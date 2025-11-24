'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

export default function UpcomingEvents() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="upcoming-events" ref={ref} className="section-padding relative">
      {/* Background with smooth gradient transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/20 to-accent-50/30"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent"></div>
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-10 sm:mb-12">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700 uppercase tracking-wider mb-3 sm:mb-4">
              Join Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Upcoming Events</h2>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed px-2">
              Come visit us at our upcoming events to learn more about our mission and make a difference
            </p>
          </div>
        </motion.div>
      </div>

      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-0 items-stretch">
              {/* Left Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative w-full h-full min-h-[400px] overflow-hidden">
                  <Image
                    src="/images/Events1.jpeg"
                    alt="Event"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Events Cards */}
              <div className="space-y-6 px-6 lg:px-8 py-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="card text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Guilford Tree Lighting</h3>
                      <p className="text-accent-600 font-semibold mb-3">December 5th, 2025</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-800 leading-relaxed">
                    Stop by to discover how you can make a difference! Pick up brochures to learn more about our mission, and bring your gently used shoes to drop off at the collection box in the Nathanael B. Greene Community Center.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="card text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Song Strong 5K</h3>
                      <p className="text-accent-600 font-semibold mb-3">June 6th, 2026</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-800 leading-relaxed mb-4">
                    Join us at the Song Strong 5K! Visit our booth to learn more about Lace Up for Kids, donate shoes, and make monetary donations to support our mission of helping families at RMH CTMA.
                  </p>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-700 mb-2">
                      For more information about the event, visit{' '}
                      <a 
                        href="https://songstrong.org" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700 font-semibold underline transition-colors"
                      >
                        songstrong.org
                      </a>
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right Image */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative w-full h-full min-h-[400px] overflow-hidden">
                  <Image
                    src="/images/Events2.jpeg"
                    alt="Event"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
    </section>
  )
}

