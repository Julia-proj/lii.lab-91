import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-xs tracking-[0.25em] uppercase text-neutral-400 mb-4">Lii.lab</p>
        <p className="font-serif text-7xl text-neutral-200 mb-4 leading-none">404</p>
        <h1 className="font-serif text-2xl text-neutral-900 mb-3">Página no encontrada</h1>
        <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 text-sm font-medium bg-neutral-900 text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/booking"
            className="px-5 py-2.5 text-sm font-medium border border-neutral-200 text-neutral-600 rounded-full hover:border-neutral-400 transition-colors"
          >
            Reservar cita
          </Link>
        </div>
      </div>
    </div>
  )
}
