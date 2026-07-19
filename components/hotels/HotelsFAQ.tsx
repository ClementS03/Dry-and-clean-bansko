'use client'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsFAQ() {
  const { t } = useLanguage()
  const f = t.hotels.faq
  const [open, setOpen] = useState<number | null>(null)
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl text-cream uppercase tracking-tight mb-10 reveal">{f.title}</h2>
        <div className="space-y-2">
          {f.items.map((item, i) => (
            <div key={i} className="reveal border border-gold/10 rounded-sm overflow-hidden"
              style={{ transitionDelay: `${i * 60}ms` }}>
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-ink-800 hover:bg-ink-700 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-display text-sm text-cream uppercase tracking-wide">{item.q}</span>
                <span className={`text-gold transition-transform duration-200 flex-shrink-0 ${open === i ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 pt-0 bg-ink-800 text-cream/60 text-sm leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
