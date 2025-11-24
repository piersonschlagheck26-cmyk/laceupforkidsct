'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const teamMembers = [
  {
    name: 'Shane Tandler',
    role: 'Founder & Director',
    bio: 'Shane is a junior at GHS who started Lace Up For Kids, driven by his passion for helping young kids flourish. Through working as a Mathnasium tutor and an instructor at Calvin Leete Elementary School, he discovered the impact and reward that supporting a younger generation can bring. Shane was inspired by the mission of the Ronald McDonald House from a young age, when he & his family helped cook meals for residents in the New Haven location. Ever since then, he has strived to have the positive impact in his community that he knows is possible.',
    image: '/images/SHANE_headshot.JPG',
  },
  {
    name: 'Pierson Schlagheck',
    role: 'Chief Marketing Officer',
    bio: 'Pierson is a junior at Guilford High School with interests in website development and making genuine impacts in his community. A long time volunteer at local soup kitchens and a contributor to many food drives, Pierson has extensive firsthand experience assisting people in need. Pierson was inspired to join Lace Up For Kids to continue his efforts in providing for disadvantaged children and has large aspirations for the expansion of the organization.',
    image: '/images/PIERSON_headshot.JPG',
  },
  {
    name: 'Conor Farrell',
    role: 'Chief Operating Officer',
    bio: 'Conor is a junior dedicated to supporting children and families in need through effective operational fundraising. Through volunteering through various opportunities, such as a Habitat for Humanity service trip, he learned that promoting inclusivity and establishing healthy and supportive communication is key to creating strong connections through his community. Conor was motivated to join Lace Up For Kids because he loves working with his peers to see real change occur for children in need and saw the organization as a creative opportunity to do so.',
    image: '/images/CONOR_headshot.JPG',
  },
]

const crewMembers = [
  {
    name: 'Lewis Thoreen',
    role: 'Secretary',
    bio: 'Handles organizational documentation, record-keeping, and administrative tasks to ensure smooth operations.',
    image: '/images/LEWIS_headshot.JPG',
  },
  {
    name: 'Ben Adams',
    role: 'Community Ambassador',
    bio: 'Ben is a freshman at Guilford High School who genuinely wants to give back to the community around him. He\'s especially inspired by the work of the Ronald McDonald House and loves being involved in sustainability and sneaker-recycling efforts that help reduce waste and support an amazing cause.',
    image: '/images/BEN_headshot.jpeg',
  },
  {
    name: 'Owen Stoddard',
    role: 'Graphic Designer',
    bio: 'Creates visual content and designs that communicate our mission and engage the community through compelling graphics and branding.',
    image: '/images/OWEN_headshot.jpeg',
  },
  {
    name: 'Grant Davis',
    role: 'Site Coordinator',
    bio: 'Grant is currently a junior at Guilford High School. He loves to pursue his athletic interests in lacrosse and has been looking for an opportunity to volunteer in his community. He joined Lace Up For Kids as an avenue to both collaborate with his friends and to increase his involvement in charitable efforts.',
    image: '/images/GRANT_headshot.jpeg',
  },
]

export default function WhoWeAre() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="who-we-are" ref={ref} className="section-padding relative">
      {/* Background with smooth gradient transition */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent-50/30 via-white to-primary-50/20"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-accent-50/30 to-transparent"></div>
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Who We Are
          </h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed px-2">
            A group of passionate teens working together to make a difference in our community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
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
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={`${member.name} headshot`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  )}
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

          <div className="flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
            {crewMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="card text-center hover:scale-105 transition-transform p-4 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-1rem)]"
              >
                {/* Avatar */}
                <div className="mb-3 flex justify-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary-100 shadow-md">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={`${member.name} headshot`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-lg font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
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

