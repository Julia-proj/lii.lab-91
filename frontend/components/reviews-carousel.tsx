"use client"

import { useMemo, useState, useCallback, useRef } from "react"
import { Star, ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { reviews } from "@/components/data/reviews"
import useEmblaCarousel from "embla-carousel-react"
import AutoScroll from "embla-carousel-auto-scroll"

export const ReviewsCarousel = () => {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  // Настройка Embla - бесконечная прокрутка (AutoScroll) с возможностью остановить пальцем/свайпом
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        stopOnInteraction: false, // Продолжать после взаимодействия
        stopOnMouseEnter: false,  // НЕ останавливать наведение мышью (запрос UX)
        speed: 0.8, // Плавность как было
      }) as any // Исправление ошибки типов Embla plugin
    ]
  )

  const pointerDown = useRef(false)
  const dragged = useRef(false)

  const onPointerDown = useCallback(() => {
    pointerDown.current = true
    dragged.current = false
  }, [])

  const onPointerMove = useCallback(() => {
    if (pointerDown.current) dragged.current = true
  }, [])

  const onPointerUp = useCallback(() => {
    pointerDown.current = false
  }, [])

  const openLightbox = useCallback((src: string) => {
    if (dragged.current) return
    setLightboxSrc(src)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxSrc(null)
  }, [])

  // Для эффекта бесконечного скролла нам нужно продублировать массив
  const duplicatedReviews = useMemo(() => [...reviews, ...reviews, ...reviews], [])

  const handlePrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev()
      // Перезапускаем автоскролл после ручного клика, если он остановился
      const autoScroll = emblaApi.plugins().autoScroll as any
      if (autoScroll) autoScroll.play()
    }
  }

  const handleNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext()
      const autoScroll = emblaApi.plugins().autoScroll as any
      if (autoScroll) autoScroll.play()
    }
  }

  return (
    <section id="opiniones" className="pt-16 pb-8 md:pt-32 md:pb-16 bg-stone-50 overflow-hidden select-none group">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-900 mb-3 tracking-tight">
            Opiniones
          </h2>
          <div className="w-16 h-[2px] mx-auto bg-gold mb-6" />
          <p className="text-lg text-stone-500 max-w-2xl mx-auto font-light">
            Lo que dicen mis clientas.
          </p>
        </div>
      </div>

      {/* Контейнер карусели */}
      <div className="relative w-full max-w-[1800px] mx-auto">
        <div className="relative w-full mask-fade-edges pb-10" ref={emblaRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          <div className="flex touch-pan-y items-stretch">
            {duplicatedReviews.map((review, idx) => (
              <div 
                key={`${review.id}-${idx}`}
                // Карточка отзыва: адаптивно под все экраны
                className="w-[85vw] max-w-[320px] sm:max-w-none sm:w-[380px] md:w-[420px] mx-3 sm:mx-4 p-5 sm:p-6 bg-white border border-black/[0.04] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300 flex-shrink-0 flex flex-col h-auto cursor-grab active:cursor-grabbing"
              >
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
                    // Booksy gold/yellow color
                    className={`w-4 h-4 ${i < review.rating ? "fill-[#F5A623] text-[#F5A623]" : "fill-[#E5E5E5] text-[#E5E5E5]"}`} 
                  />
                ))}
              </div>

              {review.service && (
                <p className="text-[13px] font-medium text-stone-500 mb-2">
                  {review.service}
                </p>
              )}
              
              <p className="text-[#333333] text-[15px] leading-relaxed mb-5 font-normal flex-grow line-clamp-6">
                "{review.text}"
              </p>

              {review.attachedImages && review.attachedImages.length > 0 && (
                <div className="mt-auto mb-5 flex flex-wrap gap-2">
                  {review.attachedImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); openLightbox(img); }}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200/60 bg-stone-50 shrink-0 cursor-zoom-in hover:scale-105 hover:shadow-md transition-all duration-200"
                    >
                      <Image 
                        src={img} 
                        alt="Trabajo realizado en Lii Lab" 
                        fill
                        className="object-cover"
                      />
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
                  <span className="text-[11px] font-medium text-stone-500">Verificado en booksy</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Элементы управления (показываются при наведении на десктопе) */}
      <button 
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 lg:left-12 top-[60%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 shadow-md items-center justify-center text-stone-500 hover:text-stone-900 hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Anterior opinión"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button 
        onClick={handleNext}
        className="hidden md:flex absolute right-4 lg:right-12 top-[60%] -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 shadow-md items-center justify-center text-stone-500 hover:text-stone-900 hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300"
        aria-label="Siguiente opinión"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
      
      {/* Стили для маски и анимации (лучше вынести в globals.css) */}
      <style jsx global>{`
        .mask-fade-edges {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.3333%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .pause {
          animation-play-state: paused !important;
        }
      `}</style>

      {/* Lightbox modal */}
      {lightboxSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative w-full max-w-lg max-h-[80vh] aspect-auto">
            <Image
              src={lightboxSrc}
              alt="Detalle del trabajo"
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 95vw, 512px"
            />
          </div>
        </div>
      )}
    </section>
  )
}
