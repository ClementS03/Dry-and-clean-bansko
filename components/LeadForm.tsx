"use client";

import { useId, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

/** Services dont le devis se raisonne en surface plutot qu en nombre d objets. */
const SURFACE_SERVICES = ["deep", "renovation", "turnover", "windows", "pressure", "industrial"];

export default function LeadForm({ preselect }: { preselect?: string }) {
  // Le formulaire est rendu deux fois par page, les id doivent etre uniques
  const uid = useId();
  const { t } = useLanguage();
  const f = t.hero.form;
  const whatsappNum = t.whatsapp.number;

  const [step, setStep] = useState(1);
  const [sent, setSent] = useState(false);
  const [submitMethod, setSubmitMethod] = useState<"whatsapp" | "email" | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [audience, setAudience] = useState<"private" | "business">("private");
  const [frequency, setFrequency] = useState<"once" | "recurring">("once");
  const [selectedServices, setServices] = useState<string[]>(preselect ? [preselect] : []);
  const [textileItems, setTextileItems] = useState<string[]>([]);
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);

  const textileOpen = selectedServices.includes("textile");
  const hasSurface = selectedServices.some((s) => SURFACE_SERVICES.includes(s));

  const quantityPlaceholder =
    textileOpen && hasSurface
      ? f.quantityPlaceholderMixed
      : hasSurface
        ? f.quantityPlaceholderSurface
        : f.quantityPlaceholderTextile;

  const labelOf = (value: string) => f.services.find((s) => s.value === value)?.label ?? value;
  const textileLabelOf = (value: string) =>
    f.textileItems.find((s) => s.value === value)?.label ?? value;

  const serviceLabels = selectedServices.map(labelOf).join(", ");
  const textileLabels = textileItems.map(textileLabelOf).join(", ");
  const audienceLabel = f.audience.find((a) => a.value === audience)?.label ?? "";
  const frequencyLabel = f.frequency.find((a) => a.value === frequency)?.label ?? "";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!phone.trim()) e.phone = f.validationPhone;
    if (!location.trim()) e.location = f.validationLocation;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleWhatsApp = () => {
    if (!validate()) return;
    const lines = [
      `*${f.title}*`,
      "",
      `${f.audienceLabel}: ${audienceLabel}`,
      `${f.serviceLabel}: ${serviceLabels}`,
      textileLabels ? `${f.textileLabel}: ${textileLabels}` : null,
      audience === "business" ? `${f.frequencyLabel}: ${frequencyLabel}` : null,
      quantity ? `${f.quantityLabel}: ${quantity}` : null,
      name ? `${f.nameLabel}: ${name}` : null,
      `${f.phoneLabel}: ${phone}`,
      `${f.locationLabel}: ${location}`,
      "",
      "wetdrycleaningbansko.com",
    ]
      .filter(Boolean)
      .join("\n");
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
    setSubmitMethod("whatsapp");
    setSent(true);
  };

  const handleEmail = async () => {
    if (!validate()) return;
    setSendingEmail(true);
    setEmailError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience,
          frequency: audience === "business" ? frequency : "",
          service: serviceLabels,
          serviceKeys: selectedServices,
          textile: textileLabels,
          textileKeys: textileItems,
          quantity,
          name,
          phone,
          location,
          _hp: honeypot,
        }),
      });
      if (res.ok) {
        setSubmitMethod("email");
        setSent(true);
      } else {
        setEmailError(true);
      }
    } catch {
      setEmailError(true);
    } finally {
      setSendingEmail(false);
    }
  };

  const reset = () => {
    setSent(false);
    setSubmitMethod(null);
    setStep(1);
    setAudience("private");
    setFrequency("once");
    setServices(preselect ? [preselect] : []);
    setTextileItems([]);
    setQuantity("");
    setName("");
    setPhone("");
    setLocation("");
    setEmailError(false);
  };

  const EmailIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  const chip = (active: boolean) =>
    `px-3 py-2.5 rounded-sm border text-sm transition-all duration-200 ${
      active
        ? "border-gold bg-gold/10 text-gold font-medium"
        : "border-gold/15 bg-white/[0.03] text-cream/70 hover:border-gold/35 hover:text-cream"
    }`;

  const fieldLabel = "block text-xs text-cream/50 uppercase tracking-widest mb-1.5";

  return (
    <div className="overflow-hidden border rounded-sm shadow-2xl bg-ink-700 border-gold/20 shadow-black/60">
      <div className="px-6 py-4 bg-gold">
        <div className="text-xl font-bold tracking-wider uppercase font-display text-ink">
          {f.title}
        </div>
        <div className="text-ink/70 text-sm mt-0.5">{f.subtitle}</div>
      </div>

      <div className="p-6">
        {sent ? (
          <div className="py-8 text-center">
            <h3 className="mb-2 text-xl tracking-wide uppercase font-display text-gold">
              {f.successTitle}
            </h3>
            <p className="text-sm text-cream/60">
              {submitMethod === "email" ? f.successTextEmail : f.successText}
            </p>
            <button onClick={reset} className="px-4 py-2 mt-6 text-xs btn-outline">
              {f.newRequest}
            </button>
          </div>
        ) : step === 1 ? (
          <div>
            {/* Prive ou pro : qualifie le lead avant meme le telephone */}
            <span id={`${uid}-audience`} className={fieldLabel}>{f.audienceLabel}</span>
            <div role="group" aria-labelledby={`${uid}-audience`} className="grid grid-cols-2 gap-2 mb-6">
              {f.audience.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAudience(option.value as "private" | "business")}
                  className={chip(audience === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <span id={`${uid}-service`} className={fieldLabel}>{f.serviceLabel}</span>
            <div role="group" aria-labelledby={`${uid}-service`} className="grid grid-cols-2 gap-2 mb-4">
              {f.services.map((service) => {
                const active = selectedServices.includes(service.value);
                return (
                  <button
                    key={service.value}
                    onClick={() => toggle(selectedServices, setServices, service.value)}
                    aria-pressed={active}
                    className={`${chip(active)} relative text-left`}
                  >
                    {service.label}
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

            {/* Sous-selection textile : se deplie sans ajouter une etape */}
            {textileOpen && (
              <div className="p-4 mb-4 border rounded-sm border-gold/15 bg-gold/[0.04]">
                <span id={`${uid}-textile`} className={fieldLabel}>{f.textileLabel}</span>
                <div role="group" aria-labelledby={`${uid}-textile`} className="flex flex-wrap gap-2">
                  {f.textileItems.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => toggle(textileItems, setTextileItems, item.value)}
                      className={`${chip(textileItems.includes(item.value))} py-1.5 text-xs`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {audience === "business" && (
              <div className="mb-4">
                <span id={`${uid}-frequency`} className={fieldLabel}>{f.frequencyLabel}</span>
                <div role="group" aria-labelledby={`${uid}-frequency`} className="grid grid-cols-2 gap-2">
                  {f.frequency.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFrequency(option.value as "once" | "recurring")}
                      className={chip(frequency === option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedServices.length > 0 && (
              <p className="mb-4 text-xs text-cream/60">
                {selectedServices.length}{" "}
                {selectedServices.length === 1 ? f.selectedLabel : f.selectedLabelPlural}
              </p>
            )}

            <div className="mb-5">
              <label htmlFor={`${uid}-details`} className={fieldLabel}>{f.quantityLabel}</label>
              <input suppressHydrationWarning
                id={`${uid}-details`}
                type="text"
                className="input-dark"
                placeholder={quantityPlaceholder}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={selectedServices.length === 0}
              className={`btn-gold w-full justify-center text-sm py-3 ${
                selectedServices.length === 0
                  ? "opacity-40 cursor-not-allowed hover:bg-gold hover:translate-y-0 hover:shadow-none"
                  : ""
              }`}
            >
              {f.nextBtn}
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm text-gold/70 hover:text-gold mb-4 transition-colors font-display uppercase tracking-wide"
            >
              {f.backBtn}
            </button>
            <p className="mb-4 text-xs font-semibold tracking-widest uppercase text-cream/50">
              {f.step2Title}
            </p>

            <div className="mb-5 space-y-4">
              <div>
                <label htmlFor={`${uid}-name`} className={fieldLabel}>{f.nameLabel}</label>
                <input suppressHydrationWarning
                  id={`${uid}-name`}
                  type="text"
                  className="input-dark"
                  placeholder={f.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={`${uid}-phone`} className={fieldLabel}>{f.phoneLabel}</label>
                <input suppressHydrationWarning
                  id={`${uid}-phone`}
                  type="tel"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={errors.phone ? `${uid}-phone-error` : undefined}
                  className={`input-dark ${errors.phone ? "border-red-500" : ""}`}
                  placeholder={f.phonePlaceholder}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((p) => ({ ...p, phone: "" }));
                  }}
                />
                {errors.phone && (
                  <p id={`${uid}-phone-error`} role="alert" className="mt-1 text-xs text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor={`${uid}-location`} className={fieldLabel}>{f.locationLabel}</label>
                <input suppressHydrationWarning
                  id={`${uid}-location`}
                  type="text"
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={errors.location ? `${uid}-location-error` : undefined}
                  className={`input-dark ${errors.location ? "border-red-500" : ""}`}
                  placeholder={f.locationPlaceholder}
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors((p) => ({ ...p, location: "" }));
                  }}
                />
                {errors.location && (
                  <p id={`${uid}-location-error`} role="alert" className="mt-1 text-xs text-red-400">
                    {errors.location}
                  </p>
                )}
              </div>
            </div>

            <div className="lg:hidden">
              <button
                onClick={handleWhatsApp}
                className="justify-center w-full py-3 text-sm btn-gold animate-pulse-gold"
              >
                {f.submitBtn}
              </button>
            </div>

            <div className="hidden lg:block">
              <button
                onClick={handleEmail}
                disabled={sendingEmail}
                className="justify-center w-full py-3 text-sm btn-gold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {sendingEmail ? (
                  <span className="animate-pulse">{f.sendingLabel}</span>
                ) : (
                  <>
                    <EmailIcon />
                    {f.emailBtn}
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 my-3 lg:hidden">
              <div className="flex-1 h-px bg-gold/10" />
              <span className="text-xs tracking-widest uppercase text-cream/55">{f.orLabel}</span>
              <div className="flex-1 h-px bg-gold/10" />
            </div>

            <div className="lg:hidden">
              <button
                onClick={handleEmail}
                disabled={sendingEmail}
                className="flex items-center justify-center w-full gap-2 py-3 text-sm transition-all duration-200 border rounded-sm border-gold/20 text-cream/50 hover:text-cream hover:border-gold/40 disabled:opacity-40"
              >
                {sendingEmail ? (
                  <span className="animate-pulse">{f.sendingLabel}</span>
                ) : (
                  <>
                    <EmailIcon />
                    {f.emailBtn}
                  </>
                )}
              </button>
            </div>

            {emailError && (
              <p className="mt-2 text-xs text-center text-red-400">{f.emailErrorMsg}</p>
            )}

            <p className="mt-3 text-xs text-center text-cream/55 lg:hidden">{f.disclaimer}</p>
            <p className="hidden mt-3 text-xs text-center text-cream/55 lg:block">
              {f.disclaimerEmail}
            </p>
          </div>
        )}
      </div>

      <input suppressHydrationWarning
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
      />

      {!sent && (
        <div className="flex border-t border-gold/10">
          {[1, 2].map((n) => (
            <div
              key={n}
              className={`flex-1 h-0.5 transition-colors duration-300 ${
                step >= n ? "bg-gold" : "bg-gold/15"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
