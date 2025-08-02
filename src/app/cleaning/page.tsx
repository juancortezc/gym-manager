'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { Plus, Edit, Trash2, Clock, DollarSign, Calendar } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface CleaningStaff {
  id: string
  name: string
  hourlyRate: number
  active: boolean
  createdAt: string
}

interface CleaningSession {
  id: string
  staffId: string
  date: string
  startTime: string
  endTime: string | null
  totalHours: number | null
  notes: string | null
  staff: CleaningStaff
}

export default function CleaningPage() {
  const [staff, setStaff] = useState<CleaningStaff[]>([])
  const [sessions, setSessions] = useState<CleaningSession[]>([])
  const [showStaffForm, setShowStaffForm] = useState(false)
  const [showSessionForm, setShowSessionForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<CleaningStaff | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'staff' | 'sessions' | 'reports'>('staff')

  const [staffForm, setStaffForm] = useState({
    name: '',
    hourlyRate: '',
  })

  const [sessionForm, setSessionForm] = useState({
    staffId: '',
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
      const [staffRes, sessionsRes] = await Promise.all([
        fetch('/api/cleaning-staff'),
        fetch('/api/cleaning-sessions'),
      ])

      if (staffRes.ok) {
        const staffData = await staffRes.json()
        setStaff(staffData)
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

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingStaff ? `/api/cleaning-staff/${editingStaff.id}` : '/api/cleaning-staff'
      const method = editingStaff ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffForm),
      })

      if (response.ok) {
        await fetchData()
        setShowStaffForm(false)
        setEditingStaff(null)
        setStaffForm({ name: '', hourlyRate: '' })
      }
    } catch (error) {
      console.error('Error saving staff:', error)
    }
  }

  const handleSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/cleaning-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionForm),
      })

      if (response.ok) {
        await fetchData()
        setShowSessionForm(false)
        setSessionForm({
          staffId: '',
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

  const handleEditStaff = (staffMember: CleaningStaff) => {
    setEditingStaff(staffMember)
    setStaffForm({
      name: staffMember.name,
      hourlyRate: staffMember.hourlyRate.toString(),
    })
    setShowStaffForm(true)
  }

  const handleDeleteStaff = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este personal de limpieza?')) {
      try {
        await fetch(`/api/cleaning-staff/${id}`, { method: 'DELETE' })
        await fetchData()
      } catch (error) {
        console.error('Error deleting staff:', error)
      }
    }
  }

  const handleEndSession = async (sessionId: string) => {
    const currentTime = new Date().toTimeString().slice(0, 5)
    try {
      await fetch(`/api/cleaning-sessions/${sessionId}`, {
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
      <Layout title="Control de Personal de Limpieza">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Control de Personal de Limpieza">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'staff', label: 'Personal', icon: '🧹' },
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

        {/* Staff Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Personal de Limpieza Registrado</h2>
              <button
                onClick={() => setShowStaffForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Nuevo Personal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staff.map((staffMember) => (
                <div key={staffMember.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{staffMember.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditStaff(staffMember)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staffMember.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      {formatCurrency(staffMember.hourlyRate)}/hora
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      Desde {formatDate(new Date(staffMember.createdAt))}
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
                        <h4 className="font-semibold">{session.staff.name}</h4>
                        <button
                          onClick={() => handleEndSession(session.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Finalizar
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Inicio: {new Date(session.startTime).toLocaleTimeString()}</p>
                        <p>Fecha: {formatDate(new Date(session.date))}</p>
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
                          Personal
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
                            {session.staff.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(new Date(session.date))}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(session.startTime).toLocaleTimeString()} - 
                            {session.endTime && new Date(session.endTime).toLocaleTimeString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {session.totalHours?.toFixed(2)}h
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {session.totalHours && formatCurrency(session.totalHours * session.staff.hourlyRate)}
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

      {/* Staff Form Modal */}
      {showStaffForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingStaff ? 'Editar Personal' : 'Nuevo Personal'}
            </h3>
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
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
                  value={staffForm.hourlyRate}
                  onChange={(e) => setStaffForm({ ...staffForm, hourlyRate: e.target.value })}
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
                  {editingStaff ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowStaffForm(false)
                    setEditingStaff(null)
                    setStaffForm({ name: '', hourlyRate: '' })
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
                  Personal
                </label>
                <select
                  value={sessionForm.staffId}
                  onChange={(e) => setSessionForm({ ...sessionForm, staffId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar personal...</option>
                  {staff.map((staffMember) => (
                    <option key={staffMember.id} value={staffMember.id}>
                      {staffMember.name}
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
                      staffId: '',
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