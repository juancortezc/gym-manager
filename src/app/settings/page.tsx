'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import { Save, Key, Database, Smartphone, Info } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'about'>('general')
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const handlePinChange = async () => {
    if (!currentPin || !newPin || !confirmPin) {
      setMessage('Todos los campos son obligatorios')
      setMessageType('error')
      return
    }

    if (newPin !== confirmPin) {
      setMessage('El nuevo PIN y la confirmación no coinciden')
      setMessageType('error')
      return
    }

    if (!/^\d{4}$/.test(newPin)) {
      setMessage('El PIN debe tener exactamente 4 dígitos')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // First get current user ID from auth
      const authResponse = await fetch('/api/auth/current')
      if (!authResponse.ok) {
        throw new Error('No se pudo obtener el usuario actual')
      }
      const authData = await authResponse.json()
      
      const response = await fetch(`/api/users/${authData.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPin,
          newPin
        })
      })

      if (response.ok) {
        setMessage('✅ PIN actualizado exitosamente')
        setMessageType('success')
        setCurrentPin('')
        setNewPin('')
        setConfirmPin('')
      } else {
        const error = await response.json()
        setMessage(`❌ ${error.error}`)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('❌ Error al actualizar PIN')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Configuración">
      <div className="space-y-6">
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'general', label: 'General', icon: '⚙️' },
            { id: 'security', label: 'Seguridad', icon: '🔒' },
            { id: 'about', label: 'Acerca de', icon: 'ℹ️' },
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

        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Database className="w-5 h-5" />
                Base de Datos
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de la Conexión
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Conectado a Neon Database</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Configuración de Base de Datos
                  </label>
                  <p className="text-sm text-gray-600">
                    Para cambiar la configuración de la base de datos, modifica la variable DATABASE_URL en el archivo .env
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Aplicación Móvil (PWA)
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado PWA
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Configurado y funcionando</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instalación
                  </label>
                  <p className="text-sm text-gray-600">
                    Puedes instalar Gym Manager como aplicación en tu dispositivo móvil o escritorio para acceso rápido y funcionalidad offline.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Key className="w-5 h-5" />
                Cambiar PIN de Acceso
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Actual
                  </label>
                  <input
                    type="password"
                    value={currentPin}
                    onChange={(e) => setCurrentPin(e.target.value)}
                    className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
                    placeholder="••••"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nuevo PIN
                  </label>
                  <input
                    type="password"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
                    placeholder="••••"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nuevo PIN
                  </label>
                  <input
                    type="password"
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
                    placeholder="••••"
                    maxLength={4}
                  />
                </div>
                {message && (
                  <div className={`p-3 rounded-md text-sm ${
                    messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}
                <button 
                  onClick={handlePinChange}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Actualizando...' : 'Actualizar PIN'}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-sm text-yellow-700">
                Asegúrate de recordar tu nuevo PIN. No hay forma de recuperarlo si lo olvidas. 
                Tendrás que restablecer la aplicación desde la base de datos.
              </p>
            </div>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Acerca de Gym Manager
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Sistema de Gestión de Gimnasio</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Versión 1.0.0 - Sistema completo para la gestión de gimnasios
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Características</h4>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Control de miembros y membresías</li>
                    <li>• Gestión de entrenadores y horarios</li>
                    <li>• Control de personal de limpieza</li>
                    <li>• Manejo de caja chica e ingresos/gastos</li>
                    <li>• Sistema de notificaciones</li>
                    <li>• Aplicación móvil (PWA)</li>
                    <li>• Interfaz responsive</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Tecnologías</h4>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    <li>• Next.js 14 con TypeScript</li>
                    <li>• Prisma ORM</li>
                    <li>• Neon Database (PostgreSQL)</li>
                    <li>• Tailwind CSS</li>
                    <li>• Progressive Web App (PWA)</li>
                    <li>• Vercel para deployment</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900">Soporte</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Para soporte técnico o consultas, contacta al administrador del sistema.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-800 mb-2">Backup y Seguridad</h4>
              <p className="text-sm text-blue-700">
                Todos los datos se almacenan de forma segura en Neon Database con backups automáticos. 
                La aplicación utiliza HTTPS y encriptación para proteger la información.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}