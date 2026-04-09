'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { ServiceData } from '@/components/admin/services-list'

export type { ServiceData }

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

export function useAdminServices() {
  const [services, setServices]   = useState<ServiceData[]>([])
  const [loading, setLoading]     = useState(true)
  const [showForm, setShowForm]   = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingActive, setEditingActive] = useState(true)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => { fetchServices() }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (!res.ok) throw new Error()
      const res2 = await fetch('/api/services?all=true')
      const json = res2.ok ? await res2.json() : await res.json()
      setServices(json.data ?? [])
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
      name: s.name, category: s.category, price: s.price, duration: s.duration,
      description: s.description || '', includes: s.includes || '',
      popular: s.popular ?? false, image: s.image || '',
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
      const json = await res.json()
      if (!res.ok) { toast.error(json.error || 'Error al subir imagen'); return }
      setForm((prev) => ({ ...prev, image: json.data?.path ?? '' }))
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
        body: JSON.stringify({ ...form, price: Number(form.price), duration: Number(form.duration), active: editingId ? editingActive : true, image: form.image || '' }),
      })
      if (!res.ok) { const data = await res.json(); toast.error(data.error || 'Error al guardar'); return }
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
      setServices((prev) => prev.map((s) => s._id === id ? { ...s, active: !currentActive } : s))
      toast.success(!currentActive ? 'Activado' : 'Desactivado')
    } catch { toast.error('Error de conexion') }
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
    } catch { toast.error('Error de conexion') }
  }

  return {
    services, loading, showForm, editingId, editingActive, form, saving, uploading,
    setForm, setShowForm, resetForm, handleEdit, handleUpload, handleSave,
    handleToggleActive, handleTogglePopular,
  }
}
