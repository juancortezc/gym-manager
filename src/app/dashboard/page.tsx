import Layout from '@/components/Layout'
import { Users, UserCheck, DollarSign, Calendar, Bell } from 'lucide-react'

export default function DashboardPage() {
  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Miembros Activos</p>
              <p className="text-2xl font-bold text-gray-900">248</p>
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
              <p className="text-2xl font-bold text-gray-900">8</p>
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
              <p className="text-2xl font-bold text-gray-900">$350,000</p>
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
              <p className="text-2xl font-bold text-gray-900">42</p>
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
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Membresía de Juan Pérez vence en 2 días
                  </p>
                  <p className="text-xs text-gray-500">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    María González tiene 1 clase restante
                  </p>
                  <p className="text-xs text-gray-500">Hace 1 hora</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Nuevo miembro registrado: Carlos Ruiz
                  </p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>
            </div>
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
                <span className="font-semibold text-green-600">+$125,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Gastos hoy</span>
                <span className="font-semibold text-red-600">-$45,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Nuevos miembros</span>
                <span className="font-semibold text-blue-600">+3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Horas trabajadas</span>
                <span className="font-semibold text-purple-600">16h</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}