'use client'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsSocialProof() {
  const { t } = useLanguage()
  const s = t.hotels.socialProof
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink-800">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="reveal mb-10">
          <a
            href={t.contact.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-sm text-gold text-sm font-display uppercase tracking-wide hover:bg-gold/20 transition-colors"
          >
            ★ Google {s.ratingLabel}
          </a>
        </div>
        <div className="reveal">
          <h2 className="font-display text-2xl text-cream uppercase tracking-tight mb-6">{s.referencesTitle}</h2>
          <div className="p-8 border border-gold/10 border-dashed rounded-sm text-center">
            <p className="text-cream/30 text-sm">{s.referencesEmpty}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
