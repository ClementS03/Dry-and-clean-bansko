# SEO Roadmap — Wet&Dry Cleaning Bansko

## ✅ Implémenté

### Structured Data (JSON-LD)
- **LocalBusiness** : nom, téléphones, adresse, GPS, horaires, prix, areaServed (Bansko/Razlog/Dobrinishte/Banya)
- **AggregateRating** : branché sur les avis Notion (revalidate 1h) → étoiles dans la SERP Google
- **FAQPage** : toutes les questions de la section FAQ → rich snippets Google
- OG tags + Twitter card
- Sitemap.xml + robots.txt
- Geo meta tags (geo.region, geo.position, ICBM)

### Keywords metadata (BG + EN)
- BG : пране мебели/диван/килим/матрак Банско, пране на място, Разлог, Добринище, Баня
- EN : carpet/sofa/upholstery/furniture cleaning Bansko, Razlog, Banya Bulgaria

### Images
- Alt text descriptif sur toutes les images before/after : `"{label} — {Преди/След}"`
- Bug corrigé : l'image "after" utilisait le label "before" comme alt

---

## 🔲 À faire (priorité décroissante)

### 1. Google Business Profile — CRITIQUE
- Créer/revendiquer la fiche sur business.google.com
- Pas besoin d'être enregistré en société bulgare
- Vérification : carte postale ou vidéo vérification
- Catégories : "Carpet cleaning service" + "Upholstery cleaning service"
- Uploader les photos before/after du site
- Lien vers wetdrycleaningbansko.com
- Une fois fait : demander aux clients d'y laisser des avis (lien direct)

### 2. Encourager les avis Google
- Ajouter un lien "Laissez un avis Google" dans le footer ou Contact
- Format : `https://g.page/r/[PLACE_ID]/review`
- Message WhatsApp post-service : "Merci ! Si vous êtes satisfait, un avis Google nous aiderait beaucoup 🙏 [lien]"

### 3. Citations locales — cohérence NAP
- Même Nom / Adresse / Téléphone partout
- Annuaires BG à viser : pages.bg, pochivka.bg, Tripadvisor, Booking.com partenaires

### 4. Images WebP
- Next.js Image sert déjà WebP automatiquement aux navigateurs compatibles ✅
- Les images source (JPEG) pourraient être optimisées mais c'est mineur

### 5. Contenu textuel enrichi
- Sections très visuelles = peu de texte indexable
- Option future : page /services dédiée (diван, килим, матрак) avec contenu long

### 6. Vidéos (plus tard)
- Convertir MOV → MP4 avec ffmpeg ou Handbrake
- Uploader sur YouTube non-listé
- Embed dans la section Technology
- Voir brainstorm complet dans la note FreelanceOS "Wet & Dry — Business Documentation"

---

## ❌ Feed Instagram — Déconseillé
- API Meta très restrictive, widgets tiers 10-30€/mois
- Remplacé par : lien Instagram simple dans le footer
- Les avis Google ont 10x plus d'impact pour le SEO local
