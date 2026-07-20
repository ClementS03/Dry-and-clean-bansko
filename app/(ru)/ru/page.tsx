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

export default function HomeRU() {
  return (
    <LanguageProvider initialLang="ru">
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
  );
}
