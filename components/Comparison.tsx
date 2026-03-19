'use client'

import { useLanguage } from '@/context/LanguageContext'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function Comparison() {
  const { t } = useLanguage()
  const cmp = t.comparison
  const ref = useScrollReveal()

  return (
    <section id="comparison" className="section-pad bg-ink relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div ref={ref} className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal">
          <div className="section-badge mx-auto">{cmp.badge}</div>
          <h2
            className="font-display text-4xl sm:text-5xl text-cream uppercase tracking-tight mt-4"
          >
            {cmp.title}
          </h2>
        </div>

        <div className="reveal overflow-hidden border border-gold/15 rounded-sm" style={{ transitionDelay: '150ms' }}>
          <table className="comparison-table w-full">
            <thead>
              <tr>
                <th className="text-left text-cream/50 font-display tracking-widest uppercase">
                  &nbsp;
                </th>
                <th className="text-left">
                  <span className="text-gold">{cmp.our}</span>
                  <span className="ml-2 text-green-400 text-xs">✓</span>
                </th>
                <th className="text-left">
                  <span className="text-cream/40">{cmp.classic}</span>
                  <span className="ml-2 text-red-400 text-xs">✗</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {cmp.rows.map((row, i) => (
                <tr
                  key={i}
                  className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.02]'}
                >
                  <td className="text-cream/50 font-medium text-sm">{row.label}</td>
                  <td>
                    <span className="text-green-400 text-sm font-medium">{row.our}</span>
                  </td>
                  <td>
                    <span className="text-cream/35 text-sm">{row.classic}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
