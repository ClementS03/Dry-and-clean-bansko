'use client'
import { useLanguage } from '@/context/LanguageContext'
import Icon from '@/components/Icon'
import { useScrollReveal } from '@/hooks/useScrollReveal'

/**
 * Chantier reel sur /business. Le texte vient de hotels.caseStudy, les
 * photos de public/gallery/business/ (galerie rendue a part, par la page,
 * et seulement si des paires existent).
 */
export default function HotelsCaseStudy() {
  const { t } = useLanguage()
  const c = t.hotels.caseStudy
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink-800">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="reveal card-dark p-6 sm:p-8 flex gap-5 items-start">
          <div className="flex-shrink-0 w-12 h-12 bg-gold/10 border border-gold/20 rounded-sm flex items-center justify-center">
            <Icon name="building-2" className="w-6 h-6 text-gold" />
          </div>
          <div>
            <div className="section-badge mb-3">{c.badge}</div>
            <h2 className="font-display text-2xl sm:text-3xl text-cream uppercase tracking-tight">{c.title}</h2>
            <p className="text-cream/60 mt-3 leading-relaxed">{c.text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
