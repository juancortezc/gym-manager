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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏋️‍♂️ Gym Manager
          </h1>
          <p className="text-gray-600">Ingresa tu PIN para continuar</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex space-x-3">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full border-2 ${
                  pin.length > index
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mb-6">
          {digits.map((digit) => (
            <button
              key={digit}
              onClick={() => handlePinInput(digit)}
              disabled={loading}
              className="h-16 text-xl font-semibold bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            disabled={loading || pin.length === 0}
            className="h-16 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            ⌫
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || pin.length !== 4}
            className="h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? '...' : '✓'}
          </button>
        </div>
      </div>
    </div>
  )
}