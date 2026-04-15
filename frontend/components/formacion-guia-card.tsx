"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { Check, BookOpen, Download, CreditCard, Play, Pause } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { STRIPE_GUIDE_URL } from "../lib/constants"

const guiaContents = [
  "Anatomía y fisiología de la uña",
  "Protocolos de higiene y esterilización",
  "Enfermedades y contraindicaciones",
  "Preparación de la uña natural",
  "Organización del puesto de trabajo",
  "Estructura de servicios y tiempos",
]

export function FormacionGuiaCard() {
  const guiaRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [guiaPlaying, setGuiaPlaying] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const userPausedRef = useRef(false)

  const playVideo = useCallback(() => {
    guiaRef.current?.play().then(() => setGuiaPlaying(true)).catch(() => {})
  }, [])

  const pauseVideo = useCallback(() => {
    guiaRef.current?.pause()
    setGuiaPlaying(false)
  }, [])

  /* autoplay on mobile */
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) {
      playVideo()
    }
  }, [playVideo])

  /* IntersectionObserver — pause off-screen, resume on-screen */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (!entry.isIntersecting) {
          guiaRef.current?.pause()
          setGuiaPlaying(false)
        } else if (!userPausedRef.current && guiaRef.current && !guiaRef.current.paused) {
          /* already playing — noop */
        } else if (!userPausedRef.current && guiaRef.current?.currentTime && guiaRef.current.currentTime > 0) {
          playVideo()
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [playVideo])

  return (
    <Card id="guia" className="fade-up relative p-0 overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col" data-delay="200">
      <div ref={containerRef} className="relative overflow-hidden group/video">
        <video
          ref={guiaRef}
          src="/videos/guia.mp4"
          loop
          muted
          playsInline
          preload="metadata"
          className="w-full aspect-[3/2] object-cover"
        />
        <button
          onClick={() => {
            if (guiaPlaying) {
              pauseVideo()
              userPausedRef.current = true
            } else {
              playVideo()
              userPausedRef.current = false
            }
          }}
          aria-label={guiaPlaying ? "Pausar vídeo" : "Reproducir vídeo"}
          className={`absolute inset-0 hidden md:flex items-center justify-center transition-opacity duration-300 ${
            guiaPlaying
              ? "opacity-0 group-hover/video:opacity-100"
              : "opacity-100"
          }`}
        >
          <div className={`absolute inset-0 transition-colors ${guiaPlaying ? "bg-black/10" : "bg-black/20 hover:bg-black/30"}`} />
          <div className="relative w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-200">
            {guiaPlaying ? (
              <Pause className="w-5 h-5 text-neutral-900" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 text-neutral-900 ml-0.5" fill="currentColor" />
            )}
          </div>
        </button>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Recurso Digital</p>
        </div>
        <h3 className="text-xl md:text-2xl font-serif mb-1">Guía Metodológica</h3>
        <p className="text-sm text-muted-foreground mb-5">Todo el método en formato digital</p>

        <div className="mb-5">
          <span className="text-3xl md:text-4xl font-serif text-plum">€27,99</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5">
          <Download className="w-3.5 h-3.5" /> Descarga digital · Pago único
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          Perfecta si ya impartes cursos o quieres empezar — todo el método resumido para ahorrar tiempo en la
          explicación teórica. Anatomía de la uña, protocolos de higiene, técnicas de preparación y organización.
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
          <Button size="lg" asChild className="w-full bg-neutral-900 hover:bg-black text-white border-0 tracking-wide transition-colors">
            <a href={STRIPE_GUIDE_URL} target="_blank" rel="noopener noreferrer">
              Comprar guía →
            </a>
          </Button>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground/50">
            <CreditCard className="w-3 h-3" />
            <span>Pago seguro · Apple Pay · Tarjeta</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
