'use client'
import { useLanguage } from '@/context/LanguageContext'
import Icon from '@/components/Icon'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsExtras() {
  const { t } = useLanguage()
  const e = t.hotels.extras
  const ref = useScrollReveal()
  const waUrl = `https://wa.me/${t.contact.whatsappNumber}?text=${encodeURIComponent(e.whatsappMsg)}`

  return (
    <section className="py-14 bg-ink border-t border-gold/5">
      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="reveal font-display text-xs uppercase tracking-[0.2em] text-gold/50 mb-2">{e.title}</div>
        <p className="reveal text-cream/60 text-sm mb-7 max-w-lg mx-auto">{e.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-7">
          {e.items.map((it, i) => (
            <div
              key={i}
              className="reveal flex items-center gap-2 text-cream/55 text-sm"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <Icon name={it.icon} className="w-4 h-4 text-gold" /> {it.label}
            </div>
          ))}
        </div>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="reveal inline-block font-display text-xs uppercase tracking-widest text-gold/70 hover:text-gold border-b border-gold/20 hover:border-gold pb-0.5 transition-colors"
        >
          {e.cta}
        </a>
      </div>
    </section>
  )
}
