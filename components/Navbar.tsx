"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

export default function Navbar() {
  const { t, toggle } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
              width={140}
              height={40}
              className="w-auto h-10"
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
            <button
              onClick={toggle}
              className="font-display text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1 rounded-sm hover:bg-gold/10 transition-colors duration-200"
              aria-label="Switch language"
            >
              {t.nav.langSwitch}
            </button>

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
