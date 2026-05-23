# CLAUDE.md — Wet&Dry Cleaning Bansko

Contexte projet pour Claude Code et tout assistant AI travaillant sur ce repo.

---

## Vue d'ensemble

Landing page one-page pour un business de nettoyage de meubles à Bansko, Bulgarie.
- **Stack** : Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Hébergement** : Netlify
- **Domaine** : wetdrycleaningbansko.com
- **Langues** : Bulgare (défaut `/`) + Anglais (`/en`) — deux routes statiques indexées par Google
- **Base de données avis** : Notion (via API)
- **Formulaire leads** : WhatsApp (mobile/tablette) + Resend email (desktop)

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
  layout.tsx          ← SEO global, JSON-LD LocalBusiness+FAQ+AggregateRating, CSS vars, fonts async
  page.tsx            ← Route BG (/) — LanguageProvider initialLang="bg" + toutes les sections
  globals.css         ← Classes utilitaires (.btn-gold, .card-dark, .input-dark...)
  en/
    page.tsx          ← Route EN (/en) — LanguageProvider initialLang="en" + metadata EN + schema EN
  api/
    reviews/
      route.ts        ← GET /api/reviews — fetch Notion, filtre Approuvé=true
    contact/
      route.ts        ← POST /api/contact — Resend email, sécurité (origin, honeypot, sanitize)

components/
  Navbar.tsx          ← Nav responsive + switch BG/EN via router.push('/' ou '/en')
  Hero.tsx            ← Hero + <LeadForm />
  LeadForm.tsx        ← Formulaire 2 étapes → WhatsApp (mobile/tablette) + Resend email (desktop)
  Services.tsx        ← Grille services avec prix
  Technology.tsx      ← Process injection-extraction en 3 étapes
  BeforeAfter.tsx     ← Slider avant/après interactif (drag)
  Comparison.tsx      ← Tableau comparatif (responsive: table desktop, cards mobile)
  WhyUs.tsx           ← 6 arguments + garantie
  ForRentals.tsx      ← Section B2B hôtels/Airbnb (entre WhyUs et Pricing)
  Pricing.tsx         ← Grille tarifaire
  Reviews.tsx         ← Carousel avis Notion (0=caché, 1=card, 2-6=carousel)
  FAQ.tsx             ← Accordion (12 questions)
  Contact.tsx         ← Phones + WhatsApp + <LeadForm /> (même formulaire)
  Footer.tsx          ← Links + credit + lien review Google
  WhatsAppFAB.tsx     ← Bouton flottant WhatsApp (masqué sur desktop lg+)

config/
  design.js           ← Design tokens (couleurs + fonts)
  design.d.ts         ← Types TypeScript pour design.js

content/
  bg.json             ← Contenu bulgare
  en.json             ← Contenu anglais

context/
  LanguageContext.tsx ← Provider i18n, initialLang prop, localStorage (BG route seulement)

hooks/
  useScrollReveal.ts  ← IntersectionObserver pour animations .reveal
