import { BookOpen, Target, Zap, ClipboardList } from "lucide-react"

export function About() {
  return (
    <section id="quien-soy" className="py-20 md:py-32 bg-[#f5f5f5]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          {/* Image Column - With text overlay for style */}
          <div className="w-full md:w-1/2 relative group fade-in-section">
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg shadow-xl">
              <img
                src="/images/Foto7.JPG"
                alt="Lili"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                Soy Lili, manicurista con más de{" "}
                <span className="font-semibold text-neutral-900">diez años de experiencia</span> dedicada a formar y
                acompañar a profesionales que buscan perfeccionar su técnica y optimizar su tiempo de trabajo.
              </p>
              <p>
                A lo largo de mi trayectoria he desarrollado dos cursos: el{" "}
                <span className="font-medium text-neutral-900">curso de Iniciación en Manicura</span> y el{" "}
                <span className="font-medium text-neutral-900">curso de Subida de Cualificación</span>, ambos creados a
                partir de métodos prácticos y fáciles de aprender.
              </p>
            </div>

            <div className="pt-8 space-y-8">
              <div className="flex gap-6 items-start">
                <div className="shrink-0 mt-1">
                  <BookOpen size={24} className="text-[#8e7f97]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-neutral-900 text-lg mb-1">Formación continua</h3>
                  <p className="text-neutral-600 text-base leading-relaxed font-light">
                    Método propio creado después de años de práctica real en cabina.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="shrink-0 mt-1">
                  <Target size={24} className="text-[#8e7f97]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-neutral-900 text-lg mb-1">Precisión</h3>
                  <p className="text-neutral-600 text-base leading-relaxed font-light">
                    Técnica exacta y detallada que evita retrabajos y garantiza resultados limpios.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="shrink-0 mt-1">
                  <Zap size={24} className="text-[#8e7f97]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-neutral-900 text-lg mb-1">Rapidez</h3>
                  <p className="text-neutral-600 text-base leading-relaxed font-light">
                    Optimización de tiempos sin perder calidad.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 items-start">
                <div className="shrink-0 mt-1">
                  <ClipboardList size={24} className="text-[#8e7f97]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-neutral-900 text-lg mb-1">Metodología</h3>
                  <p className="text-neutral-600 text-base leading-relaxed font-light">
                    Sistema claro y estructurado que facilita aprender, replicar y trabajar sin improvisaciones.
                  </p>
                </div>
              </div>
            </div>
            {/* End new advantages block */}

            <div className="pt-4 mt-8">
              <p className="text-neutral-900 text-base leading-relaxed font-light">
                Mi objetivo es ayudar a otras manicuristas a crecer, profesionalizarse y ofrecer servicios de alto
                nivel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
