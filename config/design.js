/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║              DESIGN TOKENS — SINGLE SOURCE OF TRUTH              ║
 * ║  Change fonts or colors here → impacts the ENTIRE site.          ║
 * ║  Run `npm run build` (or push to Vercel) after any change.        ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

const design = {

  // ── COLORS ──────────────────────────────────────────────────────────
  // Tip: use https://coolors.co or https://colorhunt.co to pick palettes
  colors: {
    gold:      '#F5C400',   // Primary accent — buttons, headings highlight, borders
    goldLight: '#FFD740',   // Hover state for gold elements
    goldDark:  '#C49A00',   // Active / darker gold
    ink:       '#0A0A0A',   // Deepest background
    ink800:    '#111111',   // Section background alternate
    ink700:    '#1A1A1A',   // Card backgrounds
    ink600:    '#242424',   // Subtle hover backgrounds
    ink500:    '#2E2E2E',   // Border subtle
    cream:     '#F5F0E8',   // Primary text color
    creamDark: '#E8E0D0',   // Secondary text color
  },

  // ── FONTS ────────────────────────────────────────────────────────────
  // Tip: browse Google Fonts at https://fonts.google.com
  // After changing font names, update googleUrl to load the new fonts.
  fonts: {
    display:   'Oswald',    // Used for headings, nav labels, badges, prices
    body:      'DM Sans',   // Used for body text, descriptions, form labels

    // Google Fonts URL — update weights/families here when you change fonts
    googleUrl: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap',
  },

}

module.exports = design
