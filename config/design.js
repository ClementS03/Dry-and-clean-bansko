/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║              DESIGN TOKENS — SINGLE SOURCE OF TRUTH              ║
 * ║  Change fonts or colors here → impacts the ENTIRE site.          ║
 * ║  After changing fonts: also update the Oswald/DM_Sans imports    ║
 * ║  in app/layout.tsx to match the new font names.                  ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */
const design = {
  // ── COLORS ──────────────────────────────────────────────────────────
  colors: {
    gold: "#F5C400",
    goldLight: "#FFD740",
    goldDark: "#C49A00",
    ink: "#0A0A0A",
    ink800: "#111111",
    ink700: "#1A1A1A",
    ink600: "#242424",
    ink500: "#2E2E2E",
    cream: "#F5F0E8",
    creamDark: "#E8E0D0",
  },

  // ── FONTS ────────────────────────────────────────────────────────────
  // To change fonts:
  // 1. Update the names here
  // 2. Update the next/font imports in app/layout.tsx
  fonts: {
    display: "Oswald", // Headings, nav, badges, prices
    body: "DM Sans", // Body text, descriptions, forms
  },
};

module.exports = design;
