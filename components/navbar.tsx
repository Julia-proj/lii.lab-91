"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield, ArrowRight } from "lucide-react"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 50)
      if (currentScrollY > lastScrollY && currentScrollY > 80 && !isMobileMenuOpen) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
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

  const navLinks = [
    { name: "Quién soy", href: "#quien-soy" },
    { name: "Formaciones", href: "#formacion" },
    { name: "Reservar cita", href: "/booking", highlight: true },
  ]

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-4" : "bg-transparent py-6"
      }`}
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

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.filter(l => !l.highlight).map((link) => (
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

          {/* Reservar CTA */}
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

          {/* Auth section */}
          {session ? (
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen) }}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isScrolled ? "text-neutral-600" : "text-white/90"
                } hover:text-plum`}
              >
                <span className="w-7 h-7 rounded-full bg-plum text-white flex items-center justify-center text-xs font-bold">
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
              className={`text-sm font-medium transition-colors hover:text-plum ${
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
            className={`text-xs font-semibold px-4 py-2 rounded-md border transition-all duration-300 ${
              isScrolled
                ? "bg-transparent border-neutral-300 text-neutral-600 hover:bg-neutral-100"
                : "bg-white/15 backdrop-blur-sm border-white/40 text-white hover:bg-white/25"
            }`}
          >
            Reservar cita
          </Link>
          <button
            className="p-2.5 -mr-1"
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

    </header>

    {/* Mobile Menu Overlay — outside <header> so fixed inset-0 works relative to viewport, not transformed parent */}
    {isMobileMenuOpen && (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 shrink-0">
          <Link href="/#hero" onClick={() => setIsMobileMenuOpen(false)} className="font-serif text-xl text-neutral-900 tracking-tight">Lii.lab</Link>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 flex flex-col justify-center px-7 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="group flex items-center justify-between py-4 border-b border-neutral-100 last:border-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className={`text-3xl font-serif transition-colors duration-200 ${
                link.highlight
                  ? "text-plum group-hover:text-plum-hover"
                  : "text-neutral-900 group-hover:text-plum"
              }`}>
                {link.name}
              </span>
              <ArrowRight size={16} className={`group-hover:translate-x-1 transition-all duration-200 ${
                link.highlight ? "text-plum" : "text-neutral-300 group-hover:text-plum"
              }`} />
            </Link>
          ))}
        </div>

        {/* Bottom: Auth */}
        <div className="px-6 pb-8 pt-2 space-y-2 shrink-0">
          {session ? (
            <>
              <Link
                href={session.user?.role === "admin" ? "/admin" : "/dashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between w-full px-5 py-4 rounded-xl border border-neutral-200 text-neutral-700 font-medium text-sm hover:border-plum hover:text-plum transition-all duration-200"
              >
                <span>{session.user?.role === "admin" ? "Panel de administración" : "Mi panel"}</span>
                <ArrowRight size={15} className="text-neutral-400" />
              </Link>
              <button
                onClick={() => { signOut({ callbackUrl: "/" }); setIsMobileMenuOpen(false) }}
                className="w-full px-5 py-3.5 rounded-xl border border-red-100 text-red-500 font-medium text-sm hover:bg-red-50 transition-all duration-200"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium px-1 mb-1">Cuenta</p>
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-5 py-4 rounded-xl bg-plum text-white font-semibold text-base hover:bg-plum-hover transition-all duration-200 shadow-sm"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    )}
  </>
  )
}
