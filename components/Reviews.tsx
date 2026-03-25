"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SERVICE_ICONS: Record<string, string> = {
  "Canapé/Fauteuil": "🛋️",
  "Sofa/Armchair": "🛋️",
  Matelas: "🛏️",
  Mattress: "🛏️",
  "Kilim/Moquette": "🏠",
  "Carpet/Rug": "🏠",
  Rideaux: "🪟",
  Curtains: "🪟",
  "Sièges auto": "🚗",
  "Car seats": "🚗",
};

interface Review {
  id: string;
  name: string;
  rating: number;
  services: string[];
  comment: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
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
          </div>
        </div>
        {/* Quote mark */}
        <span className="mt-1 font-serif text-4xl leading-none text-gold/20">
          "
        </span>
      </div>

      {/* Comment */}
      <p className="flex-1 text-sm leading-relaxed text-cream/65">
        {review.comment}
      </p>

      {/* Services */}
      {review.services.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gold/10">
          {review.services.map((svc) => (
            <span
              key={svc}
              className="inline-flex items-center gap-1.5 bg-gold/8 border border-gold/15 rounded-sm px-2.5 py-1 text-xs text-cream/60"
            >
              <span>{SERVICE_ICONS[svc] ?? "✓"}</span>
              <span>{svc}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Carousel (2+ reviews) ─────────────────────────────────────────────
function ReviewCarousel({ reviews }: { reviews: Review[] }) {
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
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? "w-5 h-2 bg-gold"
                  : "w-2 h-2 bg-gold/25 hover:bg-gold/50"
              }`}
              aria-label={`Avis ${i + 1}`}
            />
          ))}
        </div>

        {/* Prev / Next */}
        <div className="flex gap-2">
          <button
            onClick={prev}
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
export default function Reviews() {
  const { t } = useLanguage();
  const ref = useScrollReveal();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        // Shuffle and cap at 6
        const shuffled = [...(data.reviews ?? [])].sort(
          () => Math.random() - 0.5,
        );
        setReviews(shuffled.slice(0, 6));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Hidden while loading or if no reviews
  if (!loaded || reviews.length === 0) return null;

  return (
    <section
      id="reviews"
      className="relative overflow-hidden section-pad bg-ink-800"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-4xl px-4 mx-auto sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center reveal">
          <div className="mx-auto section-badge">⭐ {t.reviews.badge}</div>
          <h2
            className="mt-4 text-4xl tracking-tight uppercase font-display sm:text-5xl text-cream"
            style={{ fontFamily: "Oswald, sans-serif" }}
          >
            {t.reviews.title}
          </h2>
          <p className="max-w-md mx-auto mt-3 text-sm text-cream/50">
            {t.reviews.subtitle}
          </p>
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
