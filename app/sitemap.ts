import type { MetadataRoute } from "next";
import content from "@/content/bg.json";
import { DOMAIN } from "@/lib/schema";

/**
 * Sitemap genere au build : 3 langues x (accueil, hub services, business,
 * confidentialite, une page par service). Un service ajoute dans
 * services.items y entre automatiquement. lastModified = date du build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/services",
    "/business",
    ...content.services.items.map((s) => `/services/${s.slug}`),
    "/privacy",
  ];
  const now = new Date();
  const url = (prefix: string, p: string) => `${DOMAIN}${prefix}${p}` || DOMAIN;

  return paths.flatMap((p) => {
    const languages = {
      "bg-BG": url("", p) || `${DOMAIN}/`,
      en: url("/en", p),
      ru: url("/ru", p),
      "x-default": url("/en", p),
    };
    const priority = p === "" ? 1 : p === "/privacy" ? 0.2 : 0.8;
    return ["", "/en", "/ru"].map((prefix) => ({
      url: url(prefix, p),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: prefix === "" ? priority : Math.max(priority - 0.1, 0.1),
      alternates: { languages },
    }));
  });
}
