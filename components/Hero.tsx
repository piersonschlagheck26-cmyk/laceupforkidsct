'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import RotatingBelt from './RotatingBelt'
import FallingSneakers from './FallingSneakers'

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
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20"
    >
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-100 via-white to-accent-50">
        <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-[0.07]"></div>
        <div className="absolute -top-32 -left-24 w-72 h-72 bg-gradient-to-br from-accent-200/70 to-primary-200/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-24 w-72 h-72 bg-gradient-to-tr from-primary-300/60 to-accent-200/50 rounded-full blur-3xl"></div>
      </div>

      {/* Falling Sneakers Animation */}
      <div className="absolute inset-0 z-[5]">
        <FallingSneakers />
      </div>

      {/* Content */}
      <div className="container-custom section-padding relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 md:mb-10 flex justify-center">
            <div className="relative w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56 lg:w-52 lg:h-64 drop-shadow-2xl">
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-5 md:mb-6 relative px-2 sm:px-4">
            <span className="relative z-10 block leading-tight sm:leading-snug md:leading-normal" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(255, 255, 255, 0.7), 0 0 60px rgba(255, 255, 255, 0.5), 0 2px 4px rgba(0, 0, 0, 0.1)'
            }}>
              Turning Sneakers into Support
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 mb-6 sm:mb-8 md:mb-10 font-medium leading-relaxed max-w-2xl mx-auto relative px-4 sm:px-6 md:px-8">
            <span className="relative z-10 block" style={{
              textShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6), 0 0 45px rgba(255, 255, 255, 0.4), 0 1px 2px rgba(0, 0, 0, 0.1)'
            }}>
              Lace Up for Kids recycles gently used shoes and transforms them into hope for families staying at Ronald McDonald House.
            </span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-14 md:mb-16 px-4">
            <button onClick={handleDonateClick} className="btn-primary text-base sm:text-lg px-5 sm:px-6 py-2.5 sm:py-3 w-full sm:w-auto">
              Donate Now
            </button>
            <button onClick={scrollToHowItWorks} className="btn-secondary text-base sm:text-lg px-5 sm:px-6 py-2.5 sm:py-3 w-full sm:w-auto">
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

