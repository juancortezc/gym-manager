'use client'

import { useState } from 'react'
import { Plus, UserPlus, Clock, CreditCard, X } from 'lucide-react'

interface FABProps {
  onAction: (action: string) => void
}

export default function FloatingActionButton({ onAction }: FABProps) {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    {
      id: 'visit',
      icon: UserPlus,
      label: 'Registrar Visita',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 'trainer',
      icon: Clock,
      label: 'Sesión Entrenador',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'cash',
      icon: CreditCard,
      label: 'Transacción',
      color: 'bg-green-500 hover:bg-green-600'
    }
  ]

  const handleAction = (actionId: string) => {
    onAction(actionId)
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Action Items */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 space-y-2 mb-2">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-center space-x-3 animate-in slide-in-from-right duration-200"
            >
              <span className="bg-white text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg border border-gray-100 text-gray-700 whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => handleAction(action.id)}
                className={`w-12 h-12 ${action.color} text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center`}
              >
                <action.icon size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 luxury-gradient text-white rounded-full shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  )
}