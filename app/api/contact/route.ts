import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const TO_EMAIL = 'wetdrycleanbansko@gmail.com'

const FROM = 'Wet&Dry Bansko <noreply@wetdrycleaningbansko.com>'

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

const TEXTILE_KEYS = ['sofa', 'mattress', 'carpet', 'curtains', 'car']

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

export async function POST(req: NextRequest) {
  // Origin check, bloque les soumissions cross-origin
  const origin = req.headers.get('origin') ?? ''
  if (origin && !ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

  if (!phone || !location || serviceKeys.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
  }

  const isBusiness = audience === 'business'
  const frequencyLabel = frequency === 'recurring' ? 'Recurring' : frequency === 'once' ? 'One-off' : ''

  const rows = [
    row('Type', isBusiness ? 'Business' : 'Private', false),
    row('Service(s)', service || serviceKeys.join(', '), true),
    textile ? row('Textile items', textile, false) : '',
    textileKeys.length && !textile ? row('Textile items', textileKeys.join(', '), false) : '',
    frequencyLabel ? row('Frequency', frequencyLabel, true) : '',
    quantity ? row('Details', quantity, false) : '',
    name ? row('Name', name, true) : '',
    `
    <tr>
      <td style="padding:10px 12px;font-weight:600;background:#fff;border:1px solid #eee;">Phone</td>
      <td style="padding:10px 12px;background:#fff;border:1px solid #eee;font-size:16px;font-weight:700;">${phone}</td>
    </tr>`,
    row('Location', location, true),
  ].join('')

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: FROM,
      to: [TO_EMAIL],
      subject: `${isBusiness ? '[B2B] ' : ''}New lead - ${service || serviceKeys.join(', ')}`,
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
