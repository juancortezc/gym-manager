'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm border border-gray-100">
        <div className="text-center mb-6">
          <div className="w-16 h-16 luxury-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">GM</span>
          </div>
          <h1 className="text-2xl font-semibold luxury-text-gradient mb-1">
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
                    ? 'luxury-gradient border-[var(--luxury-gold)]'
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
            className="h-12 luxury-gradient hover:opacity-90 text-white rounded-lg transition-all duration-150 disabled:opacity-50 flex items-center justify-center text-sm font-medium"
          >
            {loading ? '...' : '✓'}
          </button>
        </div>
      </div>
    </div>
  )
}