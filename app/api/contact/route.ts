import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const TO_EMAIL = 'wetdrycleanbansko@gmail.com'

const FROM = 'Wet&Dry Bansko <noreply@wetdrycleaningbansko.com>'

/**
 * Domaines canoniques. Le controle principal est la comparaison avec
 * l hote de la requete, ces valeurs ne servent que de repli.
 */
const ALLOWED_ORIGINS = [
  'https://wetdrycleaningbansko.com',
  'https://www.wetdrycleaningbansko.com',
  'http://localhost:3000',
  'http://localhost:3001',
]

/** Doit rester aligne sur services[].key dans content/*.json. */
const SERVICE_KEYS = [
  'textile',
  'deep',
  'renovation',
  'turnover',
  'windows',
  'pressure',
  'industrial',
  'other',
]

const TEXTILE_KEYS = ['sofa', 'mattress', 'carpet', 'car']

function sanitize(value: unknown, maxLen = 300): string {
  if (typeof value !== 'string') return ''
  return value.replace(/<[^>]*>/g, '').replace(/[&"']/g, '').trim().substring(0, maxLen)
}

function pickKeys(value: unknown, allowed: string[]): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((v): v is string => typeof v === 'string' && allowed.includes(v))
}

function row(label: string, value: string, alt: boolean) {
  const bg = alt ? '#f5f5f5' : '#fff'
  return `
    <tr>
      <td style="padding:10px 12px;font-weight:600;width:40%;background:${bg};border:1px solid #eee;">${label}</td>
      <td style="padding:10px 12px;background:${bg};border:1px solid #eee;">${value}</td>
    </tr>`
}

/** Version texte du mail. Un HTML sans alternative text/plain est un
 *  signal de spam classique, Gmail le penalise. */
function plainText(fields: [string, string][]): string {
  return [
    'New quote request',
    'wetdrycleaningbansko.com',
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
  ].join('\n')
}

// Limitation de debit. La memoire n est pas partagee entre instances Netlify,
// donc ce n est pas un rempart absolu : cela arrete les envois repetes depuis
// une meme session, pas une attaque distribuee. Un service dedie serait
// necessaire pour aller plus loin.
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const attempts = new Map<string, number[]>()

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-nf-client-connection-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  attempts.set(ip, recent)

  if (attempts.size > 500) {
    for (const [key, times] of attempts) {
      if (!times.some((t) => now - t < WINDOW_MS)) attempts.delete(key)
    }
  }

  return recent.length > MAX_PER_WINDOW
}

