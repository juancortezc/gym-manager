'use client'

import { useState, useEffect } from 'react'
import MobileLayout from '@/components/MobileLayout'
import SubTabs from '@/components/SubTabs'
import MobileModal from '@/components/MobileModal'
import { 
  Users,
  Brush,
  CreditCard,
  Plus
} from 'lucide-react'

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('trainers')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'trainer' | 'cleaning' | 'plan'>('trainer')
  
  // Data states
  const [trainers, setTrainers] = useState<any[]>([])
  const [cleaningStaff, setCleaningStaff] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [trainersRes, cleaningRes, plansRes] = await Promise.all([
        fetch('/api/trainers'),
        fetch('/api/cleaning-staff'),
        fetch('/api/plans')
      ])
      
      const [trainersData, cleaningData, plansData] = await Promise.all([
        trainersRes.json(),
        cleaningRes.json(),
        plansRes.json()
      ])
      
      setTrainers(trainersData.filter((t: any) => t.active))
      setCleaningStaff(cleaningData.filter((c: any) => c.active))
      setPlans(plansData.filter((p: any) => p.active))
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'trainers', label: 'Entrenadores' },
    { id: 'cleaning', label: 'Limpieza' },
    { id: 'plans', label: 'Planes' }
  ]

  const openModal = (type: 'trainer' | 'cleaning' | 'plan') => {
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    // Refresh data after closing modal
    fetchData()
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trainers':
        return (
          <div className="p-4">
            <div className="mb-4">
              <button
                onClick={() => openModal('trainer')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="mr-2" size={20} />
                Agregar Entrenador
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Entrenadores Activos</h3>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm">Cargando entrenadores...</p>
                </div>
              ) : trainers.length > 0 ? (
                <div className="space-y-3">
                  {trainers.map((trainer) => (
                    <div key={trainer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{trainer.name}</div>
                        <div className="text-sm text-gray-500">{trainer.phone || 'Sin teléfono'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">${trainer.hourlyRate}/h</div>
                        <div className="text-xs text-gray-500">Activo</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay entrenadores configurados</p>
                  <p className="text-xs text-gray-400 mt-1">Configura los entrenadores y sus tarifas por hora</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'cleaning':
        return (
          <div className="p-4">
            <div className="mb-4">
              <button
                onClick={() => openModal('cleaning')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="mr-2" size={20} />
                Agregar Personal de Limpieza
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Personal de Limpieza</h3>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm">Cargando personal...</p>
                </div>
              ) : cleaningStaff.length > 0 ? (
                <div className="space-y-3">
                  {cleaningStaff.map((staff) => (
                    <div key={staff.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">{staff.phone || 'Sin teléfono'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">${staff.hourlyRate}/h</div>
                        <div className="text-xs text-gray-500">Activo</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brush className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay personal de limpieza configurado</p>
                  <p className="text-xs text-gray-400 mt-1">Configura el personal de limpieza y sus tarifas por hora</p>
                </div>
              )}
            </div>
          </div>
        )
      
      case 'plans':
        return (
          <div className="p-4">
            <div className="mb-4">
              <button
                onClick={() => openModal('plan')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="mr-2" size={20} />
                Crear Plan
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Planes de Membresía</h3>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-sm">Cargando planes...</p>
                </div>
              ) : plans.length > 0 ? (
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">{plan.name}</div>
                        <div className="text-lg font-semibold text-orange-600">${plan.price}</div>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">{plan.description}</div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{plan.classCount} clases</span>
                        <span>{plan.durationDays} días</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay planes configurados</p>
                  <p className="text-xs text-gray-400 mt-1">Crea planes de membresía con precios y duración</p>
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
    <MobileLayout>
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
          modalType === 'trainer' ? 'Nuevo Entrenador' :
          modalType === 'cleaning' ? 'Nuevo Personal de Limpieza' :
          'Nuevo Plan'
        }
      >
        <div className="p-4">
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {modalType === 'trainer' && <Users size={32} className="text-gray-400" />}
              {modalType === 'cleaning' && <Brush size={32} className="text-gray-400" />}
              {modalType === 'plan' && <CreditCard size={32} className="text-gray-400" />}
            </div>
            <p className="text-sm">
              Formulario de {modalType === 'trainer' ? 'entrenador' : modalType === 'cleaning' ? 'personal de limpieza' : 'plan'} próximamente
            </p>
          </div>
        </div>
      </MobileModal>
    </MobileLayout>
  )
}