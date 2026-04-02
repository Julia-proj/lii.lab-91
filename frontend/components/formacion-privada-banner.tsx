import { Instagram } from "lucide-react"

export function FormacionPrivadaBanner() {
  return (
    <section className="bg-warm-bg pb-16 md:pb-24 pt-4 md:pt-6 relative rounded-b-[2rem] sm:rounded-b-[4rem] z-10 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
      <div className="px-4 sm:px-6 max-w-[1200px] mx-auto">
        <div className="fade-up bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_4px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row border border-neutral-100/60">
          
          {/* Left: Clean pristine image without messy overlays */}
          <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto">
            <img
              src="/images/salon-bg.jpg"
              alt="Salón de manicura"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
            />
          </div>

          {/* Right: Crisp, perfect typography on pure white solid background */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center md:items-start text-center md:text-left bg-white">
            
            <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-semibold mb-4 lg:mb-5">
              Servicio Exclusivo
            </p>
            
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-neutral-900 leading-tight mb-2">
              Formación Privada
            </h3>
            
            <p className="font-serif italic text-neutral-400 text-xl sm:text-2xl lg:text-3xl mb-6">
              para salones
            </p>
            
            <p className="text-sm text-neutral-500 font-light leading-relaxed mb-6 max-w-md">
              Eleva el nivel de tu equipo con un curso intensivo y personalizado. Optimizamos los tiempos y perfeccionamos la técnica directamente en tu propio local.
            </p>
            
            <div className="flex items-center gap-3 text-[10px] sm:text-[11px] text-neutral-800 tracking-[0.15em] uppercase mb-8 font-medium bg-neutral-50 px-4 py-2 rounded-lg">
              <span>Presencial</span>
              <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
              <span>Grupos 2–8 px</span>
            </div>

            <a
              href="https://www.instagram.com/lii.lab/?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white bg-neutral-950 px-8 py-3.5 sm:py-4 transition-all duration-300 hover:bg-neutral-800 hover:scale-[1.02] shadow-xl w-full sm:w-auto rounded-sm"
            >
              Escribir por Instagram
              <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
            </a>
          </div>
          
        </div>
      </div>
    </section>
  )
}
