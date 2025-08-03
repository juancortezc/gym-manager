'use client'

interface SubTab {
  id: string
  label: string
}

interface SubTabsProps {
  tabs: SubTab[]
  activeTab: string
  onChange: (tabId: string) => void
  className?: string
}

export default function SubTabs({ tabs, activeTab, onChange, className = '' }: SubTabsProps) {
  return (
    <div className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="px-4 py-2">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}