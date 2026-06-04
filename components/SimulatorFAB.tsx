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
