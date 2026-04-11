'use client'

import { Star } from "lucide-react"
import Image from "next/image"

interface Review {
  id: number
  name: string
  date: string
  rating: number
  service?: string
  text: string
  attachedImages?: string[]
}

interface ReviewCardProps {
  review: Review
  onImageClick: (src: string) => void
}

export function ReviewCard({ review, onImageClick }: ReviewCardProps) {
  return (
    <div className="w-[85vw] max-w-[320px] sm:max-w-none sm:w-[380px] md:w-[420px] mx-3 sm:mx-4 p-5 sm:p-6 bg-white border border-black/[0.04] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300 flex-shrink-0 flex flex-col h-auto cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-stone-900 flex items-center justify-center text-white font-medium text-lg">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-stone-900 text-[16px] leading-tight">{review.name}</p>
            <p className="text-[13px] text-stone-500 mt-0.5">{review.date}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < review.rating ? "fill-gold text-gold" : "fill-neutral-200 text-neutral-200"}`}
          />
        ))}
      </div>

      {review.service && (
        <p className="text-[13px] font-medium text-stone-500 mb-2">{review.service}</p>
      )}

      <p className="text-neutral-800 text-[15px] leading-relaxed mb-5 font-normal flex-grow line-clamp-6">
        &ldquo;{review.text}&rdquo;
      </p>

      {review.attachedImages && review.attachedImages.length > 0 && (
        <div className="mt-auto mb-5 flex flex-wrap gap-2">
          {review.attachedImages.map((img, i) => (
            <button
              key={i}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onImageClick(img) }}
              className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200/60 bg-stone-50 shrink-0 cursor-zoom-in hover:scale-105 hover:shadow-md transition-all duration-200"
            >
              <Image src={img} alt="Trabajo realizado en Lii Lab" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto border-t border-stone-50 pt-4 flex items-center bg-transparent">
        <div className="flex items-center gap-1.5 opacity-60 grayscale hover:grayscale-0 transition-opacity duration-300">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#111111" fillOpacity="0.05"/>
            <path d="M16.5 8L10.5 14L8 11.5" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs font-medium text-stone-500">Verificado en booksy</span>
        </div>
      </div>
    </div>
  )
}
