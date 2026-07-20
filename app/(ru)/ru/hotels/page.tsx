import type { Metadata } from "next"
import { LanguageProvider } from "@/context/LanguageContext"
import Navbar from "@/components/Navbar"
import HotelsHero from "@/components/hotels/HotelsHero"
import HotelsForWho from "@/components/hotels/HotelsForWho"
import HotelsPricing from "@/components/hotels/HotelsPricing"
import HotelsHowItWorks from "@/components/hotels/HotelsHowItWorks"
import HotelsLeadForm from "@/components/hotels/HotelsLeadForm"
import HotelsReassurance from "@/components/hotels/HotelsReassurance"
import HotelsSocialProof from "@/components/hotels/HotelsSocialProof"
import HotelsFAQ from "@/components/hotels/HotelsFAQ"
import HotelsCTA from "@/components/hotels/HotelsCTA"
import HotelsExtras from "@/components/hotels/HotelsExtras"
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
  openGraph: {
    url: "https://wetdrycleaningbansko.com/ru/hotels",
    title: "Чистка для отелей Банско",
    images: [{ url: "/og-hotels-ru.jpg", width: 1200, height: 630, alt: "Wet&Dry Cleaning — чистка мебели для отелей в Банско" }],
  },
  twitter: {
    images: ["/og-hotels-ru.jpg"],
  },
}

export default function HotelsRU() {
  return (
    <LanguageProvider initialLang="ru">
      <Navbar />
      <main>
        <HotelsHero />
        <HotelsForWho />
        <HotelsHowItWorks />
        <HotelsPricing />
        <HotelsReassurance />
        <HotelsSocialProof />
        <HotelsFAQ />
        <section id="hotels-devis" className="section-pad bg-ink">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <HotelsLeadForm />
          </div>
        </section>
        <HotelsCTA />
        <HotelsExtras />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
  )
}
