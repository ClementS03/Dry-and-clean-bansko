import type { Metadata } from "next"
import content from "@/content/bg.json"
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
  title: { absolute: "Почистване за бизнеса в Банско | Wet&Dry Cleaning" },
  description: "Професионално почистване за хотели, къщи за гости, апартаменти под наем, ресторанти и производствени обекти в Банско. Безплатен оглед на място и индивидуална оферта.",
  alternates: {
    canonical: "/business",
    languages: {
      "bg-BG": "/business",
      "en": "/en/business",
      "ru": "/ru/business",
      "x-default": "/business",
    },
  },
  openGraph: {
    url: "https://wetdrycleaningbansko.com/business",
    title: "Почистване за бизнеса в Банско | Wet&Dry Cleaning",
    images: [{ url: "/og-hotels-bg.jpg", width: 1200, height: 630, alt: "Wet&Dry Cleaning, почистване за хотели в Банско" }],
  },
  twitter: {
    card: "summary_large_image",
    title: content.hotels.meta.title,
    description: content.hotels.meta.description,
    images: ["/og-hotels-bg.jpg"],
  },
}

export default function HotelsBG() {
  return (
    <LanguageProvider initialLang="bg">
      <Navbar />
      <main>
        <HotelsHero />
        <HotelsForWho />
        <HotelsHowItWorks />
        <HotelsPricing />
        <HotelsReassurance />
        <HotelsSocialProof />
        <HotelsFAQ />
        <section id="business-devis" className="section-pad bg-ink">
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
