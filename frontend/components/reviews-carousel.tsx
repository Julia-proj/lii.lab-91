"use client"

import { useMemo, useState, useCallback, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { reviews } from "../lib/reviews"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"
import { ReviewCard } from "./review-card"
import { ReviewsLightbox } from "./reviews-lightbox"

export const ReviewsCarousel = () => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
        speed: 0.8,
      })
    ]
  )

  const pointerDown = useRef(false)
  const dragged = useRef(false)

  const onPointerDown = useCallback(() => { pointerDown.current = true; dragged.current = false }, [])
  const onPointerMove = useCallback(() => { if (pointerDown.current) dragged.current = true }, [])
  const onPointerUp   = useCallback(() => { pointerDown.current = false }, [])

  const openLightbox  = useCallback((src: string) => setLightboxSrc(src), [])
  const closeLightbox = useCallback(() => setLightboxSrc(null), [])

  const duplicatedReviews = useMemo(() => [...reviews, ...reviews, ...reviews], [])

  const scrollAndResume = (dir: 'prev' | 'next') => {
    if (!emblaApi) return
    dir === 'prev' ? emblaApi.scrollPrev() : emblaApi.scrollNext()
    const autoScroll = emblaApi.plugins().autoScroll
    if (autoScroll) autoScroll.play()
  }

  return (
    <section id="opiniones" className="pt-16 pb-8 md:pt-32 md:pb-16 bg-stone-50 overflow-hidden select-none group">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-3 tracking-tight">Opiniones</h2>
          <div className="w-16 h-[2px] mx-auto bg-gold mb-6" />
          <p className="text-lg text-stone-500 max-w-2xl mx-auto font-light">Lo que dicen mis clientas.</p>
        </div>
      </div>

      <div className="relative w-full max-w-[1800px] mx-auto">
        <div
          className="relative w-full mask-fade-edges pb-10"
          ref={emblaRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="flex touch-pan-y items-stretch">
            {duplicatedReviews.map((review, idx) => (
              <ReviewCard
                key={`${review.id}-${idx}`}
                review={review}
                onImageClick={openLightbox}
              />
            ))}
          </div>
        </div>

        <button
          onClick={() => scrollAndResume('prev')}
          className="hidden md:flex absolute left-4 lg:left-12 top-[60%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 shadow-md items-center justify-center text-stone-500 hover:text-stone-900 hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"
          aria-label="Anterior opinión"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scrollAndResume('next')}
          className="hidden md:flex absolute right-4 lg:right-12 top-[60%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 shadow-md items-center justify-center text-stone-500 hover:text-stone-900 hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"
          aria-label="Siguiente opinión"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <style jsx global>{`
        .mask-fade-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>

      {lightboxSrc && <ReviewsLightbox src={lightboxSrc} onClose={closeLightbox} />}
    </section>
  )
}
