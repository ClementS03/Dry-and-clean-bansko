'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function WhyUs() {
  const { t } = useLanguage()
  const why = t.whyUs
  const ref = useScrollReveal()

  return (
    <section id="why" className="section-pad bg-ink-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      {/* Gold accent top right */}
      <div
        className="absolute top-0 right-0 w-[50vw] h-[50vh] opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, #F5C400, transparent 70%)' }}
      />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 reveal">
          <h2
            className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            {why.title}
          </h2>
          <div className="gold-divider w-24 mx-auto mt-4" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {why.items.map((item, i) => (
            <div
              key={i}
              className="reveal flex gap-4 items-start"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="flex-shrink-0 w-12 h-12 bg-gold/10 border border-gold/20 rounded-sm flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div>
                <h3
                  className="font-display text-base text-gold uppercase tracking-wide mb-1.5"
                  style={{ fontFamily: 'Oswald, sans-serif' }}
                >
                  {item.title}
                </h3>
                <p className="text-cream/55 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee callout */}
        <div className="reveal mt-14 bg-gold/5 border border-gold/20 rounded-sm p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left" style={{ transitionDelay: '400ms' }}>
          <div className="text-4xl flex-shrink-0">💯</div>
          <div>
            <div
              className="font-display text-xl text-gold uppercase tracking-wide mb-1"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {why.items[1].title}
            </div>
            <p className="text-cream/60 text-sm">{why.items[1].description}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
