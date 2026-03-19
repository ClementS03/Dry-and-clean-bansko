'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function Hero() {
  const { t } = useLanguage()
  const f = t.hero.form
  const whatsappNum = t.whatsapp.number

  const [step, setStep] = useState(1)
  const [sent, setSent] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [quantity, setQuantity] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate2 = () => {
    const e: Record<string, string> = {}
    if (!phone.trim()) e.phone = f.validationPhone
    if (!location.trim()) e.location = f.validationLocation
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate2()) return
    const svcLabel = f.services.find(s => s.value === selectedService)?.label || selectedService
    const msgParts = [
      `🛋️ *Запитване за пране на мебели*`,
      ``,
      `📋 Услуга: ${svcLabel}`,
      quantity ? `📐 Количество: ${quantity}` : null,
      name ? `👤 Иmе: ${name}` : null,
      `📞 Телефон: ${phone}`,
      `📍 Местоположение: ${location}`,
      ``,
      `_Изпратено от wetdrybg.com_`,
    ]
      .filter(Boolean)
      .join('\n')
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(msgParts)}`
    window.open(url, '_blank', 'noopener')
    setSent(true)
  }

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0">
        {/* Dark gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-800 to-ink-700" />
        {/* Gold radial glow */}
        <div
          className="absolute top-0 right-0 w-[60vw] h-[60vh] opacity-10"
          style={{ background: 'radial-gradient(ellipse at top right, #F5C400, transparent 70%)' }}
        />
        {/* Bottom subtle glow */}
        <div
          className="absolute bottom-0 left-0 w-[40vw] h-[40vh] opacity-5"
          style={{ background: 'radial-gradient(ellipse at bottom left, #F5C400, transparent 70%)' }}
        />
        {/* Diagonal line accent */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #F5C400 0, #F5C400 1px, transparent 0, transparent 50%)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-16 grid md:grid-cols-2 gap-12 items-center min-h-screen">
        {/* ── Left: copy ── */}
        <div className="animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {/* Badge */}
          <div className="section-badge mb-6">
            {t.hero.badge}
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold uppercase leading-none tracking-tight mb-4"
            style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            <span className="text-cream block">{t.hero.title}</span>
            <span className="text-gold-gradient block">{t.hero.titleHighlight}</span>
          </h1>

          <p className="text-cream/60 text-lg leading-relaxed mb-8 max-w-md">
            {t.hero.subtitle}
          </p>

          {/* Trust bullets */}
          <div className="grid grid-cols-2 gap-3">
            {t.trust.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-cream/70 font-medium">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Phone quick access */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={`tel:${t.contact.phoneEN.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors"
            >
              <span className="text-base">🇬🇧</span>
              <span>{t.contact.phoneEN}</span>
            </a>
            <a
              href={`tel:${t.contact.phoneBG.replace(/\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors"
            >
              <span className="text-base">🇧🇬</span>
              <span>{t.contact.phoneBG}</span>
            </a>
          </div>
        </div>

        {/* ── Right: form card ── */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: '0.25s', animationFillMode: 'both' }}
        >
          <div className="bg-ink-700 border border-gold/20 rounded-sm shadow-2xl shadow-black/60 overflow-hidden">
            {/* Form header */}
            <div className="bg-gold px-6 py-4">
              <div className="font-display text-ink text-xl font-bold uppercase tracking-wider">
                {f.title}
              </div>
              <div className="text-ink/70 text-sm mt-0.5">{f.subtitle}</div>
            </div>

            <div className="p-6">
              {sent ? (
                /* ── Success state ── */
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-display text-xl text-gold uppercase tracking-wide mb-2">
                    {f.successTitle}
                  </h3>
                  <p className="text-cream/60 text-sm">{f.successText}</p>
                  <button
                    onClick={() => { setSent(false); setStep(1); setSelectedService(''); setQuantity(''); setName(''); setPhone(''); setLocation('') }}
                    className="btn-outline mt-6 text-xs py-2 px-4"
                  >
                    ← {f.newRequest}
                  </button>
                </div>
              ) : step === 1 ? (
                /* ── Step 1: service selection ── */
                <div>
                  <p className="text-cream/50 text-xs uppercase tracking-widest font-semibold mb-4">
                    {f.step1Title}
                  </p>

                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {f.services.map(svc => (
                      <button
                        key={svc.value}
                        onClick={() => setSelectedService(svc.value)}
                        className={`text-left px-3 py-3 rounded-sm border text-sm transition-all duration-200 ${
                          selectedService === svc.value
                            ? 'border-gold bg-gold/10 text-gold font-medium'
                            : 'border-gold/15 bg-white/[0.03] text-cream/70 hover:border-gold/35 hover:text-cream'
                        }`}
                      >
                        {svc.label}
                      </button>
                    ))}
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">
                      {f.quantityLabel}
                    </label>
                    <input
                      type="text"
                      className="input-dark"
                      placeholder={f.quantityPlaceholder}
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedService}
                    className={`btn-gold w-full justify-center text-sm py-3 ${!selectedService ? 'opacity-40 cursor-not-allowed hover:bg-gold hover:transform-none hover:shadow-none' : ''}`}
                  >
                    {f.nextBtn}
                  </button>
                </div>
              ) : (
                /* ── Step 2: contact details ── */
                <div>
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-cream/70 mb-4 transition-colors"
                  >
                    ← {f.backBtn}
                  </button>
                  <p className="text-cream/50 text-xs uppercase tracking-widest font-semibold mb-4">
                    {f.step2Title}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">
                        {f.nameLabel}
                      </label>
                      <input
                        type="text"
                        className="input-dark"
                        placeholder={f.namePlaceholder}
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">
                        {f.phoneLabel}
                      </label>
                      <input
                        type="tel"
                        className={`input-dark ${errors.phone ? 'border-red-500' : ''}`}
                        placeholder={f.phonePlaceholder}
                        value={phone}
                        onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })) }}
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">
                        {f.locationLabel}
                      </label>
                      <input
                        type="text"
                        className={`input-dark ${errors.location ? 'border-red-500' : ''}`}
                        placeholder={f.locationPlaceholder}
                        value={location}
                        onChange={e => { setLocation(e.target.value); setErrors(p => ({ ...p, location: '' })) }}
                      />
                      {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    className="btn-gold w-full justify-center text-sm py-3 mt-5 animate-pulse-gold"
                  >
                    {f.submitBtn}
                  </button>
                  <p className="text-cream/30 text-xs text-center mt-3">{f.disclaimer}</p>
                </div>
              )}
            </div>

            {/* Step indicator */}
            {!sent && (
              <div className="flex border-t border-gold/10">
                {[1, 2].map(n => (
                  <div
                    key={n}
                    className={`flex-1 h-0.5 transition-colors duration-300 ${step >= n ? 'bg-gold' : 'bg-gold/15'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/30 animate-bounce">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
