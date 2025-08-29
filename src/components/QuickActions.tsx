import { LucideIcon } from 'lucide-react'

interface QuickAction {
  id: string
  label: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'orange' | 'gray' | 'purple' | 'yellow'
  onClick: () => void
}

interface QuickActionsProps {
  actions: QuickAction[]
  className?: string
}

export default function QuickActions({ actions, className = '' }: QuickActionsProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  }

  return (
    <div className={`bg-white p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-4">Operaciones</h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className={`p-3 rounded-xl ${colorClasses[action.color]}`}>
              <action.icon size={20} />
            </div>
            <span className="text-xs font-medium text-gray-700 text-center leading-tight">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}