# 📖 Guide de mise à jour — Wet&Dry Cleaning Bansko

## 🗂️ Structure du projet

```
wet-dry-bansko/
├── content/
│   ├── bg.json          ← 🇧🇬 TOUT le contenu bulgare
│   └── en.json          ← 🇬🇧 TOUT le contenu anglais
├── public/
│   ├── og-image.jpg     ← Image Open Graph (1200×630px)
│   ├── favicon.ico      ← Favicon navigateur
│   ├── icon-192.png     ← Icône Android/PWA
│   ├── icon-512.png     ← Icône Android/PWA large
│   ├── apple-touch-icon.png  ← Web-clip iOS
│   ├── machine.jpg      ← Photo de ta machine Kärcher
│   ├── before-sofa.jpg  ← Photo avant diwan
│   ├── after-sofa.jpg   ← Photo après diwan
│   ├── before-mattress.jpg
│   ├── after-mattress.jpg
│   ├── before-carpet.jpg
│   └── after-carpet.jpg
├── app/
│   ├── layout.tsx       ← SEO, JSON-LD, métadonnées
│   └── page.tsx         ← Ordre des sections
└── components/          ← Un fichier par section
```

---

## ✏️ Modifier le contenu (textes, prix, contacts)

**→ Ouvre `content/bg.json` pour le bulgare, `content/en.json` pour l'anglais.**

### Changer les prix

```json
// Dans pricing.items, trouve l'article et change "price"
{
  "icon": "🛋️",
  "name": "Диван / Кресло",
  "price": "от 30€",   ← Change ici
  "note": "според размер"
}
```

### Changer les numéros de téléphone

```json
// Dans "contact" :
"phoneEN": "+359 882 862 228",
"phoneBG": "+359 876 850 385",
"whatsappNumber": "359876850385",  ← Sans + ni espaces
```

### Changer le message WhatsApp pré-rempli

```json
// Dans "whatsapp" :
"message": "Здравейте! Бих искал/а да получа оферта за пране на мебели."
```

### Ajouter/retirer une FAQ

```json
// Dans faq.items, ajoute un objet :
{
  "q": "Ta question ?",
  "a": "La réponse complète ici."
}
```

### Changer les zones desservies

```json
// Dans contact :
"area": "Банско · Разлог · Добринище · Белица · Якоруда"
```

---

## 🖼️ Ajouter les photos

### Photos avant/après (slider interactif)

Dépose dans `/public/` :
- `before-sofa.jpg` / `after-sofa.jpg`
- `before-mattress.jpg` / `after-mattress.jpg`  
- `before-carpet.jpg` / `after-carpet.jpg`

**Format recommandé :** 800×450px, JPG optimisé, < 150 Ko

Puis dans `components/BeforeAfter.tsx`, remplace le placeholder par :
```tsx
// Ligne ~55 : remplace le <div> placeholder par :
<Image src={pair.before} alt="Avant nettoyage" fill className="object-cover" />

// Ligne ~73 : idem pour after :
<Image src={pair.after} alt="Après nettoyage" fill className="object-cover" />
```

Ajoute l'import en haut du fichier :
```tsx
import Image from 'next/image'
```

### Photo de la machine (Technology section)

Dépose `machine.jpg` dans `/public/`, puis dans `components/Technology.tsx` :
```tsx
// Cherche le commentaire TODO et remplace le <div> par :
import Image from 'next/image'
// ...
<Image 
  src="/machine.jpg" 
  alt="Kärcher Puzzi 10/1" 
  fill 
  className="object-cover rounded-sm" 
/>
```

---

## 🎨 Créer les icônes & OG image

### Option simple (Canva gratuit)

1. Va sur **canva.com**
2. Crée un design **1200×630px** pour l'OG image
   - Fond noir (`#0A0A0A`), texte doré (`#F5C400`)
   - Logo + "Пране на мебели Банско" + numéros de téléphone
3. Exporte en JPG → `/public/og-image.jpg`

### Icônes

1. Crée un carré **512×512px** avec ton logo sur fond noir
2. Exporte en PNG → `/public/icon-512.png`
3. Redimensionne à 192px → `/public/icon-192.png`
4. Redimensionne à 180px → `/public/apple-touch-icon.png`
5. Convertis le 32×32px en ICO → `/public/favicon.ico`
   (utilise **favicon.io** ou **realfavicongenerator.net**)

---

## 🚀 Déployer sur Vercel

### Première fois

```bash
# 1. Installe Vercel CLI
npm i -g vercel

# 2. Dans le dossier du projet
cd wet-dry-bansko
vercel

# 3. Suis les instructions (login, project name, etc.)
# → Ton site sera en ligne en 2 minutes
```

### Mettre à jour après des changements

```bash
# Modifie ton JSON, puis :
vercel --prod
```

### Avec GitHub (recommandé pour auto-deploy)

1. Push le projet sur GitHub
2. Connecte le repo sur **vercel.com/new**
3. À chaque `git push`, le site se met à jour automatiquement ✨

---

## 🌐 Configurer le domaine

### Après avoir acheté `wetdrybg.com`

1. Dans Vercel → ton projet → **Settings → Domains**
2. Ajoute `wetdrybg.com` et `www.wetdrybg.com`
3. Copie les DNS records indiqués par Vercel
4. Dans ton registrar (Namecheap, GoDaddy, etc.) → configure les DNS
5. Attend 15-30 min → ✅ site live sur ton domaine

### Mettre à jour les URLs dans le code

Dans `app/layout.tsx`, cherche et remplace `https://wetdrybg.com` par ton vrai domaine.
Dans `public/sitemap.xml`, fais de même.
Dans `public/robots.txt`, fais de même.

---

## 📱 Intégrer un bot WhatsApp (étape future)

Le bouton WhatsApp est déjà configuré pour ouvrir `wa.me/359876850385`.

Pour ajouter un bot :
1. **Twilio** ou **360dialog** → obtiens un numéro WhatsApp Business API
2. Connecte un service comme **ManyChat** ou **Landbot**
3. Remplace simplement le numéro dans `content/bg.json` et `content/en.json`

---

## ⚡ Ajouter une vidéo avant/après

Dans n'importe quelle section, tu peux ajouter :
```tsx
<video 
  autoPlay 
  muted 
  loop 
  playsInline
  className="w-full rounded-sm"
  src="/video-beforeafter.mp4"
/>
```

Dépose ton MP4 dans `/public/video-beforeafter.mp4`.

---

## 🔍 SEO local — checklist

- [ ] Crée une fiche **Google Business Profile** (anciennement Google My Business)
  - Catégorie : "Carpet & Upholstery Cleaning Service"
  - Ajoute les photos, horaires, lien vers le site
- [ ] Inscris-toi sur **Yelp**, **TripAdvisor** (utile pour Bansko, destination touristique)
- [ ] Demande à tes premiers clients des **avis Google**
- [ ] Partage le site sur les groupes Facebook locaux de Bansko/Razlog
- [ ] Crée une page **Facebook Business** avec le lien du site

---

## 📞 Contacts techniques

| Besoin | Outil |
|---|---|
| Hébergement | Vercel (gratuit pour commencer) |
| Domaine | Namecheap / GoDaddy (~10€/an) |
| Emails pro | Zoho Mail gratuit ou Google Workspace |
| Analytics | Vercel Analytics (gratuit) ou Google Analytics |
| WhatsApp Bot | ManyChat / Landbot |

---

*Site généré avec Next.js 14, Tailwind CSS, TypeScript. Contenu géré via JSON.*
