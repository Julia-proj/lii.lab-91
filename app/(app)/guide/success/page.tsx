import Link from 'next/link'
import { CheckCircle, Download } from 'lucide-react'

export default function GuideSuccessPage() {
  return (
    <div className="max-w-md mx-auto text-center py-12">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="font-serif text-2xl mb-2">¡Compra exitosa!</h1>
      <p className="text-neutral-500 mb-6">
        Gracias por adquirir la Guía Metodológica de Lii.lab. Te hemos enviado un
        email con el enlace de descarga.
      </p>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <Download className="w-8 h-8 text-lavender mx-auto mb-3" />
        <h3 className="font-medium mb-2">Guía Metodológica Lii.lab</h3>
        <p className="text-sm text-neutral-400 mb-4">
          Revisa tu email para el enlace de descarga.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-lavender hover:bg-plum text-white font-medium py-2.5 px-6 rounded-full transition-colors text-sm"
        >
          Ir a mi panel
        </Link>
      </div>

      <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-700">
        Volver al inicio
      </Link>
    </div>
  )
}
