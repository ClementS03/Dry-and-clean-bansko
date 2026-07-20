# Changelog — Feature `ru-hotels-landing`

Récapitulatif complet du travail mergé sur `main` (branche `feature/ru-hotels-landing`).
Date : 2026-07-20. 45 commits.

---

## 1. Version russe (3e langue)

- **Nouveau route group `app/(ru)/`** — même pattern que `(en)` :
  - `app/(ru)/layout.tsx` — metadata RU, JSON-LD LocalBusiness/FAQ en russe, `<html lang="ru">`, `locale: ru_RU`, cache key unique `reviews-schema-ru`.
  - `app/(ru)/ru/page.tsx` — route `/ru`.
  - `app/(ru)/ru/hotels/page.tsx` — route `/ru/hotels`.
- **`content/ru.json`** — traduction complète (ton Вы, professionnel-chaleureux). Parité de clés stricte avec bg/en (18 clés top-level).
- **`context/LanguageContext.tsx`** — `type Lang = 'bg' | 'en' | 'ru'`, import `ru.json`, localStorage n'accepte QUE `bg`/`en` (le `/ru` a son URL comme source de vérité — pas de fuite RU sur l'accueil BG).
- **hreflang** — les 3 langues (`bg-BG`, `en`, `ru`, `x-default`) sur toutes les pages + sitemap.

## 2. Sélecteur de langue (Navbar)

- Dropdown **БГ / EN / RU** remplace l'ancien toggle unique.
- Desktop : ouverture au survol avec délai de fermeture 250ms (ne se referme plus si on descend lentement).
- Mobile : ouverture au clic + fermeture au clic extérieur (refs desktop/mobile séparées).
- **Changement de langue préserve la page courante** : sur `/hotels` → EN mène à `/en/hotels` (pas l'accueil).
- **Logo** ramène à l'accueil de la langue courante ; **liens d'ancre** fonctionnent depuis `/hotels` (naviguent vers accueil + section).

## 3. Page B2B `/hotels` (BG/EN/RU)

Landing autonome pour hôtels/guesthouses/Airbnb/restaurants. Ordre des sections (optimisé conversion) :
`Hero -> ForWho -> HowItWorks -> Pricing -> Reassurance -> SocialProof(Google) -> FAQ -> LeadForm -> CTA -> Extras`

Composants (`components/hotels/`) :
- `HotelsHero` — CTA desktop scrolle vers le formulaire (`#hotels-devis`), mobile ouvre WhatsApp.
- `HotelsForWho`, `HotelsHowItWorks`, `HotelsPricing` (contrats mensuels 400–2000€/mois, remise 3+, saisonnier, nuit resto), `HotelsReassurance` (séchage 2–4h, produits basse mousse, RC pro, facture).
- `HotelsSocialProof` — bouton avis Google (centré) vers la fiche Google Maps.
- `HotelsFAQ` — 8 questions B2B.
- `HotelsLeadForm` — 2 étapes : type d'établissement + **8 services** (canapés, matelas, chaises, banquettes, tapis, moquette, rideaux, autre) + unités -> étape contact. Mobile = WhatsApp (message structuré), desktop = email. Bouton retour visible.
- `HotelsCTA` — titre + sous-texte + bouton (WhatsApp mobile / email desktop).
- `HotelsExtras` — section discrète « services digitaux » (Google Business, avis NFC, photo/vidéo, **sites web**) + lien WhatsApp. **Uniquement sur /hotels.**
- Teaser sur l'accueil : `ForRentals` réduit à 3 bullets + carte lien vers `/hotels`.

## 4. Corrections de contenu (audit)

- **Garantie « résultat ou tu paies pas » retirée PARTOUT** (WhyUs, trust, ForRentals, FAQ prix, hotels) -> remplacée par carte **Assurance / RC pro** (WhyUs garde 6 cards). ATTENTION : la RC pro doit être active avant mise en avant.
- **💯 emoji** supprimé (bloc doublon WhyUs retiré).
- **« EUR and BGN »** retiré (BGN n'existe plus) — `currenciesAccepted: "EUR"` dans les 3 schemas.
- **Délai réponse « sous 24h » -> « en quelques heures »** partout (3 langues).
- **« dries in hours » -> « 2–4h »** (cohérence).
- **« 99.9% éliminés »** (fausse précision labo) -> « Removed deep down » / « Премахнати в дълбочина » / « Удаляются глубоко ».
- Héro trust : « Safe products » -> « Safe for kids & pets ».
- **Simulateur IA retiré** des 3 pages accueil (SimulatorSection + FAB).
- Typos corrigés : `аvis`->`отзиви`, `Ime`->`Име` (BG).
- RU : `Создано`->`Создано от`, verbe genré simulateur neutralisé, clé orpheline `contact.badge` supprimée.

## 5. WhatsApp par langue

- **EN -> +359 882 862 228** (avant : tombait sur le num BG).
- **RU -> +359 876 850 385** (num BG, choix retenu).
- BG -> +359 876 850 385.

## 6. Footer

- Bloc « services additionnels » **retiré de l'accueil** (services B2B sans sens pour particuliers) -> déplacé sur `/hotels` (section `HotelsExtras`).

## 7. SEO

- `public/sitemap.xml` — 6 URLs (`/`, `/en`, `/ru`, `/hotels`, `/en/hotels`, `/ru/hotels`) avec hreflang complet, lastmod 2026-07-19.
- Schema `CleaningService` ajouté au `@type` LocalBusiness (3 layouts).
- `netlify.toml` — retrait de `functions.timeout` (syntaxe invalide qui cassait le build sur le nouveau build image Netlify).

## 8. Open Graph — 6 images localisées (1200x630)

| Route | Fichier | Visuel |
|---|---|---|
| `/` | `og-image-bg.jpg` | Canapé avant/après empilé — « Като нови. » |
| `/en` | `og-image.jpg` | « Like new again. » |
| `/ru` | `og-image-ru.jpg` | « Как новые. » |
| `/hotels` | `og-hotels-bg.jpg` | Chambre d'hôtel propre — « Гостите забелязват чистотата. » |
| `/en/hotels` | `og-hotels.jpg` | « Your guests notice cleanliness. » |
| `/ru/hotels` | `og-hotels-ru.jpg` | « Гости замечают чистоту. » |

Design de marque (ink + or, Oswald). Accueil = avant/après du même canapé (angle identique). Hotels = chambre d'hôtel propre pleine hauteur.

---

## TODO post-merge (à faire par Clément)

1. **Search Console** — resoumettre le sitemap : `https://wetdrycleaningbansko.com/sitemap.xml`.
2. **Cache OG** — forcer le refresh sur opengraph.xyz / Facebook Debugger pour chaque URL avant de prospecter (WhatsApp cache agressivement).
3. **RC pro** — confirmer l'assurance active avant de laisser la carte « Застраховани / Fully insured » en avant.
4. **Relecture native RU** — `content/ru.json` (traduction IA), surtout la section hotels et les microcopies.
5. **Lighthouse mobile** — check non lancé cette session (objectif >= 90).

## Notes techniques

- `.superpowers/` (scratch SDD/brainstorm) est gitignoré mais un commit intermédiaire l'a embarqué — sans impact fonctionnel.
- Composants simulateur (`SimulatorSection`, `SimulatorFAB`, `SimulatorModal`), route `/api/simulate` et clés i18n `simulator.*` existent toujours mais ne sont plus rendus (code mort, non bloquant — supprimables plus tard).
- Clés JSON `footer.extras`/`extrasTitle` restent dans les 3 JSON mais ne sont plus utilisées (le Footer ne les rend plus).
