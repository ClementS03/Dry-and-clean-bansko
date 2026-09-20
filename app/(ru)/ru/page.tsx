import { LanguageProvider } from "@/context/LanguageContext";
import { getGalleryPairs, getGalleryCover } from "@/lib/gallery";
import content from "@/content/ru.json";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowWeWork from "@/components/HowWeWork";
import BeforeAfter from "@/components/BeforeAfter";
import WhyUs from "@/components/WhyUs";
import ForRentals from "@/components/ForRentals";
import Quote from "@/components/Quote";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

export default function Home() {
  // Les photos sont lues au build depuis public/gallery/<slug>/
  const pairs = getGalleryPairs("home");
  const covers = Object.fromEntries(
    content.services.items
      .map((service) => [service.key, getGalleryCover(service.slug)])
      .filter(([, cover]) => cover),
  ) as Record<string, string>;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <LanguageProvider initialLang="ru">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main>
        <Hero />
        <Services covers={covers} />
        <HowWeWork />
        <BeforeAfter pairs={pairs} />
        <WhyUs />
        <ForRentals />
        <Quote />
        <Reviews />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
  );
}
