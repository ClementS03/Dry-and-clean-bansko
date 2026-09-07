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
  title: { absolute: "Cleaning for business in Bansko | Wet&Dry Cleaning" },
  description: "Professional cleaning for hotels, guesthouses, rental flats, restaurants and production sites in Bansko. Free on-site visit and an individual offer.",
  alternates: {
    canonical: "/en/business",
    languages: {
      "bg-BG": "/business",
      "en": "/en/business",
      "ru": "/ru/business",
      "x-default": "/business",
    },
  },
  openGraph: {
    url: "https://wetdrycleaningbansko.com/en/business",
    title: "Cleaning for business in Bansko | Wet&Dry Cleaning",
    images: [{ url: "/og-hotels.jpg", width: 1200, height: 630, alt: "Wet&Dry Cleaning, furniture cleaning for hotels in Bansko" }],
  },
  twitter: {
    images: ["/og-hotels.jpg"],
  },
}

export default function HotelsEN() {
  return (
    <LanguageProvider initialLang="en">
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
