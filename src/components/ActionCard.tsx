import { LucideIcon } from 'lucide-react'

interface ActionCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: 'blue' | 'green' | 'orange' | 'red'
  onClick: () => void
  className?: string
}

export default function ActionCard({ 
  title, 
  description, 
  icon: Icon, 
  color, 
  onClick, 
  className = '' 
}: ActionCardProps) {
  const colorClasses = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    orange: 'bg-orange-500 text-white',
    red: 'bg-red-600 text-white',
  }

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 rounded-xl ${colorClasses[color]} text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg ${className}`}
    >
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Icon size={24} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-base">{title}</h3>
          <p className="text-sm opacity-90 mt-1">{description}</p>
        </div>
      </div>
    </button>
  )
}