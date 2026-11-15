import type { Metadata } from "next";
import { notFound } from "next/navigation";
import content from "@/content/bg.json";
import { getGalleryPairs, getOgImage } from "@/lib/gallery";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import ServicePage from "@/components/ServicePage";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import { DOMAIN, serviceSchema } from "@/lib/schema";

const PREFIX = "";

const OG_FALLBACK = "/og-default-bg.jpg";

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

  // OG dediee si elle existe, sinon celle de la langue. Une photo brute
  // sans texte ni logo convertit moins bien qu une carte dessinee.
  // Voir public/og/README.md
  const image = getOgImage(slug, "bg") ?? OG_FALLBACK;

  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: {
      canonical: `${PREFIX}/services/${slug}`,
      languages: {
        "bg-BG": `/services/${slug}`,
        en: `/en/services/${slug}`,
        ru: `/ru/services/${slug}`,
        "x-default": `/en/services/${slug}`,
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

  const serviceLd = serviceSchema(service.name, page.metaDescription, `${DOMAIN}${PREFIX}/services/${slug}`);

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main>
        <ServicePage slug={slug} pairs={pairs} prefix={PREFIX} />
        <Contact preselect={service.key} />
      </main>
      <Footer />
      <WhatsAppFAB />
    </LanguageProvider>
  );
}
