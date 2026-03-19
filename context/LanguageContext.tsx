'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import bg from '@/content/bg.json'
import en from '@/content/en.json'

type Lang = 'bg' | 'en'
type Translations = typeof bg

const translations: Record<Lang, Translations> = { bg, en }

interface LanguageContextType {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'bg',
  t: bg,
  setLang: () => {},
  toggle: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bg')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('wetdry_lang') as Lang
      if (saved === 'bg' || saved === 'en') setLangState(saved)
    } catch {}
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try { localStorage.setItem('wetdry_lang', l) } catch {}
  }

  const toggle = () => setLang(lang === 'bg' ? 'en' : 'bg')

  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ lang: 'bg', t: bg, setLang, toggle }}>
        {children}
      </LanguageContext.Provider>
    )
  }

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
