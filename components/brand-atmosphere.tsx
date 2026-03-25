"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"

const PHOTOS = [
  { src: "/images/Foto5.JPG",  alt: "Lii.lab — ambiente" },
  { src: "/images/Foto4.JPG",  alt: "Lii.lab — detalle" },
  { src: "/images/Foto6.jpg",  alt: "Lii.lab — esencia" },
  { src: "/images/Foto3.jpg",  alt: "Lii.lab — textura" },
]

function RevealImage({
  src,
  alt,
  delay,
  className,
  sizes = "(max-width: 768px) 50vw, 45vw",
}: {
  src: string
  alt: string
  delay: number
  className?: string
  sizes?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(48px)",
        transition: "opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1), transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading="lazy"
        className="object-cover object-center transition-transform duration-[1600ms] ease-out hover:scale-[1.04]"
      />
    </div>
  )
}

export function BrandAtmosphere() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 overflow-hidden bg-white">
      {/* Eyebrow */}
      <div className="text-center mb-10 md:mb-16">
        <p className="text-[9px] tracking-[0.55em] uppercase text-neutral-300 font-medium">
          Lii · lab
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* ── Mobile: 2×2 staggered grid ── */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          <RevealImage src={PHOTOS[0].src} alt={PHOTOS[0].alt} delay={0}   className="aspect-[3/4]" />
          <RevealImage src={PHOTOS[1].src} alt={PHOTOS[1].alt} delay={120} className="aspect-[3/4] mt-6" />
          <RevealImage src={PHOTOS[2].src} alt={PHOTOS[2].alt} delay={240} className="aspect-[3/4]" />
          <RevealImage src={PHOTOS[3].src} alt={PHOTOS[3].alt} delay={360} className="aspect-[3/4] mt-6" />
        </div>

        {/* ── Desktop: editorial 2-col offset composition ── */}
        <div className="hidden md:grid grid-cols-2 gap-5">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            <RevealImage src={PHOTOS[0].src} alt={PHOTOS[0].alt} delay={0}   className="aspect-[4/5]" />
            <RevealImage src={PHOTOS[2].src} alt={PHOTOS[2].alt} delay={220} className="aspect-[4/3]" />
          </div>
          {/* Right column — offset down 64px for editorial stagger */}
          <div className="flex flex-col gap-5 mt-16">
            <RevealImage src={PHOTOS[1].src} alt={PHOTOS[1].alt} delay={110} className="aspect-[4/3]" />
            <RevealImage src={PHOTOS[3].src} alt={PHOTOS[3].alt} delay={330} className="aspect-[4/5]" />
          </div>
        </div>
      </div>
    </section>
  )
}
