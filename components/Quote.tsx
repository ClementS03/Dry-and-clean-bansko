'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Icon from '@/components/Icon'

export default function Quote() {
  const { t } = useLanguage()
  const q = t.quote
  const ref = useScrollReveal()

  return (
    <section id="quote" className="relative overflow-hidden section-pad bg-ink">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[40vh] opacity-[0.06] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, var(--gold), transparent 70%)' }}
      />

      <div ref={ref} className="relative max-w-5xl px-4 mx-auto sm:px-6">
        <div className="mb-14 text-center reveal">
          <div className="mx-auto section-badge">{q.badge}</div>
          <h2 className="mt-4 text-4xl tracking-tight uppercase font-display sm:text-5xl text-cream">
            {q.title}
          </h2>
          <p className="max-w-md mx-auto mt-3 text-sm text-cream/50">{q.subtitle}</p>
        </div>

        <div className="grid gap-4 mb-10 sm:grid-cols-2">
          {q.factors.map((factor, i) => (
            <div
              key={factor.title}
              className="flex gap-4 p-5 reveal card-dark"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Icon name={factor.icon} className="flex-shrink-0 w-6 h-6 mt-1 text-gold" />
              <div>
                <div className="mb-1 text-base tracking-wide uppercase font-display text-cream">
                  {factor.title}
                </div>
                <p className="text-sm leading-relaxed text-cream/55">{factor.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 mb-10 border rounded-sm reveal bg-gold/5 border-gold/20">
          <h3 className="mb-4 text-lg tracking-wide uppercase font-display text-gold">
            {q.reassuranceTitle}
          </h3>
          <ul className="space-y-2.5">
            {q.reassurance.map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm text-cream/70">
                <Icon name="check" className="flex-shrink-0 w-4 h-4 mt-0.5 text-gold" />
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center reveal" style={{ transitionDelay: '300ms' }}>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="px-10 py-4 text-base btn-gold animate-pulse-gold"
          >
            {q.cta}
          </a>
          <p className="mt-4 text-xs text-cream/55">{q.note}</p>
        </div>
      </div>
    </section>
  )
}
