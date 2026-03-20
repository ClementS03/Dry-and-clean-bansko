"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const f = t.footer;
  const year = new Date().getFullYear();

  return (
    <footer className="px-4 py-10 border-t bg-ink-800 border-gold/10 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand */}
          <div className="text-center md:text-left">
            <div className="text-base tracking-wider uppercase font-display text-cream">
              {f.company}
            </div>
            <div className="mt-1 text-xs text-cream/35">{f.tagline}</div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {f.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector(link.href)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs tracking-widest uppercase transition-colors text-cream/40 hover:text-gold font-display"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Phone quick */}
          <div className="flex flex-col items-center gap-1 md:items-end">
            <a
              href={`tel:${t.contact.phoneEN.replace(/\s/g, "")}`}
              className="text-sm transition-colors text-cream/50 hover:text-gold"
            >
              🇬🇧 {t.contact.phoneEN}
            </a>
            <a
              href={`tel:${t.contact.phoneBG.replace(/\s/g, "")}`}
              className="text-sm transition-colors text-cream/50 hover:text-gold"
            >
              🇧🇬 {t.contact.phoneBG}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 mb-6 gold-divider" />
        <div className="flex flex-col items-center justify-between gap-2 text-xs sm:flex-row text-cream/25">
          <span>
            © {year} {f.company}. {f.rights}.
          </span>
          <span>
            {f.credit}{" "}
            <a
              href={f.creditUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors text-gold/70 hover:text-gold"
            >
              {f.creditName}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
