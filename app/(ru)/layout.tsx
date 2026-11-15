import type { Metadata } from "next";
import "../globals.css";
import ruContent from "@/content/ru.json";
import { oswald, dmSans } from "../fonts";
import { DOMAIN, GEO, localBusinessSchema, jsonLd } from "@/lib/schema";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { colors } = require("@/config/design");


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
    default: ruContent.meta.title,
    template: "%s | Wet&Dry Cleaning Банско",
  },
  description: ruContent.meta.description,
  keywords: ruContent.meta.keywords.split(", "),
  authors: [{ name: "Wet&Dry Cleaning Bansko" }],
  creator: "Wet&Dry Cleaning Bansko",
  alternates: {
    canonical: "/ru",
    languages: {
      "bg-BG": "/",
      "en": "/en",
      "ru": "/ru",
      "x-default": "/en",
    },
  },
  openGraph: {
    type: "website",
    url: `${DOMAIN}/ru`,
    title: ruContent.meta.title,
    description: ruContent.meta.description,
    siteName: "Wet&Dry Cleaning Bansko",
    locale: "ru_RU",
    images: [
      {
        url: "/og-image-ru.jpg",
        width: 1200,
        height: 630,
        alt: "Wet&Dry Cleaning Bansko, чистка мебели",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ruContent.meta.title,
    description: ruContent.meta.description,
    images: ["/og-image-ru.jpg"],
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
    "geo.position": `${GEO.latitude};${GEO.longitude}`,
    ICBM: `${GEO.latitude}, ${GEO.longitude}`,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: colors.gold,
};

export default function RootLayoutRU({
  children,
}: {
  children: React.ReactNode;
}) {
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
          dangerouslySetInnerHTML={jsonLd(localBusinessSchema(ruContent, "ru"))}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
