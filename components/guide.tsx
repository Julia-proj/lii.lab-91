"use client"

import { Check, Book, Instagram, ArrowRight, Sparkles } from "lucide-react"
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
    <section id="guia" className="py-16 sm:py-20 md:py-28 bg-[#fafafa] border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto fade-in-section">
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

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-12 overflow-hidden">
            {/* Video inside card, before contenido principal */}
            <div className="px-5 pt-5">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full aspect-video object-cover rounded-xl"
              >
                <source src="/videos/guia.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="p-8">
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
          </div>

          <div className="mb-12 pl-6 border-l-4 border-[#CDB4DB]">
            <h3 className="font-serif text-2xl font-bold text-neutral-900 mb-3">Para formadoras y profesionales</h3>
            <p className="text-neutral-600 text-base leading-relaxed">
              Facilita el trabajo de enseñanza y evita crear materiales desde cero.
            </p>
          </div>

          <div className="flex flex-col gap-3">
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
              className="group w-full flex items-center justify-between px-7 py-5 bg-[#9B6AB5] hover:bg-[#8a5aa4] active:scale-[0.99] text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60"
              style={{ boxShadow: "0 8px 32px rgba(155,106,181,0.45)" }}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-base leading-tight">
                    {loadingStripe ? "Cargando..." : "Consigue tu Guía"}
                  </p>
                  <p className="text-white/75 text-xs mt-0.5">Descarga inmediata · Pago único</p>
                </div>
              </div>
              <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="https://www.instagram.com/lii.lab/?hl=es"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 w-full px-7 py-4 border border-neutral-200 text-neutral-500 font-medium rounded-2xl hover:border-[#CDB4DB] hover:text-neutral-900 transition-all duration-300"
            >
              <Instagram size={17} />
              <span className="text-sm">Preguntar por Instagram</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
