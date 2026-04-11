'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Pencil, Power, Star } from 'lucide-react'

export interface ServiceData {
  _id: string
  name: string
  category: string
  price: number
  duration: number
  description?: string
  active: boolean
  popular: boolean
  image?: string
  includes?: string
}

const resolveImg = (img?: string) => {
  const i = img?.trim()
  if (!i || i === 'null' || i === 'undefined') return ''
  return i.startsWith('/') || i.startsWith('http') ? i : `/images/services/${i}`
}

const fmt = (min: number) => {
  const h = Math.floor(min / 60), m = min % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}

interface ServiceCardMobileProps {
  service: ServiceData
  onEdit: (s: ServiceData) => void
  onToggleActive: (id: string, currentActive: boolean) => void
  onTogglePopular: (id: string, currentPopular: boolean) => void
}

export function ServiceCardMobile({ service: s, onEdit, onToggleActive, onTogglePopular }: ServiceCardMobileProps) {
  const imgSrc = resolveImg(s.image)
  const [imgError, setImgError] = useState(false)
  return (
    <div className={`bg-white dark:bg-card rounded-xl border border-neutral-100 dark:border-white/8 p-3 flex gap-3 ${!s.active ? 'opacity-50' : ''}`}>
      {imgSrc && !imgError && (
        <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
          <Image src={imgSrc} alt={s.name} fill sizes="56px" className="object-cover" onError={() => setImgError(true)} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight truncate">{s.name}</p>
          <span className="text-sm font-medium text-plum dark:text-lavender shrink-0">{s.price}&euro;</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[11px] text-neutral-400">{fmt(s.duration)}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
            s.active
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
              : 'bg-neutral-100 dark:bg-white/6 text-neutral-400'
          }`}>
            {s.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <button onClick={() => onEdit(s)} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onTogglePopular(s._id, s.popular ?? false)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${s.popular ? 'text-plum bg-plum/10' : 'text-neutral-300 hover:text-plum hover:bg-plum/10'}`}>
          <Star className="w-3.5 h-3.5" fill={s.popular ? 'currentColor' : 'none'} />
        </button>
        <button onClick={() => onToggleActive(s._id, s.active)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${s.active ? 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
          <Power className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

export { fmt, resolveImg }
