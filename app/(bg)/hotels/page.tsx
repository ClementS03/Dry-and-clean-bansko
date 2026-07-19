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
  title: "Почистване за хотели Банско",
  description: "Професионално пране на мебели за хотели, гестхаузове и Airbnb в Банско. Безплатен оглед на място. Месечни договори от 400€.",
  alternates: {
    canonical: "/hotels",
    languages: {
      "bg-BG": "/hotels",
      "en": "/en/hotels",
      "ru": "/ru/hotels",
      "x-default": "/hotels",
    },
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
        <HotelsFAQ />
        <HotelsCTA />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
  )
}
