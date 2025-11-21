'use client'

import Image from 'next/image'

export default function Footer() {
  const handleDonateClick = () => {
    window.open('https://checkout.square.site/merchant/ML1J6RRKZS13T/checkout/ZUCJRQEDF3TKAF3FMRIFUKRX?src=webqr', '_blank')
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gradient-to-b from-ember-900 via-gray-900 to-gray-950 text-gray-200">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <div className="relative w-12 h-14 drop-shadow-xl">
                <Image
                  src="/assets/logo.png"
                  alt="Lace Up for Kids logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl text-white tracking-wide">Lace Up for Kids</span>
            </div>
            <p className="text-gray-300/90 mb-5 max-w-md leading-relaxed">
              Turning old shoes into hope for families in need. A teen-led nonprofit supporting RMH CTMA through sustainable shoe collection and donation.
            </p>
            <button onClick={handleDonateClick} className="btn-primary text-sm">
              Donate Now
            </button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wide">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#what-we-do" className="hover:text-primary-200 transition-colors">
                  What We Do
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary-200 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#mission" className="hover:text-primary-200 transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#who-we-are" className="hover:text-primary-200 transition-colors">
                  Who We Are
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wide">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:laceupforkidsct@gmail.com" className="hover:text-primary-200 transition-colors">
                  laceupforkidsct@gmail.com
                </a>
              </li>
              <li className="text-gray-400">
                Guilford, Connecticut
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Lace Up for Kids. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <button
              onClick={scrollToTop}
              className="text-gray-400 hover:text-primary-200 transition-colors"
            >
              Back to Top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

