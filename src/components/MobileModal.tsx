'use client'

import { X } from 'lucide-react'

interface MobileModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'full'
}

export default function MobileModal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md' 
}: MobileModalProps) {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-h-[60vh]',
    md: 'max-h-[80vh]',
    lg: 'max-h-[90vh]',
    full: 'h-full'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className={`relative bg-white w-full max-w-[420px] rounded-t-2xl shadow-2xl ${sizeClasses[size]} ${size === 'full' ? '' : 'mb-16'} overflow-hidden`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}