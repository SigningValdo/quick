"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import frTranslations from "./locales/fr.json"
import enTranslations from "./locales/en.json"

type Locale = "fr" | "en"
type Translations = typeof frTranslations

interface I18nContextType {
  locale: Locale
  t: (key: string, params?: Record<string, string | number>) => string
  changeLocale: (locale: Locale) => void
  locales: Locale[]
}

const translations: Record<Locale, Translations> = {
  fr: frTranslations,
  en: enTranslations,
}

const defaultLocale: Locale = "fr"

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const router = useRouter()
  const pathname = usePathname()

  // Initialiser la langue à partir du localStorage ou de la langue du navigateur
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale | null
    const browserLocale = navigator.language.split("-")[0] as Locale

    if (savedLocale && (savedLocale === "fr" || savedLocale === "en")) {
      setLocale(savedLocale)
    } else if (browserLocale === "fr" || browserLocale === "en") {
      setLocale(browserLocale)
      localStorage.setItem("locale", browserLocale)
    }
  }, [])

  // Fonction pour traduire une clé
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".")
    let value: any = translations[locale]

    // Parcourir l'arborescence des clés
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        console.warn(`Translation key not found: ${key}`)
        return key
      }
    }

    // Si la valeur n'est pas une chaîne, retourner la clé
    if (typeof value !== "string") {
      console.warn(`Translation value is not a string for key: ${key}`)
      return key
    }

    // Remplacer les paramètres
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
        return acc.replace(new RegExp(`{${paramKey}}`, "g"), String(paramValue))
      }, value)
    }

    return value
  }

  // Fonction pour changer la langue
  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("locale", newLocale)

    // Rediriger vers la même page avec la nouvelle langue
    // Note: Dans une implémentation réelle, vous pourriez vouloir changer l'URL
    // pour inclure la langue, par exemple /fr/page ou /en/page
  }

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale, locales: ["fr", "en"] }}>{children}</I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
