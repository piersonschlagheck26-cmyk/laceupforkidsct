'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
      <div className="absolute inset-0 bg-gradient-to-br from-primary-100 via-white to-accent-50">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.07]"></div>
        <div className="absolute -top-32 -left-24 w-72 h-72 bg-gradient-to-br from-accent-200/70 to-primary-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-24 w-72 h-72 bg-gradient-to-tr from-primary-300/60 to-accent-200/50 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="container-custom section-padding relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-10 flex justify-center">
            <div className="relative w-40 h-48 sm:w-48 sm:h-56 drop-shadow-2xl">
              <Image
                src="/assets/logo.png"
                alt="Lace Up for Kids logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-6">
            Turning Sneakers into Support
          </h1>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray-700 mb-10 font-medium leading-relaxed max-w-2xl mx-auto">
            Lace Up for Kids recycles gently used shoes and transforms them into hope for families staying at Ronald McDonald House.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button onClick={handleDonateClick} className="btn-primary text-lg px-10 py-4">
              Donate Now
            </button>
            <button onClick={scrollToHowItWorks} className="btn-secondary text-lg px-10 py-4">
              See How It Works
            </button>
          </div>

          {/* Rotating Belt */}
          <RotatingBelt />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-accent-500"
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

