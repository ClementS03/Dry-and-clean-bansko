'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Navbar() {
  const { t, toggle, lang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: t.nav.services, href: '#services' },
    { label: t.nav.technology, href: '#technology' },
    { label: t.nav.prices, href: '#pricing' },
    { label: t.nav.faq, href: '#faq' },
    { label: t.nav.contact, href: '#contact' },
  ]

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-ink-800/95 backdrop-blur-md border-b border-gold/10 shadow-lg shadow-black/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-ink font-bold text-xs leading-none">
              W&D
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-white text-sm font-semibold tracking-wider leading-tight uppercase">
                Wet&Dry
              </div>
              <div className="font-display text-gold text-[10px] tracking-[0.15em] uppercase leading-tight">
                Cleaning Bansko
              </div>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(l => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="font-display text-sm text-cream/70 hover:text-gold uppercase tracking-wider transition-colors duration-200"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Right side: lang + CTA */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="font-display text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1 rounded-sm hover:bg-gold/10 transition-colors duration-200"
              aria-label="Switch language"
            >
              {t.nav.langSwitch}
            </button>

            {/* CTA */}
            <a
              href="#contact"
              onClick={e => { e.preventDefault(); handleNav('#contact') }}
              className="hidden sm:inline-flex btn-gold text-xs py-2 px-4"
            >
              {t.nav.cta}
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 text-cream/80 hover:text-gold transition-colors"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-ink-700 border-b border-gold/10 py-4 px-4">
            {links.map(l => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="block w-full text-left font-display text-base text-cream/80 hover:text-gold uppercase tracking-wider py-3 border-b border-white/5 transition-colors"
              >
                {l.label}
              </button>
            ))}
            <a
              href="#contact"
              onClick={e => { e.preventDefault(); handleNav('#contact') }}
              className="btn-gold mt-4 w-full justify-center text-sm py-3"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      )}
    </>
  )
}
