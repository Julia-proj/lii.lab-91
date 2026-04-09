import { Search } from 'lucide-react'

interface BookingsFiltersProps {
  search: string
  setSearch: (v: string) => void
  dateFilter: 'all' | 'today' | 'week'
  setDateFilter: (v: 'all' | 'today' | 'week') => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  counts: Record<string, number>
}

export function BookingsFilters({
  search,
  setSearch,
  dateFilter,
  setDateFilter,
  statusFilter,
  setStatusFilter,
  counts,
}: BookingsFiltersProps) {
  return (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o servicio..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm bg-white dark:bg-card dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-plum/40 dark:placeholder:text-neutral-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        {([
          { value: 'all',   label: 'Todas' },
          { value: 'today', label: 'Hoy' },
          { value: 'week',  label: 'Semana' },
        ] as { value: 'all' | 'today' | 'week'; label: string }[]).map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setDateFilter(value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              dateFilter === value
                ? 'bg-neutral-800 dark:bg-white/15 text-white border-neutral-800 dark:border-white/15'
                : 'bg-white dark:bg-transparent text-neutral-500 border-neutral-200 dark:border-white/10 hover:border-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {label}
          </button>
        ))}

        <span className="w-px h-6 bg-neutral-200 dark:bg-white/10 self-center mx-0.5" />

        {[
          { value: 'all',        label: 'Estado' },
          { value: 'confirmada', label: 'Conf.' },
          { value: 'pendiente',  label: 'Pend.' },
          { value: 'completada', label: 'Comp.' },
          { value: 'cancelada',  label: 'Canc.' },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
              statusFilter === value
                ? 'bg-plum text-white border-plum'
                : 'bg-white dark:bg-transparent text-neutral-500 border-neutral-200 dark:border-white/10 hover:border-plum/50 hover:text-plum'
            }`}
          >
            {label}
            {counts[value] != null && value !== 'all' && (
              <span className={`ml-1 ${statusFilter === value ? 'text-white/70' : 'text-neutral-300'}`}>
                {counts[value] || 0}
              </span>
            )}
          </button>
        ))}
      </div>
    </>
  )
}
