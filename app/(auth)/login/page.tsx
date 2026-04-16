'use client'

import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { loginSchema, type LoginInput } from '@/shared/validators'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'

function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (res?.error) {
        setError('root', { message: 'Email o contraseña incorrectos' })
      } else {
        const session = await getSession()
        if (session?.user?.role === 'admin') {
          router.push('/admin')
        } else {
          router.push('/dashboard')
        }
        router.refresh()
      }
    } catch {
      setError('root', { message: 'Error al iniciar sesión' })
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-6 sm:p-8">
      <h1 className="font-serif text-2xl text-center mb-6">Iniciar sesión</h1>

      {/* Google OAuth */}
      <GoogleSignInButton callbackUrl="/dashboard" />

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-neutral-200" />
        <span className="text-xs text-neutral-400 font-medium tracking-wide">o</span>
        <div className="flex-1 h-px bg-neutral-200" />
      </div>

      {/* Credentials form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {errors.root.message}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-plum focus:border-transparent"
            placeholder="tu@email.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
              Contraseña
            </label>
            <Link href="/forgot-password" className="text-xs text-neutral-400 hover:text-plum transition-colors">
              ¿La olvidaste?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-plum focus:border-transparent"
            placeholder="••••••"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="text-center text-sm text-neutral-500 mt-6">
        ¿No tienes cuenta?{' '}
        <Link href="/register" className="text-plum hover:text-plum-hover hover:underline font-medium">
          Regístrate
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8 text-center">
        <div className="w-6 h-6 border-2 border-neutral-200 border-t-plum rounded-full animate-spin mx-auto" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
