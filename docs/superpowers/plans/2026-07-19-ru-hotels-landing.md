# Wet&Dry Bansko — RU + /hotels + fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Russian as 3rd language, create /hotels B2B landing page (BG/EN/RU), fix copy issues, add footer extras, update SEO metadata and sitemap.

**Architecture:** New route group `app/(ru)/` following the exact same pattern as `app/(en)/`. Each language gets a dedicated URL (`/ru`, `/en`, `/`) with its own layout for correct SSR `<html lang>` and hreflang. Hotels pages live under each group's sub-route (`/hotels`, `/en/hotels`, `/ru/hotels`). Navbar becomes a 3-option dropdown (hover on desktop, click on mobile).

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, LanguageContext (client-side JSON switching)

## Global Constraints

- Branch: `feature/ru-hotels-landing` — NO push to main, user merges
- All visible text via JSON files (`content/bg.json`, `content/en.json`, `content/ru.json`) — never hardcode
- Design tokens from `config/design.js` only — no inline hex colors or font names
- Russian tone: vouvoiement (Вы), professional yet warm, B2C and B2B register
- Mark AI-generated RU copy that needs native review with `// TODO-REVIEW`
- 6 cards in WhyUs grid — always exactly 6
- No 💯 emoji anywhere in copy or components
- No "Payment accepted in EUR and BGN" anywhere
- `btn-gold` always inside a `<div>` wrapper for show/hide — never apply `hidden`/`lg:hidden` directly on it
- Lighthouse mobile >= 90 — no new heavy assets

---

## File Map

**New files:**
- `content/ru.json`
- `app/(ru)/layout.tsx`
- `app/(ru)/ru/page.tsx`
- `app/(ru)/ru/hotels/page.tsx`
- `app/(bg)/hotels/page.tsx`
- `app/(en)/en/hotels/page.tsx`
- `components/hotels/HotelsHero.tsx`
- `components/hotels/HotelsForWho.tsx`
- `components/hotels/HotelsPricing.tsx`
- `components/hotels/HotelsHowItWorks.tsx`
- `components/hotels/HotelsReassurance.tsx`
- `components/hotels/HotelsSocialProof.tsx`
- `components/hotels/HotelsFAQ.tsx`
- `components/hotels/HotelsCTA.tsx`

**Modified files:**
- `context/LanguageContext.tsx`
- `components/Navbar.tsx`
- `components/WhyUs.tsx`
- `components/ForRentals.tsx`
- `components/Footer.tsx`
- `content/bg.json`
- `content/en.json`
- `app/(bg)/layout.tsx`
- `app/(en)/layout.tsx`
- `public/sitemap.xml`

---

### Task 1: Fix copy issues

**Files:** `content/bg.json`, `content/en.json`, `components/WhyUs.tsx`

- [ ] Fix `pricing.note` in bg.json: remove "EUR и BGN" reference → `"* Плащането е дължимо след услугата."`
- [ ] Fix `pricing.note` in en.json: `"* Payment is due after the service is completed."`
- [ ] Fix `whyUs.items[1]` in bg.json: icon `"🛡️"`, title `"Застрахователна отговорност"`, description `"Работим с пълна застраховка за наша сметка. Спокойствие за вас и вашия имот."`
- [ ] Fix `whyUs.items[1]` in en.json: icon `"🛡️"`, title `"Fully insured"`, description `"We carry professional liability insurance — any incident is covered at our cost. Full peace of mind for you."`
- [ ] Fix `rentals.items` in en.json: change the `"Results or no charge"` card → icon `"🛡️"`, title `"Fully insured"`, description `"Our professional liability insurance covers any incident — at our cost."`
- [ ] Fix `trust[3]` in en.json if `"label": "Results or no charge"` → `"Fully insured"`; same in bg.json if present
- [ ] Remove guarantee callout block from WhyUs.tsx (lines 53-63: the `<div className="reveal mt-14 bg-gold/5 ...">` block)
- [ ] Run `npm run build` — expect success
- [ ] Commit: `fix: remove EUR/BGN note, replace guarantee card with insurance, drop duplicate callout`

---

### Task 2: Update LanguageContext for 3 languages

**Files:** `context/LanguageContext.tsx`, `content/ru.json` (stub)

- [ ] Copy `content/en.json` to `content/ru.json` as stub (valid JSON, translated in Task 3)
- [ ] Update `LanguageContext.tsx`:
  - `type Lang = 'bg' | 'en' | 'ru'`
  - Import `ru from '@/content/ru.json'`
  - Add `ru` to `translations` record
  - localStorage guard: accept `'ru'` as valid saved lang
  - Remove `toggle()` (replaced by `setLang` in Navbar)
- [ ] Run `npm run build` — expect success
- [ ] Commit: `feat(i18n): add Russian to LanguageContext, ru.json stub`

