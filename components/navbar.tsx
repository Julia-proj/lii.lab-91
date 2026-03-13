"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
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
    { name: "Quién soy", href: "#quien-soy", highlight: false },
    { name: "Cursos", href: "#cursos", highlight: false },
    { name: "Guía", href: "#guia", highlight: false },
    { name: "Reservar", href: "/booking", highlight: true },
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
           
          </span>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors ${
                link.highlight
                  ? "bg-[#CDB4DB] text-neutral-900 px-4 py-1.5 rounded-full hover:bg-[#bda0cb]"
                  : `hover:text-[#CDB4DB] ${isScrolled ? "text-neutral-600" : "text-white/90"}`
              }`}
            >
              {link.name}
            </Link>
          ))}

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
        <div className="fixed inset-0 w-full h-screen bg-white z-50 flex flex-col items-center justify-center space-y-6">
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
          <div className="pt-4 border-t border-neutral-200 w-48 text-center">
            {session ? (
              <div className="space-y-3">
                {session.user?.role === "admin" ? (
                  <Link href="/admin" className="block text-lg text-neutral-600 hover:text-[#CDB4DB]" onClick={() => setIsMobileMenuOpen(false)}>
                    Admin
                  </Link>
                ) : (
                  <Link href="/dashboard" className="block text-lg text-neutral-600 hover:text-[#CDB4DB]" onClick={() => setIsMobileMenuOpen(false)}>
                    Mi panel
                  </Link>
                )}
                <button onClick={() => { signOut({ callbackUrl: "/" }); setIsMobileMenuOpen(false) }} className="text-lg text-red-500">
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-lg text-neutral-600 hover:text-[#CDB4DB]" onClick={() => setIsMobileMenuOpen(false)}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
