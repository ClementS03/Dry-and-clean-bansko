'use client'

import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Icon from '@/components/Icon'
import BeforeAfter from '@/components/BeforeAfter'
import HowWeWork from '@/components/HowWeWork'
import Technology from '@/components/Technology'
import Comparison from '@/components/Comparison'
import Quote from '@/components/Quote'
import LeadForm from '@/components/LeadForm'
import type { GalleryPair } from '@/lib/gallery'

type ServiceItem = { key: string; slug: string; icon: string; name: string }
type PageContent = {
  h1: string
  intro: string
  includes: string[]
  faq: { q: string; a: string }[]
}

/** Le textile porte la technologie injection-extraction, les autres services non. */
const TEXTILE_SLUG = 'upholstery-cleaning'

export default function ServicePage({
  slug,
  pairs,
  prefix,
}: {
  slug: string
  pairs: GalleryPair[]
  prefix: string
}) {
  const { t } = useLanguage()
  const hub = t.servicesHub
  const page = (t.servicePages as Record<string, PageContent>)[slug]
  const services = t.services.items as ServiceItem[]
  const service = services.find((s) => s.slug === slug)
  const others = services.filter((s) => s.slug !== slug)
  const includesRef = useScrollReveal()
  const othersRef = useScrollReveal()

  if (!page || !service) return null

  return (
    <>
      <section className="relative flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink-700" />
          <div
            className="absolute top-0 right-0 w-[60vw] h-[60vh] opacity-10"
            style={{ background: 'radial-gradient(ellipse at top right, var(--gold), transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 grid items-start max-w-6xl gap-10 px-4 pt-32 pb-16 mx-auto sm:px-6 md:grid-cols-2 md:gap-12 md:pt-36">
          <div>
            <Link
              href={`${prefix}/services`}
              className="inline-flex items-center gap-2 mb-6 text-xs tracking-widest uppercase transition-colors font-display text-gold/70 hover:text-gold"
            >
              {hub.backLabel}
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <Icon name={service.icon} className="w-8 h-8 text-gold" />
              <span className="text-xs tracking-widest uppercase font-display text-cream/40">
                {hub.badge}
              </span>
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight tracking-tight uppercase font-display sm:text-5xl text-cream">
              {page.h1}
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-cream/60">{page.intro}</p>
          </div>

          <div id="service-form">
            <LeadForm preselect={service.key} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden section-pad bg-ink-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div ref={includesRef} className="max-w-5xl px-4 mx-auto sm:px-6">
          <h2 className="mb-10 text-3xl tracking-tight uppercase font-display sm:text-4xl text-cream reveal">
            {hub.includesTitle}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {page.includes.map((line, i) => (
              <li
                key={line}
                className="flex items-start gap-3 p-4 text-sm reveal card-dark text-cream/70"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <Icon name="check" className="flex-shrink-0 w-4 h-4 mt-0.5 text-gold" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BeforeAfter pairs={pairs} />

      {slug === TEXTILE_SLUG && (
        <>
          <Technology />
          <Comparison />
        </>
      )}

      <HowWeWork />

      <section className="relative overflow-hidden section-pad bg-ink-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="max-w-3xl px-4 mx-auto sm:px-6">
          <h2 className="mb-10 text-3xl tracking-tight uppercase font-display sm:text-4xl text-cream">
            {hub.faqTitle}
          </h2>
          <div className="space-y-4">
            {page.faq.map((item) => (
              <div key={item.q} className="p-5 card-dark">
                <h3 className="mb-2 text-base tracking-wide uppercase font-display text-gold">
                  {item.q}
                </h3>
                <p className="text-sm leading-relaxed text-cream/60">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Quote />

      <section className="relative overflow-hidden section-pad bg-ink-800">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div ref={othersRef} className="max-w-6xl px-4 mx-auto sm:px-6">
          <h2 className="mb-8 text-2xl tracking-tight uppercase font-display sm:text-3xl text-cream reveal">
            {hub.otherTitle}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((other, i) => (
              <Link
                key={other.slug}
                href={`${prefix}/services/${other.slug}`}
                className="flex items-center gap-4 p-5 reveal card-dark group"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <Icon name={other.icon} className="flex-shrink-0 w-6 h-6 text-gold" />
                <span className="text-sm tracking-wide uppercase transition-colors font-display text-cream group-hover:text-gold">
                  {other.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
