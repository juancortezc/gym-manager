'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { signIn } from 'next-auth/react' // Disabled until OAuth is configured
// import GoogleOneTap from './GoogleOneTap' // Hidden until OAuth configuration is complete

export default function PinLogin() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit)
      setError('')
    }
  }

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1))
    setError('')
  }

  const handleSubmit = async () => {
    if (pin.length !== 4) return

    setLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        setError('PIN incorrecto')
        setPin('')
      }
    } catch (error) {
      setError('Error de conexión')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('Google Sign-In no está configurado. Contacta al administrador para configurar las credenciales de OAuth.')
  }

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* <GoogleOneTap /> Hidden until OAuth configuration is complete */}
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">GM</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Gym Manager
          </h1>
          <p className="text-sm text-gray-500">Ingresa tu PIN para acceder</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-200 ${
                  pin.length > index
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-center text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-5">
          {digits.map((digit) => (
            <button
              key={digit}
              onClick={() => handlePinInput(digit)}
              disabled={loading}
              className="h-12 text-lg font-medium bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-lg transition-all duration-150 disabled:opacity-50 border border-gray-200 hover:border-gray-300"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            disabled={loading || pin.length === 0}
            className="h-12 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg transition-all duration-150 disabled:opacity-50 flex items-center justify-center border border-red-200 hover:border-red-300"
          >
            ⌫
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || pin.length !== 4}
            className="h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-150 disabled:opacity-50 flex items-center justify-center text-sm font-medium"
          >
            {loading ? '...' : '✓'}
          </button>
        </div>

        {/* Google Sign-In hidden until OAuth configuration is complete
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">o continúa con</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? 'Iniciando sesión...' : 'Continuar con Google'}
        </button>
        */}
      </div>
    </div>
  )
}