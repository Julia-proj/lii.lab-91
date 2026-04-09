'use client'

import { Star } from 'lucide-react'
import { ServiceImageUpload } from '@/components/admin/service-image-upload'

const categories = ['Manicura', 'Pedicura', 'Reconstruccion', 'Retirado', 'Combo']

interface ServiceFormData {
  name: string
  category: string
  price: number
  duration: number
  description: string
  includes: string
  popular: boolean
  image: string
}

interface ServiceFormProps {
  form: ServiceFormData
  setForm: (updater: (prev: ServiceFormData) => ServiceFormData) => void
  editingId: string | null
  editingActive: boolean
  saving: boolean
  uploading: boolean
  onSave: () => void
  onCancel: () => void
  onUpload: (file: File) => void
}

export function ServiceForm({ form, setForm, editingId, saving, uploading, onSave, onCancel, onUpload }: ServiceFormProps) {
  const f = <K extends keyof ServiceFormData>(key: K) => (val: ServiceFormData[K]) =>
    setForm((p) => ({ ...p, [key]: val }))

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-neutral-200 dark:border-white/8 p-4 sm:p-6">
      <h2 className="font-medium mb-4 text-neutral-900 dark:text-neutral-100">
        {editingId ? 'Editar servicio' : 'Nuevo servicio'}
      </h2>

      <ServiceImageUpload
        image={form.image}
        uploading={uploading}
        onUpload={onUpload}
        onRemove={() => setForm((p) => ({ ...p, image: '' }))}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Nombre *</label>
          <input type="text" value={form.name} onChange={(e) => f('name')(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-secondary text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Categoria *</label>
          <select value={form.category} onChange={(e) => f('category')(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-secondary text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Precio (&euro;) *</label>
          <input type="number" min={0} step={1} value={form.price || ''} onChange={(e) => f('price')(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-secondary text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Duracion (min) *</label>
          <input type="number" min={0} step={5} value={form.duration || ''} onChange={(e) => f('duration')(Number(e.target.value))}
            className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-secondary text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Descripcion</label>
          <textarea value={form.description} onChange={(e) => f('description')(e.target.value)} rows={2}
            className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-secondary text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40 resize-none"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">Incluye (para combos)</label>
          <input type="text" placeholder="Ej: Manicura Combinada, Pedicura Basica" value={form.includes} onChange={(e) => f('includes')(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-secondary text-neutral-900 dark:text-neutral-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-plum/40"
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input type="checkbox" checked={form.popular} onChange={(e) => f('popular')(e.target.checked)} className="w-4 h-4 rounded accent-plum" />
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-plum/60" />
              Mostrar en &quot;Servicios mas populares&quot;
            </span>
          </label>
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button onClick={onSave} disabled={saving || uploading}
          className="bg-plum hover:bg-plum-hover text-white font-semibold py-2 px-6 rounded-full transition-colors text-sm disabled:opacity-60 shadow-sm">
          {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
        </button>
        <button onClick={onCancel}
          className="border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 font-medium py-2 px-6 rounded-full transition-colors text-sm hover:bg-neutral-50 dark:hover:bg-white/5">
          Cancelar
        </button>
      </div>
    </div>
  )
}
