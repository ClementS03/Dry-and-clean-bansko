'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Icon from '@/components/Icon'

export default function HowWeWork() {
  const { t } = useLanguage()
  const h = t.howWeWork
  const ref = useScrollReveal()

  return (
    <section id="how" className="relative overflow-hidden section-pad bg-ink">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-6xl px-4 mx-auto sm:px-6">
        <div className="mb-14 text-center reveal">
          <div className="mx-auto section-badge">{h.badge}</div>
          <h2 className="mt-4 text-4xl tracking-tight uppercase font-display sm:text-5xl text-cream">
            {h.title}
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {h.steps.map((step, i) => (
            <div
              key={step.number}
              className="relative p-6 reveal card-dark"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="absolute text-5xl font-bold leading-none top-4 right-4 font-display text-gold/10">
                {step.number}
              </div>
              <Icon name={step.icon} className="w-7 h-7 text-gold" />
              <h3 className="mt-4 mb-2 text-lg tracking-wide uppercase font-display text-cream">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-cream/55">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
