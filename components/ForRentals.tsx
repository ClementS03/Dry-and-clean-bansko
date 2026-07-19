'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function ForRentals() {
  const { t, lang } = useLanguage()
  const r = t.rentals
  const ref = useScrollReveal()
  const hotelsPath = lang === 'en' ? '/en/hotels' : lang === 'ru' ? '/ru/hotels' : '/hotels'

  const waUrl = `https://wa.me/${t.contact.whatsappNumber}?text=${encodeURIComponent(r.whatsappMsg)}`

  return (
    <section id="rentals" className="section-pad bg-ink-800 relative overflow-hidden">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[50vw] h-[60vh] opacity-[0.07] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, var(--gold), transparent 65%)' }} />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div className="section-badge mb-6">{r.badge}</div>
          <h2 className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight">
            {r.title}{' '}
            <span className="text-gold-gradient">{r.titleHighlight}</span>
          </h2>
          <p className="text-cream/50 mt-4 text-base max-w-xl mx-auto">{r.subtitle}</p>
        </div>

        {/* Two-column: perks left, form right */}
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Left: value props — each card reveals individually (stagger like WhyUs) */}
          <div className="space-y-5">
            {r.items.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 card-dark reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</div>
                <div>
                  <div className="font-display text-base text-gold uppercase tracking-wide mb-1">
                    {item.title}
                  </div>
                  <div className="text-cream/60 text-sm leading-relaxed">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}

            {/* Trust line */}
            <p className="text-cream/30 text-xs text-center pt-2">📍 {r.trust}</p>

            {/* WhatsApp CTA — mobile/tablet */}
            <div className="lg:hidden pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full justify-center py-4 text-base"
              >
                {r.cta} →
              </a>
            </div>

            {/* Email CTA — desktop */}
            <div className="hidden lg:block pt-2">
              <a
                href={`mailto:${t.contact.email}?subject=${encodeURIComponent(r.cta)}`}
                className="btn-gold w-full justify-center py-4 text-base"
              >
                {r.cta} →
              </a>
            </div>
          </div>

          {/* Right: link to hotels page */}
          <div className="reveal flex flex-col items-center justify-center h-full gap-6 p-8 card-dark text-center" style={{ transitionDelay: '150ms' }}>
            <div className="text-5xl">🏨</div>
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">{r.subtitle}</p>
            <a href={hotelsPath} className="btn-gold px-6 py-3 text-sm">
              {r.hotelsLink}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
