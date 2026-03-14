import { BookOpen, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"

export function Contact() {
  return (
    <section id="contacto" className="py-16 md:py-28 bg-white text-center border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-2xl fade-in-section">
        <h2 className="text-4xl md:text-5xl font-serif mb-6 text-neutral-900">Contacto</h2>
        <p className="text-xl text-neutral-600 mb-12 font-light">
          ¿Quieres reservar una cita o conseguir la Guía Metodológica? Elige lo que necesitas.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-[#CDB4DB] text-neutral-900 rounded-full hover:bg-[#bda0cb] transition-all duration-300 group shadow-lg hover:shadow-xl"
          >
            <Calendar size={20} />
            <span className="text-base sm:text-lg font-medium">Reservar cita</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#guia"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 bg-neutral-900 text-white rounded-full hover:bg-[#CDB4DB] hover:text-neutral-900 transition-all duration-300 group shadow-xl hover:shadow-2xl"
          >
            <BookOpen size={20} />
            <span className="text-base sm:text-lg font-medium">Conseguir la guía</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
