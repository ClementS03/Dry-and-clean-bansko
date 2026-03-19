'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Services() {
  const { t } = useLanguage()
  const ref = useScrollReveal()

  return (
    <section id="services" className="section-pad bg-ink-800 relative overflow-hidden">
      {/* Subtle gold top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="section-badge mx-auto">✨ {t.services.subtitle}</div>
          <h2
            className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight mt-4"
          >
            {t.services.title}
          </h2>
        </div>

        {/* Cards grid */}
        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {t.services.items.map((svc, i) => (
            <div
              key={i}
              className="reveal card-dark group relative p-6 cursor-default"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Popular tag */}
              {svc.tag && (
                <div className="absolute top-4 right-4 bg-gold text-ink text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm font-display">
                  {svc.tag}
                </div>
              )}

              {/* Icon */}
              <div className="text-4xl mb-4">{svc.icon}</div>

              {/* Name */}
              <h3
                className="font-display text-xl text-cream uppercase tracking-wide mb-2 group-hover:text-gold transition-colors duration-300"
              >
                {svc.name}
              </h3>

              {/* Description */}
              <p className="text-cream/55 text-sm leading-relaxed mb-4">{svc.description}</p>

              {/* Price */}
              <div className="flex items-center justify-between pt-4 border-t border-gold/10">
                <span className="text-gold font-display font-semibold text-lg tracking-wide">
                  {svc.price}
                </span>
                <span className="text-cream/30 text-xs">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA bottom */}
        <div className="text-center mt-12">
          <a
            href="#contact"
            onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="btn-gold"
          >
            {t.pricing.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
