import type React from "react"
import { Euro, Clock, Package, UserCheck, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { CourseDatesPreview } from "./course-dates-preview"

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

export function CourseInfoCard() {
  return (
    <div className="bg-warm-bg text-neutral-900 p-8 rounded-2xl shadow-sm border border-neutral-200/60 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-lavender rounded-full blur-3xl opacity-10 -mr-16 -mt-16" />
      <h3 className="text-2xl font-serif mb-4 relative z-10">Información del curso</h3>

      <div className="relative z-10 mb-7 rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5">
        <video autoPlay loop muted playsInline preload="metadata" className="w-full aspect-video object-cover">
          <source src="/videos/curso.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="space-y-6 relative z-10">
        <InfoRow icon={Euro}      label="Precio"   text="749,99€" />
        <InfoRow icon={Clock}     label="Duración"  text="3 días intensivos" />
        <InfoRow icon={Package}   label="Práctica"  text="Modelos reales" />
        <InfoRow icon={UserCheck} label="Incluye"   text="Kit + Guía Metodológica" />
      </div>

      <CourseDatesPreview />

      <div className="mt-5 relative z-10">
        <Link
          href="/booking/course"
          className="group w-full bg-plum text-white text-center py-4 rounded-lg font-semibold hover:bg-plum-hover transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <span>Reservar plaza</span>
          <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
