import { Shield, Zap, Sparkles, Layers, Brush, ClipboardList, Euro, Clock, Package, GraduationCap } from "lucide-react"

export function Course() {
  const learningItems = [
    { icon: <Shield size={24} />, title: "Esterilización y desinfección" },
    { icon: <Zap size={24} />, title: "Manicura combinada (torno + alicate/tijera)" },
    { icon: <Sparkles size={24} />, title: "Decoración de tendencia" },
    { icon: <Layers size={24} />, title: "Nivelación" },
    { icon: <Brush size={24} />, title: "Introducción al trabajo con gel" },
    { icon: <ClipboardList size={24} />, title: "Organización del puesto de trabajo" },
  ]

  const galleryImages = [
    "/nails-art-close-up.jpg",
    "/manicure-process-salon.jpg",
    "/nail-polish-bottles.png",
    "/woman-manicure.jpg",
  ]

  return (
    <section id="cursos" className="py-20 md:py-32 bg-[#fffafa]">
      <div className="container mx-auto px-4 md:px-6">
        {/* 3.1 Intro */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24 fade-in-section">
          <div className="order-2 md:order-1">
            <span className="text-[#F4B4C7] font-bold tracking-wider text-xs uppercase mb-2 block">
              Curso de Iniciación
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Curso Manic 0.0 <br /> Iniciación en manicura
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              ¿Siempre has querido aprender manicura desde cero? Este curso es tu oportunidad perfecta. Te enseñaremos
              todo lo necesario para iniciar tu camino profesional.
            </p>
          </div>
          <div className="order-1 md:order-2 h-full min-h-[400px]">
            <img
              src="/manicure-tools-aesthetic.jpg"
              alt="Curso manicura"
              className="w-full h-full object-cover rounded-sm shadow-lg"
            />
          </div>
        </div>

        {/* 3.2 Learning Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24 fade-in-section">
          {learningItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-sm"
            >
              <div className="text-[#F4B4C7]">{item.icon}</div>
              <h3 className="font-medium text-gray-800">{item.title}</h3>
            </div>
          ))}
        </div>

        {/* 3.3 Info Card & Program */}
        <div className="grid lg:grid-cols-12 gap-12 mb-24 fade-in-section">
          {/* Info Card */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-sm shadow-lg border-t-4 border-[#F4B4C7] sticky top-24">
              <h3 className="text-2xl font-serif font-bold mb-6 text-gray-900">Información del curso</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="text-gray-400 mt-1">
                    <Euro size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">Precio</span>
                    <span className="text-gray-600">800€</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-gray-400 mt-1">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">Duración</span>
                    <span className="text-gray-600">3 días de formación intensiva</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-gray-400 mt-1">
                    <Package size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">Práctica</span>
                    <span className="text-gray-600">Trabajo con modelos reales cada día</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="text-gray-400 mt-1">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900">Incluye</span>
                    <span className="text-gray-600">Kit de herramientas básicas y el libro “Guía Metodológica”</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Program */}
          <div className="lg:col-span-7 space-y-12">
            <h3 className="text-3xl font-serif font-bold text-gray-900 border-b border-gray-200 pb-4">
              Programa del curso
            </h3>

            <div className="space-y-8">
              {[
                {
                  day: "Día 1",
                  schedule: [
                    "11:00 – 14:00 → Teoría",
                    "14:00 – 15:00 → Pausa para comer",
                    "15:00 – hasta terminar → Demostración + práctica en una mano de la alumna (manicura, nivelación, etc.)",
                  ],
                },
                {
                  day: "Día 2",
                  schedule: [
                    "10:00 – 14:00 → Trabajo con una modelo",
                    "14:00 – 15:00 → Pausa",
                    "15:00 – hasta terminar → Trabajo con otra modelo diferente",
                  ],
                },
                {
                  day: "Día 3",
                  schedule: [
                    "10:00 – hasta terminar → Trabajo con una modelo",
                    "Al finalizar → Entrega de diploma, ayuda personalizada con tu Instagram profesional y creación de tu lista de compra de imprescindibles.",
                  ],
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-sm border border-gray-100">
                  <h4 className="text-xl font-bold text-[#F4B4C7] mb-4 font-serif">{item.day}</h4>
                  <ul className="space-y-2">
                    {item.schedule.map((line, i) => (
                      <li key={i} className="flex gap-2 text-gray-700">
                        <span className="text-[#F4B4C7] mt-1.5 h-1.5 w-1.5 rounded-full bg-[#F4B4C7] shrink-0 block" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3.4 Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-section">
          {galleryImages.map((src, idx) => (
            <div
              key={idx}
              className="aspect-square overflow-hidden rounded-sm shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={src || "/placeholder.svg"}
                alt={`Galería ${idx}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
