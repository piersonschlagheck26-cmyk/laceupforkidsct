'use client'

import Navigation from '@/components/Navigation'
import UpcomingEvents from '@/components/UpcomingEvents'
import Footer from '@/components/Footer'

export default function EventsPage() {
  return (
    <main className="min-h-screen">
      <Navigation activeSection="" />
      <div className="pt-24">
        <UpcomingEvents />
      </div>
      <Footer />
    </main>
  )
}

