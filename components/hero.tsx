import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/images/Hero.JPG" alt="Lii.lab beauty studio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/20 md:bg-gradient-to-r md:from-black/70 md:via-black/40 md:to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24 pb-16">
        <div className="max-w-2xl text-white fade-in-section">
          <span className="inline-block py-2 px-4 border border-white/30 rounded-full text-xs tracking-widest uppercase mb-8 backdrop-blur-sm font-light">
            MANIC 0.0
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-tight mb-8 text-white">
            Formación profesional<br className="hidden sm:inline" /> en manicura
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-12 max-w-lg leading-relaxed font-light">
            Formación y guía metodológica para manicuristas que quieren trabajar con precisión, rapidez y método.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#cursos"
              className="group px-8 py-4 bg-[#B48EC5] text-white font-semibold rounded-full hover:bg-[#a37ab5] transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <BookOpen size={18} />
              <span>Ver cursos</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#guia"
              className="px-8 py-4 bg-transparent border border-white/80 text-white font-medium rounded-full hover:bg-white hover:text-neutral-900 transition-all duration-300 text-center backdrop-blur-sm"
            >
              Guía Metodológica
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
