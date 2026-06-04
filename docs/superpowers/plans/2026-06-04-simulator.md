# Simulateur IA Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter un simulateur IA sur la landing page permettant à un visiteur d'uploader une photo de son meuble sale et de voir une simulation de ce meuble propre (via fal.ai FLUX img2img), avec un CTA WhatsApp post-résultat.

**Architecture:** Route API serverless `/api/simulate` valide l'image et appelle fal.ai côté serveur (clé API sécurisée). `SimulatorModal` est un composant partagé entre `SimulatorSection` (placée après `BeforeAfter`) et `SimulatorFAB` (bouton flottant mobile). Chaque composant gère son propre état `isOpen`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, `@fal-ai/client`, fal-ai/flux/dev/image-to-image

---

## File Map

```
CRÉER:
  components/SimulatorModal.tsx      ← modal partagé, machine à états 5 phases
  components/SimulatorSection.tsx    ← section après BeforeAfter, ouvre le modal
  components/SimulatorFAB.tsx        ← FAB mobile, ouvre le même modal
  app/api/simulate/route.ts          ← POST handler, valide + appelle fal.ai

MODIFIER:
  content/bg.json                    ← ajouter clé "simulator"
  content/en.json                    ← ajouter clé "simulator" (même shape)
  app/(bg)/page.tsx                  ← importer + insérer SimulatorSection + SimulatorFAB
  app/(en)/en/page.tsx               ← idem
  .env.local                         ← ajouter FAL_KEY
```

---

## Task 1 — Branch + dépendance + env

**Files:**
- Modify: `.env.local`

- [ ] **Créer la branche**

```bash
git checkout -b feature/simulator
```

- [ ] **Installer le package fal.ai**

```bash
npm install @fal-ai/client
```

Résultat attendu : `@fal-ai/client` apparaît dans `package.json` dependencies.

- [ ] **Ajouter la clé API à `.env.local`**

Ouvrir `.env.local` et ajouter à la fin :
```
FAL_KEY=your_fal_api_key_here
```

Obtenir la clé sur https://fal.ai/dashboard → API Keys → Create key. Remplacer `your_fal_api_key_here` par la vraie valeur.

- [ ] **Vérifier que le build local passe toujours**

```bash
npm run build
```

Résultat attendu : build sans erreur.

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(simulator): install @fal-ai/client"
```

---

## Task 2 — Clés i18n JSON

**Files:**
- Modify: `content/bg.json`
- Modify: `content/en.json`

**Important :** `LanguageContext.tsx` type `Translations = typeof bg` — le shape de `en.json` doit correspondre exactement à `bg.json`. Ajouter les deux clés en même temps.

- [ ] **Ajouter la clé `simulator` dans `content/bg.json`**

Ouvrir `content/bg.json`. Trouver la dernière clé de premier niveau (ex : `"footer"`) et ajouter après sa fermeture `}` (et avant le `}` final du fichier) :

```json
  "simulator": {
    "badge": "ИИ Симулатор",
    "title": "Вижте резултата върху вашия мебел",
    "subtitle": "Качете снимка — ИИ ще покаже как изглежда след почистване",
    "cta": "Тествайте безплатно",
    "fabLabel": "Симулатор",
    "fabTooltip": "Симулирайте почистването",
    "types": {
      "canape": "Диван",
      "fauteuil": "Фотьойл",
      "matelas": "Матрак",
      "kilim": "Килим"
    },
    "upload": {
      "label": "Добавете снимка",
      "hint": "JPG, PNG или WebP · макс. 5MB"
    },
    "processing": [
      "Анализ на тъканта…",
      "Премахване на петната…",
      "Реконструкция на влакната…",
      "Финализиране…"
    ],
    "result": {
      "title": "Ето вашия резултат",
      "ctaWhatsapp": "Резервирайте почистването",
      "ctaSave": "Получете резултата в WhatsApp",
      "phoneLabel": "Вашият номер",
      "phoneCta": "Изпрати →",
      "waMessage": "Здравейте, тествах симулатора с моя"
    },
    "error": {
      "generic": "Нещо се обърка. Опитайте отново.",
      "tooLarge": "Снимката е твърде голяма (макс. 5MB).",
      "rateLimit": "Твърде много опити. Опитайте след час.",
      "retry": "Опитайте отново"
    }
  }
