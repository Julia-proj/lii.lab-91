import type React from "react"
import { Shield, Zap, Sparkles, Hand, Brush, ClipboardList, BookOpen, Microscope, Users, Instagram } from "lucide-react"
import Link from "next/link"
import { CourseInfoCard } from "./course/course-info-card"
import { CourseSubidaSection } from "./course/course-subida-section"

function DayItem({ day, title, children }: { day: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 hover:border-lavender/40 transition-colors">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-5xl font-serif text-neutral-300 font-bold leading-none">{day}</span>
        <h4 className="text-xl font-medium text-neutral-900">{title}</h4>
      </div>
      {children}
    </div>
  )
}

const features = [
  { icon: Shield,      title: "Esterilización y desinfección" },
  { icon: Zap,         title: "Uso del torno" },
  { icon: Brush,       title: "Pinceles y herramientas" },
  { icon: Sparkles,    title: "Acabados perfectos" },
  { icon: BookOpen,    title: "Teoría completa" },
  { icon: Hand,        title: "Práctica en modelos" },
  { icon: Microscope,  title: "Anatomía detallada" },
  { icon: ClipboardList, title: "Organización y método" },
]

const gallery = ["/images/Foto5.JPG", "/images/Foto4.JPG", "/images/Foto6.jpg", "/images/Foto3.jpg"]

export function Course() {
  return (
    <section id="cursos" className="py-24 bg-white relative">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f5f5f5] to-white" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Intro */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center mb-16 md:mb-24 fade-in-section">
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-lavender/20 rounded-full z-0" />
              <img
                src="/images/Foto2.JPG"
                alt="Curso Manicura"
                loading="lazy"
                className="relative z-10 rounded-lg shadow-xl w-full object-cover object-top h-[420px] sm:h-[560px] lg:h-[620px] transition-all duration-500"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <span className="inline-block bg-lavender text-neutral-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide mb-4">Curso de Iniciación</span>
              <h2 className="text-3xl font-serif text-neutral-900 leading-tight mb-6">CURSO MANIC 0.0</h2>
              <p className="text-xl text-neutral-600 font-light leading-relaxed">
                ¿Siempre has querido aprender manicura desde cero? Este curso es tu oportunidad perfecta.
                Te enseñaremos todo lo necesario para iniciar tu camino profesional con bases sólidas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4">
              {features.map((item, idx) => (
                <div key={idx} className="flex flex-row items-center gap-2 p-3 rounded-lg bg-neutral-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-lavender/30">
                  <item.icon size={18} className="text-neutral-500 shrink-0" />
                  <span className="font-medium text-neutral-800 text-xs sm:text-sm leading-tight">{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start fade-in-section">
          <div className="lg:col-span-5">
            <CourseInfoCard />
          </div>
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

        <CourseSubidaSection />

        {/* CTA equipos */}
        <div className="mt-12 md:mt-16 fade-in-section">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-neutral-50 border border-neutral-200 rounded-2xl px-7 py-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-lavender/15 shrink-0">
                <Users size={22} className="text-[#7B4FAC]" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">¿Formación para tu equipo del salón?</p>
                <p className="text-sm text-neutral-500 mt-0.5">Precios especiales para grupos</p>
              </div>
            </div>
            <Link
              href="https://www.instagram.com/lii.lab/?hl=es"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 shrink-0 px-5 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 text-sm font-medium hover:border-lavender hover:text-plum hover:bg-lavender/5 transition-all"
            >
              <Instagram size={16} />
              Escribir por Instagram
            </Link>
          </div>
        </div>

        {/* Gallery */}
        <div className="mt-12 md:mt-20 fade-in-section">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            {gallery.map((src, idx) => (
              <div key={idx} className="aspect-square sm:aspect-[4/5] overflow-hidden rounded-lg group">
                <img
                  src={src || "/placeholder.svg"}
                  alt={`Trabajo de manicura Lii.lab ${idx + 1}`}
                  loading="lazy"
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
