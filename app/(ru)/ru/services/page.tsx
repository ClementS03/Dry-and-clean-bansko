import type { Metadata } from "next";
import content from "@/content/ru.json";
import { getGalleryCover, getOgImage } from "@/lib/gallery";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import ServicesHub from "@/components/ServicesHub";
import Quote from "@/components/Quote";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const DOMAIN = "https://wetdrycleaningbansko.com";
// OG dediee si elle existe, sinon celle de la langue. Voir public/og/README.md
const OG_IMAGE = getOgImage("services") ?? "/og-image-ru.jpg";

export const metadata: Metadata = {
  title: { absolute: content.servicesHub.metaTitle },
  description: content.servicesHub.metaDescription,
  alternates: {
    canonical: "/ru/services",
    languages: {
      "bg-BG": "/services",
      en: "/en/services",
      ru: "/ru/services",
      "x-default": "/services",
    },
  },
  openGraph: {
    url: `${DOMAIN}/ru/services`,
    title: content.servicesHub.metaTitle,
    description: content.servicesHub.metaDescription,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: content.servicesHub.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: content.servicesHub.metaTitle,
    description: content.servicesHub.metaDescription,
    images: [OG_IMAGE],
  },
};

export default function ServicesIndex() {
  const covers = Object.fromEntries(
    content.services.items
      .map((service) => [service.key, getGalleryCover(service.slug)])
      .filter(([, cover]) => cover),
  ) as Record<string, string>;

  return (
    <LanguageProvider initialLang="ru">
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
