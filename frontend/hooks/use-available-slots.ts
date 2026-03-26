'use client'

import { useState, useEffect } from 'react'

export function useAvailableSlots(date: string | null, serviceId: string | null) {
  const [slots, setSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!date || !serviceId) {
      setSlots([])
      return
    }

    const fetchSlots = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/available-slots?date=${encodeURIComponent(date)}&serviceId=${encodeURIComponent(serviceId)}`
        )
        if (!res.ok) throw new Error('Error al cargar horarios')
        const data = await res.json()
        setSlots(data.slots || [])
        setBlocked(data.blocked || false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        setSlots([])
      } finally {
        setLoading(false)
      }
    }

    fetchSlots()
  }, [date, serviceId])

  return { slots, loading, blocked, error }
}
