'use client'

import Navigation from '@/components/Navigation'
import MapSection from '@/components/MapSection'
import Footer from '@/components/Footer'

export default function DropOffPage() {
  return (
    <main className="min-h-screen">
      <Navigation activeSection="" />
      <div className="pt-24">
        <MapSection />
      </div>
      <Footer />
    </main>
  )
}

