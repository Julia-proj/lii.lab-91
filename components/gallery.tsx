export function Gallery() {
  const photos = [
    "/images/Foto5.JPG",
    "/images/Foto4.JPG",
    "/images/Foto6.jpg",
    "/images/Foto3.jpg",
  ]

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#dedad6]">
      {photos.map((src, idx) => (
        <div key={idx} className="overflow-hidden bg-[#f7f5f2]">
          <img
            src={src}
            alt={`Lii.lab trabajo ${idx + 1}`}
            className="w-full h-auto block"
          />
        </div>
      ))}
    </section>
  )
}
