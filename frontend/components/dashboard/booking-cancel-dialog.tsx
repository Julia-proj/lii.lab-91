'use client'

interface BookingCancelDialogProps {
  showConfirm: boolean
  cancelling: boolean
  onCancel: () => void
  onConfirm: () => void
  onDismiss: () => void
}

export function BookingCancelDialog({
  showConfirm,
  cancelling,
  onCancel,
  onConfirm,
  onDismiss,
}: BookingCancelDialogProps) {
  return (
    <div className="border-t border-neutral-100 px-4 sm:px-5 py-3">
      {showConfirm ? (
        <div className="flex items-center gap-3">
          <p className="text-xs text-neutral-500 flex-1">¿Confirmar cancelación?</p>
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {cancelling ? 'Cancelando...' : 'Sí, cancelar'}
          </button>
          <button
            onClick={onDismiss}
            className="text-xs text-neutral-500 hover:text-neutral-600 px-2 py-1.5 rounded-lg hover:bg-neutral-50 transition-colors"
          >
            Volver
          </button>
        </div>
      ) : (
        <button
          onClick={onCancel}
          className="text-xs text-neutral-500 hover:text-red-500 transition-colors font-medium"
        >
          Cancelar cita
        </button>
      )}
    </div>
  )
}
