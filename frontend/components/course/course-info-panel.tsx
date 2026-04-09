import { Euro, MapPin } from 'lucide-react'

interface ScheduleDay {
  label: string
  time: string
  desc: string
}

interface CourseInfoPanelProps {
  schedule: ScheduleDay[]
  price: string
}

export function CourseInfoPanel({ schedule, price }: CourseInfoPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
      <h3 className="font-medium mb-3">Programa del curso</h3>
      <div className="space-y-3">
        {schedule.map((day, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className="bg-lavender/20 text-plum px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">{day.label}</span>
            <div>
              <p className="text-neutral-700">{day.desc}</p>
              <p className="text-neutral-500 text-xs">{day.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-wrap gap-4 text-sm text-neutral-500">
        <span className="flex items-center gap-1.5"><Euro className="w-4 h-4 text-lavender" /> {price} · Pago en el salón</span>
        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-lavender" /> Valdemoro, Madrid</span>
      </div>
    </div>
  )
}
