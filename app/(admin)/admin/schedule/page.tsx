'use client'

import { useState } from 'react'
import { CalendarOff, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/format'
import { ScheduleWeekEditor } from '@/components/admin/schedule-week-editor'
import { ScheduleCalendar } from '@/components/admin/schedule-calendar'
import { ScheduleDayDetail } from '@/components/admin/schedule-day-detail'
import { useAdminSchedule } from '@/hooks/use-admin-schedule'

export default function AdminSchedulePage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear]   = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const {
    blockedDates, blockedHours, bookings, loading, weekSchedule, addingDate, addingHour,
    setWeekSchedule, handleBlockDate, handleUnblockDate, handleBlockHour, handleUnblockHour,
  } = useAdminSchedule()

  const blockedDateSet = new Set(blockedDates.map((d) => d.date))

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1) }
    else setCurrentMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1) }
    else setCurrentMonth((m) => m + 1)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-plum rounded-full animate-spin mx-auto" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-2xl text-neutral-900 dark:text-neutral-100">Horario</h1>
        <p className="text-xs text-neutral-400 mt-0.5">Gestiona disponibilidad y bloqueos</p>
      </div>

      <ScheduleWeekEditor weekSchedule={weekSchedule} onSave={setWeekSchedule} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ScheduleCalendar
          currentMonth={currentMonth}
          currentYear={currentYear}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          blockedDateSet={blockedDateSet}
          getBookingsCount={(d) => bookings.filter((b) => b.date === d && b.status !== 'cancelada').length}
          getBlockedHoursCount={(d) => blockedHours.filter((bh) => bh.date === d).length}
        />
        <div className="space-y-4">
          <ScheduleDayDetail
            selectedDate={selectedDate}
            blockedDates={blockedDates}
            blockedHours={blockedHours}
            bookings={bookings}
            onBlockDate={handleBlockDate}
            onUnblockDate={handleUnblockDate}
            onBlockHour={handleBlockHour}
            onUnblockHour={handleUnblockHour}
            addingDate={addingDate}
            addingHour={addingHour}
          />
        </div>
      </div>

      {blockedDates.length > 0 && (
        <div className="bg-white dark:bg-card rounded-2xl border border-neutral-100 dark:border-white/8 p-4">
          <h2 className="font-medium mb-3 text-sm flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
            <CalendarOff className="w-4 h-4 text-red-400" />
            Todas las fechas bloqueadas
          </h2>
          <div className="space-y-1.5">
            {blockedDates.map((d) => (
              <div key={d._id} className="flex items-center justify-between py-1.5 border-b border-neutral-50 dark:border-white/5 last:border-0">
                <div>
                  <span className="text-sm font-medium capitalize text-neutral-800 dark:text-neutral-200">{formatDate(d.date)}</span>
                  {d.reason && <span className="text-xs text-neutral-400 ml-2">{d.reason}</span>}
                </div>
                <button onClick={() => handleUnblockDate(d._id)} className="text-neutral-400 hover:text-red-500 p-1 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
