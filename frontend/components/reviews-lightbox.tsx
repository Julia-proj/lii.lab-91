'use client'

import { X } from "lucide-react"
import Image from "next/image"

interface ReviewsLightboxProps {
  src: string
  onClose: () => void
}

export function ReviewsLightbox({ src, onClose }: ReviewsLightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        aria-label="Cerrar"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="relative w-full max-w-lg max-h-[80vh] aspect-auto">
        <Image
          src={src}
          alt="Detalle del trabajo"
          fill
          className="object-contain rounded-lg"
          sizes="(max-width: 768px) 95vw, 512px"
        />
      </div>
    </div>
  )
}
