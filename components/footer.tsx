import Link from "next/link"
import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#f5f5f5] py-8 border-t border-gray-200">
      <div className="container mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          {/* Corrected name */}
          <span className="font-serif text-2xl font-bold block mb-2 text-neutral-900">Lii.lab</span>
          <p className="text-sm text-neutral-500">© 2025 Lili · Formación en manicura</p>
        </div>

        <Link
          href="https://www.instagram.com/lii.lab/?hl=es"
          target="_blank"
          className="flex items-center gap-2 text-neutral-600 hover:text-[#CDB4DB] transition-colors group"
        >
          <span className="text-sm font-medium">Sígueme en Instagram</span>
          <div className="p-2 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all">
            <Instagram size={20} />
          </div>
        </Link>
      </div>
    </footer>
  )
}
