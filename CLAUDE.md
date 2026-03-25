# CLAUDE.md — Wet&Dry Cleaning Bansko

Contexte projet pour Claude Code et tout assistant AI travaillant sur ce repo.

---

## Vue d'ensemble

Landing page one-page pour un business de nettoyage de meubles à Bansko, Bulgarie.
- **Stack** : Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Hébergement** : Netlify
- **Domaine** : wetdrycleaningbansko.com
- **Langues** : Bulgare (défaut) + Anglais (toggle)
- **Base de données avis** : Notion (via API)
- **Formulaire leads** : WhatsApp + Formspree (fallback email)

---

## Règle absolue — contenu 100% JSON

**Tout texte visible sur le site doit venir des fichiers JSON.**
Ne jamais hardcoder du texte dans les composants TSX.

```
content/bg.json   ← tout le contenu bulgare
content/en.json   ← tout le contenu anglais
```

Pour ajouter une nouvelle clé :
1. Ajoute-la dans `content/bg.json`
2. Ajoute sa traduction dans `content/en.json`
3. Accède via `const { t } = useLanguage()` dans le composant

---

## Design tokens — source unique

```
config/design.js   ← couleurs et fonts UNIQUEMENT ici
```

Ne jamais hardcoder `fontFamily`, couleurs hex, ou noms de fonts dans les composants.
Tailwind lit `config/design.js` → génère les classes.
Layout injecte les CSS vars `--gold`, `--ink`, `--font-display`, etc.

**Couleurs principales**
- Gold : `#F5C400` → classe `text-gold`, `bg-gold`, `border-gold`
- Fond : `#0A0A0A` → `bg-ink`
- Texte : `#F5F0E8` → `text-cream`

**Fonts**
- Display (titres) : Oswald → `font-display`
- Body : DM Sans → `font-body`

---

## Architecture des fichiers

```
app/
  layout.tsx          ← SEO, JSON-LD LocalBusiness, CSS vars, fonts async
  page.tsx            ← Ordre des sections
  globals.css         ← Classes utilitaires (.btn-gold, .card-dark, .input-dark...)
  api/
    reviews/
      route.ts        ← GET /api/reviews — fetch Notion, filtre Approuvé=true

components/
  Navbar.tsx          ← Nav responsive + switch BG/EN
  Hero.tsx            ← Hero + <LeadForm />
  LeadForm.tsx        ← Formulaire 2 étapes → WhatsApp + fallback Formspree
  Services.tsx        ← Grille services avec prix
  Technology.tsx      ← Process injection-extraction en 3 étapes
  BeforeAfter.tsx     ← Slider avant/après interactif (drag)
  Comparison.tsx      ← Tableau comparatif (responsive: table desktop, cards mobile)
  WhyUs.tsx           ← 6 arguments + garantie
  Pricing.tsx         ← Grille tarifaire
  Reviews.tsx         ← Carousel avis Notion (0=caché, 1=card, 2-6=carousel)
  FAQ.tsx             ← Accordion
  Contact.tsx         ← Phones + WhatsApp + <LeadForm /> (même formulaire)
  Footer.tsx          ← Links + credit
  WhatsAppFAB.tsx     ← Bouton flottant WhatsApp

config/
  design.js           ← Design tokens (couleurs + fonts)
  design.d.ts         ← Types TypeScript pour design.js

content/
  bg.json             ← Contenu bulgare
  en.json             ← Contenu anglais

context/
  LanguageContext.tsx ← Provider i18n, persistance localStorage

hooks/
  useScrollReveal.ts  ← IntersectionObserver pour animations .reveal
```

---

## Variables d'environnement

```bash
# .env.local (local) + Netlify Environment Variables (prod)
NOTION_TOKEN=secret_...          # Clé API Notion Integration
NOTION_DATABASE_ID=32e0c9a9...   # ID de la database "Avis Clients"
```

