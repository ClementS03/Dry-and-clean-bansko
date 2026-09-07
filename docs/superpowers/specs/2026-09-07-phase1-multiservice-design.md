# Spec — Phase 1 : dé-pricing + bascule multi-services

Branche : `feat/depricing-cleanup`
Date : 2026-09-07

Les textes de cette spec sont donnés en anglais pour validation. Le bulgare et le russe en sont dérivés à l'implémentation, avec parité stricte des clés.

## Contexte

Le business passe de « nettoyage textile » à « nettoyage professionnel complet », avec une cible désormais principalement B2B. Google a rejeté l'élargissement de la fiche Business : le site ne prouve aucun des nouveaux services.

Phase 1 = assainir le site et basculer sa structure sur les 7 services. Phase 2 = les 7 pages services, puis re-soumission de la fiche catégorie par catégorie.

Les prix sortent du site : en B2B ils se négocient au devis, et une grille publique bloque la négociation.

## Les 7 services

Un seul slug anglais par service, partagé par les trois langues, comme le font déjà `/hotels` et `/business`. Un slug bulgare collerait marginalement mieux aux requêtes locales, mais Google pondère très faiblement les mots-clés d'URL et la cohérence de routage vaut davantage ici.

| Clé | Service (EN) | Slug |
|---|---|---|
| `textile` | Upholstery & textile cleaning | `upholstery-cleaning` |
| `deep` | Deep cleaning | `deep-cleaning` |
| `renovation` | Post-construction cleaning | `post-construction-cleaning` |
| `turnover` | Guest turnover cleaning | `airbnb-turnover` |
| `windows` | Window & glass cleaning | `window-cleaning` |
| `pressure` | Pressure washing | `pressure-washing` |
| `industrial` | Industrial & large-surface cleaning | `industrial-cleaning` |

Hub des services en phase 2 : `/services` · `/en/services` · `/ru/services`.

`textile` porte 5 sous-objets, qui ne sont pas des services : `sofa` · `mattress` · `carpet` · `curtains` · `car`.

Le nettoyage récurrent n'est pas un service. C'est une modalité de contrat, portée par la page Business et par un champ « fréquence » dans le formulaire.

Les clés internes sont stables et servent d'identifiants partout : formulaire, email, préremplissage, URL.

## Nouvelle home

```
Hero  →  Services (7)  →  How we work  →  Gallery  →  Why us
      →  Business teaser  →  Quote  →  Reviews  →  FAQ  →  Contact
```

Sortent de la home : `Technology` et `Comparison`. Les deux décrivent l'injection-extraction, technique d'un seul service sur sept. Les clés JSON `technology.*` et `comparison.*` sont conservées intactes et rebranchées sur `/services/upholstery-cleaning` en phase 2. Les composants restent dans `components/`, simplement plus importés par la home.

Entre en remplacement : `HowWeWork`, bloc générique en 4 étapes valable pour les 7 services.

## Nav et footer

Nav : `Services` (`#services`) · `For business` (`/business`) · `Quote` (`#pricing`) · `FAQ` (`#faq`) · `Contact` (`#contact`).
En phase 2, `Services` pointera vers le hub `/services`.

Clé `nav.technology` supprimée, `nav.prices` renommée `nav.quote`, `nav.business` ajoutée. Footer aligné sur les mêmes 5 entrées.

## Section Services

7 cartes. La carte `textile` liste ses 5 objets sous sa description. Pas de lien tant que les pages n'existent pas ; le slug est déjà dans le JSON pour que la phase 2 n'ait qu'à activer le `<Link>`.

Grille `sm:grid-cols-2 lg:grid-cols-3`. La carte `textile` prend `lg:col-span-2` en tête : c'est le service porteur, il mérite la largeur double, et ça donne des lignes 2+1 / 3 / 3 sans trou.

Textes à valider :

- **Upholstery & textile cleaning** — "Sofas, mattresses, carpets, curtains and car seats. We clean them at your place, with an injection-extraction machine."
  Objets : Sofa & armchair · Mattress · Carpet & rug · Curtains · Car seats
