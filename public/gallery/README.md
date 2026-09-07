# Photos avant / après

Tu déposes les fichiers, tu commit, tu push. C'est en ligne. Aucun code ni JSON à toucher.

## La règle

Dans le dossier du service concerné :

```
before-1.jpg    la photo AVANT
after-1.jpg     la MÊME scène APRÈS
before-2.jpg
after-2.jpg
```

**Le numéro fait la paire.** `before-3.jpg` s'affiche avec `after-3.jpg`. Rien d'autre à respecter.

## Les dossiers

| Dossier | Où ça s'affiche |
|---|---|
| `home/` | Section « Преди и след » de la page d'accueil |
| `upholstery-cleaning/` | Page service textile (phase 2) |
| `deep-cleaning/` | Page service nettoyage en profondeur (phase 2) |
| `post-construction-cleaning/` | Page service fin de chantier (phase 2) |
| `airbnb-turnover/` | Page service entre deux clients (phase 2) |
| `window-cleaning/` | Page service vitres (phase 2) |
| `pressure-washing/` | Page service haute pression (phase 2) |
| `industrial-cleaning/` | Page service industriel (phase 2) |

La **première photo `after-1`** d'un service sert aussi de vignette sur sa carte dans la section Services de l'accueil. Dès que tu déposes une paire dans `window-cleaning/`, la carte « Прозорци и витрини » affiche la photo à la place de son icône.

## Ce qui se passe tout seul

- Dossier vide ou absent : la section galerie **disparaît entièrement** de la page. Pas de trou, pas de placeholder.
- Une paire incomplète (`before-2.jpg` sans `after-2.jpg`) est **ignorée** sans casser le site.
- L'accueil affiche au maximum **6 paires**, dans l'ordre des numéros.
- Extensions acceptées : `.jpg` `.jpeg` `.png` `.webp`

## Conseils photo

- **Même cadrage, même angle, même lumière** entre le avant et le après. C'est ce qui rend la comparaison crédible. Repère un point fixe (un coin de meuble, un carreau) et ne bouge pas entre les deux prises.
- Format paysage, le slider s'affiche en 16:9.
- Vise moins de 400 Ko par fichier. Next.js recompresse et sert du WebP, mais un JPEG de 5 Mo alourdit le repo pour rien.
- Pas de visage de client, pas de plaque d'immatriculation lisible.

## Les libellés sous les photos

Le petit titre affiché au-dessus de chaque slider vient du JSON, pas du nom de fichier :

```
content/bg.json → gallery.pairs
content/en.json → gallery.pairs
content/ru.json → gallery.pairs
```

L'ordre suit les numéros : le premier libellé va avec `before-1` / `after-1`. Si tu ajoutes une 5ᵉ paire sans ajouter de libellé, le titre reste vide, ça ne casse rien.

## Ajouter un dossier de service

Le nom du dossier doit être exactement le `slug` du service, listé dans `CLAUDE.md`. Un dossier qui ne correspond à aucun slug ne sera jamais lu.
