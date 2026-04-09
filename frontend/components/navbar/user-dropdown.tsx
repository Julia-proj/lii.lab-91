'use client'

import Link from "next/link"
import { signOut } from "next-auth/react"
import { ChevronDown, LogOut, LayoutDashboard, Shield } from "lucide-react"
import type { Session } from "next-auth"

interface UserDropdownProps {
  session: Session
  isScrolled: boolean
  isOpen: boolean
  onToggle: () => void
}

export function UserDropdown({ session, isScrolled, isOpen, onToggle }: UserDropdownProps) {
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); onToggle() }}
        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
          isScrolled ? "text-neutral-600" : "text-white/90"
        } hover:text-plum`}
      >
        <span className="w-7 h-7 rounded-full bg-plum text-white flex items-center justify-center text-xs font-bold">
          {session.user?.name?.[0]?.toUpperCase() || "U"}
        </span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
          <div className="px-4 py-2 border-b border-neutral-100">
            <p className="text-sm font-medium truncate">{session.user?.name}</p>
            <p className="text-xs text-neutral-500 truncate">{session.user?.email}</p>
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
  )
}
