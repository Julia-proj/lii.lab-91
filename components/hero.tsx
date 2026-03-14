import { ArrowRight, BookOpen } from "lucide-react"

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] lg:max-h-[900px] flex flex-col justify-end"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Hero.JPG"
          alt="Lii.lab beauty studio"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/65 md:via-black/30 md:to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pb-20 sm:pb-28">
        <div className="max-w-xl text-white fade-in-section">
          <span className="inline-block py-1.5 px-4 border border-white/25 rounded-full text-xs tracking-widest uppercase mb-4 backdrop-blur-sm text-white/60 font-light">
            MANIC 0.0
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif leading-[1.1] mb-4 md:mb-6 text-white">
            Formación profesional<br /> en manicura
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200/90 mb-8 max-w-sm md:max-w-lg leading-relaxed font-light">
            Formación y guía metodológica para manicuristas que quieren trabajar con precisión, rapidez y método.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a
              href="#cursos"
              className="group px-8 py-4 bg-[#B48EC5] text-white font-semibold rounded-full hover:bg-[#a37ab5] transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <BookOpen size={18} />
              <span>Ver cursos</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#guia"
              className="px-8 py-4 bg-transparent border border-white/60 text-white font-medium rounded-full hover:bg-white hover:text-neutral-900 transition-all duration-300 text-center backdrop-blur-sm"
            >
              Guía Metodológica
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
