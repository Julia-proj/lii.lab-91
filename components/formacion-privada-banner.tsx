import { Instagram } from "lucide-react"

export function FormacionPrivadaBanner() {
  return (
    <div className="px-4 sm:px-6 max-w-6xl mx-auto py-8 md:py-12">
      <div className="fade-up rounded-2xl relative overflow-hidden min-h-[260px] sm:min-h-[320px]">
        <img
          src="/images/salon-bg.jpg"
          alt="Salón de manicura profesional"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover object-center grayscale"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative px-8 sm:px-16 py-10 sm:py-14 text-center">
          <p className="text-[9px] tracking-[0.45em] uppercase text-white/70 mb-4 font-medium">
            Formación privada
          </p>
          <h3 className="text-2xl sm:text-3xl font-serif text-white leading-tight mb-2">
            ¿Tienes un salón y quieres<br />formar a tu equipo?
          </h3>
          <p className="text-[11px] text-white/70 tracking-wide mb-8">
            Presencial en tu local &nbsp;·&nbsp; Grupos de 2–8 personas
          </p>
          <a
            href="https://www.instagram.com/lii.lab/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white/80 border-b border-white/30 pb-px hover:text-white hover:border-white transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            Escribir por Instagram
          </a>
        </div>
      </div>
    </div>
  )
}
