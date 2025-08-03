'use client'

import { useState } from 'react'
import MobileLayout from '@/components/MobileLayout'
import SubTabs from '@/components/SubTabs'
import MobileModal from '@/components/MobileModal'
import { 
  Users,
  Brush,
  CreditCard,
  Plus,
  Edit,
  Eye
} from 'lucide-react'

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('trainers')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'trainer' | 'cleaning' | 'plan'>('trainer')

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
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay entrenadores configurados</p>
                <p className="text-xs text-gray-400 mt-1">Configura los entrenadores y sus tarifas por hora</p>
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
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="mr-2" size={20} />
                Agregar Personal de Limpieza
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Personal de Limpieza</h3>
              <div className="text-center py-8 text-gray-500">
                <Brush className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay personal de limpieza configurado</p>
                <p className="text-xs text-gray-400 mt-1">Configura el personal de limpieza y sus tarifas por hora</p>
              </div>
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
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay planes configurados</p>
                <p className="text-xs text-gray-400 mt-1">Crea planes de membresía con precios y duración</p>
              </div>
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