```

- [ ] **Ajouter la clé `simulator` dans `content/en.json`**

Même emplacement (avant le `}` final) :

```json
  "simulator": {
    "badge": "AI Simulator",
    "title": "See the result on your furniture",
    "subtitle": "Upload a photo — AI will show how it looks after cleaning",
    "cta": "Try for free",
    "fabLabel": "Simulator",
    "fabTooltip": "Simulate the cleaning",
    "types": {
      "canape": "Sofa",
      "fauteuil": "Armchair",
      "matelas": "Mattress",
      "kilim": "Rug"
    },
    "upload": {
      "label": "Add a photo",
      "hint": "JPG, PNG or WebP · max 5MB"
    },
    "processing": [
      "Analysing fabric…",
      "Removing stains…",
      "Reconstructing fibres…",
      "Finalising…"
    ],
    "result": {
      "title": "Here is your result",
      "ctaWhatsapp": "Book the cleaning",
      "ctaSave": "Receive the result on WhatsApp",
      "phoneLabel": "Your number",
      "phoneCta": "Send →",
      "waMessage": "Hello, I tested the simulator with my"
    },
    "error": {
      "generic": "Something went wrong. Please try again.",
      "tooLarge": "Photo is too large (max 5MB).",
      "rateLimit": "Too many attempts. Please try again in an hour.",
      "retry": "Try again"
    }
  }
```

- [ ] **Vérifier le build TypeScript**

```bash
npm run build
```

Résultat attendu : build sans erreur TypeScript. Si erreur de shape JSON, vérifier que les deux clés `simulator` ont exactement le même structure.

- [ ] **Commit**

```bash
git add content/bg.json content/en.json
git commit -m "feat(simulator): add simulator i18n keys (bg + en)"
```

---

## Task 3 — Route API `/api/simulate`

**Files:**
- Create: `app/api/simulate/route.ts`

- [ ] **Créer le fichier `app/api/simulate/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

const PROMPTS: Record<string, string> = {
  canape:   "clean spotless sofa, same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality",
  fauteuil: "clean spotless armchair, same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality",
  matelas:  "clean spotless mattress, same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality",
  kilim:    "clean spotless rug, same fabric texture and color, professionally cleaned, no stains, no dirt, photorealistic, high quality",
};

const NEGATIVE = "stains, dirt, damage, wrinkles, dark spots, discoloration, blurry, low quality";

export async function POST(req: NextRequest) {
  if (!process.env.FAL_KEY) {
    console.error("[simulate] FAL_KEY not configured");
    return NextResponse.json({ error: "generic" }, { status: 500 });
  }

  let body: { image?: string; type?: string; website?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "generic" }, { status: 400 });
  }

  // Honeypot — bot filled the hidden field
  if (body.website) {
    return NextResponse.json({ error: "generic" }, { status: 400 });
  }

  const { image, type } = body;

  if (!image || !type || !PROMPTS[type]) {
    return NextResponse.json({ error: "generic" }, { status: 400 });
  }

  // Validate base64 data URL format
  const match = image.match(/^data:(image\/[a-z]+);base64,(.+)$/);
  if (!match) {
    return NextResponse.json({ error: "generic" }, { status: 400 });
  }

  const [, mime, b64] = match;

  if (!ALLOWED_MIME.includes(mime)) {
    return NextResponse.json({ error: "invalidFormat" }, { status: 400 });
  }

  // Approximate byte size from base64 length
  const approxBytes = (b64.length * 3) / 4;
  if (approxBytes > MAX_BYTES) {
    return NextResponse.json({ error: "tooLarge" }, { status: 400 });
  }

  fal.config({ credentials: process.env.FAL_KEY });

  try {
    const result = await fal.run("fal-ai/flux/dev/image-to-image", {
      input: {
        image_url: image,
        prompt: PROMPTS[type],
        negative_prompt: NEGATIVE,
        strength: 0.5,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      },
    }) as { images: Array<{ url: string }> };

    const url = result?.images?.[0]?.url;
    if (!url) {
      return NextResponse.json({ error: "generic" }, { status: 503 });
    }

    return NextResponse.json({ resultUrl: url });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("429")) {
      return NextResponse.json({ error: "rateLimit" }, { status: 429 });
    }
    console.error("[simulate] fal.ai error:", msg);
    return NextResponse.json({ error: "generic" }, { status: 503 });
  }
}
```

- [ ] **Tester la route avec curl (dev server actif)**

Dans un terminal, lancer le dev server :
```bash
npm run dev
```

Dans un autre terminal, tester avec une petite image base64 :
```bash
curl -s -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,/9j/4AAQ","type":"canape","website":""}' \
  | cat
