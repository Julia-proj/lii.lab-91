'use client'

import { useState, useEffect } from 'react'

interface Service {
  _id: string
  name: string
  category: string
  price: number
  duration: number
  description?: string
  active: boolean
  includes?: string
}

export function useServices(category?: string) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        const url = category ? `/api/services?category=${encodeURIComponent(category)}` : '/api/services'
        const res = await fetch(url)
        if (!res.ok) throw new Error('Error al cargar servicios')
        const json = await res.json()
        setServices(json.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [category])

  return { services, loading, error }
}
