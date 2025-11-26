import { getId } from './ids'
import type { TreatmentMedication, TreatmentPlan } from '../types'

export const createEmptyTreatmentPlan = (): TreatmentPlan => ({
  medications: [],
  notes: '',
})

export const createEmptyMedication = (): TreatmentMedication => ({
  id: getId(),
  name: '',
  dose: '',
  frequency: '',
  reminder: '',
  notes: '',
})

export const cloneTreatmentPlan = (plan: TreatmentPlan): TreatmentPlan => ({
  ...plan,
  medications: plan.medications.map((med) => ({ ...med })),
})