export async function POST(req: NextRequest) {
  // Origin exige et compare exactement. L ancien controle laissait passer
  // une requete sans en-tete Origin, et startsWith acceptait aussi
  // https://wetdrycleaningbansko.com.exemple-malveillant.com
  // Le formulaire est servi par le site qui recoit la soumission : comparer
  // l origine a l hote de la requete suffit, et cela fonctionne partout,
  // production, preview de branche ou local, sans dependre d une variable
  // d environnement. Une requete d un autre site portera une origine
  // differente et sera refusee.
  const origin = req.headers.get('origin') ?? ''
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? ''

  let originHost = ''
  try {
    originHost = origin ? new URL(origin).host : ''
  } catch {
    originHost = ''
  }

  const isDev = process.env.NODE_ENV !== 'production'
  const sameOrigin = originHost !== '' && originHost === host

  if (!sameOrigin && !ALLOWED_ORIGINS.includes(origin)) {
    console.warn('[contact] origine refusee. origin=%s host=%s', origin || '(absente)', host || '(absent)')
    return NextResponse.json({ error: 'Forbidden', origin, host }, { status: 403 })
  }

  if (!isDev && isRateLimited(clientIp(req))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const contentType = req.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Honeypot, rempli par les bots et laisse vide par les humains
  if (body._hp && String(body._hp).length > 0) {
    return NextResponse.json({ ok: true })
  }

  // Les libelles servent a l'email, les cles servent a la validation
  const serviceKeys = pickKeys(body.serviceKeys, SERVICE_KEYS)
  const textileKeys = pickKeys(body.textileKeys, TEXTILE_KEYS)
  const audience = body.audience === 'business' ? 'business' : 'private'
  const frequency =
    body.frequency === 'recurring' ? 'recurring' : body.frequency === 'once' ? 'once' : ''

  // 600 caracteres : 7 services et 5 objets coches tiennent en cyrillique
  const service = sanitize(body.service, 600)
  const textile = sanitize(body.textile, 300)
  const quantity = sanitize(body.quantity, 200)
  const name = sanitize(body.name, 100)
  const phone = sanitize(body.phone, 30)
  const location = sanitize(body.location, 100)
  const establishment = sanitize(body.establishment, 120)

  // Le telephone est indispensable : sur ce canal il n y a ni WhatsApp ni
  // adresse email pour rappeler le prospect. La localite reste facultative,
  // le formulaire business collecte un nom d etablissement a la place.
  if (!phone || serviceKeys.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
  }

  const isBusiness = audience === 'business'
  const frequencyLabel = frequency === 'recurring' ? 'Recurring' : frequency === 'once' ? 'One-off' : ''

  const fields: [string, string][] = [
    ['Type', isBusiness ? 'Business' : 'Private'],
    ['Service(s)', service || serviceKeys.join(', ')],
    ...(textile || textileKeys.length
      ? ([['Textile items', textile || textileKeys.join(', ')]] as [string, string][])
      : []),
    ...(frequencyLabel ? ([['Frequency', frequencyLabel]] as [string, string][]) : []),
    ...(quantity ? ([['Details', quantity]] as [string, string][]) : []),
    ...(name ? ([['Name', name]] as [string, string][]) : []),
    ...(establishment ? ([['Establishment', establishment]] as [string, string][]) : []),
    ['Phone', phone],
    ...(location ? ([['Location', location]] as [string, string][]) : []),
  ]

  const rows = [
    row('Type', isBusiness ? 'Business' : 'Private', false),
    row('Service(s)', service || serviceKeys.join(', '), true),
    textile ? row('Textile items', textile, false) : '',
    textileKeys.length && !textile ? row('Textile items', textileKeys.join(', '), false) : '',
    frequencyLabel ? row('Frequency', frequencyLabel, true) : '',
    quantity ? row('Details', quantity, false) : '',
    name ? row('Name', name, true) : '',
    establishment ? row('Establishment', establishment, false) : '',
    `
    <tr>
      <td style="padding:10px 12px;font-weight:600;background:#fff;border:1px solid #eee;">Phone</td>
      <td style="padding:10px 12px;background:#fff;border:1px solid #eee;font-size:16px;font-weight:700;">${phone}</td>
    </tr>`,
    location ? row('Location', location, true) : '',
  ].join('')

  if (!process.env.RESEND_API_KEY) {
    // Sans cle, le lead ne peut pas partir. En developpement on l affiche
    // dans la console du serveur pour pouvoir tester le parcours complet,
    // en production on remonte une erreur explicite plutot qu un echec muet.
    console.error(
      '[contact] RESEND_API_KEY absente. Ajoutez-la dans .env.local en local, ' +
        'et verifiez les variables du site sur Netlify en production.',
    )
    if (isDev) {
      console.info('[contact] lead recu en developpement :\n' + plainText(fields))
      return NextResponse.json({ ok: true, devNoEmail: true })
    }
    return NextResponse.json({ error: 'Email service not configured' }, { status: 503 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  // Resend limite le debit a quelques envois par seconde. Si plusieurs
  // prospects valident en meme temps, un envoi peut etre refuse. Sans
  // reprise le lead serait perdu et le visiteur verrait une erreur.
  const sendWithRetry = async (payload: Parameters<typeof resend.emails.send>[0]) => {
    let lastError: unknown
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, attempt * 700))
      const { error } = await resend.emails.send(payload)
      if (!error) return
      lastError = error
    }
    throw lastError
  }

  try {
    await sendWithRetry({
      from: FROM,
      to: [TO_EMAIL],
      subject: `${isBusiness ? '[B2B] ' : ''}New lead - ${service || serviceKeys.join(', ')}`,
      text: plainText(fields),
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
          <div style="background:#F5C400;padding:16px 24px;border-radius:4px 4px 0 0;">
            <h2 style="margin:0;font-size:20px;color:#0A0A0A;">New quote request</h2>
            <p style="margin:4px 0 0;font-size:13px;color:#0A0A0A;opacity:0.7;">wetdrycleaningbansko.com</p>
          </div>
          <div style="background:#f9f9f9;padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 4px 4px;">
            <table style="width:100%;border-collapse:collapse;">${rows}</table>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact] Resend error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
