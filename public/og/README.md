# Images Open Graph

L'image qui s'affiche quand quelqu'un colle un lien du site dans WhatsApp, Facebook, LinkedIn ou un SMS. C'est souvent la première chose qu'un prospect voit du site.

---

## Ce que chaque page affiche aujourd'hui

| Pages | Image | Contenu |
|---|---|---|
| Accueil (`/`, `/en`, `/ru`) | `og-image-*.jpg` | Canapé avant/après |
| Page textile (les 3 langues) | `og/upholstery-cleaning-*.jpg` | Canapé avant/après, badge séchage |
| Hub et les 6 autres services | `og-default-*.jpg` | **Aucune photo**, la liste des 7 services |
| Page business (les 3 langues) | `og-hotels-*.jpg` | Chambre d'hôtel |

Le canapé ne sert que là où il vend quelque chose. Une page vitres ou haute pression ne doit pas se partager avec un salon.

---

## Ajouter une image pour un service

Dépose le fichier ici, nommé d'après le slug du service. Tu commit, tu push, c'est en ligne. Aucun code ni JSON à toucher.

```
public/og/window-cleaning.jpg       ← sert les 3 langues
```

Si tu veux un texte traduit, une image par langue :

```
public/og/window-cleaning-bg.jpg    ← /services/window-cleaning
public/og/window-cleaning-en.jpg    ← /en/services/window-cleaning
public/og/window-cleaning-ru.jpg    ← /ru/services/window-cleaning
```

Les slugs disponibles : `upholstery-cleaning` · `deep-cleaning` · `post-construction-cleaning` · `airbnb-turnover` · `window-cleaning` · `pressure-washing` · `industrial-cleaning`, plus `services` pour le hub.

### L'ordre de priorité

1. `public/og/<slug>-<langue>.jpg`
2. sinon `public/og/<slug>.jpg`
3. sinon l'OG par défaut de la langue

Tu ne peux donc pas casser un aperçu en oubliant un fichier. Chaque image ajoutée remplace juste un cran moins bon.

Une photo brute de la galerie ne sert **pas** d'image de partage : sans texte ni logo, elle donne moins envie de cliquer qu'une carte dessinée. Elle reste en revanche la vignette de la carte du service sur l'accueil et le hub, où elle est à sa place.

---

## Les specs

- **1200 × 630 pixels**, exactement. C'est ce qu'attendent WhatsApp, Facebook et LinkedIn.
- JPG, moins de 300 Ko.
- Une **photo réelle du service**. C'est ce qui fait cliquer : une terrasse verte de mousse à côté de la même terrasse propre vaut mieux que n'importe quel texte.
- Une phrase courte en Oswald, blanc ou crème, sur fond sombre pour rester lisible.
- Le logo en petit dans un coin, pas au centre.
- Le nom de domaine en bas, en doré, comme sur les images existantes.
- Le texte reste **loin des bords** : certaines plateformes rognent jusqu'à 10 % sur les côtés.

**L'exception, c'est l'OG par défaut.** Elle n'a aucune photo et c'est assumé : elle remplace l'image manquante par de l'information utile, la liste des sept services. Un fond uni avec seulement un logo ne marcherait pas, une liste de prestations si.

### Ce qu'il ne faut pas y mettre

Pas de prix. Pas de numéro de téléphone. Pas de QR code. Le site n'affiche aucun tarif, une OG qui en annonce un le contredit.

Attention à ne pas confondre avec les **visuels Google Business**, plus stricts : eux n'acceptent ni prix, ni téléphone, ni URL, ni QR code. Sur une OG, le domaine en bas est normal et souhaitable.

---

## Régénérer les images

Les douze images sont générées par un script, pas dessinées à la main :

```bash
node scripts/make-og.mjs
```

Ça produit :

```
public/og-image-bg.jpg  og-image.jpg  og-image-ru.jpg          accueil
public/og-default-bg.jpg  og-default.jpg  og-default-ru.jpg    défaut, 7 services
public/og-hotels-bg.jpg  og-hotels.jpg  og-hotels-ru.jpg       business
public/og/upholstery-cleaning-{bg,en,ru}.jpg                   page textile
```

Textes, badges et photos se modifient dans `scripts/make-og.mjs`. L'OG par défaut lit les noms de services directement dans `content/*.json` : renomme un service ou ajoutes-en un huitième, relance le script, la liste suit.

Le script écrit toujours en 1200 × 630 et se relance autant de fois que voulu sans dégrader le résultat.

**Ne supprime pas `scripts/og-source/`.** Les photos de chambre d'hôtel des pages business n'existent nulle part ailleurs, elles ont été extraites des anciennes images.

Playwright n'est pas une dépendance du projet, le script le prend dans le dossier voisin `freelanceos`. S'il bouge : `PLAYWRIGHT_PATH=... node scripts/make-og.mjs`.

---

## Après avoir remplacé une image

WhatsApp et Facebook gardent les aperçus en cache longtemps. Passe l'URL dans le **Facebook Sharing Debugger** et clique « Scrape Again » avant de renvoyer le lien à un prospect, sinon il verra encore l'ancienne image.

C'est valable pour toutes les URLs déjà partagées en prospection.

---

## Pourquoi les anciennes images sont à la racine de `public/`

`og-image-*.jpg` et `og-hotels-*.jpg` sont en cache chez Facebook et WhatsApp depuis la première prospection. Les déplacer dans ce dossier casserait les aperçus des liens déjà envoyés. On les laisse où elles sont, leur emplacement n'a aucun effet SEO.

Ce fichier est exclu des moteurs dans `public/robots.txt`.
