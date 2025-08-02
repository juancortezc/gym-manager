import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj)
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

export function calculateHours(startTime: Date | string, endTime: Date | string): number {
  const startObj = typeof startTime === 'string' ? new Date(startTime) : startTime
  const endObj = typeof endTime === 'string' ? new Date(endTime) : endTime
  const diffMs = endObj.getTime() - startObj.getTime()
  return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
}

export function generateMembershipNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `GM-${timestamp.slice(-6)}${random}`
}