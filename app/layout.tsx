import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import bgContent from "@/content/bg.json";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { colors } = require("@/config/design");

const getReviewStats = unstable_cache(
  async () => {
    const token = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!token || !databaseId) return null;
    try {
      const notion = new Client({ auth: token });
      const response = await notion.databases.query({
        database_id: databaseId,
        filter: { property: "To Approved", checkbox: { equals: true } },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ratings = response.results.map((p: any) => p.properties["Stars"]?.number ?? 5);
      if (ratings.length === 0) return null;
      const avg = ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length;
      return { avg: Math.round(avg * 10) / 10, count: ratings.length };
    } catch {
      return null;
    }
  },
  ["reviews-schema"],
  { revalidate: 3600 }
);

const DOMAIN = "https://wetdrycleaningbansko.com";

const cssVars = `
:root {
  --gold:       ${colors.gold};
  --gold-light: ${colors.goldLight};
  --gold-dark:  ${colors.goldDark};
  --ink:        ${colors.ink};
  --ink-800:    ${colors.ink800};
  --ink-700:    ${colors.ink700};
  --ink-600:    ${colors.ink600};
  --ink-500:    ${colors.ink500};
  --cream:      ${colors.cream};
  --cream-dark: ${colors.creamDark};
  --font-display: 'Oswald', sans-serif;
  --font-body:    'DM Sans', sans-serif;
}
`.trim();

// Async font loading — prevents render blocking
// preconnect + rel=preload for critical font, async for stylesheet
const fontScript = `
(function(){
  var l=document.createElement('link');
  l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap';
  document.head.appendChild(l);
})();
`.trim();

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "Пране на мебели Банско | Wet&Dry Cleaning",
    template: "%s | Wet&Dry Cleaning Банско",
  },
  description:
    "Професионално пране на дивани, матраци, килими и завеси в Банско и региона. Injection-extraction технология. Идваме при вас. Цени от 20€.",
  keywords: [
    "пране на мебели Банско",
    "пране диван Банско",
    "пране килим Банско",
    "пране матрак Банско",
    "пране на меки мебели",
    "пране завеси Банско",
    "пране авто седалки Банско",
    "почистване мебели Разлог",
    "пране на място",
    "injection extraction Банско",
    "Wet Dry cleaning Банско",
    "furniture cleaning Bansko",
    "sofa cleaning Bansko",
    "carpet cleaning Bansko",
    "upholstery cleaning Bansko Bulgaria",
    "carpet cleaning Razlog",
    "sofa cleaning Banya Bulgaria",
    "Банско",
    "Разлог",
    "Добринище",
    "Баня",
  ],
  authors: [{ name: "Wet&Dry Cleaning Bansko" }],
  creator: "Wet&Dry Cleaning Bansko",
  openGraph: {
    type: "website",
    url: DOMAIN,
    title: "Пране на мебели Банско | Wet&Dry Cleaning",
    description:
      "Injection-extraction технология — директно при вас. Дивани, матраци, килими, завеси. Цени от 20€.",
    siteName: "Wet&Dry Cleaning Bansko",
    locale: "bg_BG",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Wet&Dry Cleaning Bansko",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Пране на мебели Банско | Wet&Dry Cleaning",
    description: "Injection-extraction — директно при вас.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/web-app-manifest-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  other: {
    "geo.region": "BG-BL",
    "geo.placename": "Bansko",
    "geo.position": "41.8395;23.4882",
    ICBM: "41.8395, 23.4882",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: colors.gold,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reviewStats = await getReviewStats();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: bgContent.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Wet&Dry Cleaning Bansko",
    description:
      "Професионално пране на мебели с injection-extraction технология в Банско и региона.",
    url: DOMAIN,
    telephone: ["+359882862228", "+359876850385"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bansko",
      addressRegion: "Blagoevgrad",
      addressCountry: "BG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.8395,
      longitude: 23.4882,
    },
    openingHours: "Mo-Su 08:00-20:00",
    priceRange: "€€",
    currenciesAccepted: "EUR, BGN",
    paymentAccepted: "Cash, Bank transfer",
    areaServed: [
      { "@type": "City", name: "Bansko" },
      { "@type": "City", name: "Razlog" },
      { "@type": "City", name: "Dobrinishte" },
      { "@type": "City", name: "Banya" },
    ],
    ...(reviewStats && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviewStats.avg.toString(),
        reviewCount: reviewStats.count,
        bestRating: "5",
        worstRating: "1",
      },
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги за пране на мебели",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Пране на диван" },
          price: "25",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Пране на матрак" },
          price: "20",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Пране на килим" },
          price: "4",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Пране на завеси" },
          price: "15",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Пране на авто седалки" },
          price: "25",
          priceCurrency: "EUR",
        },
      ],
    },
  };

  return (
    <html lang="bg" suppressHydrationWarning>
      <head>
        {/* Design tokens */}
        <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: cssVars }} />

        {/* Preconnect for faster font resolution */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Load fonts async — does NOT block render */}
        <script dangerouslySetInnerHTML={{ __html: fontScript }} />

        {/* Fallback for no-JS */}
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap"
          />
        </noscript>

        {/* LocalBusiness + AggregateRating JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />

        {/* FAQPage JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
