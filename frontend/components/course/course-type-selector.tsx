'use client'

import { BookOpen, Zap } from 'lucide-react'

type CourseType = 'manic-0.0' | 'perfeccionamiento'

interface CourseConfig {
  label: string
  price: string
  days: number
}

const COURSE_CONFIG: Record<CourseType, CourseConfig> = {
  'manic-0.0':       { label: 'MANIC 0.0',       price: '749,99€', days: 3 },
  'perfeccionamiento': { label: 'Perfeccionamiento', price: '349,99€', days: 1 },
}

interface CourseTypeSelectorProps {
  courseType: CourseType
  onChange: (type: CourseType) => void
}

export function CourseTypeSelector({ courseType, onChange }: CourseTypeSelectorProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6">
      <h3 className="font-medium text-sm text-neutral-500 mb-3 uppercase tracking-wide">Selecciona el curso</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(COURSE_CONFIG) as CourseType[]).map((type) => {
          const c = COURSE_CONFIG[type]
          const isSelected = courseType === type
          return (
            <button
              key={type}
              onClick={() => onChange(type)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-lavender bg-lavender/5'
                  : 'border-neutral-200 hover:border-lavender/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {type === 'perfeccionamiento'
                  ? <Zap className="w-4 h-4 text-neutral-600 shrink-0" />
                  : <BookOpen className="w-4 h-4 text-lavender shrink-0" />
                }
                <p className="font-semibold text-sm text-neutral-900">{c.label}</p>
              </div>
              <p className="text-xs text-neutral-500">{c.days} día{c.days > 1 ? 's' : ''} · {c.price}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
