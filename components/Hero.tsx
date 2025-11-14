'use client'

import { useState, useEffect } from 'react'
import RotatingBelt from './RotatingBelt'

export default function Hero() {
  const handleDonateClick = () => {
    // TODO: Replace with actual donation modal/flow
    alert('Donation information: Please email us at donate@laceupforkids.org or mail checks to [Your Address]. Online donations coming soon!')
  }

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5"></div>
      </div>

      {/* Content */}
      <div className="container-custom section-padding relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo placeholder */}
          <div className="mb-8 flex justify-center">
            <div className="w-32 h-32 bg-primary-600 rounded-3xl flex items-center justify-center shadow-2xl">
              {/* TODO: Replace with actual logo from /public/assets/logo.pdf or converted image */}
              <span className="text-white font-bold text-5xl">LU</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Lace Up for Kids
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 font-medium">
            Turning old shoes into hope for families in need
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button onClick={handleDonateClick} className="btn-primary text-lg px-8 py-4">
              Donate Now
            </button>
            <button onClick={scrollToHowItWorks} className="btn-secondary text-lg px-8 py-4">
              Learn How It Works
            </button>
          </div>

          {/* Rotating Belt */}
          <RotatingBelt />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}

