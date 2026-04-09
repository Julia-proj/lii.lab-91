'use client'

import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { registerSchema, type RegisterInput } from '@/shared/validators'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setError('root', { message: json.error || 'Error al crear la cuenta' })
        return
      }

      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (signInRes?.error) {
        router.push('/login')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('root', { message: 'Error al crear la cuenta' })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
      <h1 className="font-serif text-2xl text-center mb-6">Crear cuenta</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {errors.root.message}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
            placeholder="Tu nombre"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
            placeholder="tu@email.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
            placeholder="+34 600 000 000"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
            placeholder="Mínimo 6 caracteres"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirmar contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
            placeholder="Repite tu contraseña"
          />
          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60 shadow-sm hover:shadow-md"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        ¿Ya tienes cuenta?{' '}
        <Link href="/login" className="text-plum hover:text-plum-hover hover:underline font-medium">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-lavender border-t-transparent rounded-full" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
