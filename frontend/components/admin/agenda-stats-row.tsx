import { X } from 'lucide-react'

interface AgendaStatsRowProps {
  todayCount: number
  pendingCount: number
  todayPrevistos: number
  showPending: boolean
  onTogglePending: () => void
}

export function AgendaStatsRow({
  todayCount,
  pendingCount,
  todayPrevistos,
  showPending,
  onTogglePending,
}: AgendaStatsRowProps) {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      {/* Hoy - citas */}
      <div className="bg-[#FFFFFF] dark:bg-[#121214] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-2xl border border-black/[0.04] dark:border-white/5 p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Hoy</p>
        <p className="text-2xl sm:text-3xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100 leading-none">{todayCount}</p>
        <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 sm:mt-1.5">{todayCount === 1 ? 'cita' : 'citas'}</p>
      </div>

      {/* Pendientes -- clickable */}
      <button
        onClick={onTogglePending}
        className={`relative rounded-2xl border bg-amber-50/60 dark:bg-amber-900/10 border-amber-200/50 dark:border-amber-700/20 p-3 sm:p-4 text-left transition-all hover:opacity-90 ${
          pendingCount > 0 && !showPending
            ? 'ring-2 ring-amber-300/50 dark:ring-amber-400/20 shadow-sm shadow-amber-100 dark:shadow-none'
            : ''
        }`}
      >
        {pendingCount > 0 && !showPending && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
          </span>
        )}
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Pendientes</p>
        <p className={`text-2xl sm:text-3xl font-bold tabular-nums leading-none ${
          pendingCount > 0 ? 'text-[#B8870D] dark:text-yellow-400' : 'text-neutral-900 dark:text-neutral-100'
        }`}>
          {pendingCount}
        </p>
        <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 sm:mt-1.5">
          {showPending ? 'cerrar ×' : pendingCount > 0 ? 'ver →' : 'sin confirmar'}
        </p>
      </button>

      {/* Previstos hoy */}
      <div className="bg-plum/5 dark:bg-plum/10 rounded-2xl border border-plum/15 dark:border-plum/20 p-3 sm:p-4">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-neutral-400 mb-1.5 sm:mb-2">Previstos</p>
        <p className="text-2xl sm:text-3xl font-bold tabular-nums text-plum leading-none">{todayPrevistos}</p>
        <p className="text-[11px] sm:text-xs text-neutral-400 mt-1 sm:mt-1.5">hoy · €</p>
      </div>
    </div>
  )
}
