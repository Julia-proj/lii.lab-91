import { BookingWizard } from '@/components/booking/booking-wizard'

export default function BookingPage() {
  return (
    <>
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl text-neutral-900 mb-2">Reservar cita</h1>
        <p className="text-neutral-400 text-sm sm:text-base max-w-sm mx-auto">
          Reserva tu cita en Lii.lab en unos sencillos pasos
        </p>
      </div>
      <BookingWizard />
    </>
  )
}
