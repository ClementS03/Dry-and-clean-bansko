import type { Metadata } from "next";
import { notFound } from "next/navigation";
import content from "@/content/bg.json";
import { getGalleryPairs, getGalleryCover, getOgImage } from "@/lib/gallery";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import ServicePage from "@/components/ServicePage";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";

const DOMAIN = "https://wetdrycleaningbansko.com";
const PREFIX = "";

const OG_FALLBACK = "/og-image-bg.jpg";

type PageContent = {
  metaTitle: string;
  metaDescription: string;
  faq: { q: string; a: string }[];
};

const PAGES = content.servicePages as Record<string, PageContent>;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return content.services.items.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return {};

  // OG dediee, sinon photo du service, sinon OG de la langue.
  // Voir public/og/README.md
  const image = getOgImage(slug) ?? getGalleryCover(slug) ?? OG_FALLBACK;

  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: {
      canonical: `${PREFIX}/services/${slug}`,
      languages: {
        "bg-BG": `/services/${slug}`,
        en: `/en/services/${slug}`,
        ru: `/ru/services/${slug}`,
        "x-default": `/services/${slug}`,
      },
    },
    openGraph: {
      url: `${DOMAIN}${PREFIX}/services/${slug}`,
      title: page.metaTitle,
      description: page.metaDescription,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: page.metaTitle,
      description: page.metaDescription,
      images: [image],
    },
  };
}

export default async function ServiceRoute({ params }: Params) {
  const { slug } = await params;
  const service = content.services.items.find((item) => item.slug === slug);
  const page = PAGES[slug];
  if (!service || !page) notFound();

  // Les photos sont lues au build depuis public/gallery/<slug>/
  const pairs = getGalleryPairs(slug);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: page.metaDescription,
    url: `${DOMAIN}${PREFIX}/services/${slug}`,
    areaServed: [
      { "@type": "City", name: "Bansko" },
      { "@type": "City", name: "Razlog" },
      { "@type": "City", name: "Dobrinishte" },
      { "@type": "City", name: "Banya" },
    ],
    provider: {
      "@type": "LocalBusiness",
      name: "Wet&Dry Cleaning Bansko",
      url: DOMAIN,
      telephone: ["+359882862228", "+359876850385"],
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <LanguageProvider initialLang="bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main>
        <ServicePage slug={slug} pairs={pairs} prefix={PREFIX} />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
  );
}
