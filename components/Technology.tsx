'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Technology() {
  const { t } = useLanguage()
  const tech = t.technology
  const ref = useScrollReveal()

  return (
    <section id="technology" className="section-pad bg-ink relative overflow-hidden">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #F5C400 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* ── Header ── */}
        <div className="text-center mb-16 reveal">
          <div className="section-badge mx-auto">{tech.badge}</div>
          <h2
            className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight mt-4 leading-none"
          >
            {tech.title}
          </h2>
          <h3
            className="font-display text-4xl sm:text-5xl text-gold-gradient uppercase tracking-tight leading-none mt-1"
          >
            {tech.titleSub}
          </h3>
          <p className="text-cream/50 mt-5 max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
            {tech.description}
          </p>
        </div>

        {/* ── Process steps ── */}
        <div className="grid md:grid-cols-3 gap-0 mb-16 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-gold/20 via-gold/50 to-gold/20 pointer-events-none" />

          {tech.steps.map((step, i) => (
            <div
              key={i}
              className="reveal relative flex flex-col items-center text-center px-6 py-8"
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Step number bubble */}
              <div className="relative mb-5 z-10">
                <div className="w-20 h-20 rounded-full bg-ink-700 border-2 border-gold/40 flex items-center justify-center shadow-[0_0_24px_rgba(245,196,0,0.12)]">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                {/* Number badge */}
                <div
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gold rounded-full flex items-center justify-center"
                >
                  <span className="text-ink font-bold text-xs">{i + 1}</span>
                </div>
              </div>

              {/* Step content */}
              <div
                className="font-display text-lg text-gold uppercase tracking-wide mb-2"
              >
                {step.title}
              </div>
              <p className="text-cream/55 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>

              {/* Arrow between steps (desktop) */}
              {i < tech.steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-3 text-gold/40 text-lg z-20">
                  →
                </div>
              )}

              {/* Arrow between steps (mobile) */}
              {i < tech.steps.length - 1 && (
                <div className="md:hidden mt-4 text-gold/40 text-2xl">↓</div>
              )}
            </div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="gold-divider mb-16 opacity-30" />

        {/* ── Feature grid ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tech.features.map((f, i) => (
            <div
              key={i}
              className="reveal card-dark p-5 flex flex-col gap-3"
              style={{ transitionDelay: `${i * 80 + 300}ms` }}
            >
              <span className="text-2xl">{f.icon}</span>
              <div
                className="font-display text-sm text-gold uppercase tracking-wide"
              >
                {f.title}
              </div>
              <p className="text-cream/55 text-xs leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>

        {/* ── Stats bar ── */}
        <div
          className="reveal mt-10 grid grid-cols-3 gap-px bg-gold/10 border border-gold/10 rounded-sm overflow-hidden"
          style={{ transitionDelay: '500ms' }}
        >
          {tech.stats.map((s, i) => (
            <div
              key={i}
              className="bg-ink-700 py-5 flex flex-col items-center justify-center text-center"
            >
              <div
                className="font-display text-2xl sm:text-3xl text-gold"
              >
                {s.value}
              </div>
              <div className="text-cream/40 text-xs uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
