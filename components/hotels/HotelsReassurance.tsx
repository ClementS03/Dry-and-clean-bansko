'use client'
import { useLanguage } from '@/context/LanguageContext'
import Icon from '@/components/Icon'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsReassurance() {
  const { t } = useLanguage()
  const r = t.hotels.reassurance
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-cream uppercase tracking-tight mb-10 reveal">{r.title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {r.items.map((item, i) => (
            <div key={i} className="reveal flex gap-4 items-start" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="flex-shrink-0 w-10 h-10 bg-gold/10 border border-gold/20 rounded-sm flex items-center justify-center text-xl">
                <Icon name={item.icon} className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-sm text-gold uppercase tracking-wide mb-1">{item.title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
