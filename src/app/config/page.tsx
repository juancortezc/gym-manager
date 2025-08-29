'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import SubTabs from '@/components/SubTabs'
import { Save, Key, Database, Smartphone, Info, Lock, ExternalLink, Shield } from 'lucide-react'

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState('about')
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

  const tabs = [
    { id: 'about', label: 'Acerca de' },
    { id: 'security', label: 'Seguridad' },
    { id: 'auth', label: 'Autenticación' },
    { id: 'general', label: 'General' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <div className="p-4 space-y-6">
            {/* System Information Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-bold">Información del Sistema</h3>
              </div>
              <p className="text-lg mb-2">
                Sistema Diseñado y Desarrollado por <span className="font-bold text-yellow-400">Black Mamba</span>
              </p>
              <p className="text-base text-gray-300">
                Para uso exclusivo de <span className="font-semibold">Paula Cortez</span>
              </p>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  Versión 1.0.0 • © 2025 Black Mamba Development
                </p>
              </div>
            </div>

            {/* System Features */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-600" />
                Características del Sistema
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Gestión completa de miembros y membresías</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Control de horas de entrenadores y personal de limpieza</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Administración de caja chica con reportes detallados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Reportes mensuales con exportación a PDF</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Sistema de autenticación seguro con PIN</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>Interfaz optimizada para móviles (PWA)</span>
                </li>
              </ul>
            </div>
          </div>
        )
      
      case 'auth':
        return (
          <div className="p-4 space-y-6">
            {/* Current Authentication Method */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-600" />
                Método de Autenticación Actual
              </h3>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-sm text-green-800 font-medium mb-1">
                  Autenticación con PIN activada
                </p>
                <p className="text-xs text-green-600">
                  El sistema está protegido con un PIN de 4 dígitos
                </p>
              </div>
            </div>

            {/* Google OAuth Configuration */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                Configuración de Google OAuth
              </h3>
              
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mb-4">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  Google Sign-In no está configurado
                </p>
                <p className="text-xs text-yellow-600">
                  Para habilitar el inicio de sesión con Google, configura las siguientes variables de entorno:
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Client ID
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md font-mono text-xs text-gray-600">
                    GOOGLE_CLIENT_ID=tu-client-id.apps.googleusercontent.com
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Google Client Secret
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md font-mono text-xs text-gray-600">
                    GOOGLE_CLIENT_SECRET=tu-client-secret
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Callback URL para Google Console
                  </label>
                  <div className="bg-gray-50 p-3 rounded-md font-mono text-xs text-gray-600">
                    https://tu-dominio.com/api/auth/callback/google
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Configurar en Google Cloud Console
                </a>
              </div>
            </div>

            {/* NextAuth Status */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">
                Estado de NextAuth
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  NextAuth está instalado pero temporalmente deshabilitado hasta que se configuren las credenciales de OAuth.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Una vez configuradas las variables de entorno, el sistema permitirá inicio de sesión con Google automáticamente.
                </p>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
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
        )

      case 'general':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
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

            <div className="bg-white rounded-xl p-6 border border-gray-200">
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

    </Layout>
  )
}