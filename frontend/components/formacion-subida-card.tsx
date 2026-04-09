"use client"

import { useRef, useState, useEffect } from "react"
import { Clock, Users, Zap, TrendingUp, Award, Play } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const subidaFeatures = [
  { icon: Zap,        label: "Manicura combinada avanzada" },
  { icon: Clock,      label: "Trucos para optimizar tiempos" },
  { icon: TrendingUp, label: "Rendimiento y productividad" },
  { icon: Award,      label: "Certificado" },
]

export function FormacionSubidaCard() {
  const cursoRef = useRef<HTMLVideoElement>(null)
  const [cursoPlaying, setCursoPlaying] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 768) {
      cursoRef.current?.play()
    }
  }, [])

  return (
    <Card className="fade-up relative p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col" data-delay="100">
      <div className="absolute top-4 right-4 z-10">
        <Badge className="text-xs font-semibold tracking-wider border-0 px-3 py-1 bg-rose-accent text-white">
          NUEVO
        </Badge>
      </div>

      <div className="relative overflow-hidden">
        <video
          ref={cursoRef}
          src="/videos/curso.mp4"
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full aspect-[3/2] object-cover"
        />
        {!cursoPlaying && (
          <button
            onClick={() => { setCursoPlaying(true); cursoRef.current?.play() }}
            aria-label="Reproducir vídeo"
            className="absolute inset-0 hidden md:flex items-center justify-center group"
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="relative w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
              <Play className="w-5 h-5 text-neutral-900 ml-0.5" fill="currentColor" />
            </div>
          </button>
        )}
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">Subida de Cualificación</p>
        <h3 className="text-xl md:text-2xl font-serif mb-1">Perfecciona tu técnica</h3>
        <p className="text-sm text-muted-foreground mb-5">Optimiza tu tiempo y calidad de servicio</p>

        <div className="mb-5">
          <span className="text-3xl md:text-4xl font-serif text-plum">€349,99</span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-5">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 1 día intensivo</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Práctica con 2 modelos reales</span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          Para manicuristas que quieren pulir sus conocimientos y llegar a hacer manicura combinada perfecta.
          10 años de experiencia, todos los trucos y sobre todo rendimiento de tiempo para mayor ganancia.
        </p>

        <ul className="space-y-2.5 mb-8 flex-1">
          {subidaFeatures.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2.5 text-sm">
              <Icon className="w-4 h-4 flex-shrink-0 text-rose-accent" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto space-y-3">
          <Button size="lg" variant="outline" asChild className="w-full border-plum text-plum hover:bg-plum hover:text-white transition-colors">
            <Link href="/booking/course?type=subida">Reservar plaza</Link>
          </Button>
          <div className="hidden md:block h-4" />
        </div>
      </div>
    </Card>
  )
}
