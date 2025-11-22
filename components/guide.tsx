import Link from "next/link"
import { Check } from "lucide-react"

export function Guide() {
  return (
    <section id="guia" className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 fade-in-section">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">Guía Metodológica</h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                La Guía Metodológica es un libro completo que reúne la información esencial para una manicurista:
                anatomía de la uña, normas de higiene y esterilización, enfermedades, técnicas de preparación y
                organización del trabajo.
              </p>
              <p>
                Está escrita de forma clara y práctica, para mejorar la técnica y optimizar los tiempos de servicio.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-sm">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Contenido principal</h3>
              <ul className="grid gap-3">
                {[
                  "Anatomía y fisiología de la uña",
                  "Protocolos de higiene y esterilización",
                  "Enfermedades y contraindicaciones",
                  "Preparación de la uña natural",
                  "Organización del puesto de trabajo",
                  "Estructura de servicios y tiempos recomendados",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <Check size={18} className="text-[#F4B4C7] mt-1 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-8">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Para formadoras y profesionales</h3>
              <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                La Guía Metodológica puede utilizarse como una guía complementaria en cursos y academias, facilitando el
                trabajo de la profesora y evitando tener que crear materiales desde cero. Ayuda a mantener una
                metodología estructurada y profesional en cada clase.
              </p>

              <Link
                href="#contacto"
                className="inline-flex items-center justify-center h-12 px-8 bg-gray-900 text-white font-medium transition-colors hover:bg-[#F4B4C7] hover:text-white rounded-sm"
              >
                Obtener la Guía Metodológica
              </Link>
            </div>
          </div>

          <div className="fade-in-section">
            <div className="aspect-[4/5] bg-gray-100 rounded-sm overflow-hidden relative shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
              <img
                src="/book-mockup-minimalist-clean.jpg"
                alt="Guía Metodológica Libro"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
