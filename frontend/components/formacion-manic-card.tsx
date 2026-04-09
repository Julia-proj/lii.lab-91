"use client"

import { useState } from "react"
import { Clock, Users, Brush, Sparkles, Wand2, Package, Award, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

const manicFeatures = [
  { icon: Brush,    label: "Manicura combinada" },
  { icon: Sparkles, label: "Gel y acrílico" },
  { icon: Wand2,    label: "Nail art básico" },
  { icon: Package,  label: "Kit profesional incluido" },
  { icon: Award,    label: "Certificado" },
]

const programaDays = [
  { day: "Día 1", title: "Teoría y Fundamentos", items: ["11:00 – 14:00: Teoría completa", "15:00 – fin: Demostración y práctica en mano propia"] },
  { day: "Día 2", title: "Práctica Real",        items: ["10:00 – 14:00: Trabajo con modelo 1", "15:00 – fin: Trabajo con modelo 2"] },
  { day: "Día 3", title: "Perfeccionamiento",    items: ["10:00 – fin: Trabajo con modelo final", "Entrega de diploma y asesoría Instagram"] },
]

export function FormacionManicCard() {
  const [programaOpen, setProgramaOpen] = useState(false)

  return (
    <Card className="fade-up group relative p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <Badge className="text-xs font-semibold tracking-wider border-0 px-3 py-1 bg-gold text-white">
          MÁS POPULAR
        </Badge>
      </div>

      <div className="overflow-hidden relative aspect-[3/2]">
        <Image
          src="/images/Foto2.JPG"
          alt="Curso MANIC 0.0"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
          style={{ objectPosition: "center 30%" }}
        />
      </div>

      <div className="px-6 pt-4 pb-6 md:px-8 md:pt-5 md:pb-8 flex flex-col flex-1">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Curso de Iniciación</p>
        <h3 className="text-xl md:text-2xl font-serif mb-1">MANIC 0.0</h3>
        <p className="text-sm text-muted-foreground mb-5">De cero a manicurista profesional</p>

        <div className="mb-5">
          <span className="text-3xl md:text-4xl font-serif text-plum">€749,99</span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-5">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 3 días intensivos</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Modelos reales incluidos</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          ¿Siempre has querido aprender manicura desde cero? Te enseñamos esterilización, técnica combinada,
          nivelación, decoración y gel con bases sólidas.
        </p>

        <ul className="space-y-2.5 mb-8 flex-1">
          {manicFeatures.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-sm">
              <Icon className="w-4 h-4 flex-shrink-0 text-gold" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-4">
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setProgramaOpen(!programaOpen)}
              className="flex items-center justify-between w-full text-sm font-medium py-3 px-4 bg-neutral-50 hover:bg-neutral-100 transition-colors text-neutral-600"
            >
              <span>Ver programa del curso</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${programaOpen ? "rotate-180" : ""}`} />
            </button>
            {programaOpen && (
              <div className="px-4 pb-4 pt-3 space-y-2 border-t border-neutral-100">
                {programaDays.map(({ day, title, items }) => (
                  <div key={day} className="p-3 rounded-lg bg-white border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-0.5">{day}</p>
                    <p className="font-semibold text-neutral-900 text-sm mb-1.5">{title}</p>
                    <ul className="space-y-1 ml-2 border-l border-neutral-200 pl-3">
                      {items.map((it) => <li key={it} className="text-xs text-neutral-600">{it}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button size="lg" asChild className="w-full border-0 bg-plum text-white hover:bg-plum-hover transition-colors">
            <Link href="/booking/course">Reservar plaza</Link>
          </Button>
          <div className="hidden md:block h-4" />
        </div>
      </div>
    </Card>
  )
}
