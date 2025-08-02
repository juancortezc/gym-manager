'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-3">
          <h3 className="font-semibold text-sm mb-1">Instalar Gym Manager</h3>
          <p className="text-xs opacity-90">
            Instala la aplicación para acceso rápido y funcionalidad offline
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-white hover:text-gray-200 p-1"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleInstall}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 flex items-center gap-1"
        >
          <Download size={14} />
          Instalar
        </button>
        <button
          onClick={handleDismiss}
          className="text-white border border-white px-3 py-1 rounded text-sm hover:bg-white hover:bg-opacity-10"
        >
          Ahora no
        </button>
      </div>
    </div>
  )
}