import { Oswald, DM_Sans } from "next/font/google";

/**
 * Self-hosted, optimized fonts via next/font/google.
 * - Eliminates render-blocking external Google Fonts request
 * - display: 'swap' avoids invisible text (FOIT)
 * - Exposes CSS variables consumed by globals.css / design tokens:
 *     --font-display  → Oswald
 *     --font-body     → DM Sans
 * Keep the weights in sync with config/design.js + tailwind usage.
 */
export const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display-next",
});

// Police variable (pas de liste de graisses) : en novembre 2026 Google sert
// les graisses fixes de DM Sans sous une URL sans extension, que next/font
// ne sait pas lire, et le build echoue. La version variable reste en woff2.
export const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body-next",
});
