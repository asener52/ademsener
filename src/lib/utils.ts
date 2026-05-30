import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return format(new Date(date), 'd MMMM yyyy', { locale: tr })
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export const typeLabels: Record<string, string> = {
  article: 'Makale',
  news: 'Son Gelişme',
  announcement: 'Duyuru',
  training: 'Eğitim',
  project: 'Proje',
  publication: 'Yayın',
}

export const typeColors: Record<string, string> = {
  article: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  news: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  announcement: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  training: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
  project: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  publication: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
}

export const typeGradients: Record<string, string> = {
  article: 'from-sky-500/20 to-blue-500/5',
  news: 'from-emerald-500/20 to-teal-500/5',
  announcement: 'from-amber-500/20 to-orange-500/5',
  training: 'from-violet-500/20 to-purple-500/5',
  project: 'from-rose-500/20 to-pink-500/5',
  publication: 'from-cyan-500/20 to-sky-500/5',
}
