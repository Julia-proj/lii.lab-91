'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signIn } from 'next-auth/react'
import { inlineLoginSchema, type InlineLoginInput } from '@/shared/validators'

interface InlineLoginFormProps {
  onSuccess: () => void
}

export function InlineLoginForm({ onSuccess }: InlineLoginFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InlineLoginInput>({
    resolver: zodResolver(inlineLoginSchema),
  })

  const onSubmit = async (data: InlineLoginInput) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (result?.error) {
        setError('root', { message: 'Email o contraseña incorrectos' })
      } else {
        onSuccess()
      }
    } catch {
      setError('root', { message: 'Error de conexión' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <input
          type="password"
          placeholder="Contraseña"
          {...register('password')}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lavender focus:border-transparent"
        />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>
      {errors.root && <p className="text-xs text-red-500">{errors.root.message}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-plum hover:bg-plum-hover text-white font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60 text-sm shadow-sm"
      >
        {isSubmitting ? 'Entrando...' : 'Iniciar sesión'}
      </button>
    </form>
  )
}
