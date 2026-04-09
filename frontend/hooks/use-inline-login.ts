'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'

export function useInlineLogin(onSuccess: () => void) {
  const [showAuth, setShowAuth]           = useState(false)
  const [loginEmail, setLoginEmail]       = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError]       = useState('')
  const [loginLoading, setLoginLoading]   = useState(false)
  const [loginSucceeded, setLoginSucceeded] = useState(false)

  const openAuth = () => {
    setShowAuth(true)
    setLoginEmail('')
    setLoginPassword('')
    setLoginError('')
  }

  const closeAuth = () => setShowAuth(false)

  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    try {
      const result = await signIn('credentials', { email: loginEmail, password: loginPassword, redirect: false })
      if (result?.error) setLoginError('Email o contrasena incorrectos')
      else { setLoginSucceeded(true); onSuccess() }
    } catch {
      setLoginError('Error de conexion')
    } finally {
      setLoginLoading(false)
    }
  }

  return {
    showAuth, loginEmail, loginPassword, loginError, loginLoading, loginSucceeded,
    setLoginEmail: setLoginEmail,
    setLoginPassword: setLoginPassword,
    openAuth, closeAuth, handleInlineLogin, setLoginSucceeded,
  }
}
