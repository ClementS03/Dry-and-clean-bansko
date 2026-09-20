import io, json, re

NUMBER = "+359 882 862 228"
WA = "359882862228"

COPY = {
    "bg": {
        "phoneLabel": "Телефон",
        "messaging": "Най-бързо отговаряме в WhatsApp, Telegram или Viber. Същият номер.",
    },
    "en": {
        "phoneLabel": "Phone",
        "messaging": "Fastest by WhatsApp, Telegram or Viber. Same number.",
    },
    "ru": {
        "phoneLabel": "Телефон",
        "messaging": "Быстрее всего отвечаем в WhatsApp, Telegram или Viber. Тот же номер.",
    },
}

for lang in ["bg", "en", "ru"]:
    p = "content/%s.json" % lang
    d = json.load(io.open(p, encoding="utf-8"))
    c = d["contact"]

    # Un seul numero : les cles phoneEN / phoneBG et leurs libelles disparaissent
    rebuilt = {}
    for key, value in c.items():
        if key == "phoneEN":
            rebuilt["phone"] = NUMBER
            rebuilt["phoneLabel"] = COPY[lang]["phoneLabel"]
            rebuilt["messaging"] = COPY[lang]["messaging"]
            continue
        if key in ("phoneBG", "phoneENLabel", "phoneBGLabel"):
            continue
        rebuilt[key] = value
    rebuilt["whatsappNumber"] = WA
    d["contact"] = rebuilt
    d["whatsapp"]["number"] = WA

    io.open(p, "w", encoding="utf-8", newline="\n").write(
        json.dumps(d, ensure_ascii=False, indent=2) + "\n")

# ------------------------------------------------------------------ Contact.tsx
p = "components/Contact.tsx"
s = io.open(p, encoding="utf-8").read()
old = """            <a href={`tel:${c.phoneEN.replace(/\\s/g, '')}`}
              className="flex items-center gap-4 p-5 card-dark group md:pointer-events-none md:cursor-default">
              <span className="text-2xl">🇬🇧</span>
              <div className="flex-1">
                <div className="text-cream/60 text-xs uppercase tracking-widest mb-0.5">{c.phoneENLabel}</div>
                <div className="font-display text-xl text-cream group-hover:text-gold transition-colors duration-200">{c.phoneEN}</div>
              </div>
              <PhoneSvg />
            </a>

            <a href={`tel:${c.phoneBG.replace(/\\s/g, '')}`}
              className="flex items-center gap-4 p-5 card-dark group md:pointer-events-none md:cursor-default">
              <span className="text-2xl">🇧🇬</span>
              <div className="flex-1">
                <div className="text-cream/60 text-xs uppercase tracking-widest mb-0.5">{c.phoneBGLabel}</div>
                <div className="font-display text-xl text-cream group-hover:text-gold transition-colors duration-200">{c.phoneBG}</div>
              </div>
              <PhoneSvg />
            </a>"""
new = """            <a href={`tel:${c.phone.replace(/\\s/g, '')}`}
              className="flex items-center gap-4 p-5 card-dark group md:pointer-events-none md:cursor-default">
              <div className="flex-1">
                <div className="text-cream/60 text-xs uppercase tracking-widest mb-0.5">{c.phoneLabel}</div>
                <div className="font-display text-xl text-cream group-hover:text-gold transition-colors duration-200">{c.phone}</div>
                <div className="text-cream/55 text-xs mt-1.5">{c.messaging}</div>
              </div>
              <PhoneSvg />
            </a>"""
assert old in s
s = s.replace(old, new, 1)
s = s.replace("<a href={`tel:${c.phoneEN.replace(/\\s/g, '')}`} className=\"btn-gold",
              "<a href={`tel:${c.phone.replace(/\\s/g, '')}`} className=\"btn-gold", 1)
