# CLAUDE.md — Wet&Dry Cleaning Bansko

Contexte projet pour Claude Code et tout assistant AI travaillant sur ce repo.

---

## Vue d'ensemble

Site d'une entreprise de nettoyage professionnel à Bansko, Bulgarie. Positionnement multi-services depuis septembre 2026, cible principalement B2B.

- **Stack** : Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Hébergement** : Netlify, auto-deploy sur push `main`
- **Domaine** : wetdrycleaningbansko.com
- **Langues** : bulgare (défaut `/`), anglais (`/en`), russe (`/ru`)
- **Avis** : Notion via API
- **Leads** : WhatsApp sur mobile et tablette, Resend sur desktop

---

## Les 7 services

Le nettoyage textile est **un** service appliqué à 5 objets, pas 5 services. Le nettoyage récurrent n'est pas un service mais une modalité de contrat.

| Clé | Service | Slug |
|---|---|---|
| `textile` | Пране на мека мебел и текстил | `upholstery-cleaning` |
| `deep` | Дълбоко почистване | `deep-cleaning` |
| `renovation` | Почистване след ремонт | `post-construction-cleaning` |
| `turnover` | Почистване между гости | `airbnb-turnover` |
| `windows` | Прозорци и витрини | `window-cleaning` |
| `pressure` | Водоструйка | `pressure-washing` |
| `industrial` | Индустриално почистване | `industrial-cleaning` |

Sous-objets de `textile` : `sofa` · `mattress` · `carpet` · `curtains` · `car`.

Ces clés sont les identifiants stables du projet : elles servent dans `content/*.json`, dans le formulaire, dans la validation serveur de `/api/contact` et dans les noms de dossiers de galerie. Les slugs sont en anglais et partagés par les trois langues.

---

## Règle absolue — contenu 100% JSON

**Tout texte visible doit venir des fichiers JSON.** Jamais de texte en dur dans un composant.

```
content/bg.json   ← bulgare (source)
content/en.json   ← anglais
content/ru.json   ← russe
```

Une nouvelle clé s'ajoute dans **les trois** fichiers. La parité est stricte : `Translations = typeof bg`, une clé manquante casse le build.

Vérifier la parité :
```bash
node -e "const fs=require('fs');const k=o=>{const r=[];(function w(x,p){for(const n of Object.keys(x)){const q=p?p+'.'+n:n;r.push(q);if(x[n]&&typeof x[n]==='object'&&!Array.isArray(x[n]))w(x[n],q)}})(o,'');return r.sort()};const[a,b,c]=['bg','en','ru'].map(l=>k(JSON.parse(fs.readFileSync('content/'+l+'.json','utf8'))));console.log(a.length,b.length,c.length)"
```

---

## Photos avant/après — convention

Aucun admin, aucun CMS. Tout passe par les noms de fichiers.

```
public/gallery/home/before-1.jpg     ← photo avant
public/gallery/home/after-1.jpg      ← la même, après
public/gallery/home/before-2.jpg
public/gallery/home/after-2.jpg
```

- Le numéro fait la paire. `before-3` va avec `after-3`.
- Extensions acceptées : `.jpg` `.jpeg` `.png` `.webp`
- Une paire incomplète est ignorée sans erreur.
- Dossier absent ou vide : la section galerie disparaît entièrement, sans placeholder.
- La home lit `public/gallery/home/`, plafonnée à 6 paires affichées.
- Chaque page service lira `public/gallery/<slug>/` avec les slugs du tableau ci-dessus.
- La première photo `after-1` d'un service sert automatiquement de vignette sur sa carte dans la section Services.

Workflow : déposer les fichiers, commiter, pusher. Aucun code ni JSON à toucher.

`lib/gallery.ts` fait le scan au build. Il est appelé depuis les pages, qui sont des Server Components, et les paires sont passées en props à `BeforeAfter`.

---

## Design tokens — source unique

```
config/design.js   ← couleurs et fonts UNIQUEMENT ici
```

Jamais de `fontFamily`, de hex ou de nom de font en dur dans un composant. Tailwind lit `config/design.js`, chaque layout injecte les CSS vars.

- Gold `#F5C400` → `text-gold`, `bg-gold`, `border-gold`
- Fond `#0A0A0A` → `bg-ink`, avec `ink-800` `ink-700` `ink-600` `ink-500`
- Texte `#F5F0E8` → `text-cream`
- Display : Oswald → `font-display` · Body : DM Sans → `font-body`

