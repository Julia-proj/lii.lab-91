import Link from 'next/link'
import { XCircle } from 'lucide-react'

export default function GuideCancelPage() {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <XCircle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
      <h1 className="font-serif text-2xl mb-2">Compra cancelada</h1>
      <p className="text-neutral-500 mb-6">
        No se ha realizado ningún cargo. Puedes volver a intentarlo cuando quieras.
      </p>

      <div className="flex flex-col gap-3">
        <Link
          href="/#guia"
          className="inline-block bg-[#CDB4DB] hover:bg-[#bda0cb] text-white font-medium py-3 px-6 rounded-full transition-colors"
        >
          Volver a la guía
        </Link>
        <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
