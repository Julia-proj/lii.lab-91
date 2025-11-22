import { Book } from "lucide-react"

export function About() {
  return (
    <section id="quien-soy" className="py-20 md:py-32 bg-[#f5f5f5]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Image */}
          <div className="relative fade-in-section">
            <div className="aspect-[3/4] rounded-sm overflow-hidden shadow-xl">
              <img src="/professional-woman-manicurist-portrait.jpg" alt="Lili formadora" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="space-y-8 fade-in-section">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Quién soy</h2>

            <div className="space-y-6 text-gray-600 leading-relaxed">
              <p>
                Soy Lili, manicurista con más de diez años de experiencia dedicada a formar y acompañar a profesionales
                que buscan perfeccionar su técnica y optimizar su tiempo de trabajo.
              </p>
              <p>
                A lo largo de mi trayectoria he desarrollado dos cursos: el Curso de Iniciación en Manicura y el Curso
                de Subida de Cualificación, ambos creados a partir de métodos prácticos y fáciles de aprender que
                permiten mejorar habilidades de forma rápida y efectiva.
              </p>
              <p>
                Mi enfoque profesional se centra en la precisión, la rapidez y la metodología. Creo firmemente que una
                buena formación no solo mejora la calidad del servicio, sino que también reduce significativamente los
                tiempos de trabajo. Por ello, mis cursos están diseñados para que cada estudiante adquiera técnicas
                claras, eficientes y aplicables desde el primer día.
              </p>
            </div>

            {/* Featured Card */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 flex gap-4 items-start">
              <div className="shrink-0 p-3 bg-[#F4B4C7]/10 rounded-full text-[#F4B4C7]">
                <Book size={24} />
              </div>
              <div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Soy autora de la <span className="font-serif font-bold italic">“Guía Metodológica”</span>, un libro
                  completo que reúne toda la información esencial para una manicurista: manicura profesional,
                  esterilización, enfermedades de las uñas, normas de seguridad y todos los fundamentos necesarios para
                  ejercer con excelencia y confianza.
                </p>
              </div>
            </div>

            <p className="text-gray-800 font-medium pt-4 border-t border-gray-200">
              Mi objetivo es ayudar a otras manicuristas a crecer, profesionalizarse y ofrecer servicios de alto nivel
              mediante un aprendizaje accesible, estructurado y probado.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
