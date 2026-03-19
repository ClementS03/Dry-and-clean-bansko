'use client'

import { useLanguage } from '@/context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()
  const f = t.footer
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-800 border-t border-gold/10 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div
              className="font-display text-base text-cream uppercase tracking-wider"
            >
              {f.company}
            </div>
            <div className="text-cream/35 text-xs mt-1">{f.tagline}</div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {f.links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => {
                  e.preventDefault()
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-cream/40 hover:text-gold text-xs uppercase tracking-widest transition-colors font-display"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Phone quick */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <a href={`tel:${t.contact.phoneEN.replace(/\s/g, '')}`} className="text-cream/50 hover:text-gold text-sm transition-colors">
              🇬🇧 {t.contact.phoneEN}
            </a>
            <a href={`tel:${t.contact.phoneBG.replace(/\s/g, '')}`} className="text-cream/50 hover:text-gold text-sm transition-colors">
              🇧🇬 {t.contact.phoneBG}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-divider mt-8 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-cream/25 text-xs">
          <span>© {year} {f.company}. {f.rights}.</span>
          <span className="flex items-center gap-1.5">
            <span>{f.poweredBy}</span>
            <span className="text-gold/50 font-semibold">Next.js</span>
            <span>·</span>
            <span>{f.hostedOn}</span>
            <span className="text-gold/50 font-semibold">Vercel</span>
          </span>
        </div>
      </div>
    </footer>
  )
}
