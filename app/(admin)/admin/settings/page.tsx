'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, CalendarOff, Sun, Moon, Monitor } from 'lucide-react'
import { toast } from 'sonner'

interface BlockedDate {
  _id: string
  date: string
  reason?: string
}

interface BlockedHour {
  _id: string
  date: string
  startTime: string
  endTime: string
  reason?: string
}

export default function SettingsPage() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [blockedHours, setBlockedHours] = useState<BlockedHour[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  // New blocked date form
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [savingDate, setSavingDate] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('admin-theme') as 'light' | 'dark' | null
    setTheme(saved || 'light')

    Promise.all([
      fetch('/api/blocked-dates').then((r) => r.json()),
      fetch('/api/blocked-hours').then((r) => r.json()),
    ])
      .then(([dates, hours]) => {
        setBlockedDates(Array.isArray(dates) ? dates : [])
        setBlockedHours(Array.isArray(hours) ? hours : [])
      })
      .catch(() => toast.error('Error al cargar configuración'))
      .finally(() => setLoading(false))
  }, [])

  const applyTheme = (t: 'light' | 'dark' | 'system') => {
    setTheme(t)
    const dark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('admin-theme', t === 'system' ? (dark ? 'dark' : 'light') : t)
    toast.success('Tema actualizado')
  }

  const addBlockedDate = async () => {
    if (!newDate) return
    setSavingDate(true)
    try {
      const res = await fetch('/api/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newDate, reason: newReason || undefined }),
      })
      if (res.ok) {
        const created = await res.json()
        setBlockedDates((prev) => [...prev, created])
        setNewDate('')
        setNewReason('')
        toast.success('Fecha bloqueada')
      } else {
        const err = await res.json()
        toast.error(err.error || 'Error')
      }
    } finally {
      setSavingDate(false)
    }
  }

  const removeBlockedDate = async (id: string) => {
    const res = await fetch(`/api/blocked-dates/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setBlockedDates((prev) => prev.filter((d) => d._id !== id))
      toast.success('Fecha desbloqueada')
    }
  }

  const removeBlockedHour = async (id: string) => {
    const res = await fetch(`/api/blocked-hours/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setBlockedHours((prev) => prev.filter((h) => h._id !== id))
      toast.success('Horario desbloqueado')
    }
  }

  const fmt = (d: string) =>
    new Date(d + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long' })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Ajustes</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Configuración del panel</p>
      </div>

      {/* Theme */}
      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-5">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Apariencia</p>
        <h2 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-4">Tema del panel</h2>

        <div className="flex p-1 bg-neutral-100 dark:bg-white/6 rounded-xl gap-0.5">
          {([
            { value: 'light',  label: 'Claro',   icon: Sun,     desc: 'Fondo blanco' },
            { value: 'dark',   label: 'Oscuro',  icon: Moon,    desc: 'Fondo arena' },
            { value: 'system', label: 'Sistema', icon: Monitor, desc: 'Auto' },
          ] as const).map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              onClick={() => applyTheme(value)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-lg text-xs font-medium transition-all duration-200 ${
                theme === value
                  ? 'bg-white dark:bg-white/15 text-plum shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${theme === value ? 'text-plum' : ''}`} />
              <span className="font-semibold">{label}</span>
              <span className={`text-[10px] font-normal ${theme === value ? 'text-plum/60' : 'text-neutral-300'}`}>{desc}</span>
            </button>
          ))}
        </div>

        <p className="text-xs text-neutral-400 mt-3 text-center">
          {theme === 'light' && 'Modo claro activo — fondo blanco'}
          {theme === 'dark' && 'Modo oscuro activo — fondo arena cálida'}
          {theme === 'system' && 'Sigue el tema de tu dispositivo'}
        </p>
      </div>

      {/* Block dates */}
      <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-5">
        <h2 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-4">Bloquear días</h2>

        {/* Add form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-neutral-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum/30 bg-white dark:bg-[#111115]"
          />
          <input
            type="text"
            placeholder="Motivo (opcional)"
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-neutral-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum/30 bg-white dark:bg-[#111115]"
          />
          <button
            onClick={addBlockedDate}
            disabled={!newDate || savingDate}
            className="flex items-center gap-1.5 px-4 py-2 bg-plum text-white text-sm font-medium rounded-lg hover:bg-plum-hover transition-colors disabled:opacity-50 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Bloquear
          </button>
        </div>

        {/* List */}
        {blockedDates.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-4">No hay días bloqueados</p>
        ) : (
          <div className="space-y-2">
            {blockedDates.map((d) => (
              <div key={d._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-white/4 border border-neutral-100 dark:border-white/6">
                <div className="flex items-center gap-2.5">
                  <CalendarOff className="w-4 h-4 text-red-400 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 capitalize">{fmt(d.date)}</p>
                    {d.reason && <p className="text-xs text-neutral-400">{d.reason}</p>}
                  </div>
                </div>
                <button
                  onClick={() => removeBlockedDate(d._id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blocked hours */}
      {blockedHours.length > 0 && (
        <div className="bg-white dark:bg-[#1e1e24] rounded-2xl border border-neutral-100 dark:border-white/8 p-5">
          <h2 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 mb-4">Horarios bloqueados</h2>
          <div className="space-y-2">
            {blockedHours.map((h) => (
              <div key={h._id} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-neutral-50 dark:bg-white/4 border border-neutral-100 dark:border-white/6">
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 capitalize">{fmt(h.date)}</p>
                  <p className="text-xs text-neutral-400">{h.startTime} – {h.endTime}{h.reason ? ` · ${h.reason}` : ''}</p>
                </div>
                <button
                  onClick={() => removeBlockedHour(h._id)}
                  className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
