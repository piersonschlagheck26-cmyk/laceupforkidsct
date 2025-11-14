'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavigationProps {
  activeSection: string
}

const NAV_LINKS = [
  { href: '#home', label: 'Home' },
  { href: '#what-we-do', label: 'Impact' },
  { href: '#mission', label: 'Mission' },
  { href: '#how-it-works', label: 'Process' },
  { href: '#drop-off', label: 'Drop-off' },
  { href: '#who-we-are', label: 'Team' },
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
    const id = href.replace('#', '')
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  const handleDonateClick = () => {
    // TODO: Replace with actual donation modal/flow
    alert('Donation information: Please email us at donate@laceupforkids.org or mail checks to [Your Address]. Online donations coming soon!')
  }

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div
        className={`mx-auto max-w-6xl rounded-3xl border backdrop-blur-3xl transition-all duration-300 pointer-events-auto shadow-xl ${
          isScrolled
            ? 'bg-white/60 border-white/45 shadow-primary-900/15'
            : 'bg-white/40 border-white/35 shadow-primary-900/10'
        }`}
      >
        <div className="px-5 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            {/* Logo and Site Name */}
            <Link
              href="#home"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault()
                scrollToSection('#home')
              }}
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
              <span className="font-bold text-xl text-gray-900 tracking-wide">Lace Up for Kids</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`text-sm font-semibold transition-colors ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-accent-600'
                      : 'text-gray-700 hover:text-accent-600'
                  }`}
                >
                  {link.label}
                </button>
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
              className="lg:hidden p-2 text-gray-700"
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
            <div className="lg:hidden mt-4 pb-1 space-y-3">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className={`block w-full text-left py-2 px-4 rounded-2xl transition-colors ${
                    activeSection === link.href.replace('#', '')
                      ? 'bg-primary-100/70 text-accent-700'
                      : 'text-gray-700 hover:bg-primary-50/80'
                  }`}
                >
                  {link.label}
                </button>
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

