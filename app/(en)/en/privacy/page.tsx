import type { Metadata } from "next";
import content from "@/content/en.json";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import PrivacyPage from "@/components/PrivacyPage";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: { absolute: content.privacy.metaTitle },
  description: content.privacy.metaDescription,
  alternates: {
    canonical: "/en/privacy",
    languages: {
      "bg-BG": "/privacy",
      en: "/en/privacy",
      ru: "/ru/privacy",
      "x-default": "/en/privacy",
    },
  },
};

export default function Privacy() {
  return (
    <LanguageProvider initialLang="en">
      <Navbar />
      <main>
        <PrivacyPage />
      </main>
      <Footer />
    </LanguageProvider>
  );
}
