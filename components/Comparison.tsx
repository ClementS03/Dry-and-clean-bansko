"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Comparison() {
  const { t } = useLanguage();
  const cmp = t.comparison;
  const ref = useScrollReveal();

  return (
    <section
      id="comparison"
      className="relative overflow-hidden section-pad bg-ink"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-4xl px-4 mx-auto sm:px-6">
        {/* Header */}
        <div className="mb-12 text-center reveal">
          <div className="mx-auto section-badge">{cmp.badge}</div>
          <h2 className="mt-4 text-4xl tracking-tight uppercase font-display sm:text-5xl text-cream">
            {cmp.title}
          </h2>
        </div>

        {/* ── Desktop table (md+) ── */}
        <div
          className="hidden overflow-hidden border rounded-sm reveal md:block border-gold/15"
          style={{ transitionDelay: "150ms" }}
        >
          <table className="w-full comparison-table">
            <thead>
              <tr>
                <th className="w-1/3 tracking-widest text-left uppercase text-cream/50 font-display">
                  &nbsp;
                </th>
                <th className="w-1/3 text-left">
                  <span className="text-gold">{cmp.our}</span>
                  <span className="ml-2 text-xs text-green-400">✓</span>
                </th>
                <th className="w-1/3 text-left">
                  <span className="text-cream/40">{cmp.classic}</span>
                  <span className="ml-2 text-xs text-red-400">✗</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cmp.rows.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? "bg-transparent" : "bg-white/[0.02]"}
                >
                  <td className="text-sm font-medium text-cream/50">
                    {row.label}
                  </td>
                  <td>
                    <span className="text-sm font-medium text-green-400">
                      {row.our}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-cream/35">{row.classic}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards (< md) ── */}
        <div className="space-y-3 md:hidden">
          {/* Column headers */}
          <div className="grid grid-cols-2 gap-3 px-1 mb-1">
            <div className="text-center">
              <span className="text-xs tracking-widest uppercase text-gold font-display">
                {cmp.our}
              </span>
              <span className="ml-1 text-xs text-green-400">✓</span>
            </div>
            <div className="text-center">
              <span className="text-xs tracking-widest uppercase text-cream/40 font-display">
                {cmp.classic}
              </span>
              <span className="ml-1 text-xs text-red-400">✗</span>
            </div>
          </div>

          {cmp.rows.map((row, i) => (
            <div
              key={i}
              className="overflow-hidden border rounded-sm reveal border-gold/10"
              style={{ transitionDelay: `${i * 60 + 150}ms` }}
            >
              {/* Row label */}
              <div className="px-4 py-2 border-b bg-gold/8 border-gold/10">
                <span className="text-xs font-semibold tracking-widest uppercase text-cream/60">
                  {row.label}
                </span>
              </div>
              {/* Values */}
              <div className="grid grid-cols-2 divide-x divide-gold/10">
                <div className="flex items-center justify-center px-4 py-3 text-center">
                  <span className="text-sm font-medium leading-tight text-green-400">
                    {row.our}
                  </span>
                </div>
                <div className="px-4 py-3 flex items-center justify-center text-center bg-white/[0.02]">
                  <span className="text-sm leading-tight text-cream/35">
                    {row.classic}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
