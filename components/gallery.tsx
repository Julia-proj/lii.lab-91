import Image from "next/image"

export default function Gallery() {
  const images = [
    {
      src: "/Foto5.JPG",
      alt: "Guía metodológica",
    },
    {
      src: "/Foto4.JPG",
      alt: "Nail polish product",
    },
    {
      src: "/Foto6.jpg",
      alt: "Perfect manicure nails",
    },
    {
      src: "/Foto3.jpg",
      alt: "Manicure tools",
    },
  ]

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-mono text-sm tracking-widest text-zinc-500 uppercase">Galería</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
