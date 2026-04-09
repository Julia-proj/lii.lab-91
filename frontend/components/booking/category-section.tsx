'use client'

import { Star, ChevronDown } from 'lucide-react'
import { ServiceCard } from './service-card'
import type { IService } from '@/types'

interface CategorySectionProps {
  id: string
  label: string
  services: IService[]
  isOpen: boolean
  selectedIds: Set<string>
  quantities: Record<string, number>
  onToggle: () => void
  onToggleService: (service: IService) => void
  onSetQuantity: (serviceId: string, quantity: number) => void
}

export function CategorySection({
  id,
  label,
  services,
  isOpen,
  selectedIds,
  quantities,
  onToggle,
  onToggleService,
  onSetQuantity,
}: CategorySectionProps) {
  const isPopular = id === 'Populares'

  return (
    <div
      className={`rounded-xl border overflow-hidden transition-colors ${
        isPopular ? 'border-lavender/40 bg-lavender/5' : 'border-neutral-200 bg-white'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50/50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          {isPopular && <Star className="w-4 h-4 text-lavender" />}
          <span className="font-medium text-neutral-900">{label}</span>
          <span className="text-xs text-neutral-500">({services.length})</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-3 pb-3 space-y-2">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              isSelected={selectedIds.has(service._id)}
              quantity={quantities[service._id] ?? 1}
              onToggle={onToggleService}
              onSetQuantity={onSetQuantity}
            />
          ))}
        </div>
      )}
    </div>
  )
}
