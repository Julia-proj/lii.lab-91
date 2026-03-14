"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield, ArrowRight } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const handleClick = () => setIsDropdownOpen(false)
    if (isDropdownOpen) {
      document.addEventListener("click", handleClick)
      return () => document.removeEventListener("click", handleClick)
    }
  }, [isDropdownOpen])

  const navLinks = [
    { name: "Quién soy", href: "#quien-soy" },
    { name: "Cursos", href: "#cursos" },
    { name: "Guía", href: "#guia" },
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
          <div className={`h-6 w-px transition-colors hidden sm:block ${isScrolled ? "bg-neutral-300" : "bg-white/30"}`} />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-[#CDB4DB] ${
                isScrolled ? "text-neutral-600" : "text-white/90"
              }`}
            >
              {link.name}
            </a>
          ))}

          {/* Reservar CTA */}
          <Link
            href="/booking"
            className="text-sm font-medium bg-[#CDB4DB] text-neutral-900 px-5 py-2 rounded-full hover:bg-[#bda0cb] hover:text-white transition-colors"
          >
            Reservar cita
          </Link>

          {/* Auth section */}
          {session ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen) }}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isScrolled ? "text-neutral-600" : "text-white/90"
                } hover:text-[#CDB4DB]`}
              >
                <span className="w-7 h-7 rounded-full bg-[#CDB4DB] text-white flex items-center justify-center text-xs font-bold">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-sm font-medium truncate">{session.user?.name}</p>
                    <p className="text-xs text-neutral-400 truncate">{session.user?.email}</p>
                  </div>
                  {session.user?.role === "admin" ? (
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
                      <Shield className="w-4 h-4" /> Admin
                    </Link>
                  ) : (
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">
                      <LayoutDashboard className="w-4 h-4" /> Mi panel
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-neutral-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`text-sm font-medium transition-colors hover:text-[#CDB4DB] ${
                isScrolled ? "text-neutral-600" : "text-white/90"
              }`}
            >
              Iniciar sesión
            </Link>
          )}
        </nav>

        {/* Mobile: Reservar pill + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/booking"
            onClick={() => setIsMobileMenuOpen(false)}
            className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
              isScrolled
                ? "bg-[#B48EC5] text-white shadow-sm hover:bg-[#a37ab5]"
                : "bg-white/15 backdrop-blur-sm border border-white/40 text-white hover:bg-white/25"
            }`}
          >
            Reservar cita
          </Link>
          <button
            className="p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-neutral-900" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-neutral-900" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 w-full h-screen bg-neutral-950 z-50 flex flex-col overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CDB4DB]/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-24 left-0 w-48 h-48 bg-[#CDB4DB]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/8 relative z-10">
            <span className="font-serif text-xl text-white tracking-tight">Lii.lab</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white/50 hover:text-white transition-colors"
            >
              <X size={22} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 flex flex-col justify-center px-7 relative z-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="group flex items-center justify-between py-5 border-b border-white/8 last:border-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-3xl font-serif text-white group-hover:text-[#CDB4DB] transition-colors duration-200">
                  {link.name}
                </span>
                <ArrowRight size={18} className="text-white/20 group-hover:text-[#CDB4DB] group-hover:translate-x-1 transition-all duration-200" />
              </a>
            ))}

            {/* Auth */}
            <div className="pt-6">
              {session ? (
                <div className="flex items-center gap-4">
                  <Link
                    href={session.user?.role === "admin" ? "/admin" : "/dashboard"}
                    className="text-sm text-white/40 hover:text-white/70 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {session.user?.role === "admin" ? "Admin" : "Mi panel"}
                  </Link>
                  <span className="text-white/20">·</span>
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setIsMobileMenuOpen(false) }}
                    className="text-sm text-white/40 hover:text-red-400 transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-sm text-white/40 hover:text-white/70 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="px-6 pb-10 relative z-10">
            <Link
              href="/booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full bg-[#B48EC5] hover:bg-[#a37ab5] active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all duration-200 text-base shadow-lg"
              style={{ boxShadow: "0 8px 30px rgba(180,142,197,0.3)" }}
            >
              Reservar cita
            </Link>
            <p className="text-center text-white/25 text-xs mt-3 tracking-wide">
              Formación profesional en manicura
            </p>
          </div>
        </div>
      )}
    </header>
  )
}
