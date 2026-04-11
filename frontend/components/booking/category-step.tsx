'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { useBooking, getTotalDuration, getTotalPrice } from './booking-context'
import type { IService } from '@/types'
import { InlineAuthForm } from './inline-auth-form'
import { CategorySection } from './category-section'
import { SelectionBar } from './selection-bar'
import { useInlineLogin } from '@/hooks/use-inline-login'

const CATEGORY_ORDER = ['Manicura', 'Pedicura', 'Reconstruccion', 'Retirado', 'Combo']
const CATEGORY_LABELS: Record<string, string> = {
  Manicura: 'Manicura', Pedicura: 'Pedicura', Reconstruccion: 'Reconstruccion',
  Retirado: 'Retirado', Combo: 'Combo',
}

export function CategoryStep() {
  const { state, dispatch } = useBooking()
  const { data: session } = useSession()
  const [allServices, setAllServices] = useState<IService[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Populares']))

  const login = useInlineLogin(() => {
    // After login succeeds, confirm services — handled via effect below
  })

  useEffect(() => {
    if (login.loginSucceeded && session && state.services.length > 0) {
      dispatch({ type: 'CONFIRM_SERVICES' })
      login.setLoginSucceeded(false)
      login.closeAuth()
    }
  }, [login.loginSucceeded, session, state.services, dispatch])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/services')
        if (!res.ok) throw new Error('request_failed')
        const json = await res.json()
        if (!cancelled && Array.isArray(json.data)) setAllServices(json.data)
      } catch {
        if (!cancelled) {
          setLoadError('Error al cargar los datos')
          toast.error('Error al cargar los datos')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const selectedIds = new Set(state.services.map((s) => s._id))

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleToggleService = (service: IService) => {
    selectedIds.has(service._id)
      ? dispatch({ type: 'REMOVE_SERVICE', payload: service._id })
      : dispatch({ type: 'ADD_SERVICE', payload: service })
  }

  const handleContinue = () => {
    if (state.services.length === 0) return
    if (session) dispatch({ type: 'CONFIRM_SERVICES' })
    else login.openAuth()
  }

  const popularServices = allServices.filter((s) => s.popular)
  const sections = [
    ...(popularServices.length > 0 ? [{ id: 'Populares', label: 'Servicios mas populares', services: popularServices }] : []),
    ...CATEGORY_ORDER.map((cat) => ({
      id: cat, label: CATEGORY_LABELS[cat],
      services: allServices.filter((s) => s.category === cat),
    })).filter((s) => s.services.length > 0),
  ]

  if (loading) {
    return (
      <div>
        <h2 className="font-serif text-xl mb-6 text-center">Elige tus servicios</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-neutral-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div>
        <h2 className="font-serif text-xl mb-6 text-center">Elige tus servicios</h2>
        <p className="text-sm text-red-500 text-center py-8">{loadError}</p>
      </div>
    )
  }

  if (login.showAuth && !session) {
    return (
      <InlineAuthForm
        services={state.services}
        loginEmail={login.loginEmail}
        loginPassword={login.loginPassword}
        loginError={login.loginError}
        loginLoading={login.loginLoading}
        loginSucceeded={login.loginSucceeded}
        onEmailChange={login.setLoginEmail}
        onPasswordChange={login.setLoginPassword}
        onSubmit={login.handleInlineLogin}
        onBack={login.closeAuth}
      />
    )
  }

  return (
    <div className="pb-28">
      <h2 className="font-serif text-xl mb-2 text-center">Elige tus servicios</h2>
      <p className="text-xs text-neutral-500 mb-6 text-center">Puedes seleccionar uno o varios servicios</p>

      <div className="space-y-3">
        {sections.map((section) => (
          <CategorySection
            key={section.id}
            id={section.id}
            label={section.label}
            services={section.services}
            isOpen={openSections.has(section.id)}
            selectedIds={selectedIds}
            quantities={state.quantities}
            onToggle={() => toggleSection(section.id)}
            onToggleService={handleToggleService}
            onSetQuantity={(serviceId, quantity) =>
              dispatch({ type: 'SET_QUANTITY', payload: { serviceId, quantity } })
            }
          />
        ))}
      </div>

      <SelectionBar
        services={state.services}
        quantities={state.quantities}
        totalPrice={getTotalPrice(state.services, state.quantities)}
        totalDuration={getTotalDuration(state.services, state.quantities)}
        onRemoveService={(id) => dispatch({ type: 'REMOVE_SERVICE', payload: id })}
        onContinue={handleContinue}
      />
    </div>
  )
}
