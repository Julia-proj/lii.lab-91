"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroSlide } from "./hero-slide"

const ATMOSPHERIC = [
  { src: "/images/Foto5.JPG", bg: "#3e4449", pos: "center 42%", mobilePos: "center 30%", mobileScale: 1,    scale: 1 },
  { src: "/images/Foto4.JPG", bg: "#2a2d32", pos: "55% 40%",    mobilePos: "center 30%", mobileScale: 1.12, scale: 1 },
  { src: "/images/Foto6.jpg", bg: "#7a5f55", pos: "center 50%", mobilePos: "center 50%", mobileScale: 1,    scale: 1 },
  { src: "/images/Foto3.jpg", bg: "#1a1a1e", pos: "center 28%", mobilePos: "center 28%", mobileScale: 1,    scale: 1 },
]

const TOTAL = ATMOSPHERIC.length + 1

export function Hero() {
  const [current, setCurrent] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const setHeight = () => { el.style.height = `${window.innerHeight}px` }
    setHeight()
    window.addEventListener("orientationchange", setHeight)
    return () => window.removeEventListener("orientationchange", setHeight)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => { setCurrent((prev) => (prev + 1) % TOTAL) }, 4000)
    return () => clearInterval(timer)
  }, [])

  const isHero = current === 0

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden"
      style={{
        height: '100dvh',
        backgroundColor: isHero ? "#0a0a0a" : ATMOSPHERIC[current - 1].bg,
        transition: "background-color 2000ms ease-in-out",
      }}
    >
      {/* Slide 0: Hero.JPG */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out ${isHero ? "opacity-100" : "opacity-0"}`}>
        <Image
          src="/images/Hero.JPG"
          alt="Lii.lab beauty studio"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_20%] md:object-[center_28%] hero-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/65 md:via-black/30 md:to-transparent" />
      </div>

      {/* Atmospheric slides 1-4 */}
      {ATMOSPHERIC.map((slide, i) => (
        <HeroSlide key={slide.src} slide={slide} index={i + 1} active={current === i + 1} />
      ))}

      {/* Desktop gradient overlay */}
      <div
        className="hidden md:block absolute inset-0 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 28%, rgba(0,0,0,0.30) 50%, transparent 68%)" }}
      />

      {/* Badge */}
      <div className="absolute top-[72px] sm:top-[80px] left-0 right-0 z-10 container mx-auto px-6">
        <span className="inline-block py-1.5 px-4 border border-white/25 rounded-full text-xs tracking-widest uppercase backdrop-blur-sm text-white/60 font-light">
          MANIC 0.0
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-xl text-white">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-[1.1] mb-3 sm:mb-5 md:mb-6 text-white">
            Formación profesional<br /> en manicura
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-200/90 mb-6 sm:mb-8 max-w-sm md:max-w-lg leading-relaxed font-light">
            Formación y guía metodológica para manicuristas que quieren trabajar con precisión, rapidez y método.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button size="lg" asChild className="bg-[#B09EC2] md:bg-[#A896BA] text-white hover:bg-[#9e8cb0] md:hover:bg-[#9888AC] transition-colors">
              <a href="#formacion">Ver cursos</a>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 border-white/40 text-white/85 bg-transparent hover:bg-white/10 hover:text-white hover:border-white/70 transition-colors">
              <a href="#formacion">
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
