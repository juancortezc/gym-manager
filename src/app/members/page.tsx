'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import { 
  Plus, Edit, Trash2, User, CreditCard, Calendar, 
  Clock, MapPin, Phone, Mail, Eye, AlertTriangle,
  CheckCircle, XCircle, Users
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

interface MemberVisit {
  id: string
  visitDate: string
  notes: string | null
  member: Member
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [visits, setVisits] = useState<MemberVisit[]>([])
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [showMembershipForm, setShowMembershipForm] = useState(false)
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [showVisitForm, setShowVisitForm] = useState(false)
  const [showMemberDetail, setShowMemberDetail] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'members' | 'plans' | 'visits'>('members')

  const [memberForm, setMemberForm] = useState({
    firstName: '',
    lastName: '',
    gender: 'M',
    phone: '',
    email: '',
  })

  const [planForm, setPlanForm] = useState({
    name: '',
    durationInDays: '',
    classesPerWeek: '',
    totalClasses: '',
    price: '',
  })

  const [membershipForm, setMembershipForm] = useState({
    memberId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Efectivo',
    totalPaid: '',
  })

  const [visitForm, setVisitForm] = useState({
    memberId: '',
    visitDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [membersRes, plansRes, visitsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/plans'),
        fetch(`/api/member-visits?date=${new Date().toISOString().split('T')[0]}`),
      ])

      if (membersRes.ok) {
        const membersData = await membersRes.json()
        setMembers(membersData)
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json()
        setPlans(plansData)
      }

      if (visitsRes.ok) {
        const visitsData = await visitsRes.json()
        setVisits(visitsData)
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
      const url = editingMember ? `/api/members/${editingMember.id}` : '/api/members'
      const method = editingMember ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberForm),
      })

      if (response.ok) {
        await fetchData()
        setShowMemberForm(false)
        setEditingMember(null)
        setMemberForm({ firstName: '', lastName: '', gender: 'M', phone: '', email: '' })
      }
    } catch (error) {
      console.error('Error saving member:', error)
    }
  }

  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingPlan ? `/api/plans/${editingPlan.id}` : '/api/plans'
      const method = editingPlan ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planForm),
      })

      if (response.ok) {
        await fetchData()
        setShowPlanForm(false)
        setEditingPlan(null)
        setPlanForm({ name: '', durationInDays: '', classesPerWeek: '', totalClasses: '', price: '' })
      }
    } catch (error) {
      console.error('Error saving plan:', error)
    }
  }

  const handleMembershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(membershipForm),
      })

      if (response.ok) {
        await fetchData()
        setShowMembershipForm(false)
        setMembershipForm({
          memberId: '',
          planId: '',
          startDate: new Date().toISOString().split('T')[0],
          paymentMethod: 'Efectivo',
          totalPaid: '',
        })
      }
    } catch (error) {
      console.error('Error creating membership:', error)
    }
  }

  const handleVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/member-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitForm),
      })

      if (response.ok) {
        await fetchData()
        setShowVisitForm(false)
        setVisitForm({
          memberId: '',
          visitDate: new Date().toISOString().split('T')[0],
          notes: '',
        })
      } else {
        const error = await response.json()
        alert(error.error)
      }
    } catch (error) {
      console.error('Error registering visit:', error)
    }
  }

  const handleEditMember = (member: Member) => {
    setEditingMember(member)
    setMemberForm({
      firstName: member.firstName,
      lastName: member.lastName,
      gender: member.gender,
      phone: member.phone || '',
      email: member.email || '',
    })
    setShowMemberForm(true)
  }

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan)
    setPlanForm({
      name: plan.name,
      durationInDays: plan.durationInDays.toString(),
      classesPerWeek: plan.classesPerWeek.toString(),
      totalClasses: plan.totalClasses.toString(),
      price: plan.price.toString(),
    })
    setShowPlanForm(true)
  }

  const handleViewMember = async (member: Member) => {
    try {
      const response = await fetch(`/api/members/${member.id}`)
      if (response.ok) {
        const memberData = await response.json()
        setSelectedMember(memberData)
        setShowMemberDetail(true)
      }
    } catch (error) {
      console.error('Error fetching member details:', error)
    }
  }

  const getMembershipStatus = (member: Member) => {
    const activeMembership = member.memberships.find(m => m.active)
    if (!activeMembership) return { status: 'inactive', message: 'Sin membresía' }

    const now = new Date()
    const endDate = new Date(activeMembership.endDate)
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    const remainingClasses = activeMembership.plan.totalClasses - activeMembership.classesUsed

    if (endDate < now) return { status: 'expired', message: 'Vencida' }
    if (daysUntilExpiry <= 3) return { status: 'expiring', message: `Vence en ${daysUntilExpiry} días` }
    if (remainingClasses <= 1) return { status: 'low_classes', message: `${remainingClasses} clases restantes` }
    
    return { status: 'active', message: `${remainingClasses} clases restantes` }
  }

  if (loading) {
    return (
      <Layout title="Control de Miembros">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando...</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Control de Miembros">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'members', label: 'Miembros', icon: '👥' },
            { id: 'plans', label: 'Planes', icon: '📋' },
            { id: 'visits', label: 'Visitas Hoy', icon: '📅' },
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

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Miembros Registrados</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMembershipForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <CreditCard size={20} />
                  Nueva Membresía
                </button>
                <button
                  onClick={() => setShowMemberForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Nuevo Miembro
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => {
                const status = getMembershipStatus(member)
                return (
                  <div key={member.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">#{member.membershipNumber}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewMember(member)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditMember(member)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className={`flex items-center gap-2 p-2 rounded ${
                        status.status === 'active' ? 'bg-green-50 text-green-800' :
                        status.status === 'expiring' || status.status === 'low_classes' ? 'bg-yellow-50 text-yellow-800' :
                        'bg-red-50 text-red-800'
                      }`}>
                        {status.status === 'active' ? <CheckCircle size={16} /> :
                         status.status === 'expiring' || status.status === 'low_classes' ? <AlertTriangle size={16} /> :
                         <XCircle size={16} />}
                        {status.message}
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users size={16} />
                        {member._count.visits} visitas totales
                      </div>
                      
                      {member.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone size={16} />
                          {member.phone}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Plans Tab */}
        {activeTab === 'plans' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Planes Disponibles</h2>
              <button
                onClick={() => setShowPlanForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus size={20} />
                Nuevo Plan
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Duración:</span>
                      <span>{plan.durationInDays} días</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Clases/semana:</span>
                      <span>{plan.classesPerWeek}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total clases:</span>
                      <span>{plan.totalClasses}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600">
                      <span>Precio:</span>
                      <span>{formatCurrency(plan.price)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visits Tab */}
        {activeTab === 'visits' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Visitas de Hoy</h2>
              <button
                onClick={() => setShowVisitForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <MapPin size={20} />
                Registrar Visita
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Miembro
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visits.map((visit) => (
                      <tr key={visit.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {visit.member.firstName} {visit.member.lastName}
                              </div>
                              <div className="text-sm text-gray-500">
                                #{visit.member.membershipNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(visit.visitDate).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {visit.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {visits.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <Calendar size={48} className="mx-auto" />
                  </div>
                  <p className="text-gray-500">No hay visitas registradas hoy</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Member Form Modal */}
      {showMemberForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingMember ? 'Editar Miembro' : 'Nuevo Miembro'}
            </h3>
            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={memberForm.firstName}
                  onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  value={memberForm.lastName}
                  onChange={(e) => setMemberForm({ ...memberForm, lastName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  value={memberForm.gender}
                  onChange={(e) => setMemberForm({ ...memberForm, gender: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                >
                  {editingMember ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMemberForm(false)
                    setEditingMember(null)
                    setMemberForm({ firstName: '', lastName: '', gender: 'M', phone: '', email: '' })
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

      {/* Plan Form Modal */}
      {showPlanForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
            </h3>
            <form onSubmit={handlePlanSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Plan
                </label>
                <input
                  type="text"
                  value={planForm.name}
                  onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duración en Días
                </label>
                <input
                  type="number"
                  value={planForm.durationInDays}
                  onChange={(e) => setPlanForm({ ...planForm, durationInDays: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clases por Semana
                </label>
                <input
                  type="number"
                  value={planForm.classesPerWeek}
                  onChange={(e) => setPlanForm({ ...planForm, classesPerWeek: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Clases
                </label>
                <input
                  type="number"
                  value={planForm.totalClasses}
                  onChange={(e) => setPlanForm({ ...planForm, totalClasses: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (COP)
                </label>
                <input
                  type="number"
                  value={planForm.price}
                  onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
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
                  {editingPlan ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPlanForm(false)
                    setEditingPlan(null)
                    setPlanForm({ name: '', durationInDays: '', classesPerWeek: '', totalClasses: '', price: '' })
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

      {/* Membership Form Modal */}
      {showMembershipForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nueva Membresía</h3>
            <form onSubmit={handleMembershipSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Miembro
                </label>
                <select
                  value={membershipForm.memberId}
                  onChange={(e) => setMembershipForm({ ...membershipForm, memberId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar miembro...</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} - #{member.membershipNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plan
                </label>
                <select
                  value={membershipForm.planId}
                  onChange={(e) => {
                    const selectedPlan = plans.find(p => p.id === e.target.value)
                    setMembershipForm({ 
                      ...membershipForm, 
                      planId: e.target.value,
                      totalPaid: selectedPlan ? selectedPlan.price.toString() : ''
                    })
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={membershipForm.startDate}
                  onChange={(e) => setMembershipForm({ ...membershipForm, startDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Forma de Pago
                </label>
                <select
                  value={membershipForm.paymentMethod}
                  onChange={(e) => setMembershipForm({ ...membershipForm, paymentMethod: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto Pagado (COP)
                </label>
                <input
                  type="number"
                  value={membershipForm.totalPaid}
                  onChange={(e) => setMembershipForm({ ...membershipForm, totalPaid: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Crear Membresía
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMembershipForm(false)
                    setMembershipForm({
                      memberId: '',
                      planId: '',
                      startDate: new Date().toISOString().split('T')[0],
                      paymentMethod: 'Efectivo',
                      totalPaid: '',
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

      {/* Visit Form Modal */}
      {showVisitForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Registrar Visita</h3>
            <form onSubmit={handleVisitSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Miembro
                </label>
                <select
                  value={visitForm.memberId}
                  onChange={(e) => setVisitForm({ ...visitForm, memberId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar miembro...</option>
                  {members.filter(m => {
                    const status = getMembershipStatus(m)
                    return status.status === 'active' || status.status === 'expiring' || status.status === 'low_classes'
                  }).map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} - #{member.membershipNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Visita
                </label>
                <input
                  type="date"
                  value={visitForm.visitDate}
                  onChange={(e) => setVisitForm({ ...visitForm, visitDate: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas (opcional)
                </label>
                <textarea
                  value={visitForm.notes}
                  onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
                >
                  Registrar Visita
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVisitForm(false)
                    setVisitForm({
                      memberId: '',
                      visitDate: new Date().toISOString().split('T')[0],
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

      {/* Member Detail Modal */}
      {showMemberDetail && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {selectedMember.firstName} {selectedMember.lastName}
              </h3>
              <button
                onClick={() => setShowMemberDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Member Info */}
              <div>
                <h4 className="font-semibold mb-3">Información Personal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Número de Membresía:</span>
                    <p className="font-medium">#{selectedMember.membershipNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Género:</span>
                    <p className="font-medium">{selectedMember.gender === 'M' ? 'Masculino' : selectedMember.gender === 'F' ? 'Femenino' : 'Otro'}</p>
                  </div>
                  {selectedMember.phone && (
                    <div>
                      <span className="text-gray-600">Teléfono:</span>
                      <p className="font-medium">{selectedMember.phone}</p>
                    </div>
                  )}
                  {selectedMember.email && (
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <p className="font-medium">{selectedMember.email}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Memberships */}
              <div>
                <h4 className="font-semibold mb-3">Historial de Membresías</h4>
                <div className="space-y-3">
                  {selectedMember.memberships.map((membership) => (
                    <div key={membership.id} className={`p-4 rounded-lg border ${
                      membership.active ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{membership.plan.name}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          membership.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {membership.active ? 'Activa' : 'Inactiva'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span>Inicio:</span> {formatDate(new Date(membership.startDate))}
                        </div>
                        <div>
                          <span>Fin:</span> {formatDate(new Date(membership.endDate))}
                        </div>
                        <div>
                          <span>Clases usadas:</span> {membership.classesUsed}/{membership.plan.totalClasses}
                        </div>
                        <div>
                          <span>Pago:</span> {formatCurrency(membership.totalPaid)} ({membership.paymentMethod})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Visits */}
              <div>
                <h4 className="font-semibold mb-3">Visitas Recientes</h4>
                {selectedMember.visits && selectedMember.visits.length > 0 ? (
                  <div className="space-y-2">
                    {selectedMember.visits.map((visit: any) => (
                      <div key={visit.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm">
                          {formatDate(new Date(visit.visitDate))} - {new Date(visit.visitDate).toLocaleTimeString()}
                        </span>
                        {visit.notes && (
                          <span className="text-sm text-gray-600">{visit.notes}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No hay visitas registradas</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}