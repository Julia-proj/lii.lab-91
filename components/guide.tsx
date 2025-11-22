import { Check, Book } from "lucide-react"
import Link from "next/link"

export function Guide() {
  const contents = [
    "Anatomía y fisiología de la uña",
    "Protocolos de higiene y esterilización",
    "Enfermedades y contraindicaciones",
    "Preparación de la uña natural",
    "Organización del puesto de trabajo",
    "Estructura de servicios y tiempos",
  ]

  return (
    <section id="guia" className="py-24 bg-[#fafafa] border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col-reverse md:flex-row gap-16 items-center">
          {/* Text Content */}
          <div className="w-full md:w-1/2 fade-in-section">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-[#F4B4C7] mb-2">
                <Book size={20} />
                <span className="font-bold text-sm uppercase tracking-widest">Material Exclusivo</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-serif mb-6 text-neutral-900">Guía Metodológica</h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-8 font-light">
                Un libro completo que reúne la información esencial para una manicurista. Escrita de forma clara y
                práctica para mejorar la técnica y optimizar los tiempos de servicio.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
              <h3 className="text-xl font-serif mb-6 text-neutral-900">Contenido principal</h3>
              <ul className="space-y-4">
                {contents.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-[#e8f5e9] flex items-center justify-center group-hover:bg-[#c8e6c9] transition-colors border border-[#a5d6a7]">
                      <Check size={14} className="text-[#2e7d32]" strokeWidth={2.5} />
                    </div>
                    <span className="text-neutral-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8 pl-4 border-l-4 border-[#CDB4DB]">
              <h3 className="font-bold text-neutral-900 mb-1">Para formadoras y profesionales</h3>
              <p className="text-neutral-600 text-sm">
                Facilita el trabajo de enseñanza y evita crear materiales desde cero.
              </p>
            </div>

            <Link
              href="https://www.instagram.com/lii.lab/?hl=es"
              target="_blank"
              className="inline-block px-8 py-4 bg-[#CDB4DB] text-neutral-900 font-medium rounded-full hover:bg-[#bda0cb] transition-colors shadow-sm hover:shadow-md"
            >
              Obtener la Guía en Instagram
            </Link>
          </div>

          {/* Image Content */}
          <div className="w-full md:w-1/2 flex justify-center fade-in-section">
            <div className="relative w-[80%] md:w-full max-w-md aspect-[3/4]">
              {/* Decorative Elements */}
              <div className="absolute top-4 -right-4 w-full h-full border border-neutral-200 rounded-none z-0"></div>

              <img
                src="/book-mockup-minimalist-clean.jpg"
                alt="Guía Metodológica"
                className="absolute inset-0 w-full h-full object-cover shadow-2xl z-10 grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
