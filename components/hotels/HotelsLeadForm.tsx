'use client'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'

type Step = 'step1' | 'step2' | 'success'

export default function HotelsLeadForm() {
  const { t } = useLanguage()
  const f = t.hotels.form

  const [step, setStep] = useState<Step>('step1')
  const [type, setType] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [units, setUnits] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [establishment, setEstablishment] = useState('')

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
  const emailSubject = `B2B - ${typeLabel}${establishment ? ` - ${establishment}` : ''}`
  const emailUrl = `mailto:${t.contact.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(waMessage)}`

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
            <label className="block text-xs text-cream/50 uppercase tracking-widest mb-2">{f.typeLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {f.types.map(tp => (
                <button key={tp.value} onClick={() => setType(tp.value)}
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
            <label className="block text-xs text-cream/50 uppercase tracking-widest mb-2">{f.servicesLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              {f.services.map(sv => (
                <button key={sv.value} onClick={() => toggleService(sv.value)}
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
            <label className="block text-xs text-cream/50 uppercase tracking-widest mb-2">{f.unitsLabel}</label>
            <input value={units} onChange={e => setUnits(e.target.value)}
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
              <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1">{f.nameLabel}</label>
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder={f.namePlaceholder} className="input-dark w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1">{f.phoneLabel}</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                placeholder={f.phonePlaceholder} className="input-dark w-full text-sm" />
            </div>
            <div>
              <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1">{f.establishmentLabel}</label>
              <input value={establishment} onChange={e => setEstablishment(e.target.value)}
                placeholder={f.establishmentPlaceholder} className="input-dark w-full text-sm" />
            </div>
          </div>

          <div className="lg:hidden space-y-2">
            <a href={phone ? waUrl : undefined} target="_blank" rel="noopener noreferrer"
              onClick={() => phone && setStep('success')}
              className={`btn-gold w-full justify-center py-3 text-sm ${!phone ? 'opacity-40 pointer-events-none' : ''}`}>
              {f.submitBtn}
            </a>
            <p className="text-cream/55 text-xs text-center">{f.disclaimer}</p>
          </div>

          <div className="hidden lg:block space-y-2">
            <a href={phone ? emailUrl : undefined} onClick={() => phone && setStep('success')}
              className={`btn-gold w-full justify-center py-3 text-sm ${!phone ? 'opacity-40 pointer-events-none' : ''}`}>
              {f.emailBtn}
            </a>
            <p className="text-cream/55 text-xs text-center">{f.disclaimerEmail}</p>
          </div>
        </>
      )}
    </div>
  )
}
