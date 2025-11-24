import type { FollowUpCheckIn } from '../types'

const makeId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

export const createDefaultFollowUps = (): FollowUpCheckIn[] => {
  const now = Date.now()
  const steps = [
    { label: 'A las 6 horas', offsetHours: 6 },
    { label: 'A las 24 horas', offsetHours: 24 },
    { label: 'A los 3 días', offsetHours: 72 },
  ]
  return steps.map((step) => ({
    id: makeId(),
    scheduledAt: new Date(now + step.offsetHours * 3600 * 1000).toISOString(),
    status: 'pendiente' as const,
    outcome: null,
    notes: '',
  }))
}

export const statusLabel = (status: FollowUpCheckIn['status']) =>
  status === 'completado' ? 'Completado' : 'Pendiente'
