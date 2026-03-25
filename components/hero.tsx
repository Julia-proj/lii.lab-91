"use client"

import { useState, useEffect } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

const ATMOSPHERIC = [
  { src: "/images/Foto5.JPG", bg: "#3e4449", pos: "center 28%" }, // девушка с лаком — выше
  { src: "/images/Foto4.JPG", bg: "#2a2d32", pos: "center 22%" }, // лак на перчатке — выше
  { src: "/images/Foto6.jpg", bg: "#7a5f55", pos: "center 50%" }, // ногти — по центру
  { src: "/images/Foto3.jpg", bg: "#1a1a1e", pos: "center 28%" }, // джинсы — карман в кадре
]

const TOTAL = ATMOSPHERIC.length + 1

export function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TOTAL)
    }, 5500)
    return () => clearInterval(timer)
  }, [])

  const isHero = current === 0

  return (
    <section
      id="hero"
      className="relative h-svh sm:min-h-screen overflow-hidden"
      style={{
        backgroundColor: isHero ? "#0a0a0a" : ATMOSPHERIC[current - 1].bg,
        transition: "background-color 2000ms ease-in-out",
      }}
    >

      {/* ── Slide 0: Hero.JPG — full screen as always ── */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out ${
          isHero ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src="/images/Hero.JPG"
          alt="Lii.lab beauty studio"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-[center_20%] md:object-[center_28%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/65 md:via-black/30 md:to-transparent" />
      </div>

      {/* ── Slides 1–4: atmospheric — mobile full, desktop right panel ── */}
      {ATMOSPHERIC.map(({ src, pos, bg }, i) => {
        const idx = i + 1
        const active = current === idx
        return (
          <div
            key={src}
            className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out ${
              active ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Mobile: full-screen cover */}
            <img
              src={src}
              alt="Lii.lab"
              loading="lazy"
              decoding="async"
              className="md:hidden w-full h-full object-cover object-center"
            />

            {/* Desktop: editorial right panel — 62% width, per-photo positioning */}
            <div className="hidden md:block absolute right-0 top-0 h-full w-[62%]">
              <img
                src={src}
                alt="Lii.lab"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
                style={{ objectPosition: pos }}
              />
              {/* Left-edge blend: photo fades into ambient bg color seamlessly */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(to right, ${bg} 0%, ${bg}cc 5%, ${bg}55 15%, transparent 32%)` }}
              />
            </div>

            {/* Mobile overlay */}
            <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/75 via-black/45 to-black/10" />
            {/* Desktop overlay — wide smooth gradient so text area stays solid */}
            <div
              className="hidden md:block absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.80) 28%, rgba(0,0,0,0.35) 50%, transparent 72%)" }}
            />
          </div>
        )
      })}

      {/* Badge — top left, below navbar */}
      <div className="absolute top-[72px] sm:top-[80px] left-0 right-0 z-10 container mx-auto px-6">
        <span className="inline-block py-1.5 px-4 border border-white/25 rounded-full text-xs tracking-widest uppercase backdrop-blur-sm text-white/60 font-light">
          MANIC 0.0
        </span>
      </div>

      {/* Content — pinned to bottom-left */}
      <div className="absolute bottom-0 left-0 right-0 z-10 container mx-auto px-4 sm:px-6 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-xl text-white">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif leading-[1.1] mb-3 sm:mb-5 md:mb-6 text-white">
            Formación profesional<br /> en manicura
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-200/90 mb-6 sm:mb-8 max-w-sm md:max-w-lg leading-relaxed font-light">
            Formación y guía metodológica para manicuristas que quieren trabajar con precisión, rapidez y método.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              size="lg"
              asChild
              className="bg-[#B09EC2] md:bg-[#A896BA] text-white hover:bg-[#9e8cb0] md:hover:bg-[#9888AC] transition-colors"
            >
              <a href="#formacion">Ver cursos</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="gap-2 border-white/40 text-white/85 bg-transparent hover:bg-white/10 hover:text-white hover:border-white/70 transition-colors"
            >
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
