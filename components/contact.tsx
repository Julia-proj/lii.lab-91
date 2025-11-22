import { Instagram, Mail, MessageCircle } from "lucide-react"
import Link from "next/link"

export function Contact() {
  return (
    <section id="contacto" className="py-24 bg-[#f5f5f5] text-center">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto fade-in-section">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">Contacto</h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            ¿Quieres reservar plaza en el curso o conseguir la Guía Metodológica? Escríbeme y te responderé
            personalmente.
          </p>

          <div className="flex flex-col items-center gap-6">
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 h-14 px-8 bg-[#25D366] text-white font-bold rounded-full transition-transform hover:scale-105 shadow-md hover:shadow-lg w-full sm:w-auto"
            >
              <MessageCircle size={20} />
              Escribir por WhatsApp
            </Link>

            <div className="flex gap-8 mt-4">
              <a
                href="https://instagram.com/tu_instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-[#F4B4C7] font-medium transition-colors"
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
              <a
                href="mailto:tuemail@example.com"
                className="flex items-center gap-2 text-gray-600 hover:text-[#F4B4C7] font-medium transition-colors"
              >
                <Mail size={20} />
                <span>Escríbeme por correo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
