'use client'

import Image from 'next/image'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Icon from '@/components/Icon'

type ServiceItem = {
  key: string
  slug: string
  icon: string
  name: string
  description: string
  tag: string | null
  items?: string[]
}

/**
 * covers : vignette optionnelle par service, alimentee par public/gallery/<slug>/after-1.
 * Tant qu'un service n'a pas de photo, sa carte affiche son icone.
 */
export default function Services({ covers = {} }: { covers?: Record<string, string> }) {
  const { t } = useLanguage()
  const ref = useScrollReveal()
  const services = t.services.items as ServiceItem[]

  return (
    <section id="services" className="relative overflow-hidden section-pad bg-ink-800">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="max-w-6xl px-4 mx-auto sm:px-6">
        <div className="mb-14 text-center">
          <div className="mx-auto section-badge">{t.services.subtitle}</div>
          <h2 className="mt-4 text-4xl tracking-tight uppercase font-display sm:text-5xl text-cream">
            {t.services.title}
          </h2>
        </div>

        <div ref={ref} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const cover = covers[service.key]
            const wide = i === 0

            return (
              <div
                key={service.key}
                className={`reveal card-dark group relative overflow-hidden flex flex-col ${wide ? 'lg:col-span-2' : ''}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {cover && (
                  <div className="relative overflow-hidden aspect-video bg-ink-600">
                    <Image
                      src={cover}
                      alt={service.name}
                      fill
                      sizes={wide ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 66vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-700 via-ink-700/20 to-transparent" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-6">
                  {service.tag && (
                    <div className="absolute px-2 py-0.5 text-xs font-bold tracking-wider uppercase rounded-sm top-4 right-4 bg-gold text-ink font-display">
                      {service.tag}
                    </div>
                  )}

                  {!cover && <Icon name={service.icon} className="w-8 h-8 mb-4 text-gold" />}

                  <h3 className="mb-2 text-xl tracking-wide uppercase transition-colors duration-300 font-display text-cream group-hover:text-gold">
                    {service.name}
                  </h3>

                  <p className="text-sm leading-relaxed text-cream/55">{service.description}</p>

                  {service.items && (
                    <ul className="flex flex-wrap gap-2 mt-4">
                      {service.items.map((item) => (
                        <li
                          key={item}
                          className="px-2.5 py-1 text-xs rounded-sm border border-gold/15 text-cream/60"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="btn-gold"
          >
            {t.services.cta}
          </a>
        </div>
      </div>
    </section>
  )
}
