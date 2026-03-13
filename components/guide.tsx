"use client"

import { Check, Book, Instagram } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function Guide() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loadingStripe, setLoadingStripe] = useState(false)
  const contents = [
    "Anatomía y fisiología de la uña",
    "Protocolos de higiene y esterilización",
    "Enfermedades y contraindicaciones",
    "Preparación de la uña natural",
    "Organización del puesto de trabajo",
    "Estructura de servicios y tiempos",
  ]

  return (
    <section id="guia" className="py-16 sm:py-24 md:py-32 lg:py-48 bg-[#fafafa] border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col-reverse md:flex-row gap-20 items-center">
          {/* Text Content */}
          <div className="w-full md:w-1/2 fade-in-section">
            <div className="mb-12">
              <div className="flex items-center gap-2 text-[#F4B4C7] mb-3">
                <Book size={20} />
                <span className="font-bold text-sm uppercase tracking-widest">Material Exclusivo</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-serif mb-8 text-neutral-900">Guía Metodológica</h2>
              <p className="text-neutral-600 text-lg leading-relaxed mb-10 font-light">
                Un libro completo que reúne la información esencial para una manicurista. Escrita de forma clara y
                práctica para mejorar la técnica y optimizar los tiempos de servicio.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-12">
              <h3 className="text-xl font-serif mb-6 text-neutral-900">Contenido principal</h3>
              <ul className="space-y-4">
                {contents.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="mt-1 shrink-0 w-6 h-6 rounded-full bg-[#e8f5e9] flex items-center justify-center group-hover:bg-[#c8e6c9] transition-colors border border-[#a5d6a7]">
                      <Check size={14} className="text-[#2e7d32]" strokeWidth={2.5} />
                    </div>
                    <span className="text-neutral-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-12 pl-6 border-l-4 border-[#CDB4DB]">
              <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Para formadoras y profesionales</h3>
              <p className="text-neutral-600 text-base leading-relaxed">
                Facilita el trabajo de enseñanza y evita crear materiales desde cero.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={async () => {
                  if (!session) {
                    router.push("/login")
                    return
                  }
                  setLoadingStripe(true)
                  try {
                    const res = await fetch("/api/stripe/checkout", { method: "POST" })
                    const data = await res.json()
                    if (data.url) {
                      window.location.href = data.url
                    } else {
                      toast.error("Error al iniciar el pago")
                    }
                  } catch {
                    toast.error("Error de conexión")
                  } finally {
                    setLoadingStripe(false)
                  }
                }}
                disabled={loadingStripe}
                className="inline-block w-full sm:w-auto px-10 py-4 bg-[#B48EC5] text-white font-semibold rounded-full hover:bg-[#a37ab5] transition-all duration-300 shadow-md hover:shadow-lg text-center disabled:opacity-60"
              >
                {loadingStripe ? "Cargando..." : "Consigue tu Guía al instante"}
              </button>
              <Link
                href="https://www.instagram.com/lii.lab/?hl=es"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-10 py-4 border border-neutral-300 text-neutral-600 font-medium rounded-full hover:border-[#CDB4DB] hover:text-neutral-900 transition-all duration-300 text-center"
              >
                <Instagram size={18} />
                Preguntar por Instagram
              </Link>
            </div>
          </div>

          {/* Video Content */}
          <div className="w-full md:w-1/2 flex justify-center fade-in-section">
            <div className="relative w-[85%] md:w-full max-w-sm">
              <div className="absolute top-4 -right-4 w-full h-full border border-neutral-200 z-0" />
              <video
                autoPlay
                loop
                muted
                playsInline
                className="relative z-10 w-full aspect-[3/4] object-cover shadow-2xl"
              >
                <source src="/videos/guia.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
