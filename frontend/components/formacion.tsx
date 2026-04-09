"use client"

import { FormacionManicCard } from "./formacion-manic-card"
import { FormacionSubidaCard } from "./formacion-subida-card"
import { FormacionGuiaCard } from "./formacion-guia-card"

export function Formacion() {
  return (
    <section id="formacion" className="pt-24 md:pt-32 pb-8 bg-warm-bg relative">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="fade-up text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-serif mb-3">Formaciones</h2>
          <div className="w-16 h-[2px] mx-auto bg-gold" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          <FormacionManicCard />
          <FormacionSubidaCard />
          <FormacionGuiaCard />
        </div>
      </div>
    </section>
  )
}
