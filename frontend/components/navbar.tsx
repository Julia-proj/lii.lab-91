"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Menu, X } from "lucide-react"
import { UserDropdown } from "./navbar/user-dropdown"
import { MobileMenu } from "./navbar/mobile-menu"

const navLinks = [
  { name: "Quién soy",    href: "#quien-soy" },
  { name: "Formaciones",  href: "#formacion" },
  { name: "Resultados",   href: "#resultados" },
  { name: "Opiniones",    href: "#opiniones" },
  { name: "Reservar cita", href: "/booking", highlight: true },
]

export function Navbar() {
  const [isScrolled, setIsScrolled]       = useState(false)
  const [isVisible, setIsVisible]         = useState(true)
  const [lastScrollY, setLastScrollY]     = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)
      if (currentScrollY > lastScrollY && currentScrollY > 80 && !isMobileMenuOpen) setIsVisible(false)
      else setIsVisible(true)
      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY, isMobileMenuOpen])

  useEffect(() => {
    const handleClick = () => setIsDropdownOpen(false)
    if (isDropdownOpen) {
      document.addEventListener("click", handleClick)
      return () => document.removeEventListener("click", handleClick)
    }
  }, [isDropdownOpen])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-4" : "bg-transparent py-6"}`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/#hero"
              className={`text-lg font-serif font-bold tracking-tight transition-colors ${
                isScrolled ? "text-neutral-900" : "text-white"
              }`}
            >
              Lii.lab
            </Link>
            <div className={`h-6 w-px transition-colors hidden sm:block ${isScrolled ? "bg-neutral-300" : "bg-white/30"}`} />
          </div>

          {/* Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.filter((l) => !l.highlight).map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors hover:text-plum ${
                  isScrolled ? "text-neutral-600" : "text-white/90"
                }`}
              >
                {link.name}
              </a>
            ))}
            <Link
              href="/booking"
              className={`text-sm font-medium px-5 py-2 rounded-md border transition-colors ${
                isScrolled
                  ? "bg-plum border-transparent text-white hover:bg-plum-hover"
                  : "bg-white/15 border-white/40 text-white hover:bg-white/25"
              }`}
            >
              Reservar cita
            </Link>
            {session ? (
              <UserDropdown
                session={session}
                isScrolled={isScrolled}
                isOpen={isDropdownOpen}
                onToggle={() => setIsDropdownOpen((v) => !v)}
              />
            ) : (
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors hover:text-plum ${
                  isScrolled ? "text-neutral-600" : "text-white/90"
                }`}
              >
                Iniciar sesión
              </Link>
            )}
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-xs uppercase tracking-wider font-semibold px-4 py-1.5 rounded-full border transition-all duration-300 ${
                isScrolled
                  ? "bg-neutral-900 border-neutral-900 text-white"
                  : "bg-white/15 backdrop-blur-md border-white/40 text-white hover:bg-white/25"
              }`}
            >
              Reservar cita
            </Link>
            <button
              className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                isScrolled ? "text-neutral-900 hover:bg-neutral-100" : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className={isScrolled ? "text-neutral-900" : "text-white"} />
              )}
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <MobileMenu
          session={session}
          navLinks={navLinks}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
