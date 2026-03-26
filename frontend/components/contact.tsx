import { Download, Calendar } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Contact() {
  return (
    <section id="contacto" className="py-16 bg-white text-center border-t border-gray-100">
      <div className="container mx-auto px-6 max-w-2xl">
        <h2 className="fade-up text-2xl md:text-3xl font-serif mb-3 text-neutral-900">Contacto</h2>
        <p className="fade-up text-sm text-neutral-500 mb-8 font-light" data-delay="100">
          Reserva una cita o consigue la Guía Metodológica.
        </p>

        <div className="fade-up flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4" data-delay="200">
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
            <Link href="#guia">
              <Download className="w-4 h-4" />
              Conseguir la guía
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
