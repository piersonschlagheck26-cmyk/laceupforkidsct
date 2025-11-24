'use client'

import Navigation from '@/components/Navigation'
import HowItWorks from '@/components/HowItWorks'
import Footer from '@/components/Footer'

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen">
      <Navigation activeSection="" />
      <div className="pt-24">
        <HowItWorks />
      </div>
      <Footer />
    </main>
  )
}

