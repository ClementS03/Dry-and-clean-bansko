import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { colors } = require("@/config/design");

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
    "пране мебели Банско",
    "пране диван Банско",
    "почистване матраци Банско",
    "пране килими Банско",
    "Wet Dry cleaning Банско",
    "injection extraction Банско",
    "furniture cleaning Bansko",
    "sofa cleaning Bansko",
    "пране на място",
    "Разлог",
    "Добринище",
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" suppressHydrationWarning>
      <head>
        {/* Design tokens */}
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />

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

        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
              ],
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
                    itemOffered: {
                      "@type": "Service",
                      name: "Пране на матрак",
                    },
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
                    itemOffered: {
                      "@type": "Service",
                      name: "Пране на завеси",
                    },
                    price: "15",
                    priceCurrency: "EUR",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Пране на авто седалки",
                    },
                    price: "25",
                    priceCurrency: "EUR",
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
