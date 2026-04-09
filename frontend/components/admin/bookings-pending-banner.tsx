import { Bell, Check } from 'lucide-react'
import { toast } from 'sonner'

interface BookingData {
  _id: string
  services: { name: string; price: number }[]
  user: { name: string; email: string; phone: string }
  date: string
  startTime: string
  status: string
}

interface BookingsPendingBannerProps {
  pendingBookings: BookingData[]
  onConfirm: (id: string) => void
}

export function BookingsPendingBanner({ pendingBookings, onConfirm }: BookingsPendingBannerProps) {
  if (pendingBookings.length === 0) return null

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-500/8 dark:border-amber-500/20 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-amber-500" />
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
          {pendingBookings.length} pendiente{pendingBookings.length !== 1 ? 's' : ''} de confirmacion
        </p>
      </div>
      <div className="space-y-2">
        {pendingBookings
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((b) => (
            <div key={b._id} className="flex items-center justify-between bg-white dark:bg-card rounded-lg px-3 py-2.5 border border-amber-100 dark:border-white/6">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">{b.user?.name}</p>
                <p className="text-[11px] text-neutral-400">
                  {new Date(b.date + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })} · {b.startTime}
                  {b.services?.length > 0 && ` · ${b.services.map(s => s.name).join(', ')}`}
                </p>
              </div>
              <button
                onClick={() => onConfirm(b._id)}
                className="ml-3 shrink-0 flex items-center gap-1.5 text-xs bg-plum hover:bg-plum-hover text-white font-medium px-3 py-1.5 rounded-full transition-colors"
              >
                <Check className="w-3 h-3" />
                Confirmar
              </button>
            </div>
          ))}
      </div>
    </div>
  )
}
