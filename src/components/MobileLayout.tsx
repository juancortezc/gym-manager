'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  Home,
  Users, 
  Zap, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react'

interface MobileLayoutProps {
  children: React.ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const bottomNavItems = [
    { 
      icon: Home, 
      label: 'Inicio', 
      href: '/dashboard',
      active: pathname === '/dashboard' || pathname === '/'
    },
    { 
      icon: Users, 
      label: 'Miembros', 
      href: '/members',
      active: pathname.startsWith('/members')
    },
    { 
      icon: Zap, 
      label: 'Operaciones', 
      href: '/operations',
      active: pathname.startsWith('/operations')
    },
    { 
      icon: Settings, 
      label: 'Config', 
      href: '/config',
      active: pathname.startsWith('/config')
    },
  ]

  return (
    <div className="mobile-container">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">GM</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Gym Manager</h1>
            <p className="text-xs text-gray-500">Sistema de gestión</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowMenu(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 bottom-nav-safe">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {bottomNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                item.active
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} className="mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Safe area for iPhone bottom bar */}
        <div className="h-[calc(env(safe-area-inset-bottom))]" />
      </nav>

      {/* Side Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/30" onClick={() => setShowMenu(false)} />
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Menú</h3>
                <button
                  onClick={() => setShowMenu(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}