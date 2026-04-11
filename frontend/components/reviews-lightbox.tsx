'use client'

import { useEffect } from "react"
import { X } from "lucide-react"

interface ReviewsLightboxProps {
  src: string
  onClose: () => void
}

export function ReviewsLightbox({ src, onClose }: ReviewsLightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 cursor-zoom-out"
      style={{ animation: 'fadeIn 0.5s ease-out' }}
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        className="absolute top-4 sm:top-8 right-4 sm:right-8 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 hover:scale-105 transition-all duration-300"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" strokeWidth={1.5} />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Trabajo realizado en Lii Lab"
        onClick={(e) => e.stopPropagation()}
        className="max-w-[92vw] max-h-[85vh] w-auto h-auto rounded-xl object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)] cursor-default ring-1 ring-white/10"
        style={{ animation: 'zoomIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0 }
          to   { opacity: 1 }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.88) }
          to   { opacity: 1; transform: scale(1) }
        }
      `}</style>
    </div>
  )
}