```

---

## i18n — Architecture des routes

Le site a deux routes statiquement pre-rendues :
- `/` → `app/page.tsx` → bulgare par défaut, `LanguageProvider initialLang="bg"`
- `/en` → `app/en/page.tsx` → anglais, `LanguageProvider initialLang="en"`

**Règles importantes :**
- `LanguageProvider` est dans chaque page, PAS dans `app/layout.tsx`
- Sur `/`, localStorage est lu au mount pour persister la préférence
- Sur `/en`, localStorage n'est PAS lu (l'URL est la source de vérité)
- `document.documentElement.lang` est mis à jour côté client par `LanguageContext`
- Le toggle dans `Navbar.tsx` navigue via `router.push('/')` ou `router.push('/en')`
- hreflang dans `app/layout.tsx` (metadata.alternates) ET `app/en/page.tsx` ET `public/sitemap.xml`

---

## Variables d'environnement

```bash
# .env.local (local) + Netlify Environment Variables (prod)
NOTION_TOKEN=secret_...          # Clé API Notion Integration
NOTION_DATABASE_ID=32e0c9a9...   # ID de la database "Avis Clients"
RESEND_API_KEY=re_...            # Clé API Resend (email formulaire)
```

---

## Formulaire de contact — Resend

L'email de leads est envoyé via **Resend** (pas Formspree).

- **Route API** : `app/api/contact/route.ts`
- **FROM** : `noreply@wetdrycleaningbansko.com` (domaine vérifié sur Resend)
- **TO** : `wetdrycleanbansko@gmail.com`
- **Sécurité** : origin check, Content-Type validation, honeypot (`name="website"`), sanitisation inputs, validation champs requis
- **Comportement par device** :
  - Mobile / tablette (`< lg`) → bouton primaire = WhatsApp
  - Desktop (`lg+`) → bouton primaire = email via Resend
- **Honeypot** : champ `name="website"` caché par CSS dans LeadForm, vérifié server-side (`_hp`)

---

## Comportement des contacts par device

| Élément | Mobile | Tablette | Desktop |
|---|---|---|---|
| Liens `tel:` | Cliquables | Non-cliquables (`pointer-events-none`) | Non-cliquables |
| Bouton "Appeler maintenant" | Visible | Masqué (`md:hidden`) | Masqué |
| Bouton WhatsApp (Contact) | Visible | Visible | Masqué (`lg:hidden`) |
| WhatsApp FAB | Visible | Visible | Masqué (`lg:hidden`) |
| Formulaire — CTA primaire | WhatsApp | WhatsApp | Email Resend |
| Bouton "Envoyer un email" (Contact) | Masqué | Masqué | Visible (`hidden lg:block`) |

**Attention CSS** : `btn-gold` est défini APRÈS `@tailwind utilities` dans globals.css → son `display: inline-flex` override les classes Tailwind `hidden`/`lg:flex`. Toujours utiliser un **wrapper `<div>`** pour show/hide des éléments `btn-gold`, jamais directement sur le `<a>` ou `<button>`.

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
.btn-gold        /* Bouton doré principal — display: inline-flex — voir note wrapper ci-dessus */
.btn-outline     /* Bouton contour doré */
.card-dark       /* Card sombre avec hover gold */
.input-dark      /* Input sombre avec focus gold */
.section-pad     /* Padding vertical des sections */
.section-badge   /* Petit badge doré en haut des sections */
.gold-divider    /* Ligne horizontale dégradée dorée */
.reveal          /* Élément animé au scroll — mettre sur chaque item pour stagger */
.text-gold-gradient  /* Texte dégradé doré */
.whatsapp-fab    /* Bouton flottant WhatsApp (position: fixed dans la classe CSS) */
.font-display    /* Police Oswald */
.font-body       /* Police DM Sans */
```

---

## Conventions

- **Composants** : `'use client'` obligatoire pour tout composant interactif
- **Scroll reveal stagger** : mettre `.reveal` sur **chaque item** de la liste (pas sur le wrapper parent), avec `style={{ transitionDelay: '${i * 100}ms' }}`
- **Fonts inline** : ne jamais utiliser `style={{ fontFamily: '...' }}` — utiliser `className="font-display"` ou `font-body`
- **Images** : toujours spécifier `sizes` approprié dans `<Image>` pour éviter le chargement 1920px inutile
- **Imports** : alias `@/` configuré pour la racine du projet
- **Show/hide responsive** : utiliser des wrappers `<div className="lg:hidden">` et `<div className="hidden lg:block">` autour des éléments avec classes CSS custom (btn-gold, whatsapp-fab, etc.)

---

## Numéros de contact

- 🇬🇧 English : +359 882 862 228 (WhatsApp principal EN)
- 🇧🇬 Bulgare : +359 876 850 385

WhatsApp number EN (sans `+`, sans espaces) : `359882862228`
WhatsApp number BG (sans `+`, sans espaces) : `359876850385`

**Note** : Les deux JSON (`contact.whatsappNumber`) pointent vers `359876850385` (numéro BG). À vérifier si la page EN devrait pointer vers `359882862228`.

---

## Déploiement

