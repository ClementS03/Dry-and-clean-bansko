"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import Icon from "@/components/Icon";

/**
 * Avis recopies a la main dans content/*.json (reviews.items), depuis la
 * fiche Google et les anciens avis du formulaire. Aucun appel reseau.
 * Les tags de service sont des cles stables, traduites a l affichage.
 * Une valeur inconnue s affiche telle quelle, sans icone.
 */
const SERVICE_KEYS: Record<string, string> = {
  // objets textile
  sofa: 'sofa',
  'sofa/armchair': 'sofa',
  'canape/fauteuil': 'sofa',
  'canapé/fauteuil': 'sofa',
  mattress: 'mattress',
  matelas: 'mattress',
  carpet: 'carpet',
  'carpet/rug': 'carpet',
  'kilim/moquette': 'carpet',
  car: 'car',
  'car seats': 'car',
  'sieges auto': 'car',
  'sièges auto': 'car',
  // services
  textile: 'textile',
  'upholstery-cleaning': 'textile',
  deep: 'deep',
  'deep-cleaning': 'deep',
  renovation: 'renovation',
  'post-construction-cleaning': 'renovation',
  turnover: 'turnover',
  'airbnb-turnover': 'turnover',
  windows: 'windows',
  'window-cleaning': 'windows',
  pressure: 'pressure',
  'pressure-washing': 'pressure',
  industrial: 'industrial',
  'industrial-cleaning': 'industrial',
};

const SERVICE_ICON: Record<string, string> = {
  sofa: 'sofa',
  mattress: 'bed-double',
  carpet: 'home',
  car: 'car',
  textile: 'sofa',
  deep: 'sparkles',
  renovation: 'hard-hat',
  turnover: 'key-round',
  windows: 'app-window',
  pressure: 'droplets',
  industrial: 'factory',
};

interface Review {
  id: string;
  name: string;
  rating: number;
  services: string[];
  text: string;
  textLang: string;
  translation: string;
  source: string;
  date: string;
}

