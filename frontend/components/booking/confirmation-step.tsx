'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useBooking, getTotalDuration, getTotalPrice } from './booking-context'
import { LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { InlineLoginForm } from './inline-login-form'
import { BookingSummary } from './booking-summary'

export function ConfirmationStep() {
  const { state, dispatch } = useBooking()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginSucceeded, setLoginSucceeded] = useState(false)

  useEffect(() => {
    if (loginSucceeded && session) {
      setShowLogin(false)
      setLoginSucceeded(false)
      toast.success('Sesión iniciada')
    }
  }, [loginSucceeded, session])

  const totalDuration = getTotalDuration(state.services, state.quantities)
  const totalPrice = getTotalPrice(state.services, state.quantities)

  const handleGoToRegister = () => {
    if (state.services.length === 0 || !state.date || !state.timeSlot) return
    localStorage.setItem('liilab-booking-state', JSON.stringify({
      services: state.services, date: state.date, timeSlot: state.timeSlot, notes: state.notes,
    }))
    router.push('/register?callbackUrl=/booking?resume=true')
  }

  const handleConfirm = async () => {
    if (state.services.length === 0 || !state.date || !state.timeSlot) return
    if (!session) { setShowLogin(true); return }
    setLoading(true)
    try {
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
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error || 'Error al crear la reserva')
        if (res.status === 409) dispatch({ type: 'GO_TO_STEP', payload: 2 })
        return
      }
      localStorage.removeItem('liilab-booking-state')
      toast.success('¡Solicitud enviada!')
      router.push(`/booking/confirmation/${json.data._id}`)
    } catch {
      toast.error('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (state.services.length === 0 || !state.date || !state.timeSlot) return null

  if (status === 'loading') {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-lavender border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="font-serif text-xl mb-6 text-center">Confirma tu reserva</h2>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-md mx-auto">
        <BookingSummary
          services={state.services}
          quantities={state.quantities}
          date={state.date}
          timeSlot={state.timeSlot}
          totalDuration={totalDuration}
          totalPrice={totalPrice}
          notes={state.notes}
          onNotesChange={(v) => dispatch({ type: 'SET_NOTES', payload: v })}
        />

        {showLogin && !session && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center gap-2 mb-3">
              <LogIn className="w-4 h-4 text-lavender" />
              <span className="text-sm font-medium text-neutral-700">Inicia sesión para confirmar</span>
            </div>
            {loginSucceeded ? (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-neutral-500">
                <div className="animate-spin w-4 h-4 border-2 border-lavender border-t-transparent rounded-full" />
                Verificando sesión...
              </div>
            ) : (
              <InlineLoginForm onSuccess={() => setLoginSucceeded(true)} />
            )}
            {!loginSucceeded && (
              <button
                type="button"
                onClick={handleGoToRegister}
                className="w-full mt-2 text-sm text-plum hover:text-plum-hover hover:underline font-medium"
              >
                No tengo cuenta - Registrarme
              </button>
            )}
          </div>
        )}

        {(!showLogin || session) && (
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full mt-8 bg-neutral-900 hover:bg-neutral-800 text-white font-medium py-3.5 rounded-full transition-all duration-400 ease-out disabled:opacity-60 shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 tracking-wide ring-1 ring-neutral-900/10"
          >
            {loading ? 'Confirmando...' : 'Confirmar reserva'}
          </button>
        )}

        <p className="text-xs text-neutral-500 text-center mt-3">El pago se realiza en local</p>
      </div>

      <div className="flex justify-center gap-6 mt-6">
        <button onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 2 })} className="text-sm text-plum hover:text-plum-hover hover:underline font-medium">
          Cambiar horario
        </button>
        <button onClick={() => dispatch({ type: 'GO_TO_STEP', payload: 1 })} className="text-sm text-neutral-500 hover:text-neutral-700 hover:underline font-medium">
          Cambiar servicios
        </button>
      </div>
    </div>
  )
}
