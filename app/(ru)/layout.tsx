import type { Metadata } from "next";
import "../globals.css";
import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";
import ruContent from "@/content/ru.json";
import { oswald, dmSans } from "../fonts";

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
  ["reviews-schema-ru"],
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
  --font-display: var(--font-display-next), 'Oswald', sans-serif;
  --font-body:    var(--font-body-next), 'DM Sans', sans-serif;
}
`.trim();

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "Чистка мебели Банско | Wet&Dry Cleaning",
    template: "%s | Wet&Dry Cleaning Банско",
  },
  description:
    "Профессиональная чистка диванов, матрасов, ковров и штор в Банско и окрестностях. Технология инъекционной экстракции. Приедем к вам. Цены от 20€.",
  keywords: [
    "чистка мебели Банско",
    "чистка дивана Банско",
    "химчистка дивана Банско",
    "чистка матраса Банско",
    "чистка ковра Банско",
    "чистка штор Банско",
    "чистка автомобильных сидений Банско",
    "химчистка мебели Банско",
    "инъекция экстракция Банско",
    "Wet Dry cleaning Банско",
    "Банско",
    "Разлог",
    "Добриниште",
    "Баня",
  ],
  authors: [{ name: "Wet&Dry Cleaning Bansko" }],
  creator: "Wet&Dry Cleaning Bansko",
  alternates: {
    canonical: "/ru",
    languages: {
      "bg-BG": "/",
      "en": "/en",
      "ru": "/ru",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    url: `${DOMAIN}/ru`,
    title: "Чистка мебели Банско | Wet&Dry Cleaning",
    description:
      "Профессиональная чистка диванов, матрасов и ковров в Банско. Технология инъекционной экстракции. Приедем к вам. Цены от 20€.",
    siteName: "Wet&Dry Cleaning Bansko",
    locale: "ru_RU",
    images: [
      {
        url: "/og-image.jpg",
        width: 1024,
        height: 500,
        alt: "Wet&Dry Cleaning Bansko — чистка мебели",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Чистка мебели Банско | Wet&Dry Cleaning",
    description: "Профессиональная выездная чистка мебели в Банско, Болгария.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/web-app-manifest-192x192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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

export default async function RootLayoutRU({
  children,
}: {
  children: React.ReactNode;
}) {
  const reviewStats = await getReviewStats();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ruContent.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: "Wet&Dry Cleaning Bansko",
    description:
      "Профессиональная чистка мебели с технологией инъекционной экстракции в Банско и окрестностях. Приедем к вам — диваны, матрасы, ковры, шторы, автомобильные сиденья.",
    url: DOMAIN,
    telephone: ["+359882862228", "+359876850385"],
    email: "wetdrycleanbansko@gmail.com",
    image: [`${DOMAIN}/og-image.jpg`],
    logo: `${DOMAIN}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sv. Ivan Rilski",
      addressLocality: "Bansko",
      addressRegion: "Blagoevgrad",
      postalCode: "2770",
      addressCountry: "BG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.8395,
      longitude: 23.4882,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday", "Tuesday", "Wednesday", "Thursday",
          "Friday", "Saturday", "Sunday",
        ],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Bank transfer",
    areaServed: [
      { "@type": "City", name: "Bansko" },
      { "@type": "City", name: "Razlog" },
      { "@type": "City", name: "Dobrinishte" },
      { "@type": "City", name: "Banya" },
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 41.8395,
        longitude: 23.4882,
      },
      geoRadius: 20000,
    },
    sameAs: [
      "https://g.page/r/CU4pAGZ9UMLpEBM",
      "https://www.instagram.com/wetdryclean.bansko/",
      "https://www.facebook.com/profile.php?id=61588508592574",
      "https://www.tiktok.com/@wetdryclean.bansko",
    ],
    dateModified: new Date().toISOString().split("T")[0],
    ...(reviewStats && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviewStats.avg,
        reviewCount: reviewStats.count,
        bestRating: "5",
        worstRating: "1",
      },
    }),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги чистки мебели в Банско",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Чистка дивана Банско" },
          price: "25",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Чистка матраса Банско" },
          price: "20",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Чистка ковра Банско" },
          price: "4",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Чистка штор Банско" },
          price: "15",
          priceCurrency: "EUR",
        },
        {
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: "Чистка автомобильных сидений Банско" },
          price: "25",
          priceCurrency: "EUR",
        },
      ],
    },
  };

  return (
    <html
      lang="ru"
      className={`${oswald.variable} ${dmSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <style suppressHydrationWarning dangerouslySetInnerHTML={{ __html: cssVars }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
