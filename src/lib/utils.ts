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

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'N/A'
    return new Intl.DateFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(dateObj)
  } catch (error) {
    return 'N/A'
  }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'N/A'
    return new Intl.DateFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj)
  } catch (error) {
    return 'N/A'
  }
}

export function calculateHours(startTime: Date | string | null | undefined, endTime: Date | string | null | undefined): number {
  if (!startTime || !endTime) return 0
  try {
    const startObj = typeof startTime === 'string' ? new Date(startTime) : startTime
    const endObj = typeof endTime === 'string' ? new Date(endTime) : endTime
    if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) return 0
    const diffMs = endObj.getTime() - startObj.getTime()
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100
  } catch (error) {
    return 0
  }
}

export function generateMembershipNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `GM-${timestamp.slice(-6)}${random}`
}