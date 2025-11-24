import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section id="hero" className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/images/hero.jpeg" alt="Lili Manicurista" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20">
        <div className="max-w-2xl text-white fade-in-section">
          <span className="inline-block py-2 px-4 border border-white/30 rounded-full text-xs tracking-widest uppercase mb-8 backdrop-blur-sm font-light">
            Lii.lab · Formación para manicuristas
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8 text-white">
            Formación profesional en manicura
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-lg leading-relaxed font-light">
            Cursos diseñados para manicuristas que buscan dominar técnicas precisas, optimizar tiempos y trabajar con
            metodología.
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
