import Link from "next/link"

export function Hero() {
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/Hero1.PNG" alt="Lili Portrait" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      </div>
      <div className="container relative z-10 px-4 md:px-6">
        <div className="max-w-2xl text-white fade-in-section">
          <span className="inline-block py-1 px-3 border border-white/30 rounded-full text-xs font-medium tracking-wider mb-6 uppercase">
            
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
            Formación profesional <br /> en manicura
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg font-light leading-relaxed">
            Formación y guía metodológica para manicuristas que quieren trabajar con precisión, rapidez y método.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#cursos"
              className="inline-flex items-center justify-center h-12 px-8 bg-white text-gray-900 font-medium transition-colors hover:bg-[#F4B4C7] hover:text-white rounded-sm"
            >
              Ver cursos
            </Link>
            <Link
              href="#guia"
              className="inline-flex items-center justify-center h-12 px-8 border border-white text-white font-medium transition-colors hover:bg-white hover:text-gray-900 rounded-sm"
            >
              Guía Metodológica
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
