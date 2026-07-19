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
        <div className="reveal flex flex-col sm:flex-row items-center gap-6">
          <a
            href={t.contact.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-gold/10 border border-gold/20 rounded-sm text-gold font-display uppercase tracking-wide hover:bg-gold/20 transition-colors text-sm"
          >
            <span className="text-xl">★</span>
            <span>Google {s.ratingLabel}</span>
          </a>
          <p className="text-cream/40 text-sm">{s.subtitle}</p>
        </div>
      </div>
    </section>
  )
}
