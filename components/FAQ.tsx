'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function FAQ() {
  const { t } = useLanguage()
  const faq = t.faq
  const ref = useScrollReveal()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="section-pad bg-ink-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <h2
            className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight"
          >
            {faq.title}
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faq.items.map((item, i) => (
            <div
              key={i}
              className="reveal border border-gold/12 rounded-sm overflow-hidden transition-colors hover:border-gold/25"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-ink-700 hover:bg-ink-600 transition-colors duration-200"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="font-display text-sm text-cream uppercase tracking-wide"
                >
                  {item.q}
                </span>
                <span
                  className={`flex-shrink-0 w-5 h-5 text-gold transition-transform duration-300 ${
                    open === i ? 'rotate-45' : 'rotate-0'
                  }`}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                </span>
              </button>

              <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{ maxHeight: open === i ? '200px' : '0' }}
              >
                <p className="px-5 py-4 text-cream/60 text-sm leading-relaxed border-t border-gold/08">
                  {item.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
