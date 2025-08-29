'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import ActionCard from '@/components/ActionCard'
import QuickActions from '@/components/QuickActions'
import MobileModal from '@/components/MobileModal'
import { 
  UserPlus,
  Clock,
  CreditCard,
  Brush,
  Settings,
  TrendingUp,
  Sparkles,
  DollarSign,
  Cog
} from 'lucide-react'
import TrainerSessionForm from '@/components/forms/TrainerSessionForm'
import CashTransactionForm from '@/components/forms/CashTransactionForm'
import CleaningSessionForm from '@/components/forms/CleaningSessionForm'



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


export default function DashboardPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null)

  const handleModalClose = () => {
    setActiveModal(null)
  }

  const handleConfigClick = () => {
    window.location.href = '/config'
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
      id: 'rpt-ent',
      label: 'RPT ENT',
      icon: TrendingUp,
      color: 'purple' as const,
      onClick: () => window.location.href = '/trainers?tab=reports'
    },
    {
      id: 'rpt-caja',
      label: 'RPT CAJA',
      icon: DollarSign,
      color: 'yellow' as const,
      onClick: () => window.location.href = '/cash?tab=reports'
    },
    {
      id: 'rpt-limp',
      label: 'RPT LIMP',
      icon: Sparkles,
      color: 'orange' as const,
      onClick: () => window.location.href = '/cleaning?tab=reports'
    },
    {
      id: 'settings',
      label: 'Ajustes',
      icon: Settings,
      color: 'gray' as const,
      onClick: () => window.location.href = '/settings'
    },
    {
      id: 'config',
      label: 'Config',
      icon: Cog,
      color: 'blue' as const,
      onClick: () => window.location.href = '/config'
    }
  ]

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">

        {/* Desktop Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Actions Column */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Acciones Principales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
            <QuickActions actions={quickActionsData} />
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden bg-gray-50 min-h-full">
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
        <TrainerSessionForm onSuccess={handleModalClose} />
      </MobileModal>

      <MobileModal
        isOpen={activeModal === 'cash'}
        onClose={handleModalClose}
        title="Caja Chica"
      >
        <CashTransactionForm onSuccess={handleModalClose} />
      </MobileModal>

      <MobileModal
        isOpen={activeModal === 'cleaning'}
        onClose={handleModalClose}
        title="Personal Limpieza"
      >
        <CleaningSessionForm onSuccess={handleModalClose} />
      </MobileModal>
    </Layout>
  )
}