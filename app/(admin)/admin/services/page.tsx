'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Power, Star, Scissors } from 'lucide-react'
import { toast } from 'sonner'

interface ServiceData {
  _id: string
  name: string
  category: string
  price: number
  duration: number
  description?: string
  active: boolean
  popular: boolean
  includes?: string
}

const categories = ['Manicura', 'Pedicura', 'Reconstruccion', 'Retirado', 'Combo']

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingActive, setEditingActive] = useState(true)
  const [form, setForm] = useState({
    name: '',
    category: 'Manicura',
    price: 0,
    duration: 0,
    description: '',
    includes: '',
    popular: false,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setServices(data)
    } catch {
      toast.error('Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm({ name: '', category: 'Manicura', price: 0, duration: 0, description: '', includes: '', popular: false })
    setEditingId(null)
    setEditingActive(true)
    setShowForm(false)
  }

  const handleEdit = (s: ServiceData) => {
    setForm({
      name: s.name,
      category: s.category,
      price: s.price,
      duration: s.duration,
      description: s.description || '',
      includes: s.includes || '',
      popular: s.popular ?? false,
    })
    setEditingId(s._id)
    setEditingActive(s.active)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) {
      toast.error('Completa todos los campos obligatorios')
      return
    }

    setSaving(true)
    try {
      const url = editingId ? `/api/services/${editingId}` : '/api/services'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          duration: Number(form.duration),
          active: editingId ? editingActive : true,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || 'Error al guardar')
        return
      }

      toast.success(editingId ? 'Servicio actualizado' : 'Servicio creado')
      resetForm()
      fetchServices()
    } catch {
      toast.error('Error de conexion')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive }),
      })

      if (!res.ok) { toast.error('Error al actualizar'); return }

      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, active: !currentActive } : s))
      )
      toast.success(!currentActive ? 'Servicio activado' : 'Servicio desactivado')
    } catch {
      toast.error('Error de conexion')
    }
  }

  const handleTogglePopular = async (id: string, currentPopular: boolean) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ popular: !currentPopular }),
      })

      if (!res.ok) { toast.error('Error al actualizar'); return }

      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, popular: !currentPopular } : s))
      )
      toast.success(!currentPopular ? 'Marcado como popular' : 'Eliminado de populares')
    } catch {
      toast.error('Error de conexion')
    }
  }

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h === 0) return `${m}min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}min`
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-neutral-200 dark:border-white/10 border-t-plum rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  const groupedServices = categories.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category === cat),
  }))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Servicios</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 bg-plum hover:bg-plum-hover text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Añadir servicio
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#1e1e24] rounded-xl border border-neutral-200 dark:border-white/8 p-5 sm:p-6 mb-6">
          <h2 className="font-medium mb-4 text-neutral-900 dark:text-neutral-100">
            {editingId ? 'Editar servicio' : 'Nuevo servicio'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Categoría *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Precio (€) *</label>
              <input
                type="number"
                min={0}
                step={1}
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Duración (min) *</label>
              <input
                type="number"
                min={0}
                step={5}
                value={form.duration || ''}
                onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Descripción</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40 resize-none placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Incluye (para combos)</label>
              <input
                type="text"
                placeholder="Ej: Manicura Combinada Con Refuerzo, Pedicura Basica"
                value={form.includes}
                onChange={(e) => setForm({ ...form, includes: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40 placeholder:text-neutral-300 dark:placeholder:text-neutral-600"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                  className="w-4 h-4 rounded accent-plum"
                />
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-plum/60" />
                  Mostrar en &quot;Servicios más populares&quot;
                </span>
              </label>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-plum hover:bg-plum-hover text-white font-semibold py-2 px-6 rounded-full transition-colors text-sm disabled:opacity-60 shadow-sm"
            >
              {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button
              onClick={resetForm}
              className="border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 font-medium py-2 px-6 rounded-full transition-colors text-sm hover:bg-neutral-50 dark:hover:bg-white/5"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Services by category */}
      {groupedServices.map(({ category, items }) => {
        if (items.length === 0) return null
        return (
          <div key={category} className="mb-8">
            <h2 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-2 uppercase tracking-widest">
              <Scissors className="w-3.5 h-3.5" />
              {category}
            </h2>
            <div className="bg-white dark:bg-[#1e1e24] rounded-xl border border-neutral-100 dark:border-white/8 overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[580px]">
                <thead className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-100 dark:border-white/6">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs">Servicio</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-20">Precio</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-24">Duración</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-24">Estado</th>
                    <th className="text-center px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-20">Popular</th>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 dark:divide-white/5">
                  {items.map((s) => (
                    <tr key={s._id} className={`hover:bg-neutral-50/60 dark:hover:bg-white/[0.03] transition-colors ${!s.active ? 'opacity-40' : ''}`}>
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-200">{s.name}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{s.price}€</td>
                      <td className="px-4 py-3 text-neutral-400 dark:text-neutral-500">{formatDuration(s.duration)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          s.active
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                            : 'bg-neutral-100 dark:bg-white/6 text-neutral-400 dark:text-neutral-500'
                        }`}>
                          {s.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleTogglePopular(s._id, s.popular ?? false)}
                          title={s.popular ? 'Quitar de populares' : 'Marcar como popular'}
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                            s.popular
                              ? 'text-plum bg-plum/10'
                              : 'text-neutral-300 dark:text-neutral-600 hover:text-plum hover:bg-plum/10'
                          }`}
                        >
                          <Star className="w-4 h-4" fill={s.popular ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(s)}
                            className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(s._id, s.active)}
                            className={`p-1.5 rounded transition-colors ${
                              s.active
                                ? 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                                : 'text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            }`}
                            title={s.active ? 'Desactivar' : 'Activar'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
