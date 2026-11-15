# CLAUDE.md — Wet&Dry Cleaning Bansko

Contexte projet pour Claude Code et tout assistant AI travaillant sur ce repo.

---

## Vue d'ensemble

Site d'une entreprise de nettoyage professionnel à Bansko, Bulgarie. Positionnement multi-services depuis septembre 2026, cible principalement B2B.

- **Stack** : Next.js 16 (App Router), TypeScript, Tailwind CSS
- **Hébergement** : Netlify, auto-deploy sur push `main`
- **Domaine** : wetdrycleaningbansko.com
- **Langues** : bulgare (défaut `/`), anglais (`/en`), russe (`/ru`)
- **Avis** : recopiés à la main dans `reviews.items` des JSON (Google + anciens avis), aucune API
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

Sous-objets de `textile` : `sofa` · `mattress` · `carpet` · `car`. Les rideaux ont été retirés en septembre 2026 : difficiles à traiter à la machine, sans demande et sans rentabilité.

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

## Images Open Graph

`public/og/<slug>.jpg` en 1200x630. Le site prend `og/<slug>-<langue>.jpg`, sinon `og/<slug>.jpg`, sinon l'OG par défaut de la langue (`og-default-*.jpg`), qui ne montre aucune photo et liste les sept services. Une photo brute de galerie ne sert pas d'image de partage, elle n'a ni texte ni logo ; elle reste en revanche la vignette de la carte du service. Détails et specs dans `public/og/README.md`. Les douze OG se régénèrent avec `node scripts/make-og.mjs`.

Les OG historiques (`og-image-*.jpg`, `og-hotels-*.jpg`) restent à la racine de `public/` : elles sont en cache chez Facebook et WhatsApp et ont servi en prospection, les renommer casserait les aperçus déjà partagés.

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
  (bg|en|ru)/privacy       politique de confidentialité, texte dans privacy.*
  sitemap.ts               sitemap généré au build (33 URLs)

components/
  Navbar  Hero  LeadForm  Services  HowWeWork  BeforeAfter  WhyUs
  ForRentals  Quote  Reviews  FAQ  Contact  Footer  WhatsAppFAB  Icon
  Technology  Comparison        ← plus rendus, réservés à la page textile (phase 2)
  hotels/                       ← composants de la page /business

