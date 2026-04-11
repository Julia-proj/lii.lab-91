'use client'

import Image from 'next/image'
import { Clock, Plus, Check, Minus, ChevronDown, ChevronUp } from 'lucide-react'
import { formatDuration } from '@/lib/format'
import type { IService } from '@/types'
import { useState } from 'react'

const SERVICE_IMAGE_FALLBACK: Record<string, string> = {
  'Manicura combinada': 'ser1.jpg',
  'Manicura combinada con refuerzo': 'ser4.jpg',
  'Manicura francesa': 'ser3.jpg',
  'Decoraciones': 'ser2.jpg',
  'Manicura permanente con refuerzo y francesa': 'ser6.jpg',
  'Refuerzo con restauraciÃ³n del cuadrado': 'ser6.jpg',
  'Pedicura bÃ¡sica': 'ser8.jpg',
  'Pedicura con esmalte permanente y francesa': 'ser7.jpg',
}

interface ServiceCardProps {
  service: IService
  isSelected: boolean
  quantity: number
  onToggle: (service: IService) => void
  onSetQuantity: (serviceId: string, quantity: number) => void
}

export function ServiceCard({ service, isSelected, quantity, onToggle, onSetQuantity }: ServiceCardProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const rawImage = typeof service.image === 'string' ? service.image.trim() : ''
  const isValidImage = !!rawImage && rawImage !== 'null' && rawImage !== 'undefined'
  const raw = isValidImage ? rawImage : SERVICE_IMAGE_FALLBACK[service.name]
  
  const imgSrc = raw ? (raw.startsWith('http') || raw.startsWith('/') ? raw : `/images/services/${raw}`) : null

  return (
    <div
      onClick={() => onToggle(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onToggle(service)}
      className={`bg-white border rounded-lg p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-lavender shadow-sm ring-1 ring-lavender/20'
          : 'border-neutral-100 hover:border-lavender hover:shadow-sm'
      }`}
    >
      <div className="flex gap-3">
        {imgSrc && !imgError && (
          <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden relative">
            <Image src={imgSrc} alt={service.name} fill sizes="64px" className="object-cover" onError={() => setImgError(true)} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-sm text-neutral-900">{service.name}</h3>
            <span className="text-neutral-900 font-semibold text-base shrink-0">
              {service.price}{service.name === 'Decoraciones' ? '+' : ''}&euro;
            </span>
          </div>

          {service.description && (
            <div className="mt-1">
              <p className={`text-xs text-neutral-500 leading-relaxed ${!isDescExpanded ? 'line-clamp-2' : ''}`}>
                {service.description}
              </p>
              {service.description.length > 80 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsDescExpanded(!isDescExpanded)
                  }}
                  className="text-xs text-plum font-medium mt-1 inline-flex items-center gap-1 hover:underline active:underline"
                >
                  {isDescExpanded ? 'Leer menos' : 'Leer mÃ¡s'}
                  {isDescExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-1.5">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs text-neutral-500">
                <Clock className="w-3 h-3" />
                {formatDuration(service.duration)}
              </span>
              {service.includes && (
                <span className="text-xs text-neutral-500">Incluye: {service.includes}</span>
              )}
            </div>
            <span
              aria-hidden="true"
              className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all pointer-events-none ${
                isSelected
                  ? 'bg-plum text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-500 hover:bg-plum/20 hover:text-plum-hover border border-neutral-200'
              }`}
            >
              {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </span>
          </div>

          {isSelected && service.name === 'Decoraciones' && (
            <div
              className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-xs text-neutral-500">Cantidad:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { if (quantity > 1) onSetQuantity(service._id, quantity - 1) }}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => { if (quantity < 10) onSetQuantity(service._id, quantity + 1) }}
                  className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              <span className="text-xs text-neutral-500 ml-auto">{quantity * service.price}&euro;</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
