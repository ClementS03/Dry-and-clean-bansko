/**
 * Donnees structurees JSON-LD, en un seul endroit.
 * Les layouts injectent le LocalBusiness, les pages services y renvoient
 * par son @id. Un changement d adresse, de telephone ou de zone se fait ici.
 *
 * Donnees officielles : Registre du commerce, etat au 12/11/2026.
 * Pas d aggregateRating : Google ignore les avis qu une entreprise declare
 * sur elle-meme. Pas de priceRange : le site n affiche aucun prix.
 * TODO assurance : rien a ajouter ici, mais remettre la mention sur le site
 * quand le contrat RC pro sera signe.
 */

export const DOMAIN = "https://wetdrycleaningbansko.com";
export const BUSINESS_ID = `${DOMAIN}/#business`;
export const PHONE = "+359882862228";
export const GEO = { latitude: 41.8234412, longitude: 23.4904993 };

type Lang = "bg" | "en" | "ru";

// Vallee Bansko-Razlog, sans frais de deplacement (communes de Bansko et de
// Razlog, listes verifiees sur Wikipedia BG le 15/11/2026).
const VALLEY_TOWNS = ["Bansko", "Dobrinishte", "Razlog", "Banya"];
const VALLEY_VILLAGES = [
  "Gostun", "Kremen", "Mesta", "Obidim", "Osenovo", "Filipovo",
  "Bachevo", "Godlevo", "Gorno Draglishte", "Dolno Draglishte", "Dobarsko", "Eleshnitsa",
];
// Region, deplacement inclus dans le devis
const REGION_TOWNS = ["Blagoevgrad", "Simitli", "Belitsa", "Yakoruda", "Gotse Delchev", "Sandanski"];

export const AREA_SERVED = [
  ...VALLEY_TOWNS.map((name) => ({ "@type": "City", name })),
  ...VALLEY_VILLAGES.map((name) => ({ "@type": "Place", name })),
  ...REGION_TOWNS.map((name) => ({ "@type": "City", name })),
  { "@type": "AdministrativeArea", name: "Blagoevgrad Province" },
];

type BusinessContent = {
  meta: { description: string };
  services: { title: string; items: { name: string }[] };
};

export function localBusinessSchema(content: BusinessContent, lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": BUSINESS_ID,
    name: "Wet&Dry Cleaning Bansko",
    legalName: "„ВОЛЯ ГРУП“ ЕДПК",
    taxID: "208994501",
    description: content.meta.description,
    url: DOMAIN,
    telephone: PHONE,
    email: "wetdrycleanbansko@gmail.com",
    image: [`${DOMAIN}/og-default${lang === "en" ? "" : `-${lang}`}.jpg`],
    logo: `${DOMAIN}/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Sv. Ivan 5, fl. 1, ap. 6",
      addressLocality: "Bansko",
      addressRegion: "Blagoevgrad",
      postalCode: "2770",
      addressCountry: "BG",
    },
    geo: { "@type": "GeoCoordinates", ...GEO },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    knowsLanguage: ["bg", "en", "ru", "fr"],
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Bank transfer, Revolut",
    areaServed: AREA_SERVED,
    sameAs: [
      "https://g.page/r/CU4pAGZ9UMLpEBM",
      "https://www.instagram.com/wetdryclean.bansko/",
      "https://www.facebook.com/profile.php?id=61588508592574",
      "https://www.tiktok.com/@wetdryclean.bansko",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: content.services.title,
      itemListElement: content.services.items.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.name },
      })),
    },
  };
}

export function serviceSchema(name: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    serviceType: name,
    description,
    url,
    areaServed: AREA_SERVED,
    provider: { "@id": BUSINESS_ID },
  };
}

/** Serialise pour <script type="application/ld+json">, sans risque de </script>. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
