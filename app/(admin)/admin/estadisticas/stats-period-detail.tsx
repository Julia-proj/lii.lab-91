'use client'

type Period = 'hoy' | 'semana' | 'mes'

interface Booking {
  _id: string
  date: string
  startTime: string
  services: { name: string; price: number }[]
  user: { name: string }
  status: string
  paidAmount?: number
}

const STATUS_LABELS: Record<string, string> = {
  pendiente:  'Pendiente',
  confirmada: 'Confirmada',
  completada: 'Completada',
  cancelada:  'Cancelada',
}
const STATUS_COLORS: Record<string, string> = {
  pendiente:  'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  confirmada: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  completada: 'bg-plum/8 dark:bg-plum/20 text-plum dark:text-lavender',
  cancelada:  'bg-neutral-100 dark:bg-white/8 text-neutral-400',
}

const PERIOD_LABELS: Record<Period, string> = { hoy: 'Hoy', semana: 'Semana', mes: 'Mes' }

const fmtDate = (d: string) =>
  new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', weekday: 'short' })

interface StatsPeriodDetailProps {
  activePeriod: Period
  filteredBookings: Booking[]
}

export function StatsPeriodDetail({ activePeriod, filteredBookings }: StatsPeriodDetailProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-3">
        Citas — {PERIOD_LABELS[activePeriod]}
      </p>
      {filteredBookings.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-4">No hay citas en este período</p>
      ) : (
        <div className="space-y-0 divide-y divide-neutral-50 dark:divide-white/5">
          {filteredBookings.map((b) => {
            const serviceTotal = b.services?.reduce((s, sv) => s + sv.price, 0) ?? 0
            return (
              <div key={b._id} className="flex items-center justify-between py-2.5 gap-3 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tabular-nums shrink-0">
                      {fmtDate(b.date)} · {b.startTime}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[b.status] ?? STATUS_COLORS.cancelada}`}>
                      {STATUS_LABELS[b.status] ?? b.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate mt-0.5">
                    {b.user?.name}
                    <span className="text-neutral-400 font-normal"> · {b.services?.map((s) => s.name).join(', ')}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {b.paidAmount != null ? (
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">{b.paidAmount.toFixed(0)}€</p>
                  ) : (
                    <p className="text-xs text-neutral-300 dark:text-neutral-600 tabular-nums">~{serviceTotal.toFixed(0)}€</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {filteredBookings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-white/6 flex items-center justify-between">
          <p className="text-xs text-neutral-400">{filteredBookings.length} cita{filteredBookings.length !== 1 ? 's' : ''}</p>
          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 tabular-nums">
            {filteredBookings.reduce((sum, b) => sum + (b.paidAmount ?? 0), 0).toFixed(0)}€ cobrados
          </p>
        </div>
      )}
    </div>
  )
}
