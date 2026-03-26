'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { useBooking, getTotalDuration, getTotalPrice } from './booking-context'
import { Calendar, Clock, Euro, FileText, LogIn } from 'lucide-react'
import { toast } from 'sonner'

export function ConfirmationStep() {
  const { state, dispatch } = useBooking()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginSucceeded, setLoginSucceeded] = useState(false)

  useEffect(() => {
    if (loginSucceeded && session) {
      setShowLogin(false)
      setLoginSucceeded(false)
      toast.success('Sesion iniciada')
    }
  }, [loginSucceeded, session])

  const totalDuration = getTotalDuration(state.services, state.quantities)
  const totalPrice = getTotalPrice(state.services, state.quantities)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatDuration = (min: number) => {
    const h = Math.floor(min / 60)
    const m = min % 60
    if (h === 0) return `${m}min`
    if (m === 0) return `${h}h`
    return `${h}h ${m}min`
  }

  const computeEndTime = (start: string, durationMin: number) => {
    const [h, m] = start.split(':').map(Number)
    const total = h * 60 + m + durationMin
    const eh = Math.floor(total / 60)
    const em = total % 60
    return `${eh.toString().padStart(2, '0')}:${em.toString().padStart(2, '0')}`
  }

  const saveStateToStorage = () => {
    if (state.services.length === 0 || !state.date || !state.timeSlot) return
    const toSave = {
      services: state.services,
      date: state.date,
      timeSlot: state.timeSlot,
      notes: state.notes,
    }
    localStorage.setItem('liilab-booking-state', JSON.stringify(toSave))
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
    saveStateToStorage()
    router.push('/register?callbackUrl=/booking?resume=true')
  }

  const handleConfirm = async () => {
    if (state.services.length === 0 || !state.date || !state.timeSlot) return

    if (!session) {
      setShowLogin(true)
      return
    }

    setLoading(true)
    try {
      // Create ONE booking with all services
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          services: state.services.map((s) => s._id),
          quantities: state.quantities,
          date: state.date,
          startTime: state.timeSlot,
          notes: state.notes || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error || 'Error al crear la reserva')
        if (res.status === 409) {
          dispatch({ type: 'GO_TO_STEP', payload: 2 })
        }
        return
      }

      localStorage.removeItem('liilab-booking-state')
      toast.success('¡Solicitud enviada!')
      router.push(`/booking/confirmation/${data._id}`)
    } catch {
      toast.error('Error de conexion')
    } finally {
      setLoading(false)
    }
  }

  if (state.services.length === 0 || !state.date || !state.timeSlot) return null

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-[#CDB4DB] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-xl mb-6 text-center">Confirma tu reserva</h2>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-md mx-auto">
        {/* Service list */}
        {state.services.length === 1 ? (
          <h3 className="font-medium text-lg mb-4">{state.services[0].name}</h3>
        ) : (
          <div className="mb-4">
            <h3 className="font-medium text-base mb-2">Servicios seleccionados</h3>
            <div className="space-y-1.5">
              {state.services.map((s) => {
                const qty = state.quantities[s._id] ?? 1
                return (
                  <div key={s._id} className="flex justify-between text-sm">
                    <span className="text-neutral-700">{s.name}{qty > 1 ? ` x${qty}` : ''}</span>
                    <span className="text-neutral-500">{s.price * qty}&euro; &middot; {formatDuration(s.duration * qty)}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-neutral-600">
            <Calendar className="w-4 h-4 text-[#CDB4DB] shrink-0" />
            <span className="capitalize">{formatDate(state.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Clock className="w-4 h-4 text-[#CDB4DB] shrink-0" />
            <span>{state.timeSlot} - {computeEndTime(state.timeSlot, totalDuration)} ({formatDuration(totalDuration)})</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-600">
            <Euro className="w-4 h-4 text-[#CDB4DB] shrink-0" />
            <span>{totalPrice}&euro; &middot; Pago en local</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-100">
          <label htmlFor="notes" className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
            <FileText className="w-4 h-4" />
            Notas (opcional)
          </label>
          <textarea
            id="notes"
            value={state.notes}
            onChange={(e) => dispatch({ type: 'SET_NOTES', payload: e.target.value })}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent"
            rows={2}
            placeholder="Cualquier informacion adicional..."
          />
        </div>

        {showLogin && !session && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 mb-3">
              <LogIn className="w-4 h-4 text-[#CDB4DB]" />
              <span className="text-sm font-medium text-neutral-700">Inicia sesion para confirmar</span>
            </div>

            {loginSucceeded ? (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-neutral-500">
                <div className="animate-spin w-4 h-4 border-2 border-[#CDB4DB] border-t-transparent rounded-full" />
                Verificando sesion...
              </div>
            ) : (
              <form onSubmit={handleInlineLogin} className="space-y-3">
                <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent" />
                <input type="password" placeholder="Contrasena" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CDB4DB] focus:border-transparent" />
                {loginError && <p className="text-xs text-red-500">{loginError}</p>}
                <button type="submit" disabled={loginLoading} className="w-full bg-[#B48EC5] hover:bg-[#a37ab5] text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60 text-sm shadow-sm">
                  {loginLoading ? 'Entrando...' : 'Iniciar sesion'}
                </button>
              </form>
            )}

            {!loginSucceeded && (
              <button type="button" onClick={handleGoToRegister} className="w-full mt-2 text-sm text-[#9b7fa8] hover:text-[#7d6389] hover:underline font-medium">
                No tengo cuenta - Registrarme
              </button>
            )}
          </div>
        )}

        {(!showLogin || session) && (
          <button onClick={handleConfirm} disabled={loading} className="w-full mt-6 bg-[#B48EC5] hover:bg-[#a37ab5] text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 shadow-sm hover:shadow-md">
            {loading ? 'Confirmando...' : 'Confirmar reserva'}
          </button>
        )}

        <p className="text-xs text-neutral-400 text-center mt-3">El pago se realiza en local</p>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <button onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 2 })} className="text-sm text-[#9b7fa8] hover:text-[#7d6389] hover:underline font-medium">
          Cambiar horario
        </button>
        <button onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 1 })} className="text-sm text-neutral-500 hover:text-neutral-700 hover:underline font-medium">
          Cambiar servicios
        </button>
      </div>
    </div>
  )
}