**Formspree** : endpoint hardcodé dans `components/LeadForm.tsx`
```ts
const FORMSPREE = 'https://formspree.io/f/mjgazwyd'
```

---

## Notion — structure de la database "Avis Clients"

| Propriété | Type Notion | Notes |
|---|---|---|
| `Prénom` | Title | Nom du client |
| `Étoiles` | Number | 1-5 |
| `Services` | Multi-select | Canapé/Fauteuil, Matelas, Kilim/Moquette, Rideaux, Sièges auto |
| `Commentaire` | Rich text | Texte libre |
| `Date` | Date | Auto via Tally |
| `Approuvé` | Checkbox | ← cocher pour publier sur le site |

La route `/api/reviews` :
- Filtre `Approuvé = true`
- Trie par `Date desc`
- Revalidate toutes les 60 secondes
- Le composant `Reviews.tsx` shuffle et cap à 6 avis

---

## Classes CSS utilitaires importantes

```css
.btn-gold        /* Bouton doré principal */
.btn-outline     /* Bouton contour doré */
.card-dark       /* Card sombre avec hover gold */
.input-dark      /* Input sombre avec focus gold */
.section-pad     /* Padding vertical des sections */
.section-badge   /* Petit badge doré en haut des sections */
.gold-divider    /* Ligne horizontale dégradée dorée */
.reveal          /* Élément animé au scroll (ajouter class visible via JS) */
.text-gold-gradient  /* Texte dégradé doré */
.whatsapp-fab    /* Bouton flottant WhatsApp */
.font-display    /* Police Oswald */
.font-body       /* Police DM Sans */
```

---

## Conventions

- **Composants** : `'use client'` obligatoire pour tout composant interactif
- **Scroll reveal** : utiliser `useScrollReveal()` + classe `.reveal` sur les éléments
- **Fonts inline** : ne jamais utiliser `style={{ fontFamily: '...' }}` — utiliser `className="font-display"` ou `font-body`
- **Images** : toujours spécifier `sizes` approprié dans `<Image>` pour éviter le chargement 1920px inutile
- **Imports** : alias `@/` configuré pour la racine du projet

---

## Numéros de contact

- 🇬🇧 English : +359 882 862 228 (WhatsApp principal)
- 🇧🇬 Bulgare : +359 876 850 385

WhatsApp number (sans `+`, sans espaces) : `359882862228`

---

## Déploiement

```bash
# Développement
npm run dev

# Build local
npm run build

# Déployer (Netlify auto-deploy sur push main)
git add .
git commit -m "feat: ..."
git push origin main
```

Netlify rebuild automatiquement à chaque push sur `main`.
Délai après push : ~1-2 minutes.
Délai avis Notion → site : ~60 secondes (revalidate).

---

## SEO local — ce qui est configuré

- `app/layout.tsx` : JSON-LD LocalBusiness, geo meta tags, OG, Twitter card
- `public/sitemap.xml` : soumis à Google Search Console
- `public/robots.txt` : indexation autorisée
- Mots-clés : Банско, Разлог, Добринище (BG) + Bansko, Razlog (EN)
- Coordonnées GPS : 41.8395, 23.4882

---

## Ce qu'il NE faut PAS faire

- ❌ Hardcoder du texte visible dans les composants
- ❌ Hardcoder des couleurs hex ou noms de fonts dans les composants
- ❌ Mentionner "eau à 95°C" ou "température" dans le contenu — la machine ne chauffe pas l'eau
- ❌ Mentionner le nom de la machine (Kärcher Puzzi) dans le contenu visible
- ❌ Committer `.env.local` ou tout fichier contenant des tokens
- ❌ Utiliser `sizes="100vw"` sur des images dans une grille — utiliser `sizes="(min-width: 768px) 33vw, 100vw"`
- ❌ Utiliser `box-shadow` dans les animations (non GPU composité) — utiliser `opacity` ou `transform`
