# Simulateur IA — Wet&Dry Cleaning Bansko

**Date :** 2026-06-04  
**Statut :** Approuvé  
**Branche :** `feature/simulator`

---

## Objectif

Permettre à un visiteur d'uploader une photo de son meuble sale et de voir une simulation de ce meuble après nettoyage, via l'API fal.ai (FLUX img2img). Objectif hybride : wow factor immédiat + lead capture soft via WhatsApp.

---

## Architecture

### Nouveaux fichiers

```
components/
  SimulatorModal.tsx     ← composant modal partagé (section + FAB)
  SimulatorSection.tsx   ← section after BeforeAfter, ouvre le modal
  SimulatorFAB.tsx       ← bouton flottant mobile, ouvre le même modal
app/api/simulate/
  route.ts               ← route serverless, appelle fal.ai
```

### Fichiers modifiés

```
app/page.tsx             ← ajout <SimulatorSection /> et <SimulatorFAB />
app/en/page.tsx          ← idem
content/bg.json          ← ajout clé "simulator"
content/en.json          ← ajout clé "simulator"
.env.local               ← ajout FAL_KEY
```

### Insertion dans la page

```
BeforeAfter
→ SimulatorSection   ← NOUVEAU (entre BeforeAfter et WhyUs)
WhyUs
...
```

`SimulatorFAB` s'insère en dehors du flux, position fixe bottom-right, visible `lg:hidden`.

---

## Route API `/api/simulate`

**Méthode :** POST  
**Body :** `{ image: string (base64 dataURL), type: "canape" | "fauteuil" | "matelas" | "kilim" }`  
**Réponse succès :** `{ resultUrl: string }`  
**Réponse erreur :** `{ error: string }`

### Validations

| Condition | Code HTTP | Message |
|---|---|---|
| Fichier > 5MB | 400 | `tooLarge` |
| Format non supporté | 400 | `invalidFormat` |
| Honeypot rempli (bot) | 400 | `generic` |
| Rate limit fal.ai natif | 429 | `rateLimit` |
| Erreur fal.ai / timeout | 503 | `generic` |
| FAL_KEY manquant | 500 | `generic` (log serveur) |

### Appel fal.ai

- **Modèle :** `fal-ai/flux/dev/image-to-image`
- **strength :** `0.5` (préserve structure, nettoie l'apparence)
- **Prompt dynamique :** `"clean spotless [type], same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality"`
- **Negative prompt :** `"stains, dirt, damage, wrinkles, dark spots, discoloration"`
- **Timeout :** 45s

### Rate limiting

Les Netlify Functions sont stateless — pas de compteur en mémoire persistant entre les requêtes. Approche sans état :
- **Honeypot field** dans le formulaire (`name="website"`, caché CSS, vérifié serveur) — bloque les bots
- **Validation stricte** du Content-Type et de la taille avant tout appel fal.ai
- **fal.ai rate limits natifs** : la clé API a ses propres limites côté fal.ai
- Pour un business local à faible trafic, c'est suffisant. Un vrai rate-limit (ex: Upstash Redis) peut être ajouté en V2 si nécessaire.

---

## Composants

### SimulatorModal.tsx

Machine à états : `IDLE → UPLOADING → PROCESSING → RESULT → ERROR`

**IDLE**
- Zone de drop (drag & drop + clic) pour la photo
- 4 boutons de sélection : Canapé / Fauteuil / Matelas / Kilim
- Bouton "Lancer" disabled tant que photo + type non sélectionnés
- Preview de la photo dès sélection

**PROCESSING**
- Barre de progression fake : 0→100% en 20s
- Copy rotatif toutes les 5s (via `processing` array du JSON)

**RESULT**
- Slider avant/après (même pattern que `BeforeAfter.tsx`)
- CTA primaire : bouton WhatsApp vert  
  Message pré-rempli : `"Bonjour, j'ai testé le simulateur avec mon [type]. Je voudrais un devis pour le nettoyage."`
- CTA secondaire : "Recevoir ce résultat sur WhatsApp"  
  → Input numéro → génère lien `wa.me/359876850385?text=...`  
  → Aucun stockage serveur

**ERROR**
- Message d'erreur traduit depuis les clés JSON
- Bouton "Réessayer" → retour à IDLE

### SimulatorSection.tsx

Section minimaliste avec `.section-pad`, badge doré, titre `font-display`, sous-titre, un seul bouton `.btn-gold` qui ouvre le modal. Wrapper `<div>` autour du bouton (règle CSS existante).

### SimulatorFAB.tsx

- Position fixe bottom-right, `lg:hidden` (même pattern que `WhatsAppFAB.tsx`)
- Couleur gold (`bg-gold`), icône ✨
- Se masque automatiquement quand l'utilisateur entre dans la zone de la `SimulatorSection` (IntersectionObserver)
- Ouvre `SimulatorModal`

---

## i18n — Clés JSON

```json
"simulator": {
  "badge": "ИИ Симулатор",
  "title": "Вижте резултата върху вашия мебел",
  "subtitle": "Качете снимка — ИИ ще покаже как изглежда след почистване",
  "cta": "Тествайте безплатно",
  "fabLabel": "Симулатор",
  "types": {
    "canape": "Диван",
    "fauteuil": "Фотьойл",
    "matelas": "Матрак",
    "kilim": "Килим"
  },
  "upload": {
    "label": "Добавете снимка",
    "hint": "JPG, PNG или WebP — макс. 5MB"
  },
  "processing": [
    "Анализ на тъканта…",
    "Премахване на петната…",
    "Реконструкция на влакната…",
    "Финализиране…"
  ],
  "result": {
    "title": "Ето вашия резултат",
    "ctaWhatsapp": "Резервирайте почистването",
    "ctaSave": "Получете резултата в WhatsApp",
    "phoneLabel": "Вашият номер",
    "phoneCta": "Изпрати →"
  },
  "error": {
    "generic": "Нещо се обърка. Опитайте отново.",
    "tooLarge": "Снимката е твърде голяма (макс. 5MB).",
    "rateLimit": "Твърде много опити. Опитайте след час.",
    "retry": "Опитайте отново"
  }
}
```

Même structure en `en.json` avec traductions anglaises.

---

## Variables d'environnement

```bash
FAL_KEY=...   # Clé API fal.ai — à ajouter dans .env.local ET Netlify (plus tard)
```

---

## Gestion d'erreurs

| Cas | Comportement |
|---|---|
| Fichier > 5MB | Erreur immédiate côté client, pas d'appel API |
| Format invalide | Erreur immédiate côté client |
| Timeout > 45s | État ERROR, bouton Réessayer |
| Réseau coupé | État ERROR, bouton Réessayer |
| Rate limit | État ERROR, message "réessayez dans une heure" |
| fal.ai down | État ERROR, message générique, log serveur |

## Hors scope (intentionnel)

- Stockage des images (éphémère — URL CDN fal.ai expire en 1h)
- Analytics des simulations
- Modération du contenu uploadé
- Mise en prod (branche locale uniquement pour l'instant)

---

## Dépendances à installer

```bash
npm install @fal-ai/client
```

---

## Coût estimé

~0,10€ par simulation. 100 simulations/mois ≈ 10€/mois.
