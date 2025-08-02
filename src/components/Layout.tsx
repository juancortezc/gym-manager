'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard,
  Users, 
  UserCheck, 
  DollarSign, 
  Brush,
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import InstallPrompt from './InstallPrompt'

interface LayoutProps {
  children: React.ReactNode
  title: string
}

export default function Layout({ children, title }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', color: 'text-blue-600' },
    { icon: Users, label: 'Miembros', href: '/members', color: 'text-emerald-600' },
    { icon: UserCheck, label: 'Entrenadores', href: '/trainers', color: 'text-purple-600' },
    { icon: Brush, label: 'Limpieza', href: '/cleaning', color: 'text-orange-600' },
    { icon: DollarSign, label: 'Caja', href: '/cash', color: 'text-green-600' },
    { icon: Settings, label: 'Configuración', href: '/settings', color: 'text-gray-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'
      } transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col flex-grow bg-white/80 backdrop-blur-xl shadow-xl border-r border-white/20">
          {/* Logo/Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200/50">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">GM</span>
                </div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Gym Manager
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl hover:bg-white/60 transition-all duration-200 group`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon size={20} className={`${item.color} group-hover:scale-110 transition-transform`} />
                {!sidebarCollapsed && (
                  <span className="ml-3 text-gray-700 font-medium">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-gray-200/50">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full ${sidebarCollapsed ? 'justify-center px-3' : 'px-4'} py-3 text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group`}
              title={sidebarCollapsed ? 'Cerrar Sesión' : undefined}
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              {!sidebarCollapsed && <span className="ml-3 font-medium">Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl">
          <div className="flex items-center justify-between h-16 px-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">GM</span>
              </div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gym Manager
              </h1>
            </div>
            <button onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <nav className="px-3 py-6 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={20} className={item.color} />
                <span className="ml-3 text-gray-700 font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="ml-3 font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:transition-all lg:duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'}`}>
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20 h-16 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-3"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block text-sm text-gray-500">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      <InstallPrompt />
    </div>
  )
}