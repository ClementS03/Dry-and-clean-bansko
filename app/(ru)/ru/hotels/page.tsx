import type { Metadata } from "next"
import { LanguageProvider } from "@/context/LanguageContext"
import Navbar from "@/components/Navbar"
import HotelsHero from "@/components/hotels/HotelsHero"
import HotelsForWho from "@/components/hotels/HotelsForWho"
import HotelsPricing from "@/components/hotels/HotelsPricing"
import HotelsHowItWorks from "@/components/hotels/HotelsHowItWorks"
import HotelsReassurance from "@/components/hotels/HotelsReassurance"
import HotelsFAQ from "@/components/hotels/HotelsFAQ"
import HotelsCTA from "@/components/hotels/HotelsCTA"
import Footer from "@/components/Footer"
import WhatsAppFAB from "@/components/WhatsAppFAB"

export const metadata: Metadata = {
  title: "Чистка для отелей Банско",
  description: "Профессиональная чистка мебели для отелей, гостевых домов и Airbnb в Банско. Бесплатный выезд на осмотр. Ежемесячные договоры от 400€.",
  alternates: {
    canonical: "/ru/hotels",
    languages: {
      "bg-BG": "/hotels",
      "en": "/en/hotels",
      "ru": "/ru/hotels",
      "x-default": "/hotels",
    },
  },
}

export default function HotelsRU() {
  return (
    <LanguageProvider initialLang="ru">
      <Navbar />
      <main>
        <HotelsHero />
        <HotelsForWho />
        <HotelsPricing />
        <HotelsHowItWorks />
        <HotelsReassurance />
        <HotelsFAQ />
        <HotelsCTA />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
  )
}
