/**
 * CONFIGURACION EDGE-COMPATIBLE DE AUTH.JS (next-auth v5)
 *
 * Este archivo contiene la configuracion MINIMA de autenticacion que puede
 * ejecutarse en el Edge Runtime (middleware de Next.js).
 *
 * IMPORTANTE: No importar Mongoose, bcrypt ni ningun modulo de Node.js aqui,
 * ya que el Edge Runtime no los soporta. Los providers reales y la logica
 * de base de datos se configuran en auth.ts (que corre en Node.js).
 *
 * Los callbacks jwt/session DEBEN estar aqui para que el middleware pueda
 * decodificar el JWT y leer el `role` del usuario (necesario para proteger
 * las rutas /admin).
 */
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  // Redirigir a /login cuando se necesita autenticacion
  pages: {
    signIn: '/login',
  },
  // Usamos JWT (no sesiones en BD) para que funcione en edge y serverless
  session: { strategy: 'jwt' as const },
  // Providers vacios aqui — se definen en auth.ts (que tiene acceso a Mongoose/bcrypt)
  providers: [],
  callbacks: {
    /**
     * Callback JWT: se ejecuta cada vez que se crea o actualiza el token.
     * Cuando el usuario inicia sesion por primera vez (`user` existe),
     * guardamos su rol e ID en el token para tenerlos disponibles despues.
     */
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'user'
        token.id = user.id
      }
      return token
    },
    /**
     * Callback Session: traduce los datos del token JWT a la sesion del cliente.
     * Asi, en cualquier componente podemos hacer `session.user.role` y `session.user.id`.
     */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as 'user' | 'admin') || 'user'
      }
      return session
    },
  },
} satisfies NextAuthConfig
