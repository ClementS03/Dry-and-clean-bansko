import type { Metadata } from "next";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Technology from "@/components/Technology";
import BeforeAfter from "@/components/BeforeAfter";
import Comparison from "@/components/Comparison";
import WhyUs from "@/components/WhyUs";
import ForRentals from "@/components/ForRentals";
import Pricing from "@/components/Pricing";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const DOMAIN = "https://wetdrycleaningbansko.com";

export const metadata: Metadata = {
  title: "Furniture Cleaning Bansko | Wet&Dry Cleaning",
  description:
    "Professional sofa, mattress, carpet & curtain cleaning in Bansko and surroundings. Injection-extraction technology. We come to you. From €20.",
  alternates: {
    canonical: "/en",
    languages: {
      "bg-BG": "/",
      "en": "/en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    url: `${DOMAIN}/en`,
    title: "Furniture Cleaning Bansko | Wet&Dry Cleaning",
    description:
      "Professional sofa, mattress & carpet cleaning in Bansko. Injection-extraction technology. We come to you. From €20.",
    siteName: "Wet&Dry Cleaning Bansko",
    locale: "en_GB",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wet&Dry Cleaning Bansko — furniture cleaning service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Furniture Cleaning Bansko | Wet&Dry Cleaning",
    description: "Professional on-site furniture cleaning in Bansko, Bulgaria.",
    images: ["/og-image.jpg"],
  },
};

const enBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  name: "Wet&Dry Cleaning Bansko",
  description:
    "Professional furniture cleaning with injection-extraction technology in Bansko and surroundings. We come to you — sofas, mattresses, carpets, curtains, car seats.",
  url: `${DOMAIN}/en`,
  telephone: ["+359882862228", "+359876850385"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Furniture cleaning services Bansko",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Sofa cleaning Bansko" }, price: "25", priceCurrency: "EUR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Mattress cleaning Bansko" }, price: "20", priceCurrency: "EUR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Carpet cleaning Bansko" }, price: "4", priceCurrency: "EUR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Curtain cleaning Bansko" }, price: "15", priceCurrency: "EUR" },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Car seat cleaning Bansko" }, price: "25", priceCurrency: "EUR" },
    ],
  },
};

export default function HomeEN() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(enBusinessSchema) }}
      />
    <LanguageProvider initialLang="en">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Technology />
        <BeforeAfter />
        <Comparison />
        <WhyUs />
        <ForRentals />
        <Pricing />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
    </>
  );
}
