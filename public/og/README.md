# Images Open Graph

L'image qui s'affiche quand quelqu'un colle un lien du site dans WhatsApp, Facebook, LinkedIn ou un SMS. C'est souvent la première chose qu'un prospect voit de toi.

## Comment en ajouter une

Dépose le fichier ici, nommé d'après la page :

```
public/og/upholstery-cleaning.jpg
public/og/deep-cleaning.jpg
public/og/post-construction-cleaning.jpg
public/og/airbnb-turnover.jpg
public/og/window-cleaning.jpg
public/og/pressure-washing.jpg
public/og/industrial-cleaning.jpg
public/og/services.jpg              ← le hub /services
```

Tu déposes, tu commit, tu push. Rien d'autre à toucher.

## L'ordre de priorité

Pour chaque page service, le site prend la première image disponible :

1. `public/og/<slug>.jpg` si elle existe
2. sinon la première photo « après » de `public/gallery/<slug>/`
3. sinon l'image OG de la langue (`og-image-bg.jpg`, `og-image.jpg`, `og-image-ru.jpg`)

Tu ne peux donc pas casser un aperçu en oubliant un fichier. Chaque image que tu ajoutes remplace juste un cran moins bon.

## Les specs

- **1200 × 630 pixels**, exactement. C'est le format que WhatsApp, Facebook et LinkedIn attendent.
- JPG, moins de 300 Ko.
- Une **photo réelle** du service, pas un fond uni ni un logo seul. Une carte avec juste le logo ne donne aucune raison de cliquer.
- Une phrase courte en Oswald, blanc ou crème, sur un dégradé sombre en bas de l'image pour rester lisible.
- Le logo en petit dans un coin, pas au centre.
- Le texte reste **loin des bords** : certaines plateformes recadrent jusqu'à 10% sur les côtés.

## Ce qu'il ne faut pas y mettre

Pas de prix. Pas de numéro de téléphone. Pas d'URL. Pas de QR code. Ce sont les mêmes règles que pour les visuels Google Business, et pour la même raison : ça fait publicité et ça se fait rejeter ou ignorer.

## Les fichiers déjà en place

Ils vivent à la racine de `public/`, pas dans ce dossier, et ils sont déjà en cache chez Facebook et WhatsApp. Les renommer casserait les aperçus des liens déjà partagés en prospection, donc on les laisse où ils sont.

```
public/og-image-bg.jpg      accueil BG
public/og-image.jpg         accueil EN
public/og-image-ru.jpg      accueil RU
public/og-hotels-bg.jpg     /business BG
public/og-hotels.jpg        /business EN
public/og-hotels-ru.jpg     /business RU
```

## Après avoir remplacé une image

WhatsApp et Facebook gardent les aperçus en cache longtemps. Passe l'URL dans le **Facebook Sharing Debugger** et clique « Scrape Again » avant de renvoyer le lien à un prospect, sinon il verra l'ancienne image.
