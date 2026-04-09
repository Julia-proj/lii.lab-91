"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const subidaPhotos = [
  "master10.jpeg",
  "master2.jpeg", "master3.jpeg", "master4.jpeg", "master5.jpeg",
  "master6.jpeg", "master7.jpeg",
  "master1.jpeg",
  "master8.jpeg", "master9.jpeg", "master11.jpeg",
  "master12.jpeg", "master13.jpeg", "master14.jpeg",
]

export function GallerySubidaCarousel() {
  const [hasScrolled, setHasScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (dir: "prev" | "next") => {
    const el = scrollRef.current
    if (!el) return
    const card = el.querySelector("div") as HTMLElement
    const step = (card?.offsetWidth ?? 300) + 12
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" })
  }

  return (
    <div className="relative px-6 md:px-10 max-w-6xl mx-auto">
      <button
        onClick={() => scrollCarousel("prev")}
        aria-label="Anterior"
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm items-center justify-center text-neutral-500 hover:text-neutral-900 hover:shadow-md transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div
        ref={scrollRef}
        onScroll={() => setHasScrolled(true)}
        className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 scrollbar-hide"
      >
        {subidaPhotos.map((photo, i) => (
          <div
            key={photo}
            className="relative shrink-0 w-[62vw] md:w-[calc(25%-9px)] snap-start aspect-[4/5] rounded-2xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-[#A6B8CE] opacity-[0.14] mix-blend-color z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-[#D4E0ED] opacity-[0.06] mix-blend-overlay z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-700" />
            <Image
              src={`/images/${photo}`}
              alt={`Resultado subida de cualificación ${i + 1}`}
              width={400}
              height={500}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollCarousel("next")}
        aria-label="Siguiente"
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm items-center justify-center text-neutral-500 hover:text-neutral-900 hover:shadow-md transition-all duration-200"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      <div className={`md:hidden flex items-center justify-center gap-2 mt-4 transition-opacity duration-500 ${hasScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <span className="text-[11px] uppercase tracking-[0.35em] text-neutral-500 font-medium">Desliza</span>
        <span className="swipe-hint-arrow text-neutral-500 text-xs">→</span>
      </div>
    </div>
  )
}
