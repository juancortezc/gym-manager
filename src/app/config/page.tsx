'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import SubTabs from '@/components/SubTabs'
import MobileModal from '@/components/MobileModal'
import { 
  Users,
  Brush,
  CreditCard,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import TrainerForm from '@/components/forms/TrainerForm'
import CleaningStaffForm from '@/components/forms/CleaningStaffForm'
import PlanForm from '@/components/forms/PlanForm'

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('trainers')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'trainer' | 'cleaning' | 'plan'>('trainer')
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{show: boolean, item: any, type: string}>({show: false, item: null, type: ''})
  
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

  const openModal = (type: 'trainer' | 'cleaning' | 'plan', item?: any) => {
    setModalType(type)
    setEditingItem(item || null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    // Refresh data after closing modal
    fetchData()
  }

  const handleDelete = async (item: any, type: string) => {
    try {
      const endpoint = type === 'trainer' ? 'trainers' : type === 'cleaning' ? 'cleaning-staff' : 'plans'
      const response = await fetch(`/api/${endpoint}/${item.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setShowDeleteConfirm({show: false, item: null, type: ''})
        fetchData()
      } else {
        alert('Error al eliminar el registro')
      }
    } catch (error) {
      alert('Error al eliminar el registro')
    }
  }

  const confirmDelete = (item: any, type: string) => {
    setShowDeleteConfirm({show: true, item, type})
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
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{trainer.name}</div>
                        <div className="text-sm text-gray-500">
                          ${trainer.hourlyRate}/h
                          {trainer.birthDate && ` • Cumpleaños: ${new Date(trainer.birthDate).toLocaleDateString('es-ES')}`}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('trainer', trainer)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(trainer, 'trainer')}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
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
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{staff.name}</div>
                        <div className="text-sm text-gray-500">
                          ${staff.hourlyRate}/h
                          {staff.birthDate && ` • Cumpleaños: ${new Date(staff.birthDate).toLocaleDateString('es-ES')}`}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('cleaning', staff)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(staff, 'cleaning')}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
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
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{plan.name}</div>
                          <div className="text-lg font-semibold text-orange-600">${plan.price}</div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal('plan', plan)}
                            className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition-colors"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => confirmDelete(plan, 'plan')}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{plan.totalClasses} clases totales</span>
                        <span>{plan.durationInDays} días • {plan.classesPerWeek}/semana</span>
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
    <Layout title="Configuración">
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
          editingItem ? 
            (modalType === 'trainer' ? 'Editar Entrenador' :
             modalType === 'cleaning' ? 'Editar Personal de Limpieza' :
             'Editar Plan') :
            (modalType === 'trainer' ? 'Nuevo Entrenador' :
             modalType === 'cleaning' ? 'Nuevo Personal de Limpieza' :
             'Nuevo Plan')
        }
      >
        {modalType === 'trainer' && (
          <TrainerForm 
            onSuccess={closeModal} 
            trainer={editingItem}
            isEdit={!!editingItem}
          />
        )}
        {modalType === 'cleaning' && (
          <CleaningStaffForm 
            onSuccess={closeModal} 
            staff={editingItem}
            isEdit={!!editingItem}
          />
        )}
        {modalType === 'plan' && (
          <PlanForm 
            onSuccess={closeModal} 
            plan={editingItem}
            isEdit={!!editingItem}
          />
        )}
      </MobileModal>

      {/* Delete Confirmation Modal */}
      <MobileModal
        isOpen={showDeleteConfirm.show}
        onClose={() => setShowDeleteConfirm({show: false, item: null, type: ''})}
        title="Confirmar Eliminación"
      >
        <div className="p-4">
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Estás seguro?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Esta acción marcará el registro como inactivo. No se eliminará permanentemente 
              para mantener el historial de operaciones.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm({show: false, item: null, type: ''})}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.item, showDeleteConfirm.type)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </MobileModal>
    </Layout>
  )
}