Full replacement for `context/LanguageContext.tsx`:
```tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import bg from '@/content/bg.json'
import en from '@/content/en.json'
import ru from '@/content/ru.json'

type Lang = 'bg' | 'en' | 'ru'
type Translations = typeof bg

const translations: Record<Lang, Translations> = { bg, en, ru }

interface LanguageContextType {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'bg',
  t: bg,
  setLang: () => {},
})

export function LanguageProvider({
  children,
  initialLang = 'bg',
}: {
  children: ReactNode
  initialLang?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.documentElement.lang = initialLang
    if (initialLang === 'bg') {
      try {
        const saved = localStorage.getItem('wetdry_lang') as Lang
        if (saved === 'bg' || saved === 'en' || saved === 'ru') {
          setLangState(saved)
          document.documentElement.lang = saved
        }
      } catch {}
    }
  }, [initialLang])

  const setLang = (l: Lang) => {
    setLangState(l)
    document.documentElement.lang = l
    try { localStorage.setItem('wetdry_lang', l) } catch {}
  }

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: initialLang, t: translations[initialLang], setLang }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
```

---

### Task 3: Translate content/ru.json (full)

**Files:** `content/ru.json`

Replace the en.json stub with full Russian translation. Key strings (Вы form, pro-warm tone):

**nav:**
```json
{ "services": "Услуги", "technology": "Технология", "prices": "Цены", "faq": "Вопросы", "contact": "Контакт", "cta": "Бесплатная оценка", "langSwitch": "RU" }
```

**hero.badge:** `"📍 Банско · Разлог · Добриниште · Баня"`
**hero.title:** `"Диваны, матрасы,"`
**hero.titleHighlight:** `"чистые как новые."`
**hero.subtitle:** `"Чистим диваны, матрасы, ковры, шторы и автомобильные сиденья у вас дома в Банско и окрестностях — без транспортировки, без хлопот."`

**hero.form microcopies:**
```json
{
  "title": "Получить бесплатную оценку",
  "subtitle": "Ответим в течение 24 часов",
  "step1Title": "Что нужно почистить?",
  "step2Title": "Ваши данные",
  "serviceLabel": "Вид услуги",
  "services": [
    { "value": "sofa", "label": "🛋️ Диван / Кресло" },
    { "value": "mattress", "label": "🛏️ Матрас" },
    { "value": "carpet", "label": "🏠 Ковёр / Палас" },
    { "value": "curtains", "label": "🪟 Шторы" },
    { "value": "car", "label": "🚗 Автосиденья" },
    { "value": "other", "label": "➕ Другое" }
  ],
  "quantityLabel": "Количество / Размер (необязательно)",
  "quantityPlaceholder": "напр. 1 трёхместный диван, 2 матраса...",
  "nameLabel": "Ваше имя",
  "namePlaceholder": "Иван Иванов",
  "phoneLabel": "Телефон / WhatsApp *",
  "phonePlaceholder": "+359 8XX XXX XXX",
  "locationLabel": "Адрес *",
  "locationPlaceholder": "Банско, Разлог, Добриниште...",
  "nextBtn": "Далее →",
  "backBtn": "← Назад",
  "submitBtn": "Отправить через WhatsApp →",
  "disclaimer": "Без обязательств. Ответ в WhatsApp в течение 24 часов.",
  "successTitle": "✓ Запрос отправлен!",
  "successText": "Мы свяжемся с вами в WhatsApp в течение 24 часов.",
  "validationPhone": "Пожалуйста, укажите номер телефона",
  "validationLocation": "Пожалуйста, укажите ваш адрес",
  "newRequest": "Новый запрос",
  "orLabel": "или",
  "emailBtn": "Отправить по email",
  "sendingLabel": "Отправка...",
  "disclaimerEmail": "Без обязательств. Мы свяжемся с вами по телефону.",
  "successTextEmail": "Мы получили ваш запрос. Свяжемся с вами в ближайшее время.",
  "emailErrorMsg": "Ошибка отправки. Пожалуйста, попробуйте снова.",
  "selectedLabel": "выбрано",
  "selectedLabelPlural": "выбрано"
}
```
// TODO-REVIEW form microcopies

**trust:**
```json
[
  { "icon": "🏠", "label": "Приедем к вам" },
  { "icon": "⏱️", "label": "Сохнет 2–4 часа" },
  { "icon": "🌿", "label": "Безопасные средства" },
  { "icon": "🛡️", "label": "Застрахованы профессионально" }
]
```

