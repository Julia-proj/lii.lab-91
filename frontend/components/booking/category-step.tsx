'use client'

import { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useBooking, getTotalDuration, getTotalPrice } from './booking-context'
import type { IService } from '@/types'
import { Clock, ChevronDown, Star, LogIn, Plus, X, Check, Minus } from 'lucide-react'

interface CategorySection {
  id: string
  label: string
  services: IService[]
}

const CATEGORY_ORDER = ['Manicura', 'Pedicura', 'Reconstruccion', 'Retirado', 'Combo']
const CATEGORY_LABELS: Record<string, string> = {
  Manicura: 'Manicura',
  Pedicura: 'Pedicura',
  Reconstruccion: 'Reconstruccion',
  Retirado: 'Retirado',
  Combo: 'Combo',
}

// Fallback images for services (used when DB doesn't have image field)
const SERVICE_IMAGE_FALLBACK: Record<string, string> = {
  'Manicura combinada': 'ser1.jpg',
  'Manicura combinada con refuerzo': 'ser4.jpg',
  'Manicura francesa': 'ser3.jpg',
  'Decoraciones': 'ser2.jpg',
  'Manicura permanente con refuerzo y francesa': 'ser6.jpg',
  'Refuerzo con restauración del cuadrado': 'ser6.jpg',
  'Pedicura básica': 'ser8.jpg',
  'Pedicura con esmalte permanente y francesa': 'ser7.jpg',
}

