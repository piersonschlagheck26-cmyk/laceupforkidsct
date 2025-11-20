'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const teamMembers = [
  {
    name: 'Shane Tandler',
    role: 'Founder & Director',
    bio: 'Shane is a junior at GHS who started Lace Up For Kids, driven by his passion for helping young kids flourish. Through working as a Mathnasium tutor and an instructor at Calvin Leete Elementary School, he discovered the impact and reward that supporting a younger generation can bring. Shane was inspired by the mission of the Ronald McDonald House from a young age, when he & his family helped cook meals for residents in the New Haven location. Ever since then, he has strived to have the positive impact in his community that he knows is possible.',
    // image: '/images/team-placeholder-1.jpg', // TODO: Replace with actual headshot (not used - using gradient instead)
  },
  {
    name: 'Pierson Schlagheck',
    role: 'Website Developer & Social Media Manager',
    bio: 'Junior year student who coordinates initiatives and manages advertising. Loves organizing community events and making connections that drive positive change.',
    // image: '/images/team-placeholder-2.jpg', // TODO: Replace with actual headshot (not used - using gradient instead)
  },
  {
    name: 'Conor Farrell',
    role: 'Operations Coordinator',
    bio: 'Junior dedicated to spreading awareness about our mission. Arranges shoe collection locations and product handling.',
    // image: '/images/team-placeholder-3.jpg', // TODO: Replace with actual headshot (not used - using gradient instead)
  },
]

const crewMembers = [
  {
    name: 'Lewis Thoreen',
    role: 'Secretary & DSW and Marathon Sports Coordinator',
    bio: 'Manages development, collection, and communication at DSW and Marathon Sports locations.',
  },
  {
    name: 'Ben Adams',
    role: 'Leete and Adams Coordinator',
    bio: 'Handles development, collection, and communication efforts at the Leete and Adams site.',
  },
  {
    name: 'Kieran Keefe',
    role: 'Baldwin Coordinator',
    bio: 'Oversees development, collection, and communication operations at the Baldwin location.',
  },
  {
    name: 'Grant Davis',
    role: 'Bishops Coordinator',
    bio: 'Coordinates development, collection, and communication activities at the Bishops site.',
  },
]

export default function WhoWeAre() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="who-we-are" ref={ref} className="section-padding bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Who We Are
          </h2>
          <p className="text-lg text-gray-800 max-w-2xl mx-auto">
            A group of passionate teens working together to make a difference in our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card text-center hover:scale-105 transition-transform"
            >
              {/* Avatar */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary-100 shadow-lg">
                  {/* TODO: Replace with actual image */}
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>

              {/* Name and Role */}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-primary-600 font-semibold mb-4">{member.role}</p>

              {/* Bio */}
              <p className="text-gray-800 text-sm leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>

        {/* Our Crew Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Our Crew
            </h2>
            <p className="text-lg text-gray-800 max-w-2xl mx-auto">
              Dedicated coordinators managing our collection locations and operations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {crewMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="card text-center hover:scale-105 transition-transform p-4"
              >
                {/* Avatar */}
                <div className="mb-3 flex justify-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-100 shadow-md">
                    <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-lg font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>

                {/* Name and Role */}
                <h3 className="text-base font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-semibold text-xs mb-2">{member.role}</p>
                
                {/* Bio */}
                <p className="text-gray-700 text-xs leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

