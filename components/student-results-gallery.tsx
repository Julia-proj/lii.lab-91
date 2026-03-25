"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

// ─── Data ───────────────────────────────────────────────────────────────────

const subidaPhotos = Array.from({ length: 14 }, (_, i) => `master${i + 1}.jpeg`)

type Pair = { id: number; before: string; after: string }

const iniciacionPairs: Pair[] = [
  { id: 1, before: "before1.jpeg", after: "after1.jpeg" },
  { id: 2, before: "before2.jpeg", after: "after2.jpeg" },
  { id: 3, before: "before3.jpeg", after: "after3.jpeg" },
  { id: 4, before: "before4.jpeg", after: "after4.jpeg" },
  { id: 5, before: "before5.jpeg", after: "after5.jpeg" },
  { id: 7, before: "before7.jpeg", after: "after7.jpeg" },
]

// ─── BeforeAfterCard ─────────────────────────────────────────────────────────

function BeforeAfterCard({ pair }: { pair: Pair }) {
  const [showAfter, setShowAfter] = useState(false)

  return (
    <div
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer select-none"
      onClick={() => setShowAfter((v) => !v)}
    >
      {/* Before image */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showAfter ? "opacity-0" : "opacity-100"} md:opacity-100 md:group-hover:opacity-0`}>
        <Image
          src={`/images/${pair.before}`}
          alt={`Antes — alumna ${pair.id}`}
          fill
          sizes="(max-width: 768px) 50vw, 17vw"
          className="object-cover object-center"
        />
      </div>

      {/* After image */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${showAfter ? "opacity-100" : "opacity-0"} md:opacity-0 md:group-hover:opacity-100`}>
        <Image
          src={`/images/${pair.after}`}
          alt={`Resultado — alumna ${pair.id}`}
          fill
          sizes="(max-width: 768px) 50vw, 17vw"
          className="object-cover object-center"
        />
      </div>

      {/* Mobile overlay — "Toca para ver" when showing before */}
      <div className={`md:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-200 pointer-events-none ${showAfter ? "opacity-0" : "opacity-100"}`}>
        <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/80 text-center">Toca para ver</p>
      </div>

      {/* Desktop overlay — "Ver resultado" fades on hover */}
      <div className="hidden md:block absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/45 to-transparent p-4 transition-opacity duration-300 opacity-100 group-hover:opacity-0 pointer-events-none">
        <p className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/75 text-center">Ver resultado</p>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function StudentResultsGallery() {
  const [activeTab, setActiveTab] = useState<"subida" | "iniciacion">("subida")
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollCarousel = (dir: "prev" | "next") => {
    const el = scrollRef.current
    if (!el) return
    const card = el.querySelector("div") as HTMLElement
    const step = (card?.offsetWidth ?? 300) + 12
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" })
  }

  return (
    <section className="pt-4 pb-12 md:pt-6 md:pb-16">
      <div className="px-6 max-w-6xl mx-auto">
        {/* Section header */}
        <div className="fade-up text-center mb-10 sm:mb-14">
          <p className="text-[10px] tracking-[0.4em] uppercase text-neutral-400 font-medium mb-3">
            Trabajo real
          </p>
          <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 leading-tight">
            Resultados de Alumnas
          </h2>
          <div className="w-16 h-[2px] mx-auto bg-gold mt-3" />
        </div>

        {/* Tab toggle — segmented control */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex bg-neutral-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab("subida")}
              className={`px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm tracking-wide transition-all duration-200 whitespace-nowrap ${
                activeTab === "subida"
                  ? "bg-white shadow-sm text-neutral-900 font-medium"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Subida de Cualificación
            </button>
            <button
              onClick={() => setActiveTab("iniciacion")}
              className={`px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm tracking-wide transition-all duration-200 whitespace-nowrap ${
                activeTab === "iniciacion"
                  ? "bg-white shadow-sm text-neutral-900 font-medium"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              Curso de Iniciación
            </button>
          </div>
        </div>
      </div>

      {/* ── Tab 1: Subida de Cualificación ── */}
      {activeTab === "subida" && (
        <div className="relative px-6 md:px-10 max-w-6xl mx-auto">
          {/* Prev arrow — desktop only */}
          <button
            onClick={() => scrollCarousel("prev")}
            aria-label="Anterior"
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm items-center justify-center text-neutral-500 hover:text-neutral-900 hover:shadow-md transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Carousel — shared mobile + desktop */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 scrollbar-hide"
          >
            {subidaPhotos.map((photo, i) => (
              <div
                key={photo}
                className="shrink-0 w-[62vw] md:w-[calc(25%-9px)] snap-start aspect-[4/5] rounded-2xl overflow-hidden group"
              >
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

          {/* Next arrow — desktop only */}
          <button
            onClick={() => scrollCarousel("next")}
            aria-label="Siguiente"
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm items-center justify-center text-neutral-500 hover:text-neutral-900 hover:shadow-md transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Tab 2: Curso de Iniciación ── */}
      {activeTab === "iniciacion" && (
        <div className="px-6 max-w-6xl mx-auto">
          <p className="text-center text-xs text-neutral-400 mb-5 md:hidden">
            Toca cada foto para ver el resultado
          </p>
          {/* 2-col mobile, 6-col desktop */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
            {iniciacionPairs.map((pair) => (
              <BeforeAfterCard key={pair.id} pair={pair} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
