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

  // L URL est la seule source de verite : / est bulgare, /en anglais,
  // /ru russe. Le selecteur de langue navigue, il ne bascule plus le
  // rendu cote client. L ancienne memorisation en localStorage affichait
  // la home bulgare en anglais a tout visiteur ayant clique EN une fois,
  // alors que Google avait indexe du bulgare sur cette URL.
  useEffect(() => {
    setMounted(true)
    document.documentElement.lang = initialLang
    try {
      localStorage.removeItem('wetdry_lang')
    } catch {}
  }, [initialLang])

  const setLang = (l: Lang) => {
    setLangState(l)
    document.documentElement.lang = l
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
