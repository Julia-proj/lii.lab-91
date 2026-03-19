export function Gallery() {
  const photos = [
    "/images/Foto5.JPG",
    "/images/Foto4.JPG",
    "/images/Foto6.jpg",
    "/images/Foto3.jpg",
  ]

  return (
    <section className="grid grid-cols-2 md:grid-cols-4">
      {photos.map((src, idx) => (
        <div key={idx} className="overflow-hidden aspect-[4/3]">
          <img
            src={src}
            alt={`Lii.lab trabajo ${idx + 1}`}
            className="w-full h-full object-cover object-top"
          />
        </div>
      ))}
    </section>
  )
}
