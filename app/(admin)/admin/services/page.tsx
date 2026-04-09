'use client'

import { Plus } from 'lucide-react'
import { ServiceForm } from '@/components/admin/service-form'
import { ServicesList } from '@/components/admin/services-list'
import { useAdminServices } from '@/hooks/use-admin-services'

export default function AdminServicesPage() {
  const {
    services, loading, showForm, editingId, editingActive, form, saving, uploading,
    setForm, setShowForm, resetForm, handleEdit, handleUpload, handleSave,
    handleToggleActive, handleTogglePopular,
  } = useAdminServices()

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-5 h-5 border-2 border-neutral-200 border-t-plum rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Servicios</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="inline-flex items-center gap-2 bg-plum hover:bg-plum-hover text-white font-semibold py-2 px-4 rounded-full transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Anadir servicio</span>
          <span className="sm:hidden">Anadir</span>
        </button>
      </div>

      {showForm && (
        <ServiceForm
          form={form}
          setForm={(updater) => setForm((prev) => updater(prev))}
          editingId={editingId}
          editingActive={editingActive}
          saving={saving}
          uploading={uploading}
          onSave={handleSave}
          onCancel={resetForm}
          onUpload={handleUpload}
        />
      )}

      <ServicesList
        services={services}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        onTogglePopular={handleTogglePopular}
      />
    </div>
  )
}
