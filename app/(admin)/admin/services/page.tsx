'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Power, Star, Scissors, ImagePlus, X, Loader2 } from 'lucide-react'
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
  image?: string
  includes?: string
}

const categories = ['Manicura', 'Pedicura', 'Reconstruccion', 'Retirado', 'Combo']

const EMPTY_FORM = {
  name: '',
  category: 'Manicura',
  price: 0,
  duration: 0,
  description: '',
  includes: '',
  popular: false,
  image: '',
}

export default function AdminServicesPage() {
  const [services, setServices]       = useState<ServiceData[]>([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [editingActive, setEditingActive] = useState(true)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [saving, setSaving]           = useState(false)
  const [uploading, setUploading]     = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (!res.ok) throw new Error()
      // admin needs all services incl. inactive — fetch without active filter
      const res2 = await fetch('/api/services?all=true')
      const data = res2.ok ? await res2.json() : await res.json()
      setServices(Array.isArray(data) ? data : [])
    } catch {
      toast.error('Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setEditingActive(true)
    setShowForm(false)
  }

  const handleEdit = (s: ServiceData) => {
    setForm({
      name:        s.name,
      category:    s.category,
      price:       s.price,
      duration:    s.duration,
      description: s.description || '',
      includes:    s.includes || '',
      popular:     s.popular ?? false,
      image:       s.image || '',
    })
    setEditingId(s._id)
    setEditingActive(s.active)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error || 'Error al subir imagen'); return }
      setForm((prev) => ({ ...prev, image: data.path }))
    } catch {
      toast.error('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) {
      toast.error('Completa todos los campos obligatorios')
      return
    }
    setSaving(true)
    try {
      const url    = editingId ? `/api/services/${editingId}` : '/api/services'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price:    Number(form.price),
          duration: Number(form.duration),
          active:   editingId ? editingActive : true,
          image:    form.image || undefined,
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
      toast.error('Error de conexión')
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
      setServices((prev) => prev.map((s) => s._id === id ? { ...s, active: !currentActive } : s))
      toast.success(!currentActive ? 'Activado' : 'Desactivado')
    } catch { toast.error('Error de conexión') }
  }

  const handleTogglePopular = async (id: string, currentPopular: boolean) => {
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ popular: !currentPopular }),
      })
      if (!res.ok) { toast.error('Error al actualizar'); return }
      setServices((prev) => prev.map((s) => s._id === id ? { ...s, popular: !currentPopular } : s))
    } catch { toast.error('Error de conexión') }
  }

  const fmt = (min: number) => {
    const h = Math.floor(min / 60), m = min % 60
    if (h === 0) return `${m}min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}min`
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
    </div>
  )

  const grouped = categories.map((cat) => ({
    category: cat,
    items: services.filter((s) => s.category === cat),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Servicios</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 bg-plum hover:bg-plum-hover text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Añadir servicio</span>
          <span className="sm:hidden">Añadir</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#1e1e24] rounded-xl border border-neutral-200 dark:border-white/8 p-4 sm:p-6">
          <h2 className="font-medium mb-4 text-neutral-900 dark:text-neutral-100">
            {editingId ? 'Editar servicio' : 'Nuevo servicio'}
          </h2>

          {/* Image upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">Foto del servicio</label>
            <div className="flex items-center gap-3">
              {form.image ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10 shrink-0">
                  <img src={form.image} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setForm((p) => ({ ...p, image: '' }))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-neutral-200 dark:border-white/10 flex items-center justify-center shrink-0 bg-neutral-50 dark:bg-white/3">
                  {uploading
                    ? <Loader2 className="w-5 h-5 text-neutral-300 animate-spin" />
                    : <ImagePlus className="w-5 h-5 text-neutral-300" />
                  }
                </div>
              )}
              <div className="flex flex-col gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="text-xs px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-plum hover:text-plum transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  {uploading ? 'Subiendo...' : form.image ? 'Cambiar foto' : 'Subir foto'}
                </button>
                <p className="text-[11px] text-neutral-400">JPG, PNG, WebP · máx 5 MB</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Nombre *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Categoría *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Precio (€) *</label>
              <input
                type="number" min={0} step={1}
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Duración (min) *</label>
              <input
                type="number" min={0} step={5}
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
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40 resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Incluye (para combos)</label>
              <input
                type="text"
                placeholder="Ej: Manicura Combinada, Pedicura Basica"
                value={form.includes}
                onChange={(e) => setForm({ ...form, includes: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#2a2a32] text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
              />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
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
              disabled={saving || uploading}
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
      {grouped.map(({ category, items }) => {
        if (items.length === 0) return null
        return (
          <div key={category}>
            <h2 className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-2 uppercase tracking-widest">
              <Scissors className="w-3.5 h-3.5" />
              {category}
            </h2>

            {/* Mobile: card list */}
            <div className="sm:hidden space-y-2">
              {items.map((s) => (
                <div
                  key={s._id}
                  className={`bg-white dark:bg-[#1e1e24] rounded-xl border border-neutral-100 dark:border-white/8 p-3 flex gap-3 ${!s.active ? 'opacity-50' : ''}`}
                >
                  {/* Thumbnail */}
                  {s.image && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-tight truncate">{s.name}</p>
                      <span className="text-sm font-medium text-plum dark:text-lavender shrink-0">{s.price}€</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-neutral-400">{fmt(s.duration)}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        s.active
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                          : 'bg-neutral-100 dark:bg-white/6 text-neutral-400'
                      }`}>
                        {s.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(s)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/8 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleTogglePopular(s._id, s.popular ?? false)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        s.popular ? 'text-plum bg-plum/10' : 'text-neutral-300 hover:text-plum hover:bg-plum/10'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5" fill={s.popular ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => handleToggleActive(s._id, s.active)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        s.active
                          ? 'text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                          : 'text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden sm:block bg-white dark:bg-[#1e1e24] rounded-xl border border-neutral-100 dark:border-white/8 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 dark:bg-white/[0.03] border-b border-neutral-100 dark:border-white/6">
                  <tr>
                    <th className="text-left px-4 py-2.5 font-medium text-neutral-400 dark:text-neutral-500 text-xs w-12" />
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
                      <td className="px-4 py-3">
                        {s.image && (
                          <div className="w-9 h-9 rounded-lg overflow-hidden">
                            <img src={s.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-200">{s.name}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{s.price}€</td>
                      <td className="px-4 py-3 text-neutral-400 dark:text-neutral-500">{fmt(s.duration)}</td>
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
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors ${
                            s.popular ? 'text-plum bg-plum/10' : 'text-neutral-300 dark:text-neutral-600 hover:text-plum hover:bg-plum/10'
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
