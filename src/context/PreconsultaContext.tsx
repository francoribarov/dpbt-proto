import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import type {
  AnswerValue,
  FollowUpCheckIn,
  MediaItem,
  PreconsultaDraft,
  SymptomKey,
  TreatmentPlan,
} from '../types'
import { calculateTriage } from '../lib/triage'
import { buildSummaryText } from '../lib/summary'
import {
  clearAllStorage,
  createEmptyDraft,
  loadDraft,
  loadHistory,
  saveDraft,
  saveHistory,
} from '../lib/storage'
import { buildRecommendations } from '../lib/recommendations'
import { createDefaultFollowUps } from '../lib/followup'
import { createEmptyTreatmentPlan } from '../lib/treatmentPlan'

type PreconsultaContextShape = {
  draft: PreconsultaDraft
  history: PreconsultaDraft[]
  setSymptom: (symptom: SymptomKey) => void
  updateAnswer: (questionId: string, value: AnswerValue) => void
  addMedia: (items: MediaItem[]) => void
  removeMedia: (mediaId: string) => void
  resetDraft: () => void
  finalizeSummary: () => { summary: string; level: 'verde' | 'amarillo' | 'rojo' }
  createFollowUpPlan: (entryId?: string) => FollowUpCheckIn[]
  updateFollowUp: (entryId: string, checkId: string, payload: Partial<FollowUpCheckIn>) => void
  updateTreatmentPlan: (entryId: string, plan: TreatmentPlan) => void
  setDraft: (draft: PreconsultaDraft) => void
  clearAll: () => void
}

const PreconsultaContext = createContext<PreconsultaContextShape | undefined>(undefined)

export const PreconsultaProvider = ({ children }: PropsWithChildren) => {
  const [draft, setDraft] = useState<PreconsultaDraft>(() => loadDraft())
  const [history, setHistory] = useState<PreconsultaDraft[]>(() => loadHistory())

  useEffect(() => {
    saveDraft(draft)
  }, [draft])

  useEffect(() => {
    saveHistory(history)
  }, [history])

  const upsertHistory = (entry: PreconsultaDraft, insertIfMissing = true) => {
    setHistory((prev) => {
      const updated = [...prev]
      const index = updated.findIndex((item) => item.id === entry.id)
      if (index >= 0) {
        updated[index] = entry
      } else if (insertIfMissing) {
        updated.unshift(entry)
      }
      return updated
    })
  }

  const setSymptom = (symptom: SymptomKey) => {
    setDraft((prev) => ({
      ...prev,
      symptom,
      answers: prev.symptom === symptom ? prev.answers : {},
      triage: null,
      summaryText: null,
      recommendations: null,
      followUps: [],
      treatmentPlan: createEmptyTreatmentPlan(),
    }))
  }

  const updateAnswer = (questionId: string, value: AnswerValue) => {
    setDraft((prev) => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
      triage: null,
      summaryText: null,
    }))
  }

  const addMedia = (items: MediaItem[]) => {
    setDraft((prev) => ({
      ...prev,
      media: [...prev.media, ...items],
    }))
  }

  const removeMedia = (mediaId: string) => {
    setDraft((prev) => ({
      ...prev,
      media: prev.media.filter((item) => item.id !== mediaId),
    }))
  }

  const resetDraft = () => {
    setDraft(createEmptyDraft())
  }

  const finalizeSummary = () => {
    const triage = calculateTriage(draft)
    const recommendations = draft.symptom ? buildRecommendations(draft.symptom, triage.level) : null
    const completed: PreconsultaDraft = {
      ...draft,
      triage: triage.level,
      summaryText: buildSummaryText({ ...draft, triage: triage.level }, triage),
      recommendations,
    }
    setDraft(completed)
    upsertHistory(completed)
    return { summary: completed.summaryText ?? '', level: triage.level }
  }

  const findEntryById = (entryId?: string): PreconsultaDraft | null => {
    if (!entryId || entryId === draft.id) return draft
    return history.find((h) => h.id === entryId) ?? null
  }

  const createFollowUpPlan = (entryId?: string) => {
    const target = findEntryById(entryId)
    if (!target) return []
    const existing = target.followUps.length ? target.followUps : createDefaultFollowUps()
    const updated: PreconsultaDraft = { ...target, followUps: existing }
    if (updated.id === draft.id) setDraft(updated)
    upsertHistory(updated, true)
    return existing
  }

  const updateFollowUp = (entryId: string, checkId: string, payload: Partial<FollowUpCheckIn>) => {
    const target = findEntryById(entryId)
    if (!target) return
    const updated: PreconsultaDraft = {
      ...target,
      followUps: target.followUps.map((c) => (c.id === checkId ? { ...c, ...payload } : c)),
    }
    if (updated.id === draft.id) setDraft(updated)
    upsertHistory(updated, true)
  }

  const updateTreatmentPlan = (entryId: string, plan: TreatmentPlan) => {
    const target = findEntryById(entryId)
    if (!target) return
    const updated: PreconsultaDraft = { ...target, treatmentPlan: plan }
    if (updated.id === draft.id) setDraft(updated)
    upsertHistory(updated, true)
  }

  const clearAll = () => {
    clearAllStorage()
    setDraft(createEmptyDraft())
    setHistory([])
  }

  const value = useMemo(
    () => ({
      draft,
      history,
      setSymptom,
      updateAnswer,
      addMedia,
      removeMedia,
      resetDraft,
      finalizeSummary,
      createFollowUpPlan,
      updateFollowUp,
      updateTreatmentPlan,
      setDraft,
      clearAll,
    }),
    [draft, history],
  )

  return <PreconsultaContext.Provider value={value}>{children}</PreconsultaContext.Provider>
}

export const usePreconsulta = () => {
  const ctx = useContext(PreconsultaContext)
  if (!ctx) throw new Error('usePreconsulta debe usarse dentro de PreconsultaProvider')
  return ctx
}
