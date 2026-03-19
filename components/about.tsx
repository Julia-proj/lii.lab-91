import { BookOpen, Target, Zap, ClipboardList } from "lucide-react"

const advantages = [
  {
    icon: BookOpen,
    title: "Formación continua",
    desc: "Método propio creado después de años de práctica real en cabina.",
  },
  {
    icon: Target,
    title: "Precisión",
    desc: "Técnica exacta y detallada que evita retrabajos y garantiza resultados limpios.",
  },
  {
    icon: Zap,
    title: "Rapidez",
    desc: "Optimización de tiempos sin perder calidad.",
  },
  {
    icon: ClipboardList,
    title: "Metodología",
    desc: "Sistema claro y estructurado que facilita aprender, replicar y trabajar sin improvisaciones.",
  },
]

export function About() {
  return (
    <section id="quien-soy" className="py-12 md:py-20 bg-quiensoy-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center">

          {/* Image Column */}
          <div className="relative group">
            <div className="relative w-full aspect-[3/2] md:aspect-[4/5] overflow-hidden rounded-xl shadow-xl">
              <img
                src="/images/Foto7.JPG"
                alt="Lili"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
                style={{ objectPosition: "center 15%" }}
              />
              <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <div className="border-l-2 border-lavender pl-3 md:pl-4">
                  <h3 className="text-2xl md:text-4xl font-serif text-white mb-0.5">Soy Lili</h3>
                  <p className="text-lavender text-xs md:text-sm tracking-[0.2em] uppercase font-medium">
                    Manicurista & Formadora
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="space-y-5 md:space-y-8">
            <h2 className="text-3xl md:text-5xl font-serif text-neutral-950 tracking-tight">Quién soy</h2>

            <div className="text-neutral-600 leading-relaxed font-light text-sm md:text-base space-y-3">
              <p>
                Soy Lili, manicurista con más de{" "}
                <span className="font-semibold text-neutral-900">10 años de experiencia</span> dedicada a formar y
                acompañar a profesionales que buscan perfeccionar su técnica y optimizar su tiempo de trabajo.
              </p>
              <p>
                A lo largo de mi trayectoria he desarrollado dos cursos: el{" "}
                <span className="font-medium text-neutral-900">curso de iniciación en manicura</span> y el{" "}
                <span className="font-medium text-neutral-900">curso de subida de cualificación</span>, ambos creados a
                partir de métodos prácticos y fáciles de aprender.
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              {advantages.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-3 items-start p-3 md:p-4 rounded-xl bg-white hover:shadow-md transition-smooth"
                >
                  <div className="shrink-0 mt-0.5 p-2 rounded-lg bg-gold-light">
                    <Icon size={15} className="text-plum" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-neutral-800 text-sm mb-0.5">{title}</h3>
                    <p className="text-neutral-500 text-xs leading-relaxed font-light">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-neutral-900 text-sm md:text-base leading-relaxed font-light pt-1">
              Mi objetivo es ayudar a otras manicuristas a crecer, profesionalizarse y ofrecer servicios de alto
              nivel.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
