'use client'

import { useState, useEffect } from 'react'

interface CleaningSessionFormProps {
  onSuccess: () => void
}

export default function CleaningSessionForm({ onSuccess }: CleaningSessionFormProps) {
  const [staffId, setStaffId] = useState('')
  const [cleaningStaff, setCleaningStaff] = useState<any[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStaff, setLoadingStaff] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchCleaningStaff()
  }, [])

  const fetchCleaningStaff = async () => {
    try {
      const response = await fetch('/api/cleaning-staff')
      const data = await response.json()
      setCleaningStaff(data.filter((s: any) => s.active))
    } catch (error) {
      console.error('Error fetching cleaning staff:', error)
    } finally {
      setLoadingStaff(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const today = new Date().toISOString().split('T')[0]
      const response = await fetch('/api/cleaning-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffId,
          date: today,
          startTime: `${today}T${startTime}:00`,
          endTime: endTime ? `${today}T${endTime}:00` : null,
          notes
        })
      })

      if (response.ok) {
        setMessage('✅ Sesión registrada exitosamente')
        setStaffId('')
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
          Personal de Limpieza
        </label>
        {loadingStaff ? (
          <div className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
            Cargando personal...
          </div>
        ) : (
          <select
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm"
            required
          >
            <option value="">Seleccionar personal</option>
            {cleaningStaff.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name} - ${staff.hourlyRate}/hora
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
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm"
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
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm"
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
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-red-500 focus:border-red-500 text-gray-900 text-sm"
          placeholder="Tareas realizadas, observaciones..."
        />
      </div>
      {message && (
        <div className="p-2.5 rounded-lg bg-gray-50 text-xs text-gray-700">
          {message}
        </div>
      )}
      <button
        type="submit"
        disabled={loading || loadingStaff}
        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 disabled:opacity-50 transition-all"
      >
        {loading ? 'Registrando...' : 'Registrar Sesión'}
      </button>
    </form>
  )
}