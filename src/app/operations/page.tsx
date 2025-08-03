'use client'

import { useState } from 'react'
import MobileLayout from '@/components/MobileLayout'
import SubTabs from '@/components/SubTabs'
import MobileModal from '@/components/MobileModal'
import { 
  Clock,
  CreditCard,
  Brush,
  Plus
} from 'lucide-react'

export default function OperationsPage() {
  const [activeTab, setActiveTab] = useState('trainers')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'trainer' | 'cash' | 'cleaning'>('trainer')

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
              <h3 className="font-semibold text-gray-900 mb-3">Sesiones Recientes</h3>
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay sesiones registradas hoy</p>
              </div>
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
                <h3 className="font-semibold text-gray-900 mb-2">Balance del Día</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-green-600 font-semibold">Ingresos</div>
                    <div className="text-lg font-bold text-green-700">$0</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-red-600 font-semibold">Gastos</div>
                    <div className="text-lg font-bold text-red-700">$0</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Transacciones Recientes</h3>
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No hay transacciones registradas hoy</p>
                </div>
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
              <h3 className="font-semibold text-gray-900 mb-3">Sesiones de Limpieza</h3>
              <div className="text-center py-8 text-gray-500">
                <Brush className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No hay sesiones de limpieza registradas hoy</p>
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
          modalType === 'trainer' ? 'Sesión de Entrenador' :
          modalType === 'cash' ? 'Transacción de Caja' :
          'Sesión de Limpieza'
        }
      >
        <div className="p-4">
          <div className="text-center py-8 text-gray-500">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {modalType === 'trainer' && <Clock size={32} className="text-gray-400" />}
              {modalType === 'cash' && <CreditCard size={32} className="text-gray-400" />}
              {modalType === 'cleaning' && <Brush size={32} className="text-gray-400" />}
            </div>
            <p className="text-sm">
              Formulario de {modalType === 'trainer' ? 'sesión de entrenador' : modalType === 'cash' ? 'transacción de caja' : 'sesión de limpieza'} próximamente
            </p>
          </div>
        </div>
      </MobileModal>
    </MobileLayout>
  )
}