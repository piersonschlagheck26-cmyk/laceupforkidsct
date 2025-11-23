'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'

export default function UpcomingEvents() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="upcoming-events" ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-accent-200/80 text-ember-900 uppercase tracking-wider mb-4">
              Join Us
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-lg text-gray-800">
              Come visit us at our upcoming events to learn more about our mission and make a difference
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 items-stretch">
              {/* Left Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="/images/Events1.jpeg"
                    alt="Event"
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              {/* Events Cards */}
              <div className="space-y-6">
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
                <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden shadow-lg">
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
        </motion.div>
      </div>
    </section>
  )
}

