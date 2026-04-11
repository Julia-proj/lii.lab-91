import Image from "next/image"

export function Gallery() {
  const photos = [
    "/images/Foto5.JPG",
    "/images/Foto4.JPG",
    "/images/Foto6.jpg",
    "/images/Foto3.jpg",
  ]

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-neutral-200">
      {photos.map((src) => (
        <div key={src} className="overflow-hidden aspect-[3/4] relative">
          <Image
            src={src}
            alt={`Lii.lab trabajo`}
            fill
            sizes="(min-width: 768px) 25vw, 50vw"
            loading="lazy"
            className="object-cover object-center"
          />
        </div>
      ))}
    </section>
  )
}
