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
