'use client'

import { useEffect, useState } from 'react'
import MobileLayout from '@/components/MobileLayout'
import SubTabs from '@/components/SubTabs'
import MobileModal from '@/components/MobileModal'
import { 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  Edit,
  Eye,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Plan {
  id: string
  name: string
  durationInDays: number
  classesPerWeek: number
  totalClasses: number
  price: number
  active: boolean
}

interface Member {
  id: string
  membershipNumber: string
  firstName: string
  lastName: string
  gender: string
  phone: string | null
  email: string | null
  active: boolean
  createdAt: string
  memberships: Membership[]
  visits?: any[]
  _count: {
    visits: number
  }
}

interface Membership {
  id: string
  startDate: string
  endDate: string
  classesUsed: number
  paymentMethod: string
  totalPaid: number
  active: boolean
  plan: Plan
}

export default function MembersPage() {
  const [activeTab, setActiveTab] = useState('list')
  const [members, setMembers] = useState<Member[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState<'new' | 'details' | 'edit' | 'membership'>('new')
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const tabs = [
    { id: 'list', label: 'Lista' },
    { id: 'register', label: 'Registrar' },
    { id: 'memberships', label: 'Membresías' }
  ]

  const [memberForm, setMemberForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'M',
    phone: '',
    email: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Efectivo',
  })

  const [membershipForm, setMembershipForm] = useState({
    memberId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Efectivo',
    totalPaid: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [membersRes, plansRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/plans'),
      ])

      if (membersRes.ok) {
        const membersData = await membersRes.json()
        setMembers(membersData)
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json()
        setPlans(plansData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // If editing member, only update member info (no membership creation)
      if (selectedMember) {
        const response = await fetch(`/api/members/${selectedMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: memberForm.firstName,
            lastName: memberForm.lastName,
            gender: memberForm.gender,
            phone: memberForm.phone,
            email: memberForm.email,
          }),
        })

        if (response.ok) {
          await fetchData()
          closeModal()
        }
      } else {
        // Creating new member
        const memberResponse = await fetch('/api/members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: memberForm.firstName,
            lastName: memberForm.lastName,
            gender: memberForm.gender,
            phone: memberForm.phone,
            email: memberForm.email,
          }),
        })

        if (memberResponse.ok) {
          const newMember = await memberResponse.json()
          
          // If a plan was selected, create membership
          if (memberForm.planId) {
            const plan = plans.find(p => p.id === memberForm.planId)
            if (plan) {
              const startDate = new Date(memberForm.startDate)
              const endDate = new Date(startDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000)
              
              await fetch('/api/memberships', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  memberId: newMember.id,
                  planId: memberForm.planId,
                  startDate: startDate.toISOString(),
                  endDate: endDate.toISOString(),
                  paymentMethod: memberForm.paymentMethod,
                  totalPaid: plan.price,
                })
              })
            }
          }

          await fetchData()
          closeModal()
          // Reset form
          setMemberForm({
            firstName: '',
            lastName: '',
            gender: 'M',
            phone: '',
            email: '',
            planId: '',
            startDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'Efectivo',
          })
        }
      }
    } catch (error) {
      console.error('Error saving member:', error)
    }
  }

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const plan = plans.find(p => p.id === membershipForm.planId)
      if (plan) {
        const startDate = new Date(membershipForm.startDate)
        const endDate = new Date(startDate.getTime() + plan.durationInDays * 24 * 60 * 60 * 1000)
        
        const response = await fetch('/api/memberships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...membershipForm,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalPaid: parseFloat(membershipForm.totalPaid),
          }),
        })

        if (response.ok) {
          await fetchData()
          closeModal()
        }
      }
    } catch (error) {
      console.error('Error creating membership:', error)
    }
  }

  const openModal = (type: 'new' | 'details' | 'edit' | 'membership', member?: Member) => {
    setModalType(type)
    setSelectedMember(member || null)
    
    if (type === 'edit' && member) {
      setMemberForm({
        firstName: member.firstName,
        lastName: member.lastName,
        gender: member.gender,
        phone: member.phone || '',
        email: member.email || '',
      })
    } else if (type === 'new') {
      setMemberForm({
        firstName: '',
        lastName: '',
        gender: 'M',
        phone: '',
        email: '',
        planId: '',
        startDate: new Date().toISOString().split('T')[0],
        paymentMethod: 'Efectivo',
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedMember(null)
    setMemberForm({
      firstName: '',
      lastName: '',
      gender: 'M',
      phone: '',
      email: '',
      planId: '',
      startDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Efectivo',
    })
    setMembershipForm({
      memberId: '',
      planId: '',
      startDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Efectivo',
      totalPaid: '',
    })
  }

  const getMembershipStatus = (member: Member) => {
    const activeMembership = member.memberships.find(m => m.active)
    if (!activeMembership) return { status: 'inactive', message: 'Sin membresía', icon: XCircle, color: 'text-red-500' }

    const now = new Date()
    const endDate = new Date(activeMembership.endDate)
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const remainingClasses = activeMembership.plan.totalClasses - activeMembership.classesUsed

    if (endDate < now) return { status: 'expired', message: 'Vencida', icon: XCircle, color: 'text-red-500' }
    if (daysUntilExpiry <= 3) return { status: 'expiring', message: `Vence en ${daysUntilExpiry} días`, icon: AlertTriangle, color: 'text-yellow-500' }
    if (remainingClasses <= 1) return { status: 'low_classes', message: `${remainingClasses} clases restantes`, icon: AlertTriangle, color: 'text-yellow-500' }
    
    return { status: 'active', message: `${remainingClasses} clases restantes`, icon: CheckCircle, color: 'text-green-500' }
  }

  const filteredMembers = members.filter(member =>
    `${member.firstName} ${member.lastName} ${member.membershipNumber}`.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewMemberDetails = async (member: Member) => {
    try {
      const response = await fetch(`/api/members/${member.id}`)
      if (response.ok) {
        const memberData = await response.json()
        setSelectedMember(memberData)
        openModal('details', memberData)
      }
    } catch (error) {
      console.error('Error fetching member details:', error)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'list':
        return (
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar miembros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            {/* Members List */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Cargando miembros...</p>
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No hay miembros registrados</p>
                  <button
                    onClick={() => openModal('new')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    Registrar primer miembro
                  </button>
                </div>
              ) : (
                filteredMembers.map((member) => {
                  const status = getMembershipStatus(member)
                  return (
                    <div key={member.id} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base">
                            {member.firstName} {member.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">#{member.membershipNumber}</p>
                          
                          {/* Status */}
                          <div className={`flex items-center text-xs ${status.color} mb-2`}>
                            <status.icon size={14} className="mr-1" />
                            {status.message}
                          </div>
                          
                          {/* Contact Info */}
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            {member.phone && (
                              <div className="flex items-center">
                                <Phone size={12} className="mr-1" />
                                {member.phone}
                              </div>
                            )}
                            {member.email && (
                              <div className="flex items-center">
                                <Mail size={12} className="mr-1" />
                                {member.email}
                              </div>
                            )}
                            <div>{member._count.visits} visitas</div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex space-x-2 ml-3">
                          <button
                            onClick={() => handleViewMemberDetails(member)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openModal('edit', member)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )
      
      case 'register':
        return (
          <div className="p-4">
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  value={memberForm.firstName}
                  onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                <input
                  type="text"
                  value={memberForm.lastName}
                  onChange={(e) => setMemberForm({ ...memberForm, lastName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Género</label>
                <select
                  value={memberForm.gender}
                  onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono (opcional)</label>
                <input
                  type="tel"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (opcional)</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-semibold mb-3 text-gray-700">Membresía (opcional)</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                  <select
                    value={memberForm.planId}
                    onChange={(e) => setMemberForm({ ...memberForm, planId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Sin plan (solo crear miembro)</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {formatCurrency(plan.price)} ({plan.totalClasses} clases, {plan.durationInDays} días)
                      </option>
                    ))}
                  </select>
                </div>

                {memberForm.planId && (
                  <>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                      <input
                        type="date"
                        value={memberForm.startDate}
                        onChange={(e) => setMemberForm({ ...memberForm, startDate: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pago</label>
                      <select
                        value={memberForm.paymentMethod}
                        onChange={(e) => setMemberForm({ ...memberForm, paymentMethod: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="Efectivo">Efectivo</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Transferencia">Transferencia</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                {memberForm.planId ? 'Registrar Miembro con Membresía' : 'Registrar Miembro'}
              </button>
            </form>
          </div>
        )
      
      case 'memberships':
        return (
          <div className="p-4">
            <div className="mb-4">
              <button
                onClick={() => openModal('membership')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Nueva Membresía
              </button>
            </div>
            
            <div className="space-y-3">
              {members.filter(m => m.memberships.length > 0).map(member => (
                <div key={member.id} className="bg-white rounded-xl p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {member.firstName} {member.lastName}
                  </h3>
                  {member.memberships.map(membership => (
                    <div key={membership.id} className={`p-3 rounded-lg border mb-2 ${
                      membership.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{membership.plan.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          membership.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {membership.active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        <div>Clases: {membership.classesUsed}/{membership.plan.totalClasses}</div>
                        <div>Vence: {formatDate(new Date(membership.endDate))}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
          modalType === 'new' ? 'Nuevo Miembro' :
          modalType === 'edit' ? 'Editar Miembro' :
          modalType === 'membership' ? 'Nueva Membresía' :
          'Detalles del Miembro'
        }
        size={modalType === 'details' ? 'lg' : 'md'}
      >
        {modalType === 'membership' && (
          <div className="p-4">
            <form onSubmit={handleMembershipSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Miembro</label>
                <select
                  value={membershipForm.memberId}
                  onChange={(e) => setMembershipForm({ ...membershipForm, memberId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar miembro...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                <select
                  value={membershipForm.planId}
                  onChange={(e) => {
                    const plan = plans.find(p => p.id === e.target.value)
                    setMembershipForm({ 
                      ...membershipForm, 
                      planId: e.target.value,
                      totalPaid: plan ? plan.price.toString() : ''
                    })
                  }}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccionar plan...</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {formatCurrency(plan.price)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
                <input
                  type="date"
                  value={membershipForm.startDate}
                  onChange={(e) => setMembershipForm({ ...membershipForm, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pago</label>
                <select
                  value={membershipForm.paymentMethod}
                  onChange={(e) => setMembershipForm({ ...membershipForm, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monto Pagado</label>
                <input
                  type="number"
                  value={membershipForm.totalPaid}
                  onChange={(e) => setMembershipForm({ ...membershipForm, totalPaid: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors"
              >
                Crear Membresía
              </button>
            </form>
          </div>
        )}

        {modalType === 'details' && selectedMember && (
          <div className="p-4">
            <div className="space-y-4">
              {/* Member Info */}
              <div>
                <h4 className="font-semibold mb-2">Información Personal</h4>
                <div className="text-sm space-y-1 text-gray-600">
                  <div>Número: #{selectedMember.membershipNumber}</div>
                  <div>Género: {selectedMember.gender === 'M' ? 'Masculino' : selectedMember.gender === 'F' ? 'Femenino' : 'Otro'}</div>
                  {selectedMember.phone && <div>Teléfono: {selectedMember.phone}</div>}
                  {selectedMember.email && <div>Email: {selectedMember.email}</div>}
                </div>
              </div>

              {/* Memberships */}
              <div>
                <h4 className="font-semibold mb-2">Membresías</h4>
                <div className="space-y-2">
                  {selectedMember.memberships.map((membership) => (
                    <div key={membership.id} className={`p-3 rounded-lg border text-sm ${
                      membership.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{membership.plan.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          membership.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {membership.active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div>Período: {formatDate(new Date(membership.startDate))} - {formatDate(new Date(membership.endDate))}</div>
                        <div>Clases: {membership.classesUsed}/{membership.plan.totalClasses}</div>
                        <div>Pagado: {formatCurrency(membership.totalPaid)} ({membership.paymentMethod})</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Visits */}
              {selectedMember.visits && (
                <div>
                  <h4 className="font-semibold mb-2">Visitas Recientes</h4>
                  {selectedMember.visits.length > 0 ? (
                    <div className="space-y-2">
                      {selectedMember.visits.slice(0, 5).map((visit: any) => (
                        <div key={visit.id} className="flex justify-between items-center p-2 bg-gray-50 rounded text-sm">
                          <span>{formatDate(new Date(visit.visitDate))}</span>
                          <span className="text-gray-500">{new Date(visit.visitDate).toLocaleTimeString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No hay visitas registradas</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </MobileModal>
    </MobileLayout>
  )
}