import { PawPrint } from 'lucide-react'
import type { SymptomKey } from '../types'
import { symptomLabels } from '../lib/symptoms'

type Props = {
  symptom: SymptomKey | null
}

export const SymptomPill = ({ symptom }: Props) => {
  if (!symptom) return null
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 shadow-sm">
      <PawPrint className="h-4 w-4 text-gray-600" />
      {symptomLabels[symptom]}
    </span>
  )
}
