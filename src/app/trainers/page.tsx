'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Plus, Edit, Trash2, Clock, DollarSign, Calendar } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Trainer {
  id: string
  name: string
  hourlyRate: number
  active: boolean
  createdAt: string
}

interface TrainerSession {
  id: string
  trainerId: string
  date: string
  startTime: string
  endTime: string | null
  totalHours: number | null
  notes: string | null
  trainer: Trainer
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([])
  const [sessions, setSessions] = useState<TrainerSession[]>([])
  const [showTrainerForm, setShowTrainerForm] = useState(false)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'trainers' | 'sessions' | 'reports'>('trainers')

  const [trainerForm, setTrainerForm] = useState({
    name: '',
    hourlyRate: '',
  })

  const [sessionForm, setSessionForm] = useState({
    trainerId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [trainersRes, sessionsRes] = await Promise.all([
        fetch('/api/trainers'),
        fetch('/api/trainer-sessions'),
      ])

      if (trainersRes.ok) {
        const trainersData = await trainersRes.json()
        setTrainers(trainersData)
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json()
        setSessions(sessionsData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTrainerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingTrainer ? `/api/trainers/${editingTrainer.id}` : '/api/trainers'
      const method = editingTrainer ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainerForm),
      })

      if (response.ok) {
        await fetchData()
        setShowTrainerForm(false)
        setEditingTrainer(null)
        setTrainerForm({ name: '', hourlyRate: '' })
      }
    } catch (error) {
      console.error('Error saving trainer:', error)
    }
  }

  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/trainer-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionForm),
      })

      if (response.ok) {
        await fetchData()
        setShowSessionForm(false)
        setSessionForm({
          trainerId: '',
          date: new Date().toISOString().split('T')[0],
          startTime: '',
          endTime: '',
          notes: '',
        })
      }
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  const handleEditTrainer = (trainer: Trainer) => {
    setEditingTrainer(trainer)
    setTrainerForm({
      name: trainer.name,
      hourlyRate: trainer.hourlyRate.toString(),
    })
    setShowTrainerForm(true)
  }

  const handleDeleteTrainer = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este entrenador?')) {
      try {
        await fetch(`/api/trainers/${id}`, { method: 'DELETE' })
        await fetchData()
      } catch (error) {
        console.error('Error deleting trainer:', error)
      }
    }
  }

  const handleEndSession = async (sessionId: string) => {
    const currentTime = new Date().toTimeString().slice(0, 5)
    try {
      await fetch(`/api/trainer-sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endTime: currentTime }),
      })
      await fetchData()
    } catch (error) {
      console.error('Error ending session:', error)
    }
  }

  const activeSessions = sessions.filter(s => !s.endTime)
  const completedSessions = sessions.filter(s => s.endTime)

  if (loading) {
    return (
      <Layout title="Control de Entrenadores">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Control de Entrenadores">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'trainers', label: 'Entrenadores', icon: '👨‍🏫' },
            { id: 'sessions', label: 'Sesiones', icon: '⏰' },
            { id: 'reports', label: 'Reportes', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Trainers Tab */}
        {activeTab === 'trainers' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Entrenadores Registrados</h2>
              <button
                onClick={() => setShowTrainerForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Nuevo Entrenador
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainers.map((trainer) => (
                <div key={trainer.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{trainer.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditTrainer(trainer)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTrainer(trainer.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      {formatCurrency(trainer.hourlyRate)}/hora
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Desde {formatDate(trainer.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Control de Sesiones</h2>
              <button
                onClick={() => setShowSessionForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Clock size={20} />
                Nueva Sesión
              </button>
            </div>

            {/* Active Sessions */}
            {activeSessions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3 text-green-600">Sesiones Activas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{session.trainer.name}</h4>
                        <button
                          onClick={() => handleEndSession(session.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Finalizar
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Inicio: {new Date(session.startTime).toLocaleTimeString()}</p>
                        <p>Fecha: {formatDate(session.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Sessions */}
            <div>
              <h3 className="text-lg font-medium mb-3">Sesiones Completadas</h3>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Entrenador
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Horario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Horas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {completedSessions.map((session) => (
                        <tr key={session.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {session.trainer.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(session.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(session.startTime).toLocaleTimeString()} - 
                            {session.endTime && new Date(session.endTime).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {session.totalHours?.toFixed(2)}h
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {session.totalHours && formatCurrency(session.totalHours * session.trainer.hourlyRate)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Reportes de Pagos</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-500">Reportes mensuales próximamente...</p>
            </div>
          </div>
        )}
      </div>

      {/* Trainer Form Modal */}
      {showTrainerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingTrainer ? 'Editar Entrenador' : 'Nuevo Entrenador'}
            </h3>
            <form onSubmit={handleTrainerSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={trainerForm.name}
                  onChange={(e) => setTrainerForm({ ...trainerForm, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarifa por Hora (COP)
                </label>
                <input
                  type="number"
                  value={trainerForm.hourlyRate}
                  onChange={(e) => setTrainerForm({ ...trainerForm, hourlyRate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {editingTrainer ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTrainerForm(false)
                    setEditingTrainer(null)
                    setTrainerForm({ name: '', hourlyRate: '' })
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Session Form Modal */}
      {showSessionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nueva Sesión</h3>
            <form onSubmit={handleSessionSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entrenador
                </label>
                <select
                  value={sessionForm.trainerId}
                  onChange={(e) => setSessionForm({ ...sessionForm, trainerId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar entrenador...</option>
                  {trainers.map((trainer) => (
                    <option key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Inicio
                </label>
                <input
                  type="time"
                  value={sessionForm.startTime}
                  onChange={(e) => setSessionForm({ ...sessionForm, startTime: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Fin (opcional)
                </label>
                <input
                  type="time"
                  value={sessionForm.endTime}
                  onChange={(e) => setSessionForm({ ...sessionForm, endTime: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Crear Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSessionForm(false)
                    setSessionForm({
                      trainerId: '',
                      date: new Date().toISOString().split('T')[0],
                      startTime: '',
                      endTime: '',
                      notes: '',
                    })
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}