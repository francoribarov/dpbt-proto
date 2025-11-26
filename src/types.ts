export type SymptomKey = 'picazon' | 'letargo' | 'vomitos' | 'dolor_caminar'

export type MediaItem = {
  id: string
  kind: 'foto' | 'video'
  name: string
  sizeKB: number
}

export type AnswerValue = string | number

export type Recommendation = {
  cuidados: string[]
  medicacion: string[]
  urgente: string[]
}

export type TreatmentMedication = {
  id: string
  name: string
  dose: string
  frequency: string
  reminder: string
  notes: string
}

export type TreatmentPlan = {
  medications: TreatmentMedication[]
  notes: string
}

export type FollowUpCheckIn = {
  id: string
  scheduledAt: string
  status: 'pendiente' | 'completado'
  outcome: 'mejor' | 'igual' | 'peor' | null
  notes: string
}

export type PreconsultaDraft = {
  id: string
  createdAt: string
  symptom: SymptomKey | null
  answers: Record<string, AnswerValue>
  media: MediaItem[]
  triage: 'verde' | 'amarillo' | 'rojo' | null
  summaryText: string | null
  recommendations: Recommendation | null
  followUps: FollowUpCheckIn[]
  treatmentPlan: TreatmentPlan
}

export type SymptomOption = {
  key: SymptomKey
  label: string
  description?: string
}
