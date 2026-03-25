import { BookOpen, Target, Zap, ClipboardList } from "lucide-react"

const advantages = [
  {
    icon: BookOpen,
    title: "Formación continua",
    desc: "Método propio basado en práctica real.",
  },
  {
    icon: Target,
    title: "Precisión",
    desc: "Técnica precisa y detallada para lograr resultados limpios.",
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
    <section id="quien-soy" className="py-20 md:py-28 bg-quiensoy-bg">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-[5fr_7fr] gap-6 md:gap-14 lg:gap-20 md:items-start">

          {/* Image Column — sticky on desktop */}
          <div className="md:sticky md:top-[100px]">
            <div className="relative group w-full overflow-hidden rounded-lg md:rounded-xl shadow-xl aspect-[4/3] md:aspect-[4/5]">
              <img
                src="/images/Foto7.JPG"
                alt="Lili"
                loading="lazy"
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
          <div className="space-y-5 md:space-y-7">
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

            {/* Feature cards — 2×2 grid on desktop, single col on mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {advantages.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-3 items-start p-4 rounded-xl bg-white hover:shadow-md transition-smooth"
                >
                  <div className="shrink-0 mt-0.5">
                    <Icon size={24} className="text-plum" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-neutral-800 text-sm mb-0.5">{title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed font-light">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <blockquote className="border-l-2 border-plum/40 pl-4 pt-1">
              <p className="text-neutral-500 text-sm md:text-base leading-relaxed font-light italic">
                Mi objetivo es ayudar a otras manicuristas a crecer, profesionalizarse y ofrecer servicios de alto nivel.
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
