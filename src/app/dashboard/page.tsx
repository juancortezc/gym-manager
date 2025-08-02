'use client'

import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Users, UserCheck, DollarSign, Calendar, Bell } from 'lucide-react'

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

  useEffect(() => {
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
          incomeToday: 0, // Will be calculated from today's transactions
          expensesToday: 0, // Will be calculated from today's transactions
          newMembersToday: 0, // Will be calculated from today's new members
          hoursWorkedToday: 0 // Will be calculated from today's sessions
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])
  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Miembros Activos</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.activeMembers}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Entrenadores</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.trainers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Caja</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : `$${stats.cashBalance.toLocaleString()}`}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Visitas Hoy</p>
              <p className="text-2xl font-bold text-gray-900">{loading ? '...' : stats.visitsToday}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-500" />
              Notificaciones
            </h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Cargando notificaciones...</div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No hay notificaciones nuevas
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Resumen de Actividad
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ingresos hoy</span>
                <span className="font-semibold text-green-600">
                  {loading ? '...' : `+$${stats.incomeToday.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gastos hoy</span>
                <span className="font-semibold text-red-600">
                  {loading ? '...' : `-$${stats.expensesToday.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nuevos miembros</span>
                <span className="font-semibold text-blue-600">
                  {loading ? '...' : `+${stats.newMembersToday}`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Horas trabajadas</span>
                <span className="font-semibold text-purple-600">
                  {loading ? '...' : `${stats.hoursWorkedToday}h`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}