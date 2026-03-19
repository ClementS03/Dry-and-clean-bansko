'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Pricing() {
  const { t } = useLanguage()
  const p = t.pricing
  const ref = useScrollReveal()

  return (
    <section id="pricing" className="section-pad bg-ink relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #F5C400, transparent 70%)' }}
      />

      <div ref={ref} className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div className="section-badge mx-auto">{p.badge}</div>
          <h2
            className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight mt-4"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            {p.title}
          </h2>
          <p className="text-cream/50 mt-3 max-w-md mx-auto text-sm">{p.subtitle}</p>
        </div>

        {/* Price cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {p.items.map((item, i) => (
            <div
              key={i}
              className="reveal card-dark p-6 flex items-center gap-4"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="text-3xl flex-shrink-0">{item.icon}</div>
              <div className="flex-1 min-w-0">
                <div
                  className="font-display text-sm text-cream uppercase tracking-wide truncate"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  {item.name}
                </div>
                <div className="text-cream/40 text-xs">{item.note}</div>
              </div>
              <div
                className="font-display text-xl text-gold font-bold flex-shrink-0"
                style={{ fontFamily: 'Oswald, sans-serif' }}
              >
                {item.price}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="reveal text-cream/35 text-xs text-center mb-10">{p.note}</p>

        {/* CTA */}
        <div className="reveal text-center" style={{ transitionDelay: '400ms' }}>
          <a
            href="#contact"
            onClick={e => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="btn-gold text-base px-10 py-4 animate-pulse-gold"
          >
            {p.cta} →
          </a>
        </div>
      </div>
    </section>
  )
}
