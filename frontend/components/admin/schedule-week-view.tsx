import type { WeekSchedule } from '@/types'

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']

interface ScheduleWeekViewProps {
  weekSchedule: WeekSchedule
}

export function ScheduleWeekView({ weekSchedule }: ScheduleWeekViewProps) {
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center text-xs min-w-[320px]">
        {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
          const day = weekSchedule[dow]
          return (
            <div key={dow} className={`rounded-xl px-1.5 py-2.5 border ${
              day?.open
                ? 'bg-white dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30'
                : 'bg-white dark:bg-white/4 border-neutral-100 dark:border-white/6'
            }`}>
              <p className={`font-bold text-[11px] mb-1 ${day?.open ? 'text-neutral-700 dark:text-neutral-300' : 'text-neutral-300 dark:text-neutral-600'}`}>
                {DAY_NAMES[dow]}
              </p>
              {day?.open ? (
                day.blocks.map((b, i) => (
                  <p key={i} className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium leading-tight">{b.start}<br />{b.end}</p>
                ))
              ) : (
                <p className="text-[10px] text-neutral-200 dark:text-neutral-700 font-medium">—</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
