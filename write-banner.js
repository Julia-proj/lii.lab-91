const fs = require('fs');
const content = `import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function FormacionPrivadaBanner() {
  return (
    <section className="relative w-full py-24 md:py-32 bg-stone-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Content Column */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 lg:pr-12">
            <div className="space-y-4">
              <span className="text-sm font-medium tracking-widest text-stone-500 uppercase">
                Masterclass
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-stone-900 leading-[1.1] tracking-tight">
                Formación <br/>
                <span className="italic text-stone-600">Privada</span>
              </h2>
            </div>

            <div className="w-12 h-[1px] bg-stone-300"></div>

            <p className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-2xl font-light">
              Eleva tu técnica con una instrucción personalizada. Diseñada para profesionales que buscan la excelencia en manicura rusa y diseño avanzado.
            </p>

            <div className="pt-4">
              <Link 
                href="/guide"
                className="group inline-flex items-center gap-4 text-stone-900 font-medium hover:text-stone-600 transition-colors"
                aria-label="Más información sobre la formación privada"
              >
                <span className="relative overflow-hidden pb-1">
                  Descubrir el programa
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-900 transform origin-left transition-transform duration-300 ease-out group-hover:scale-x-0"></span>
                </span>
                <ArrowRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Image Column - Editorial Treatment */}
          <div className="lg:col-span-5 relative lg:h-[600px] flex items-center justify-center lg:justify-end mt-8 lg:mt-0 perspective-[2000px]">
            {/* Minimalist physical photo frame effect */}
            <div className="relative w-[85%] md:w-[70%] lg:w-full max-w-[420px] aspect-[4/5] bg-white p-3 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700 ease-out origin-bottom-right">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src="/images/services/formacion.jpg"
                  alt="Sesión de formación privada en el estudio"
                  fill
                  className="object-cover object-center grayscale-[20%] contrast-125 sepia-[10%] mix-blend-multiply"
                  sizes="(max-width: 768px) 85vw, (max-width: 1200px) 40vw, 420px"
                  priority
                />
              </div>
            </div>
            
            {/* Background geometric accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-stone-200/50 rounded-full blur-3xl -z-10 opacity-50"></div>
          </div>

        </div>
      </div>
    </section>
  )
}
`;
fs.writeFileSync('frontend/components/formacion-privada-banner.tsx', content);
console.log('File written successfully.');