function StarRating({ rating, label }: { rating: number; label?: string }) {
  return (
    <div className="flex gap-0.5" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= rating ? "text-gold" : "text-cream/15"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const { t } = useLanguage();

  /** Libelle traduit du service, depuis le contenu. Null si la valeur
   *  saisie dans Notion ne correspond a rien de connu. */
  const labelFor = (key?: string): string | null => {
    if (!key) return null;
    const textile = (t.hero.form.textileItems as { value: string; label: string }[]).find(
      (i) => i.value === key,
    );
    if (textile) return textile.label;
    const service = (t.services.items as { key: string; name: string }[]).find(
      (x) => x.key === key,
    );
    return service?.name ?? null;
  };

  return (
    <div className="flex flex-col h-full gap-4 p-6 border rounded-sm bg-ink-700 border-gold/15">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar initials */}
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 border rounded-full bg-gold/15 border-gold/25">
            <span className="text-sm font-semibold uppercase font-display text-gold">
              {review.name.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm tracking-wide uppercase font-display text-cream">
              {review.name}
            </div>
            <StarRating rating={review.rating} />
            {(review.source || review.date) && (
              <div className="mt-1 text-xs text-cream/50">
                {[review.source === "google" ? t.reviews.sourceLabel : "", review.date].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
        {/* Quote mark */}
        <span aria-hidden="true" className="mt-1 font-serif text-4xl leading-none text-gold/20">
          "
        </span>
      </div>

      {/* Comment */}
      <div className="flex-1">
        <p lang={review.textLang} className="text-sm leading-relaxed text-cream/65">
          {review.text}
        </p>
        {review.translation && (
          <p className="mt-3 text-xs leading-relaxed text-cream/50">
            <span className="uppercase tracking-wide text-gold/60">{t.reviews.translationLabel}: </span>
            {review.translation}
          </p>
        )}
      </div>

      {/* Services */}
      {review.services.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gold/10">
          {review.services.map((svc) => {
            const key = SERVICE_KEYS[svc.trim().toLowerCase()]
            return (
              <span
                key={svc}
                className="inline-flex items-center gap-1.5 bg-gold/8 border border-gold/15 rounded-sm px-2.5 py-1 text-xs text-cream/60"
              >
                {key && SERVICE_ICON[key] && (
                  <Icon name={SERVICE_ICON[key]} className="w-3.5 h-3.5 text-gold" />
                )}
                <span>{labelFor(key) ?? svc}</span>
              </span>
            )
          })}
        </div>
      )}
    </div>
  );
}

// ── Carousel (2+ reviews) ─────────────────────────────────────────────
function ReviewCarousel({ reviews }: { reviews: Review[] }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (idx: number) => {
      setDirection(idx > active ? 1 : -1);
      setActive(idx);
    },
    [active],
  );

  const next = useCallback(
    () => go((active + 1) % reviews.length),
    [active, go, reviews.length],
  );
  const prev = useCallback(
    () => go((active - 1 + reviews.length) % reviews.length),
    [active, go, reviews.length],
  );

  // Auto-rotate every 5s
  useEffect(() => {
    const t = setTimeout(next, 5000);
    return () => clearTimeout(t);
  }, [next]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div className="relative">
      {/* Cards */}
      <div className="relative min-h-[220px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={reviews[active].id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            <ReviewCard review={reviews[active]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-5">
        {/* Dot indicators */}
        <div className="flex gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="flex items-center justify-center h-6 min-w-6 px-1"
              aria-label={`${t.reviews.ariaLabel} ${i + 1}`}
              aria-current={i === active}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === active
                    ? "w-5 h-2 bg-gold"
                    : "w-2 h-2 bg-gold/25 hover:bg-gold/50"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-2">
          <button
            onClick={prev}
            aria-label={t.reviews.prev}
            className="flex items-center justify-center transition-colors border rounded-sm w-9 h-9 border-gold/20 text-cream/50 hover:text-gold hover:border-gold/50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label={t.reviews.next}
            className="flex items-center justify-center transition-colors border rounded-sm w-9 h-9 border-gold/20 text-cream/50 hover:text-gold hover:border-gold/50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────
export default function Reviews({ bg = "bg-ink-800" }: { bg?: string }) {
  const { t } = useLanguage();
  const ref = useScrollReveal();
  const reviews = t.reviews.items as Review[];

  if (reviews.length === 0) return null;

  return (
    <section
      id="reviews"
      className={`relative overflow-hidden section-pad ${bg}`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-4xl px-4 mx-auto sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center reveal">
          <div className="mx-auto section-badge">⭐ {t.reviews.badge}</div>
          <h2
            className="mt-4 text-4xl tracking-tight uppercase font-display sm:text-5xl text-cream"
          >
            {t.reviews.title}
          </h2>
          <p className="max-w-md mx-auto mt-3 text-sm text-cream/50">
            {t.reviews.subtitle}
          </p>
          <div className="flex flex-col items-center gap-3 mt-6 sm:flex-row sm:justify-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold font-display text-cream">{t.reviews.rating}</span>
              <StarRating rating={5} label={t.reviews.ratingAria} />
              <span className="text-sm text-cream/60">{t.reviews.ratingLabel}</span>
            </div>
            <a
              href={t.reviews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest uppercase transition-colors border-b font-display text-gold border-gold/30 hover:border-gold"
            >
              {t.reviews.cta} →
            </a>
          </div>
        </div>

        {/* Single card or carousel */}
        <div
          className="max-w-xl mx-auto reveal"
          style={{ transitionDelay: "150ms" }}
        >
          {reviews.length === 1 ? (
            <ReviewCard review={reviews[0]} />
          ) : (
            <ReviewCarousel reviews={reviews} />
          )}
        </div>
      </div>
    </section>
  );
}
