'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function HotelsCTA() {
  const { t } = useLanguage()
  const cta = t.hotels.cta
  const waUrl = `https://wa.me/${t.contact.whatsappNumber}?text=${encodeURIComponent(cta.whatsappMsg)}`
  const emailUrl = `mailto:${t.contact.email}?subject=${encodeURIComponent(cta.label)}`
  return (
    <section className="section-pad bg-ink-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(245,196,0,0.06), transparent 60%)' }} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="gold-divider w-16 mx-auto mb-8" />
        <h2 className="font-display text-2xl sm:text-3xl text-cream uppercase tracking-tight mb-3">{cta.heading}</h2>
        <p className="text-cream/60 text-sm mb-8 max-w-md mx-auto">{cta.sub}</p>
        <div className="lg:hidden">
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="btn-gold px-10 py-4 text-base">
            {cta.label} →
          </a>
        </div>
        <div className="hidden lg:block">
          <a href={emailUrl} className="btn-gold px-10 py-4 text-base">
            {cta.label} →
          </a>
        </div>
      </div>
    </section>
  )
}
