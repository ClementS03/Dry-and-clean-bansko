'use client'
import { useLanguage } from '@/context/LanguageContext'
import Icon from '@/components/Icon'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsForWho() {
  const { t } = useLanguage()
  const s = t.hotels.forWho
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink-800">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-cream uppercase tracking-tight mb-10 reveal">{s.title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {s.items.map((item, i) => (
            <div key={i} className="reveal flex flex-col items-center gap-3 p-6 card-dark text-center"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <Icon name={item.icon} className="w-9 h-9 text-gold" />
              <div className="font-display text-sm text-gold uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