Les icônes viennent de `lucide-react` via `components/Icon.tsx`. Le JSON porte un nom en kebab-case (`sofa`, `hard-hat`, `shield-check`), le composant fait la correspondance. Ajouter une icône = l'importer dans `Icon.tsx` et l'ajouter au dictionnaire.

---

## Architecture

```
app/
  globals.css              classes utilitaires
  fonts.ts                 next/font, Oswald + DM Sans
  (bg)/layout.tsx          <html lang="bg">, metadata et JSON-LD BG, CSS vars
  (bg)/page.tsx            route /
  (bg)/business/page.tsx   route /business
  (en)/layout.tsx          idem EN
  (en)/en/page.tsx         route /en
  (en)/en/business/page.tsx
  (ru)/layout.tsx          idem RU
  (ru)/ru/page.tsx         route /ru
  (ru)/ru/business/page.tsx
  api/contact/route.ts     POST, Resend, validation d'enum sur les clés service
  api/reviews/route.ts     GET, Notion, revalidate 60 s

components/
  Navbar  Hero  LeadForm  Services  HowWeWork  BeforeAfter  WhyUs
  ForRentals  Quote  Reviews  FAQ  Contact  Footer  WhatsAppFAB  Icon
  Technology  Comparison        ← plus rendus, réservés à la page textile (phase 2)
  hotels/                       ← composants de la page /business

lib/gallery.ts               scan de public/gallery/<slug>/
config/design.js             tokens
content/{bg,en,ru}.json      contenu
context/LanguageContext.tsx  provider i18n
hooks/useScrollReveal.ts     IntersectionObserver
```

Ordre des sections de la home :
`Hero → Services → HowWeWork → BeforeAfter → WhyUs → ForRentals → Quote → Reviews → FAQ → Contact`

`Technology` et `Comparison` décrivent l'injection-extraction, qui ne concerne qu'un service sur sept. Ils ont quitté la home et leurs clés JSON (`technology.*`, `comparison.*`) sont conservées intactes pour la page `upholstery-cleaning` de la phase 2.

---

## i18n

Trois route groups, chacun avec son propre `layout.tsx`. **Un changement de layout doit être répliqué dans les trois.**

- `LanguageProvider initialLang` est posé dans chaque page, jamais dans un layout.
- localStorage (`wetdry_lang`) n'est lu que si `initialLang === 'bg'`, et n'accepte que `bg` et `en`.
- Le sélecteur de langue préserve la page courante : `/business` mène à `/en/business`.
- hreflang déclaré à trois endroits qui doivent rester cohérents : `alternates.languages` de chaque layout, de chaque page `business`, et `public/sitemap.xml`.

---

## Variables d'environnement

```bash
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=...
RESEND_API_KEY=re_...
```

---

## Formulaire de contact

`components/LeadForm.tsx`, deux étapes.

Étape 1 : audience privé ou business, les 7 services en multi-sélection, sous-bloc des 5 objets textile qui se déplie si `textile` est coché, fréquence si business, champ détails à placeholder contextuel (objets, surface, ou les deux).
Étape 2 : nom facultatif, téléphone, localité.

Prop `preselect` pour pré-cocher un service depuis une page service.

`app/api/contact/route.ts` : origin check, Content-Type, honeypot `_hp` (champ `name="website"`), sanitisation, et validation des `serviceKeys` et `textileKeys` sur une enum. **Cette enum doit rester alignée sur `services[].key` dans les JSON.**

Comportement par device :

| Élément | Mobile | Tablette | Desktop (lg+) |
|---|---|---|---|
| Liens `tel:` | cliquables | non cliquables | non cliquables |
| Bouton Appeler | visible | masqué | masqué |
| Bouton WhatsApp Contact | visible | visible | masqué |
| WhatsApp FAB | visible | visible | masqué |
| LeadForm CTA primaire | WhatsApp | WhatsApp | Email Resend |

---

## Notion — database "Avis Clients"

Noms réels des propriétés lus par le code :

| Propriété | Type |
|---|---|
| `Firstname Surname` | Title |
| `Stars` | Number |
| `Services` | Multi-select |
| `Review Text` | Rich text |
| `Date` | Date |
| `To Approved` | Checkbox |

