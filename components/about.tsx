import { BookOpen } from "lucide-react"

export function About() {
  return (
    <section id="quien-soy" className="py-20 md:py-32 bg-[#f5f5f5]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Image Column - With text overlay for style */}
          <div className="w-full md:w-1/2 relative group fade-in-section">
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-xl">
              <img
                src="/professional-woman-manicurist-portrait.jpg"
                alt="Lili"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale hover:grayscale-0"
              />
              {/* Stylish text overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="border-l-2 border-[#CDB4DB] pl-4">
                  <h3 className="text-4xl font-serif text-white mb-1">Soy Lili</h3>
                  <p className="text-[#CDB4DB] text-sm tracking-[0.2em] uppercase font-medium">
                    Manicurista & Formadora
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="w-full md:w-1/2 space-y-8 fade-in-section">
            <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-6">Quién soy</h2>

            <div className="prose prose-lg text-neutral-600 leading-relaxed font-light">
              <p>
                Soy Lili, manicurista con más de diez años de experiencia dedicada a formar y acompañar a profesionales
                que buscan perfeccionar su técnica y optimizar su tiempo de trabajo.
              </p>
              <p>
                A lo largo de mi trayectoria he desarrollado dos cursos: el{" "}
                <span className="font-medium text-neutral-900">Curso de Iniciación en Manicura</span> y el{" "}
                <span className="font-medium text-neutral-900">Curso de Subida de Cualificación</span>, ambos creados a
                partir de métodos prácticos y fáciles de aprender.
              </p>
              <p>
                Mi enfoque profesional se centra en la precisión, la rapidez y la metodología. Creo firmemente que una
                buena formación no solo mejora la calidad del servicio, sino que también reduce significativamente los
                tiempos de trabajo.
              </p>
            </div>

            {/* Featured Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex gap-5 items-start transform hover:-translate-y-1 transition-transform duration-300">
              {/* Updated accent color */}
              <div className="bg-[#CDB4DB]/20 p-3 rounded-full shrink-0 text-[#8e7f97]">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold mb-2 text-neutral-900">Autora de la “Guía Metodológica”</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Un libro completo que reúne toda la información esencial para una manicurista: manicura profesional,
                  esterilización, enfermedades de las uñas y normas de seguridad.
                </p>
              </div>
            </div>

            <div className="pt-4">
              {/* Updated border color */}
              <p className="text-neutral-900 font-medium italic border-l-4 border-[#CDB4DB] pl-4 py-1">
                "Mi objetivo es ayudar a otras manicuristas a crecer, profesionalizarse y ofrecer servicios de alto
                nivel."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
