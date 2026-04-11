'use client'

import { formatDate } from '@/lib/format'

function computeEndTime(start: string, durationMin: number): string {
  const [h, m] = start.split(':').map(Number)
  const total = h * 60 + m + durationMin
  return `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`
}

interface TimeSlotsGridProps {
  date: string | null
  slots: string[]
  slotsLoading: boolean
  selectedSlot: string | null
  totalDuration: number
  onSelectSlot: (slot: string) => void
}

export function TimeSlotsGrid({ date, slots, slotsLoading, selectedSlot, totalDuration, onSelectSlot }: TimeSlotsGridProps) {
  if (!date) {
    return (
      <div className="hidden md:flex h-full items-center justify-center py-12">
        <p className="text-sm text-neutral-500 text-center">
          Selecciona una fecha<br />para ver los horarios disponibles
        </p>
      </div>
    )
  }

  const morningSlots = slots.filter((s) => s < '14:00')
  const afternoonSlots = slots.filter((s) => s >= '15:00')

  return (
    <div>
      <p className="text-sm font-semibold text-neutral-700 mb-4 capitalize">{formatDate(date)}</p>

      {slotsLoading ? (
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-3 w-16 bg-neutral-200/60 rounded mb-3"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-[42px] bg-neutral-100/80 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-3 w-16 bg-neutral-200/60 rounded mb-3"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={`2-${i}`} className="h-[42px] bg-neutral-100/80 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      ) : slots.length === 0 ? (
        <p className="text-sm text-neutral-500 py-4 bg-neutral-50 rounded-xl text-center">
          No hay horarios disponibles. Elige otra fecha.
        </p>
      ) : (
        <div className="space-y-5">
          {morningSlots.length > 0 && (
            <SlotGroup label="Mañana" slots={morningSlots} selectedSlot={selectedSlot} totalDuration={totalDuration} onSelect={onSelectSlot} />
          )}
          {afternoonSlots.length > 0 && (
            <SlotGroup label="Tarde" slots={afternoonSlots} selectedSlot={selectedSlot} totalDuration={totalDuration} onSelect={onSelectSlot} />
          )}
        </div>
      )}
    </div>
  )
}

function SlotGroup({
  label,
  slots,
  selectedSlot,
  totalDuration,
  onSelect,
}: {
  label: string
  slots: string[]
  selectedSlot: string | null
  totalDuration: number
  onSelect: (slot: string) => void
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-widest">{label}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
        {slots.map((slot) => {
          const end = computeEndTime(slot, totalDuration)
          const isSelected = selectedSlot === slot
          return (
            <button
              key={slot}
              onClick={() => onSelect(slot)}
              className={`py-2.5 px-1 text-sm rounded-xl border transition-all duration-400 ease-out font-medium ${
                isSelected
                  ? 'bg-plum text-white border-plum shadow-md scale-[1.02] ring-2 ring-plum/20'
                  : 'border-neutral-200 hover:border-plum/50 hover:shadow-sm bg-white text-neutral-700'
              }`}
            >
              <span>{slot}</span>
              <span className={`text-xs block ${isSelected ? 'text-white/70' : 'text-neutral-500'}`}>
                — {end}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