`/api/reviews` filtre `To Approved = true`, trie par `Date desc`, revalide toutes les 60 s. `Reviews.tsx` mélange et plafonne à 6. La section disparaît s'il n'y a aucun avis. Le même fetch alimente l'`AggregateRating` du JSON-LD, avec une clé de cache distincte par langue.

---

## Classes CSS

```
.btn-gold .btn-outline .card-dark .input-dark .section-pad .section-badge
.gold-divider .reveal .text-gold-gradient .whatsapp-fab .comparison-table
.font-display .font-body
```

---

## Conventions

- `'use client'` pour tout composant interactif
- `.reveal` sur **chaque item** d'une liste, pas sur le parent, avec `transitionDelay: ${i * 80}ms`
- `className="font-display"`, jamais `style={{ fontFamily }}`
- `sizes` explicite sur chaque `<Image>`
- alias `@/` vers la racine
- alternance des fonds de sections : `bg-ink-800` et `bg-ink` en alternance stricte

---

## Copywriting

Langue humaine et directe, phrases courtes. Pas de tirets cadratins comme ponctuation de style, pas de « не само..., но и », pas de triades décoratives, pas de superlatifs vides. Ce qu'un artisan écrirait à son client.

Les textes se valident en anglais, le bulgare et le russe en sont dérivés.

---

## Déploiement

```bash
npm run dev      # http://localhost:3000, /en, /ru
npm run build    # obligatoire avant tout push
git push origin main
```

Netlify redéploie automatiquement. Délai environ 1 à 2 minutes. Délai avis Notion vers site environ 60 s.

---

## SEO

- JSON-LD `LocalBusiness + ProfessionalService + CleaningService` dans les 3 layouts, avec `hasOfferCatalog` généré depuis `services.items` (sans prix), `aggregateRating` Notion, `serviceArea` GeoCircle 20 km, horaires, `sameAs`
- JSON-LD `FAQPage` généré depuis `faq.items`
- `metadata` title, description et keywords pilotés par `meta.*` du JSON
- `public/sitemap.xml` : 6 URLs avec hreflang complet
- `public/robots.txt` : `Disallow: /api/`
- `public/llms.txt` : fiche business pour les LLM, à maintenir cohérente avec le site
- `/hotels` a été renommé `/business` en septembre 2026, 301 dans `netlify.toml`

---

## Zone de service

Bansko · Разлог · Добринище · Баня. Belitsa a été retiré, trop loin.

---

## Réseaux et Google

- Instagram : https://www.instagram.com/wetdryclean.bansko/
- Facebook : https://www.facebook.com/profile.php?id=61588508592574
- TikTok : https://www.tiktok.com/@wetdryclean.bansko
- Avis Google : `https://g.page/r/CU4pAGZ9UMLpEBM/review`
- Images GBP : pas de prix, pas de téléphone, pas d'URL, pas de QR code, Google rejette

---

## Contacts

- English : +359 882 862 228 → WhatsApp `359882862228`
- Български : +359 876 850 385 → WhatsApp `359876850385`, utilisé aussi en RU

---

## Ce qu'il ne faut PAS faire

- Hardcoder du texte visible dans un composant
- Hardcoder une couleur hex ou un nom de font
- Ajouter une clé dans un seul JSON sur trois
- Mentionner une température ou le nom de la machine, y compris dans les meta
- Réintroduire des prix : le site n'affiche aucun tarif, tout passe par le devis
- Committer `.env.local` ou un token
- `sizes="100vw"` sur une image en grille
- `box-shadow` animé
- Mettre `hidden` ou `lg:hidden` directement sur un élément `.btn-gold` ou `.whatsapp-fab`, utiliser un wrapper `<div>`
- Modifier un `layout.tsx` sans répercuter sur les deux autres
- Renommer une clé de service sans mettre à jour l'enum de `/api/contact` et les dossiers de galerie

---

## Phase 2 (à venir)

Les 7 pages `/services/<slug>` dans les 3 langues, le hub `/services`, la nav qui pointe vers le hub, les galeries par service, le préremplissage du formulaire par query string, et le rebranchement de `Technology` et `Comparison` sur la page `upholstery-cleaning`.

Objectif métier : donner à Google la preuve des services pour débloquer l'élargissement de la fiche Business, catégorie par catégorie.
