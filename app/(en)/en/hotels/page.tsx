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
  title: "Hotel Cleaning Bansko",
  description: "Professional furniture cleaning for hotels, guesthouses and Airbnb in Bansko. Free on-site inspection. Monthly contracts from €400.",
  alternates: {
    canonical: "/en/hotels",
    languages: {
      "bg-BG": "/hotels",
      "en": "/en/hotels",
      "ru": "/ru/hotels",
      "x-default": "/hotels",
    },
  },
}

export default function HotelsEN() {
  return (
    <LanguageProvider initialLang="en">
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