**whyUs** (must match updated structure — items[1] = insurance):
```json
{
  "title": "Почему выбирают нас",
  "items": [
    { "icon": "🚐", "title": "Приедем к вам", "description": "Не нужно ничего везти. Мы приезжаем со всем оборудованием — домой, в отель или офис." },
    { "icon": "🛡️", "title": "Профессиональная страховка", "description": "Работаем с полной страховкой ответственности — любой инцидент покрыт за наш счёт." },
    { "icon": "⚡", "title": "Быстро и удобно", "description": "Чистка занимает 1–3 часа. Мебель готова к использованию через 2–4 часа." },
    { "icon": "🌿", "title": "Безопасно для семьи", "description": "Сертифицированные средства. Безопасно для детей, младенцев и домашних животных." },
    { "icon": "📍", "title": "Местный & доступный", "description": "Банско, Разлог, Добриниште и вся Банско-Разложская котловина — мы знаем регион." },
    { "icon": "💬", "title": "Ответ в течение 24 часов", "description": "Напишите нам в WhatsApp и получите ответ и предложение в течение 24 часов." }
  ]
}
```

**pricing:**
```json
{
  "badge": "Прозрачные цены",
  "title": "Прайс-лист",
  "subtitle": "Без скрытых платежей. Итоговая цена зависит от размера и степени загрязнения.",
  "items": [
    { "icon": "🛋️", "name": "Диван / Кресло", "price": "от 25€", "note": "по размеру" },
    { "icon": "🛏️", "name": "Матрас", "price": "от 20€", "note": "одно / двуспальный" },
    { "icon": "🏠", "name": "Ковёр / Палас", "price": "от 4€/м²", "note": "минимум 20€" },
    { "icon": "🪟", "name": "Шторы", "price": "от 15€", "note": "за комплект" },
    { "icon": "🚗", "name": "Автосиденья", "price": "от 25€", "note": "полный салон" }
  ],
  "cta": "Получить персональную оценку",
  "note": "* Оплата производится после оказания услуги."
}
```

**contact:**
```json
{
  "badge": "Контакт",
  "title": "Свяжитесь с нами",
  "subtitle": "Ответим в течение 24 часов",
  "phoneEN": "+359 882 862 228",
  "phoneBG": "+359 876 850 385",
  "whatsappNumber": "359876850385",
  "email": "wetdrycleanbansko@gmail.com",
  "reviewUrl": "https://g.page/r/CU4pAGZ9UMLpEBM/review",
  "reviewCta": "Оставить отзыв в Google"
}
```

**rentals** (teaser — 3 items only):
```json
{
  "badge": "Для бизнеса",
  "title": "Для отелей,",
  "titleHighlight": "апартаментов и ресторанов",
  "subtitle": "Профессиональная чистка мебели для сферы гостеприимства в Банско.",
  "items": [
    { "icon": "📅", "title": "График под гостей", "description": "Работаем ночью, рано утром или между выездом и заездом — без ущерба для бизнеса." },
    { "icon": "🧾", "title": "Ежемесячные договоры", "description": "Фиксированная стоимость, счёт-фактура, приоритетное обслуживание." },
    { "icon": "🛡️", "title": "Профессиональная страховка", "description": "Работаем со страховкой ответственности за наш счёт." }
  ],
  "cta": "Запросить корпоративное предложение",
  "trust": "Обслуживаем отели, виллы и апартаменты в Банско, Разлоге, Добриниште и Бане",
  "whatsappMsg": "Здравствуйте! Хотел бы получить корпоративное предложение для отеля / апартаментов.",
  "hotelsLink": "Условия для отелей →"
}
```
// TODO-REVIEW all rentals copy

**hotels key:** (full RU translation — see Task 8 for structure)
// TODO-REVIEW entire hotels section

All other sections (services, technology, comparison, faq, footer, simulator, beforeAfter): translate 1:1 from en.json following same JSON structure. Mark uncertain idioms with // TODO-REVIEW inline comments in the file if needed, or list them separately.

- [ ] Write full ru.json with all keys translated
- [ ] Run `node -e "require('./content/ru.json')" && echo "valid"` — expect "valid"
- [ ] Run `npm run build` — expect success
- [ ] Commit: `feat(i18n): complete ru.json translation (TODO-REVIEW markers for native check)`

---

### Task 4: Create RU route group + update hreflang

**Files:** `app/(ru)/layout.tsx`, `app/(ru)/ru/page.tsx`, `app/(bg)/layout.tsx`, `app/(en)/layout.tsx`

`app/(ru)/layout.tsx` — copy `app/(en)/layout.tsx`, adapt:
- Change all EN strings to RU equivalents
- `lang="ru"`, `locale: "ru_RU"`
- `canonical: "/ru"`, `languages: { "bg-BG": "/", "en": "/en", "ru": "/ru", "x-default": "/" }`
- Cache key: `["reviews-schema-ru"]`
- `currenciesAccepted: "EUR"` (not BGN)
- FAQ schema uses `ruContent.faq.items`

`app/(ru)/ru/page.tsx` — exact copy of `app/(bg)/page.tsx` with `initialLang="ru"`, function renamed `HomeRU`.

