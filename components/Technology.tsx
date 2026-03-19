'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Technology() {
  const { t } = useLanguage()
  const tech = t.technology
  const ref = useScrollReveal()

  return (
    <section id="technology" className="section-pad bg-ink relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #F5C400 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-14 items-center">

          {/* ── Left: text ── */}
          <div className="reveal">
            <div className="section-badge">{tech.badge}</div>

            <h2
              className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight mt-4 mb-1 leading-none"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {tech.title}
            </h2>
            <h3
              className="font-display text-4xl sm:text-5xl text-gold-gradient uppercase tracking-tight mb-6 leading-none"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              {tech.titleSub}
            </h3>

            <div className="gold-divider mb-6 w-20" />

            <p className="text-cream/65 leading-relaxed mb-8">{tech.description}</p>

            {/* Feature list */}
            <div className="grid sm:grid-cols-2 gap-4">
              {tech.features.map((f, i) => (
                <div
                  key={i}
                  className="reveal flex gap-3 items-start p-4 bg-ink-700 border border-gold/10 rounded-sm hover:border-gold/25 transition-colors"
                  style={{ transitionDelay: `${i * 80 + 200}ms` }}
                >
                  <span className="text-2xl flex-shrink-0">{f.icon}</span>
                  <div>
                    <div
                      className="font-display text-sm text-gold uppercase tracking-wide font-semibold mb-1"
                      style={{ fontFamily: 'Oswald, sans-serif' }}
                    >
                      {f.title}
                    </div>
                    <div className="text-cream/55 text-xs leading-relaxed">{f.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: machine showcase ── */}
          <div className="reveal flex flex-col items-center" style={{ transitionDelay: '150ms' }}>
            {/* Machine visual */}
            <div className="relative w-full max-w-sm mx-auto">
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-20"
                style={{ background: 'radial-gradient(circle, #F5C400, transparent 70%)' }}
              />

              {/* Placeholder for machine image */}
              <div className="relative bg-ink-700 border border-gold/20 rounded-sm aspect-square flex flex-col items-center justify-center p-8 text-center">
                {/* TODO: replace with <Image src="/machine.jpg" alt="Kärcher Puzzi 10/1" fill className="object-cover rounded-sm" /> */}
                <div className="text-8xl mb-4 animate-float">🧹</div>
                <div className="font-display text-2xl text-gold uppercase tracking-wide mb-1" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {tech.machineName}
                </div>
                <div className="text-cream/50 text-sm">{tech.machineDesc}</div>
                <div className="mt-4 px-4 py-1.5 bg-gold/10 border border-gold/25 rounded-sm text-gold text-xs font-semibold uppercase tracking-widest">
                  {tech.techBadge}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                  {tech.stats.map((s, i) => (
                    <div key={i} className="text-center">
                      <div className="font-display text-lg text-gold" style={{ fontFamily: 'Oswald, sans-serif' }}>{s.value}</div>
                      <div className="text-cream/40 text-[10px] uppercase tracking-wide">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