assert "phoneEN" not in s and "phoneBG" not in s
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# --------------------------------------------------------------------- Hero.tsx
p = "components/Hero.tsx"
s = io.open(p, encoding="utf-8").read()
old = """          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`tel:${t.contact.phoneEN.replace(/\\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors md:pointer-events-none md:cursor-default">
              <span>🇬🇧</span><span>{t.contact.phoneEN}</span>
            </a>
            <a href={`tel:${t.contact.phoneBG.replace(/\\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-cream/60 hover:text-gold transition-colors md:pointer-events-none md:cursor-default">
              <span>🇧🇬</span><span>{t.contact.phoneBG}</span>
            </a>
          </div>"""
new = """          <div className="flex flex-col gap-1.5">
            <a href={`tel:${t.contact.phone.replace(/\\s/g, '')}`}
              className="flex items-center gap-2 text-sm text-cream/70 hover:text-gold transition-colors md:pointer-events-none md:cursor-default">
              <Icon name="phone" className="w-4 h-4 text-gold" />
              <span className="font-display tracking-wide">{t.contact.phone}</span>
            </a>
            <span className="text-xs text-cream/55">{t.contact.messaging}</span>
          </div>"""
assert old in s
io.open(p, "w", encoding="utf-8", newline="\n").write(s.replace(old, new, 1))

# ------------------------------------------------------------------- Footer.tsx
p = "components/Footer.tsx"
s = io.open(p, encoding="utf-8").read()
old = """            <a
              href={`tel:${t.contact.phoneEN.replace(/\\s/g, "")}`}
              className="text-sm transition-colors text-cream/60 hover:text-gold md:pointer-events-none md:cursor-default"
            >
              🇬🇧 {t.contact.phoneEN}
            </a>
            <a
              href={`tel:${t.contact.phoneBG.replace(/\\s/g, "")}`}
              className="text-sm transition-colors text-cream/60 hover:text-gold md:pointer-events-none md:cursor-default"
            >
              🇧🇬 {t.contact.phoneBG}
            </a>"""
new = """            <a
              href={`tel:${t.contact.phone.replace(/\\s/g, "")}`}
              className="text-sm tracking-wide transition-colors font-display text-cream/70 hover:text-gold md:pointer-events-none md:cursor-default"
            >
              {t.contact.phone}
            </a>
            <span className="text-xs text-cream/55">{t.contact.messaging}</span>"""
assert old in s, "Footer"
io.open(p, "w", encoding="utf-8", newline="\n").write(s.replace(old, new, 1))

# ---------------------------------------------------------------- Icon : phone
p = "components/Icon.tsx"
s = io.open(p, encoding="utf-8").read()
s = s.replace("Monitor, Receipt,", "Monitor, Phone, Receipt,")
s = s.replace("  monitor: Monitor,", "  monitor: Monitor,\n  phone: Phone,")
assert "phone: Phone," in s
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# ------------------------------------------------------------------- JSON-LD
for p in ["app/(bg)/layout.tsx", "app/(en)/layout.tsx", "app/(ru)/layout.tsx",
          "app/(bg)/services/[slug]/page.tsx", "app/(en)/en/services/[slug]/page.tsx",
          "app/(ru)/ru/services/[slug]/page.tsx"]:
    s = io.open(p, encoding="utf-8").read()
    s = s.replace('telephone: ["+359882862228", "+359876850385"],', 'telephone: "+359882862228",')
    assert "359876850385" not in s, p
    io.open(p, "w", encoding="utf-8", newline="\n").write(s)

# ------------------------------------------------------------------- llms.txt
p = "public/llms.txt"
s = io.open(p, encoding="utf-8").read()
s = s.replace("""- WhatsApp и телефон (English): +359 882 862 228
- WhatsApp и телефон (Български): +359 876 850 385""",
"""- Телефон: +359 882 862 228
- Съобщения: WhatsApp, Telegram и Viber на същия номер, отговаряме най-бързо там""")
s = s.replace("""- WhatsApp (EN): +359 882 862 228
- WhatsApp (BG): +359 876 850 385""",
"""- Phone: +359 882 862 228
- Messaging: WhatsApp, Telegram and Viber on the same number, fastest reply there""")
io.open(p, "w", encoding="utf-8", newline="\n").write(s)

print("un seul numero, messageries mentionnees")
