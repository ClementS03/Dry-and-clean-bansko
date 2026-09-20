import io

p = "app/api/contact/route.ts"
s = io.open(p, encoding="utf-8").read()

old = """const ALLOWED_ORIGINS = [
  'https://wetdrycleaningbansko.com',
  'https://www.wetdrycleaningbansko.com',
  'http://localhost:3000',
  'http://localhost:3001',
]"""
new = """/**
 * Netlify expose l URL du deploiement en cours. Sans cela, un deploy de
 * branche ou une preview repondait 403 : son origine
 * https://<branche>--<site>.netlify.app ne figurait nulle part, et le
 * formulaire semblait casse alors qu il etait simplement refuse.
 *   URL              domaine principal du site
 *   DEPLOY_URL       URL unique de ce deploiement
 *   DEPLOY_PRIME_URL URL de la branche ou de la pull request
 */
const ALLOWED_ORIGINS = [
  'https://wetdrycleaningbansko.com',
  'https://www.wetdrycleaningbansko.com',
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.URL,
  process.env.DEPLOY_URL,
  process.env.DEPLOY_PRIME_URL,
].filter((o): o is string => Boolean(o))"""
assert old in s
s = s.replace(old, new, 1)

old_check = """  const origin = req.headers.get('origin') ?? ''
  const isDev = process.env.NODE_ENV !== 'production'
  const localOrigin = /^http:\\/\\/(localhost|127\\.0\\.0\\.1|\\d+\\.\\d+\\.\\d+\\.\\d+)(:\\d+)?$/.test(origin)

  if (!ALLOWED_ORIGINS.includes(origin) && !(isDev && localOrigin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }"""
new_check = """  const origin = req.headers.get('origin') ?? ''
  const isDev = process.env.NODE_ENV !== 'production'
  const isPreview = process.env.CONTEXT !== undefined && process.env.CONTEXT !== 'production'
  const localOrigin = /^http:\\/\\/(localhost|127\\.0\\.0\\.1|\\d+\\.\\d+\\.\\d+\\.\\d+)(:\\d+)?\\/?$/.test(origin)
  // Filet de securite pour les previews, dont l URL change a chaque deploiement
  const previewOrigin = /^https:\\/\\/[a-z0-9-]+\\.netlify\\.app\\/?$/.test(origin)

  const allowed =
    ALLOWED_ORIGINS.includes(origin) ||
    (isDev && localOrigin) ||
    (isPreview && previewOrigin)

  if (!allowed) {
    console.warn('[contact] origine refusee :', origin || '(absente)')
    return NextResponse.json({ error: 'Forbidden', origin }, { status: 403 })
  }"""
assert old_check in s
s = s.replace(old_check, new_check, 1)
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# Cote client, afficher la vraie raison dans la console : un message
# generique rend ce genre de panne indiagnosticable a distance.
LOG = """      if (res.ok) {"""
NEWLOG = """      if (!res.ok) {
        // La raison exacte reste dans la console, l utilisateur voit un
        // message neutre. 403 origine, 429 debit, 503 cle absente.
        console.error(
          '[contact] envoi refuse, statut ' + res.status,
          await res.clone().text(),
        )
      }
      if (res.ok) {"""

for path in ["components/LeadForm.tsx", "components/hotels/HotelsLeadForm.tsx"]:
    s = io.open(path, encoding="utf-8").read()
    assert LOG in s, path
    s = s.replace(LOG, NEWLOG, 1)
    io.open(path, "w", encoding="utf-8", newline="\n").write(s)

print("origines Netlify autorisees, raison de l echec visible en console")
