'use client'

import { useEffect, useState } from 'react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import WhatWeDo from '@/components/WhatWeDo'
import OurMission from '@/components/OurMission'
import HowItWorks from '@/components/HowItWorks'
import WhoWeAre from '@/components/WhoWeAre'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'what-we-do', 'mission', 'how-it-works', 'who-we-are', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="min-h-screen">
      <Navigation activeSection={activeSection} />
      <Hero />
      <WhatWeDo />
      <OurMission />
      <HowItWorks />
      <WhoWeAre />
      <Contact />
      <Footer />
    </main>
  )
}

