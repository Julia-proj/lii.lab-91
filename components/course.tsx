import type React from "react"
import {
  Shield,
  Zap,
  Sparkles,
  Hand,
  Brush,
  ClipboardList,
  Euro,
  Clock,
  Package,
  UserCheck,
  ArrowUpRight,
  BookOpen,
  Microscope,
} from "lucide-react"
import Link from "next/link"

export function Course() {
  const features = [
    { icon: Shield, title: "Esterilización y desinfección" },
    { icon: Zap, title: "Uso del torno" },
    { icon: Brush, title: "Pinceles y herramientas" },
    { icon: Sparkles, title: "Acabados perfectos" },
    { icon: BookOpen, title: "Teoría completa" },
    { icon: Hand, title: "Práctica en modelos" },
    { icon: Microscope, title: "Anatomía detallada" },
    { icon: ClipboardList, title: "Organización y método" },
  ]

  const gallery = [
    "/images/foto5.jpg",
    "/images/foto4.jpg",
    "/images/foto6.jpg",
    "/images/foto3.jpg",
  ]

  return (
    <section id="cursos" className="py-24 bg-white relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f5f5f5] to-white"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* 3.1 Intro */}
        <div className="flex flex-col lg:flex-row gap-16 items-center mb-24 fade-in-section">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#CDB4DB]/20 rounded-full z-0"></div>
              <img
                src="/images/foto2.jpeg"
                alt="Curso Manicura"
                className="relative z-10 rounded-lg shadow-xl w-full object-cover h-[500px] transition-all duration-500"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <span className="inline-block bg-[#CDB4DB] text-neutral-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
                Curso de Iniciación
              </span>
           <h2 className="text-[26px] sm:text-4xl font-serif leading-tight mb-6">
  Curso Manic 0.0
</h2>
              <p className="text-xl text-neutral-600 font-light leading-relaxed">
                ¿Siempre has querido aprender manicura desde cero? Este curso es tu oportunidad perfecta. Te enseñaremos
                todo lo necesario para iniciar tu camino profesional con bases sólidas.
              </p>
            </div>

            {/* Features Grid embedded in intro column for better flow on mobile */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {features.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg bg-neutral-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-[#CDB4DB]/30"
                >
                  <item.icon size={20} className="text-neutral-400 shrink-0" />
                  <span className="font-medium text-neutral-800 text-sm">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start fade-in-section">
          {/* 3.3 Info Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#F3F4F6] text-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#CDB4DB] rounded-full blur-3xl opacity-10 -mr-16 -mt-16"></div>

              <h3 className="text-2xl font-serif mb-8 relative z-10">Información del curso</h3>
              <div className="space-y-6 relative z-10">
                <InfoRow icon={Euro} label="Precio" text="800€" />
                <InfoRow icon={Clock} label="Duración" text="3 días intensivos" />
                <InfoRow icon={Package} label="Práctica" text="Modelos reales" />
                <InfoRow icon={UserCheck} label="Incluye" text="Kit + Guía Metodológica" />
              </div>

              <div className="mt-10 relative z-10">
                <Link
                  href="https://www.instagram.com/lii.lab/?hl=es"
                  target="_blank"
                  className="group block w-full bg-[#CDB4DB] text-neutral-900 text-center py-4 rounded-lg font-medium hover:bg-[#bda0cb] transition-colors flex items-center justify-center gap-2"
                >
                  <span>Reservar plaza</span>
                  <ArrowUpRight
                    size={18}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>

          {/* Program */}
          <div className="lg:col-span-7">
            <h3 className="text-3xl font-serif mb-8 text-neutral-900">Programa del curso</h3>
            <div className="space-y-6">
              <DayItem day="01" title="Teoría y Fundamentos">
                <ul className="space-y-2 text-neutral-600 ml-4 border-l border-gray-200 pl-4 py-2">
                  <li>11:00 – 14:00: Teoría completa</li>
                  <li>15:00 – fin: Demostración y práctica en mano propia</li>
                </ul>
              </DayItem>
              <DayItem day="02" title="Práctica Real">
                <ul className="space-y-2 text-neutral-600 ml-4 border-l border-gray-200 pl-4 py-2">
                  <li>10:00 – 14:00: Trabajo con modelo 1</li>
                  <li>15:00 – fin: Trabajo con modelo 2</li>
                </ul>
              </DayItem>
              <DayItem day="03" title="Perfeccionamiento">
                <ul className="space-y-2 text-neutral-600 ml-4 border-l border-gray-200 pl-4 py-2">
                  <li>10:00 – fin: Trabajo con modelo final</li>
                  <li>Entrega de diploma y asesoría Instagram</li>
                </ul>
              </DayItem>
            </div>
          </div>
        </div>

        {/* 3.4 Gallery */}
        <div className="mt-24 fade-in-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((src, idx) => (
              <div key={idx} className="aspect-[4/5] overflow-hidden rounded-lg group">
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Gallery ${idx}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function InfoRow({ icon: Icon, label, text }: { icon: any; label: string; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-[#CDB4DB]/10 text-[#8e7f97]">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</p>
        <p className="font-medium text-neutral-900">{text}</p>
      </div>
    </div>
  )
}

function DayItem({ day, title, children }: { day: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-transparent hover:border-[#CDB4DB]/50 transition-colors">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-3xl font-serif text-[#CDB4DB] font-bold">{day}</span>
        <h4 className="text-xl font-medium text-neutral-900">{title}</h4>
      </div>
      {children}
    </div>
  )
}
