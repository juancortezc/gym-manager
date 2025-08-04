'use client'

import { useState, useEffect } from 'react'

interface TrainerSessionFormProps {
  onSuccess: () => void
}

export default function TrainerSessionForm({ onSuccess }: TrainerSessionFormProps) {
  const [trainerId, setTrainerId] = useState('')
  const [trainers, setTrainers] = useState<any[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingTrainers, setLoadingTrainers] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchTrainers()
  }, [])

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/trainers')
      const data = await response.json()
      setTrainers(data.filter((t: any) => t.active))
    } catch (error) {
      console.error('Error fetching trainers:', error)
    } finally {
      setLoadingTrainers(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch('/api/trainer-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerId,
          date: today,
          startTime: `${today}T${startTime}:00`,
          endTime: endTime ? `${today}T${endTime}:00` : null,
          notes
        })
      })

      if (response.ok) {
        setMessage('✅ Sesión registrada exitosamente')
        setTrainerId('')
        setStartTime('')
        setEndTime('')
        setNotes('')
        setTimeout(() => onSuccess(), 1500)
      } else {
        const error = await response.json()
        setMessage(`❌ ${error.error}`)
      }
    } catch (error) {
      setMessage('❌ Error al registrar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Entrenador
        </label>
        {loadingTrainers ? (
          <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
            Cargando entrenadores...
          </div>
        ) : (
          <select
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-sm"
            required
          >
            <option value="">Seleccionar entrenador</option>
            {trainers.map((trainer) => (
              <option key={trainer.id} value={trainer.id}>
                {trainer.name} - ${trainer.hourlyRate}/hora
              </option>
            ))}
          </select>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Hora Inicio
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Hora Fin (opcional)
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-sm"
            min={startTime}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Notas (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 text-gray-900 text-sm"
          placeholder="Actividades realizadas, observaciones..."
        />
      </div>
      {message && (
        <div className="p-2.5 rounded-lg bg-gray-50 text-xs text-gray-700">
          {message}
        </div>
      )}
      <button
        type="submit"
        disabled={loading || loadingTrainers}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 transition-all"
      >
        {loading ? 'Registrando...' : 'Registrar Sesión'}
      </button>
    </form>
  )
}