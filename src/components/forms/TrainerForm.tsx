'use client'

import { useState } from 'react'

interface TrainerFormProps {
  onSuccess: () => void
  trainer?: any // For edit mode
  isEdit?: boolean
}

export default function TrainerForm({ onSuccess, trainer, isEdit = false }: TrainerFormProps) {
  const [firstName, setFirstName] = useState(trainer?.name?.split(' ')[0] || '')
  const [lastName, setLastName] = useState(trainer?.name?.split(' ').slice(1).join(' ') || '')
  const [hourlyRate, setHourlyRate] = useState(trainer?.hourlyRate?.toString() || '')
  const [birthDate, setBirthDate] = useState(
    trainer?.birthDate ? new Date(trainer.birthDate).toISOString().split('T')[0] : ''
  )
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`
      const requestData = {
        name: fullName,
        hourlyRate: parseFloat(hourlyRate),
        birthDate: birthDate ? new Date(birthDate).toISOString() : null
      }

      const url = isEdit ? `/api/trainers/${trainer.id}` : '/api/trainers'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        setMessage(`✅ Entrenador ${isEdit ? 'actualizado' : 'creado'} exitosamente`)
        if (!isEdit) {
          setFirstName('')
          setLastName('')
          setHourlyRate('')
          setBirthDate('')
        }
        setTimeout(() => onSuccess(), 1500)
      } else {
        const error = await response.json()
        setMessage(`❌ ${error.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error al ${isEdit ? 'actualizar' : 'crear'} entrenador`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Juan"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apellido
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Pérez"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Costo por Hora ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="25.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Cumpleaños (opcional)
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {message && (
          <div className="p-3 rounded-md text-sm bg-gray-50 text-gray-700">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 transition-colors"
        >
          {loading ? (isEdit ? 'Actualizando...' : 'Creando...') : (isEdit ? 'Actualizar Entrenador' : 'Crear Entrenador')}
        </button>
      </form>
    </div>
  )
}