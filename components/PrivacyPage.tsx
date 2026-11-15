'use client'
import { useLanguage } from '@/context/LanguageContext'

/** Politique de confidentialite, texte dans privacy.* des JSON. */
export default function PrivacyPage() {
  const { t } = useLanguage()
  const p = t.privacy
  return (
    <section className="section-pad bg-ink pt-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight">{p.title}</h1>
        <p className="mt-3 text-xs text-cream/50">{p.updated}</p>
        <div className="mt-10 space-y-8">
          {p.sections.map((s) => (
            <div key={s.title}>
              <h2 className="font-display text-xl text-gold uppercase tracking-wide">{s.title}</h2>
              {s.paragraphs.map((para, i) => (
                <p key={i} className="mt-3 text-sm leading-relaxed text-cream/70">{para}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