`app/(bg)/layout.tsx` updates:
- `alternates.languages`: add `"ru": "/ru"`
- `currenciesAccepted: "EUR"` (remove BGN)

`app/(en)/layout.tsx` updates:
- `alternates.languages`: add `"ru": "/ru"`
- `currenciesAccepted: "EUR"` (remove BGN)

- [ ] Create `app/(ru)/layout.tsx`
- [ ] Create `app/(ru)/ru/page.tsx`
- [ ] Update BG layout hreflang + currenciesAccepted
- [ ] Update EN layout hreflang + currenciesAccepted
- [ ] Run `npm run build` — verify `/`, `/en`, `/ru` all build
- [ ] Commit: `feat(i18n): add /ru route group, update hreflang on all layouts`

---

### Task 5: Update Navbar — 3-lang dropdown

**Files:** `components/Navbar.tsx`

Remove `switchLang` function and single lang button. Add state `const [langOpen, setLangOpen] = useState(false)`.

Language config:
```tsx
const langs = [
  { code: 'bg' as const, label: 'БГ', path: '/' },
  { code: 'en' as const, label: 'EN', path: '/en' },
  { code: 'ru' as const, label: 'RU', path: '/ru' },
]
```

Desktop (inside `<div className="flex items-center gap-3">`):
```tsx
{/* Desktop lang dropdown — hover to open */}
<div
  className="relative hidden md:block"
  onMouseEnter={() => setLangOpen(true)}
  onMouseLeave={() => setLangOpen(false)}
>
  <button
    className="font-display text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1 rounded-sm hover:bg-gold/10 transition-colors duration-200"
    aria-haspopup="listbox"
    aria-expanded={langOpen}
  >
    {langs.find(l => l.code === lang)?.label ?? 'БГ'} ▾
  </button>
  {langOpen && (
    <div className="absolute right-0 top-full mt-1 bg-ink-800 border border-gold/20 rounded-sm shadow-lg shadow-black/50 py-1 min-w-[56px] z-50">
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => { setLangOpen(false); router.push(l.path) }}
          className={`block w-full text-left px-3 py-1.5 text-xs font-display font-semibold uppercase tracking-widest transition-colors ${l.code === lang ? 'text-gold' : 'text-cream/50 hover:text-gold'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )}
</div>

