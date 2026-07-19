"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function Navbar() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null)

  const langs: { code: 'bg' | 'en' | 'ru'; label: string; path: string }[] = [
    { code: 'bg', label: 'БГ', path: '/' },
    { code: 'en', label: 'EN', path: '/en' },
    { code: 'ru', label: 'RU', path: '/ru' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return
    const handler = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [langOpen]);

  const links = [
    { label: t.nav.services, href: "#services" },
    { label: t.nav.technology, href: "#technology" },
    { label: t.nav.prices, href: "#pricing" },
    { label: t.nav.faq, href: "#faq" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ink-800/95 backdrop-blur-md border-b border-gold/10 shadow-lg shadow-black/50"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 max-w-6xl px-4 mx-auto sm:px-6">
          {/* ── Logo ── */}
          {/* OPTION A (actuelle) : logo image — mets ton fichier dans /public/logo.png */}
          {/* OPTION B : logo texte — décommente le bloc en dessous et commente celui-ci */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center group"
          >
            <Image
              src="/logo.png"
              alt="Wet&Dry Cleaning Bansko"
              width={40}
              height={40}
              priority
              sizes="40px"
              className="object-cover w-10 h-10 overflow-hidden rounded-full"
            />
          </a>

          {/* OPTION B : logo texte (décommente si pas de logo image)
          <a
            href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="flex items-center gap-2 group"
          >
            <div className="flex items-center justify-center w-8 h-8 text-xs font-bold leading-none rounded-full bg-gold text-ink">
              W&D
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-semibold leading-tight tracking-wider text-white uppercase font-display">
                Wet&Dry
              </div>
              <div className="font-display text-gold text-[10px] tracking-[0.15em] uppercase leading-tight">
                Cleaning Bansko
              </div>
            </div>
          </a>
          */}

          {/* ── Desktop nav ── */}
          <div className="items-center hidden gap-6 md:flex">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="text-sm tracking-wider uppercase transition-colors duration-200 font-display text-cream/70 hover:text-gold"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* ── Right: lang + CTA + hamburger ── */}
          <div className="flex items-center gap-3">
            {/* Desktop lang dropdown — hover to open */}
            <div
              className="relative hidden md:block pb-1"
              onMouseEnter={() => setLangOpen(true)}
              onMouseLeave={() => setLangOpen(false)}
            >
              <button
                className="font-display text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1 rounded-sm hover:bg-gold/10 transition-colors duration-200"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Select language"
              >
                {langs.find(l => l.code === lang)?.label ?? 'БГ'} ▾
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-ink-800 border border-gold/20 rounded-sm shadow-lg shadow-black/50 py-1 min-w-[56px] z-50">
                  {langs.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLangOpen(false); router.push(l.path) }}
                      className={`block w-full text-left px-3 py-1.5 text-xs font-display font-semibold uppercase tracking-widest transition-colors ${l.code === lang ? 'text-gold' : 'text-cream/50 hover:text-gold'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile lang dropdown — click to toggle */}
            <div ref={langDropdownRef} className="relative md:hidden">
              <button
                onClick={() => setLangOpen(v => !v)}
                className="font-display text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1 rounded-sm hover:bg-gold/10 transition-colors duration-200"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Select language"
              >
                {langs.find(l => l.code === lang)?.label ?? 'БГ'} ▾
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-ink-800 border border-gold/20 rounded-sm shadow-lg shadow-black/50 py-1 min-w-[56px] z-50">
                  {langs.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLangOpen(false); router.push(l.path) }}
                      className={`block w-full text-left px-3 py-1.5 text-xs font-display font-semibold uppercase tracking-widest transition-colors ${l.code === lang ? 'text-gold' : 'text-cream/50 hover:text-gold'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNav("#contact");
              }}
              className="hidden px-4 py-2 text-xs sm:inline-flex btn-gold"
            >
              {t.nav.cta}
            </a>

            <button
              className="md:hidden p-1.5 text-cream/80 hover:text-gold transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 px-4 py-4 border-b top-16 bg-ink-700 border-gold/10">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => handleNav(l.href)}
                className="block w-full py-3 text-base tracking-wider text-left uppercase transition-colors border-b font-display text-cream/80 hover:text-gold border-white/5"
              >
                {l.label}
              </button>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNav("#contact");
              }}
              className="justify-center w-full py-3 mt-4 text-sm btn-gold"
            >
              {t.nav.cta}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
