"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Quién soy", href: "#quien-soy" },
    { name: "Cursos", href: "#cursos" },
    { name: "Guía Metodológica", href: "#guia" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="#"
            className={`text-lg font-serif font-bold tracking-tight transition-colors ${
              isScrolled ? "text-neutral-900" : "text-white"
            }`}
          >
            Lii.lab
          </Link>
          <div className={`h-6 w-px transition-colors ${isScrolled ? "bg-neutral-300" : "bg-white/30"}`} />
          <span
            className={`text-xs font-light tracking-[0.15em] transition-colors ${
              isScrolled ? "text-neutral-500" : "text-white/70"
            }`}
          >
            MANIC 0.0
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-[#CDB4DB] ${
                isScrolled ? "text-neutral-600" : "text-white/90"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="text-neutral-900" />
          ) : (
            <Menu className={isScrolled ? "text-neutral-900" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-screen bg-white z-50 flex flex-col items-center justify-center space-y-8">
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-6 p-2 text-neutral-900">
            <X size={32} />
          </button>
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-3xl font-serif text-neutral-900 hover:text-[#CDB4DB]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
