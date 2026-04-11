'use client'

import { X } from 'lucide-react'
import { formatDuration } from '@/lib/format'
import type { IService } from '@/types'

interface SelectionBarProps {
  services: IService[]
  quantities: Record<string, number>
  totalPrice: number
  totalDuration: number
  onRemoveService: (id: string) => void
  onContinue: () => void
}

export function SelectionBar({
  services,
  quantities,
  totalPrice,
  totalDuration,
  onRemoveService,
  onContinue,
}: SelectionBarProps) {
  if (services.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-neutral-100 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] p-4 sm:p-6 transition-all duration-500 ease-out transform translate-y-0 animate-in slide-in-from-bottom-10">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <span
              key={s._id}
              className="inline-flex items-center gap-1 bg-lavender/10 text-plum text-xs px-2.5 py-1 rounded-full"
            >
              {s.name}{(quantities[s._id] ?? 1) > 1 ? ` x${quantities[s._id]}` : ''}
              <button onClick={() => onRemoveService(s._id)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="text-sm">
            <span className="font-semibold text-neutral-900">{totalPrice}&euro;</span>
            <span className="text-neutral-400 mx-2">&middot;</span>
            <span className="text-neutral-500 font-light">{formatDuration(totalDuration)}</span>
          </div>
          <button
            onClick={onContinue}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3 px-8 rounded-full transition-all duration-400 ease-out text-sm shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 tracking-wide ring-1 ring-neutral-900/10"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
