'use client'

import {
  AppWindow, BedDouble, Building2, CalendarDays, Camera, Check, Clock, Droplets,
  Factory, FileText, Gauge, HardHat, Home, KeyRound, Leaf, List, MapPin, MessageCircle,
  Monitor, Receipt, Repeat, Ruler, ShieldCheck, Sofa, Sparkles, Star, Sun, Truck,
  Utensils, Zap, type LucideIcon,
} from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  'app-window': AppWindow,
  'bed-double': BedDouble,
  'building-2': Building2,
  'calendar-days': CalendarDays,
  camera: Camera,
  check: Check,
  clock: Clock,
  droplets: Droplets,
  factory: Factory,
  'file-text': FileText,
  gauge: Gauge,
  'hard-hat': HardHat,
  home: Home,
  'key-round': KeyRound,
  leaf: Leaf,
  list: List,
  'map-pin': MapPin,
  'message-circle': MessageCircle,
  monitor: Monitor,
  receipt: Receipt,
  repeat: Repeat,
  ruler: Ruler,
  'shield-check': ShieldCheck,
  sofa: Sofa,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  truck: Truck,
  utensils: Utensils,
  zap: Zap,
}

/** Les noms viennent des JSON de contenu, jamais du code. */
export default function Icon({ name, className }: { name: string; className?: string }) {
  const Glyph = ICONS[name]
  if (!Glyph) return null
  return <Glyph className={className} strokeWidth={1.5} aria-hidden />
}
