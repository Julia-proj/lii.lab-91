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
    <section id="guia" className="py-32 md:py-48 bg-[#fafafa] border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col-reverse md:flex-row gap-12 items-center">
          {/* Text Content */}
          <div className="w-full md:w-7/12 fade-in-section">
            <div className="mb-12">
              <p className="text-neutral-600 text-lg leading-relaxed mb-10 font-light">
                Un libro completo que reúne la información esencial para una manicurista. Escrita de forma clara y
                práctica para mejorar la técnica y optimizar los tiempos de servicio.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-12">
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

            <div className="mb-12 pl-6 border-l-4 border-[#CDB4DB]">
              <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Para formadoras y profesionales</h3>
              <p className="text-neutral-600 text-base leading-relaxed">
                Facilita el trabajo de enseñanza y evita crear materiales desde cero.
              </p>
            </div>

            <Link
              href="https://www.instagram.com/lii.lab/?hl=es"
              target="_blank"
              className="inline-block w-full md:w-auto px-10 py-4 bg-[#CDB4DB] text-neutral-900 font-medium rounded-full hover:bg-[#bda0cb] transition-all duration-300 shadow-sm hover:shadow-md text-center"
            >
              Obtener la Guía en Instagram
            </Link>
          </div>

          {/* Image Content */}
          <div className="w-full md:w-5/12 flex justify-center fade-in-section">
            <div className="relative max-w-sm mx-auto">
              <div className="relative h-[420px] rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/images/foto8.jpeg"
                  alt="Guía Metodológica"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Book size={18} className="text-white" />
                    <span className="text-white text-xs font-bold uppercase tracking-widest">Material Exclusivo</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif text-white leading-tight">
                    Guía Metodológica
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
