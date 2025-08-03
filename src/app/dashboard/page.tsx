'use client'

import { useState, useEffect } from 'react'
import MobileLayout from '@/components/MobileLayout'
import ActionCard from '@/components/ActionCard'
import QuickActions from '@/components/QuickActions'
import MobileModal from '@/components/MobileModal'
import { 
  UserPlus,
  Clock,
  CreditCard,
  Brush,
  FileText,
  Users,
  BarChart3,
  Settings
} from 'lucide-react'

interface FormData {
  [key: string]: any
}


function VisitForm({ onSuccess }: { onSuccess: () => void }) {
  const [membershipNumber, setMembershipNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/member-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipNumber, notes })
      })

      if (response.ok) {
        setMessage('✅ Visita registrada exitosamente')
        setMembershipNumber('')
        setNotes('')
        setTimeout(() => onSuccess(), 1500)
      } else {
        const error = await response.json()
        setMessage(`❌ ${error.error}`)
      }
    } catch (error) {
      setMessage('❌ Error al registrar visita')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Membresía
          </label>
          <input
            type="text"
            value={membershipNumber}
            onChange={(e) => setMembershipNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Ej: GM001"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Comentarios adicionales..."
          />
        </div>
        {message && (
          <div className="p-3 rounded-lg bg-gray-50 text-sm text-gray-700">
            {message}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium disabled:opacity-50 transition-all"
        >
          {loading ? 'Registrando...' : 'Registrar Visita'}
        </button>
      </form>
    </div>
  )
}

function TrainerSessionForm({ onSuccess }: { onSuccess: () => void }) {
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

function CashForm({ onSuccess }: { onSuccess: () => void }) {
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

export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const handleModalClose = () => {
    setActiveModal(null)
  }

  const mainActions = [
    {
      title: 'Registrar Visita',
      description: 'Entrada de miembro al gimnasio',
      icon: UserPlus,
      color: 'blue' as const,
      onClick: () => setActiveModal('visit')
    },
    {
      title: 'Horas Entrenador',
      description: 'Registrar sesión de entrenamiento',
      icon: Clock,
      color: 'green' as const,
      onClick: () => setActiveModal('trainer')
    },
    {
      title: 'Caja Chica',
      description: 'Ingresos y gastos del día',
      icon: CreditCard,
      color: 'orange' as const,
      onClick: () => setActiveModal('cash')
    },
    {
      title: 'Personal Limpieza',
      description: 'Registrar horas de limpieza',
      icon: Brush,
      color: 'red' as const,
      onClick: () => setActiveModal('cleaning')
    }
  ]

  const quickActionsData = [
    {
      id: 'register',
      label: 'Registrar',
      icon: FileText,
      color: 'blue' as const,
      onClick: () => setActiveModal('visit')
    },
    {
      id: 'members',
      label: 'Miembros',
      icon: Users,
      color: 'green' as const,
      onClick: () => window.location.href = '/members'
    },
    {
      id: 'reports',
      label: 'Reportes',
      icon: BarChart3,
      color: 'orange' as const,
      onClick: () => alert('Próximamente')
    },
    {
      id: 'settings',
      label: 'Ajustes',
      icon: Settings,
      color: 'gray' as const,
      onClick: () => window.location.href = '/config'
    }
  ]

  return (
    <MobileLayout>
      <div className="bg-gray-50 min-h-full">
        {/* Main Actions */}
        <div className="p-4 space-y-3">
          {mainActions.map((action, index) => (
            <ActionCard
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              color={action.color}
              onClick={action.onClick}
            />
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions actions={quickActionsData} />
      </div>

      {/* Modals */}
      <MobileModal
        isOpen={activeModal === 'visit'}
        onClose={handleModalClose}
        title="Registrar Visita"
      >
        <VisitForm onSuccess={handleModalClose} />
      </MobileModal>

      <MobileModal
        isOpen={activeModal === 'trainer'}
        onClose={handleModalClose}
        title="Horas Entrenador"
      >
        <div className="p-4">
          <TrainerSessionForm onSuccess={handleModalClose} />
        </div>
      </MobileModal>

      <MobileModal
        isOpen={activeModal === 'cash'}
        onClose={handleModalClose}
        title="Caja Chica"
      >
        <div className="p-4">
          <CashForm onSuccess={handleModalClose} />
        </div>
      </MobileModal>

      <MobileModal
        isOpen={activeModal === 'cleaning'}
        onClose={handleModalClose}
        title="Personal Limpieza"
      >
        <div className="p-4">
          <p className="text-gray-500">Formulario de limpieza próximamente</p>
        </div>
      </MobileModal>
    </MobileLayout>
  )
}