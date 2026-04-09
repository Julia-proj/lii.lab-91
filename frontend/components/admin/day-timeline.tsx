interface Booking {
  _id: string
  user: { name: string }
  startTime: string
  endTime: string
  status: string
}

const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export { toMin }

const STATUS_COLOR: Record<string, string> = {
  pendiente:  'bg-amber-400',
  confirmada: 'bg-plum',
  completada: 'bg-emerald-500/40',
  cancelada:  'bg-neutral-200 dark:bg-neutral-800',
}

export function DayTimeline({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) return null

  const sorted = [...bookings].sort((a, b) => a.startTime.localeCompare(b.startTime))
  const dayStart = Math.max(toMin(sorted[0].startTime) - 20, 8 * 60)
  const dayEnd   = Math.min(toMin(sorted[sorted.length - 1].endTime) + 20, 21 * 60)
  const totalSpan = dayEnd - dayStart

  const gaps: { from: string; to: string; mins: number }[] = []
  for (let i = 0; i < sorted.length - 1; i++) {
    const gapMins = toMin(sorted[i + 1].startTime) - toMin(sorted[i].endTime)
    if (gapMins > 0) gaps.push({ from: sorted[i].endTime, to: sorted[i + 1].startTime, mins: gapMins })
  }

  return (
    <div className="bg-neutral-50 dark:bg-white/4 rounded-xl p-3 mb-3">
      <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2.5">Agenda visual</p>

      {/* Bar */}
      <div className="relative h-7 bg-neutral-100 dark:bg-white/8 rounded-md overflow-hidden">
        {/* Booking segments */}
        {sorted.map((b) => {
          const left  = ((toMin(b.startTime) - dayStart) / totalSpan) * 100
          const width = ((toMin(b.endTime) - toMin(b.startTime)) / totalSpan) * 100
          return (
            <div
              key={b._id}
              className={`absolute top-0 h-full ${STATUS_COLOR[b.status] || 'bg-neutral-300'} opacity-80`}
              style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
              title={`${b.startTime}–${b.endTime} · ${b.user?.name}`}
            />
          )
        })}
        {/* Gap segments */}
        {gaps.map((g, i) => {
          const left  = ((toMin(g.from) - dayStart) / totalSpan) * 100
          const width = ((toMin(g.to) - toMin(g.from)) / totalSpan) * 100
          return (
            <div
              key={i}
              className="absolute top-0 h-full flex items-center justify-center border-x border-dashed border-neutral-300/70 dark:border-white/20 bg-white/60 dark:bg-white/5"
              style={{ left: `${left}%`, width: `${Math.max(width, 0.5)}%` }}
              title={`Libre: ${g.from}–${g.to} · ${g.mins}min`}
            >
              {width > 7 && (
                <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-medium leading-none">{g.mins}m</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Time ticks */}
      <div className="relative h-4 mt-0.5">
        {sorted.map((b) => {
          const left = ((toMin(b.startTime) - dayStart) / totalSpan) * 100
          return (
            <span
              key={b._id}
              className="absolute text-[10px] text-neutral-400 -translate-x-1/2 top-0"
              style={{ left: `${left}%` }}
            >
              {b.startTime}
            </span>
          )
        })}
      </div>
    </div>
  )
}
