"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

export function CourseDatesPreview() {
  const [dates, setDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/course-availability?weeks=12")
      .then((r) => r.json())
      .then((d) => setDates(d.availableStartDates?.slice(0, 3) || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const formatDate = (str: string) =>
    new Date(str + "T00:00:00").toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })

  const getEndDate = (str: string) => {
    const d = new Date(str + "T00:00:00")
    let count = 0
    while (count < 2) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0 && d.getDay() !== 6) count++
    }
    return d.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  }

  return (
    <div className="mt-6 pt-5 border-t border-neutral-200/60">
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
        <Calendar size={12} />
        Próximas fechas disponibles
      </p>

      {loading ? (
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-24 rounded-lg bg-neutral-100 animate-pulse" />
          ))}
        </div>
      ) : dates.length === 0 ? (
        <p className="text-sm text-neutral-400">Consultar disponibilidad</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {dates.map((d) => (
            <Link
              key={d}
              href="/booking/course"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-[#CDB4DB]/15 text-[#7B4FAC] border border-[#CDB4DB]/30 hover:bg-[#CDB4DB]/25 transition-colors whitespace-nowrap"
            >
              {formatDate(d)} – {getEndDate(d)}
            </Link>
          ))}
          <Link
            href="/booking/course"
            className="text-xs font-medium px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 transition-colors flex items-center gap-1"
          >
            Ver más <ArrowRight size={11} />
          </Link>
        </div>
      )}
    </div>
  )
}
