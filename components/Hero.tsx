'use client'

import RotatingBelt from './RotatingBelt'

export default function Hero() {
  const handleDonateClick = () => {
    window.open('https://checkout.square.site/merchant/ML1J6RRKZS13T/checkout/ZUCJRQEDF3TKAF3FMRIFUKRX?src=webqr', '_blank')
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
      className="relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-white">
      </div>

      {/* Content */}
      <div className="container-custom section-padding relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Turning Sneakers into Support
          </h1>

          {/* Tagline */}
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto px-2">
            Lace Up for Kids recycles gently used shoes and transforms them into hope for families staying at Ronald McDonald House.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center mb-8 sm:mb-10 md:mb-12 px-2">
            <button onClick={handleDonateClick} className="btn-primary w-full sm:w-auto">
              Donate Now
            </button>
            <button onClick={scrollToHowItWorks} className="btn-secondary w-full sm:w-auto">
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

