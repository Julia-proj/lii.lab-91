import Image from "next/image"
import { Instagram } from "lucide-react"

export function FormacionPrivadaBanner() {
  return (
    <section className="w-full py-20 md:py-28 bg-[#FAF9F6]">
      <div className="mx-auto px-4 sm:px-6 max-w-[1400px]">
        <div className="relative overflow-hidden group cursor-pointer lg:rounded-none rounded-xl">

          {/* Image container — responsive height to prevent text overflow on mobile */}
          <div className="relative w-full h-[380px] sm:h-[450px] md:h-[500px] lg:h-auto lg:aspect-[16/6] bg-stone-900">
            <Image
              src="/images/form.jpg"
              alt="Formación privada de manicura profesional"
              fill
              className="object-cover object-center grayscale-[80%] transition-all duration-1000 ease-out group-hover:grayscale-0 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 1400px"
              priority
            />
            {/* Gradient overlay — darker at bottom for seamless merge */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70" />

            {/* Tag top-left */}
            <div className="absolute top-6 left-6 sm:top-10 sm:left-10">
              <span className="inline-block text-[11px] sm:text-xs tracking-[0.4em] uppercase text-white/60 font-medium border border-white/20 px-4 py-1.5 backdrop-blur-sm">
                Formación privada
              </span>
            </div>

            {/* Headline anchored to bottom of image — overlaps into dark zone */}
            <div className="absolute bottom-0 left-0 right-0 px-8 sm:px-14 pb-10 sm:pb-14">
              <h2 className="text-3xl sm:text-4xl md:text-[3.25rem] font-serif text-white leading-[1.08] tracking-tight max-w-3xl">
                ¿Tienes un salón y quieres{" "}
                <span className="italic font-light text-white/70">formar a tu equipo?</span>
              </h2>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="bg-stone-900 px-8 sm:px-14 py-6 sm:py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <p className="text-[13px] sm:text-sm text-white/50 tracking-wide font-light">
              Presencial en tu local &nbsp;·&nbsp; Grupos de 2–8 personas
            </p>

            <a
              href="https://www.instagram.com/lii.lab/?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2.5 text-white/80 hover:text-white transition-colors duration-300"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide border-b border-white/20 pb-px group-hover/btn:border-white/60 transition-colors duration-300">
                Escribir por Instagram
              </span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}
