import { BookingWizard } from '@/components/booking/booking-wizard'

export default function BookingPage() {
  return (
    <>
      <h1 className="font-serif text-3xl text-center mb-2">Reservar cita</h1>
      <p className="text-neutral-500 text-center mb-8">
        Reserva tu cita en Lii.lab en unos sencillos pasos
      </p>
      <BookingWizard />
    </>
  )
}