export function CategoryStep() {
  const { state, dispatch } = useBooking()
  const { data: session } = useSession()
  const router = useRouter()
  const [allServices, setAllServices] = useState<IService[]>([])
  const [loading, setLoading] = useState(true)
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['Populares']))

  // Inline auth state
  const [showAuth, setShowAuth] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginSucceeded, setLoginSucceeded] = useState(false)

  // After login, proceed to step 2
  useEffect(() => {
    if (loginSucceeded && session && state.services.length > 0) {
      dispatch({ type: 'CONFIRM_SERVICES' })
      setLoginSucceeded(false)
      setShowAuth(false)
    }
  }, [loginSucceeded, session, state.services, dispatch])

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllServices(data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const selectedIds = new Set(state.services.map((s) => s._id))

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h === 0) return `${m}min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}min`
  }

  const handleToggleService = (service: IService) => {
    if (selectedIds.has(service._id)) {
      dispatch({ type: 'REMOVE_SERVICE', payload: service._id })
    } else {
      dispatch({ type: 'ADD_SERVICE', payload: service })
    }
  }

  const handleContinue = () => {
    if (state.services.length === 0) return
    if (session) {
      dispatch({ type: 'CONFIRM_SERVICES' })
    } else {
      setShowAuth(true)
      setLoginEmail('')
      setLoginPassword('')
      setLoginError('')
    }
  }

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      })
      if (result?.error) {
        setLoginError('Email o contrasena incorrectos')
      } else {
        setLoginSucceeded(true)
      }
    } catch {
      setLoginError('Error de conexion')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleGoToRegister = () => {
    if (state.services.length > 0) {
      localStorage.setItem(
        'liilab-booking-state',
        JSON.stringify({ services: state.services, quantities: state.quantities })
      )
    }
    router.push('/register?callbackUrl=/booking?resume=true')
  }

  // Group services
  const popularServices = allServices.filter((s) => s.popular)
  const sections: CategorySection[] = [
    ...(popularServices.length > 0
      ? [{ id: 'Populares', label: 'Servicios mas populares', services: popularServices }]
      : []),
    ...CATEGORY_ORDER.map((cat) => ({
      id: cat,
      label: CATEGORY_LABELS[cat],
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

  // Inline auth form
  if (showAuth && !session) {
    return (
      <div>
        <h2 className="font-serif text-xl mb-2 text-center">Inicia sesion para continuar</h2>
        <p className="text-sm text-neutral-500 mb-6 text-center">
          {state.services.length} servicio{state.services.length > 1 ? 's' : ''} seleccionado{state.services.length > 1 ? 's' : ''}
        </p>

        <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <LogIn className="w-4 h-4 text-[#CDB4DB]" />
            <span className="text-sm font-medium text-neutral-700">Accede a tu cuenta</span>
          </div>

          {loginSucceeded && !session ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-neutral-500">
              <div className="animate-spin w-4 h-4 border-2 border-[#CDB4DB] border-t-transparent rounded-full" />
              Verificando sesion...
            </div>
          ) : (
            <form onSubmit={handleInlineLogin} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
              />
              <input
                type="password"
                placeholder="Contrasena"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
              />
              {loginError && <p className="text-xs text-red-500">{loginError}</p>}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-[#B48EC5] hover:bg-[#a37ab5] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 shadow-sm text-sm"
              >
                {loginLoading ? 'Entrando...' : 'Iniciar sesion'}
              </button>
            </form>
          )}

          {!loginSucceeded && (
            <>
              <button type="button" onClick={handleGoToRegister} className="w-full mt-3 text-sm text-[#9b7fa8] hover:text-[#7d6389] hover:underline font-medium">
                No tengo cuenta - Registrarme
              </button>
              <button type="button" onClick={() => setShowAuth(false)} className="w-full mt-2 text-sm text-neutral-500 hover:text-neutral-700 hover:underline">
                Volver a los servicios
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  const totalDuration = getTotalDuration(state.services, state.quantities)
  const totalPrice = getTotalPrice(state.services, state.quantities)

  return (
    <div className="pb-28">
      <h2 className="font-serif text-xl mb-2 text-center">Elige tus servicios</h2>
      <p className="text-xs text-neutral-500 mb-6 text-center">Puedes seleccionar uno o varios servicios</p>

      <div className="space-y-3">
        {sections.map((section) => {
          const isOpen = openSections.has(section.id)
          const isPopular = section.id === 'Populares'

          return (
            <div
              key={section.id}
              className={`rounded-xl border overflow-hidden transition-colors ${
                isPopular ? 'border-[#CDB4DB]/40 bg-[#CDB4DB]/5' : 'border-neutral-200 bg-white'
              }`}
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-neutral-50/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isPopular && <Star className="w-4 h-4 text-[#CDB4DB]" />}
                  <span className="font-medium text-neutral-900">{section.label}</span>
                  <span className="text-xs text-neutral-500">({section.services.length})</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-3 pb-3 space-y-2">
                  {section.services.map((service) => {
                    const isSelected = selectedIds.has(service._id)
                    return (
                      <div
                        key={service._id}
                        onClick={() => handleToggleService(service)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleToggleService(service)}
                        className={`bg-white border rounded-lg p-4 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#CDB4DB] shadow-sm ring-1 ring-[#CDB4DB]/20'
                            : 'border-neutral-100 hover:border-[#CDB4DB] hover:shadow-sm'
                        }`}
                      >
                        <div className="flex gap-3">
                          {/* Photo — only render if image exists */}
                          {(() => {
                            const raw = service.image || SERVICE_IMAGE_FALLBACK[service.name]
                            const imgSrc = raw
                              ? (raw.startsWith('/') ? raw : `/images/services/${raw}`)
                              : null
                            return imgSrc ? (
                              <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                                <img
                                  src={imgSrc}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : null
                          })()}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-medium text-sm text-neutral-900">
                                {service.name}
                              </h3>
                              <span className="text-neutral-900 font-semibold text-base shrink-0">
                                {service.price}{service.name === 'Decoraciones' ? '+' : ''}&euro;
                              </span>
                            </div>
                            {service.description && (
                              <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                                {service.description}
                              </p>
                            )}
                            <div className="flex items-center justify-between mt-1.5">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-xs text-neutral-500">
                                  <Clock className="w-3 h-3" />
                                  {formatDuration(service.duration)}
                                </span>
                                {service.includes && (
                                  <span className="text-xs text-neutral-500">
                                    Incluye: {service.includes}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={(e) => e.stopPropagation()}
                                tabIndex={-1}
                                aria-hidden="true"
                                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all pointer-events-none ${
                                  isSelected
                                    ? 'bg-[#B48EC5] text-white shadow-sm'
                                    : 'bg-neutral-100 text-neutral-500 hover:bg-[#B48EC5]/20 hover:text-[#7d6389] border border-neutral-200'
                                }`}
                              >
                                {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                              </button>
                            </div>

                            {/* Selector de cantidad para Decoraciones */}
                            {isSelected && service.name === 'Decoraciones' && (
                              <div
                                className="flex items-center gap-3 mt-3 pt-3 border-t border-neutral-100"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="text-xs text-neutral-500">Cantidad:</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      const current = state.quantities[service._id] ?? 1
                                      if (current > 1) {
                                        dispatch({ type: 'SET_QUANTITY', payload: { serviceId: service._id, quantity: current - 1 } })
                                      }
                                    }}
                                    className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-medium">
                                    {state.quantities[service._id] ?? 1}
                                  </span>
                                  <button
                                    onClick={() => {
                                      const current = state.quantities[service._id] ?? 1
                                      if (current < 10) {
                                        dispatch({ type: 'SET_QUANTITY', payload: { serviceId: service._id, quantity: current + 1 } })
                                      }
                                    }}
                                    className="w-7 h-7 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <span className="text-xs text-neutral-500 ml-auto">
                                  {(state.quantities[service._id] ?? 1) * service.price}\u20AC
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Floating selection bar */}
      {state.services.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4">
          <div className="max-w-3xl mx-auto">
            {/* Selected services chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {state.services.map((s) => (
                <span key={s._id} className="inline-flex items-center gap-1 bg-[#CDB4DB]/10 text-[#9b7fa8] text-xs px-2.5 py-1 rounded-full">
                  {s.name}{(state.quantities[s._id] ?? 1) > 1 ? ` x${state.quantities[s._id]}` : ''}
                  <button onClick={() => dispatch({ type: 'REMOVE_SERVICE', payload: s._id })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="font-semibold">{totalPrice}&euro;</span>
                <span className="text-neutral-500 mx-1.5">&middot;</span>
                <span className="text-neutral-500">{formatDuration(totalDuration)}</span>
              </div>
              <button
                onClick={handleContinue}
                className="bg-[#B48EC5] hover:bg-[#a37ab5] text-white font-semibold py-2.5 px-8 rounded-full transition-colors text-sm shadow-sm hover:shadow-md"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
