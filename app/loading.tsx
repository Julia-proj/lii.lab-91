export default function Loading() {
  return (
    <div className="min-h-screen bg-warm-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 rounded-full border-2 border-neutral-200 border-t-[#6B4E7D] animate-spin" />
        <p className="text-xs tracking-[0.2em] uppercase text-neutral-400">Lii.lab</p>
      </div>
    </div>
  )
}
