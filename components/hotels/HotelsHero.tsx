'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function HotelsHero() {
  const { t } = useLanguage()
  const h = t.hotels.hero
  const waUrl = `https://wa.me/${t.contact.whatsappNumber}?text=${encodeURIComponent(h.ctaWhatsappMsg)}`

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('hotels-devis')?.scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <section className="relative min-h-[60vh] flex items-center section-pad bg-ink overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(245,196,0,0.08), transparent 60%)' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="section-badge mb-6">{h.badge}</div>
        <h1 className="font-display text-5xl sm:text-6xl text-cream uppercase tracking-tight max-w-3xl">
          {h.title}
        </h1>
        <p className="text-cream/60 mt-6 text-lg max-w-xl leading-relaxed">{h.subtitle}</p>
        <div className="mt-10">
          <div className="lg:hidden">
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="btn-gold px-8 py-4 text-base">
              {h.cta} →
            </a>
          </div>
          <div className="hidden lg:block">
            <a href="#hotels-devis" onClick={scrollToForm} className="btn-gold px-8 py-4 text-base">
              {h.cta} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
