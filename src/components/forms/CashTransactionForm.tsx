'use client'

import { useState } from 'react'

interface CashTransactionFormProps {
  onSuccess: () => void
}

export default function CashTransactionForm({ onSuccess }: CashTransactionFormProps) {
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [responsible, setResponsible] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/cash-transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          description,
          responsible
        })
      })

      if (response.ok) {
        setMessage('✅ Transacción registrada exitosamente')
        setAmount('')
        setDescription('')
        setResponsible('')
        setTimeout(() => onSuccess(), 1500)
      } else {
        const error = await response.json()
        setMessage(`❌ ${error.error}`)
      }
    } catch (error) {
      setMessage('❌ Error al registrar transacción')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Tipo de Transacción
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setType('INCOME')}
            className={`p-2.5 rounded-lg border-2 transition-all text-sm ${
              type === 'INCOME'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            Ingreso
          </button>
          <button
            type="button"
            onClick={() => setType('EXPENSE')}
            className={`p-2.5 rounded-lg border-2 transition-all text-sm ${
              type === 'EXPENSE'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            Gasto
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Monto
        </label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
          placeholder="0.00"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Descripción
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
          placeholder="Descripción de la transacción"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Responsable
        </label>
        <input
          type="text"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
          placeholder="Nombre del responsable"
          required
        />
      </div>
      {message && (
        <div className="p-2.5 rounded-lg bg-gray-50 text-xs text-gray-700">
          {message}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 disabled:opacity-50 transition-all"
      >
        {loading ? 'Registrando...' : 'Registrar Transacción'}
      </button>
    </form>
  )
}