- **Deep cleaning** — "Top-to-bottom cleaning of flats and houses. Kitchen, bathroom, floors, dust on every surface."
- **Post-construction cleaning** — "Plaster dust, paint marks and glue residue. We hand the place back ready to move into."
- **Guest turnover cleaning** — "For rental flats and guesthouses. We work in the window between check-out and check-in."
- **Window & glass cleaning** — "Windows, shopfronts and glass façades, inside and out. We reach the awkward spots too."
- **Pressure washing** — "Terraces, driveways, yards and façades. High pressure against moss, mud and green build-up."
- **Industrial & large-surface cleaning** — "Warehouses, production halls and retail floors. We work to a schedule, outside your opening hours."

## Section « How we work »

Quatre étapes, service-agnostiques :

1. **Ask** — "Tell us what needs cleaning. A photo helps."
2. **Offer** — "You get a price within hours. We fix it before we start."
3. **We come to you** — "We bring all the equipment. You move nothing."
4. **Done** — "You pay after the job, cash or bank transfer. Invoice provided."

## Section Quote (ex-Pricing)

Ancre `#pricing` conservée pour ne casser aucun lien existant. Clés `quote.*`.

Quatre facteurs qui font varier le prix : type de service · surface ou quantité · degré de salissure · fréquence.
Trois lignes de réassurance : prix fixé avant le début · paiement après la prestation · facture émise.
CTA : scroll vers `#contact`, comme aujourd'hui. Pas de WhatsApp desktop — le repo a déjà tranché contre (commit `c3d2788`, WhatsApp Web peu fiable sur PC).

Distinction avec « How we work » : celui-ci décrit le déroulé, celui-là ce qui fait bouger le prix. Aucun recouvrement de contenu.

## Formulaire

Étape 1 :
1. `Private` / `Business` — segmented control.
2. Les 7 services, multi-sélection.
3. Si `textile` coché : sous-bloc des 5 objets qui se déplie inline. Pas de troisième étape.
4. Si `Business` coché : fréquence `One-off` / `Recurring`.
5. Champ détails à placeholder dynamique — objets textile → "1 three-seater sofa, 2 mattresses" ; services de surface → "~80 m², 3 rooms, 40 m² terrace". Si les deux natures sont cochées, le placeholder combine les deux exemples.

Étape 2 : inchangée (nom, téléphone, localité).

Prop `preselect?: ServiceKey` pour la phase 2 : les pages services rendront `<LeadForm preselect="windows" />`. Pas de `useSearchParams` — en Next 15 ça force un bail-out du pré-rendu statique sans `<Suspense>`. La query arrivera en phase 2 avec le wrapper.

Honeypot, logique deux étapes, arbitrage WhatsApp mobile / email desktop : inchangés.

Le formulaire B2B de la page Business reçoit les mêmes 7 services.

## API contact

