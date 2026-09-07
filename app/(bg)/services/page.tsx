import type { Metadata } from "next";
import content from "@/content/bg.json";
import { getGalleryCover } from "@/lib/gallery";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import ServicesHub from "@/components/ServicesHub";
import Quote from "@/components/Quote";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const DOMAIN = "https://wetdrycleaningbansko.com";

export const metadata: Metadata = {
  title: { absolute: content.servicesHub.metaTitle },
  description: content.servicesHub.metaDescription,
  alternates: {
    canonical: "/services",
    languages: {
      "bg-BG": "/services",
      en: "/en/services",
      ru: "/ru/services",
      "x-default": "/services",
    },
  },
  openGraph: {
    url: `${DOMAIN}/services`,
    title: content.servicesHub.metaTitle,
    description: content.servicesHub.metaDescription,
  },
};

export default function ServicesIndex() {
  const covers = Object.fromEntries(
    content.services.items
      .map((service) => [service.key, getGalleryCover(service.slug)])
      .filter(([, cover]) => cover),
  ) as Record<string, string>;

  return (
    <LanguageProvider initialLang="bg">
      <Navbar />
      <main>
        <ServicesHub covers={covers} />
        <Quote />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
  );
}
