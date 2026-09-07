'use client'
import { useLanguage } from '@/context/LanguageContext'
import Icon from '@/components/Icon'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsPricing() {
  const { t, lang } = useLanguage()
  const p = t.hotels.pricing
  const quoteAnchor = lang === 'en' ? '/en#quote' : lang === 'ru' ? '/ru#quote' : '/#quote'
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-cream uppercase tracking-tight mb-10 reveal">{p.title}</h2>
        <div className="reveal p-5 card-dark flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="text-2xl">💶</div>
          <div>
            <p className="text-cream/70 text-sm">{p.publicNote}</p>
            <a href={quoteAnchor} className="text-gold text-sm hover:text-gold/80 transition-colors mt-1 inline-block">
              {p.publicLinkLabel}
            </a>
          </div>
        </div>
        <div className="reveal text-cream/50 text-sm mb-10 flex items-center gap-2">
          <span className="text-gold">✓</span> {p.discount}
        </div>
        <div className="reveal p-6 bg-gold/5 border border-gold/20 rounded-sm mb-6">
          <h3 className="font-display text-xl text-gold uppercase tracking-wide mb-2">{p.monthly.title}</h3>
          <div className="font-display text-3xl text-cream mb-4">{p.monthly.range}</div>
          <div className="flex flex-wrap gap-4">
            {p.monthly.factors.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-cream/60 text-sm">
                <Icon name={f.icon} className="w-4 h-4 text-gold" /> {f.label}
              </div>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="reveal p-5 card-dark">
            <h3 className="font-display text-base text-gold uppercase tracking-wide mb-2">{p.seasonal.title}</h3>
            <p className="text-cream/55 text-sm leading-relaxed">{p.seasonal.description}</p>
          </div>
          <div className="reveal p-5 card-dark">
            <h3 className="font-display text-base text-gold uppercase tracking-wide mb-2">{p.restaurant.title}</h3>
            <p className="text-cream/55 text-sm leading-relaxed">{p.restaurant.description}</p>
            <div className="mt-3 text-cream/60 text-xs">{p.restaurant.price}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
