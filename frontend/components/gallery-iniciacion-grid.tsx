"use client"

import { useState } from "react"
import Image from "next/image"

type Pair = { id: number; before: string; after: string }

const iniciacionPairs: Pair[] = [
  { id: 1, before: "before1.jpeg", after: "after1.jpeg" },
  { id: 2, before: "before2.jpeg", after: "after2.jpeg" },
  { id: 3, before: "before3.jpeg", after: "after3.jpeg" },
  { id: 4, before: "before4.jpeg", after: "after4.jpeg" },
  { id: 5, before: "before5.jpeg", after: "after5.jpeg" },
  { id: 7, before: "before7.jpeg", after: "after7.jpeg" },
]

function BeforeAfterCard({ pair }: { pair: Pair }) {
  const [showAfter, setShowAfter] = useState(false)

  return (
    <div
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer select-none"
      onClick={() => setShowAfter((v) => !v)}
    >
      <div className={`absolute inset-0 transition-opacity duration-300 ${showAfter ? "opacity-0" : "opacity-100"} md:opacity-100 md:group-hover:opacity-0`}>
        <Image
          src={`/images/${pair.before}`}
          alt={`Antes — alumna ${pair.id}`}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover object-center"
        />
      </div>
      <div className={`absolute inset-0 transition-opacity duration-300 ${showAfter ? "opacity-100" : "opacity-0"} md:opacity-0 md:group-hover:opacity-100`}>
        <Image
          src={`/images/${pair.after}`}
          alt={`Resultado — alumna ${pair.id}`}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover object-center"
        />
      </div>
      <div className="absolute inset-0 bg-[#A6B8CE] opacity-[0.14] mix-blend-color z-[1] pointer-events-none" />
      <div className="absolute inset-0 bg-[#D4E0ED] opacity-[0.06] mix-blend-overlay z-[1] pointer-events-none" />
      <div className={`md:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-4 transition-opacity duration-200 pointer-events-none ${showAfter ? "opacity-0" : "opacity-100"}`}>
        <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-white/80 text-center">Toca para ver</p>
      </div>
      <div className="hidden md:block absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/45 to-transparent p-4 transition-opacity duration-300 opacity-100 group-hover:opacity-0 pointer-events-none">
        <p className="text-[11px] uppercase tracking-[0.3em] font-medium text-white/75 text-center">Ver resultado</p>
      </div>
    </div>
  )
}

export function GalleryIniciacionGrid() {
  return (
    <div className="px-6 max-w-6xl mx-auto">
      <p className="text-center text-xs text-neutral-500 mb-5 md:hidden">
        Toca cada foto para ver el resultado
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {iniciacionPairs.map((pair) => (
          <BeforeAfterCard key={pair.id} pair={pair} />
        ))}
      </div>
    </div>
  )
}
