"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

type ServiceItem = { key: string; slug: string; name: string };

export default function Navbar() {
  const { t, lang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const langDropdownDesktopRef = useRef<HTMLDivElement>(null);
  const langDropdownMobileRef = useRef<HTMLDivElement>(null);

  // Retire le prefixe /en ou /ru, puis applique celui de la langue cible
  const getLangPath = (code: "bg" | "en" | "ru") => {
    let base = pathname;
    if (base.startsWith("/en")) base = base.slice(3) || "/";
    else if (base.startsWith("/ru")) base = base.slice(3) || "/";
    if (code === "bg") return base || "/";
    return `/${code}${base === "/" ? "" : base}`;
  };

  const homePath = pathname.startsWith("/en")
    ? "/en"
    : pathname.startsWith("/ru")
      ? "/ru"
      : "/";

  const routePath = (segment: string) =>
    homePath === "/" ? `/${segment}` : `${homePath}/${segment}`;

  const services = t.services.items as ServiceItem[];

  const langCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openLang = () => {
    if (langCloseTimer.current) clearTimeout(langCloseTimer.current);
    setLangOpen(true);
  };
  const closeLangDelayed = () => {
    langCloseTimer.current = setTimeout(() => setLangOpen(false), 250);
  };

  const servicesCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openServices = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    setServicesOpen(true);
  };
  const closeServicesDelayed = () => {
    servicesCloseTimer.current = setTimeout(() => setServicesOpen(false), 250);
  };

  const langs: { code: "bg" | "en" | "ru"; label: string }[] = [
    { code: "bg", label: "БГ" },
    { code: "en", label: "EN" },
    { code: "ru", label: "RU" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const handler = (e: MouseEvent) => {
      const inDesktop = langDropdownDesktopRef.current?.contains(e.target as Node);
      const inMobile = langDropdownMobileRef.current?.contains(e.target as Node);
      if (!inDesktop && !inMobile) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langOpen]);

  const links = [
    { label: t.nav.services, href: routePath("services"), hasMenu: true },
    { label: t.nav.business, href: routePath("business"), hasMenu: false },
    { label: t.nav.quote, href: "#quote", hasMenu: false },
    { label: t.nav.faq, href: "#faq", hasMenu: false },
    { label: t.nav.contact, href: "#contact", hasMenu: false },
  ];

  const go = (href: string) => {
    setMenuOpen(false);
    setMobileServicesOpen(false);
    setServicesOpen(false);
    if (href.startsWith("/")) {
      router.push(href);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Ancre absente de la page courante : on repart de l accueil
      router.push(`${homePath === "/" ? "" : homePath}${href}`);
    }
  };

  const handleLogo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === homePath) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(homePath);
    }
  };

  const navLink =
    "text-sm tracking-wider uppercase transition-colors duration-200 font-display text-cream/70 hover:text-gold";

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
          <a href={homePath} onClick={handleLogo} className="flex items-center group">
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

          {/* ── Nav desktop ── */}
          <div className="items-center hidden gap-6 md:flex">
            {links.map((link) =>
              link.hasMenu ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={openServices}
                  onMouseLeave={closeServicesDelayed}
                  onFocus={openServices}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setServicesOpen(false);
                    }
                  }}
                  onKeyDown={(e) => e.key === "Escape" && setServicesOpen(false)}
                >
                  <button
                    onClick={() => go(link.href)}
                    className={`${navLink} inline-flex items-center gap-1`}
                    aria-haspopup="true"
                    aria-expanded={servicesOpen}
                  >
                    {link.label}
                    <span className="text-[10px] leading-none">▾</span>
                  </button>

                  {servicesOpen && (
                    <div className="absolute left-0 z-50 pt-3 top-full">
                      <div className="py-2 border rounded-sm shadow-lg bg-ink-800 border-gold/20 shadow-black/50 min-w-[260px]">
                        {services.map((service) => (
                          <button
                            key={service.slug}
                            onClick={() => go(`${routePath("services")}/${service.slug}`)}
                            className="block w-full px-4 py-2 text-xs tracking-wide text-left uppercase transition-colors font-display text-cream/60 hover:text-gold hover:bg-gold/5"
                          >
                            {service.name}
                          </button>
                        ))}
                        <div className="h-px my-2 bg-gold/10" />
                        <button
                          onClick={() => go(link.href)}
                          className="block w-full px-4 py-2 text-xs tracking-wide text-left uppercase transition-colors font-display text-gold/70 hover:text-gold"
                        >
                          {t.servicesHub.backLabel}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button key={link.href} onClick={() => go(link.href)} className={navLink}>
                  {link.label}
                </button>
              ),
            )}
          </div>

          {/* ── Langue, CTA, hamburger ── */}
          <div className="flex items-center gap-3">
            <div
              ref={langDropdownDesktopRef}
              className="relative hidden pb-1 md:block"
              onMouseEnter={openLang}
              onMouseLeave={closeLangDelayed}
            >
              <button
                className="font-display text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1 rounded-sm hover:bg-gold/10 transition-colors duration-200"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Select language"
              >
                {langs.find((l) => l.code === lang)?.label ?? "БГ"} ▾
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-ink-800 border border-gold/20 rounded-sm shadow-lg shadow-black/50 py-1 min-w-[56px] z-50">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLangOpen(false);
                        router.push(getLangPath(l.code));
                      }}
                      className={`block w-full text-left px-3 py-1.5 text-xs font-display font-semibold uppercase tracking-widest transition-colors ${
                        l.code === lang ? "text-gold" : "text-cream/50 hover:text-gold"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={langDropdownMobileRef} className="relative md:hidden">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="font-display text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1 rounded-sm hover:bg-gold/10 transition-colors duration-200"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Select language"
              >
                {langs.find((l) => l.code === lang)?.label ?? "БГ"} ▾
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-ink-800 border border-gold/20 rounded-sm shadow-lg shadow-black/50 py-1 min-w-[56px] z-50">
                  {langs.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLangOpen(false);
                        router.push(getLangPath(l.code));
                      }}
                      className={`block w-full text-left px-3 py-1.5 text-xs font-display font-semibold uppercase tracking-widest transition-colors ${
                        l.code === lang ? "text-gold" : "text-cream/50 hover:text-gold"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* btn-gold impose display:inline-flex, il faut un wrapper pour le masquer */}
            <div className="hidden sm:block">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("#contact");
                }}
                className="px-4 py-2 text-xs btn-gold"
              >
                {t.nav.cta}
              </a>
            </div>

            <button
              className="md:hidden p-1.5 text-cream/80 hover:text-gold transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Tiroir mobile ── */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 right-0 px-4 py-4 overflow-y-auto border-b top-16 bg-ink-700 border-gold/10 max-h-[calc(100vh-4rem)]">
            {links.map((link) =>
              link.hasMenu ? (
                <div key={link.href} className="border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => go(link.href)}
                      className="flex-1 py-3 text-base tracking-wider text-left uppercase transition-colors font-display text-cream/80 hover:text-gold"
                    >
                      {link.label}
                    </button>
                    <button
                      onClick={() => setMobileServicesOpen((v) => !v)}
                      className="px-3 py-3 transition-colors text-gold/70 hover:text-gold"
                      aria-label={link.label}
                      aria-expanded={mobileServicesOpen}
                    >
                      <span className="inline-block text-xs leading-none">
                        {mobileServicesOpen ? "▴" : "▾"}
                      </span>
                    </button>
                  </div>

                  {mobileServicesOpen && (
                    <div className="pb-2 pl-3 border-l border-gold/20 ml-1 mb-2 space-y-0.5">
                      {services.map((service) => (
                        <button
                          key={service.slug}
                          onClick={() => go(`${routePath("services")}/${service.slug}`)}
                          className="block w-full py-2 text-xs tracking-wide text-left uppercase transition-colors font-display text-cream/55 hover:text-gold"
                        >
                          {service.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={link.href}
                  onClick={() => go(link.href)}
                  className="block w-full py-3 text-base tracking-wider text-left uppercase transition-colors border-b font-display text-cream/80 hover:text-gold border-white/5"
                >
                  {link.label}
                </button>
              ),
            )}

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                go("#contact");
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
