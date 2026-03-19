import { Download, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Contact() {
  return (
    <section id="contacto" className="py-16 bg-white text-center border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-serif mb-6 text-neutral-900">Contacto</h2>
        <p className="text-xl text-neutral-600 mb-8 font-light">
          ¿Quieres reservar una cita o conseguir la Guía Metodológica? Elige lo que necesitas.
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <Button
            size="lg"
            asChild
            className="gap-2 bg-plum text-white hover:bg-plum-hover transition-colors"
          >
            <Link href="/booking">
              <Calendar className="w-4 h-4" />
              Reservar cita
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="gap-2 border-plum text-plum hover:bg-plum hover:text-white transition-colors"
          >
            <Link href="#formacion">
              <Download className="w-4 h-4" />
              Conseguir la guía
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
