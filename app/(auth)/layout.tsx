export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="font-serif text-3xl tracking-wide text-neutral-900">
            Lii.lab
          </a>
        </div>
        {children}
      </div>
    </div>
  )
}
