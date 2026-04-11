import Image from "next/image"
import { useState } from "react"

interface AtmosphericSlide {
  src: string
  bgClass: string
  pos: string
  mobilePos: string
  mobileScale: number
  scale: number
}

interface HeroSlideProps {
  slide: AtmosphericSlide
  index: number
  active: boolean
}

export function HeroSlide({ slide, index, active }: HeroSlideProps) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <div
      className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Mobile: full-screen cover */}
      <Image
        src={slide.src}
        alt="Lii.lab"
        fill
        loading="lazy"
        sizes="100vw"
        onLoad={() => setImgLoaded(true)}
        className={`md:hidden object-cover transition-all duration-1000 ease-out ${
          imgLoaded ? "blur-0 opacity-100" : "blur-md opacity-0"
        }`}
        style={{
          objectPosition: slide.mobilePos,
          transform: `scale(${slide.mobileScale})`,
          transformOrigin: slide.mobilePos,
        }}
      />

      {/* Desktop: editorial right panel */}
      <div
        className="hidden md:block absolute right-0 top-0 h-full w-[72%]"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 22%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 22%)",
        }}
      >
        <Image
          src={slide.src}
          alt="Lii.lab"
          fill
          loading="lazy"
          sizes="72vw"
          onLoad={() => setImgLoaded(true)}
          className={`object-cover transition-all duration-1000 ease-out ${
            imgLoaded ? "blur-0 opacity-100" : "blur-md opacity-0"
          }`}
          style={{ objectPosition: slide.pos, transform: `scale(${slide.scale})` }}
        />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />
      </div>

      {/* Mobile overlay */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
    </div>
  )
}
