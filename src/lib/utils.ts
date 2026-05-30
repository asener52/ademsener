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
}

export const typeColors: Record<string, string> = {
  article: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  news: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  announcement: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  training: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}
