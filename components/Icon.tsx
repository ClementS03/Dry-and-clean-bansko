'use client'

import {
  AppWindow, Building2, Check, Droplets, Factory, FileText, Gauge, HardHat,
  Home, KeyRound, List, MessageCircle, Repeat, Ruler, ShieldCheck, Sofa,
  Sparkles, Truck, Zap, type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  'app-window': AppWindow,
  'building-2': Building2,
  check: Check,
  droplets: Droplets,
  factory: Factory,
  'file-text': FileText,
  gauge: Gauge,
  'hard-hat': HardHat,
  home: Home,
  'key-round': KeyRound,
  list: List,
  'message-circle': MessageCircle,
  repeat: Repeat,
  ruler: Ruler,
  'shield-check': ShieldCheck,
  sofa: Sofa,
  sparkles: Sparkles,
  truck: Truck,
  zap: Zap,
}

/** Les noms viennent des JSON de contenu, jamais du code. */
export default function Icon({ name, className }: { name: string; className?: string }) {
  const Glyph = ICONS[name]
  if (!Glyph) return null
  return <Glyph className={className} strokeWidth={1.5} aria-hidden />
}
