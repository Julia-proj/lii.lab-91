import { Instagram, ArrowRight } from "lucide-react"
import Link from "next/link"

export function Contact() {
  return (
    <section id="contacto" className="py-32 bg-white text-center border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-2xl fade-in-section">
        <h2 className="text-4xl md:text-5xl font-serif mb-6 text-neutral-900">Contacto</h2>
        <p className="text-xl text-neutral-600 mb-12 font-light">
          ¿Quieres reservar plaza en el curso o conseguir la Guía Metodológica? Escríbeme y te responderé personalmente.
        </p>

        {/* Removed WhatsApp and Email buttons, kept only Instagram as requested */}
        <Link
          href="https://www.instagram.com/lii.lab/?hl=es"
          target="_blank"
          className="inline-flex items-center gap-3 px-10 py-5 bg-neutral-900 text-white rounded-full hover:bg-[#CDB4DB] hover:text-neutral-900 transition-all duration-300 group shadow-xl hover:shadow-2xl"
        >
          <Instagram size={24} />
          <span className="text-lg font-medium">Escribir por Instagram</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
