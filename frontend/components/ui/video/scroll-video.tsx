'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Play, Pause } from 'lucide-react'

interface ScrollVideoProps {
  src: string
  poster?: string
  className?: string
}

export function ScrollVideo({ src, poster, className = '' }: ScrollVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const userPausedRef = useRef(false)

  const playVideo = useCallback(() => {
    if (videoRef.current) {
      const promise = videoRef.current.play()
      if (promise !== undefined) {
        promise.then(() => setIsPlaying(true)).catch((err) => {
          // Autoplay blocked on mobile/safari etc
          setIsPlaying(false)
        })
      }
    }
  }, [])

  const pauseVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          pauseVideo()
        } else if (!userPausedRef.current) {
          playVideo()
        }
      },
      { threshold: 0.3 }
    )
    
    observer.observe(el)
    return () => observer.disconnect()
  }, [playVideo, pauseVideo])

  const togglePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPlaying) {
      userPausedRef.current = true
      pauseVideo()
    } else {
      userPausedRef.current = false
      playVideo()
    }
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden group/video cursor-pointer ${className}`}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop
        muted
        playsInline
        preload="metadata"
        className="w-full aspect-[3/2] object-cover bg-neutral-100 dark:bg-neutral-900"
      />
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          isPlaying ? "opacity-0 md:group-hover/video:opacity-100" : "opacity-100"
        }`}
      >
        <div className={`absolute inset-0 transition-colors ${isPlaying ? "" : "bg-black/20"}`} />
        <div className={`relative w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transform transition-transform duration-200 ${!isPlaying ? "scale-100" : "scale-90"}`}>
          {isPlaying ? (
            <Pause className="w-5 h-5 text-neutral-900" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5 text-neutral-900 ml-0.5" fill="currentColor" />
          )}
        </div>
      </div>
    </div>
  )
}

