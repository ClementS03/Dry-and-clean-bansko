'use client'
import { useLanguage } from '@/context/LanguageContext'

/** Information RGPD affichee sous le bouton d envoi des formulaires. */
export default function PrivacyNote() {
  const { t, lang } = useLanguage()
  const href = lang === 'bg' ? '/privacy' : `/${lang}/privacy`
  return (
    <p className="mt-3 text-xs text-center text-cream/50">
      {t.legal.privacyNote}{' '}
      <a href={href} className="underline underline-offset-2 decoration-gold/30 text-gold/80 hover:text-gold">
        {t.legal.privacyLabel}
      </a>
    </p>
  )
}