lib/gallery.ts               scan de public/gallery/<slug>/
lib/schema.ts                JSON-LD LocalBusiness (@id #business) et Service, source unique
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
- **L'URL est la seule source de vérité.** L'ancienne mémorisation en localStorage (`wetdry_lang`) a été supprimée : elle affichait la home bulgare en anglais à tout visiteur ayant cliqué EN une fois, alors que Google avait indexé du bulgare sur cette URL. Le provider purge la clé résiduelle au montage.
- Le sélecteur de langue préserve la page courante : `/business` mène à `/en/business`.
- hreflang déclaré dans `alternates.languages` de chaque layout et de chaque page, et dans `app/sitemap.ts`. Le sélecteur de langue et la nav sont de vrais liens `<a href>`.

---

## Variables d'environnement

```bash
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
| LeadForm CTA primaire | WhatsApp | WhatsApp | Envoi Resend |

Sur mobile, **WhatsApp est le seul bouton d envoi** des deux formulaires : le client écrit depuis son propre numéro, donc aucune validation ne bloque le clic.

Sur desktop, les deux formulaires **postent sur `/api/contact`**. Le téléphone y est obligatoire, sans lui le lead est injoignable. L adresse email est affichée en texte simple sous le bouton, pour qui préfère écrire lui-même. Plus aucun `mailto:` ne sert de soumission : il dépendait de la messagerie configurée chez le visiteur et perdait des leads en silence.

---

## Avis clients

Notion a été débranché en novembre 2026. Les avis sont recopiés à la main dans `reviews.items` des trois JSON : texte d origine mot pour mot, sans traduction (`text`, `textLang`), `source` (`google` ou vide), `date` (mois approximatif). `Reviews.tsx` garde le slider (hauteur fixée sur l avis le plus long, la page ne saute pas) et ajoute le badge « 5,0 sur Google » + lien vers la fiche. Pour changer les avis : nouvelle capture de la fiche Google, recopier, supprimer la capture. Aucun `aggregateRating` dans le JSON-LD : Google ignore les avis auto-déclarés.

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
npm run lint     # controle de types seul, rapide, n ecrit pas dans .next
npm run build    # obligatoire avant tout push
git push origin main
```

**Le bundler est epingle sur webpack** (`--webpack` dans les scripts `dev` et `build`). Turbopack, devenu le defaut en Next 16, echoue a collecter les pages sur les routes dynamiques imbriquees dans un route group : `Cannot find module for page: /en/services/[slug]`. A retester a chaque montee de Next, et a retirer quand ce sera corrige.

`agentRules: false` dans `next.config.js` empeche Next de reecrire une section dans ce fichier a chaque `next dev`.

Ne jamais lancer `npm run build` pendant qu un `npm run dev` tourne : les deux ecrivent dans `.next` et le serveur de dev se retrouve a charger des chunks de production. Symptome : `Cannot find module ./xxx.js`. Remede : Ctrl+C, `rm -rf .next`, `npm run dev`.

Netlify redéploie automatiquement. Délai environ 1 à 2 minutes.

---

## SEO

- JSON-LD `LocalBusiness + ProfessionalService` généré par `lib/schema.ts` (`CleaningService` n'existe pas dans schema.org) : `legalName`, `taxID`, adresse du siège, point Google, `areaServed` (vallée + région), `knowsLanguage`, `hasOfferCatalog`, sans prix ni `aggregateRating`. Les `Service` des pages services renvoient au `@id`
- JSON-LD `FAQPage` généré depuis `faq.items`
- `metadata` title, description et keywords pilotés par `meta.*` du JSON
- `app/sitemap.ts` : 33 URLs générées au build, hreflang complet, 3 langues × (accueil, hub, business, privacy, 7 services). `x-default` pointe sur l'anglais partout (layouts, pages, sitemap)
- `public/robots.txt` : `Disallow: /api/`
- `public/llms.txt` : fiche business pour les LLM, à maintenir cohérente avec le site
- `/hotels` a été renommé `/business` en septembre 2026, 301 dans `netlify.toml`

---

## Zone de service

Vallée Bansko-Razlog sans frais de déplacement (communes de Bansko et Razlog, 16 localités, liste dans `lib/schema.ts`). Région, déplacement inclus dans le devis : Благоевград, Симитли, Белица, Якоруда, Гоце Делчев, Сандански. Pas de page ville pour l'instant (décision du 15/11/2026).

## Société

„ВОЛЯ ГРУП“ ЕДПК (VOLYA GRUP EDPK), ЕИК 208994501, гр. Банско 2770, ул. „Св. Иван“ № 5, ет. 1, ап. 6. Pas de TVA. Bloc légal dans le pied de page (`footer.legal`), obligatoire (loi bulgare sur le commerce électronique).

## Affirmations interdites

Rien de non vérifié : ni assurance (TODO : remettre « Застраховани » quand le contrat RC pro sera signé), ni « сертифицирани », ni durée de séchage chiffrée (on dit : séchage rapide avec ventilateur professionnel), ni délai de réponse ou d'intervention. Clément travaille seul.

---

## Réseaux et Google

- Instagram : https://www.instagram.com/wetdryclean.bansko/
- Facebook : https://www.facebook.com/profile.php?id=61588508592574
- TikTok : https://www.tiktok.com/@wetdryclean.bansko
- Avis Google : `https://g.page/r/CU4pAGZ9UMLpEBM/review`
- Images GBP : pas de prix, pas de téléphone, pas d'URL, pas de QR code, Google rejette

---

## Contacts

**Deux numéros affichés, un seul destinataire WhatsApp.**

| | Numéro | Rôle |
|---|---|---|
| Principal | +359 882 862 228 | Appels en anglais et français (Clément). **Tout WhatsApp arrive ici** (`contact.whatsappNumber` et `whatsapp.number`, identiques dans les 3 langues). Telegram et Viber sont mentionnés sur ce numéro. |
| Secondaire | +359 876 850 385 | Appels en bulgare et russe (Sofia). Affiché et cliquable en `tel:`, mais aucun WhatsApp ne lui est envoyé. |

Seul le principal figure dans le JSON-LD. Les deux sont dans `llms.txt`.

Telegram et Viber ne sont **pas** cliquables : `t.me` ne résout que si le numéro est trouvable par recherche, et `viber://` échoue en silence sur un navigateur desktop. Ils sont mentionnés en texte via `contact.messaging`.

Conséquence assumée : un client bulgare qui écrit sur WhatsApp arrive sur le numéro anglais.

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

## Pages services

Route dynamique `app/<groupe>/services/[slug]/page.tsx` avec `generateStaticParams` alimenté par `services.items`. Ajouter un service se fait entièrement dans les JSON : une entrée dans `services.items` (avec `key`, `slug`, `icon`) et une dans `servicePages`, plus la clé dans l'enum de `/api/contact` et un dossier de galerie. Aucun fichier de route à créer.

Chaque page rend : hero avec `LeadForm` pré-rempli sur le service, liste `includes`, galerie du dossier `public/gallery/<slug>/`, `HowWeWork`, FAQ propre au service, `Quote`, liens vers les autres services, `Contact`. La page `upholstery-cleaning` rend en plus `Technology` et `Comparison`.

Schemas : `Service` et `FAQPage` sont injectés par la page, pas par le layout. **Le `FAQPage` de la home vit dans les pages home**, pas dans les layouts, sinon toutes les pages porteraient la FAQ de l'accueil et les pages services en auraient deux.

Les `metadata.title` des pages services et business utilisent `{ absolute: ... }` : le template du layout ajoute déjà « | Wet&Dry Cleaning Банско » et doublerait le suffixe.

Le sitemap est généré par `app/sitemap.ts` depuis `services.items`.

## Reste à faire

Photos avant/après des six nouveaux services, dans leurs dossiers de galerie. C est le blocage principal : Google a refusé l élargissement de la fiche Business faute de preuves sur le site.

Ensuite : OG dédiées par service, Lighthouse mobile jamais mesuré, RC professionnelle à confirmer avant de continuer à afficher « assurés », et re-soumission de la fiche Google catégorie par catégorie au fur et à mesure des photos.

La limitation de débit de `/api/contact` vit en mémoire de fonction serverless. Un bot distribué sur plusieurs IP passe à travers. À remplacer par un stockage partagé (Netlify Blobs, Upstash) seulement si du spam arrive réellement.
