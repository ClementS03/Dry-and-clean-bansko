'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

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
  label: string
  before: string
  after: string
  beforeLabel: string
  afterLabel: string
  sliderHint: string
  placeholderBefore: string
  placeholderAfter: string
}) {
  const [pos, setPos] = useState(50)
  const trackRef = useRef<HTMLDivElement>(null)

  const getPos = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const p = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(5, Math.min(95, p)))
  }

  return (
    <div className="reveal card-dark overflow-hidden">
      <div className="px-4 py-2.5 flex items-center justify-between border-b border-gold/10">
        <span className="font-display text-sm text-cream uppercase tracking-widest" style={{ fontFamily: 'Oswald, sans-serif' }}>
          {label}
        </span>
        <div className="flex gap-4 text-xs">
          <span className="text-red-400 font-semibold uppercase tracking-wide">{beforeLabel}</span>
          <span className="text-gold font-semibold uppercase tracking-wide">{afterLabel}</span>
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative aspect-video cursor-ew-resize select-none bg-ink-600"
        onMouseMove={e => e.buttons === 1 && getPos(e.clientX)}
        onTouchMove={e => getPos(e.touches[0].clientX)}
        onClick={e => getPos(e.clientX)}
      >
        {/* Before */}
        <div className="absolute inset-0 flex items-center justify-center bg-ink-600">
          {/* TODO: replace with <Image src={before} alt={beforeLabel} fill className="object-cover" /> */}
          <div className="text-center">
            <div className="text-4xl mb-2">🛋️</div>
            <div className="text-xs text-cream/30">{placeholderBefore}</div>
          </div>
        </div>

        {/* After (clipped) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <div className="absolute inset-0 bg-ink-700 flex items-center justify-center">
            {/* TODO: replace with <Image src={after} alt={afterLabel} fill className="object-cover" /> */}
            <div className="text-center">
              <div className="text-4xl mb-2">✨</div>
              <div className="text-gold text-xs">{placeholderAfter}</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gold shadow-[0_0_12px_rgba(245,196,0,0.6)] z-10"
          style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gold rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7M9 19l-7-7 7-7" />
            </svg>
          </div>
        </div>

        {/* Corner labels */}
        <div className="absolute top-3 left-3 bg-black/60 text-red-400 text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm pointer-events-none">
          {beforeLabel}
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-gold text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm pointer-events-none">
          {afterLabel}
        </div>
      </div>

      <div className="px-4 py-2.5 text-center">
        <span className="text-cream/35 text-xs">{sliderHint}</span>
      </div>
    </div>
  )
}

export default function BeforeAfter() {
  const { t } = useLanguage()
  const g = t.gallery
  const ref = useScrollReveal()

  const pairs = [
    { before: '/before-sofa.jpg', after: '/after-sofa.jpg' },
    { before: '/before-mattress.jpg', after: '/after-mattress.jpg' },
    { before: '/before-carpet.jpg', after: '/after-carpet.jpg' },
  ]

  return (
    <section id="gallery" className="section-pad bg-ink-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal">
          <div className="section-badge mx-auto">{g.badge}</div>
          <h2
            className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight mt-4"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            {g.title}
          </h2>
          <p className="text-cream/50 mt-3 max-w-md mx-auto text-sm">{g.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pairs.map((pair, i) => (
            <div key={i} style={{ transitionDelay: `${i * 100}ms` }}>
              <SliderCard
                label={g.pairs[i]?.label ?? ''}
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
  )
}