Le client envoie désormais `serviceKeys` (identifiants) en plus de `service` (libellés traduits, pour l'email), plus `audience` et `frequency`.

Validation serveur : `serviceKeys` filtré sur l'enum des 8 clés de service plus les 5 objets textile ; requête rejetée en 422 si la liste filtrée est vide. `audience` ∈ {`private`,`business`}, `frequency` ∈ {`once`,`recurring`,`""`}.

Plafond de `sanitize(service)` porté de 300 à 600 caractères : avec 7 services et 5 objets cochés, libellés cyrilliques et emojis, la chaîne actuelle est tronquée silencieusement.

Email : sujet préfixé `[B2B]` quand `audience === 'business'`, lignes fréquence et objets textile ajoutées au tableau.

## Renommage `/hotels` → `/business`

Routes `/business` · `/en/business` · `/ru/business`.

Redirections 301 dans `netlify.toml` depuis les trois anciennes URLs. Elles sont dans le sitemap soumis depuis le 19 juillet et ont servi en prospection avec des OG dédiées ; sans redirection elles renvoient 404 et affichent des erreurs en Search Console au moment de la re-soumission de la fiche.

À mettre à jour : `sitemap.xml`, les `alternates.languages` des trois pages, `HotelsPricing` (lien `/#pricing`), `ForRentals` (lien vers la page), `Navbar` (nouvelle entrée).

Les composants restent dans `components/hotels/`. Renommer le dossier ajouterait du bruit au diff sans bénéfice.

## Hero

Quatre badges : `🏠 We come to you` · `⚡ Offer within hours` · `🏨 We work with hotels and businesses` · `✅ Insured, invoice provided`.
La durée de séchage sort des badges : elle ne concerne que le textile.

Title élargi, mot-clé porteur en tête. BG : `Пране на мебели и професионално почистване Банско`. EN : `Upholstery & professional cleaning Bansko`.
Nouvelle accroche de description, en remplacement de « Prices from 20€ » : "Free offer within a few hours".

## Séchage

Pas de remplacement global. « 2–4 hours » reste partout où il est question d'injection-extraction : `technology.*`, `comparison.rows[3]`, FAQ textile, réassurance Business.

Deux endroits deviennent génériques et perdent la mention : le badge du hero, et `whyUs.items[2]` qui couvre maintenant 7 services et devient "Most jobs take 1 to 3 hours".

## Galerie

`lib/gallery.ts` — `getGalleryPairs(slug)` lit `public/gallery/<slug>/`, apparie `before-N` / `after-N`, trie numériquement (`before-10` après `before-2`), accepte `.jpg` `.jpeg` `.png` `.webp`, retourne `[]` si le dossier est absent ou vide. Appelée depuis les pages, qui sont des Server Components, et passée en props.

`BeforeAfter` reçoit `pairs` en props. Slider draggable identique. Section masquée entièrement si zéro paire, sans placeholder.

Migration : `git mv` des 6 fichiers actuels plus la paire matelas vers `public/gallery/home/` en `before-1..4` / `after-1..4`. Ordre : sofa, carpet, carpet2, mattress. Cap à 6 paires affichées sur la home.

Libellés : `gallery.pairs[i].label` conservé, indexé sur la position. Un fichier déposé sans libellé correspondant affiche un en-tête vide plutôt que de casser.

Les dossiers des pages services utilisent les mêmes slugs : `public/gallery/window-cleaning/`, `public/gallery/pressure-washing/`, etc.

Convention documentée dans `CLAUDE.md` : déposer les jpg dans `public/gallery/<slug>/`, commiter, c'est en ligne.

## Code mort supprimé

`SimulatorSection` · `SimulatorFAB` · `SimulatorModal` · `app/api/simulate/route.ts` · dépendance `@fal-ai/client` · bloc `simulator.*` dans les 3 JSON · `footer.extrasTitle` et `footer.extras` dans les 3 JSON.

## FAQ

Les trois réponses qui citent des prix sont réécrites, pas supprimées : `items[4]` (combien ça coûte), `items[6]` (prix d'un canapé, question à fort volume), `items[8]` (tarifs de groupe B2B). Angle : offre sur photos, prix fixé avant le début, paiement après la prestation.

Deux questions ajoutées pour couvrir le nouveau périmètre : "What do you clean besides upholstery?" et "Do you work with companies and large premises?". La FAQ alimente le schema `FAQPage`, ces ajouts y entrent automatiquement.

## SEO

`hasOfferCatalog` : les `Offer` sont conservés sans `price` ni `priceCurrency`, et la liste passe de 5 offres textile à 7 services. `priceRange "€€"` conservé, c'est une fourchette et non un tarif.

`sitemap.xml` : URLs `/business` à la place de `/hotels`, `lastmod` du jour.

`llms.txt` réécrit : sans Belitsa, sans BGN, sans la garantie « résultat ou vous ne payez pas » (retirée du site en juillet), sans « réponse en 1 heure », sans prix. Avec les 7 services.

## Documentation

`CLAUDE.md` réécrit sur l'état réel : 3 langues, route groups, `/business`, les 7 services et leurs clés, la convention galerie, les pièges CSS.
`GUIDE.md` supprimé — il documente Vercel, deux langues et cite le nom de la machine, interdit par les règles du projet.

## Copywriting

Langue humaine et directe. Phrases courtes. Pas de tirets cadratins comme ponctuation de style, pas de constructions « non seulement…, mais aussi », pas de triades décoratives, pas de superlatifs vides. Ce qu'un artisan écrirait à un client.

## Hors périmètre

Les 7 pages `/services/<slug>` et leurs 21 textes, le hub `/services`, les galeries par service, le préremplissage par query string, la refonte du formulaire B2B au-delà de sa liste de services, le design system, les OG images des nouvelles pages.

## Vérification finale

- `grep -rE "20€|25€|4€|15€|400|лв|BGN" content/ app/ components/ public/` → zéro
- `grep -rn "hotels" app/ components/ public/sitemap.xml` → uniquement les chemins `components/hotels/` et les redirections
- Parité des clés entre `bg.json`, `en.json`, `ru.json`
- `npm run build` vert
