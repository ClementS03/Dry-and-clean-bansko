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
  kilim: "🟫",
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
  const abortRef = useRef<AbortController | null>(null);

  // Scroll lock + reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      abortRef.current?.abort();
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
    abortRef.current = new AbortController();
    setState("processing");
    setProgress(0);
    setProcessingStep(0);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: originalImage, type: selectedType, website: "" }),
        signal: abortRef.current.signal,
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
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setErrorKey("generic");
      setState("error");
    }
  };

  const moveSlider = useCallback((clientX: number) => {
    const rect = sliderRef.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, p)));
  }, []);

  if (!isOpen) return null;

  const waNumber = t.contact.whatsappNumber;
  const waMsg = encodeURIComponent(
    `${s.result.waMessage} ${s.types[selectedType ?? "canape"]}.`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full max-w-lg bg-ink border border-gold/20 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="simulator-title"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-cream/40 hover:text-cream transition-colors z-10"
          aria-label={s.closeLabel}
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
                <h3 id="simulator-title" className="text-xl font-display uppercase text-cream">{s.title}</h3>
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
              <p className="text-cream/30 text-xs text-center">{s.processingHint}</p>
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
                <div className="absolute top-2 left-2 bg-black/60 text-red-400 text-xs font-bold uppercase px-2 py-0.5 rounded-sm pointer-events-none">{t.gallery.beforeLabel}</div>
                <div className="absolute top-2 right-2 bg-black/60 text-gold text-xs font-bold uppercase px-2 py-0.5 rounded-sm pointer-events-none">{t.gallery.afterLabel}</div>
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
                        ? `https://wa.me/${phone.replace(/\D/g, "")}?text=${waMsg}`
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
