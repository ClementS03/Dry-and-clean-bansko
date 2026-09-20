'use client'
import { useId, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Step = 'step1' | 'step2' | 'success'

export default function HotelsLeadForm() {
  const uid = useId()
  const { t } = useLanguage()
  const f = t.hotels.form

  const [step, setStep] = useState<Step>('step1')
  const [type, setType] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [units, setUnits] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [establishment, setEstablishment] = useState('')
  const [sending, setSending] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [phoneError, setPhoneError] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  const toggleService = (val: string) =>
    setServices(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val])

  const reset = () => {
    setStep('step1'); setType(''); setServices([]); setUnits('')
    setName(''); setPhone(''); setEstablishment('')
  }

  const typeLabel = f.types.find(tp => tp.value === type)?.label ?? type
  const serviceLabels = services.map(s => f.services.find(x => x.value === s)?.label).filter(Boolean).join(', ')

  const waMessage = [
    f.waIntro,
    typeLabel && `🏨 ${typeLabel}`,
    establishment && `📍 ${establishment}`,
    serviceLabels && `🧹 ${serviceLabels}`,
    units && `📦 ${units}`,
    name && `👤 ${name}`,
    phone && `📞 ${phone}`,
  ].filter(Boolean).join('\n')

  const waUrl = `https://wa.me/${t.contact.whatsappNumber}?text=${encodeURIComponent(waMessage)}`
  // Sur desktop le lead part par l API, comme le formulaire de l accueil.
  // Le mailto precedent dependait d une messagerie configuree chez le visiteur.
  const handleEmail = async () => {
    if (!phone.trim()) {
      setPhoneError(true)
      return
    }
    setSending(true)
    setEmailError(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audience: 'business',
          frequency: '',
          service: serviceLabels,
          serviceKeys: services,
          quantity: units,
          establishment: [typeLabel, establishment].filter(Boolean).join(' - '),
          name,
          phone,
          location: '',
          _hp: honeypot,
        }),
      })
      if (res.ok) {
        setStep('success')
      } else {
        // La raison exacte reste dans la console, l utilisateur voit un
        // message neutre. 403 origine, 429 debit, 503 cle absente.
        console.error('[contact] envoi refuse, statut ' + res.status, await res.clone().text())
        setEmailError(true)
      }
    } catch {
      setEmailError(true)
    } finally {
      setSending(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="card-dark p-8 text-center space-y-3">
        <div className="font-display text-xl text-gold uppercase tracking-wide">{f.successTitle}</div>
        <p className="text-cream/60 text-sm">{f.successText}</p>
        <button onClick={reset} className="text-xs text-gold/60 hover:text-gold transition-colors underline">
          {f.newRequest}
        </button>
      </div>
    )
  }

  return (
    <div className="card-dark p-6 space-y-5">
      {step === 'step1' && (
        <>
          <h3 className="font-display text-lg text-cream uppercase tracking-wide">{f.step1Title}</h3>

          <div>
            <span id={`${uid}-type`} className="block text-xs text-cream/50 uppercase tracking-widest mb-2">{f.typeLabel}</span>
            <div role="group" aria-labelledby={`${uid}-type`} className="grid grid-cols-2 gap-2">
              {f.types.map(tp => (
                <button key={tp.value} onClick={() => setType(tp.value)} aria-pressed={type === tp.value}
                  className={`p-3 text-xs text-left rounded-sm border transition-colors font-body ${
                    type === tp.value
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-gold/20 text-cream/60 hover:border-gold/40 hover:text-cream/80'
                  }`}>
                  {tp.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span id={`${uid}-services`} className="block text-xs text-cream/50 uppercase tracking-widest mb-2">{f.servicesLabel}</span>
            <div role="group" aria-labelledby={`${uid}-services`} className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {f.services.map(sv => (
                <button key={sv.value} onClick={() => toggleService(sv.value)} aria-pressed={services.includes(sv.value)}
                  className={`p-3 text-xs text-left rounded-sm border transition-colors font-body ${
                    services.includes(sv.value)
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-gold/20 text-cream/60 hover:border-gold/40 hover:text-cream/80'
                  }`}>
                  {sv.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor={`${uid}-units`} className="block text-xs text-cream/50 uppercase tracking-widest mb-2">{f.unitsLabel}</label>
            <input suppressHydrationWarning id={`${uid}-units`} value={units} onChange={e => setUnits(e.target.value)}
              placeholder={f.unitsPlaceholder} className="input-dark w-full text-sm" />
          </div>

          <button onClick={() => setStep('step2')} disabled={!type}
            className={`btn-gold w-full justify-center py-3 text-sm ${!type ? 'opacity-40 cursor-not-allowed' : ''}`}>
            {f.nextBtn}
          </button>
        </>
      )}

      {step === 'step2' && (
        <>
          <button onClick={() => setStep('step1')}
            className="flex items-center gap-1.5 text-sm text-gold/70 hover:text-gold transition-colors font-display uppercase tracking-wide">
            {f.backBtn}
          </button>
          <h3 className="font-display text-lg text-cream uppercase tracking-wide">{f.step2Title}</h3>

          <div className="space-y-3">
            <div>
              <label htmlFor={`${uid}-name`} className="block text-xs text-cream/50 uppercase tracking-widest mb-1">{f.nameLabel}</label>
              <input suppressHydrationWarning id={`${uid}-name`} value={name} onChange={e => setName(e.target.value)}
                placeholder={f.namePlaceholder} className="input-dark w-full text-sm" />
            </div>
            <div>
              <label htmlFor={`${uid}-phone`} className="block text-xs text-cream/50 uppercase tracking-widest mb-1">{f.phoneLabel}</label>
              <input suppressHydrationWarning id={`${uid}-phone`} value={phone}
                aria-invalid={phoneError}
                aria-describedby={phoneError ? `${uid}-phone-error` : undefined}
                onChange={e => { setPhone(e.target.value); setPhoneError(false) }}
                placeholder={f.phonePlaceholder} className={`input-dark w-full text-sm ${phoneError ? 'border-red-500' : ''}`} />
              {phoneError && (
                <p id={`${uid}-phone-error`} role="alert" className="mt-1 text-xs text-red-400">
                  {t.hero.form.validationPhone}
                </p>
              )}
            </div>
            <div>
              <label htmlFor={`${uid}-establishment`} className="block text-xs text-cream/50 uppercase tracking-widest mb-1">{f.establishmentLabel}</label>
              <input suppressHydrationWarning id={`${uid}-establishment`} value={establishment} onChange={e => setEstablishment(e.target.value)}
                placeholder={f.establishmentPlaceholder} className="input-dark w-full text-sm" />
            </div>
          </div>

          <div className="lg:hidden space-y-2">
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              onClick={() => setStep('success')}
              className="btn-gold w-full justify-center py-3 text-sm">
              {f.submitBtn}
            </a>
            <p className="text-cream/55 text-xs text-center">{f.disclaimer}</p>
          </div>

          <div className="hidden lg:block space-y-2">
            <button onClick={handleEmail} disabled={sending}
              className="btn-gold w-full justify-center py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none">
              {sending ? <span className="animate-pulse">{t.hero.form.sendingLabel}</span> : f.emailBtn}
            </button>
            {emailError && (
              <p className="text-xs text-center text-red-400">{t.hero.form.emailErrorMsg}</p>
            )}
            <div className="text-xs text-center text-cream/55">
              {f.disclaimerEmail}
              <div className="mt-1.5">
                {t.hero.form.emailDirect}{' '}
                <a href={`mailto:${t.contact.email}`} className="transition-colors text-gold/80 hover:text-gold">
                  {t.contact.email}
                </a>
              </div>
            </div>
          </div>

          <input
            suppressHydrationWarning
            type="text"
            name="website"
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0 }}
          />
        </>
      )}
    </div>
  )
}
