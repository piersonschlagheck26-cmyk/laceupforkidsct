'use client'

import Navigation from '@/components/Navigation'
import OurMission from '@/components/OurMission'
import Footer from '@/components/Footer'

export default function MissionPage() {
  return (
    <main className="min-h-screen">
      <Navigation activeSection="" />
      <div className="pt-24">
        <OurMission />
      </div>
      <Footer />
    </main>
  )
}

