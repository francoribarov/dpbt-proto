import type { PreconsultaDraft } from '../types'
import { createEmptyTreatmentPlan } from './treatmentPlan'
import { getId } from './ids'

const DRAFT_KEY = 'preconsulta-draft'
const HISTORY_KEY = 'preconsulta-history'

export const createEmptyDraft = (): PreconsultaDraft => ({
  id: getId(),
  createdAt: new Date().toISOString(),
  symptom: null,
  answers: {},
  media: [],
  triage: null,
  summaryText: null,
  recommendations: null,
  followUps: [],
  treatmentPlan: createEmptyTreatmentPlan(),
})

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

const normalizeDraft = (draft: PreconsultaDraft): PreconsultaDraft => ({
  ...createEmptyDraft(),
  ...draft,
  recommendations: draft.recommendations ?? null,
  followUps: draft.followUps ?? [],
  treatmentPlan: draft.treatmentPlan ?? createEmptyTreatmentPlan(),
})

export const loadDraft = (): PreconsultaDraft => {
  if (typeof localStorage === 'undefined') return createEmptyDraft()
  const stored = safeParse<PreconsultaDraft | null>(localStorage.getItem(DRAFT_KEY), null)
  return stored ? normalizeDraft(stored) : createEmptyDraft()
}

export const saveDraft = (draft: PreconsultaDraft) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
}

export const loadHistory = (): PreconsultaDraft[] => {
  if (typeof localStorage === 'undefined') return []
  const items = safeParse<PreconsultaDraft[]>(localStorage.getItem(HISTORY_KEY), [])
  return items.map((item) => normalizeDraft(item))
}

export const saveHistory = (items: PreconsultaDraft[]) => {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(HISTORY_KEY, JSON.stringify(items))
}

export const upsertHistoryEntry = (entry: PreconsultaDraft) => {
  const current = loadHistory()
  const existingIndex = current.findIndex((item) => item.id === entry.id)
  if (existingIndex >= 0) {
    current[existingIndex] = entry
  } else {
    current.unshift(entry)
  }
  saveHistory(current)
}

export const clearAllStorage = () => {
  if (typeof localStorage === 'undefined') return
  localStorage.removeItem(DRAFT_KEY)
  localStorage.removeItem(HISTORY_KEY)
}
