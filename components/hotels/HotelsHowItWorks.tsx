'use client'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsHowItWorks() {
  const { t } = useLanguage()
  const h = t.hotels.howItWorks
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink-800">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-cream uppercase tracking-tight mb-10 reveal">{h.title}</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {h.steps.map((step, i) => (
            <div key={i} className="reveal flex flex-col gap-4" style={{ transitionDelay: `${i * 100}ms` }}>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-sm border border-gold/30 bg-gold/10 font-display text-base font-bold tracking-wider text-gold">{step.number}</span>
              <h3 className="font-display text-lg text-gold uppercase tracking-wide">{step.title}</h3>
              <p className="text-cream/55 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
