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
    window.open('https://checkout.square.site/merchant/ML1J6RRKZS13T/checkout/ZUCJRQEDF3TKAF3FMRIFUKRX?src=webqr', '_blank')
  }

  return (
    <nav className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-6 pointer-events-none">
      <div
        className={`mx-auto max-w-6xl rounded-3xl border backdrop-blur-3xl transition-all duration-300 pointer-events-auto relative ${
          isScrolled
            ? 'border-white/50 shadow-[0_12px_48px_rgba(0,0,0,0.15)]'
            : 'border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)]'
        }`}
        style={{
          background: isScrolled
            ? 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0.5) 100%)'
            : 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.25) 50%, rgba(255, 255, 255, 0.45) 100%)',
          boxShadow: isScrolled 
            ? '0 12px 48px 0 rgba(31, 38, 135, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.4) inset, 0 0 60px rgba(255, 255, 255, 0.1)'
            : '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3) inset, 0 0 40px rgba(255, 255, 255, 0.08)'
        }}
    >
        {/* Liquid glass gradient overlay */}
        <div 
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 40%, rgba(255, 255, 255, 0.1) 70%, rgba(255, 255, 255, 0.25) 100%)',
          }}
        />
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
              <span className="font-bold text-xl text-black tracking-wide">Lace Up for Kids</span>
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
                      : 'text-black hover:text-accent-600'
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
            <div className="lg:hidden mt-4 pb-1 space-y-3">
              {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                  className={`relative block w-full text-left py-2 px-4 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
                  activeSection === link.href.replace('#', '')
                      ? 'bg-white/25 border border-white/30 text-accent-700 shadow-lg'
                      : 'text-black hover:bg-white/20 border border-transparent hover:border-white/20'
                }`}
                  style={{
                    boxShadow: activeSection === link.href.replace('#', '')
                      ? '0 4px 16px 0 rgba(31, 38, 135, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2) inset'
                      : 'none'
                  }}
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

