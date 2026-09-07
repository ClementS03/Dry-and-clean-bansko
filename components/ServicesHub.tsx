'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Icon from '@/components/Icon'

type ServiceItem = {
  key: string
  slug: string
  icon: string
  name: string
  description: string
  items?: string[]
}

export default function ServicesHub({ covers = {} }: { covers?: Record<string, string> }) {
  const { t, lang } = useLanguage()
  const hub = t.servicesHub
  const services = t.services.items as ServiceItem[]
  const prefix = lang === 'en' ? '/en' : lang === 'ru' ? '/ru' : ''
  const ref = useScrollReveal()

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink-700" />
        <div
          className="absolute top-0 right-0 w-[60vw] h-[50vh] opacity-10"
          style={{ background: 'radial-gradient(ellipse at top right, var(--gold), transparent 70%)' }}
        />
      </div>

      <div className="relative z-10 max-w-6xl px-4 pt-32 pb-20 mx-auto sm:px-6 md:pt-36">
        <div className="max-w-2xl mb-14">
          <div className="section-badge">{hub.badge}</div>
          <h1 className="mt-4 mb-5 text-4xl font-bold tracking-tight uppercase font-display sm:text-5xl text-cream">
            {hub.title}
          </h1>
          <p className="text-base leading-relaxed text-cream/60">{hub.intro}</p>
        </div>

        <div ref={ref} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => {
            const cover = covers[service.key]
            const wide = i === 0

            return (
              <Link
                key={service.slug}
                href={`${prefix}/services/${service.slug}`}
                className={`reveal card-dark group relative overflow-hidden flex flex-col ${wide ? 'lg:col-span-2' : ''}`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                {cover && (
                  <div className="relative overflow-hidden aspect-video bg-ink-600">
                    <Image
                      src={cover}
                      alt={service.name}
                      fill
                      sizes={wide ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 100vw, 33vw'}
                      loading="lazy"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-700 via-ink-700/20 to-transparent" />
                  </div>
                )}

                <div className="flex flex-col flex-1 p-6">
                  {!cover && <Icon name={service.icon} className="w-8 h-8 mb-4 text-gold" />}

                  <h2 className="mb-2 text-xl tracking-wide uppercase transition-colors duration-300 font-display text-cream group-hover:text-gold">
                    {service.name}
                  </h2>

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
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
