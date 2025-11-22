import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 font-medium">© 2025 Lili · Formación en manicura</p>

        <a
          href="https://instagram.com/tu_instagram"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 text-gray-400 hover:text-[#F4B4C7] transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </a>
      </div>
    </footer>
  )
}
