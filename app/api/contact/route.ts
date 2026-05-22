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

function sanitize(value: unknown, maxLen = 300): string {
  if (typeof value !== 'string') return ''
  return value.replace(/<[^>]*>/g, '').replace(/[&"']/g, '').trim().substring(0, maxLen)
}

export async function POST(req: NextRequest) {
  // Origin check — block cross-origin submissions
  const origin = req.headers.get('origin') ?? ''
  if (origin && !ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Content-Type check
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

  // Honeypot — bots fill this field, humans leave it empty
  if (body._hp && String(body._hp).length > 0) {
    // Silently accept to not reveal the honeypot to bots
    return NextResponse.json({ ok: true })
  }

  // Sanitize all inputs
  const service = sanitize(body.service)
  const quantity = sanitize(body.quantity, 150)
  const name = sanitize(body.name, 100)
  const phone = sanitize(body.phone, 30)
  const location = sanitize(body.location, 100)

  // Server-side validation
  if (!phone || !location || !service) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: FROM,
      to: [TO_EMAIL],
      subject: `🛋️ Nouveau lead — ${service}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
          <div style="background:#F5C400;padding:16px 24px;border-radius:4px 4px 0 0;">
            <h2 style="margin:0;font-size:20px;color:#0A0A0A;">Nouvelle demande de devis</h2>
            <p style="margin:4px 0 0;font-size:13px;color:#0A0A0A;opacity:0.7;">wetdrycleaningbansko.com</p>
          </div>
          <div style="background:#f9f9f9;padding:24px;border:1px solid #e5e5e5;border-top:none;border-radius:0 0 4px 4px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 12px;font-weight:600;width:40%;background:#fff;border:1px solid #eee;">Service(s)</td>
                <td style="padding:10px 12px;background:#fff;border:1px solid #eee;">${service}</td>
              </tr>
              ${quantity && quantity !== '—' ? `
              <tr>
                <td style="padding:10px 12px;font-weight:600;background:#f5f5f5;border:1px solid #eee;">Quantité / Taille</td>
                <td style="padding:10px 12px;background:#f5f5f5;border:1px solid #eee;">${quantity}</td>
              </tr>` : ''}
              ${name && name !== '—' ? `
              <tr>
                <td style="padding:10px 12px;font-weight:600;background:#fff;border:1px solid #eee;">Nom</td>
                <td style="padding:10px 12px;background:#fff;border:1px solid #eee;">${name}</td>
              </tr>` : ''}
              <tr>
                <td style="padding:10px 12px;font-weight:600;background:#f5f5f5;border:1px solid #eee;">Téléphone</td>
                <td style="padding:10px 12px;background:#f5f5f5;border:1px solid #eee;font-size:16px;font-weight:700;">${phone}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-weight:600;background:#fff;border:1px solid #eee;">Localisation</td>
                <td style="padding:10px 12px;background:#fff;border:1px solid #eee;">${location}</td>
              </tr>
            </table>
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
