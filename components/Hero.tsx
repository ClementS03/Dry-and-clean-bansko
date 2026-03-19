'use client'

import { useLanguage } from '@/context/LanguageContext'
import LeadForm from '@/components/LeadForm'

export default function Hero() {
  const { t } = useLanguage()

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink-700" />
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] opacity-10" style={{ background: 'radial-gradient(ellipse at top right, var(--gold), transparent 70%)' }} />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] opacity-5" style={{ background: 'radial-gradient(ellipse at bottom left, var(--gold), transparent 70%)' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--gold) 0, var(--gold) 1px, transparent 0, transparent 50%)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 grid md:grid-cols-2 gap-12 items-center min-h-screen">

        {/* ── Left: copy ── */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <div className="section-badge mb-6">{t.hero.badge}</div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-none tracking-tight mb-4">
            <span className="text-cream block">{t.hero.title}</span>
            <span className="text-gold-gradient block">{t.hero.titleHighlight}</span>
          </h1>

          <p className="text-cream/60 text-lg leading-relaxed mb-8 max-w-md">{t.hero.subtitle}</p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {t.trust.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-cream/70 font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`tel:${t.contact.phoneEN.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors">
              <span>🇬🇧</span><span>{t.contact.phoneEN}</span>
            </a>
            <a href={`tel:${t.contact.phoneBG.replace(/\s/g, '')}`} className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors">
              <span>🇧🇬</span><span>{t.contact.phoneBG}</span>
            </a>
          </div>
        </div>

        {/* ── Right: form ── */}
        <div className="animate-fade-up" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          <LeadForm />
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/30 animate-bounce">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
