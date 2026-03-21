"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

function SliderCard({
  label,
  before,
  after,
  beforeLabel,
  afterLabel,
  sliderHint,
  placeholderBefore,
  placeholderAfter,
}: {
  label: string;
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
  sliderHint: string;
  placeholderBefore: string;
  placeholderAfter: string;
}) {
  const [pos, setPos] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);

  const getPos = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(5, Math.min(95, p)));
  };

  // Card is ~33vw on desktop (3 cols), 100vw on mobile
  const imgSizes = "(min-width: 768px) 33vw, 100vw";

  return (
    <div className="overflow-hidden reveal card-dark">
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-gold/10">
        <span className="text-sm tracking-widest uppercase font-display text-cream">
          {label}
        </span>
        <div className="flex gap-4 text-xs">
          <span className="font-semibold tracking-wide text-red-400 uppercase">
            {beforeLabel}
          </span>
          <span className="font-semibold tracking-wide uppercase text-gold">
            {afterLabel}
          </span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative select-none aspect-video cursor-ew-resize bg-ink-600"
        onMouseMove={(e) => e.buttons === 1 && getPos(e.clientX)}
        onTouchMove={(e) => getPos(e.touches[0].clientX)}
        onClick={(e) => getPos(e.clientX)}
      >
        {/* Before — full width background */}
        <div className="absolute inset-0">
          {before ? (
            <Image
              src={before}
              alt={beforeLabel}
              fill
              className="object-cover"
              sizes={imgSizes}
              quality={75}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-ink-600">
              <div className="text-center">
                <div className="mb-2 text-4xl">🛋️</div>
                <div className="text-xs text-cream/30">{placeholderBefore}</div>
              </div>
            </div>
          )}
        </div>

        {/* After — clipped to left */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          {after ? (
            <div className="relative w-[300%] h-full">
              <Image
                src={after}
                alt={afterLabel}
                fill
                className="object-cover"
                sizes={imgSizes}
                quality={75}
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-ink-700">
              <div className="text-center">
                <div className="mb-2 text-4xl">✨</div>
                <div className="text-xs text-gold">{placeholderAfter}</div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gold shadow-[0_0_12px_rgba(245,196,0,0.6)] z-10"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-lg top-1/2 left-1/2 bg-gold">
            <svg
              className="w-4 h-4 text-ink"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7M9 19l-7-7 7-7"
              />
            </svg>
          </div>
        </div>

        {/* Corner labels */}
        <div className="absolute top-3 left-3 bg-black/60 text-red-400 text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm pointer-events-none z-10">
          {beforeLabel}
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-gold text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm pointer-events-none z-10">
          {afterLabel}
        </div>
      </div>

      <div className="px-4 py-2.5 text-center">
        <span className="text-xs text-cream/35">{sliderHint}</span>
      </div>
    </div>
  );
}

export default function BeforeAfter() {
  const { t } = useLanguage();
  const g = t.gallery;
  const ref = useScrollReveal();

  const pairs = [
    { before: "/before-sofa.jpg", after: "/after-sofa.jpg" },
    { before: "/before-mattress.jpg", after: "/after-mattress.jpg" },
    { before: "/before-carpet.jpg", after: "/after-carpet.jpg" },
  ];

  return (
    <section
      id="gallery"
      className="relative overflow-hidden section-pad bg-ink-800"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-6xl px-4 mx-auto sm:px-6">
        <div className="mb-12 text-center reveal">
          <div className="mx-auto section-badge">{g.badge}</div>
          <h2 className="mt-4 text-4xl tracking-tight uppercase font-display sm:text-5xl text-cream">
            {g.title}
          </h2>
          <p className="max-w-md mx-auto mt-3 text-sm text-cream/50">
            {g.subtitle}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pairs.map((pair, i) => (
            <div key={i} style={{ transitionDelay: `${i * 100}ms` }}>
              <SliderCard
                label={g.pairs[i]?.label ?? ""}
                before={pair.before}
                after={pair.after}
                beforeLabel={g.beforeLabel}
                afterLabel={g.afterLabel}
                sliderHint={g.sliderHint}
                placeholderBefore={g.placeholderBefore}
                placeholderAfter={g.placeholderAfter}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
