'use client'

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
      {/* Background with smooth gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary-50 via-white to-white">
      </div>

      {/* Content */}
      <div className="container-custom px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-14 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 sm:mb-5 leading-tight text-center md:whitespace-nowrap">
            <span className="inline-block">Turning Sneakers into Support</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-7 md:mb-8 leading-relaxed max-w-2xl mx-auto px-2">
            Lace Up for Kids recycles gently used shoes and transforms them into hope for families staying at Ronald McDonald House.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center px-2">
            <button onClick={handleDonateClick} className="btn-primary w-full sm:w-auto">
              Donate Now
            </button>
            <button onClick={scrollToHowItWorks} className="btn-secondary w-full sm:w-auto">
              See How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

