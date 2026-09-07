import fs from 'node:fs'
import path from 'node:path'

export type GalleryPair = { before: string; after: string }

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

/**
 * Lit public/gallery/<slug>/ et apparie before-N avec after-N.
 * Depose les fichiers, commit, c'est en ligne : aucun code a toucher.
 * Une paire incomplete est ignoree, un dossier absent ou vide renvoie [].
 */
export function getGalleryPairs(slug: string): GalleryPair[] {
  const dir = path.join(process.cwd(), 'public', 'gallery', slug)

  let files: string[]
  try {
    files = fs.readdirSync(dir)
  } catch {
    return []
  }

  const byIndex = new Map<number, { before?: string; after?: string }>()

  for (const file of files) {
    const ext = path.extname(file).toLowerCase()
    if (!EXTENSIONS.includes(ext)) continue

    const match = /^(before|after)-(\d+)$/.exec(path.basename(file, ext))
    if (!match) continue

    const index = Number(match[2])
    const entry = byIndex.get(index) ?? {}
    entry[match[1] as 'before' | 'after'] = `/gallery/${slug}/${file}`
    byIndex.set(index, entry)
  }

  return [...byIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, pair]) => pair)
    .filter((pair): pair is GalleryPair => Boolean(pair.before && pair.after))
}

/** Premiere photo "apres" d'un service, utilisee en vignette de carte. */
export function getGalleryCover(slug: string): string | null {
  return getGalleryPairs(slug)[0]?.after ?? null
}

/**
 * OG dediee d une page, deposee dans public/og/<slug>.jpg.
 * Voir public/og/README.md pour les specs et l ordre de priorite.
 */
export function getOgImage(slug: string): string | null {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'og', slug + ext))) {
      return `/og/${slug}${ext}`
    }
  }
  return null
}
