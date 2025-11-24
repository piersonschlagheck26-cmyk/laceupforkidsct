'use client'

import Navigation from '@/components/Navigation'
import WhoWeAre from '@/components/WhoWeAre'
import Footer from '@/components/Footer'

export default function TeamPage() {
  return (
    <main className="min-h-screen">
      <Navigation activeSection="" />
      <div className="pt-24">
        <WhoWeAre />
      </div>
      <Footer />
    </main>
  )
}

