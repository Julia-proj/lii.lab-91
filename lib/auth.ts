import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import { dbConnect } from './db'
import User from '@/models/User'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        await dbConnect()
        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.password) return null

        const valid = await user.comparePassword(credentials.password as string)
        if (!valid) return null

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign-in, populate token with user data
      if (user) {
        token.role = user.role || 'user'
        token.id = user.id
      }

      // Re-read role from DB on every token refresh to prevent stale admin roles
      if (!user && !account && token.id) {
        try {
          await dbConnect()
          const dbUser = await User.findById(token.id).select('role').lean()
          if (dbUser) {
            token.role = (dbUser as { role?: string }).role || 'user'
          }
        } catch {
          // If DB read fails, keep existing token role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = (token.role as 'user' | 'admin') || 'user'
      }
      return session
    },
  },
})
