"use client"

import { useState } from "react"
import { GallerySubidaCarousel } from "./gallery-subida-carousel"
import { GalleryIniciacionGrid } from "./gallery-iniciacion-grid"

export function StudentResultsGallery() {
  const [activeTab, setActiveTab] = useState<"subida" | "iniciacion">("subida")

  return (
    <section id="resultados" className="pt-16 pb-16 md:pt-32 md:pb-28 bg-white relative z-0">
      <div className="px-6 max-w-[1400px] mx-auto">
        <div className="fade-up text-center mb-10 sm:mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-neutral-500 font-medium mb-3">Trabajo real</p>
          <h2 className="text-4xl md:text-5xl font-serif text-neutral-900 leading-tight">Resultados de Alumnas</h2>
          <div className="w-16 h-[2px] mx-auto bg-gold mt-3" />
        </div>

        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex bg-neutral-100 rounded-xl p-1 gap-1">
            {(["subida", "iniciacion"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm tracking-wide transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-white shadow-sm text-neutral-900 font-medium"
                    : "text-neutral-500 hover:text-neutral-600"
                }`}
              >
                {tab === "subida" ? "Subida de Cualificación" : "Curso de Iniciación"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === "subida" && <GallerySubidaCarousel />}
      {activeTab === "iniciacion" && <GalleryIniciacionGrid />}
    </section>
  )
}