```

Résultat attendu avec une vraie image : `{"resultUrl":"https://fal.media/..."}`.
Résultat attendu avec cette mini image (corrompue) : `{"error":"generic"}` — c'est normal, fal.ai rejette les images invalides.

- [ ] **Tester le honeypot**

```bash
curl -s -X POST http://localhost:3000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/jpeg;base64,abc","type":"canape","website":"bot@spam.com"}' \
  | cat
```

Résultat attendu : `{"error":"generic"}` avec status 400.

- [ ] **Commit**

```bash
git add app/api/simulate/route.ts
git commit -m "feat(simulator): add /api/simulate serverless route (fal.ai FLUX img2img)"
```

---

## Task 4 — SimulatorModal.tsx

**Files:**
- Create: `components/SimulatorModal.tsx`

- [ ] **Créer `components/SimulatorModal.tsx`**

```typescript
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";

type SimState = "idle" | "processing" | "result" | "error";
type FurnitureType = "canape" | "fauteuil" | "matelas" | "kilim";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const FURNITURE_TYPES: FurnitureType[] = ["canape", "fauteuil", "matelas", "kilim"];
const FURNITURE_ICONS: Record<FurnitureType, string> = {
  canape: "🛋",
  fauteuil: "🪑",
  matelas: "🛏",
  kilim: "🪞",
};

