import type React from "react"
import { Euro, Clock, Package, UserCheck, ArrowUpRight } from "lucide-react"
import Link from "next/link"

function InfoRow({ icon: Icon, label, text }: { icon: React.ElementType; label: string; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-lavender/10 text-plum">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</p>
        <p className="font-medium text-neutral-900">{text}</p>
      </div>
    </div>
  )
}

const subidaItems = [
  "Técnica de manicura combinada",
  "Trucos para optimizar tiempos",
  "Rendimiento y productividad",
  "Práctica con 2 modelos reales",
  "Teoría avanzada",
  "Certificado",
]

export function CourseSubidaSection() {
  return (
    <div className="mt-16 md:mt-24 fade-in-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5">
          <div className="bg-warm-bg text-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4B4C7] rounded-full blur-3xl opacity-20 -mr-16 -mt-16" />
            <div className="relative z-10 space-y-5 mb-8">
              <InfoRow icon={Euro}      label="Precio"   text="349,99€" />
              <InfoRow icon={Clock}     label="Duración"  text="1 día intensivo" />
              <InfoRow icon={Package}   label="Formato"   text="Teoría + práctica con 2 modelos reales" />
              <InfoRow icon={UserCheck} label="Nivel"     text="Intermedio / Avanzado" />
            </div>
            <Link
              href="/booking/course?type=subida"
              className="group w-full bg-plum text-white text-center py-4 rounded-lg font-semibold hover:bg-plum-hover transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 relative z-10"
            >
              <span>Reservar plaza</span>
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="mb-4">
            <span className="inline-block bg-[#F4B4C7] text-neutral-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Nuevo</span>
          </div>
          <h3 className="text-3xl font-serif text-neutral-900 mb-1">Curso de Subida de Cualificación</h3>
          <p className="text-lg text-plum font-light mb-5">Perfecciona tu técnica y optimiza tu tiempo</p>
          <p className="text-neutral-600 leading-relaxed mb-8">
            Para manicuristas que quieren pulir sus conocimientos y llegar a hacer manicura combinada perfecta.
            10 años de experiencia, todos los trucos y sobre todo rendimiento de tiempo para mayor ganancia.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {subidaItems.map((item) => (
              <div key={item} className="flex items-center gap-2 p-3 rounded-lg bg-neutral-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-lavender/30">
                <div className="w-1.5 h-1.5 rounded-full bg-lavender shrink-0" />
                <span className="font-medium text-neutral-800 text-xs sm:text-sm leading-tight">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
