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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap gap-1.5 mb-3">
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
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="font-semibold">{totalPrice}&euro;</span>
            <span className="text-neutral-500 mx-1.5">&middot;</span>
            <span className="text-neutral-500">{formatDuration(totalDuration)}</span>
          </div>
          <button
            onClick={onContinue}
            className="bg-plum hover:bg-plum-hover text-white font-semibold py-2.5 px-8 rounded-full transition-colors text-sm shadow-sm hover:shadow-md"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  )
}
