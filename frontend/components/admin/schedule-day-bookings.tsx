interface BookingData {
  _id: string
  date: string
  startTime: string
  endTime: string
  services: { name: string }[]
  user: { name: string }
  status: string
}

interface ScheduleDayBookingsProps {
  dayBookings: BookingData[]
}

export function ScheduleDayBookings({ dayBookings }: ScheduleDayBookingsProps) {
  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
      <h3 className="font-medium text-sm mb-3 text-neutral-900 dark:text-neutral-100">Citas del dia</h3>
      {dayBookings.length === 0 ? (
        <p className="text-xs text-neutral-400">No hay citas</p>
      ) : (
        <div className="space-y-2">
          {dayBookings
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
            .map((b) => (
              <div key={b._id} className="flex items-center justify-between text-sm border-b border-neutral-50 dark:border-white/5 pb-2 last:border-0">
                <div>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{b.startTime} – {b.endTime}</span>
                  <span className="text-neutral-400 mx-1.5">&middot;</span>
                  <span className="text-neutral-600 dark:text-neutral-400">{(b.services || []).map((s) => s.name).join(', ')}</span>
                </div>
                <div className="text-xs text-neutral-400">
                  {b.user?.name}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${
                    b.status === 'confirmada' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                    b.status === 'pendiente' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                    'bg-neutral-100 dark:bg-white/8 text-neutral-500 dark:text-neutral-400'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
