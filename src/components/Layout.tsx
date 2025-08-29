'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
// import { useSession, signOut as nextAuthSignOut } from 'next-auth/react' // Disabled until OAuth is configured
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
import FloatingActionButton from './FloatingActionButton'

interface LayoutProps {
  children: React.ReactNode
  title: string
  onQuickAction?: (action: string) => void
}

export default function Layout({ children, title, onQuickAction }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  // const { data: session, status } = useSession() // Disabled until OAuth is configured
  const session = null // Temporary placeholder
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // For now, always use PIN logout until Google OAuth is configured
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      router.push('/login')
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
    <div className="min-h-screen bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <div className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      } transition-all duration-200 ease-out`}>
        <div className="flex flex-col flex-grow bg-white shadow-sm border-r border-gray-100">
          {/* Logo/Header */}
          <div className="flex items-center justify-between h-14 px-3 border-b border-gray-50">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 luxury-gradient rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-bold">GM</span>
                </div>
                <h1 className="text-base font-semibold luxury-text-gradient">
                  Gym Manager
                </h1>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded-md hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600"
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-150 group text-gray-700 hover:text-gray-900`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <item.icon size={18} className={`${item.color} transition-colors`} />
                {!sidebarCollapsed && (
                  <span className="ml-2.5 text-sm font-medium">{item.label}</span>
                )}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-2 border-t border-gray-50">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full ${sidebarCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all duration-150 group`}
              title={sidebarCollapsed ? 'Cerrar Sesión' : undefined}
            >
              <LogOut size={18} className="transition-colors" />
              {!sidebarCollapsed && <span className="ml-2.5 text-sm font-medium">Cerrar Sesión</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-xl">
          <div className="flex items-center justify-between h-14 px-4 border-b border-gray-50">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 luxury-gradient rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">GM</span>
              </div>
              <h1 className="text-base font-semibold luxury-text-gradient">
                Gym Manager
              </h1>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-md hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <nav className="px-3 py-4 space-y-0.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon size={18} className={item.color} />
                <span className="ml-2.5 text-sm font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-50">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2.5 text-red-500 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={18} />
              <span className="ml-2.5 text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`lg:transition-all lg:duration-200 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-50 h-12 flex items-center justify-between px-4 lg:px-5">
          <div className="flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:bg-gray-50 mr-2 text-gray-400 hover:text-gray-600"
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center space-x-3">
              <Link 
                href="/dashboard"
                className="text-lg font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Figures & Fitness
              </Link>
              <span className="hidden sm:block text-gray-300">|</span>
              <h2 className="hidden sm:block text-lg font-semibold text-[var(--luxury-charcoal)]">{title}</h2>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {session?.user && (
              <div className="hidden sm:flex items-center space-x-3">
                {session.user.image && (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'Usuario'} 
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-xs text-gray-600 font-medium">
                  {session.user.name || session.user.email}
                </span>
              </div>
            )}
            <div className="hidden sm:block text-xs text-gray-500 font-medium">
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-3 lg:p-4">
          {children}
        </main>
      </div>

      {/* Floating Action Button */}
      {onQuickAction && <FloatingActionButton onAction={onQuickAction} />}

      <InstallPrompt />
    </div>
  )
}