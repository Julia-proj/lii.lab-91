import Image from "next/image"

export function Gallery() {
  const photos = [
    "/images/Foto5.JPG",
    "/images/Foto4.JPG",
    "/images/Foto6.jpg",
    "/images/Foto3.jpg",
  ]

  return (
    <section className="bg-[#FAFAF8] py-24">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {photos.map((src) => (
            <div key={src} className="overflow-hidden rounded-2xl aspect-[3/4] relative ring-1 ring-black/5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-400 ease-out group">       
              <Image
                src={src}
                alt={`Lii.lab trabajo`}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                loading="lazy"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
