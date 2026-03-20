"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const FORMSPREE = "https://formspree.io/f/mjgazwyd";

export default function LeadForm() {
  const { t } = useLanguage();
  const f = t.hero.form;
  const whatsappNum = t.whatsapp.number;

  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedServices, setServices] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleService = (value: string) => {
    setServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  };

  const validate2 = () => {
    const e: Record<string, string> = {};
    if (!phone.trim()) e.phone = f.validationPhone;
    if (!location.trim()) e.location = f.validationLocation;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const svcLabels = selectedServices
    .map((v) => f.services.find((s) => s.value === v)?.label ?? v)
    .join(", ");

  const handleWhatsApp = () => {
    if (!validate2()) return;
    const lines = [
      `🛋️ *${f.title}*`,
      "",
      `📋 ${f.serviceLabel}: ${svcLabels}`,
      quantity ? `📐 ${f.quantityLabel}: ${quantity}` : null,
      name ? `👤 ${f.nameLabel}: ${name}` : null,
      `📞 ${f.phoneLabel}: ${phone}`,
      `📍 ${f.locationLabel}: ${location}`,
      "",
      `_wetdrycleaningbansko.com_`,
    ]
      .filter(Boolean)
      .join("\n");
    window.open(
      `https://wa.me/${whatsappNum}?text=${encodeURIComponent(lines)}`,
      "_blank",
      "noopener",
    );
    setSent(true);
  };

  const handleEmail = async () => {
    if (!validate2()) return;
    setSendingEmail(true);
    try {
      await fetch(FORMSPREE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          service: svcLabels,
          quantity: quantity || "—",
          name: name || "—",
          phone,
          location,
          _subject: `Nouveau lead — ${svcLabels}`,
        }),
      });
      setSent(true);
    } catch {
      // silently fail — user can retry
    } finally {
      setSendingEmail(false);
    }
  };

  const reset = () => {
    setSent(false);
    setStep(1);
    setServices([]);
    setQuantity("");
    setName("");
    setPhone("");
    setLocation("");
  };

  return (
    <div className="overflow-hidden border rounded-sm shadow-2xl bg-ink-700 border-gold/20 shadow-black/60">
      {/* Header */}
      <div className="px-6 py-4 bg-gold">
        <div className="text-xl font-bold tracking-wider uppercase font-display text-ink">
          {f.title}
        </div>
        <div className="text-ink/70 text-sm mt-0.5">{f.subtitle}</div>
      </div>

      <div className="p-6">
        {sent ? (
          /* ── Success ── */
          <div className="py-8 text-center">
            <div className="mb-4 text-5xl">✅</div>
            <h3 className="mb-2 text-xl tracking-wide uppercase font-display text-gold">
              {f.successTitle}
            </h3>
            <p className="text-sm text-cream/60">{f.successText}</p>
            <button
              onClick={reset}
              className="px-4 py-2 mt-6 text-xs btn-outline"
            >
              ← {f.newRequest}
            </button>
          </div>
        ) : step === 1 ? (
          /* ── Step 1: services ── */
          <div>
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-cream/50">
              {f.step1Title}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {f.services.map((svc) => {
                const active = selectedServices.includes(svc.value);
                return (
                  <button
                    key={svc.value}
                    onClick={() => toggleService(svc.value)}
                    className={`relative text-left px-3 py-3 rounded-sm border text-sm transition-all duration-200 ${
                      active
                        ? "border-gold bg-gold/10 text-gold font-medium"
                        : "border-gold/15 bg-white/[0.03] text-cream/70 hover:border-gold/35 hover:text-cream"
                    }`}
                  >
                    {svc.label}
                    {active && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gold rounded-full flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-ink"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedServices.length > 0 && (
              <p className="mb-4 text-xs text-cream/40">
                ✓ {selectedServices.length}{" "}
                {selectedServices.length === 1 ? "sélectionné" : "sélectionnés"}
              </p>
            )}

            <div className="mb-5">
              <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">
                {f.quantityLabel}
              </label>
              <input
                type="text"
                className="input-dark"
                placeholder={f.quantityPlaceholder}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={selectedServices.length === 0}
              className={`btn-gold w-full justify-center text-sm py-3 ${selectedServices.length === 0 ? "opacity-40 cursor-not-allowed hover:bg-gold hover:translate-y-0 hover:shadow-none" : ""}`}
            >
              {f.nextBtn}
            </button>
          </div>
        ) : (
          /* ── Step 2: contact + send options ── */
          <div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs text-cream/40 hover:text-cream/70 mb-4 transition-colors"
            >
              ←
            </button>
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-cream/50">
              {f.step2Title}
            </p>

            <div className="mb-5 space-y-4">
              <div>
                <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">
                  {f.nameLabel}
                </label>
                <input
                  type="text"
                  className="input-dark"
                  placeholder={f.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">
                  {f.phoneLabel}
                </label>
                <input
                  type="tel"
                  className={`input-dark ${errors.phone ? "border-red-500" : ""}`}
                  placeholder={f.phonePlaceholder}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((p) => ({ ...p, phone: "" }));
                  }}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-cream/50 uppercase tracking-widest mb-1.5">
                  {f.locationLabel}
                </label>
                <input
                  type="text"
                  className={`input-dark ${errors.location ? "border-red-500" : ""}`}
                  placeholder={f.locationPlaceholder}
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors((p) => ({ ...p, location: "" }));
                  }}
                />
                {errors.location && (
                  <p className="mt-1 text-xs text-red-400">{errors.location}</p>
                )}
              </div>
            </div>

            {/* ── Primary: WhatsApp ── */}
            <button
              onClick={handleWhatsApp}
              className="justify-center w-full py-3 text-sm btn-gold animate-pulse-gold"
            >
              {f.submitBtn}
            </button>

            {/* ── Divider ── */}
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-gold/10" />
              <span className="text-xs tracking-widest uppercase text-cream/25">
                {f.orLabel}
              </span>
              <div className="flex-1 h-px bg-gold/10" />
            </div>

            {/* ── Fallback: Email ── */}
            <button
              onClick={handleEmail}
              disabled={sendingEmail}
              className="flex items-center justify-center w-full gap-2 py-3 text-sm transition-all duration-200 border rounded-sm border-gold/20 text-cream/50 hover:text-cream hover:border-gold/40 disabled:opacity-40"
            >
              {sendingEmail ? (
                <span className="animate-pulse">{f.sendingLabel}</span>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {f.emailBtn}
                </>
              )}
            </button>

            <p className="mt-3 text-xs text-center text-cream/30">
              {f.disclaimer}
            </p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {!sent && (
        <div className="flex border-t border-gold/10">
          {[1, 2].map((n) => (
            <div
              key={n}
              className={`flex-1 h-0.5 transition-colors duration-300 ${step >= n ? "bg-gold" : "bg-gold/15"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
