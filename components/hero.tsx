import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="hero" className="relative h-svh sm:min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/Hero.JPG"
          alt="Lii.lab beauty studio"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center 20%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/65 md:via-black/30 md:to-transparent" />
      </div>

      {/* Badge — top left, below navbar */}
      <div className="absolute top-[72px] sm:top-[80px] left-0 right-0 z-10 container mx-auto px-6">
        <span className="inline-block py-1.5 px-4 border border-white/25 rounded-full text-xs tracking-widest uppercase backdrop-blur-sm text-white/60 font-light">
          MANIC 0.0
        </span>
      </div>

      {/* Content — pinned to bottom so face stays visible */}
      <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-xl text-white">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-[1.1] mb-3 sm:mb-5 md:mb-6 text-white">
            Formación profesional<br /> en manicura
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200/90 mb-6 sm:mb-8 max-w-sm md:max-w-lg leading-relaxed font-light">
            Formación y guía metodológica para manicuristas que quieren trabajar con precisión, rapidez y método.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              size="lg"
              asChild
              className="bg-[#CDB4DB] text-white hover:bg-[#bda0cb] transition-colors"
            >
              <a href="#formacion">Ver cursos</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 border-white/60 text-white bg-transparent hover:bg-white/10 hover:text-white hover:border-white/80 transition-colors backdrop-blur-sm"
            >
              <a href="#formacion">
                <Download className="w-4 h-4" />
                Guía Metodológica
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
