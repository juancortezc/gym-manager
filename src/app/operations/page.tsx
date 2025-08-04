'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import SubTabs from '@/components/SubTabs'
import MobileModal from '@/components/MobileModal'
import { 
  Clock,
  CreditCard,
  Brush
} from 'lucide-react'
import TrainerSessionForm from '@/components/forms/TrainerSessionForm'
import CashTransactionForm from '@/components/forms/CashTransactionForm'
import CleaningSessionForm from '@/components/forms/CleaningSessionForm'

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState('trainers')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'trainer' | 'cash' | 'cleaning'>('trainer')
  
  // Data states
  const [balance, setBalance] = useState({ income: 0, expenses: 0 })
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [recentTrainerSessions, setRecentTrainerSessions] = useState<any[]>([])
  const [recentCleaningSessions, setRecentCleaningSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayData()
  }, [])

  const fetchTodayData = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch balance
      const balanceResponse = await fetch('/api/cash-transactions/balance')
      const balanceData = await balanceResponse.json()
      setBalance(balanceData)
      
      // Fetch recent transactions (today only)
      const transactionsResponse = await fetch(`/api/cash-transactions?date=${today}`)
      const transactionsData = await transactionsResponse.json()
      setRecentTransactions(transactionsData.slice(0, 5))
      
      // Fetch recent trainer sessions (today only)
      const trainerSessionsResponse = await fetch(`/api/trainer-sessions?date=${today}`)
      const trainerSessionsData = await trainerSessionsResponse.json()
      setRecentTrainerSessions(trainerSessionsData.slice(0, 5))
      
      // Fetch recent cleaning sessions (today only)
      const cleaningSessionsResponse = await fetch(`/api/cleaning-sessions?date=${today}`)
      const cleaningSessionsData = await cleaningSessionsResponse.json()
      setRecentCleaningSessions(cleaningSessionsData.slice(0, 5))
      
    } catch (error) {
      console.error('Error fetching today data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'trainers', label: 'Entrenadores' },
    { id: 'cash', label: 'Caja Chica' },
    { id: 'cleaning', label: 'Limpieza' }
  ]

  const openModal = (type: 'trainer' | 'cash' | 'cleaning') => {
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    // Refresh data after closing modal
    fetchTodayData()
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trainers':
        return (
          <div className="p-4">
            <div className="mb-4">
              <button
                onClick={() => openModal('trainer')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Clock className="mr-2" size={20} />
                Registrar Sesión de Entrenador
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Sesiones de Hoy</h3>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm">Cargando sesiones...</p>
                </div>
              ) : recentTrainerSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentTrainerSessions.map((session: any) => (
                    <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{session.trainer.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          {session.endTime && ` - ${new Date(session.endTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                        </div>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        ${session.trainer.hourlyRate}/h
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay sesiones registradas hoy</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'cash':
        return (
          <div className="p-4">
            <div className="mb-4">
              <button
                onClick={() => openModal('cash')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <CreditCard className="mr-2" size={20} />
                Registrar Transacción
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Balance de Hoy</h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-green-600 font-semibold">Ingresos</div>
                      <div className="text-lg font-bold text-green-700">${balance.income.toFixed(2)}</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-red-600 font-semibold">Gastos</div>
                      <div className="text-lg font-bold text-red-700">${balance.expenses.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Transacciones de Hoy</h3>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-sm">Cargando transacciones...</p>
                  </div>
                ) : recentTransactions.length > 0 ? (
                  <div className="space-y-3">
                    {recentTransactions.map((transaction: any) => (
                      <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900">{transaction.description}</div>
                          <div className="text-sm text-gray-500">{transaction.responsible}</div>
                        </div>
                        <div className={`text-sm font-bold ${
                          transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'INCOME' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No hay transacciones registradas hoy</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      
      case 'cleaning':
        return (
          <div className="p-4">
            <div className="mb-4">
              <button
                onClick={() => openModal('cleaning')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Brush className="mr-2" size={20} />
                Registrar Horas de Limpieza
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Sesiones de Limpieza de Hoy</h3>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm">Cargando sesiones...</p>
                </div>
              ) : recentCleaningSessions.length > 0 ? (
                <div className="space-y-3">
                  {recentCleaningSessions.map((session: any) => (
                    <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{session.cleaningStaff.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(session.startTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          {session.endTime && ` - ${new Date(session.endTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`}
                        </div>
                      </div>
                      <div className="text-sm text-blue-600 font-medium">
                        ${session.cleaningStaff.hourlyRate}/h
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brush className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay sesiones de limpieza registradas hoy</p>
                </div>
              )}
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <Layout title="Operaciones">
      <div className="bg-gray-50 min-h-full">
        <SubTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        
        {renderTabContent()}
      </div>

      {/* Modals */}
      <MobileModal
        isOpen={showModal}
        onClose={closeModal}
        title={
          modalType === 'trainer' ? 'Sesión de Entrenador' :
          modalType === 'cash' ? 'Transacción de Caja' :
          'Sesión de Limpieza'
        }
      >
        <div className="p-4">
          {modalType === 'trainer' && <TrainerSessionForm onSuccess={closeModal} />}
          {modalType === 'cash' && <CashTransactionForm onSuccess={closeModal} />}
          {modalType === 'cleaning' && <CleaningSessionForm onSuccess={closeModal} />}
        </div>
      </MobileModal>
    </Layout>
  )
}