{/* Mobile lang dropdown — click to toggle */}
<div className="relative md:hidden">
  <button
    onClick={() => setLangOpen(v => !v)}
    className="font-display text-xs font-semibold uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1 rounded-sm hover:bg-gold/10 transition-colors duration-200"
    aria-haspopup="listbox"
    aria-expanded={langOpen}
  >
    {langs.find(l => l.code === lang)?.label ?? 'БГ'} ▾
  </button>
  {langOpen && (
    <div className="absolute right-0 top-full mt-1 bg-ink-800 border border-gold/20 rounded-sm shadow-lg shadow-black/50 py-1 min-w-[56px] z-50">
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => { setLangOpen(false); router.push(l.path) }}
          className={`block w-full text-left px-3 py-1.5 text-xs font-display font-semibold uppercase tracking-widest transition-colors ${l.code === lang ? 'text-gold' : 'text-cream/50 hover:text-gold'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  )}
</div>
```

Also add `const { lang } = useLanguage()` (was only `t` before).

- [ ] Update Navbar.tsx with dropdown replacing old single toggle
- [ ] Run `npm run build`
- [ ] Commit: `feat(navbar): 3-lang dropdown (hover desktop / click mobile)`

---

### Task 6: ForRentals — teaser mode

**Files:** `components/ForRentals.tsx`, `content/bg.json`, `content/en.json`, `content/ru.json`

- [ ] Add `rentals.hotelsLink` to bg.json: `"Вижте нашите условия за хотели →"`
- [ ] Add `rentals.hotelsLink` to en.json: `"See our hotel conditions →"`
- [ ] Add `rentals.hotelsLink` to ru.json: `"Условия для отелей →"`

Update ForRentals.tsx:
- Add `const { lang } = useLanguage()`
- `const hotelsPath = lang === 'en' ? '/en/hotels' : lang === 'ru' ? '/ru/hotels' : '/hotels'`
- Limit items: `r.items.slice(0, 3).map(...)`
- Replace right-column `<LeadForm />` with a styled CTA card:
```tsx
<div className="reveal flex flex-col items-center justify-center h-full gap-6 p-8 card-dark text-center" style={{ transitionDelay: '150ms' }}>
  <div className="text-5xl">🏨</div>
  <p className="text-cream/60 text-sm leading-relaxed max-w-xs">{r.subtitle}</p>
  <a href={hotelsPath} className="btn-gold px-6 py-3 text-sm">
    {r.hotelsLink}
  </a>
</div>
```

- [ ] Update ForRentals.tsx
- [ ] Run `npm run build`
- [ ] Commit: `feat(rentals): teaser mode — 3 bullets + link to /hotels`

---

### Task 7: Hotels JSON content (all 3 langs)

**Files:** `content/bg.json`, `content/en.json`, `content/ru.json`

Add top-level `"hotels"` key with this structure to each JSON:
```
hotels.meta.title
hotels.meta.description
hotels.hero.badge / title / subtitle / cta / ctaWhatsappMsg
hotels.forWho.title / items[{icon, label}]
hotels.pricing.title / publicNote / publicLinkLabel / discount
hotels.pricing.monthly.title / range / factors[{icon, label}]
hotels.pricing.seasonal.title / description
hotels.pricing.restaurant.title / description / price
hotels.howItWorks.title / steps[{number, title, description}]
hotels.reassurance.title / items[{icon, title, description}]
hotels.socialProof.ratingLabel / referencesTitle / referencesEmpty
hotels.faq.title / items[{q, a}]
hotels.cta.label / whatsappMsg
```

BG values (verbatim):
- `hero.title`: `"Вашите гости забелязват чистотата."`
- `hero.cta`: `"Безплатен оглед и оферта на място"`
- `hero.ctaWhatsappMsg`: `"Здравейте! Искам безплатен оглед и оферта за хотел / обект под наем."`
- `pricing.monthly.range`: `"400 – 2 000 €/мес."`
- `pricing.restaurant.price`: `"По договаряне"`
- `reassurance.items[0].title`: `"Гаранция за резултат"` (guarantee lives here, not on main page)
- `cta.label`: `"Заявете безплатен оглед"`

EN values:
- `hero.title`: `"Your guests notice cleanliness."`
- `hero.cta`: `"Free on-site inspection & quote"`
- `pricing.monthly.range`: `"€400 – €2,000 / month"`
- `pricing.restaurant.price`: `"By agreement"`
- `cta.label`: `"Request a free on-site inspection"`

RU values: // TODO-REVIEW
- `hero.title`: `"Ваши гости замечают чистоту."`
- `hero.cta`: `"Бесплатный выезд и оценка на месте"`
- `pricing.monthly.range`: `"400 – 2 000 €/мес."`
- `pricing.restaurant.price`: `"По договорённости"`
- `cta.label`: `"Запросить бесплатный выезд"`

- [ ] Add hotels key to bg.json
- [ ] Add hotels key to en.json
- [ ] Add hotels key to ru.json
- [ ] Run `node -e "require('./content/bg.json')" && node -e "require('./content/en.json')" && node -e "require('./content/ru.json')" && echo "all valid"`
- [ ] Commit: `feat(hotels): add hotels JSON content in BG/EN/RU`

---

### Task 8: Hotels page components (8 files)

**Files:** `components/hotels/*.tsx`

All components: `'use client'`, `useLanguage()` for `t.hotels.*`, `useScrollReveal()` for `.reveal` animations.

**HotelsHero.tsx:**
```tsx
'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function HotelsHero() {
  const { t } = useLanguage()
  const h = t.hotels.hero
  const waUrl = `https://wa.me/${t.contact.whatsappNumber}?text=${encodeURIComponent(h.ctaWhatsappMsg)}`
  return (
    <section className="relative min-h-[60vh] flex items-center section-pad bg-ink overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(245,196,0,0.08), transparent 60%)' }} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="section-badge mb-6">{h.badge}</div>
        <h1 className="font-display text-5xl sm:text-6xl text-cream uppercase tracking-tight max-w-3xl">
          {h.title}
        </h1>
        <p className="text-cream/60 mt-6 text-lg max-w-xl leading-relaxed">{h.subtitle}</p>
        <div className="mt-10">
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className="btn-gold px-8 py-4 text-base">
            {h.cta} →
          </a>
        </div>
      </div>
    </section>
  )
}
```

**HotelsForWho.tsx:**
```tsx
'use client'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsForWho() {
  const { t } = useLanguage()
  const s = t.hotels.forWho
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink-800">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-cream uppercase tracking-tight mb-10 reveal">{s.title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {s.items.map((item, i) => (
            <div key={i} className="reveal flex flex-col items-center gap-3 p-6 card-dark text-center"
              style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="text-4xl">{item.icon}</div>
              <div className="font-display text-sm text-gold uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**HotelsPricing.tsx:**
```tsx
'use client'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsPricing() {
  const { t, lang } = useLanguage()
  const p = t.hotels.pricing
  const pricingAnchor = lang === 'en' ? '/en#pricing' : lang === 'ru' ? '/ru#pricing' : '/#pricing'
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-cream uppercase tracking-tight mb-10 reveal">{p.title}</h2>
        <div className="reveal p-5 card-dark flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="text-2xl">💶</div>
          <div>
            <p className="text-cream/70 text-sm">{p.publicNote}</p>
            <a href={pricingAnchor} className="text-gold text-sm hover:text-gold/80 transition-colors mt-1 inline-block">
              {p.publicLinkLabel}
            </a>
          </div>
        </div>
        <div className="reveal text-cream/50 text-sm mb-10 flex items-center gap-2">
          <span className="text-gold">✓</span> {p.discount}
        </div>
        <div className="reveal p-6 bg-gold/5 border border-gold/20 rounded-sm mb-6">
          <h3 className="font-display text-xl text-gold uppercase tracking-wide mb-2">{p.monthly.title}</h3>
          <div className="font-display text-3xl text-cream mb-4">{p.monthly.range}</div>
          <div className="flex flex-wrap gap-4">
            {p.monthly.factors.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-cream/60 text-sm">
                <span>{f.icon}</span> {f.label}
              </div>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="reveal p-5 card-dark">
            <h3 className="font-display text-base text-gold uppercase tracking-wide mb-2">{p.seasonal.title}</h3>
            <p className="text-cream/55 text-sm leading-relaxed">{p.seasonal.description}</p>
          </div>
          <div className="reveal p-5 card-dark">
            <h3 className="font-display text-base text-gold uppercase tracking-wide mb-2">{p.restaurant.title}</h3>
            <p className="text-cream/55 text-sm leading-relaxed">{p.restaurant.description}</p>
            <div className="mt-3 text-cream/40 text-xs">{p.restaurant.price}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**HotelsHowItWorks.tsx:**
```tsx
'use client'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsHowItWorks() {
  const { t } = useLanguage()
  const h = t.hotels.howItWorks
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink-800">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-cream uppercase tracking-tight mb-10 reveal">{h.title}</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {h.steps.map((step, i) => (
            <div key={i} className="reveal flex flex-col gap-4" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="font-display text-5xl text-gold/20 leading-none">{step.number}</div>
              <h3 className="font-display text-lg text-gold uppercase tracking-wide">{step.title}</h3>
              <p className="text-cream/55 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**HotelsReassurance.tsx:**
```tsx
'use client'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsReassurance() {
  const { t } = useLanguage()
  const r = t.hotels.reassurance
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl text-cream uppercase tracking-tight mb-10 reveal">{r.title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {r.items.map((item, i) => (
            <div key={i} className="reveal flex gap-4 items-start" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="flex-shrink-0 w-10 h-10 bg-gold/10 border border-gold/20 rounded-sm flex items-center justify-center text-xl">
                {item.icon}
              </div>
              <div>
                <h3 className="font-display text-sm text-gold uppercase tracking-wide mb-1">{item.title}</h3>
                <p className="text-cream/55 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**HotelsSocialProof.tsx:**
```tsx
'use client'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsSocialProof() {
  const { t } = useLanguage()
  const s = t.hotels.socialProof
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink-800">
      <div ref={ref} className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="reveal mb-10">
          <a
            href={t.contact.reviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-sm text-gold text-sm font-display uppercase tracking-wide hover:bg-gold/20 transition-colors"
          >
            ★ Google {s.ratingLabel}
          </a>
        </div>
        <div className="reveal">
          <h2 className="font-display text-2xl text-cream uppercase tracking-tight mb-6">{s.referencesTitle}</h2>
          <div className="p-8 border border-gold/10 border-dashed rounded-sm text-center">
            <p className="text-cream/30 text-sm">{s.referencesEmpty}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**HotelsFAQ.tsx:**
```tsx
'use client'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HotelsFAQ() {
  const { t } = useLanguage()
  const f = t.hotels.faq
  const [open, setOpen] = useState<number | null>(null)
  const ref = useScrollReveal()
  return (
    <section className="section-pad bg-ink">
      <div ref={ref} className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl text-cream uppercase tracking-tight mb-10 reveal">{f.title}</h2>
        <div className="space-y-2">
          {f.items.map((item, i) => (
            <div key={i} className="reveal border border-gold/10 rounded-sm overflow-hidden"
              style={{ transitionDelay: `${i * 60}ms` }}>
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-ink-800 hover:bg-ink-700 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span className="font-display text-sm text-cream uppercase tracking-wide">{item.q}</span>
                <span className={`text-gold transition-transform duration-200 flex-shrink-0 ${open === i ? 'rotate-180' : ''}`}>▾</span>
              </button>
              {open === i && (
                <div className="px-5 pb-4 pt-0 bg-ink-800 text-cream/60 text-sm leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**HotelsCTA.tsx:**
```tsx
'use client'
import { useLanguage } from '@/context/LanguageContext'

export default function HotelsCTA() {
  const { t } = useLanguage()
  const cta = t.hotels.cta
  const waUrl = `https://wa.me/${t.contact.whatsappNumber}?text=${encodeURIComponent(cta.whatsappMsg)}`
  return (
    <section className="section-pad bg-ink-800 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(245,196,0,0.06), transparent 60%)' }} />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="gold-divider w-16 mx-auto mb-8" />
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="btn-gold px-10 py-4 text-base">
          {cta.label} →
        </a>
      </div>
    </section>
  )
}
```

- [ ] Create all 8 component files in `components/hotels/`
- [ ] Run `npm run build`
- [ ] Commit: `feat(hotels): add 8 hotels section components`

---

### Task 9: Create hotels route pages (3 langs)

**Files:** `app/(bg)/hotels/page.tsx`, `app/(en)/en/hotels/page.tsx`, `app/(ru)/ru/hotels/page.tsx`

Each page exports `metadata` (overrides layout metadata for this specific route) and renders `LanguageProvider` + all hotels sections.

**`app/(bg)/hotels/page.tsx`:**
```tsx
import type { Metadata } from "next"
import { LanguageProvider } from "@/context/LanguageContext"
import Navbar from "@/components/Navbar"
import HotelsHero from "@/components/hotels/HotelsHero"
import HotelsForWho from "@/components/hotels/HotelsForWho"
import HotelsPricing from "@/components/hotels/HotelsPricing"
import HotelsHowItWorks from "@/components/hotels/HotelsHowItWorks"
import HotelsReassurance from "@/components/hotels/HotelsReassurance"
import HotelsSocialProof from "@/components/hotels/HotelsSocialProof"
import HotelsFAQ from "@/components/hotels/HotelsFAQ"
import HotelsCTA from "@/components/hotels/HotelsCTA"
import Footer from "@/components/Footer"
import WhatsAppFAB from "@/components/WhatsAppFAB"

export const metadata: Metadata = {
  title: "Почистване за хотели Банско",
  description: "Професионална пране на мебели за хотели, гестхаузове и Airbnb в Банско. Безплатен оглед на място. Месечни договори от 400€.",
  alternates: {
    canonical: "/hotels",
    languages: { "bg-BG": "/hotels", "en": "/en/hotels", "ru": "/ru/hotels", "x-default": "/hotels" },
  },
}

export default function HotelsBG() {
  return (
    <LanguageProvider initialLang="bg">
      <Navbar />
      <main>
        <HotelsHero />
        <HotelsForWho />
        <HotelsPricing />
        <HotelsHowItWorks />
        <HotelsReassurance />
        <HotelsSocialProof />
        <HotelsFAQ />
        <HotelsCTA />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
  )
}
```

**`app/(en)/en/hotels/page.tsx`:** same, `initialLang="en"`, metadata in English:
```ts
export const metadata: Metadata = {
  title: "Hotel Cleaning Bansko",
  description: "Professional furniture cleaning for hotels, guesthouses and Airbnb in Bansko. Free on-site inspection. Monthly contracts from €400.",
  alternates: { canonical: "/en/hotels", languages: { "bg-BG": "/hotels", "en": "/en/hotels", "ru": "/ru/hotels", "x-default": "/hotels" } },
}
```

**`app/(ru)/ru/hotels/page.tsx`:** same, `initialLang="ru"`, metadata in Russian:
```ts
export const metadata: Metadata = {
  title: "Чистка для отелей Банско",
  description: "Профессиональная чистка мебели для отелей, гостевых домов и Airbnb в Банско. Бесплатный выезд на осмотр. Ежемесячные договоры от 400€.",
  alternates: { canonical: "/ru/hotels", languages: { "bg-BG": "/hotels", "en": "/en/hotels", "ru": "/ru/hotels", "x-default": "/hotels" } },
}
```

- [ ] Create 3 hotels page files
- [ ] Run `npm run build` — verify routes `/hotels`, `/en/hotels`, `/ru/hotels` appear
- [ ] Commit: `feat(hotels): add hotels page routes for BG/EN/RU`

---

### Task 10: Footer extras block

**Files:** `content/bg.json`, `content/en.json`, `content/ru.json`, `components/Footer.tsx`

Add to each JSON under `footer`:
- BG: `"extrasTitle": "Допълнителни услуги"`, `"extras": ["Оптимизация на Google Бизнес профил", "NFC стойки за отзиви", "Фото/видео заснемане"]`
- EN: `"extrasTitle": "Additional services"`, `"extras": ["Google Business Profile optimisation", "NFC review stands", "Photo/video production"]`
- RU: `"extrasTitle": "Дополнительные услуги"`, `"extras": ["Оптимизация профиля Google Бизнес", "NFC-стойки для отзывов", "Фото/видео-съёмка"]`

In Footer.tsx, add a 4th column in the flex row (or a compact block below on mobile). Insert before the divider:
```tsx
{f.extras && (
  <div className="text-center md:text-right">
    <div className="text-xs uppercase tracking-widest font-display text-cream/30 mb-2">{f.extrasTitle}</div>
    {f.extras.map((e: string, i: number) => (
      <div key={i} className="text-xs text-cream/20 leading-relaxed">{e}</div>
    ))}
  </div>
)}
```

Note: TypeScript will require adding `extrasTitle?: string; extras?: string[]` to the JSON-inferred type — this happens automatically since ru.json has the same structure.

- [ ] Update 3 JSON files with extras
- [ ] Update Footer.tsx
- [ ] Run `npm run build`
- [ ] Commit: `feat(footer): add extras block (Google Biz, NFC, Photo/video)`

---

### Task 11: Update sitemap.xml

**Files:** `public/sitemap.xml`

Replace full content with 6 URLs (3 home + 3 hotels), each with 3-lang hreflang crosslinks:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

  <url>
    <loc>https://wetdrycleaningbansko.com/</loc>
    <xhtml:link rel="alternate" hreflang="bg-BG" href="https://wetdrycleaningbansko.com/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://wetdrycleaningbansko.com/en"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://wetdrycleaningbansko.com/ru"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://wetdrycleaningbansko.com/"/>
    <lastmod>2026-07-19</lastmod><changefreq>weekly</changefreq><priority>1.0</priority>
  </url>

  <url>
    <loc>https://wetdrycleaningbansko.com/en</loc>
    <xhtml:link rel="alternate" hreflang="bg-BG" href="https://wetdrycleaningbansko.com/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://wetdrycleaningbansko.com/en"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://wetdrycleaningbansko.com/ru"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://wetdrycleaningbansko.com/"/>
    <lastmod>2026-07-19</lastmod><changefreq>weekly</changefreq><priority>0.9</priority>
  </url>

  <url>
    <loc>https://wetdrycleaningbansko.com/ru</loc>
    <xhtml:link rel="alternate" hreflang="bg-BG" href="https://wetdrycleaningbansko.com/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://wetdrycleaningbansko.com/en"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://wetdrycleaningbansko.com/ru"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://wetdrycleaningbansko.com/"/>
    <lastmod>2026-07-19</lastmod><changefreq>weekly</changefreq><priority>0.9</priority>
  </url>

  <url>
    <loc>https://wetdrycleaningbansko.com/hotels</loc>
    <xhtml:link rel="alternate" hreflang="bg-BG" href="https://wetdrycleaningbansko.com/hotels"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://wetdrycleaningbansko.com/en/hotels"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://wetdrycleaningbansko.com/ru/hotels"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://wetdrycleaningbansko.com/hotels"/>
    <lastmod>2026-07-19</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>
  </url>

  <url>
    <loc>https://wetdrycleaningbansko.com/en/hotels</loc>
    <xhtml:link rel="alternate" hreflang="bg-BG" href="https://wetdrycleaningbansko.com/hotels"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://wetdrycleaningbansko.com/en/hotels"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://wetdrycleaningbansko.com/ru/hotels"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://wetdrycleaningbansko.com/hotels"/>
    <lastmod>2026-07-19</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>
  </url>

  <url>
    <loc>https://wetdrycleaningbansko.com/ru/hotels</loc>
    <xhtml:link rel="alternate" hreflang="bg-BG" href="https://wetdrycleaningbansko.com/hotels"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://wetdrycleaningbansko.com/en/hotels"/>
    <xhtml:link rel="alternate" hreflang="ru" href="https://wetdrycleaningbansko.com/ru/hotels"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://wetdrycleaningbansko.com/hotels"/>
    <lastmod>2026-07-19</lastmod><changefreq>monthly</changefreq><priority>0.8</priority>
  </url>

</urlset>
```

- [ ] Rewrite public/sitemap.xml
- [ ] Commit: `feat(seo): sitemap — add /ru home + hotels × 3 langs with full hreflang`

> **REMINDER after deploy:** Resubmit sitemap in Google Search Console → Sitemaps → `https://wetdrycleaningbansko.com/sitemap.xml`

---

### Task 12: Final verification

- [ ] `npm run build` — full clean build, all 6 routes visible in output
- [ ] `grep -r "💯" components/ app/` → 0 results
- [ ] `grep -r "EUR and BGN\|EUR и BGN" content/` → 0 results
- [ ] `grep -rn "TODO-REVIEW" content/ components/` → list for human review
- [ ] Final commit if any stray fixes: `chore: final pass before PR`

---

## TODO-REVIEW checklist (before go-live)

- [ ] `content/ru.json` — full native Russian speaker review (all sections)
- [ ] `content/ru.json hotels` — B2B copy register check
- [ ] WhatsApp pre-filled messages in RU — correct formal tone
- [ ] Navbar dropdown UX on real mobile device
- [ ] `/hotels` pages on mobile — spacing and CTA tap targets
