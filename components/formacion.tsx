"use client"

import { useState } from "react"
import {
  Check, Instagram, Clock, Users, BookOpen, Download, Sparkles, ChevronDown,
  Brush, Wand2, Package, Award, Zap, TrendingUp, CreditCard,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const STRIPE_GUIDE_URL = "https://buy.stripe.com/7sYbIT592fFwbE34QS7EQ00"

const manicFeatures = [
  { icon: Brush,    label: "Manicura combinada" },
  { icon: Sparkles, label: "Gel y acrílico" },
  { icon: Wand2,    label: "Nail art básico" },
  { icon: Package,  label: "Kit profesional incluido" },
  { icon: Award,    label: "Certificado" },
]

const subidaFeatures = [
  { icon: Zap,        label: "Manicura combinada avanzada" },
  { icon: Clock,      label: "Trucos para optimizar tiempos" },
  { icon: TrendingUp, label: "Rendimiento y productividad" },
  { icon: Award,      label: "Certificado" },
]

const guiaContents = [
  "Anatomía y fisiología de la uña",
  "Protocolos de higiene y esterilización",
  "Enfermedades y contraindicaciones",
  "Preparación de la uña natural",
  "Organización del puesto de trabajo",
  "Estructura de servicios y tiempos",
]

export function Formacion() {
  const [programaOpen, setProgramaOpen] = useState(false)

  return (
    <section id="formacion" className="py-20 bg-warm-bg">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-14 fade-in">
          <h2 className="text-4xl md:text-5xl font-serif mb-3">Formaciones</h2>
          <div className="w-16 h-[2px] mx-auto bg-gold" />
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {/* Card 1 — MANIC 0.0 */}
          <Card className="relative p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <Badge className="text-xs font-semibold tracking-wider border-0 px-3 py-1 bg-gold text-white">
                MÁS POPULAR
              </Badge>
            </div>

            <div className="overflow-hidden">
              <img
                src="/images/Foto2.JPG"
                alt="Curso MANIC 0.0"
                loading="lazy"
                className="w-full aspect-video object-cover"
                style={{ objectPosition: "center 30%" }}
              />
            </div>

            <div className="px-6 pt-4 pb-6 md:px-8 md:pt-5 md:pb-8 flex flex-col flex-1">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Curso de Iniciación
              </p>
              <h3 className="text-xl md:text-2xl font-serif mb-1">MANIC 0.0</h3>
              <p className="text-sm text-muted-foreground mb-5">
                De cero a manicurista profesional
              </p>

              <div className="mb-5">
                <span className="text-3xl md:text-4xl font-serif text-plum">€749,99</span>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 3 días intensivos
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Modelos reales incluidos
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                ¿Siempre has querido aprender manicura desde cero? Te enseñamos
                esterilización, técnica combinada, nivelación, decoración y gel
                con bases sólidas.
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {manicFeatures.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm">
                    <Icon className="w-4 h-4 flex-shrink-0 text-gold" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>

              {/* Course Program */}
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
                      {[
                        { day: "Día 1", title: "Teoría y Fundamentos", items: ["11:00 – 14:00: Teoría completa", "15:00 – fin: Demostración y práctica en mano propia"] },
                        { day: "Día 2", title: "Práctica Real",        items: ["10:00 – 14:00: Trabajo con modelo 1", "15:00 – fin: Trabajo con modelo 2"] },
                        { day: "Día 3", title: "Perfeccionamiento",    items: ["10:00 – fin: Trabajo con modelo final", "Entrega de diploma y asesoría Instagram"] },
                      ].map(({ day, title, items }) => (
                        <div key={day} className="p-3 rounded-lg bg-white border border-neutral-100">
                          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-0.5">{day}</p>
                          <p className="font-semibold text-neutral-900 text-sm mb-1.5">{title}</p>
                          <ul className="space-y-1 ml-2 border-l border-neutral-200 pl-3">
                            {items.map((it) => <li key={it} className="text-xs text-neutral-600">{it}</li>)}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  asChild
                  className="w-full border-0 bg-plum text-white hover:bg-plum-hover transition-colors"
                >
                  <Link href="/booking/course">
                    Reservar plaza
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 2 — Subida de Cualificación */}
          <Card className="relative p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <div className="absolute top-4 right-4 z-10">
              <Badge className="text-xs font-semibold tracking-wider border-0 px-3 py-1 bg-rose-accent text-white">
                NUEVO
              </Badge>
            </div>

            <div className="overflow-hidden">
              <video
                src="/videos/curso.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/images/Foto2.JPG"
                className="w-full aspect-video object-cover"
              />
            </div>

            <div className="p-6 md:p-8 flex flex-col flex-1">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                Subida de Cualificación
              </p>
              <h3 className="text-xl md:text-2xl font-serif mb-1">Perfecciona tu técnica</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Optimiza tu tiempo y calidad de servicio
              </p>

              <div className="mb-5">
                <span className="text-3xl md:text-4xl font-serif text-plum">€349,99</span>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-5">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> 1 día intensivo
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Práctica con 2 modelos reales
                </span>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Para manicuristas que quieren pulir sus conocimientos y llegar a hacer
                manicura combinada perfecta. 10 años de experiencia, todos los trucos
                y sobre todo rendimiento de tiempo para mayor ganancia.
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {subidaFeatures.map(({ icon: Icon, label }) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm">
                    <Icon className="w-4 h-4 flex-shrink-0 text-rose-accent" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full border-plum text-plum hover:bg-plum hover:text-white transition-colors"
                >
                  <Link href="/booking/course?type=subida">
                    Reservar plaza
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          {/* Card 3 — Guía Metodológica */}
          <Card className="relative p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">

            <div className="overflow-hidden">
              <video
                src="/videos/guia.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/images/Foto3.jpg"
                className="w-full aspect-video object-cover"
              />
            </div>

            <div className="p-6 md:p-8 flex flex-col flex-1">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                  Recurso Digital
                </p>
              </div>
              <h3 className="text-xl md:text-2xl font-serif mb-1">Guía Metodológica</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Todo el método en formato digital
              </p>

              <div className="mb-5">
                <span className="text-3xl md:text-4xl font-serif text-plum">€27,99</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
                <Download className="w-3.5 h-3.5" /> Descarga digital · Pago único
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Perfecta si ya impartes cursos o quieres empezar — todo el método resumido
                para ahorrar tiempo en la explicación teórica. Anatomía de la uña,
                protocolos de higiene, técnicas de preparación y organización del trabajo.
              </p>
              <p className="text-xs font-medium text-plum/70 bg-plum/5 border border-plum/15 rounded-lg px-3 py-2 mb-6">
                Si ya das cursos, esta guía te ahorra horas de preparación de material teórico.
              </p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {guiaContents.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3">
                <Button
                  variant="link"
                  asChild
                  className="w-full justify-center p-0 h-auto text-sm underline underline-offset-4 text-plum hover:text-plum-hover"
                >
                  <a
                    href={STRIPE_GUIDE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Comprar guía →
                  </a>
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/50">
                  <CreditCard className="w-3 h-3" />
                  <span>Pago seguro · Apple Pay · Tarjeta</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom Banner — Formar tu equipo — photo bg */}
        <div className="mt-10 rounded-2xl fade-in relative overflow-hidden min-h-[220px] sm:min-h-[260px]">
          {/* Background photo */}
          <img
            src="/images/salon-bg.jpg"
            alt="Salón de manicura profesional"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Overlay — texto legible */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          {/* Content */}
          <div className="relative px-8 sm:px-16 py-10 sm:py-14 text-center">
            <p className="text-[9px] tracking-[0.45em] uppercase text-white/50 mb-4 font-medium">
              Formación privada
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif text-white leading-tight mb-2">
              ¿Tienes un salón y quieres<br />formar a tu equipo?
            </h3>
            <p className="text-[11px] text-white/50 tracking-wide mb-8">
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
    </section>
  )
}
