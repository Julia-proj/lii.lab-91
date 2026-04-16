"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSlide } from "./hero-slide"

const ATMOSPHERIC = [
  { src: "/images/Foto5.JPG", bgClass: "bg-neutral-700", pos: "center 70%", mobilePos: "center 30%", mobileScale: 1,    scale: 1 },
  { src: "/images/Foto4.JPG", bgClass: "bg-neutral-800", pos: "55% 35%",    mobilePos: "center 30%", mobileScale: 1.12, scale: 1 },
  { src: "/images/Foto6.jpg", bgClass: "bg-stone-600",   pos: "center 40%", mobilePos: "center 40%", mobileScale: 1,    scale: 1 },
  { src: "/images/Foto3.jpg", bgClass: "bg-neutral-900", pos: "center 28%", mobilePos: "center 28%", mobileScale: 1,    scale: 1 },
]

const TOTAL = ATMOSPHERIC.length + 1

export function Hero() {
  const [current, setCurrent] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % TOTAL) }, 4000)
    return () => clearInterval(timer)
  }, [])

  const isHero = current === 0
  const sectionBgClass = isHero ? "bg-neutral-950" : ATMOSPHERIC[current - 1].bgClass

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`relative overflow-hidden transition-colors duration-[2000ms] ease-in-out ${sectionBgClass}`}
      style={{ height: '100dvh' }}
    >
      {/* Slide 0: Hero.JPG */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out ${isHero ? "opacity-100" : "opacity-0"}`}>
        <Image
          src="/images/Hero.JPG"
          alt="Lii.lab beauty studio"
          fill
          priority
          sizes="100vw"
          onLoad={() => setImgLoaded(true)}
          className={`object-cover object-[center_20%] md:object-[center_28%] hero-zoom transition-all duration-1000 ease-out ${
            imgLoaded ? "blur-0" : "blur-md scale-105"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent z-[1]" />
      </div>

      {/* Atmospheric slides 1-4 */}
      {ATMOSPHERIC.map((slide, i) => (
        <HeroSlide key={slide.src} slide={slide} index={i + 1} active={current === i + 1} />
      ))}

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end md:justify-center container mx-auto px-4 sm:px-6 pb-16 sm:pb-20 md:pb-0">
        <div className="max-w-xl md:max-w-2xl text-white">
          <span className="inline-block py-1.5 px-4 mb-4 sm:mb-6 border border-white/20 rounded-full text-xs tracking-widest uppercase backdrop-blur-md text-white/80 font-light animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-both">
            MANIC 0.0
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif tracking-normal leading-[1.05] sm:leading-[1.1] mb-5 sm:mb-6 md:mb-8 text-white animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
            Formación profesional<br /> en manicura
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/75 mb-8 sm:mb-10 max-w-sm md:max-w-lg leading-relaxed font-light tracking-wide animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 fill-mode-both">
            Formación y guía metodológica para manicuristas que quieren trabajar con precisión, rapidez y método.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-both">
            <Button size="lg" asChild className="bg-lavender/90 text-white hover:bg-lavender transition-colors shadow-none touch-manipulation md:bg-lavender/80 md:hover:bg-lavender/95">
              <a href="#formacion">Ver cursos</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 border-white/40 text-white/85 bg-transparent hover:bg-white/10 hover:text-white hover:border-white/70 transition-colors">
              <a href="/guide">
                <Download className="w-4 h-4 opacity-75" />
                Guía Metodológica
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