```bash
# Développement
npm run dev

# Build local (toujours vérifier avant push)
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

- `app/layout.tsx` : JSON-LD `LocalBusiness + ProfessionalService`, `FAQPage` (12 questions), `AggregateRating` dynamique Notion, `hasOfferCatalog` (5 services en bulgare), `sameAs` (GBP + 3 réseaux sociaux), `serviceArea` GeoCircle 20km, `openingHoursSpecification`, adresse Sv. Ivan Rilski, postal 2770
- `app/en/page.tsx` : JSON-LD schema EN dédié (services en anglais)
- `public/sitemap.xml` : `/` et `/en` avec hreflang xhtml:link complet, changefreq weekly
- `public/robots.txt` : indexation autorisée, `Disallow: /api/`
- Mots-clés : Банско, Разлог, Добринище, Баня (BG) + Bansko, Razlog, Dobrinishte, Banya (EN)
- hreflang : `bg-BG` → `/`, `en` → `/en`, `x-default` → `/`
- Coordonnées GPS : 41.8395, 23.4882

---

## Vidéo YouTube (Technology section)

Le player vidéo s'affiche **uniquement si** `technology.videoUrl` est une URL YouTube embed valide (commence par `https://www.youtube.com/embed/`). Pour activer :
1. Upload sur YouTube → Non répertorié
2. Copier l'ID depuis `youtube.com/watch?v=XXXXXXXX`
3. Dans `content/bg.json` ET `content/en.json` → `"videoUrl": "https://www.youtube.com/embed/XXXXXXXX"`
4. Laisser `"videoUrl": ""` = pas d'affichage

---

## Zone de service (depuis mai 2026)

Bansko · Разлог · Добринище · **Баня** (Banya)
Belitsa retiré — trop loin.

---

## Réseaux sociaux

- Instagram : https://www.instagram.com/wetdryclean.bansko/
- Facebook : https://www.facebook.com/profile.php?id=61588508592574
- TikTok : https://www.tiktok.com/@wetdryclean.bansko

---

## Google Business Profile

- Fiche créée et vérifiée (mai 2026). Une seule fiche EN.
- GBP review URL : `https://g.page/r/CU4pAGZ9UMLpEBM/review` (dans `contact.reviewUrl` JSON + Footer)
- AggregateRating schema dans `app/layout.tsx` (revalide toutes les 1h via Notion)
- Images GBP : `wetdry-bansko-marketing/gbp-images/`
  - `sofa-1080x1080.png` — avant/après diván (2160×2160 réels)
  - `carpet-1080x1080.png` — avant/après kilim (2160×2160 réels)
  - `carpet-hotel-1080x1080.png` — avant/après moquette hôtel (2160×2160 réels)
  - `cover-1200x675.png` — photo de couverture GBP (2400×1350 réels, ratio 16:9)
  - Régénérer : `node screenshot.js` (utilise Playwright depuis freelanceos/node_modules)
- **Règles images GBP** : pas de prix, pas de téléphone, pas d'URL, pas de QR code — Google rejette

---

## Ce qu'il NE faut PAS faire

- ❌ Hardcoder du texte visible dans les composants (tout vient du JSON)
- ❌ Hardcoder des couleurs hex ou noms de fonts dans les composants
- ❌ Mentionner "eau à 95°C" ou "température" dans le contenu
- ❌ Mentionner le nom de la machine (Kärcher Puzzi) dans le contenu visible **ni dans les meta JSON**
- ❌ Committer `.env.local` ou tout fichier contenant des tokens
- ❌ Utiliser `sizes="100vw"` sur des images dans une grille
- ❌ Utiliser `box-shadow` dans les animations (non GPU composité)
- ❌ Hardcoder les URLs réseaux sociaux dans les composants
- ❌ Mettre `hidden`/`lg:hidden` directement sur un élément avec classe CSS custom (`btn-gold`, `whatsapp-fab`) — utiliser un wrapper `<div>`
- ❌ Ajouter `style={{ fontFamily: '...' }}` inline — utiliser `className="font-display"`
- ❌ Modifier `app/layout.tsx` sans penser à l'impact sur `/en` (le layout est partagé)
- ❌ Upload des images GBP avec prix, téléphone, URL ou QR code — Google les rejette