export default function SimulatorModal({ isOpen, onClose }: Props) {
  const { t } = useLanguage();
  const s = t.simulator;

  const [state, setState] = useState<SimState>("idle");
  const [selectedType, setSelectedType] = useState<FurnitureType | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorKey, setErrorKey] = useState<keyof typeof s.error>("generic");
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState(0);
  const [sliderPos, setSliderPos] = useState(50);
  const [phone, setPhone] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setState("idle");
      setSelectedType(null);
      setOriginalImage(null);
      setResultImage(null);
      setProgress(0);
      setProcessingStep(0);
      setSliderPos(50);
      setPhone("");
    }
  }, [isOpen]);

  // Fake progress during processing (never reaches 100 until done)
  useEffect(() => {
    if (state !== "processing") return;
    const id = setInterval(() => setProgress((p) => Math.min(p + 4, 90)), 1000);
    return () => clearInterval(id);
  }, [state]);

  // Rotate processing copy every 5s
  useEffect(() => {
    if (state !== "processing") return;
    const id = setInterval(
      () => setProcessingStep((i) => (i + 1) % s.processing.length),
      5000
    );
    return () => clearInterval(id);
  }, [state, s.processing.length]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleFile = useCallback((file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorKey("generic");
      setState("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorKey("tooLarge");
      setState("error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); },
    [handleFile]
  );

  const handleSubmit = async () => {
    if (!originalImage || !selectedType) return;
    setState("processing");
    setProgress(0);
    setProcessingStep(0);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: originalImage, type: selectedType, website: "" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorKey(data.error in s.error ? (data.error as keyof typeof s.error) : "generic");
        setState("error");
        return;
      }
      setResultImage(data.resultUrl);
      setProgress(100);
      setState("result");
    } catch {
      setErrorKey("generic");
      setState("error");
    }
  };

  const moveSlider = (clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, p)));
  };

  const waNumber = t.contact.whatsappNumber;
  const waMsg = encodeURIComponent(
    `${s.result.waMessage} ${s.types[selectedType ?? "canape"]}.`
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg bg-ink border border-gold/20 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-cream/40 hover:text-cream transition-colors z-10"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {/* ── IDLE ── */}
          {state === "idle" && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="section-badge mx-auto w-fit mb-3">{s.badge}</div>
                <h3 className="text-xl font-display uppercase text-cream">{s.title}</h3>
                <p className="text-sm text-cream/50 mt-1">{s.subtitle}</p>
              </div>

              {/* Upload zone */}
              <div
                className="border-2 border-dashed border-gold/30 rounded-lg p-6 text-center cursor-pointer hover:border-gold/60 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                {originalImage ? (
                  <img
                    src={originalImage}
                    alt="preview"
                    className="max-h-32 mx-auto rounded object-contain"
                  />
                ) : (
                  <>
                    <div className="text-3xl mb-2">📸</div>
                    <p className="text-cream/70 text-sm">{s.upload.label}</p>
                    <p className="text-cream/30 text-xs mt-1">{s.upload.hint}</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              />
              {/* Honeypot */}
              <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

              {/* Furniture type selector */}
              <div className="grid grid-cols-4 gap-2">
                {FURNITURE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`p-2 rounded text-xs font-display uppercase tracking-wide border transition-all ${
                      selectedType === type
                        ? "bg-gold text-ink border-gold"
                        : "border-gold/20 text-cream/60 hover:border-gold/40"
                    }`}
                  >
                    <div className="text-base mb-1">{FURNITURE_ICONS[type]}</div>
                    {s.types[type]}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!originalImage || !selectedType}
                className="w-full py-3 font-display uppercase tracking-widest text-sm bg-gold text-ink rounded disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold/90 transition-colors"
              >
                {s.cta}
              </button>
            </div>
          )}

          {/* ── PROCESSING ── */}
          {state === "processing" && (
            <div className="space-y-6 py-6">
              <h3 className="text-lg font-display uppercase text-cream text-center">
                {s.processing[processingStep]}
              </h3>
              <div className="w-full bg-ink-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gold h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-cream/30 text-xs text-center">~20s</p>
            </div>
          )}

          {/* ── RESULT ── */}
          {state === "result" && resultImage && originalImage && (
            <div className="space-y-4">
              <h3 className="text-lg font-display uppercase text-cream text-center">
                {s.result.title}
              </h3>

              {/* Before/after slider */}
              <div
                ref={sliderRef}
                className="relative select-none aspect-video overflow-hidden rounded cursor-ew-resize bg-ink-600"
                onMouseMove={(e) => e.buttons === 1 && moveSlider(e.clientX)}
                onTouchMove={(e) => moveSlider(e.touches[0].clientX)}
                onClick={(e) => moveSlider(e.clientX)}
              >
                {/* After (clean) */}
                <img
                  src={resultImage}
                  alt="after"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Before (dirty) — clipped with clipPath */}
                <img
                  src={originalImage}
                  alt="before"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                />
                {/* Divider line + handle */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gold shadow-[0_0_12px_rgba(245,196,0,0.6)] z-10 pointer-events-none"
                  style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
                >
                  <div className="absolute flex items-center justify-center w-7 h-7 -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-gold">
                    <svg className="w-3 h-3 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7M9 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black/60 text-red-400 text-xs font-bold uppercase px-2 py-0.5 rounded-sm pointer-events-none">Avant</div>
                <div className="absolute top-2 right-2 bg-black/60 text-gold text-xs font-bold uppercase px-2 py-0.5 rounded-sm pointer-events-none">Après</div>
              </div>

              {/* Primary CTA — WhatsApp */}
              <div>
                <a
                  href={`https://wa.me/${waNumber}?text=${waMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white font-display uppercase tracking-wide text-sm rounded hover:bg-[#25D366]/90 transition-colors"
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {s.result.ctaWhatsapp}
                </a>
              </div>

              {/* Secondary CTA — soft opt-in */}
              <div className="border-t border-gold/10 pt-4">
                <p className="text-cream/40 text-xs text-center mb-3">{s.result.ctaSave}</p>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={s.result.phoneLabel}
                    className="input-dark flex-1 text-sm py-2"
                  />
                  <a
                    href={
                      phone
                        ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(s.result.ctaWhatsapp)}`
                        : "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 bg-gold text-ink font-display uppercase text-xs rounded tracking-wide transition-opacity flex items-center ${
                      phone ? "opacity-100" : "opacity-30 pointer-events-none"
                    }`}
                  >
                    {s.result.phoneCta}
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {state === "error" && (
            <div className="space-y-4 py-6 text-center">
              <div className="text-4xl">😕</div>
              <p className="text-cream/70">{s.error[errorKey]}</p>
              <button
                onClick={() => setState("idle")}
                className="px-6 py-2 border border-gold/40 text-gold font-display uppercase text-sm rounded hover:bg-gold/10 transition-colors"
              >
                {s.error.retry}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Vérifier le build TypeScript**

```bash
npm run build
```

Résultat attendu : pas d'erreur TypeScript. Si `t.simulator` est inconnu, vérifier que les clés JSON ont bien été ajoutées en Task 2.

- [ ] **Test visuel rapide**

Dans `app/(bg)/page.tsx`, ajouter temporairement pour tester :

```typescript
import SimulatorModal from "@/components/SimulatorModal";
// Dans le return, n'importe où :
<SimulatorModal isOpen={true} onClose={() => {}} />
```

Lancer `npm run dev`, vérifier que la modal s'affiche correctement avec les 4 types de meubles et la zone d'upload. **Retirer ce code temporaire après le test.**

- [ ] **Commit**

```bash
git add components/SimulatorModal.tsx
git commit -m "feat(simulator): add SimulatorModal component (5-state machine)"
```

---

## Task 5 — SimulatorSection.tsx

**Files:**
- Create: `components/SimulatorSection.tsx`

- [ ] **Créer `components/SimulatorSection.tsx`**

```typescript
"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import SimulatorModal from "@/components/SimulatorModal";

export default function SimulatorSection() {
  const { t } = useLanguage();
  const s = t.simulator;
  const ref = useScrollReveal();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section
        id="simulator"
        className="relative overflow-hidden section-pad bg-ink"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div ref={ref} className="max-w-6xl px-4 mx-auto sm:px-6 text-center">
          <div className="reveal">
            <div className="section-badge mx-auto w-fit mb-4">{s.badge}</div>
            <h2 className="text-4xl tracking-tight uppercase font-display sm:text-5xl text-cream">
              {s.title}
            </h2>
            <p className="max-w-md mx-auto mt-3 text-sm text-cream/50">
              {s.subtitle}
            </p>
            <div className="mt-8">
              <div>
                <button
                  onClick={() => setIsOpen(true)}
                  className="btn-gold"
                >
                  {s.cta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SimulatorModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

- [ ] **Build check**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add components/SimulatorSection.tsx
git commit -m "feat(simulator): add SimulatorSection component"
```

---

## Task 6 — SimulatorFAB.tsx

**Files:**
- Create: `components/SimulatorFAB.tsx`

- [ ] **Créer `components/SimulatorFAB.tsx`**

```typescript
"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import SimulatorModal from "@/components/SimulatorModal";

export default function SimulatorFAB() {
  const { t } = useLanguage();
  const s = t.simulator;
  const [isOpen, setIsOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hide FAB when SimulatorSection is visible in viewport
  useEffect(() => {
    const section = document.getElementById("simulator");
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        className={`fixed bottom-24 right-6 z-40 flex items-center gap-3 lg:hidden transition-all duration-300 ${
          hidden ? "opacity-0 pointer-events-none translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Tooltip */}
        <div
          className={`transition-all duration-300 pointer-events-none ${
            hover ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
          } bg-ink-700 border border-gold/20 text-cream text-xs rounded-sm px-3 py-2 shadow-lg whitespace-nowrap`}
        >
          {s.fabTooltip}
        </div>

        {/* Button */}
        <button
          onClick={() => setIsOpen(true)}
          aria-label={s.fabTooltip}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/30 hover:bg-gold/90 transition-colors"
        >
          <span className="text-2xl">✨</span>
        </button>
      </div>

      <SimulatorModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

- [ ] **Build check**

```bash
npm run build
```

- [ ] **Commit**

```bash
git add components/SimulatorFAB.tsx
git commit -m "feat(simulator): add SimulatorFAB component (mobile, IntersectionObserver)"
```

---

## Task 7 — Wiring dans les pages

**Files:**
- Modify: `app/(bg)/page.tsx`
- Modify: `app/(en)/en/page.tsx`

- [ ] **Modifier `app/(bg)/page.tsx`**

Ajouter les deux imports après `import WhatsAppFAB`:

```typescript
import SimulatorSection from "@/components/SimulatorSection";
import SimulatorFAB from "@/components/SimulatorFAB";
```

Dans le JSX, ajouter `<SimulatorSection />` juste après `<BeforeAfter />` :

```typescript
        <BeforeAfter />
        <SimulatorSection />   {/* ← NOUVEAU */}
        <Comparison />
```

Et `<SimulatorFAB />` juste après `<WhatsAppFAB />` :

```typescript
      <WhatsAppFAB />
      <SimulatorFAB />   {/* ← NOUVEAU */}
```

- [ ] **Modifier `app/(en)/en/page.tsx`**

Même modification : ajouter les deux imports + les deux composants aux mêmes emplacements relatifs.

- [ ] **Build final**

```bash
npm run build
```

Résultat attendu : build sans erreur, pas de warning TypeScript.

- [ ] **Test visuel complet sur dev server**

```bash
npm run dev
```

Checklist à valider dans le navigateur :

1. [ ] La section simulateur s'affiche après BeforeAfter sur `/`
2. [ ] Le bouton gold ouvre la modal
3. [ ] La modal affiche les 4 types de meubles
4. [ ] L'upload d'une photo fonctionne (preview visible)
5. [ ] Le bouton "Lancer" reste disabled sans type sélectionné
6. [ ] La barre de progression tourne pendant le traitement (~20s)
7. [ ] Le slider avant/après s'affiche avec le résultat fal.ai
8. [ ] Le bouton WhatsApp génère un lien correct
9. [ ] Le FAB ✨ s'affiche sur mobile (< 1024px) et se cache quand la section est visible
10. [ ] Tester sur `/en` — les textes sont en anglais
11. [ ] Appuyer sur Escape ferme la modal
12. [ ] Cliquer sur le backdrop ferme la modal

- [ ] **Commit final**

```bash
git add app/(bg)/page.tsx app/(en)/en/page.tsx
git commit -m "feat(simulator): wire SimulatorSection + SimulatorFAB into BG and EN pages"
```

---

## Notes pour la mise en production (plus tard)

- **FAL_KEY** : ajouter dans les variables d'environnement Netlify avant de merger sur `main`
- **Timeout Netlify Functions** : la route `/api/simulate` peut prendre 20-25s. Ajouter dans `netlify.toml` :
  ```toml
  [functions]
    timeout = 60
  ```
  (Requiert de vérifier la limite du plan Netlify actuel)
- **Rate limiting V2** : si le trafic augmente, ajouter Upstash Redis pour un vrai compteur par IP
