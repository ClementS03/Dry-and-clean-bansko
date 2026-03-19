'use client'

import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

export default function LeadForm() {
  const { t } = useLanguage()
  const f = t.hero.form
  const whatsappNum = t.whatsapp.number

  const [step, setStep]               = useState(1)
  const [sent, setSent]               = useState(false)
  const [selectedService, setService] = useState('')
  const [quantity, setQuantity]       = useState('')
  const [name, setName]               = useState('')
  const [phone, setPhone]             = useState('')
  const [location, setLocation]       = useState('')
  const [errors, setErrors]           = useState<Record<string, string>>({})

  const validate2 = () => {
    const e: Record<string, string> = {}
    if (!phone.trim()) e.phone = f.validationPhone
    if (!location.trim()) e.location = f.validationLocation
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate2()) return
    const svcLabel = f.services.find(s => s.value === selectedService)?.label ?? selectedService
    const lines = [
      `🛋️ *${f.title}*`,
      '',
      `📋 ${f.serviceLabel}: ${svcLabel}`,
      quantity  ? `📐 ${f.quantityLabel}: ${quantity}` : null,
      name      ? `👤 ${f.nameLabel}: ${name}`         : null,
      `📞 ${f.phoneLabel}: ${phone}`,
      `📍 ${f.locationLabel}: ${location}`,
      '',
      `_wetdrybg.com_`,
    ].filter(Boolean).join('\n')

    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener')
    setSent(true)
  }

  const reset = () => {
    setSent(false); setStep(1); setService('')
    setQuantity(''); setName(''); setPhone(''); setLocation('')
  }

  return (
    <div className="bg-ink-700 border border-gold/20 rounded-sm shadow-2xl shadow-black/60 overflow-hidden">
      {/* Header bar */}
      <div className="bg-gold px-6 py-4">
        <div className="font-display text-ink text-xl font-bold uppercase tracking-wider">{f.title}</div>
        <div className="text-ink/70 text-sm mt-0.5">{f.subtitle}</div>
      </div>

      <div className="p-6">
        {sent ? (
          /* ── Success ── */
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-display text-xl text-gold uppercase tracking-wide mb-2">{f.successTitle}</h3>
            <p className="text-cream/60 text-sm">{f.successText}</p>
            <button onClick={reset} className="btn-outline mt-6 text-xs py-2 px-4">
              ← {f.newRequest}
            </button>
          </div>

        ) : step === 1 ? (
          /* ── Step 1: service ── */
          <div>
            <p className="text-cream/50 text-xs uppercase tracking-widest font-semibold mb-4">{f.step1Title}</p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {f.services.map(svc => (
                <button
                  key={svc.value}
                  onClick={() => setService(svc.value)}
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
              <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">{f.quantityLabel}</label>
              <input type="text" className="input-dark" placeholder={f.quantityPlaceholder} value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedService}
              className={`btn-gold w-full justify-center text-sm py-3 ${!selectedService ? 'opacity-40 cursor-not-allowed hover:bg-gold hover:translate-y-0 hover:shadow-none' : ''}`}
            >
              {f.nextBtn}
            </button>
          </div>

        ) : (
          /* ── Step 2: contact ── */
          <div>
            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-cream/70 mb-4 transition-colors">
              ← {f.backBtn}
            </button>
            <p className="text-cream/50 text-xs uppercase tracking-widest font-semibold mb-4">{f.step2Title}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">{f.nameLabel}</label>
                <input type="text" className="input-dark" placeholder={f.namePlaceholder} value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">{f.phoneLabel}</label>
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
                <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">{f.locationLabel}</label>
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

            <button onClick={handleSubmit} className="btn-gold w-full justify-center text-sm py-3 mt-5 animate-pulse-gold">
              {f.submitBtn}
            </button>
            <p className="text-cream/30 text-xs text-center mt-3">{f.disclaimer}</p>
          </div>
        )}
      </div>

      {/* Step progress bar */}
      {!sent && (
        <div className="flex border-t border-gold/10">
          {[1, 2].map(n => (
            <div key={n} className={`flex-1 h-0.5 transition-colors duration-300 ${step >= n ? 'bg-gold' : 'bg-gold/15'}`} />
          ))}
        </div>
      )}
    </div>
  )
}
