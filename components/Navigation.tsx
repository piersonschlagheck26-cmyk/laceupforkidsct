'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavigationProps {
  activeSection: string
}

const NAV_LINKS = [
  { href: '/', label: 'Home', isPage: true },
  { href: '/mission', label: 'Mission', isPage: true },
  { href: '/how-it-works', label: 'Process', isPage: true },
  { href: '/drop-off', label: 'Drop-off', isPage: true },
  { href: '/events', label: 'Events', isPage: true },
  { href: '/team', label: 'Team', isPage: true },
]

export default function Navigation({ activeSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    if (href === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setIsOpen(false)
      return
    }
    if (href.startsWith('#')) {
      const id = href.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
        setIsOpen(false)
      }
    }
  }

  const handleDonateClick = () => {
    window.open('https://checkout.square.site/merchant/ML1J6RRKZS13T/checkout/ZUCJRQEDF3TKAF3FMRIFUKRX?src=webqr', '_blank')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Site Name */}
          <Link
            href="/"
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
              <div className="relative w-12 h-12 drop-shadow-lg">
                <Image
                  src="/assets/logo.png"
                  alt="Lace Up for Kids logo"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                  priority
                />
            </div>
              <span className="font-bold text-xl text-black tracking-wide">Lace Up for Kids</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                link.isPage ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-gray-700 hover:text-accent-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className={`text-sm font-medium transition-colors ${
                      activeSection === link.href.replace('#', '').replace('/', '')
                        ? 'text-accent-600'
                        : 'text-gray-700 hover:text-accent-600'
                    }`}
                  >
                    {link.label}
                  </button>
                )
            ))}
            <button
              onClick={handleDonateClick}
              className="btn-primary text-sm"
            >
              Donate
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-black"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
            <div className="lg:hidden mt-4 pb-2 space-y-1 border-t border-gray-200 pt-4">
              {NAV_LINKS.map((link) => (
                link.isPage ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className={`block w-full text-left py-2 px-4 rounded-lg transition-colors ${
                      activeSection === link.href.replace('#', '').replace('/', '')
                        ? 'bg-gray-100 text-accent-600 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </button>
                )
            ))}
            <button
              onClick={handleDonateClick}
                className="btn-primary w-full text-sm"
            >
              Donate
            </button>
          </div>
        )}
        </div>
      </div>
    </nav>
  )
}

