import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Foto11.PNG"
          alt="Lili Manicurista"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-2xl text-white fade-in-section">
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs tracking-widest uppercase mb-6 backdrop-blur-sm">
            Manic 0.0
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-6">
            Formación profesional <br /> en manicura
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg leading-relaxed font-light">
            Formación y guía metodológica para manicuristas que quieren trabajar con precisión, rapidez y método.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#cursos"
              className="group px-8 py-4 bg-[#CDB4DB] text-neutral-900 font-medium rounded-full hover:bg-[#bda0cb] transition-all duration-300 text-center flex items-center justify-center gap-2"
            >
              <span>Ver cursos</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#guia"
              className="px-8 py-4 bg-transparent border border-white text-white font-medium rounded-full hover:bg-white hover:text-neutral-900 transition-all duration-300 text-center"
            >
              Guía Metodológica
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
