'use client'

import { useState } from 'react'

interface PlanFormProps {
  onSuccess: () => void
  plan?: any // For edit mode
  isEdit?: boolean
}

export default function PlanForm({ onSuccess, plan, isEdit = false }: PlanFormProps) {
  const [name, setName] = useState(plan?.name || '')
  const [price, setPrice] = useState(plan?.price?.toString() || '')
  const [durationInDays, setDurationInDays] = useState(plan?.durationInDays?.toString() || '')
  const [classesPerWeek, setClassesPerWeek] = useState(plan?.classesPerWeek?.toString() || '')
  const [totalClasses, setTotalClasses] = useState(plan?.totalClasses?.toString() || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const requestData = {
        name: name.trim(),
        price: parseFloat(price),
        durationInDays: parseInt(durationInDays),
        classesPerWeek: parseInt(classesPerWeek),
        totalClasses: parseInt(totalClasses)
      }

      const url = isEdit ? `/api/plans/${plan.id}` : '/api/plans'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      })

      if (response.ok) {
        setMessage(`✅ Plan ${isEdit ? 'actualizado' : 'creado'} exitosamente`)
        if (!isEdit) {
          setName('')
          setPrice('')
          setDurationInDays('')
          setClassesPerWeek('')
          setTotalClasses('')
        }
        setTimeout(() => onSuccess(), 1500)
      } else {
        const error = await response.json()
        setMessage(`❌ ${error.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error al ${isEdit ? 'actualizar' : 'crear'} plan`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Plan
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Plan Básico"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio ($)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="50.00"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración (días)
            </label>
            <input
              type="number"
              min="1"
              value={durationInDays}
              onChange={(e) => setDurationInDays(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="30"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Clases por Semana
            </label>
            <input
              type="number"
              min="1"
              value={classesPerWeek}
              onChange={(e) => setClassesPerWeek(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="3"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total de Clases
          </label>
          <input
            type="number"
            min="1"
            value={totalClasses}
            onChange={(e) => setTotalClasses(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="12"
            required
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
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-md font-medium disabled:opacity-50 transition-colors"
        >
          {loading ? (isEdit ? 'Actualizando...' : 'Creando...') : (isEdit ? 'Actualizar Plan' : 'Crear Plan')}
        </button>
      </form>
    </div>
  )
}