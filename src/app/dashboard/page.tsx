'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  TrendingDown,
  Plus,
  Clock,
  CreditCard,
  UserPlus,
  Activity
} from 'lucide-react'

interface DashboardStats {
  activeMembers: number
  trainers: number
  cashBalance: number
  visitsToday: number
  incomeToday: number
  expensesToday: number
  newMembersToday: number
  hoursWorkedToday: number
}

interface QuickActionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

function QuickActionModal({ isOpen, onClose, title, children }: QuickActionModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-3 max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-50 px-4 py-3 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[var(--luxury-charcoal)]">{title}</h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Número de Membresía
        </label>
        <input
          type="text"
          value={membershipNumber}
          onChange={(e) => setMembershipNumber(e.target.value)}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
          placeholder="Ej: GM001"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1.5">
          Notas (opcional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900 text-sm"
          placeholder="Comentarios adicionales..."
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
        className="w-full luxury-gradient text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-all"
      >
        {loading ? 'Registrando...' : 'Registrar Visita'}
      </button>
    </form>
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
  const [stats, setStats] = useState<DashboardStats>({
    activeMembers: 0,
    trainers: 0,
    cashBalance: 0,
    visitsToday: 0,
    incomeToday: 0,
    expensesToday: 0,
    newMembersToday: 0,
    hoursWorkedToday: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [membersRes, trainersRes, balanceRes, visitsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/trainers'),
        fetch('/api/cash-transactions/balance'),
        fetch('/api/member-visits')
      ])

      const [members, trainers, balance, visits] = await Promise.all([
        membersRes.json(),
        trainersRes.json(),
        balanceRes.json(),
        visitsRes.json()
      ])

      const today = new Date().toISOString().split('T')[0]
      const visitsToday = visits.filter((visit: any) => 
        visit.visitDate.startsWith(today)
      ).length

      const activeMembersCount = members.filter((member: any) => member.active).length
      const activeTrainersCount = trainers.filter((trainer: any) => trainer.active).length

      setStats({
        activeMembers: activeMembersCount,
        trainers: activeTrainersCount,
        cashBalance: balance.balance || 0,
        visitsToday,
        incomeToday: 0,
        expensesToday: 0,
        newMembersToday: 0,
        hoursWorkedToday: 0
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setActiveModal(null)
    fetchStats() // Refresh stats when modal closes
  }

  const kpiCards = [
    {
      title: 'Miembros Activos',
      value: stats.activeMembers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Entrenadores',
      value: stats.trainers,
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Saldo Caja',
      value: `$${stats.cashBalance.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Visitas Hoy',
      value: stats.visitsToday,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ]

  const quickActions = [
    {
      id: 'visit',
      title: 'Registrar Visita',
      description: 'Registrar entrada de miembro',
      icon: UserPlus,
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'cash',
      title: 'Caja Chica',
      description: 'Ingreso o gasto',
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'trainer',
      title: 'Horas Entrenador',
      description: 'Registrar sesión',
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 'activity',
      title: 'Ver Actividad',
      description: 'Actividad reciente',
      icon: Activity,
      color: 'from-gray-500 to-gray-600',
      hoverColor: 'hover:from-gray-600 hover:to-gray-700'
    }
  ]

  return (
    <Layout title="Panel de Control" onQuickAction={setActiveModal}>
      <div className="space-y-5">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium mb-0.5">{card.title}</p>
                  <p className="text-xl font-bold text-[var(--luxury-charcoal)]">
                    {loading ? '...' : card.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[var(--luxury-charcoal)] mb-1">Acciones Rápidas</h2>
            <p className="text-sm text-gray-500">Operaciones frecuentes del gimnasio</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => setActiveModal(action.id)}
                className={`p-4 rounded-lg bg-gradient-to-br ${action.color} ${action.hoverColor} text-white transition-all duration-200 hover:shadow-md group`}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors">
                    <action.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{action.title}</h3>
                    <p className="text-xs opacity-90">{action.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[var(--luxury-charcoal)] mb-1">Actividad Reciente</h2>
            <p className="text-sm text-gray-500">Últimas operaciones del sistema</p>
          </div>
          
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">No hay actividad reciente</p>
            <p className="text-xs">Las operaciones aparecerán aquí una vez que comiences a usar el sistema</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <QuickActionModal
        isOpen={activeModal === 'visit'}
        onClose={handleModalClose}
        title="Registrar Visita de Miembro"
      >
        <VisitForm onSuccess={handleModalClose} />
      </QuickActionModal>

      <QuickActionModal
        isOpen={activeModal === 'cash'}
        onClose={handleModalClose}
        title="Registrar Transacción"
      >
        <CashForm onSuccess={handleModalClose} />
      </QuickActionModal>

      <QuickActionModal
        isOpen={activeModal === 'trainer'}
        onClose={handleModalClose}
        title="Registrar Sesión de Entrenador"
      >
        <TrainerSessionForm onSuccess={handleModalClose} />
      </QuickActionModal>

      <QuickActionModal
        isOpen={activeModal === 'activity'}
        onClose={handleModalClose}
        title="Actividad Reciente"
      >
        <div className="text-center py-8 text-gray-500">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Vista detallada de actividad próximamente</p>
        </div>
      </QuickActionModal>
    </Layout>
  )
}