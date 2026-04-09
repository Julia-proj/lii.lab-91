'use client'

import Link from "next/link"
import { signOut } from "next-auth/react"
import { X, ArrowRight } from "lucide-react"
import type { Session } from "next-auth"

interface NavLink {
  name: string
  href: string
  highlight?: boolean
}

interface MobileMenuProps {
  session: Session | null
  navLinks: NavLink[]
  onClose: () => void
}

export function MobileMenu({ session, navLinks, onClose }: MobileMenuProps) {
  return (
    <div className="fixed inset-0 bg-white z-[60] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 shrink-0">
        <Link href="/#hero" onClick={onClose} className="font-serif text-xl text-neutral-900 tracking-tight">Lii.lab</Link>
        <button onClick={onClose} className="p-2 text-neutral-500 hover:text-neutral-700 transition-colors">
          <X size={22} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-7 py-4">
        {navLinks.map((link) => {
          const isHash = link.href.startsWith("#")
          const Tag = isHash ? "a" : Link
          return (
            <Tag
              key={link.name}
              href={link.href}
              className="group flex items-center justify-between py-4 border-b border-neutral-100 last:border-0"
              onClick={onClose}
            >
              <span className={`text-3xl font-serif transition-colors duration-200 ${
                link.highlight ? "text-plum group-hover:text-plum-hover" : "text-neutral-900 group-hover:text-plum"
              }`}>
                {link.name}
              </span>
              <ArrowRight size={16} className={`group-hover:translate-x-1 transition-all duration-200 ${
                link.highlight ? "text-plum" : "text-neutral-300 group-hover:text-plum"
              }`} />
            </Tag>
          )
        })}
      </div>

      <div className="px-6 pb-8 pt-2 space-y-2 shrink-0">
        {session ? (
          <>
            <Link
              href={session.user?.role === "admin" ? "/admin" : "/dashboard"}
              onClick={onClose}
              className="flex items-center justify-between w-full px-5 py-4 rounded-xl border border-neutral-200 text-neutral-700 font-medium text-sm hover:border-plum hover:text-plum transition-all duration-200"
            >
              <span>{session.user?.role === "admin" ? "Panel de administración" : "Mi panel"}</span>
              <ArrowRight size={15} className="text-neutral-500" />
            </Link>
            <button
              onClick={() => { signOut({ callbackUrl: "/" }); onClose() }}
              className="w-full px-5 py-3.5 rounded-xl border border-red-100 text-red-500 font-medium text-sm hover:bg-red-50 transition-all duration-200"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
            <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium px-1 mb-1">Cuenta</p>
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center w-full px-5 py-4 rounded-xl bg-plum text-white font-semibold text-base hover:bg-plum-hover transition-all duration-200 shadow-sm"
            >
              Iniciar sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
